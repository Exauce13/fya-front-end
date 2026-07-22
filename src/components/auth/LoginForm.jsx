import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import logo from "../../assets/images/logo.webp";
import img from "../../assets/images/loginImg.png";
import { getApiMessage } from "../../services/apiClient";
import { login, requestAdminOtp, verifyAdminOtp } from "../../services/authService";

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

const otpSchema = z.object({
  otp: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "Le code doit contenir 6 chiffres"),
});

export default function LoginForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const rememberedLogin = getRememberedLogin();

  const [showPassword, setShowPassword] =
    useState(false);

  const [apiError, setApiError] =
    useState("");
  const [otpChallenge, setOtpChallenge] =
    useState(null);
  const [otpError, setOtpError] =
    useState("");
  const [otpMessage, setOtpMessage] =
    useState("");
  const successMessage = location.state?.message || "";
  const isAdminLoginIntent = String(location.state?.from || "").startsWith("/admin");

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

  const {
    register: registerOtp,
    handleSubmit: handleOtpSubmit,
    reset: resetOtp,
    formState: {
      errors: otpErrors,
      isSubmitting: isVerifyingOtp,
    },
  } = useForm({
    resolver: zodResolver(otpSchema),
    mode: "onChange",
    defaultValues: {
      otp: "",
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
      const session = isAdminLoginIntent ? await requestAdminOtp(data) : await login(data);
      if (session?.requiresOtp) {
        setOtpChallenge({ ...session, password: data.password });
        setOtpMessage(session.message);
        resetOtp();
        return;
      }

      saveRememberedLogin(data);
      navigate("/", { replace: true });
    } catch (error) {
      setApiError(
        getApiMessage(error, "Email ou mot de passe incorrect.")
      );
    }
  };

  const onVerifyOtp = async (data) => {
    if (!otpChallenge) return;
    setOtpError("");

    try {
      await verifyAdminOtp({
        email: otpChallenge.email,
        otp: data.otp,
        remember: otpChallenge.remember,
      });
      saveRememberedLogin({
        telemail: otpChallenge.email,
        remember: otpChallenge.remember,
      });
      navigate("/admin", { replace: true });
    } catch (error) {
      setOtpError(
        getApiMessage(error, "Code OTP invalide ou expiré.")
      );
    }
  };

  const resendOtp = async () => {
    if (!otpChallenge) return;
    setOtpError("");
    setOtpMessage("");

    try {
      const challenge = await requestAdminOtp({
        email: otpChallenge.email,
        telemail: otpChallenge.email,
        password: otpChallenge.password,
        remember: otpChallenge.remember,
      });
      setOtpChallenge({ ...challenge, password: otpChallenge.password });
      setOtpMessage(challenge.message);
      resetOtp();
    } catch (error) {
      setOtpError(
        getApiMessage(error, "Impossible de renvoyer le code OTP.")
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
              {otpChallenge ? "Validation admin" : "Se connecter"}
            </h2>
          </div>

          {otpChallenge ? (
          <form
            onSubmit={handleOtpSubmit(onVerifyOtp)}
            className="space-y-5"
          >
            {otpError && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl">
                {otpError}
              </div>
            )}
            {otpMessage && (
              <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-green-700">
                {otpMessage}
              </div>
            )}

            <div>
              <label
                htmlFor="otp"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Code OTP
              </label>
              <input
                type="text"
                id="otp"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                placeholder="123456"
                {...registerOtp("otp")}
                className={inputClass(otpErrors.otp)}
              />
              {otpErrors.otp && (
                <p className="text-sm text-red-500 mt-1">
                  {otpErrors.otp.message}
                </p>
              )}
              <p className="mt-2 text-sm text-gray-500">
                Code envoyé à {otpChallenge.email}
                {otpChallenge.expiresInMinutes
                  ? `, valable ${otpChallenge.expiresInMinutes} min.`
                  : "."}
              </p>
            </div>

            <button
              type="submit"
              disabled={isVerifyingOtp}
              className="w-full bg-blue-700 hover:bg-blue-800 disabled:bg-gray-400 text-white font-semibold py-3 rounded-xl transition duration-300 shadow-md"
            >
              {isVerifyingOtp ? "Vérification..." : "Valider le code"}
            </button>

            <div className="flex items-center justify-between gap-3 text-sm">
              <button
                type="button"
                onClick={resendOtp}
                className="font-semibold text-blue-700 hover:underline"
              >
                Renvoyer le code
              </button>
              <button
                type="button"
                onClick={() => {
                  setOtpChallenge(null);
                  setOtpError("");
                  setOtpMessage("");
                  resetOtp();
                }}
                className="font-semibold text-gray-600 hover:underline"
              >
                Changer d'email
              </button>
            </div>
          </form>
          ) : (
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
            {successMessage && (
              <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-green-700">
                {successMessage}
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
          )}
        </div>
      </div>
    </div>
  );
}
