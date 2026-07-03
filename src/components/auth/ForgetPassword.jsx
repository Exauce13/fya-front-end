import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import logo from "../../assets/images/logo.webp";
import { getApiMessage } from "../../services/apiClient";
import { requestPasswordReset } from "../../services/authService";

const forgotPasswordSchema = z.object({
  email: z.string().trim().email("Veuillez saisir une adresse email valide"),
});

export default function ForgetPassword() {
  const [status, setStatus] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async ({ email }) => {
    setStatus(null);

    try {
      const payload = await requestPasswordReset(email);
      setStatus({
        type: "success",
        message:
          payload?.message ||
          "Si cette adresse existe, un lien de réinitialisation vient d'être envoyé.",
      });
    } catch (error) {
      setStatus({
        type: "error",
        message: getApiMessage(error, "Impossible d'envoyer le lien de réinitialisation."),
      });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f5f5f5] px-4 py-10">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <div className="mb-6 flex justify-center">
          <img src={logo} alt="Logo FYA" className="w-32" />
        </div>

        <h1 className="text-center text-3xl font-bold text-black">Mot de passe oublié</h1>
        <p className="mt-2 text-center text-sm font-semibold leading-6 text-gray-500">
          Entrez votre email. Si le compte existe, vous recevrez un lien pour créer un nouveau mot de passe.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-7 space-y-5">
          {status && (
            <div
              className={`rounded-lg border px-4 py-3 text-sm font-bold ${
                status.type === "success"
                  ? "border-green-200 bg-green-50 text-green-700"
                  : "border-red-200 bg-red-50 text-red-700"
              }`}
            >
              {status.message}
            </div>
          )}

          <label className="block">
            <span className="mb-2 block text-sm font-medium">Adresse email</span>
            <div
              className={`flex min-h-12 items-center gap-3 rounded-lg border px-4 ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
            >
              <Mail size={18} className="text-gray-400" />
              <input
                type="email"
                {...register("email")}
                className="min-w-0 flex-1 bg-transparent text-sm font-semibold outline-none"
                placeholder="votre@email.com"
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm font-bold text-red-600">{errors.email.message}</p>
            )}
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className="min-h-12 w-full rounded-lg bg-[#145DA0] text-sm font-extrabold text-white transition hover:bg-[#0f4b82] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Envoi en cours..." : "Envoyer le lien"}
          </button>
        </form>

        <Link
          to="/login"
          className="mt-5 block text-center text-sm font-extrabold text-[#145DA0] hover:underline"
        >
          Retour à la connexion
        </Link>
      </div>
    </div>
  );
}
