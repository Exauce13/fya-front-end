import { CheckCircle2, Circle } from "lucide-react";

import { getPasswordRequirementStates, getPasswordStrength } from "../../utils/passwordValidation";

export default function PasswordRequirements({
  password = "",
  confirmation = "",
  showConfirmation = false,
  confirmationOnly = false,
  currentPassword = "",
  className = "",
}) {
  const requirements = getPasswordRequirementStates(password);
  const hasPassword = Boolean(password);
  const confirmationMatches = Boolean(confirmation) && password === confirmation;
  const differentFromCurrent = !currentPassword || !password || currentPassword !== password;
  const strength = getPasswordStrength(password);

  const confirmationItem = {
    key: "confirmation",
    label: "Confirmation identique au nouveau mot de passe",
    valid: confirmationMatches,
  };

  const items = confirmationOnly
    ? [confirmationItem]
    : [
        ...requirements,
        ...(currentPassword
          ? [{
              key: "different",
              label: "Différent du mot de passe actuel",
              valid: Boolean(password) && differentFromCurrent,
            }]
          : []),
        ...(showConfirmation ? [confirmationItem] : []),
      ];

  return (
    <div className={`rounded-lg border border-[#d7e3f1] bg-[#f6fbff] p-3 ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-extrabold text-[#182433]">
          {confirmationOnly ? "Confirmation du mot de passe" : "Conditions du mot de passe"}
        </p>
        {hasPassword && !confirmationOnly && (
          <span className="rounded-full bg-white px-2 py-1 text-[11px] font-black text-[#145DA0]">
            Sécurité : {strength}
          </span>
        )}
      </div>
      <ul className="mt-2 grid gap-1.5 text-xs font-bold text-gray-600 sm:grid-cols-2">
        {items.map((item) => {
          const Icon = item.valid ? CheckCircle2 : Circle;

          return (
            <li key={item.key} className={item.valid ? "flex items-center gap-2 text-[#267A39]" : "flex items-center gap-2 text-gray-500"}>
              <Icon size={14} className={item.valid ? "text-[#267A39]" : "text-gray-400"} />
              {item.label}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
