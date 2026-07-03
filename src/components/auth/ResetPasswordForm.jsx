import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";

import logo from "../../assets/images/logo.webp";
import { getApiMessage, getApiValidationErrors } from "../../services/apiClient";
import { resetPassword } from "../../services/authService";
import PasswordRequirements from "./PasswordRequirements";

const resetPasswordSchema = z
  .object({
    email: z.string().trim().email("Adresse email invalide"),
    token: z.string().min(1, "Le token de réinitialisation est manquant"),
    password: z
      .string()
      .min(8, "Le mot de passe doit contenir au moins 8 caractères")
      .max(12, "Le mot de passe ne doit pas dépasser 12 caractères")
      .regex(/[A-Z]/, "Le mot de passe doit contenir une majuscule")
      .regex(/[a-z]/, "Le mot de passe doit contenir une minuscule")
      .regex(/\d/, "Le mot de passe doit contenir un chiffre")
      .regex(/[@$!%*?&_\-#]/, "Le mot de passe doit contenir un caractère spécial"),
    confirm_password: z.string(),
  })
  .refine((data) => data.password === data.confirm_password, {
    path: ["confirm_password"],
    message: "Les mots de passe ne correspondent pas",
  });

export default function ResetPasswordForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [status, setStatus] = useState(null);
  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onChange",
    defaultValues: {
      email: query.get("email") || "",
      token: query.get("token") || "",
      password: "",
      confirm_password: "",
    },
  });

  const password = useWatch({ control, name: "password", defaultValue: "" });
  const confirmPassword = useWatch({ control, name: "confirm_password", defaultValue: "" });

  const onSubmit = async (data) => {
    setStatus(null);

    try {
      const payload = await resetPassword(data);
      setStatus({
        type: "success",
        message: payload?.message || "Votre mot de passe a été réinitialisé.",
      });
      navigate("/login", {
        replace: true,
        state: {
          message: payload?.message || "Votre mot de passe a été réinitialisé. Vous pouvez vous connecter.",
        },
      });
    } catch (error) {
      const validationErrors = getApiValidationErrors(error);
      Object.entries(validationErrors).forEach(([field, message]) => {
        setError(field, { type: "server", message });
      });
      setStatus({
        type: "error",
        message: getApiMessage(error, "Impossible de réinitialiser le mot de passe."),
      });
    }
  };

  const inputClass = (fieldError) =>
    `h-12 w-full rounded-lg border px-4 text-sm font-semibold outline-none transition ${
      fieldError ? "border-red-500 focus:ring-2 focus:ring-red-500" : "border-gray-300 focus:ring-2 focus:ring-blue-500"
    }`;

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f5f5f5] px-4 py-10">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <div className="mb-6 flex justify-center">
          <img src={logo} alt="Logo FYA" className="w-32" />
        </div>

        <h1 className="text-center text-3xl font-bold text-black">Nouveau mot de passe</h1>
        <p className="mt-2 text-center text-sm font-semibold leading-6 text-gray-500">
          Choisissez un nouveau mot de passe sécurisé pour votre compte.
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

          <div>
            <label className="mb-2 block text-sm font-medium">Email</label>
            <input type="email" {...register("email")} className={inputClass(errors.email)} />
            {errors.email && <p className="mt-1 text-sm font-bold text-red-600">{errors.email.message}</p>}
          </div>

          <input type="hidden" {...register("token")} />
          {errors.token && <p className="text-sm font-bold text-red-600">{errors.token.message}</p>}

          <div>
            <label className="mb-2 block text-sm font-medium">Nouveau mot de passe</label>
            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                className={`${inputClass(errors.password)} pl-11 pr-12`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <PasswordRequirements password={password} className="mt-3" />
            {errors.password && <p className="mt-1 text-sm font-bold text-red-600">{errors.password.message}</p>}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Confirmer le mot de passe</label>
            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                {...register("confirm_password")}
                className={`${inputClass(errors.confirm_password)} pl-11 pr-12`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((current) => !current)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                aria-label={showConfirmPassword ? "Masquer la confirmation" : "Afficher la confirmation"}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <PasswordRequirements
              password={password}
              confirmation={confirmPassword}
              showConfirmation
              className="mt-3"
            />
            {errors.confirm_password && (
              <p className="mt-1 text-sm font-bold text-red-600">{errors.confirm_password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="min-h-12 w-full rounded-lg bg-[#145DA0] text-sm font-extrabold text-white transition hover:bg-[#0f4b82] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Réinitialisation..." : "Réinitialiser le mot de passe"}
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
