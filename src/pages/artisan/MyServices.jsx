import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Check, Clock3, MessageCircle, XCircle } from "lucide-react";

import { useUserMode } from "../../context/useUserMode";
import { getApiMessage } from "../../services/apiClient";
import { completeService, getArtisanServices, getClientServiceHistory } from "../../services/serviceService";

const statusLabels = {
  all: "Tous",
  en_attente: "En attente",
  en_cours: "En cours",
  terminer: "Terminés",
  annule: "Annulés",
};

const statusStyles = {
  en_attente: "bg-[#FFF4DF] text-[#A15C00]",
  en_cours: "bg-[#E9F3FF] text-[#145DA0]",
  terminer: "bg-[#E8F7E9] text-[#267A39]",
  annule: "bg-[#FDECEC] text-[#B42318]",
};

const statusOrder = ["en_attente", "en_cours", "terminer", "annule"];

const emptyCounts = {
  terminer: 0,
  annule: 0,
  en_cours: 0,
  en_attente: 0,
};

const resolveArtisanId = (user = {}) =>
  user.artisan?.id ||
  user.artisan_p?.id ||
  user.artisanP?.id ||
  user.artisan_profile?.id ||
  user.artisanProfile?.id ||
  user.artisan_id ||
  user.artisanId ||
  "";

const resolveClientId = (user = {}) =>
  user.client?.id ||
  user.clients?.id ||
  user.client_profile?.id ||
  user.clientProfile?.id ||
  user.client_id ||
  user.clientId ||
  "";

const getServiceFromPayload = (payload) => payload?.service || payload?.data?.service || payload?.data || payload;

