import { AlertIcon } from './Icons';
import { useLanguage } from '../../context/useLanguage';

// Error anunciado a lectores de pantalla (role="alert") con acción de reintento.
export const ErrorState = ({ title = 'No se pudieron cargar los datos', message, onRetry, busy = false }) => {
  const { t } = useLanguage();
  return (
    <div
      role="alert"
      className="card flex flex-col items-start gap-4 border-negative p-6 sm:flex-row sm:items-center"
    >
      <AlertIcon className="h-8 w-8 shrink-0 text-negative" width={32} height={32} />
      <div className="flex-1">
        <h2 className="text-[17px]">{t(title)}</h2>
        {message && <p className="mt-1 text-muted">{t(message)}</p>}
      </div>
      {onRetry && (
        <button type="button" onClick={onRetry} disabled={busy} className="btn btn-primary">
          {t('Reintentar')}
        </button>
      )}
    </div>
  );
};

// Aviso cuando una actualización falló pero se conservan datos anteriores.
export const StaleNotice = ({ message, timeLabel, onRetry }) => {
  const { t } = useLanguage();
  return (
    <div
      role="alert"
      className="mb-6 flex flex-col gap-3 rounded-field border border-negative bg-error-soft p-4 sm:flex-row sm:items-center"
    >
      <AlertIcon className="h-5 w-5 shrink-0 text-negative" />
      <p className="flex-1 text-navy">
        {t(message)} {t('Estás viendo datos anteriores')}{timeLabel ? t(' (obtenidos a las {time})', { time: timeLabel }) : ''}{t('; pueden no reflejar el precio actual.')}
      </p>
      {onRetry && (
        <button type="button" onClick={onRetry} className="btn btn-secondary">
          {t('Reintentar')}
        </button>
      )}
    </div>
  );
};
