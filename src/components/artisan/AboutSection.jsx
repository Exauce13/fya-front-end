import { useState } from "react";
import { BriefcaseBusiness, CalendarClock, Edit3, MapPin, Save, X } from "lucide-react";
import PasswordRequirements from "../auth/PasswordRequirements";

export default function AboutSection({
  artisan,
  form,
  editing,
  visitorMode,
  onFormChange,
  onEdit,
  onCancel,
  onSave,
  passwordErrors = {},
}) {
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const details = [
    { icon: MapPin, label: "Ville", value: artisan.ville },
    { icon: MapPin, label: "Quartier", value: artisan.quartier },
    { icon: CalendarClock, label: "Expérience", value: `${artisan.experience || 0} ans d'expérience` },
    { icon: BriefcaseBusiness, label: "Nom de l'atelier", value: artisan.atelier },
  ];

  return (
    <section className="rounded-lg border border-[#eadfd3] bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-extrabold text-[#182433]">À propos</h2>
        {!visitorMode && (
          <button
            type="button"
            onClick={editing ? onSave : onEdit}
            className="inline-flex min-h-10 items-center gap-2 rounded-md border border-[#d7e3f1] px-3 text-sm font-extrabold text-[#145DA0] transition hover:bg-[#eef6ff]"
          >
            {editing ? <Save size={16} /> : <Edit3 size={16} />}
            {editing ? "Enregistrer" : "Modifier"}
          </button>
        )}
      </div>

      {editing ? (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            onSave();
          }}
          className="mt-5 grid gap-4"
        >
          <label>
            <span className="mb-2 block text-sm font-extrabold text-[#182433]">Bio</span>
            <textarea
              value={form.bio}
              onChange={(event) => onFormChange({ ...form, bio: event.target.value })}
              rows={4}
              className="w-full resize-none rounded-lg border border-[#eadfd3] bg-[#fbfaf8] px-4 py-3 text-sm leading-6 text-[#182433] outline-none focus:border-[#145DA0]"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Ville" value={form.ville} onChange={(value) => onFormChange({ ...form, ville: value })} />
            <Field label="Quartier" value={form.quartier} onChange={(value) => onFormChange({ ...form, quartier: value })} />
            <Field label="Nom de l'atelier" value={form.atelier} onChange={(value) => onFormChange({ ...form, atelier: value })} />
            <Field
              label="Années d'expérience"
              type="number"
              value={form.experience}
              onChange={(value) => onFormChange({ ...form, experience: value })}
            />
          </div>

          <div className="rounded-lg border border-[#eadfd3] bg-white p-4">
            <button
              type="button"
              onClick={() => {
                if (showPasswordForm) {
                  onFormChange({
                    ...form,
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                  });
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
                  onChange={(value) => onFormChange({ ...form, currentPassword: value })}
                  error={passwordErrors.currentPassword}
                />
                <Field
                  label="Nouveau mot de passe"
                  type="password"
                  value={form.newPassword}
                  onChange={(value) => onFormChange({ ...form, newPassword: value })}
                  error={passwordErrors.newPassword}
                />
                <Field
                  label="Confirmer le nouveau mot de passe"
                  type="password"
                  value={form.confirmPassword}
                  onChange={(value) => onFormChange({ ...form, confirmPassword: value })}
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

          <div className="flex flex-wrap gap-3">
            <button className="inline-flex min-h-11 items-center gap-2 rounded-md bg-[#145DA0] px-4 text-sm font-extrabold text-white transition hover:bg-[#0f4b82]">
              <Save size={17} />
              Enregistrer
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="inline-flex min-h-11 items-center gap-2 rounded-md border border-[#eadfd3] px-4 text-sm font-extrabold text-[#182433] transition hover:bg-[#fbfaf8]"
            >
              <X size={17} />
              Annuler
            </button>
          </div>
        </form>
      ) : (
        <>
          <p className="mt-4 text-sm font-semibold leading-7 text-gray-600">
            {artisan.bio || "Bio non renseignée."}
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {details.map(({ icon: Icon, label, value }) => (
              <div key={label} className="rounded-lg bg-[#fbfaf8] px-4 py-3">
                <p className="flex items-center gap-2 text-xs font-extrabold text-gray-400">
                  <Icon size={15} />
                  {label}
                </p>
                <p className="mt-1 text-sm font-extrabold text-[#182433]">
                  {value || "Non renseigné"}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
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
        className={`min-h-11 w-full rounded-lg border bg-[#fbfaf8] px-4 text-sm font-semibold text-[#182433] outline-none ${
          error ? "border-red-500 focus:border-red-500" : "border-[#eadfd3] focus:border-[#145DA0]"
        }`}
      />
      {error && <p className="mt-1 text-xs font-bold text-red-600">{error}</p>}
    </label>
  );
}
