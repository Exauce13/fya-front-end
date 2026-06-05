import { CheckCircle2, Clock, Wrench } from "lucide-react";

const steps = ["Discussion", "Devis validé", "En cours", "Terminé"];

export default function ServiceContractCard({ service }) {
  return (
    <section className="rounded-xl border border-[#d9e6f4] bg-[#f6fbff] p-4">
      <div className="flex items-start gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-lg bg-[#145DA0]/10 text-[#145DA0]">
          <Wrench size={20} />
        </span>
        <div>
          <h3 className="font-extrabold text-[#182433]">{service.title}</h3>
          <p className="mt-1 text-sm font-semibold text-gray-500">
            Budget estimé : {service.budget}
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-4">
        {steps.map((step, index) => {
          const active = index <= service.currentStep;
          return (
            <div
              key={step}
              className={`rounded-lg border p-3 text-xs font-extrabold ${
                active
                  ? "border-[#267A39]/25 bg-[#E8F7E9] text-[#267A39]"
                  : "border-[#eadfd3] bg-white text-gray-400"
              }`}
            >
              <span className="mb-2 block">
                {active ? <CheckCircle2 size={16} /> : <Clock size={16} />}
              </span>
              {step}
            </div>
          );
        })}
      </div>
    </section>
  );
}
