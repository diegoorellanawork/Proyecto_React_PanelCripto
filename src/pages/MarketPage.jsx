import { useCallback, useState } from 'react';
import { CardGridSkeleton, LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorState, StaleNotice } from '../components/common/ErrorState';
import { SearchBar } from '../components/common/SearchBar';
import { RefreshIcon } from '../components/common/Icons';
import { CoinCard } from '../components/crypto/CoinCard';
import { GlobalSummary } from '../components/crypto/GlobalSummary';
import { useApiResource } from '../hooks/useApiResource';
import { useCryptoData } from '../hooks/useCryptoData';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import { usePageTitle } from '../hooks/usePageTitle';
import { getGlobalData, searchCoins } from '../services/cryptoApi';
import { formatTime } from '../utils/formatters';
import { useLanguage } from '../context/useLanguage';

const loadGlobal = ({ force }) => getGlobalData({ force });
export const MarketPage = () => {
  const { t, language, errorMessage } = useLanguage();
  usePageTitle(t('Mercado'));

  const { coins, hasData, loading, refreshing, error, updatedAt, refetch } = useCryptoData('usd', 100);
  const globalData = useApiResource('global', loadGlobal, { refreshMs: 120000 });

  const [query, setQuery] = useState('');
  const [submitted, setSubmitted] = useState(null);
  const debouncedQuery = useDebouncedValue(query, 400);

  const term = query.trim();
  const needle = term.toLowerCase();
  const localMatches = needle
    ? coins.filter((coin) => coin.name.toLowerCase().includes(needle) || coin.symbol.toLowerCase().includes(needle))
    : coins;

  // Búsqueda remota: solo si no hay coincidencias locales. Con debounce, o de inmediato al pulsar "Buscar".
  const wantsRemote = hasData && term !== '' && localMatches.length === 0;
  const remoteTerm = wantsRemote ? (submitted === term ? term : debouncedQuery.trim()) : '';
  const remoteEnabled = remoteTerm.length >= 2;
  const remoteLoader = useCallback(({ force }) => searchCoins(remoteTerm, { force }), [remoteTerm]);
  const remote = useApiResource(remoteEnabled ? `search:${remoteTerm}` : null, remoteLoader);

  const showingRemote = wantsRemote;

  return (
    <div className="space-y-8">
      <header>
        <h1>{t('Mercado de criptomonedas')}</h1>
        <p className="mt-2 max-w-prose text-muted">
          {t('Precios en USD, variación de 24 horas y capitalización de las 100 principales criptomonedas según CoinGecko.')}
        </p>
      </header>

      <section aria-labelledby="resumen-global">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 id="resumen-global">{t('Resumen global')}</h2>
        </div>
        {globalData.data && <GlobalSummary data={globalData.data} compact />}
        {globalData.loading && <p role="status" className="text-muted">{t('Cargando resumen global…')}</p>}
        {globalData.error && (
          <div role="alert" className="mt-2 flex flex-col gap-3 rounded-field border border-negative bg-error-soft p-4 sm:flex-row sm:items-center">
            <p className="flex-1">
              {t('No se pudo cargar el resumen global.')} {errorMessage(globalData.error)}
              {globalData.data ? t(' Los indicadores mostrados pueden estar desactualizados.') : ''}
            </p>
            <button type="button" onClick={globalData.refetch} className="btn btn-secondary">
              {t('Reintentar')}
            </button>
          </div>
        )}
      </section>

      <section aria-labelledby="listado" className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <h2 id="listado">{t('Criptomonedas')}</h2>
          <SearchBar searchTerm={query} setSearchTerm={setQuery} onSubmit={() => setSubmitted(query.trim())} />
        </div>

        {hasData && (
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted">
            <p>
              {t('Datos de CoinGecko · actualizados a las')} <span className="num">{formatTime(updatedAt, language)}</span>
              {refreshing && t(' · actualizando…')}
            </p>
            <button type="button" onClick={refetch} disabled={refreshing} className="btn btn-secondary !min-h-11 !px-4 !text-sm">
              <RefreshIcon width={16} height={16} />
              {t('Actualizar')}
            </button>
          </div>
        )}

        {loading && <CardGridSkeleton />}

        {error && !hasData && (
          <ErrorState title={t('No se pudo cargar el mercado')} message={errorMessage(error)} onRetry={refetch} />
        )}

        {error && hasData && (
          <StaleNotice message={errorMessage(error)} timeLabel={formatTime(updatedAt, language)} onRetry={refetch} />
        )}

        {hasData && !showingRemote && (
          <>
            <p aria-live="polite" className="text-sm text-muted">
              {term
                ? t('{count} resultado(s) para “{term}”', { count: localMatches.length, term })
                : t('Mostrando {count} criptomonedas', { count: coins.length })}
            </p>
            {coins.length === 0 ? (
              <EmptyState title={t('CoinGecko no devolvió monedas')}>
                <p>{t('Inténtalo de nuevo en unos momentos.')}</p>
              </EmptyState>
            ) : (
              <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {localMatches.map((coin) => (
                  <li key={coin.id} className="flex">
                    <CoinCard coin={coin} />
                  </li>
                ))}
              </ul>
            )}
          </>
        )}

        {hasData && showingRemote && (
          <div className="space-y-4" aria-live="polite">
            <p className="text-muted">
              {t('No hay coincidencias entre las 100 principales para “{term}”.', { term })}
              {remoteEnabled
                ? t(' Mostrando resultados de la búsqueda en CoinGecko.')
                : t(' Escribe al menos 2 caracteres para buscar en CoinGecko.')}
            </p>
            {remote.loading && <LoadingSpinner label={t('Buscando en CoinGecko…')} />}
            {remote.error && (
              <ErrorState title={t('No se pudo completar la búsqueda')} message={errorMessage(remote.error)} onRetry={remote.refetch} />
            )}
            {remoteEnabled && !remote.loading && !remote.error && remote.data && remote.data.length === 0 && (
              <EmptyState title={t('No encontramos monedas que coincidan con tu búsqueda')}>
                <p>{t('Revisa la ortografía o prueba con el símbolo de la moneda.')}</p>
              </EmptyState>
            )}
            {remote.data && remote.data.length > 0 && !remote.error && (
              <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {remote.data.map((coin) => (
                  <li key={coin.id} className="flex">
                    <CoinCard coin={coin} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </section>
    </div>
  );
};
