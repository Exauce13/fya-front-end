import { useEffect, useState } from "react";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";

import { getApiMessage } from "../../services/apiClient";
import { confirmCertificationPayment } from "../../services/artisanService";

export default function FedapayReturn() {
  const [searchParams] = useSearchParams();
  const [state, setState] = useState({
    status: "loading",
    message: "Confirmation du paiement en cours...",
    reference: searchParams.get("reference") || searchParams.get("local_reference") || "",
  });

  useEffect(() => {
    let active = true;

    async function confirmPayment() {
      const reference = searchParams.get("reference") || searchParams.get("local_reference");

      if (!reference) {
        setState({
          status: "error",
          message: "Référence de paiement introuvable dans l'URL de retour.",
          reference: "",
        });
        return;
      }

      try {
        const payload = await confirmCertificationPayment(reference, {
          status: searchParams.get("status") || undefined,
          id: searchParams.get("id") || undefined,
        });

        if (!active) return;

        if (payload?.success) {
          setState({
            status: "success",
            message: "Paiement réussi. Votre dossier est maintenant en attente de validation.",
            reference,
          });
          return;
        }

        setState({
          status: "error",
          message: payload?.message || "Le paiement n'est pas encore confirmé.",
          reference,
        });
      } catch (error) {
        if (active) {
          setState({
            status: "error",
            message: getApiMessage(error, "Impossible de confirmer le paiement."),
            reference,
          });
        }
      }
    }

    confirmPayment();

    return () => {
      active = false;
    };
  }, [searchParams]);

  const isSuccess = state.status === "success";
  const isError = state.status === "error";

  return (
    <div className="bg-[#F8F5F1] px-4 pb-12 pt-28 text-[#182433]">
      <section className="mx-auto max-w-xl rounded-xl border border-[#eadfd3] bg-white p-6 shadow-sm">
        <div className={`grid h-14 w-14 place-items-center rounded-full ${
          isSuccess ? "bg-[#E8F7E9] text-[#267A39]" : isError ? "bg-red-50 text-red-600" : "bg-[#eef6ff] text-[#145DA0]"
        }`}>
          {isSuccess && <CheckCircle2 size={30} />}
          {isError && <XCircle size={30} />}
          {!isSuccess && !isError && <Loader2 size={30} className="animate-spin" />}
        </div>

        <h1 className="mt-5 text-2xl font-extrabold">
          {isSuccess ? "Paiement réussi" : isError ? "Paiement non confirmé" : "Retour FedaPay"}
        </h1>
        <p className="mt-3 text-sm font-semibold leading-7 text-[#596579]">{state.message}</p>

        {state.reference && (
          <p className="mt-4 rounded-lg bg-[#F8F5F1] px-3 py-2 text-xs font-black text-[#2F3742]">
            Référence : {state.reference}
          </p>
        )}

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/verification-artisan"
            className="inline-flex min-h-11 items-center rounded-md bg-[#145DA0] px-5 text-sm font-extrabold text-white"
          >
            Retour à la vérification
          </Link>
          <Link
            to="/profile"
            className="inline-flex min-h-11 items-center rounded-md border border-[#d7e3f1] px-5 text-sm font-extrabold text-[#145DA0]"
          >
            Voir mon profil
          </Link>
        </div>
      </section>
    </div>
  );
}
