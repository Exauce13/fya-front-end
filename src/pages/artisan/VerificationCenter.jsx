import { useRef, useState } from "react";
import { ArrowLeft, CreditCard, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Field,
  FileField,
  PaymentCheckout,
  PaymentSuccess,
  StepCard,
} from "../../components/artisan/verification/VerificationFields";
import { getApiMessage } from "../../services/apiClient";
import { confirmCertificationPayment, requestCertification } from "../../services/artisanService";

const initialForm = {
  associationName: "",
  leaderName: "",
  leaderPhone: "",
  identityCard: null,
  diploma: null,
};

const paymentPollIntervalMs = 5000;
const maxPaymentPollAttempts = 36;

export default function VerificationCenter() {
  const paymentWindowRef = useRef(null);
  const [step, setStep] = useState("information");
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [paid, setPaid] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentReference, setPaymentReference] = useState("");
  const [fedapayTransactionId, setFedapayTransactionId] = useState("");
  const [paymentUrl, setPaymentUrl] = useState("");
  const [paymentWaiting, setPaymentWaiting] = useState(false);
  const [apiError, setApiError] = useState("");

  const updateFile = (field, file) => {
    setForm((current) => ({ ...current, [field]: file || null }));
    setErrors((current) => ({ ...current, [field]: "" }));
  };

  const validateInformation = () => {
    const nextErrors = {};

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

  const payVerification = async () => {
    setApiError("");
    setPaymentProcessing(true);
    setPaymentWaiting(false);
    const formData = new FormData();
    formData.append("nom_association", form.associationName.trim() || "Non renseigné");
    formData.append("telephone_association", form.leaderPhone.trim() || "Non renseigné");
    formData.append("montant", "1000");
    formData.append("piece_identites", form.identityCard, form.identityCard.name);
    formData.append("piece_identite", form.identityCard, form.identityCard.name);
    formData.append("diplome", form.diploma, form.diploma.name);

    try {
      const payload = await requestCertification(formData);
      if (payload?.success === false) {
        throw new Error(payload?.message || "Impossible de traiter le paiement de vérification.");
      }

      const paymentData = payload?.data || payload;
      const reference =
        paymentData?.local_reference ||
        paymentData?.callback_reference ||
        paymentData?.reference ||
        paymentData?.payment?.local_reference ||
        paymentData?.payment?.callback_reference ||
        paymentData?.transaction?.local_reference ||
        "";
      const checkoutUrl =
        paymentData?.payment_url ||
        paymentData?.url ||
        paymentData?.payment?.payment_url ||
        paymentData?.transaction?.payment_url ||
        "";
      const transactionId =
        paymentData?.fedapay_transaction_id ||
        paymentData?.transaction_id ||
        paymentData?.transaction?.id ||
        paymentData?.payment?.fedapay_transaction_id ||
        "";

      if (!reference) {
        throw new Error("Référence locale de paiement introuvable. Le backend doit renvoyer local_reference.");
      }
      if (!checkoutUrl) {
        throw new Error("Lien de paiement FedaPay introuvable.");
      }

      setPaymentReference(reference);
      setFedapayTransactionId(transactionId);
      setPaymentUrl(checkoutUrl);
      setPaymentWaiting(true);
      paymentWindowRef.current = window.open(checkoutUrl, "fya-fedapay-payment");
      await waitForPaymentConfirmation(reference, transactionId);
    } catch (error) {
      setApiError(getApiMessage(error, "Impossible d'envoyer la demande de vérification."));
    } finally {
      setPaymentProcessing(false);
    }
  };

  const wait = (delay) => new Promise((resolve) => {
    window.setTimeout(resolve, delay);
  });

  const waitForPaymentConfirmation = async (reference, transactionId = "", options = {}) => {
    const attempts = options.immediate ? 1 : maxPaymentPollAttempts;

    for (let attempt = 0; attempt < attempts; attempt += 1) {
      if (attempt > 0) {
        await wait(paymentPollIntervalMs);
      }

      const payload = await confirmCertificationPayment(reference, transactionId ? { id: transactionId } : {});
      if (payload?.success) {
        paymentWindowRef.current?.close();
        window.focus();
        setPaid(true);
        setPaymentWaiting(false);
        return;
      }
    }

    throw new Error("Paiement non confirmé pour le moment. Terminez le paiement FedaPay puis réessayez.");
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
                <PaymentSuccess paymentReference={paymentReference} />
              ) : (
                <PaymentCheckout
                  form={form}
                  apiError={apiError}
                  paymentProcessing={paymentProcessing}
                  paymentWaiting={paymentWaiting}
                  paymentUrl={paymentUrl}
                  onPay={payVerification}
                  onBack={() => setStep("information")}
                />
              )}
            </section>
          )}
        </section>
      </div>
    </div>
  );
}
