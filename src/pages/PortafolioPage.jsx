import { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorState, StaleNotice } from '../components/common/ErrorState';
import { StarIcon } from '../components/common/Icons';
import { CardGridSkeleton } from '../components/common/LoadingSpinner';
import { CoinCard } from '../components/crypto/CoinCard';
import { useFavorites } from '../context/useFavorites';
import { useApiResource } from '../hooks/useApiResource';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import { usePageTitle } from '../hooks/usePageTitle';
import { getCoinsByIds } from '../services/cryptoApi';
import { formatTime } from '../utils/formatters';
import { useLanguage } from '../context/useLanguage';

// "Portafolio" = lista temporal de favoritos (solo en memoria). No hay saldos,
// cantidades, precios de compra ni ganancias.
export const PortfolioPage = () => {
  const { t, language, errorMessage } = useLanguage();
  usePageTitle(t('Portafolio'));
  const { favoriteIds, removeFavorite } = useFavorites();

  const currentKey = [...favoriteIds].sort().join(',');
  // Agrupa cambios rápidos (añadir/quitar varias monedas) en una sola petición.
  const idsKey = useDebouncedValue(currentKey, 500);
  const loader = useCallback(({ force }) => getCoinsByIds(idsKey.split(','), 'usd', { force }), [idsKey]);
  const { data, loading, refreshing, error, updatedAt, refetch } = useApiResource(
    currentKey && idsKey ? `favorites:${idsKey}` : null,
    loader,
    { refreshMs: 60000, keepPrevious: true }
  );

  const byId = new Map((data ?? []).map((coin) => [coin.id, coin]));
  const pending = loading || refreshing || idsKey !== currentKey;

  return (
    <div className="space-y-8">
      <header>
        <h1>{t('Portafolio')}</h1>
        <p className="mt-2 max-w-prose text-muted">
          {t('Lista temporal de criptomonedas favoritas para seguimiento. No es una cartera de inversión: no hay saldos, cantidades ni ganancias, y los favoritos se borran al recargar la página.')}
        </p>
      </header>

      {favoriteIds.length === 0 ? (
        <EmptyState
          icon={<StarIcon width={40} height={40} />}
          title={t('Aún no tienes favoritos')}
          action={
            <Link to="/" className="btn btn-primary no-underline">
              {t('Explorar el Mercado')}
            </Link>
          }
        >
          <p>
            {t('Pulsa la estrella de cualquier criptomoneda del Mercado, de la búsqueda o de su página de detalle para seguirla aquí.')}
          </p>
        </EmptyState>
      ) : (
        <>
          {error && !data && (
            <ErrorState title={t('No se pudieron cargar tus favoritos')} message={errorMessage(error)} onRetry={refetch} />
          )}
          {error && data && (
            <StaleNotice message={errorMessage(error)} timeLabel={formatTime(updatedAt, language)} onRetry={refetch} />
          )}
          {loading && <CardGridSkeleton count={Math.min(favoriteIds.length, 4)} label={t('Cargando tus favoritos…')} />}

          {!loading && !(error && !data) && (
            <>
              <p aria-live="polite" className="text-sm text-muted">
                {favoriteIds.length} {t(favoriteIds.length === 1 ? 'favorito' : 'favoritos')}
                {updatedAt && !pending ? `${t(' · datos de CoinGecko actualizados a las')} ${formatTime(updatedAt, language)}` : ''}
              </p>
              <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {favoriteIds.map((id) => {
                  const coin = byId.get(id);
                  return (
                    <li key={id} className="flex flex-col gap-2">
                      {coin ? (
                        <CoinCard coin={coin} />
                      ) : pending ? (
                        <div className="card p-4 text-muted" role="status">
                          {t('Cargando datos de {id}…', { id })}
                        </div>
                      ) : (
                        <div className="card p-4">
                          <h3>{id}</h3>
                          <p className="mt-1 text-muted">{t('CoinGecko no devolvió datos de mercado para esta moneda.')}</p>
                        </div>
                      )}
                      <button type="button" onClick={() => removeFavorite(id)} className="btn btn-secondary">
                        {t('Quitar')}{coin ? ` ${coin.name}` : ''}{t(' de favoritos')}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </>
      )}
    </div>
  );
};
