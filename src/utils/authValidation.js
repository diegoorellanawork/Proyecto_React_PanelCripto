// Validaciones de los formularios de Iniciar sesión y Registrarse.
// Solo comprueban el formato en el navegador: no consultan ni guardan nada.
export const MIN_PASSWORD_LENGTH = 8;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const validateEmail = (value, t) => {
  const email = value.trim();
  if (!email) return t('Ingresa tu correo electrónico.');
  if (!EMAIL_PATTERN.test(email)) return t('Ingresa un correo válido, por ejemplo nombre@dominio.com.');
  return '';
};

// Devuelve un objeto { campo: mensaje } solo con los campos que tienen error.
const compact = (errors) => Object.fromEntries(Object.entries(errors).filter(([, message]) => message));

export const LOGIN_FIELDS = ['email', 'password'];

export const validateLogin = ({ email, password }, t = (text) => text) =>
  compact({
    email: validateEmail(email, t),
    password: password ? '' : t('Ingresa tu contraseña.'),
  });

export const REGISTER_FIELDS = ['name', 'email', 'password', 'confirmPassword', 'terms'];

export const validateRegister = ({ name, email, password, confirmPassword, terms }, t = (text) => text) => {
  let passwordError = '';
  if (!password) passwordError = t('Crea una contraseña.');
  else if (password.length < MIN_PASSWORD_LENGTH) {
    passwordError = t('La contraseña debe tener al menos {count} caracteres.', { count: MIN_PASSWORD_LENGTH });
  }

  let confirmError = '';
  if (!confirmPassword) confirmError = t('Confirma tu contraseña.');
  else if (confirmPassword !== password) confirmError = t('Las contraseñas no coinciden.');

  return compact({
    name: name.trim() ? '' : t('Escribe tu nombre completo.'),
    email: validateEmail(email, t),
    password: passwordError,
    confirmPassword: confirmError,
    terms: terms ? '' : t('Debes aceptar los términos y condiciones para continuar.'),
  });
};
