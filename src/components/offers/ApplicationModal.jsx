import { FileText, X } from "lucide-react";
import { useState } from "react";

export default function ApplicationModal({
  offer,
  loading = false,
  onClose,
  onSubmit,
}) {
  const [description, setDescription] = useState("");
  const [devisFile, setDevisFile] = useState(null);
  const [error, setError] = useState("");

  if (!offer) return null;

  const submitApplication = (event) => {
    event.preventDefault();
    const trimmedDescription = description.trim();

    if (trimmedDescription.length < 10) {
      setError("La description doit contenir au moins 10 caractères.");
      return;
    }

    if (devisFile) {
      const isPdf = devisFile.type === "application/pdf" || /\.pdf$/i.test(devisFile.name);

      if (!isPdf) {
        setError("Le devis doit être un fichier PDF.");
        return;
      }
    }

    setError("");
    onSubmit({
      description: trimmedDescription,
      devis_propose: devisFile || undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[#182433]/45 px-4 py-6">
      <form
        onSubmit={submitApplication}
        className="w-full max-w-xl rounded-xl border border-[#eadfd3] bg-white p-5 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-extrabold text-[#182433]">Postuler à l'appel d'offres</h2>
            <p className="mt-1 text-sm font-semibold text-gray-500">{offer.title}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-[#eadfd3] text-gray-500 transition hover:bg-[#fbfaf8]"
            aria-label="Fermer"
          >
            <X size={18} />
          </button>
        </div>

        <label className="mt-5 block">
          <span className="mb-2 block text-sm font-extrabold text-[#182433]">
            Description de votre candidature
          </span>
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={5}
            className="w-full resize-none rounded-lg border border-[#eadfd3] bg-white px-4 py-3 text-sm font-semibold text-[#182433] outline-none focus:border-[#145DA0]"
            placeholder="Expliquez votre approche, votre disponibilité et ce qui vous qualifie pour ce besoin..."
            required
            minLength={10}
          />
        </label>

        <label className="mt-4 block">
          <span className="mb-2 block text-sm font-extrabold text-[#182433]">
            Devis PDF
          </span>
          <div className="rounded-lg border border-dashed border-[#c7d7e8] bg-[#f6fbff] p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-white text-[#145DA0]">
                  <FileText size={19} />
                </span>
                <div>
                  <p className="text-sm font-extrabold text-[#182433]">
                    {devisFile?.name || "Joindre le devis au format PDF"}
                  </p>
                  <p className="mt-0.5 text-xs font-semibold text-gray-500">
                    Le propriétaire pourra télécharger ce document.
                  </p>
                </div>
              </div>
              {devisFile && (
                <button
                  type="button"
                  onClick={() => setDevisFile(null)}
                  className="min-h-9 rounded-lg border border-[#eadfd3] bg-white px-3 text-xs font-extrabold text-[#182433] transition hover:bg-[#fbfaf8]"
                >
                  Retirer
                </button>
              )}
            </div>
            <input
              type="file"
              accept="application/pdf,.pdf"
              onChange={(event) => setDevisFile(event.target.files?.[0] || null)}
              className="mt-3 block w-full text-sm font-semibold text-[#182433] file:mr-4 file:min-h-10 file:rounded-lg file:border-0 file:bg-[#145DA0] file:px-4 file:text-sm file:font-extrabold file:text-white"
            />
          </div>
        </label>

        {error && (
          <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm font-bold text-red-600">
            {error}
          </p>
        )}

        <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="min-h-11 rounded-lg border border-[#eadfd3] px-5 text-sm font-extrabold text-[#182433] transition hover:bg-[#fbfaf8]"
          >
            Annuler
          </button>
          <button
            disabled={loading}
            className="min-h-11 rounded-lg bg-[#145DA0] px-5 text-sm font-extrabold text-white transition hover:bg-[#104f88] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Envoi en cours..." : "Envoyer la candidature"}
          </button>
        </div>
      </form>
    </div>
  );
}
