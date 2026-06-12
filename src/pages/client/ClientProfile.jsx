import { useState } from "react";
import { Link } from "react-router-dom";
import { Camera, ClipboardList, Edit3, Mail, MapPin, Phone, Save, ShieldCheck, Star, X } from "lucide-react";

import UserNameLink from "../../components/ui/UserNameLink";
import PasswordRequirements from "../../components/auth/PasswordRequirements";
import { useUserMode } from "../../context/useUserMode";
import profileAvatar from "../../assets/images/profile-avatar.svg";
import { getApiMessage, getStorageUrl } from "../../services/apiClient";
import { updatePassword } from "../../services/authService";
import { updateProfileInformation, updateProfilePhoto } from "../../services/profileService";
import {
  hasPasswordErrors,
  validatePasswordChange,
} from "../../utils/passwordValidation";

const reviews = [];

export default function ClientProfile() {
  const { user } = useUserMode();
  const [avatar, setAvatar] = useState(user?.avatar || profileAvatar);
  const [profile, setProfile] = useState({
    city: user?.ville || "",
    district: user?.quartier || "",
    telephone: user?.telephone || "",
    email: user?.email || "",
    statut: user?.statut || "",
    memberSince: user?.created_at ? new Date(user.created_at).getFullYear().toString() : "",
  });
  const [editing, setEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState({});
  const [form, setForm] = useState({
    city: user?.ville || "",
    district: user?.quartier || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const offersCount = user?.appels_offres_count || user?.client?.appels_offres_count || 0;

  const changeAvatar = async (file) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("photo", file);

    const reader = new FileReader();
    reader.onload = () => setAvatar(reader.result);
    reader.readAsDataURL(file);

    try {
      const payload = await updateProfilePhoto(formData);
      const photo = getStorageUrl(payload?.photo_url || payload?.photo || payload?.user?.photo);
      if (photo) setAvatar(photo);
    } catch (error) {
      alert(getApiMessage(error, "Impossible de modifier la photo de profil."));
    }
  };

  const saveProfile = async () => {
    const passwordValidationErrors = validatePasswordChange(form);
    setPasswordErrors(passwordValidationErrors);
    if (hasPasswordErrors(passwordValidationErrors)) {
      return;
    }

    try {
      if (user?.id) {
        await updateProfileInformation(user.id, {
          ville: form.city.trim(),
          quartier: form.district.trim(),
        });
      }

      if (form.currentPassword || form.newPassword || form.confirmPassword) {
        await updatePassword(form);
      }

      setProfile((current) => ({
        ...current,
        city: form.city.trim() || current.city,
        district: form.district.trim() || current.district,
      }));
      setForm((current) => ({
        ...current,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
      setShowPasswordForm(false);
      setEditing(false);
      setPasswordErrors({});
    } catch (error) {
      alert(getApiMessage(error, "Impossible d'enregistrer les informations."));
    }
  };

  const cancelEdit = () => {
    setForm({
      city: profile.city,
      district: profile.district,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setShowPasswordForm(false);
    setPasswordErrors({});
    setEditing(false);
  };

  return (
    <div className="min-h-screen bg-[#F8F5F1] px-0 pb-10 pt-24 text-[#182433] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <section className="rounded-none border-y border-[#eadfd3] bg-white p-5 shadow-sm sm:rounded-xl sm:border sm:p-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="relative h-24 w-24 shrink-0">
                <img src={avatar} alt={user.name} className="h-full w-full rounded-full object-cover" />
                <label className="absolute bottom-0 right-0 grid h-9 w-9 cursor-pointer place-items-center rounded-full bg-[#145DA0] text-white shadow">
                  <Camera size={17} />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(event) => changeAvatar(event.target.files?.[0])}
                  />
                </label>
              </div>
              <div>
                <h1 className="text-3xl font-extrabold">{user?.name || "Client FYA"}</h1>
                <p className="mt-1 text-sm font-semibold text-gray-500">Profil client</p>
                <p className="mt-2 inline-flex items-center gap-2 text-sm font-extrabold text-[#182433]">
                  <MapPin size={16} className="text-[#C96B2C]" />
                  {[profile.city, profile.district].filter(Boolean).join(", ") || "Localisation non renseignée"}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-[#d7e3f1] px-4 text-sm font-extrabold text-[#145DA0] transition hover:bg-[#eef6ff]"
            >
              <Edit3 size={17} />
              Modifier mes informations
            </button>
          </div>

          {editing && (
            <form
              onSubmit={(event) => {
                event.preventDefault();
                saveProfile();
              }}
              className="mt-6 rounded-lg border border-[#eadfd3] bg-[#fbfaf8] p-4"
            >
              <h2 className="text-lg font-extrabold">Informations personnelles</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Field label="Ville" value={form.city} onChange={(value) => setForm({ ...form, city: value })} />
                <Field label="Quartier" value={form.district} onChange={(value) => setForm({ ...form, district: value })} />
              </div>

              <div className="mt-6 rounded-lg border border-[#eadfd3] bg-white p-4">
                <button
                  type="button"
                  onClick={() => {
                    if (showPasswordForm) {
                      setForm({
                        ...form,
                        currentPassword: "",
                        newPassword: "",
                        confirmPassword: "",
                      });
                      setPasswordErrors({});
                    }
                    setShowPasswordForm((current) => !current);
                  }}
                  className="inline-flex min-h-10 items-center gap-2 rounded-md border border-[#d7e3f1] px-3 text-sm font-extrabold text-[#145DA0] transition hover:bg-[#eef6ff]"
                >
                  <Edit3 size={16} />
                  Modifier le mot de passe
                </button>

                {showPasswordForm && (
                  <div className="mt-4 grid gap-4">
                    <Field
                      label="Mot de passe actuel"
                      type="password"
                      value={form.currentPassword}
                      onChange={(value) => setForm({ ...form, currentPassword: value })}
                      error={passwordErrors.currentPassword}
                    />
                    <Field
                      label="Nouveau mot de passe"
                      type="password"
                      value={form.newPassword}
                      onChange={(value) => setForm({ ...form, newPassword: value })}
                      error={passwordErrors.newPassword}
                    />
                    <Field
                      label="Confirmer le nouveau mot de passe"
                      type="password"
                      value={form.confirmPassword}
                      onChange={(value) => setForm({ ...form, confirmPassword: value })}
                      error={passwordErrors.confirmPassword}
                    />
                    <PasswordRequirements
                      password={form.newPassword}
                      confirmation={form.confirmPassword}
                      currentPassword={form.currentPassword}
                      showConfirmation
                    />
                  </div>
                )}
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <button className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#145DA0] px-4 text-sm font-extrabold text-white">
                  <Save size={17} />
                  Enregistrer
                </button>
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-[#eadfd3] px-4 text-sm font-extrabold text-[#182433]"
                >
                  <X size={17} />
                  Annuler
                </button>
              </div>
            </form>
          )}

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <Link
              to="/mes-appels-offres"
              className="rounded-lg bg-[#fbfaf8] p-5 transition hover:bg-[#fff3ea] hover:shadow-sm"
            >
              <ClipboardList className="text-[#145DA0]" />
              <p className="mt-3 text-2xl font-extrabold">{offersCount}</p>
              <p className="text-sm font-bold text-gray-500">Appels d'offres lancés</p>
            </Link>
            <article className="rounded-lg bg-[#fbfaf8] p-5">
              <Star className="fill-[#F5A623] text-[#F5A623]" />
              <p className="mt-3 text-2xl font-extrabold">{user?.rating || "0/5"}</p>
              <p className="text-sm font-bold text-gray-500">Note moyenne</p>
            </article>
            <article className="rounded-lg bg-[#fbfaf8] p-5">
              <Star className="text-[#C96B2C]" />
              <p className="mt-3 text-2xl font-extrabold">{reviews.length}</p>
              <p className="text-sm font-bold text-gray-500">Avis reçus</p>
            </article>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <InfoItem icon={Phone} label="Téléphone" value={profile.telephone} />
            <InfoItem icon={Mail} label="Email" value={profile.email} />
            <InfoItem icon={ShieldCheck} label="Statut" value={profile.statut} />
            <InfoItem icon={MapPin} label="Membre depuis" value={profile.memberSince} />
          </div>
        </section>

        <section className="mt-5 rounded-none border-y border-[#eadfd3] bg-white p-5 shadow-sm sm:rounded-xl sm:border sm:p-7">
          <h2 className="text-xl font-extrabold">Notes et avis</h2>
          <div className="mt-4 space-y-3">
            {reviews.map((review) => (
              <article key={review.author} className="rounded-lg bg-[#fbfaf8] p-4">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-extrabold">
                    <UserNameLink name={review.author}>{review.author}</UserNameLink>
                  </h3>
                  <span className="inline-flex items-center gap-1 text-sm font-extrabold text-[#C96B2C]">
                    <Star size={15} className="fill-[#C96B2C]" />
                    {review.rating}
                  </span>
                </div>
                <p className="mt-2 text-sm font-semibold leading-6 text-gray-600">{review.text}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function InfoItem({ icon: Icon, label, value }) {
  return (
    <article className="rounded-lg bg-[#fbfaf8] px-4 py-3">
      <p className="flex items-center gap-2 text-xs font-extrabold text-gray-400">
        <Icon size={15} />
        {label}
      </p>
      <p className="mt-1 text-sm font-extrabold text-[#182433]">{value || "Non renseigné"}</p>
    </article>
  );
}

function Field({ label, value, onChange, type = "text", error }) {
  return (
    <label>
      <span className="mb-2 block text-sm font-extrabold text-[#182433]">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`min-h-11 w-full rounded-lg border bg-white px-4 text-sm font-semibold text-[#182433] outline-none ${
          error ? "border-red-500 focus:border-red-500" : "border-[#eadfd3] focus:border-[#145DA0]"
        }`}
      />
      {error && <p className="mt-1 text-xs font-bold text-red-600">{error}</p>}
    </label>
  );
}
