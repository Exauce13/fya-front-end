import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import logo from "../../assets/images/logo.webp";
import img from "../../assets/images/loginImg.png";
import { getApiMessage } from "../../services/apiClient";
import { login } from "../../services/authService";

const rememberedLoginKey = "fya-remembered-login";

const getRememberedLogin = () => {
  try {
    return JSON.parse(localStorage.getItem(rememberedLoginKey) || "{}");
  } catch {
    return {};
  }
};

const saveRememberedLogin = (data) => {
  if (data.remember) {
    localStorage.setItem(rememberedLoginKey, JSON.stringify({ telemail: data.telemail }));
    return;
  }

  localStorage.removeItem(rememberedLoginKey);
};

const isEmail = (value) => {
  const emailRegex =
    /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

  return emailRegex.test(value.trim());
};

const loginSchema = z.object({
  telemail: z
    .string()
    .min(1, "Ce champ est obligatoire")
    .refine(isEmail, {
      message:
        "Veuillez saisir une adresse email valide",
    }),

  password: z
    .string()
    .min(
      1,
      "Le mot de passe est obligatoire"
    ),

  remember: z.boolean().optional(),
});

export default function LoginForm() {
  const navigate = useNavigate();
  const rememberedLogin = getRememberedLogin();

  const [showPassword, setShowPassword] =
    useState(false);

  const [apiError, setApiError] =
    useState("");

  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: {
      telemail: rememberedLogin.telemail || "",
      password: "",
      remember: Boolean(rememberedLogin.telemail),
    },
  });

  const inputClass = (error) =>
    `w-full border rounded-xl px-4 py-3 outline-none transition
    ${
      error
        ? "border-red-500 focus:ring-2 focus:ring-red-500"
        : "border-gray-300 focus:ring-2 focus:ring-blue-600"
    }`;

  const onSubmit = async (data) => {
    setApiError("");

    try {
      await login(data);
      saveRememberedLogin(data);
      navigate("/", { replace: true });
    } catch (error) {
      setApiError(
        getApiMessage(error, "Email ou mot de passe incorrect.")
      );
    }
  };

  const goToRegister = (e) => {
    e.preventDefault();
    navigate("/register");
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Image */}
        <div className="hidden md:block md:w-1/2">
          <img
            src={img}
            alt="Artisan"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Formulaire */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          
          <div className="flex justify-center mb-6">
            <img
              src={logo}
              alt="Logo FYA"
              className="w-32"
            />
          </div>

          <div className="mb-8 text-center md:text-left">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Se connecter
            </h2>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
          >
            {/* Erreur API */}
            {apiError && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl">
                {apiError}
              </div>
            )}

            {/* Email */}
            <div>
              <label
                htmlFor="telemail"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email
              </label>

              <input
                type="text"
                id="telemail"
                placeholder="exemple@email.com"
                {...register("telemail")}
                className={inputClass(
                  errors.telemail
                )}
              />

              {errors.telemail && (
                <p className="text-sm text-red-500 mt-1">
                  {
                    errors.telemail
                      .message
                  }
                </p>
              )}
            </div>

            {/* Mot de passe */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700"
                >
                  Mot de passe
                </label>

                <button
                  type="button"
                  className="text-sm text-blue-600 hover:underline"
                  onClick={() =>
                    navigate(
                      "/forget-password"
                    )
                  }
                >
                  Mot de passe oublié ?
                </button>
              </div>

              <div className="relative">
                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  id="password"
                  placeholder="••••••••"
                  {...register(
                    "password"
                  )}
                  className={inputClass(
                    errors.password
                  )}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword
                    ? "🙈"
                    : "👁"}
                </button>
              </div>

              {errors.password && (
                <p className="text-sm text-red-500 mt-1">
                  {
                    errors.password
                      .message
                  }
                </p>
              )}
            </div>

            {/* Remember me */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="remember"
                {...register(
                  "remember"
                )}
                className="w-4 h-4 accent-blue-600"
              />

              <label
                htmlFor="remember"
                className="text-sm text-gray-600"
              >
                Se souvenir de moi
              </label>
            </div>

            {/* Bouton */}
            <button
              type="submit"
              disabled={
                isSubmitting
              }
              className="w-full bg-blue-700 hover:bg-blue-800 disabled:bg-gray-400 text-white font-semibold py-3 rounded-xl transition duration-300 shadow-md"
            >
              {isSubmitting
                ? "Connexion..."
                : "Se connecter"}
            </button>

            {/* Inscription */}
            <p className="text-center text-sm text-gray-600 pt-4">
              Vous n'avez pas de compte ?{" "}
              <button
                type="button"
                onClick={
                  goToRegister
                }
                className="text-blue-700 font-semibold hover:underline"
              >
                S'inscrire
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
