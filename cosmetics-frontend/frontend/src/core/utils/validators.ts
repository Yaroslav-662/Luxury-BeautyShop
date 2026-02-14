export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateEmail = (email: string) => emailRegex.test(email);

export const validatePassword = (password: string) =>
  password.length >= 6 && /\d/.test(password);
