import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Check, Clock3, Edit3, Plus, Save, X } from "lucide-react";

import { useUserMode } from "../../context/useUserMode";
import { getApiMessage, getPaginatedItems } from "../../services/apiClient";
import { getConversationMessages, getConversations, sendMessage } from "../../services/messageService";
import {
  cancelService,
  completeService,
  createService,
  getClientServices,
  getService,
  updateService,
  validateService,
} from "../../services/serviceService";

const storedServiceKey = "fya-conversation-service-ids";
const seenServiceActionsKey = "fya-seen-service-action-ids";

const statusLabels = {
  en_attente: "En attente",
  en_cours: "En cours",
  terminer: "Terminé",
  annule: "Annulé",
};

const statusStyles = {
  en_attente: "bg-[#FFF4DF] text-[#A15C00]",
  en_cours: "bg-[#E9F3FF] text-[#145DA0]",
  terminer: "bg-[#E8F7E9] text-[#267A39]",
  annule: "bg-[#FDECEC] text-[#B42318]",
};

const emptyForm = {
  title: "",
  description: "",
  amount: "",
  duration: "",
};

const asArray = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.data)) return value.data;
  if (Array.isArray(value?.services)) return value.services;
  if (Array.isArray(value?.services?.data)) return value.services.data;
  return getPaginatedItems(value);
};

const getServiceFromPayload = (payload) => payload?.service || payload?.data?.service || payload?.data || payload;

const readStoredServiceIds = (conversationId) => {
  try {
    const store = JSON.parse(localStorage.getItem(storedServiceKey) || "{}");
    return Array.isArray(store[conversationId]) ? store[conversationId] : [];
  } catch {
    return [];
  }
};

const rememberServiceId = (conversationId, serviceId) => {
  if (!conversationId || !serviceId) return;
  try {
    const store = JSON.parse(localStorage.getItem(storedServiceKey) || "{}");
    const ids = new Set([...(store[conversationId] || []), serviceId]);
    localStorage.setItem(storedServiceKey, JSON.stringify({ ...store, [conversationId]: Array.from(ids) }));
  } catch {
    // The backend remains the source of truth; local storage only helps reload services without a list endpoint.
  }
};

const readSeenServiceActions = () => {
  try {
    return JSON.parse(localStorage.getItem(seenServiceActionsKey) || "[]").map(String);
  } catch {
    return [];
  }
};

const writeSeenServiceActions = (items) => {
  localStorage.setItem(seenServiceActionsKey, JSON.stringify(Array.from(new Set(items.map(String))).slice(0, 300)));
};

const normalizeService = (service) => {
  if (!service?.id) return null;
  const status = service.statut || service.status || "en_attente";
  const message = service.message || {};
  const clientUser = service.client?.user || service.client_user || {};
  const artisanUser = service.artisan?.user || service.artisan_user || {};

  return {
    ...service,
    id: service.id,
    title: service.titre || service.title || "Service",
    description: service.description || "",
    amount: service.montant ?? service.amount ?? "",
    duration: service.duree_service || service.duration || "",
    status,
    conversationId: message.conversation_id || service.conversation_id,
    messageId: service.message_id || message.id,
    clientId: service.client_id || service.client?.id,
    clientUserId: clientUser.id || service.client?.user_id,
    clientName: clientUser.name || "Client",
    artisanId: service.artisan_id || service.artisan?.id,
    artisanUserId: artisanUser.id || service.artisan?.user_id,
    artisanName: artisanUser.name || "Artisan",
    createdAt: service.created_at ? new Date(service.created_at).toLocaleDateString("fr-FR") : "-",
    acceptedAt: service.client_valide_at ? new Date(service.client_valide_at).toLocaleDateString("fr-FR") : "-",
    artisanCompletedAt: service.artisan_termine_at ? new Date(service.artisan_termine_at).toLocaleDateString("fr-FR") : "",
    clientCompletedAt: service.client_termine_at ? new Date(service.client_termine_at).toLocaleDateString("fr-FR") : "",
    completedAt: service.updated_at ? new Date(service.updated_at).toLocaleDateString("fr-FR") : "-",
  };
};

