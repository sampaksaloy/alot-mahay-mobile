export const isValidEmail = (value) => !!value && value.includes('@');

export const isValidPhone = (value) => {
  if (!value) return false;
  const digitsOnly = value.replace(/[^0-9]/g, '');
  return digitsOnly.length >= 10;
};

export const isValidPassword = (value) => !!value && value.length >= 6;

export const passwordsMatch = (password, confirmPassword) => password === confirmPassword;
