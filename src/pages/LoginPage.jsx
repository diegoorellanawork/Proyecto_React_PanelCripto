import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthShell, ErrorSummary, UnavailableNotice } from '../components/auth/AuthShell';
import { CheckboxField, PasswordField, TextField } from '../components/auth/FormFields';
import { usePageTitle } from '../hooks/usePageTitle';
import { LOGIN_FIELDS, validateLogin } from '../utils/authValidation';
import { useLanguage } from '../context/useLanguage';

const EMPTY = { email: '', password: '' };

export const LoginPage = () => {
  const { t } = useLanguage();
  usePageTitle(t('Iniciar sesión'));

  // Estado solo en memoria: no se envía ni se guarda en ningún lugar.
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [attempted, setAttempted] = useState(false);
  const [unavailable, setUnavailable] = useState(false);

  const visibleErrors = attempted ? validateLogin(values, t) : errors;

  const handleChange = (event) => {
    const { name, value } = event.target;
    const next = { ...values, [name]: value };
    setValues(next);
    setUnavailable(false);
    if (attempted) setErrors(validateLogin(next, t));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const found = validateLogin(values, t);
    const firstInvalid = LOGIN_FIELDS.find((name) => found[name]);

    if (firstInvalid) {
      setErrors(found);
      setAttempted(true);
      setUnavailable(false);
      event.currentTarget.elements.namedItem(firstInvalid)?.focus();
      return;
    }

    // Campos válidos: no hay autenticación. Se descarta la contraseña de la memoria y se informa.
    setErrors({});
    setAttempted(false);
    setValues((current) => ({ ...current, password: '' }));
    setUnavailable(true);
  };

  return (
    <AuthShell
      title={t('Iniciar sesión')}
      description={t('Ingresa tu correo y tu contraseña.')}
      footer={
        <>
          {t('¿No tienes cuenta?')}{' '}
          <Link to="/registrarse" className="font-semibold underline underline-offset-4">
            {t('Regístrate')}
          </Link>
        </>
      }
    >
      <form noValidate aria-label={t('Iniciar sesión')} onSubmit={handleSubmit} className="mt-6 space-y-6">
        <p className="text-muted">{t('Todos los campos son obligatorios.')}</p>

        <ErrorSummary count={Object.keys(visibleErrors).length} />

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
          autoComplete="current-password"
          value={values.password}
          onChange={handleChange}
          error={visibleErrors.password}
        />

        <CheckboxField label={t('Recordarme')} name="remember" />

        <button type="submit" className="btn btn-primary w-full">
          {t('Iniciar sesión')}
        </button>

        <UnavailableNotice show={unavailable} title={t('El inicio de sesión no está disponible en esta versión.')}>
          <p>
            {t('Revisamos el formato de tus datos, pero no se enviaron a ningún servidor, no se guardaron y no se inició ninguna sesión. Puedes seguir consultando el')}{' '}
            <Link to="/" className="font-semibold underline underline-offset-4">
              {t('Mercado')}
            </Link>{' '}
            {t('sin cuenta.')}
          </p>
        </UnavailableNotice>
      </form>
    </AuthShell>
  );
};
