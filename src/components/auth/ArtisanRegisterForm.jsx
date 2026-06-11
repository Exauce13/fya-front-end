import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import logo from "../../assets/images/logo.webp";
import useMetiers from "../../hooks/useMetiers";
import { getApiMessage } from "../../services/apiClient";
import { registerArtisan } from "../../services/authService";

const artisanSchema = z
  .object({
    npi: z
      .string()
      .regex(/^\d{10}$/, "Le NPI doit contenir exactement 10 chiffres"),

    tel: z
      .string()
      .regex(/^01[4569]\d{7}$/, "Le numéro doit contenir 10 chiffres et commencer par 014, 015, 016 ou 019"),
    email: z
      .string()
      .email("Veuillez saisir une adresse email valide"),

    full_name: z
      .string()
      .min(3, "Le nom et prénoms doivent contenir au moins 3 caractères"),

    metier: z
      .string()
      .min(1, "Veuillez sélectionner un métier"),

    experience_years: z
      .string()
      .min(1, "Veuillez saisir vos années d'expérience")
      .regex(/^\d+$/, "Veuillez saisir un nombre valide"),

    ville: z
      .string()
      .min(2, "Veuillez saisir une ville valide")
      .regex(/^[A-Za-zÀ-ÿ\s-]+$/, "La ville doit contenir uniquement des lettres"),

    quartier: z
      .string()
      .min(2, "Veuillez saisir un quartier valide")
      .regex(/^[A-Za-zÀ-ÿ\s-]+$/, "Le quartier doit contenir uniquement des lettres"),

    password: z
      .string()
      .min(8, "Le mot de passe doit contenir au moins 8 caractères")
      .max(12, "Le mot de passe ne doit pas dépasser 12 caractères")
      .regex(/[A-Z]/, "Au moins une lettre majuscule")
      .regex(/[a-z]/, "Au moins une lettre minuscule")
      .regex(/[0-9]/, "Au moins un chiffre")
      .regex(/[@$!%*?&_\-#]/, "Au moins un caractère spécial"),

    confirm_password: z.string(),

    terms: z.literal(true, {
      errorMap: () => ({
        message: "Vous devez accepter les conditions générales",
      }),
    }),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirm_password"],
  });

export default function ArtisanRegisterForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const submitLockedRef = useRef(false);
  const { metiers, loading: metiersLoading } = useMetiers();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(artisanSchema),
    mode: "onChange",
  });

  const password = watch("password", "");

  const getPasswordStrength = () => {
    if (!password) return "";

    let score = 0;

    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[@$!%*?&_\-#]/.test(password)) score++;

    if (score <= 3) return "Faible";
    if (score === 4) return "Moyen";
    return "Fort";
  };

  const onSubmit = async (data) => {
    if (submitLockedRef.current) return;
    submitLockedRef.current = true;

    try {
      const response = await registerArtisan(data);
      alert(response?.message || "Inscription artisan effectuee avec succes.");
      navigate("/login", { replace: true });
    } catch (error) {
      console.error(error);
      submitLockedRef.current = false;
      alert(getApiMessage(error, "Une erreur est survenue pendant l'inscription."));
    }
  };

  const inputClass = (fieldError) =>
    `w-full h-12 px-4 border rounded-lg outline-none transition
    ${
      fieldError
        ? "border-red-500 focus:ring-red-500"
        : "border-gray-300 focus:ring-blue-500"
    }`;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f5f5] px-4 py-10">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-8">
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Logo FYA" className="w-32" />
        </div>

        <h2 className="text-3xl font-bold text-center">
          Inscription – Artisan
        </h2>

        <p className="text-center text-gray-500 mt-2 mb-8">
          Créez votre compte artisan
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* NPI */}
          <div>
            <label className="block mb-2 text-sm font-medium">
              Numéro Personnel d'Identification (NPI)
            </label>

            <input
              type="text"
              maxLength={10}
              {...register("npi")}
              className={inputClass(errors.npi)}
            />

            {errors.npi && (
              <p className="text-red-500 text-sm mt-1">
                {errors.npi.message}
              </p>
            )}
          </div>

          {/* Téléphone */}
          <div>
            <label className="block mb-2 text-sm font-medium">
              Téléphone
            </label>

            <input
              type="text"
              maxLength={10}
              {...register("tel")}
              className={inputClass(errors.tel)}
            />

            {errors.tel && (
              <p className="text-red-500 text-sm mt-1">
                {errors.tel.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block mb-2 text-sm font-medium">
              Email
            </label>

            <input
              type="email"
              {...register("email")}
              className={inputClass(errors.email)}
            />

            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">
              Nom et prénoms
            </label>

            <input
              type="text"
              {...register("full_name")}
              className={inputClass(errors.full_name)}
            />

            {errors.full_name && (
              <p className="text-red-500 text-sm mt-1">
                {errors.full_name.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Métier */}
            <div>
              <label className="block mb-2 text-sm font-medium">
                Métier
              </label>

              <select
                {...register("metier")}
                className={inputClass(errors.metier)}
              >
                <option value="">Sélectionnez votre métier</option>
                {metiers.map((category) => (
                  <option key={category.id || category.name} value={category.id || category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
              {metiersLoading && (
                <p className="text-xs text-gray-500 mt-1">Chargement des métiers...</p>
              )}

              {errors.metier && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.metier.message}
                </p>
              )}
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium">
                Années d'expérience
              </label>

              <input
                type="number"
                min="0"
                {...register("experience_years")}
                className={inputClass(errors.experience_years)}
              />

              {errors.experience_years && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.experience_years.message}
                </p>
              )}
            </div>
          </div>

          {/* Ville */}
          <div>
            <label className="block mb-2 text-sm font-medium">
              Ville
            </label>

            <input
              type="text"
              {...register("ville")}
              className={inputClass(errors.ville)}
            />

            {errors.ville && (
              <p className="text-red-500 text-sm mt-1">
                {errors.ville.message}
              </p>
            )}
          </div>

          {/* Quartier */}
          <div>
            <label className="block mb-2 text-sm font-medium">
              Quartier
            </label>

            <input
              type="text"
              {...register("quartier")}
              className={inputClass(errors.quartier)}
            />

            {errors.quartier && (
              <p className="text-red-500 text-sm mt-1">
                {errors.quartier.message}
              </p>
            )}
          </div>

          {/* Mot de passe */}
          <div>
            <label className="block mb-2 text-sm font-medium">
              Mot de passe
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                className={inputClass(errors.password)}
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                className="absolute right-4 top-1/2 -translate-y-1/2"
              >
                👁
              </button>
            </div>

            {password && (
              <p className="text-sm mt-1 text-gray-500">
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
            <label className="block mb-2 text-sm font-medium">
              Confirmez le mot de passe
            </label>

            <div className="relative">
              <input
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                {...register("confirm_password")}
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
                {errors.confirm_password.message}
              </p>
            )}
          </div>

          {/* Conditions */}
          <div>
            <label className="flex items-start gap-2">
              <input
                type="checkbox"
                {...register("terms")}
                className="mt-1"
              />

              <span className="text-sm text-gray-600">
                J'accepte les CGU et la politique de
                confidentialité
              </span>
            </label>

            {errors.terms && (
              <p className="text-red-500 text-sm mt-1">
                {errors.terms.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-semibold transition"
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
