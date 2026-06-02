import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import illusArtisan from "../../assets/images/artiIllus.webp";
import illusClient from "../../assets/images/cltIllus.webp";

export default function RegisterChoiceCard() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);

  const handleChoice = (type) => {
    setSelected(type);

    setTimeout(() => {
      navigate(
        type === "artisan"
          ? "/artisan-register"
          : "/client-register"
      );
    }, 300);
  };

  return (
    <div className="min-h-screen bg-[#F6F3EE] flex items-center justify-center px-4 py-10">

      <div className="w-full max-w-4xl bg-[#FCFBF8] rounded-[32px] border border-[#EDE8E1] shadow-sm p-8 md:p-12">

        {/* HEADER */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-[#1A1A1A]">
            Rejoignez la communauté FYA
          </h1>

          <p className="text-slate-500 mt-3">
            Choisissez votre type de compte
          </p>
        </div>

        {/* CHOIX */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-8">

          {/* ARTISAN */}
          <button
            onClick={() => handleChoice("artisan")}
            className={`
              w-full
              max-w-[280px]
              min-h-[420px]
              bg-white
              rounded-xl
              border-2
              p-6
              shadow-sm
              transition-all
              duration-300
              flex
              flex-col
              items-center
              justify-center

              ${
                selected === "artisan"
                  ? "border-[#F97316] bg-orange-50 scale-105 shadow-lg"
                  : "border-slate-100 hover:border-[#F97316] hover:shadow-lg hover:-translate-y-2"
              }
            `}
          >
            <img
              src={illusArtisan}
              alt="Artisan"
              className="w-[200px] h-[200px] object-contain"
            />

            <p className="text-gray-500 text-sm mt-4">
              Je suis un
            </p>

            <h2 className="text-3xl font-bold text-slate-900">
              Artisan
            </h2>

            <p className="text-center text-sm text-slate-500 mt-4 leading-relaxed">
              Développez votre activité et trouvez de nouveaux clients grâce à FYA.
            </p>
          </button>

          {/* CLIENT */}
          <button
            onClick={() => handleChoice("client")}
            className={`
              w-full
              max-w-[280px]
              min-h-[420px]
              bg-white
              rounded-xl
              border-2
              p-6
              shadow-sm
              transition-all
              duration-300
              flex
              flex-col
              items-center
              justify-center

              ${
                selected === "client"
                  ? "border-[#F97316] bg-orange-50 scale-105 shadow-lg"
                  : "border-slate-100 hover:border-[#F97316] hover:shadow-lg hover:-translate-y-2"
              }
            `}
          >
            <img
              src={illusClient}
              alt="Client"
              className="w-[200px] h-[200px] object-contain"
            />

            <p className="text-gray-500 text-sm mt-4">
              Je suis un
            </p>

            <h2 className="text-3xl font-bold text-slate-900">
              Client
            </h2>

            <p className="text-center text-sm text-slate-500 mt-4 leading-relaxed">
              Trouvez rapidement les meilleurs artisans pour tous vos besoins.
            </p>
          </button>

        </div>

        {/* FOOTER */}
        <div className="text-center mt-12">
          <p className="text-slate-500">
            Déjà un compte ?
            <Link
              to="/login"
              className="ml-2 font-semibold text-[#1A3A5C] hover:text-[#F97316] transition-colors"
            >
              Se connecter
            </Link>
          </p>
        </div>

      </div>

    </div>
  );
}