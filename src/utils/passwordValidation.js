export const getPasswordStrength = (password) => {
  if (!password) return "";

  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[@$!%*?&_\-#]/.test(password)) score++;

  if (score <= 3) return "Faible";
  if (score === 4) return "Moyen";
  return "Fort";
};

export const passwordRequirementRules = [
  {
    key: "minLength",
    label: "Au moins 8 caractères",
    test: (password) => String(password || "").length >= 8,
  },
  {
    key: "maxLength",
    label: "Maximum 12 caractères",
    test: (password) => String(password || "").length > 0 && String(password || "").length <= 12,
  },
  {
    key: "uppercase",
    label: "Une lettre majuscule",
    test: (password) => /[A-Z]/.test(password || ""),
  },
  {
    key: "lowercase",
    label: "Une lettre minuscule",
    test: (password) => /[a-z]/.test(password || ""),
  },
  {
    key: "digit",
    label: "Un chiffre",
    test: (password) => /\d/.test(password || ""),
  },
  {
    key: "special",
    label: "Un caractère spécial @$!%*?&_-#",
    test: (password) => /[@$!%*?&_\-#]/.test(password || ""),
  },
];

export const getPasswordRequirementStates = (password) =>
  passwordRequirementRules.map((rule) => ({
    ...rule,
    valid: rule.test(password),
  }));

export const isPasswordValid = (password) =>
  getPasswordRequirementStates(password).every((rule) => rule.valid);

export const validatePasswordChange = ({
  currentPassword,
  newPassword,
  confirmPassword,
}) => {
  const errors = {};
  const hasPasswordInput = currentPassword || newPassword || confirmPassword;

  if (!hasPasswordInput) return errors;

  if (!currentPassword) {
    errors.currentPassword = "Veuillez saisir votre mot de passe actuel";
  }

  if (!newPassword) {
    errors.newPassword = "Veuillez saisir un nouveau mot de passe";
  } else if (!isPasswordValid(newPassword)) {
    errors.newPassword = "Le mot de passe ne respecte pas toutes les conditions";
  } else if (currentPassword && currentPassword === newPassword) {
    errors.newPassword = "Le nouveau mot de passe doit être différent de l'actuel";
  }

  if (!confirmPassword) {
    errors.confirmPassword = "Veuillez confirmer le nouveau mot de passe";
  } else if (newPassword && newPassword !== confirmPassword) {
    errors.confirmPassword = "Les mots de passe ne correspondent pas";
  }

  return errors;
};

export const hasPasswordErrors = (errors) => Object.keys(errors).length > 0;
