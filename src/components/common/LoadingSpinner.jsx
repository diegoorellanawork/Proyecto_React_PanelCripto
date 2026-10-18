import { useLanguage } from '../../context/useLanguage';

export const LoadingSpinner = ({ label }) => {
  const { t } = useLanguage();
  const loadingLabel = label ?? t('Cargando datos del mercado…');
  return (
    <div role="status" className="flex flex-col items-center justify-center gap-4 py-16">
      <div
        aria-hidden="true"
        className="h-10 w-10 rounded-full border-4 border-line border-t-teal motion-safe:animate-spin"
      />
      <p className="text-muted">{t(loadingLabel)}</p>
    </div>
  );
};

// Esqueleto para listados de tarjetas. El texto de carga es visible y anunciado.
export const CardGridSkeleton = ({ count = 8, label }) => {
  const { t } = useLanguage();
  return (
    <div role="status">
      <p className="mb-4 text-muted">{t(label ?? 'Cargando datos del mercado…')}</p>
      <div
        aria-hidden="true"
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        {Array.from({ length: count }, (_, index) => (
          <div key={index} className="card p-4">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-line motion-safe:animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-2/3 rounded bg-line motion-safe:animate-pulse" />
                <div className="h-4 w-1/3 rounded bg-line motion-safe:animate-pulse" />
              </div>
            </div>
            <div className="mt-6 h-7 w-1/2 rounded bg-line motion-safe:animate-pulse" />
            <div className="mt-4 h-4 w-full rounded bg-line motion-safe:animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
};