const getUserClientId = (user) => user?.client?.id || user?.clients?.id || user?.client_id || user?.clientId;
const getUserArtisanId = (user) => user?.artisan?.id || user?.artisan_id || user?.artisanId;
const getParticipantClientId = (participant) =>
  participant?.client?.id || participant?.clients?.id || participant?.client_id || participant?.clientId;

export default function ConversationService() {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const { user, isArtisan } = useUserMode();
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [services, setServices] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [seenServiceActions, setSeenServiceActions] = useState(() => readSeenServiceActions());

  const currentUserId = user?.id;
  const currentArtisanId = getUserArtisanId(user);
  const currentConversationUser = useMemo(
    () => (conversation?.users || []).find((item) => Number(item.id) === Number(currentUserId)) || null,
    [conversation, currentUserId]
  );
  const currentClientId = getUserClientId(user) || getParticipantClientId(currentConversationUser);
  const otherUser = useMemo(
    () => (conversation?.users || []).find((item) => Number(item.id) !== Number(currentUserId)) || null,
    [conversation, currentUserId]
  );
  const otherClientId = getParticipantClientId(otherUser);
  const activeService = services[0];

  const currentUserCanCreate = isArtisan;

  const loadServices = useCallback(async () => {
    if (!conversationId) return;
    setError("");

    const nextServices = [];
    const mergeService = (rawService) => {
      const normalized = normalizeService(rawService);
      if (!normalized) return;
      if (normalized.conversationId && String(normalized.conversationId) !== String(conversationId)) return;
      if (!nextServices.some((item) => String(item.id) === String(normalized.id))) {
        nextServices.push(normalized);
      }
    };

    try {
      const [conversationsPayload, messagesPayload] = await Promise.all([
        getConversations(),
        getConversationMessages(conversationId),
      ]);
      const conversationItems = asArray(conversationsPayload);
      const activeConversation = conversationItems.find((item) => String(item.id) === String(conversationId)) || null;
      const activeConversationUser = (activeConversation?.users || []).find((item) => Number(item.id) === Number(user?.id)) || null;
      const effectiveClientId = getUserClientId(user) || getParticipantClientId(activeConversationUser);

      setConversation(activeConversation);
      setMessages(asArray(messagesPayload));

      await Promise.all(
        readStoredServiceIds(conversationId).map(async (serviceId) => {
          try {
            const payload = await getService(serviceId);
            mergeService(getServiceFromPayload(payload));
          } catch {
            return null;
          }
          return null;
        })
      );

      if (effectiveClientId) {
        try {
          const payload = await getClientServices(effectiveClientId);
          asArray(payload).forEach(mergeService);
        } catch {
          // The current user may not have a client row in older data.
        }
      }

      nextServices.sort((first, second) => new Date(second.created_at || 0) - new Date(first.created_at || 0));
      setServices(nextServices);
    } catch (loadError) {
      setError(getApiMessage(loadError, "Impossible de charger les services de cette conversation."));
    } finally {
      setLoading(false);
    }
  }, [conversationId, user]);

  useEffect(() => {
    const initialTimerId = window.setTimeout(() => {
      loadServices();
    }, 0);
    const timerId = window.setInterval(() => {
      loadServices();
    }, 3500);

    return () => {
      window.clearTimeout(initialTimerId);
      window.clearInterval(timerId);
    };
  }, [loadServices]);

  const validateForm = () => {
    const errors = {};
    const amount = String(form.amount).trim().replace(/\s/g, "");

    if (form.title.trim().length < 3) errors.title = "Le titre doit contenir au moins 3 caractères";
    if (form.description.trim().length < 10) errors.description = "La description doit contenir au moins 10 caractères";
    if (!amount) errors.amount = "Veuillez saisir le montant";
    if (amount && !/^\d+(\.\d+)?$/.test(amount)) errors.amount = "Veuillez saisir un montant valide";
    if (form.duration.trim().length < 2) errors.duration = "Veuillez saisir la durée";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const beginEdit = (service) => {
    setEditingId(service.id);
    setShowForm(true);
    setForm({
      title: service.title,
      description: service.description,
      amount: String(service.amount || ""),
      duration: service.duration,
    });
    setFormErrors({});
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
    setFormErrors({});
  };

  const submitService = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;
    if (!otherClientId) {
      setError("Impossible d'identifier le client de cette conversation. Le backend doit retourner la relation client de l'interlocuteur dans la messagerie.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      let messageId = messages[messages.length - 1]?.id;

      if (!messageId) {
        const introPayload = await sendMessage(conversationId, {
          content: `Proposition de service : ${form.title.trim()}`,
          media: [],
        });
        messageId = introPayload?.message?.id || introPayload?.data?.id || introPayload?.id;
      }

      const payload = editingId
        ? await updateService(editingId, {
            ...form,
            amount: String(form.amount).replace(/\s/g, ""),
          })
        : await createService({
            ...form,
            amount: String(form.amount).replace(/\s/g, ""),
            clientId: otherClientId,
            messageId,
          });
      const nextService = normalizeService(getServiceFromPayload(payload));

      if (nextService) {
        rememberServiceId(conversationId, nextService.id);
        setServices((current) => {
          const withoutUpdated = current.filter((item) => String(item.id) !== String(nextService.id));
          return [nextService, ...withoutUpdated];
        });
      }

      cancelForm();
    } catch (submitError) {
      setError(getApiMessage(submitError, "Impossible d'enregistrer ce service."));
    } finally {
      setSaving(false);
    }
  };

  const runServiceAction = async (service, action) => {
    setError("");
    try {
      const payload = action === "validate"
        ? await validateService(service.id)
        : action === "cancel"
          ? await cancelService(service.id)
          : await completeService(service.id);
      const nextService = normalizeService(getServiceFromPayload(payload));

      if (nextService) {
        rememberServiceId(conversationId, nextService.id);
        setServices((current) => current.map((item) => (String(item.id) === String(nextService.id) ? nextService : item)));
      }

      if (action === "complete") {
        navigate(`/messages/${conversationId}/service/${service.id}/avis`);
      }
    } catch (actionError) {
      setError(getApiMessage(actionError, "Action impossible sur ce service."));
    }
  };

  const markServiceActionSeen = (service) => {
    const actionId = getServiceActionId(service, currentUserId, currentClientId, currentArtisanId);
    if (!actionId || seenServiceActions.includes(actionId)) return;

    const nextItems = [...seenServiceActions, actionId];
    setSeenServiceActions(nextItems);
    writeSeenServiceActions(nextItems);
  };

  return (
    <div className="min-h-screen bg-[#F8F5F1] px-0 pb-10 pt-24 text-[#182433] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Link
          to={`/messages/${conversationId}`}
          className="mb-4 inline-flex items-center gap-2 px-4 text-sm font-extrabold text-[#145DA0] sm:px-0"
        >
          <ArrowLeft size={17} />
          Retour à la messagerie
        </Link>

        <section className="rounded-none border-y border-[#eadfd3] bg-white p-5 shadow-sm sm:rounded-xl sm:border sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-extrabold">Services</h1>
              <p className="mt-1 text-sm font-semibold text-gray-500">
                Conversation avec {otherUser?.name || conversation?.title || "votre interlocuteur"}
              </p>
            </div>
            {currentUserCanCreate && (
              <button
                type="button"
                onClick={() => {
                  setShowForm((current) => !current);
                  setEditingId(null);
                  setForm(emptyForm);
                }}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#145DA0] px-4 text-sm font-extrabold text-white transition hover:bg-[#0f4b82]"
              >
                <Plus size={17} />
                Ajouter un service
              </button>
            )}
          </div>

          {error && (
            <div className="mt-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700">
              {error}
            </div>
          )}

          {showForm && (
            <form onSubmit={submitService} className="mt-5 rounded-lg border border-[#d9e6f4] bg-[#f6fbff] p-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Titre du service" value={form.title} error={formErrors.title} onChange={(value) => setForm({ ...form, title: value })} />
                <Field label="Montant" value={form.amount} error={formErrors.amount} onChange={(value) => setForm({ ...form, amount: value })} suffix="FCFA" />
                <Field label="Durée" value={form.duration} error={formErrors.duration} onChange={(value) => setForm({ ...form, duration: value })} />
                <label className="sm:col-span-2">
                  <span className="mb-2 block text-sm font-extrabold">Description</span>
                  <textarea
                    value={form.description}
                    onChange={(event) => setForm({ ...form, description: event.target.value })}
                    rows={4}
                    className={`w-full resize-none rounded-lg border bg-white px-4 py-3 text-sm font-semibold outline-none ${
                      formErrors.description ? "border-red-500" : "border-[#eadfd3] focus:border-[#145DA0]"
                    }`}
                  />
                  {formErrors.description && <p className="mt-1 text-xs font-bold text-red-600">{formErrors.description}</p>}
                </label>
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                <button disabled={saving} className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#145DA0] px-5 text-sm font-extrabold text-white disabled:opacity-60">
                  {editingId ? <Save size={17} /> : <Plus size={17} />}
                  {saving ? "Enregistrement..." : editingId ? "Modifier le service" : "Proposer le service"}
                </button>
                <button
                  type="button"
                  onClick={cancelForm}
                  className="min-h-11 rounded-lg border border-[#eadfd3] px-5 text-sm font-extrabold"
                >
                  Annuler
                </button>
              </div>
            </form>
          )}

          <div className="mt-5 space-y-4">
            {loading && (
              <div className="rounded-lg border border-[#eadfd3] bg-[#fbfaf8] p-6 text-sm font-bold text-gray-500">
                Chargement des services...
              </div>
            )}

            {!loading && services.length === 0 && (
              <div className="rounded-lg border border-dashed border-[#d7cabd] bg-[#fbfaf8] p-6 text-sm font-bold text-gray-500">
                Aucun service n'a encore été proposé dans cette conversation.
              </div>
            )}

            {services.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                currentUserId={currentUserId}
                currentClientId={currentClientId}
                currentArtisanId={currentArtisanId}
                seenServiceActions={seenServiceActions}
                onMarkSeen={() => markServiceActionSeen(service)}
                onEdit={() => beginEdit(service)}
                onValidate={() => runServiceAction(service, "validate")}
                onCancel={() => runServiceAction(service, "cancel")}
                onComplete={() => runServiceAction(service, "complete")}
              />
            ))}
          </div>

          <section className="mt-6 rounded-xl border border-[#eadfd3] bg-white p-5">
            <h2 className="text-lg font-extrabold">Historique de service</h2>
            <div className="mt-5 space-y-4">
              <TimelineItem active label="Service proposé" date={activeService?.createdAt || "-"} />
              <TimelineItem active={activeService?.status === "en_cours" || activeService?.status === "terminer"} label="Service en cours" date={activeService?.acceptedAt || "-"} />
              <TimelineItem active={activeService?.status === "terminer"} label="Service terminé" date={activeService?.completedAt || "-"} />
            </div>
          </section>
        </section>
      </div>
    </div>
  );
}

