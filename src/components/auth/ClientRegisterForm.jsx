import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import logo from "../../assets/images/logo.webp";
import { isValidPhoneNumber } from "react-phone-number-input";
import { Controller } from "react-hook-form";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { getApiMessage, getApiValidationErrors } from "../../services/apiClient";
import { registerClient } from "../../services/authService";
import PasswordRequirements from "./PasswordRequirements";
import RegisterSuccessDialog from "./RegisterSuccessDialog";





const clientSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Veuillez saisir votre nom ou pseudonyme"),

    tel: z
  .string()
  .min(1, "Le numéro est obligatoire")
  .refine(
    (value) => isValidPhoneNumber(value),
    {
      message: "Numéro de téléphone invalide",
    }
  )
  .refine(
    (value) => value.replace(/\s/g, "").replace(/^\+229/, "").replace(/^229/, "").match(/^01[4569]\d{7}$/),
    {
      message: "Le numéro doit commencer par 014, 015, 016 ou 019",
    }
  ),


    email: z
      .string()
      .trim()
      .email("Adresse email invalide"),

    password: z
      .string()
      .min(
        8,
        "Le mot de passe doit contenir au moins 8 caractères"
      )
      .max(
        12,
        "Le mot de passe ne doit pas dépasser 12 caractères"
      )
      .regex(
        /[A-Z]/,
        "Le mot de passe doit contenir une majuscule"
      )
      .regex(
        /[a-z]/,
        "Le mot de passe doit contenir une minuscule"
      )
      .regex(
        /\d/,
        "Le mot de passe doit contenir un chiffre"
      )
      .regex(
        /[@$!%*?&_\-#]/,
        "Le mot de passe doit contenir un caractère spécial"
      ),

    confirm_password: z.string(),

    terms: z.preprocess(
      (val) => {
        if (typeof val === "string") return val === "on" || val === "true";
        return !!val;
      },
      z.boolean().refine((v) => v === true, {
        message: "Vous devez accepter les conditions générales",
      })
    ),
  })
  .refine(
    (data) =>
      data.password === data.confirm_password,
    {
      path: ["confirm_password"],
      message:
        "Les mots de passe ne correspondent pas",
    }
  );

