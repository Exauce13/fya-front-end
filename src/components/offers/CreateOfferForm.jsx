import { useState } from "react";

import { serviceCategories } from "../../data/serviceCategories";

const initialState = {
  title: "",
  category: "",
  location: "",
  budget: "",
  description: "",
  photos: [],
};

export default function CreateOfferForm({ initialOffer, onCancel, onSubmit }) {
  const [form, setForm] = useState(() => {
    if (!initialOffer) return initialState;
    return {
      title: initialOffer.title || "",
      category: initialOffer.category || "",
      location: initialOffer.location || "",
      budget: initialOffer.budget || "",
      description: initialOffer.description || "",
      photos: initialOffer.photos || [],
    };
  });

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(form);
  };

  const attachPhotos = (files) => {
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        setForm((current) => ({
          ...current,
          photos: [...current.photos, { name: file.name, src: reader.result }],
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (photoName) => {
    setForm((current) => ({
      ...current,
      photos: current.photos.filter((photo) => photo.name !== photoName),
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 rounded-xl border border-[#eadfd3] bg-[#fbfaf8] p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-extrabold text-[#182433]">
            {initialOffer ? "Modifier l'appel d'offres" : "Publier un appel d'offres"}
          </h2>
          <p className="mt-1 text-sm font-medium text-gray-500">
            Renseignez les informations essentielles du besoin.
          </p>
        </div>
        <button type="button" onClick={onCancel} className="text-sm font-extrabold text-gray-500">
          Annuler
        </button>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <Field label="Titre du besoin">
          <input
            required
            value={form.title}
            onChange={(event) => updateField("title", event.target.value)}
            className="h-12 w-full rounded-lg border border-[#eadfd3] bg-white px-4 outline-none focus:border-[#C96B2C]"
            placeholder="Ex: Construction d'une étagère"
          />
        </Field>

        <Field label="Catégorie / métier concerné">
          <select
            required
            value={form.category}
            onChange={(event) => updateField("category", event.target.value)}
            className="h-12 w-full rounded-lg border border-[#eadfd3] bg-white px-4 outline-none focus:border-[#C96B2C]"
          >
            <option value="">Sélectionnez une catégorie</option>
            {serviceCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Ville">
          <input
            required
            value={form.location}
            onChange={(event) => updateField("location", event.target.value)}
            className="h-12 w-full rounded-lg border border-[#eadfd3] bg-white px-4 outline-none focus:border-[#C96B2C]"
            placeholder="Cotonou"
          />
        </Field>

        <Field label="Budget">
          <input
            required
            type="number"
            min="0"
            value={form.budget}
            onChange={(event) => updateField("budget", event.target.value)}
            className="h-12 w-full rounded-lg border border-[#eadfd3] bg-white px-4 outline-none focus:border-[#C96B2C]"
            placeholder="500000"
          />
        </Field>

        <Field label="Description" className="md:col-span-2">
          <textarea
            rows={4}
            value={form.description}
            onChange={(event) => updateField("description", event.target.value)}
            className="w-full resize-none rounded-lg border border-[#eadfd3] bg-white px-4 py-3 outline-none focus:border-[#C96B2C]"
            placeholder="Décrivez le travail attendu, les dimensions, matériaux ou contraintes..."
          />
        </Field>

        <Field label="Photos liées à l'appel d'offre" className="md:col-span-2">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(event) => attachPhotos(event.target.files)}
            className="block w-full rounded-lg border border-dashed border-[#C96B2C]/45 bg-white px-4 py-4 text-sm font-semibold text-gray-600 file:mr-4 file:rounded-lg file:border-0 file:bg-[#C96B2C] file:px-4 file:py-2 file:text-sm file:font-extrabold file:text-white"
          />
          {form.photos.length > 0 && (
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {form.photos.map((photo) => (
                <figure key={photo.name} className="overflow-hidden rounded-lg border border-[#eadfd3] bg-white">
                  <img src={photo.src} alt={photo.name} className="h-64 w-full bg-[#f6f2ed] object-contain" />
                  <figcaption className="flex items-center justify-between gap-2 px-3 py-2 text-xs font-semibold text-gray-600">
                    <span className="truncate">{photo.name}</span>
                    <button
                      type="button"
                      onClick={() => removePhoto(photo.name)}
                      className="font-extrabold text-red-500"
                    >
                      Retirer
                    </button>
                  </figcaption>
                </figure>
              ))}
            </div>
          )}
        </Field>
      </div>

      <button className="mt-5 min-h-12 rounded-lg bg-[#C96B2C] px-6 text-sm font-extrabold text-white transition hover:bg-[#b65e23]">
        {initialOffer ? "Enregistrer les modifications" : "Publier l'appel d'offres"}
      </button>
    </form>
  );
}

function Field({ label, className = "", children }) {
  return (
    <label className={className}>
      <span className="mb-2 block text-sm font-extrabold text-[#182433]">{label}</span>
      {children}
    </label>
  );
}