function getServiceActionId(service, currentUserId, currentClientId, currentArtisanId) {
  const isCreator =
    Number(service.artisanUserId) === Number(currentUserId) ||
    (currentArtisanId && Number(service.artisanId) === Number(currentArtisanId));
  const isClient =
    Number(service.clientUserId) === Number(currentUserId) ||
    (currentClientId && Number(service.clientId) === Number(currentClientId));
  const userConfirmedEnd = isCreator ? Boolean(service.artisanCompletedAt) : Boolean(service.clientCompletedAt);

  if (isClient && service.status === "en_attente") return `${service.id}:client-validation`;
  if ((isCreator || isClient) && service.status === "en_cours" && !userConfirmedEnd) return `${service.id}:finish-${currentUserId}`;
  return "";
}

function ServiceCard({
  service,
  currentUserId,
  currentClientId,
  currentArtisanId,
  seenServiceActions,
  onMarkSeen,
  onEdit,
  onValidate,
  onCancel,
  onComplete,
}) {
  const isCreator =
    Number(service.artisanUserId) === Number(currentUserId) ||
    (currentArtisanId && Number(service.artisanId) === Number(currentArtisanId));
  const isClient =
    Number(service.clientUserId) === Number(currentUserId) ||
    (currentClientId && Number(service.clientId) === Number(currentClientId));
  const userConfirmedEnd = isCreator ? Boolean(service.artisanCompletedAt) : Boolean(service.clientCompletedAt);
  const canValidate = isClient && service.status === "en_attente";
  const canEdit = isCreator && service.status === "en_attente";
  const canComplete = (isCreator || isClient) && service.status === "en_cours" && !userConfirmedEnd;
  const actionId = getServiceActionId(service, currentUserId, currentClientId, currentArtisanId);
  const hasPendingAction = Boolean(actionId) && !seenServiceActions.includes(actionId);

  return (
    <article onClick={onMarkSeen} className="relative rounded-xl border border-[#eadfd3] bg-white p-5 shadow-sm">
      {hasPendingAction && (
        <span className="absolute right-4 top-4 h-3 w-3 rounded-full bg-red-500 ring-2 ring-white" />
      )}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-extrabold">{service.title}</h2>
          <p className="mt-2 text-2xl font-black">{Number(service.amount || 0).toLocaleString("fr-FR")} FCFA</p>
          <p className="mt-2 text-sm font-bold text-gray-500">Durée : {service.duration}</p>
          <p className="mt-3 max-w-2xl text-sm font-semibold leading-6 text-gray-600">{service.description}</p>
        </div>
        <span className={`w-fit rounded-full px-3 py-1 text-xs font-black ${statusStyles[service.status] || statusStyles.en_attente}`}>
          {statusLabels[service.status] || "En attente"}
        </span>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        {canValidate && (
          <>
            <button
              type="button"
              onClick={onValidate}
              className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-[#9DD7B5] px-5 text-sm font-extrabold text-[#267A39] hover:bg-[#E8F7E9]"
            >
              <Check size={17} />
              Valider
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-[#F0C5C0] px-5 text-sm font-extrabold text-[#B42318] hover:bg-red-50"
            >
              <X size={17} />
              Annuler
            </button>
          </>
        )}
        {canEdit && (
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-[#d7e3f1] px-5 text-sm font-extrabold text-[#145DA0] hover:bg-[#eef6ff]"
          >
            <Edit3 size={17} />
            Modifier
          </button>
        )}
        {canComplete && (
          <button
            type="button"
            onClick={onComplete}
            className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#2E9A43] px-5 text-sm font-extrabold text-white hover:bg-[#267A39]"
          >
            <Check size={17} />
            {isCreator ? "Marquer comme terminé" : "Confirmer la fin"}
          </button>
        )}
        {userConfirmedEnd && service.status !== "terminer" && (
          <span className="inline-flex min-h-11 items-center rounded-lg bg-[#FFF4DF] px-4 text-sm font-extrabold text-[#A15C00]">
            En attente de l'autre confirmation
          </span>
        )}
      </div>
    </article>
  );
}

function Field({ label, value, onChange, error, suffix }) {
  return (
    <label>
      <span className="mb-2 block text-sm font-extrabold">{label}</span>
      <div className="relative">
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={`min-h-11 w-full rounded-lg border bg-white px-4 text-sm font-semibold outline-none ${
            suffix ? "pr-16" : ""
          } ${error ? "border-red-500" : "border-[#eadfd3] focus:border-[#145DA0]"}`}
        />
        {suffix && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-gray-400">
            {suffix}
          </span>
        )}
      </div>
      {error && <p className="mt-1 text-xs font-bold text-red-600">{error}</p>}
    </label>
  );
}

function TimelineItem({ active, label, date }) {
  return (
    <div className="flex items-center gap-4">
      <span className={`grid h-8 w-8 place-items-center rounded-full ${active ? "bg-[#145DA0] text-white" : "bg-[#E5DED7] text-gray-500"}`}>
        <Clock3 size={15} />
      </span>
      <p className="flex-1 text-sm font-extrabold">{label}</p>
      <p className="text-sm font-bold text-gray-500">{date}</p>
    </div>
  );
}
