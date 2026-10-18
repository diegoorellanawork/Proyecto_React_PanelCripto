import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthShell, ErrorSummary, UnavailableNotice } from '../components/auth/AuthShell';
import { CheckboxField, PasswordField, TextField } from '../components/auth/FormFields';
import { usePageTitle } from '../hooks/usePageTitle';
import { MIN_PASSWORD_LENGTH, REGISTER_FIELDS, validateRegister } from '../utils/authValidation';
import { useLanguage } from '../context/useLanguage';

const EMPTY = { name: '', email: '', password: '', confirmPassword: '', terms: false };

export const RegisterPage = () => {
  const { t } = useLanguage();
  usePageTitle(t('Registrarse'));

  // Estado solo en memoria: no se envía ni se guarda en ningún lugar.
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [attempted, setAttempted] = useState(false);
  const [unavailable, setUnavailable] = useState(false);

  const visibleErrors = attempted ? validateRegister(values, t) : errors;

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    const next = { ...values, [name]: type === 'checkbox' ? checked : value };
    setValues(next);
    setUnavailable(false);
    if (attempted) setErrors(validateRegister(next, t));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const found = validateRegister(values, t);
    const firstInvalid = REGISTER_FIELDS.find((name) => found[name]);

    if (firstInvalid) {
      setErrors(found);
      setAttempted(true);
      setUnavailable(false);
      event.currentTarget.elements.namedItem(firstInvalid)?.focus();
      return;
    }

    // Campos válidos: no hay registro. Se descartan las contraseñas de la memoria y se informa.
    setErrors({});
    setAttempted(false);
    setValues((current) => ({ ...current, password: '', confirmPassword: '' }));
    setUnavailable(true);
  };

  return (
    <AuthShell
      title={t('Registrarse')}
      description={t('Completa los datos para crear tu cuenta.')}
      footer={
        <>
          {t('¿Ya tienes cuenta?')}{' '}
          <Link to="/iniciar-sesion" className="font-semibold underline underline-offset-4">
            {t('Inicia sesión')}
          </Link>
        </>
      }
    >
      <form noValidate aria-label={t('Registrarse')} onSubmit={handleSubmit} className="mt-6 space-y-6">
        <p className="text-muted">{t('Todos los campos son obligatorios.')}</p>

        <ErrorSummary count={Object.keys(visibleErrors).length} />

        <TextField
          label={t('Nombre completo')}
          name="name"
          autoComplete="name"
          value={values.name}
          onChange={handleChange}
          error={visibleErrors.name}
        />

        <TextField
          label={t('Correo electrónico')}
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          spellCheck={false}
          value={values.email}
          onChange={handleChange}
          error={visibleErrors.email}
        />

        <PasswordField
          label={t('Contraseña')}
          name="password"
          autoComplete="new-password"
          hint={t('Mínimo {count} caracteres.', { count: MIN_PASSWORD_LENGTH })}
          value={values.password}
          onChange={handleChange}
          error={visibleErrors.password}
        />

        <PasswordField
          label={t('Confirmar contraseña')}
          name="confirmPassword"
          autoComplete="new-password"
          value={values.confirmPassword}
          onChange={handleChange}
          error={visibleErrors.confirmPassword}
        />

        <CheckboxField
          label={t('Acepto los términos y condiciones')}
          name="terms"
          checked={values.terms}
          onChange={handleChange}
          error={visibleErrors.terms}
        />

        <button type="submit" className="btn btn-primary w-full">
          {t('Crear cuenta')}
        </button>

        <UnavailableNotice show={unavailable} title={t('El registro no está disponible en esta versión.')}>
          <p>
            {t('Tus datos cumplen el formato requerido, pero no se enviaron a ningún servidor, no se guardaron y no se creó ninguna cuenta. Puedes seguir consultando el')}{' '}
            <Link to="/" className="font-semibold underline underline-offset-4">
              {t('Mercado')}
            </Link>{' '}
            {t('sin registrarte.')}
          </p>
        </UnavailableNotice>
      </form>
    </AuthShell>
  );
};
