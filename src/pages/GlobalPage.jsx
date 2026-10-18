import { ErrorState, StaleNotice } from '../components/common/ErrorState';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { GlobalSummary } from '../components/crypto/GlobalSummary';
import { useApiResource } from '../hooks/useApiResource';
import { usePageTitle } from '../hooks/usePageTitle';
import { getGlobalData } from '../services/cryptoApi';
import { formatDateTime, formatTime } from '../utils/formatters';
import { useLanguage } from '../context/useLanguage';

const loadGlobal = ({ force }) => getGlobalData({ force });

export const GlobalPage = () => {
  const { t, language, errorMessage } = useLanguage();
  usePageTitle(t('Resumen global'));
  const { data, loading, error, updatedAt, refetch } = useApiResource('global', loadGlobal, {
    refreshMs: 120000,
  });

  return (
    <div className="space-y-8">
      <header>
        <h1>{t('Resumen global del mercado')}</h1>
        <p className="mt-2 max-w-prose text-muted">
          {t('Indicadores agregados de todo el mercado cripto, en USD, según CoinGecko.')}
        </p>
      </header>

      {loading && <LoadingSpinner label={t('Cargando resumen global…')} />}
      {error && !data && (
        <ErrorState title={t('No se pudo cargar el resumen global')} message={errorMessage(error)} onRetry={refetch} />
      )}
      {error && data && <StaleNotice message={errorMessage(error)} timeLabel={formatTime(updatedAt, language)} onRetry={refetch} />}

      {data && (
        <section aria-label={t('Indicadores globales')}>
          <GlobalSummary data={data} />
          <p className="mt-4 text-sm text-muted">
            {t('Última actualización de CoinGecko:')} <span className="num">{formatDateTime(data.updatedAt, language)}</span>
            {t('. Los datos globales se actualizan aproximadamente cada 10 minutos.')}
          </p>
        </section>
      )}
    </div>
  );
};
