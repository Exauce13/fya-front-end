import { CheckCircle2, CreditCard, Loader2, UploadCloud } from "lucide-react";
import { Link } from "react-router-dom";

export function StepCard({ active, done, icon: Icon, title, description }) {
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

export function Field({ label, value, onChange, error, maxLength }) {
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

export function FileField({ label, file, error, onChange }) {
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

export function PaymentSuccess({ paymentReference }) {
  return (
    <div className="rounded-xl border border-[#bfe5c8] bg-[#E8F7E9] p-6">
      <CheckCircle2 size={34} className="text-[#267A39]" />
      <h2 className="mt-4 text-2xl font-extrabold text-[#267A39]">Paiement réussi</h2>
      <p className="mt-2 text-sm font-semibold leading-7 text-[#286039]">
        Votre paiement test de 1000 FCFA est enregistré. L'équipe FYA analysera votre dossier et activera le badge après validation.
      </p>
      {paymentReference && (
        <p className="mt-3 rounded-lg bg-white/70 px-3 py-2 text-xs font-black text-[#286039]">
          Référence : {paymentReference}
        </p>
      )}
      <Link
        to="/profile"
        className="mt-5 inline-flex min-h-11 items-center rounded-md bg-[#267A39] px-5 text-sm font-extrabold text-white"
      >
        Retour au profil
      </Link>
    </div>
  );
}

export function PaymentCheckout({
  form,
  apiError,
  paymentProcessing,
  paymentWaiting,
  paymentUrl,
  onPay,
  onBack,
}) {
  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
      <div>
        <h2 className="text-xl font-extrabold">Paiement des frais de vérification</h2>
        <p className="mt-2 text-sm font-semibold leading-7 text-gray-600">
          Les frais de traitement du dossier sont fixés à 1000 FCFA. Le badge sera activé après vérification manuelle des informations.
        </p>
        <p className="mt-3 rounded-lg border border-[#d9e6f4] bg-[#f6fbff] px-4 py-3 text-sm font-bold leading-6 text-[#145DA0]">
          Mode test sandbox : FYA ouvre la page FedaPay. Le paiement est affiché comme réussi seulement après confirmation du backend.
        </p>
        {paymentWaiting && (
          <p className="mt-3 rounded-lg border border-[#F4D3A3] bg-[#FFF8EC] px-4 py-3 text-sm font-bold leading-6 text-[#A15C00]">
            Finalisez le paiement dans l'onglet FedaPay ouvert. FYA affichera automatiquement la réussite après confirmation.
          </p>
        )}
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
          onClick={onPay}
          disabled={paymentProcessing}
          className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-[#C96B2C] px-5 text-sm font-extrabold text-white transition hover:bg-[#b65e23] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {paymentProcessing ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              {paymentWaiting ? "En attente de confirmation..." : "Ouverture de FedaPay..."}
            </>
          ) : (
            <>
              <CreditCard size={18} />
              Payer avec FedaPay sandbox
            </>
          )}
        </button>
        {paymentUrl && paymentWaiting && (
          <a
            href={paymentUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex min-h-11 w-full items-center justify-center rounded-md border border-[#d7e3f1] text-sm font-extrabold text-[#145DA0]"
          >
            Rouvrir la page FedaPay
          </a>
        )}
        {apiError && (
          <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm font-bold text-red-600">
            {apiError}
          </p>
        )}
        <button
          type="button"
          onClick={onBack}
          className="mt-3 min-h-11 w-full rounded-md border border-[#d7e3f1] text-sm font-extrabold text-[#145DA0]"
        >
          Modifier les informations
        </button>
      </aside>
    </div>
  );
}
