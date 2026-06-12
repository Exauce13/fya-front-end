import logo from "../../assets/images/logo.webp";

export default function RegisterSuccessDialog({ open, message, onConfirm }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-black/45 px-4">
      <section className="w-full max-w-md rounded-2xl border border-[#eadfd3] bg-white p-6 text-center shadow-xl">
        <img src={logo} alt="FYA" className="mx-auto h-16 w-auto" />
        <h2 className="mt-5 text-2xl font-extrabold text-[#182433]">
          Inscription réussie
        </h2>
        <p className="mt-3 text-sm font-semibold leading-6 text-gray-600">
          {message || "Votre compte a été créé. Veuillez valider votre email pour finaliser la vérification."}
        </p>
        <button
          type="button"
          onClick={onConfirm}
          className="mt-6 min-h-11 w-full rounded-lg bg-[#145DA0] px-5 text-sm font-extrabold text-white transition hover:bg-[#0f4b82]"
        >
          OK
        </button>
      </section>
    </div>
  );
}
