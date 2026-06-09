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
  } else {
    if (newPassword.length < 8) {
      errors.newPassword = "Le mot de passe doit contenir au moins 8 caractères";
    } else if (newPassword.length > 12) {
      errors.newPassword = "Le mot de passe ne doit pas dépasser 12 caractères";
    } else if (!/[A-Z]/.test(newPassword)) {
      errors.newPassword = "Le mot de passe doit contenir une majuscule";
    } else if (!/[a-z]/.test(newPassword)) {
      errors.newPassword = "Le mot de passe doit contenir une minuscule";
    } else if (!/\d/.test(newPassword)) {
      errors.newPassword = "Le mot de passe doit contenir un chiffre";
    } else if (!/[@$!%*?&_\-#]/.test(newPassword)) {
      errors.newPassword = "Le mot de passe doit contenir un caractère spécial";
    } else if (currentPassword && currentPassword === newPassword) {
      errors.newPassword = "Le nouveau mot de passe doit être différent de l'actuel";
    }
  }

  if (!confirmPassword) {
    errors.confirmPassword = "Veuillez confirmer le nouveau mot de passe";
  } else if (newPassword && newPassword !== confirmPassword) {
    errors.confirmPassword = "Les mots de passe ne correspondent pas";
  }

  return errors;
};

export const hasPasswordErrors = (errors) => Object.keys(errors).length > 0;
