import { useState } from "react";
import { ArrowLeft, CheckCircle2, CreditCard, FileText, UploadCloud } from "lucide-react";
import { Link } from "react-router-dom";

const initialForm = {
  associationName: "",
  leaderName: "",
  leaderPhone: "",
  identityCard: null,
  diploma: null,
};

const verificationStatusKey = "fya-artisan-verification-status";

export default function VerificationCenter() {
  const [step, setStep] = useState("information");
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [paid, setPaid] = useState(false);

  const updateFile = (field, file) => {
    setForm((current) => ({ ...current, [field]: file || null }));
    setErrors((current) => ({ ...current, [field]: "" }));
  };

  const validateInformation = () => {
    const nextErrors = {};

    if (form.associationName.trim().length < 2) {
      nextErrors.associationName = "Veuillez saisir le nom de l'association";
    }
    if (form.leaderName.trim().length < 3) {
      nextErrors.leaderName = "Veuillez saisir le nom et prénoms du dirigeant";
    }
    if (!/^01\d{8}$/.test(form.leaderPhone.trim())) {
      nextErrors.leaderPhone = "Le numéro doit contenir 10 chiffres et commencer par 01";
    }
    if (!form.identityCard) {
      nextErrors.identityCard = "Veuillez joindre la carte d'identité nationale";
    }
    if (!form.diploma) {
      nextErrors.diploma = "Veuillez joindre le diplôme";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const goToPayment = (event) => {
    event.preventDefault();
    if (validateInformation()) {
      setStep("payment");
    }
  };

  const payVerification = () => {
    localStorage.setItem(verificationStatusKey, "pending");
    setPaid(true);
  };

  return (
    <div className="bg-[#F8F5F1] pb-10 pt-24 text-[#182433]">
      <div className="mx-auto w-full max-w-5xl px-0 sm:px-6 lg:px-8">
        <Link
          to="/profile"
          className="mx-4 inline-flex min-h-11 items-center gap-2 rounded-md border border-[#eadfd3] bg-white px-4 text-sm font-extrabold text-[#182433] transition hover:bg-[#fff3ea] sm:mx-0"
        >
          <ArrowLeft size={17} />
          Retour au profil
        </Link>

        <section className="mt-5 overflow-hidden rounded-none border-y border-[#eadfd3] bg-white shadow-sm sm:rounded-xl sm:border">
          <div className="bg-[#102437] px-6 py-8 text-white md:px-9">
            <p className="text-sm font-extrabold uppercase tracking-[0.12em] text-[#E68A35]">Vérification artisan</p>
            <h1 className="mt-3 text-3xl font-extrabold tracking-normal md:text-4xl">
              Obtenir le badge vérifié
            </h1>
            {/* <p className="mt-3 max-w-2xl text-sm font-semibold leading-7 text-white/78">
              La vérification se fait en deux étapes : informations de l'association puis paiement des frais de traitement.
            </p> */}
          </div>

          <div className="grid gap-3 border-b border-[#eadfd3] p-5 sm:grid-cols-2 md:p-7">
            <StepCard
              active={step === "information"}
              done={step === "payment" || paid}
              icon={FileText}
              title="Informations"
              description="Identité de l'association et fichiers justificatifs PDF."
            />
            <StepCard
              active={step === "payment"}
              done={paid}
              icon={CreditCard}
              title="Paiement"
              description="Frais de vérification : 1000 FCFA."
            />
          </div>

          {step === "information" && (
            <form onSubmit={goToPayment} className="p-5 md:p-7">
              <h2 className="text-xl font-extrabold">Informations de l'association</h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <Field
                  label="Nom d'association"
                  value={form.associationName}
                  error={errors.associationName}
                  onChange={(value) => setForm({ ...form, associationName: value })}
                />
                <Field
                  label="Nom et Prénoms du dirigeant"
                  value={form.leaderName}
                  error={errors.leaderName}
                  onChange={(value) => setForm({ ...form, leaderName: value })}
                />
                <Field
                  label="Numéro de téléphone du dirigeant"
                  value={form.leaderPhone}
                  error={errors.leaderPhone}
                  maxLength={10}
                  onChange={(value) => setForm({ ...form, leaderPhone: value })}
                />
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <FileField
                  label="Carte d'identité nationale"
                  file={form.identityCard}
                  error={errors.identityCard}
                  onChange={(file) => updateFile("identityCard", file)}
                />
                <FileField
                  label="Diplôme"
                  file={form.diploma}
                  error={errors.diploma}
                  onChange={(file) => updateFile("diploma", file)}
                />
              </div>

              <button className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-md bg-[#145DA0] px-5 text-sm font-extrabold text-white transition hover:bg-[#0f4b82]">
                Continuer vers le paiement
              </button>
            </form>
          )}

          {step === "payment" && (
            <section className="p-5 md:p-7">
              {paid ? (
                <div className="rounded-xl border border-[#bfe5c8] bg-[#E8F7E9] p-6">
                  <CheckCircle2 size={34} className="text-[#267A39]" />
                  <h2 className="mt-4 text-2xl font-extrabold text-[#267A39]">Demande envoyée</h2>
                  <p className="mt-2 text-sm font-semibold leading-7 text-[#286039]">
                    Votre paiement de 1000 FCFA est enregistré. L'équipe FYA analysera votre dossier et activera le badge après validation.
                  </p>
                  <Link
                    to="/profile"
                    className="mt-5 inline-flex min-h-11 items-center rounded-md bg-[#267A39] px-5 text-sm font-extrabold text-white"
                  >
                    Retour au profil
                  </Link>
                </div>
              ) : (
                <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
                  <div>
                    <h2 className="text-xl font-extrabold">Paiement des frais de vérification</h2>
                    <p className="mt-2 text-sm font-semibold leading-7 text-gray-600">
                      Les frais de traitement du dossier sont fixés à 1000 FCFA. Le badge sera activé après vérification manuelle des informations.
                    </p>
                    <div className="mt-5 rounded-lg border border-[#eadfd3] bg-[#fbfaf8] p-4">
                      <p className="text-sm font-extrabold text-gray-500">Récapitulatif</p>
                      <p className="mt-2 text-lg font-black">{form.associationName}</p>
                      <p className="mt-1 text-sm font-semibold text-gray-600">{form.leaderName} · {form.leaderPhone}</p>
                    </div>
                  </div>

                  <aside className="rounded-xl border border-[#d9e6f4] bg-[#f6fbff] p-5">
                    <p className="text-sm font-extrabold text-gray-500">Montant à payer</p>
                    <p className="mt-2 text-4xl font-black text-[#145DA0]">1000 FCFA</p>
                    <button
                      type="button"
                      onClick={payVerification}
                      className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-[#C96B2C] px-5 text-sm font-extrabold text-white transition hover:bg-[#b65e23]"
                    >
                      <CreditCard size={18} />
                      Payer maintenant
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep("information")}
                      className="mt-3 min-h-11 w-full rounded-md border border-[#d7e3f1] text-sm font-extrabold text-[#145DA0]"
                    >
                      Modifier les informations
                    </button>
                  </aside>
                </div>
              )}
            </section>
          )}
        </section>
      </div>
    </div>
  );
}

function StepCard({ active, done, icon: Icon, title, description }) {
  return (
    <article className={`rounded-lg border p-4 ${active ? "border-[#145DA0] bg-[#eef6ff]" : "border-[#eadfd3] bg-[#fbfaf8]"}`}>
      <div className="flex items-start gap-3">
        <span className={`grid h-11 w-11 place-items-center rounded-full ${done ? "bg-[#E8F7E9] text-[#267A39]" : "bg-white text-[#145DA0]"}`}>
          {done ? <CheckCircle2 size={21} /> : <Icon size={21} />}
        </span>
        <div>
          <h2 className="font-extrabold">{title}</h2>
          <p className="mt-1 text-sm font-semibold leading-6 text-gray-600">{description}</p>
        </div>
      </div>
    </article>
  );
}

function Field({ label, value, onChange, error, maxLength }) {
  return (
    <label>
      <span className="mb-2 block text-sm font-extrabold">{label}</span>
      <input
        value={value}
        maxLength={maxLength}
        onChange={(event) => onChange(event.target.value)}
        className={`min-h-11 w-full rounded-lg border bg-white px-4 text-sm font-semibold outline-none ${
          error ? "border-red-500 focus:border-red-500" : "border-[#eadfd3] focus:border-[#145DA0]"
        }`}
      />
      {error && <p className="mt-1 text-xs font-bold text-red-600">{error}</p>}
    </label>
  );
}

function FileField({ label, file, error, onChange }) {
  return (
    <label className={`block rounded-lg border border-dashed bg-[#fbfaf8] p-5 ${error ? "border-red-500" : "border-[#d7cabd]"}`}>
      <span className="flex items-center gap-2 text-sm font-extrabold">
        <UploadCloud size={18} className="text-[#145DA0]" />
        {label}
      </span>
      <span className="mt-2 block text-xs font-semibold text-gray-500">Format accepté : PDF uniquement</span>
      <input
        type="file"
        accept="application/pdf,.pdf"
        className="mt-4 block w-full text-sm font-semibold"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (!file || file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
            onChange(file);
          }
        }}
      />
      {file && <p className="mt-3 rounded-md bg-white px-3 py-2 text-xs font-bold text-[#182433]">{file.name}</p>}
      {error && <p className="mt-1 text-xs font-bold text-red-600">{error}</p>}
    </label>
  );
}
