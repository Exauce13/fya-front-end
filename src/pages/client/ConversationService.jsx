import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Check, Clock3, Plus, X } from "lucide-react";

import { useUserMode } from "../../context/useUserMode";

const statusLabels = {
  pending: "En attente",
  active: "En cours",
  completed: "Terminé",
  refused: "Refusé",
};

const statusStyles = {
  pending: "bg-[#FFF4DF] text-[#A15C00]",
  active: "bg-[#E9F3FF] text-[#145DA0]",
  completed: "bg-[#E8F7E9] text-[#267A39]",
  refused: "bg-[#FDECEC] text-[#B42318]",
};

const emptyForm = {
  title: "",
  description: "",
  amount: "",
  duration: "",
};

export default function ConversationService() {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const { isArtisan } = useUserMode();
  const conversation = { id: conversationId, name: "cette conversation" };
  const [servicesByConversation, setServicesByConversation] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState({});

  const services = useMemo(
    () => servicesByConversation[conversationId] || [],
    [conversationId, servicesByConversation]
  );
  const activeService = services[0];

  if (!conversation) {
    return (
      <div className="min-h-screen bg-[#F8F5F1] px-4 pt-24">
        <div className="mx-auto max-w-3xl rounded-lg bg-white p-6 text-center font-bold">
          Conversation introuvable.
        </div>
      </div>
    );
  }

  const updateServices = (nextServices) => {
    setServicesByConversation((current) => ({
      ...current,
      [conversationId]: nextServices,
    }));
  };

  const validateForm = () => {
    const errors = {};

    if (form.title.trim().length < 3) {
      errors.title = "Le titre doit contenir au moins 3 caractères";
    }
    if (form.description.trim().length < 10) {
      errors.description = "La description doit contenir au moins 10 caractères";
    }
    if (!form.amount.trim()) {
      errors.amount = "Veuillez saisir le montant";
    } else if (!/^\d[\d\s]*$/.test(form.amount.trim())) {
      errors.amount = "Veuillez saisir un montant valide";
    }
    if (form.duration.trim().length < 2) {
      errors.duration = "Veuillez saisir la durée";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const addService = (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    const nextService = {
      id: `service-${Date.now()}`,
      title: form.title.trim(),
      description: form.description.trim(),
      amount: form.amount.trim(),
      duration: form.duration.trim(),
      status: "pending",
      createdAt: new Date().toLocaleDateString("fr-FR"),
      acceptedAt: "",
      completedAt: "",
      artisanReview: null,
      clientReview: null,
    };

    updateServices([nextService, ...services]);
    setForm(emptyForm);
    setFormErrors({});
    setShowForm(false);
  };

  const setServiceStatus = (serviceId, status) => {
    updateServices(
      services.map((service) => {
        if (service.id !== serviceId) return service;
        return {
          ...service,
          status,
          acceptedAt: status === "active" ? new Date().toLocaleDateString("fr-FR") : service.acceptedAt,
          completedAt: status === "completed" ? new Date().toLocaleDateString("fr-FR") : service.completedAt,
        };
      })
    );

    if (status === "completed") {
      navigate(`/messages/${conversationId}/service/${serviceId}/avis`);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F5F1] px-0 pb-10 pt-24 text-[#182433] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Link
          to={`/messages/${conversation.id}`}
          className="mb-4 inline-flex items-center gap-2 px-4 text-sm font-extrabold text-[#145DA0] sm:px-0"
        >
          <ArrowLeft size={17} />
          Retour à la messagerie
        </Link>

        <div className="grid gap-5">
          <section className="rounded-none border-y border-[#eadfd3] bg-white p-5 shadow-sm sm:rounded-xl sm:border sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-extrabold">Services</h1>
                <p className="mt-1 text-sm font-semibold text-gray-500">
                  Conversation avec {conversation.name}
                </p>
              </div>
              {isArtisan && (
                <button
                  type="button"
                  onClick={() => setShowForm((current) => !current)}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#145DA0] px-4 text-sm font-extrabold text-white transition hover:bg-[#0f4b82]"
                >
                  <Plus size={17} />
                  Ajouter un service
                </button>
              )}
            </div>

            {showForm && (
              <form onSubmit={addService} className="mt-5 rounded-lg border border-[#d9e6f4] bg-[#f6fbff] p-4">
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
                  <button className="min-h-11 rounded-lg bg-[#145DA0] px-5 text-sm font-extrabold text-white">
                    Publier le service
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setForm(emptyForm);
                      setFormErrors({});
                    }}
                    className="min-h-11 rounded-lg border border-[#eadfd3] px-5 text-sm font-extrabold"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            )}

            <div className="mt-5 space-y-4">
              {services.length === 0 && (
                <div className="rounded-lg border border-dashed border-[#d7cabd] bg-[#fbfaf8] p-6 text-sm font-bold text-gray-500">
                  Aucun service n'a encore été proposé dans cette conversation.
                </div>
              )}

              {services.map((service) => (
                <article key={service.id} className="rounded-xl border border-[#eadfd3] bg-white p-5 shadow-sm">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h2 className="text-lg font-extrabold">{service.title}</h2>
                      <p className="mt-2 text-2xl font-black">{Number(service.amount.replace(/\s/g, "")).toLocaleString("fr-FR")} FCFA</p>
                      <p className="mt-2 text-sm font-bold text-gray-500">Délai : {service.duration}</p>
                      <p className="mt-3 max-w-2xl text-sm font-semibold leading-6 text-gray-600">{service.description}</p>
                    </div>
                    <span className={`w-fit rounded-full px-3 py-1 text-xs font-black ${statusStyles[service.status]}`}>
                      {statusLabels[service.status]}
                    </span>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-3">
                    {!isArtisan && service.status === "pending" && (
                      <>
                        <button
                          type="button"
                          onClick={() => setServiceStatus(service.id, "active")}
                          className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-[#9DD7B5] px-5 text-sm font-extrabold text-[#267A39] hover:bg-[#E8F7E9]"
                        >
                          <Check size={17} />
                          Valider
                        </button>
                        <button
                          type="button"
                          onClick={() => setServiceStatus(service.id, "refused")}
                          className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-[#F0C5C0] px-5 text-sm font-extrabold text-[#B42318] hover:bg-red-50"
                        >
                          <X size={17} />
                          Refuser
                        </button>
                      </>
                    )}
                    {isArtisan && service.status === "active" && (
                      <button
                        type="button"
                        onClick={() => setServiceStatus(service.id, "completed")}
                        className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#2E9A43] px-5 text-sm font-extrabold text-white hover:bg-[#267A39]"
                      >
                        <Check size={17} />
                        Marquer comme terminé
                      </button>
                    )}
                    {service.status === "completed" && !service[isArtisan ? "artisanReview" : "clientReview"] && (
                      <Link
                        to={`/messages/${conversationId}/service/${service.id}/avis`}
                        className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-[#d7e3f1] px-5 text-sm font-extrabold text-[#145DA0] hover:bg-[#eef6ff]"
                      >
                        Donner un avis
                      </Link>
                    )}
                  </div>
                </article>
              ))}
            </div>

            <section className="mt-6 rounded-xl border border-[#eadfd3] bg-white p-5">
              <h2 className="text-lg font-extrabold">Historique de service</h2>
              <div className="mt-5 space-y-4">
                <TimelineItem active label="Service proposé" date={activeService?.createdAt || "-"} />
                <TimelineItem active={activeService?.status === "active" || activeService?.status === "completed"} label="Service en cours" date={activeService?.acceptedAt || "-"} />
                <TimelineItem active={activeService?.status === "completed"} label="Service terminé" date={activeService?.completedAt || "-"} />
              </div>
            </section>
          </section>

        </div>
      </div>
    </div>
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
