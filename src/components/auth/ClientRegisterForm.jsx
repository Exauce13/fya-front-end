import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import logo from "../../assets/images/logo.webp";
import { isValidPhoneNumber } from "react-phone-number-input";
import { Controller } from "react-hook-form";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";





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
  const [showPassword, setShowPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm({
    resolver: zodResolver(clientSchema),
    mode: "onChange",
  });

  const password = watch("password", "");

  const getPasswordStrength = () => {
    if (!password) return "";

    let score = 0;

    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;

    if (score <= 2) return "Faible";
    if (score === 3) return "Moyen";
    return "Fort";
  };

  const onSubmit = async (data) => {
    try {
      console.log(data);

      // Exemple API
      // await axios.post("/api/client/register", data);

      alert("Inscription réussie !");
    } catch (error) {
      console.error(error);
      alert("Une erreur est survenue.");
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
      countries={undefined}
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

            {password && (
              <p className="text-sm text-gray-500 mt-1">
                Force : {getPasswordStrength()}
              </p>
            )}

            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
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
            <label className="flex items-start gap-2">
              <input
                type="checkbox"
                {...register("terms")}
                className="mt-1"
              />

              <span className="text-sm text-gray-600">
                J'accepte les CGU et la
                politique de confidentialité
              </span>
            </label>

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
        </form>
      </div>
    </div>
  );
}