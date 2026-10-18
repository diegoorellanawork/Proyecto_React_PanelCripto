import { InfoIcon } from '../common/Icons';
import { useLanguage } from '../../context/useLanguage';

// Estructura común de Iniciar sesión y Registrarse: tarjeta, aviso de demostración y enlace alterno.
export const AuthShell = ({ title, description, footer, children }) => {
  const { t } = useLanguage();
  return (
    <div className="mx-auto w-full max-w-md">
      <div className="card p-6 sm:p-8">
        <header>
          <h1>{title}</h1>
          <p className="mt-2 text-muted">{description}</p>
        </header>

        <div className="mt-6 flex items-start gap-3 rounded-field border border-line bg-page p-4">
          <InfoIcon className="mt-0.5 shrink-0 text-teal" />
          <p>
            <strong className="font-semibold">{t('Versión de demostración.')}</strong> {t('Este formulario valida los campos, pero no envía datos, no crea cuentas ni inicia sesiones.')}
          </p>
        </div>

        {children}
      </div>
      <p className="mt-6 text-center">{footer}</p>
    </div>
  );
};

// Resumen de errores anunciado a lectores de pantalla (la región existe siempre para que el anuncio funcione).
export const ErrorSummary = ({ count }) => {
  const { t } = useLanguage();
  return (
    <div role="alert">
      {count > 0 && (
        <p className="rounded-field border border-negative bg-error-soft p-4 font-medium text-negative">
          {count === 1 ? t('Hay 1 campo por corregir.') : t('Hay {count} campos por corregir.', { count })}{t(' Revisa los mensajes indicados.')}
        </p>
      )}
    </div>
  );
};

// Mensaje claro de que la acción no está disponible; nunca se presenta como éxito.
export const UnavailableNotice = ({ show, title, children }) => (
  <div role="status">
    {show && (
      <div className="flex items-start gap-3 rounded-field border border-navy bg-page p-4">
        <InfoIcon className="mt-0.5 shrink-0 text-teal" />
        <div>
          <p className="font-semibold">{title}</p>
          <div className="mt-1 text-muted">{children}</div>
        </div>
      </div>
    )}
  </div>
);