const formatDate = (date) => {
  if (!date) return "-";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "-";
  return parsed.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const normalizeService = (service = {}, forcedStatus = "", viewerSide = "artisan") => {
  if (!service?.id) return null;
  const status = service.statut || service.status || forcedStatus || "en_attente";
  const clientUser = service.client?.user || service.client_user || {};
  const artisanUser = service.artisan?.user || service.artisan_user || {};
  const message = service.message || {};

  return {
    ...service,
    id: service.id,
    viewerSide,
    status,
    title: service.titre || service.title || "Service",
    description: service.description || "",
    amount: service.montant ?? service.amount ?? "",
    duration: service.duree_service || service.duration || "-",
    clientName: clientUser.name || service.client?.name || service.client_name || "Client",
    artisanName: artisanUser.name || service.artisan?.name || service.artisan_name || "Artisan",
    conversationId: message.conversation_id || service.conversation_id || "",
    createdAt: formatDate(service.created_at),
    acceptedAt: formatDate(service.client_valide_at),
    completedAt: formatDate(service.artisan_termine_at || service.updated_at),
  };
};

const normalizePayload = (payload = {}, viewerSide = "artisan") => {
  const data = payload?.data?.services || payload?.data?.comptes ? payload.data : payload;
  const servicesByStatus = data.services || {};
  const normalizedByStatus = Object.fromEntries(
    statusOrder.map((status) => [
      status,
      (Array.isArray(servicesByStatus[status]) ? servicesByStatus[status] : [])
        .map((service) => normalizeService(service, status, viewerSide))
        .filter(Boolean),
    ])
  );

  return {
    artisan: data.artisan || {},
    client: data.client || {},
    counts: { ...emptyCounts, ...(data.comptes || data.counts || {}) },
    total: Number(data.total ?? Object.values(normalizedByStatus).flat().length) || 0,
    servicesByStatus: normalizedByStatus,
  };
};

const mergeServiceStates = (states) => {
  const mergedByStatus = Object.fromEntries(statusOrder.map((status) => [status, []]));
  const seenKeys = new Set();

  states.forEach((state) => {
    statusOrder.forEach((status) => {
      (state.servicesByStatus[status] || []).forEach((service) => {
        const key = `${service.viewerSide}:${service.id}`;
        if (seenKeys.has(key)) return;
        seenKeys.add(key);
        mergedByStatus[status].push(service);
      });
    });
  });

  const counts = Object.fromEntries(
    statusOrder.map((status) => [status, mergedByStatus[status].length])
  );

  return {
    artisan: states.find((state) => state.artisan)?.artisan || {},
    client: states.find((state) => state.client)?.client || {},
    counts: { ...emptyCounts, ...counts },
    total: flattenServices(mergedByStatus).length,
    servicesByStatus: mergedByStatus,
  };
};

const flattenServices = (servicesByStatus) =>
  statusOrder.flatMap((status) => servicesByStatus[status] || []);

export default function MyServices() {
  const navigate = useNavigate();
  const { user } = useUserMode();
  const artisanId = resolveArtisanId(user);
  const clientId = resolveClientId(user);
  const [activeStatus, setActiveStatus] = useState("all");
  const [servicesState, setServicesState] = useState({
    artisan: {},
    counts: emptyCounts,
    total: 0,
    servicesByStatus: Object.fromEntries(statusOrder.map((status) => [status, []])),
  });
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState("");
  const [error, setError] = useState("");

  const services = useMemo(() => {
    if (activeStatus === "all") return flattenServices(servicesState.servicesByStatus);
    return servicesState.servicesByStatus[activeStatus] || [];
  }, [activeStatus, servicesState.servicesByStatus]);

  const loadServices = useCallback(async () => {
    if (!artisanId && !clientId) {
      setError("Impossible d'identifier le profil connecté.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");
    try {
      const requests = [];

      if (artisanId) {
        requests.push(getArtisanServices(artisanId).then((payload) => normalizePayload(payload, "artisan")));
      }

      if (clientId) {
        requests.push(getClientServiceHistory(clientId).then((payload) => normalizePayload(payload, "client")));
      }

      const settled = await Promise.allSettled(requests);
      const loadedStates = settled
        .filter((item) => item.status === "fulfilled")
        .map((item) => item.value);
      const failed = settled.find((item) => item.status === "rejected");

      if (loadedStates.length === 0 && failed) {
        throw failed.reason;
      }

      setServicesState(mergeServiceStates(loadedStates));
    } catch (loadError) {
      setError(getApiMessage(loadError, "Impossible de charger vos services."));
    } finally {
      setLoading(false);
    }
  }, [artisanId, clientId]);

  useEffect(() => {
    const timerId = window.setTimeout(loadServices, 0);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [loadServices]);

  const markCompleted = async (service) => {
    setActionId(service.id);
    setError("");

    try {
      const payload = await completeService(service.id);
      const updated = normalizeService(getServiceFromPayload(payload), service.status, service.viewerSide);

      if (updated) {
        setServicesState((current) => {
          const nextByStatus = Object.fromEntries(
            statusOrder.map((status) => [
              status,
              (current.servicesByStatus[status] || []).filter((item) => `${item.viewerSide}:${item.id}` !== `${updated.viewerSide}:${updated.id}`),
            ])
          );
          const nextStatus = updated.status || "terminer";
          nextByStatus[nextStatus] = [updated, ...(nextByStatus[nextStatus] || [])];
          const nextCounts = Object.fromEntries(
            statusOrder.map((status) => [status, nextByStatus[status]?.length || 0])
          );

          return {
            ...current,
            counts: { ...current.counts, ...nextCounts },
            total: flattenServices(nextByStatus).length,
            servicesByStatus: nextByStatus,
          };
        });
      }

      navigate(`/mes-services/${service.id}/avis`);
    } catch (actionError) {
      setError(getApiMessage(actionError, "Impossible de marquer ce service comme terminé."));
    } finally {
      setActionId("");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F5F1] px-0 pb-10 pt-24 text-[#182433] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <section className="rounded-none border-y border-[#eadfd3] bg-white p-5 shadow-sm sm:rounded-xl sm:border sm:p-7">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <h1 className="text-3xl font-extrabold">Mes Services</h1>
              <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-gray-500">
                Retrouvez les services proposés aux clients, leur statut et les actions restantes.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="En attente" value={servicesState.counts.en_attente} tone="warning" />
            <StatCard label="En cours" value={servicesState.counts.en_cours} tone="info" />
            <StatCard label="Terminés" value={servicesState.counts.terminer} tone="success" />
            <StatCard label="Annulés" value={servicesState.counts.annule} tone="danger" />
          </div>

          <div className="mt-6 flex gap-2 overflow-x-auto rounded-lg border border-[#eadfd3] bg-[#fbfaf8] p-2">
            {["all", ...statusOrder].map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setActiveStatus(status)}
                className={`min-h-10 shrink-0 rounded-md px-4 text-sm font-extrabold transition ${
                  activeStatus === status
                    ? "bg-[#145DA0] text-white"
                    : "text-[#182433] hover:bg-white"
                }`}
              >
                {statusLabels[status]}
              </button>
            ))}
          </div>

          {error && (
            <div className="mt-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700">
              {error}
            </div>
          )}

          <div className="mt-6 space-y-4">
            {loading && (
              <div className="rounded-lg border border-[#eadfd3] bg-[#fbfaf8] p-6 text-sm font-bold text-gray-500">
                Chargement des services...
              </div>
            )}

            {!loading && services.length === 0 && (
              <div className="rounded-lg border border-dashed border-[#d7cabd] bg-[#fbfaf8] p-6 text-sm font-bold text-gray-500">
                Aucun service dans cette catégorie.
              </div>
            )}

            {!loading && services.map((service) => (
              <ServiceHistoryCard
                key={`${service.status}-${service.id}`}
                service={service}
                completing={String(actionId) === String(service.id)}
                onComplete={() => markCompleted(service)}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function StatCard({ label, value, tone }) {
  const tones = {
    warning: "bg-[#FFF4DF] text-[#A15C00]",
    info: "bg-[#E9F3FF] text-[#145DA0]",
    success: "bg-[#E8F7E9] text-[#267A39]",
    danger: "bg-[#FDECEC] text-[#B42318]",
  };

  return (
    <article className="rounded-lg border border-[#eadfd3] bg-white p-5">
      <p className={`inline-flex rounded-full px-3 py-1 text-xs font-black ${tones[tone]}`}>
        {label}
      </p>
      <p className="mt-4 text-3xl font-black">{Number(value || 0).toLocaleString("fr-FR")}</p>
    </article>
  );
}

function ServiceHistoryCard({ service, completing, onComplete }) {
  const canComplete = service.status === "en_cours";
  const participantLabel = service.viewerSide === "client" ? "Artisan" : "Client";
  const participantName = service.viewerSide === "client" ? service.artisanName : service.clientName;

  return (
    <article className="rounded-xl border border-[#eadfd3] bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-lg font-extrabold">{service.title}</h2>
            <span className={`rounded-full px-3 py-1 text-xs font-black ${statusStyles[service.status] || statusStyles.en_attente}`}>
              {statusLabels[service.status] || "En attente"}
            </span>
          </div>
          <p className="mt-2 text-2xl font-black">
            {Number(service.amount || 0).toLocaleString("fr-FR")} FCFA
          </p>
          <p className="mt-2 text-sm font-bold text-gray-500">
            {participantLabel} : {participantName} · Durée : {service.duration}
          </p>
          {service.description && (
            <p className="mt-3 max-w-3xl text-sm font-semibold leading-6 text-gray-600">
              {service.description}
            </p>
          )}
          <div className="mt-4 flex flex-wrap gap-3 text-xs font-black text-gray-500">
            <span className="inline-flex items-center gap-1">
              <Clock3 size={14} />
              Proposé le {service.createdAt}
            </span>
            {service.status === "en_cours" && <span>Accepté le {service.acceptedAt}</span>}
            {service.status === "terminer" && <span>Terminé le {service.completedAt}</span>}
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap gap-3 lg:justify-end">
          {service.conversationId && (
            <Link
              to={`/messages/${service.conversationId}`}
              className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-[#d7e3f1] px-4 text-sm font-extrabold text-[#145DA0] hover:bg-[#eef6ff]"
            >
              <MessageCircle size={17} />
              Discussion
            </Link>
          )}
          {canComplete && (
            <button
              type="button"
              onClick={onComplete}
              disabled={completing}
              className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#2E9A43] px-4 text-sm font-extrabold text-white transition hover:bg-[#267A39] disabled:opacity-60"
            >
              <Check size={17} />
              {completing ? "Traitement..." : service.viewerSide === "client" ? "Confirmer la fin" : "Marquer terminé"}
            </button>
          )}
          {service.status === "annule" && (
            <span className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-red-50 px-4 text-sm font-extrabold text-[#B42318]">
              <XCircle size={17} />
              Service annulé
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