export default function ClientRegisterForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);
  const [formStatus, setFormStatus] = useState(null);
  const [successDialog, setSuccessDialog] = useState({ open: false, message: "" });
  const [submitLocked, setSubmitLocked] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm({
    resolver: zodResolver(clientSchema),
    mode: "onChange",
  });

  const password = useWatch({ control, name: "password", defaultValue: "" });
  const confirmPassword = useWatch({ control, name: "confirm_password", defaultValue: "" });

  const onSubmit = async (data) => {
    if (submitLocked) return;
    setSubmitLocked(true);
    setFormStatus(null);

    try {
      const response = await registerClient(data);
      setSuccessDialog({
        open: true,
        message: response?.message || "Votre compte client a été créé. Veuillez valider votre email.",
      });
    } catch (error) {
      console.error(error);
      setSubmitLocked(false);
      const validationErrors = getApiValidationErrors(error);
      const fieldMap = {
        telephone: "tel",
        tel: "tel",
        phone: "tel",
        email: "email",
        name: "name",
        nom: "name",
        password: "password",
      };

      Object.entries(validationErrors).forEach(([field, message]) => {
        const targetField = fieldMap[field] || field;
        setError(targetField, { type: "server", message });
      });

      setFormStatus({
        type: "error",
        message: getApiMessage(error, "Une erreur est survenue pendant l'inscription."),
      });
    }
  };

  const inputClass = (error) =>
    `w-full h-12 px-4 border rounded-lg outline-none transition
    ${
      error
        ? "border-red-500 focus:ring-2 focus:ring-red-500"
        : "border-gray-300 focus:ring-2 focus:ring-blue-500"
    }`;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f5f5] px-4 py-10">
      <RegisterSuccessDialog
        open={successDialog.open}
        message={successDialog.message}
        onConfirm={() => navigate("/", { replace: true })}
      />
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <div className="flex justify-center mb-6">
          <img
            src={logo}
            alt="Logo FYA"
            className="w-32"
          />
        </div>

        <h2 className="text-3xl font-bold text-center text-black">
          Inscription – Client
        </h2>

        <p className="text-center text-gray-500 mt-2 mb-8">
          Créez votre compte client
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
        >
          {formStatus && (
            <div
              className={`rounded-lg border px-4 py-3 text-sm font-bold ${
                formStatus.type === "success"
                  ? "border-green-200 bg-green-50 text-green-700"
                  : "border-red-200 bg-red-50 text-red-700"
              }`}
            >
              {formStatus.message}
            </div>
          )}

          {/* Nom */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom et prénom(s) ou pseudonyme
            </label>

            <input
              type="text"
              {...register("name")}
              className={inputClass(errors.name)}
            />

            {errors.name && (
              <p className="text-red-500 text-sm mt-1">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Téléphone */}
          <div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Téléphone
  </label>

  <Controller
  name="tel"
  control={control}
  defaultValue=""
  render={({ field }) => (
    <PhoneInput
      {...field}
      international
      defaultCountry="BJ"
      countries={["BJ"]}
      placeholder="Entrer votre numéro"
      className={`
        phone-input
        w-full
        rounded-lg
        border
        ${
          errors.tel
            ? "border-red-500"
            : "border-gray-300"
        }
        bg-white
        px-3
        py-3
        focus-within:ring-2
        ${
          errors.tel
            ? "focus-within:ring-red-500"
            : "focus-within:ring-blue-500"
        }
      `}
    />
  )}
/>
  {errors.tel && (
    <p className="text-red-500 text-sm mt-1">
      {errors.tel.message}
    </p>
  )}
</div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>

            <input
              type="email"
              placeholder="exemple@email.com"
              {...register("email")}
              className={inputClass(errors.email)}
            />

            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Mot de passe */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mot de passe
            </label>

            <div className="relative">
              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                {...register("password")}
                className={inputClass(errors.password)}
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
                className="absolute right-4 top-1/2 -translate-y-1/2"
              >
                👁
              </button>
            </div>

            <PasswordRequirements password={password} className="mt-3" />
          </div>

          {/* Confirmation */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirmer le mot de passe
            </label>

            <div className="relative">
              <input
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                {...register(
                  "confirm_password"
                )}
                className={inputClass(
                  errors.confirm_password
                )}
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(
                    !showConfirmPassword
                  )
                }
                className="absolute right-4 top-1/2 -translate-y-1/2"
              >
                👁
              </button>
            </div>

            <PasswordRequirements
              password={password}
              confirmation={confirmPassword}
              confirmationOnly
              className="mt-3"
            />

            {errors.confirm_password && (
              <p className="text-red-500 text-sm mt-1">
                {
                  errors
                    .confirm_password
                    .message
                }
              </p>
            )}
          </div>

          {/* CGU */}
          <div>
            <div className="flex items-start gap-2">
              <input
                id="client-terms"
                type="checkbox"
                {...register("terms")}
                className="mt-1"
              />

              <span className="text-sm text-gray-600">
                J'accepte les{" "}
                <Link to="/cgu" className="font-extrabold text-[#145DA0] hover:underline">
                  CGU
                </Link>{" "}
                et la{" "}
                <Link to="/confidentialite" className="font-extrabold text-[#145DA0] hover:underline">
                  politique de confidentialité
                </Link>
              </span>
            </div>

            {errors.terms && (
              <p className="text-red-500 text-sm mt-1">
                {errors.terms.message}
              </p>
            )}
          </div>

          {/* Bouton */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition"
          >
            {isSubmitting
              ? "Inscription..."
              : "S'inscrire"}
          </button>

          <div className="space-y-2 text-center text-sm font-semibold">
            <p className="text-gray-600">
              Déjà un compte ?{" "}
              <Link to="/login" className="font-extrabold text-[#145DA0] hover:underline">
                Se connecter
              </Link>
            </p>
            <Link to="/forget-password" className="font-extrabold text-[#145DA0] hover:underline">
              Mot de passe oublié ?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
