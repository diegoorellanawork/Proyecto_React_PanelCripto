import { useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChangeBadge } from '../components/common/ChangeBadge';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorState, StaleNotice } from '../components/common/ErrorState';
import { FavoriteButton } from '../components/common/FavoriteButton';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { useApiResource } from '../hooks/useApiResource';
import { usePageTitle } from '../hooks/usePageTitle';
import { getCoinDetail } from '../services/cryptoApi';
import {
  formatCurrency,
  formatDateTime,
  formatRank,
  formatTime,
  formatWholeCurrency,
  htmlToText,
} from '../utils/formatters';
import { useLanguage } from '../context/useLanguage';

const Stat = ({ label, children }) => (
  <div className="card p-4">
    <dt className="text-sm font-medium text-muted">{label}</dt>
    <dd className="num mt-1 text-xl font-semibold text-navy">{children}</dd>
  </div>
);

export const CoinDetailPage = () => {
  const { t, language, errorMessage } = useLanguage();
  const { id } = useParams();
  const loader = useCallback(({ force }) => getCoinDetail(id, { force }), [id]);
  const { data: coin, loading, error, updatedAt, refetch } = useApiResource(`detail:${id}`, loader, {
    refreshMs: 60000,
  });
  usePageTitle(coin ? coin.name : t('Detalle de moneda'));

  const backLink = (
    <Link to="/" className="inline-flex min-h-11 items-center font-medium">
      {t('← Volver al mercado')}
    </Link>
  );

  if (loading) {
    return (
      <div>
        {backLink}
        <LoadingSpinner label={t('Cargando datos de la moneda…')} />
      </div>
    );
  }

  if (error && !coin) {
    if (error.kind === 'not-found') {
      return (
        <div className="space-y-4">
          {backLink}
          <EmptyState
            title={t('Moneda no encontrada')}
            action={
              <Link to="/" className="btn btn-primary no-underline">
                {t('Ir al Mercado')}
              </Link>
            }
          >
            <p>{t('CoinGecko no tiene datos para “{id}”. Comprueba la dirección o busca la moneda desde el Mercado.', { id })}</p>
          </EmptyState>
        </div>
      );
    }
    return (
      <div className="space-y-4">
        {backLink}
        <ErrorState title={t('No se pudieron cargar los datos de la moneda')} message={errorMessage(error)} onRetry={refetch} />
      </div>
    );
  }

  if (!coin) return null;

  const description = htmlToText(coin.description);

  return (
    <div className="space-y-8">
      {backLink}

      {error && <StaleNotice message={errorMessage(error)} timeLabel={formatTime(updatedAt, language)} onRetry={refetch} />}

      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          {coin.image ? (
            <img src={coin.image} alt="" width="64" height="64" className="h-16 w-16 rounded-full" />
          ) : (
            <div aria-hidden="true" className="h-16 w-16 rounded-full bg-line" />
          )}
          <div>
            <h1>{coin.name}</h1>
            <p className="font-medium text-muted">
              {coin.symbol || '—'} · {t('Ranking')} <span className="num">{formatRank(coin.market_cap_rank)}</span>
            </p>
          </div>
        </div>
        <FavoriteButton coinId={coin.id} coinName={coin.name} showLabel />
      </header>

      <section aria-labelledby="precio" className="card p-6">
        <h2 id="precio" className="text-[17px] text-muted">
          {t('Precio actual (USD)')}
        </h2>
        <p className="num mt-1 text-3xl font-bold text-navy">{formatCurrency(coin.current_price, language)}</p>
        <p className="mt-2 text-sm text-muted">
          {t('Variación 24 h:')} <ChangeBadge value={coin.price_change_percentage_24h} />
        </p>
        <p className="mt-2 text-sm text-muted">
          {t('Datos de CoinGecko · última actualización de la moneda:')}{' '}
          <span className="num">{formatDateTime(coin.last_updated, language)}</span>
        </p>
      </section>

      <section aria-labelledby="metricas">
        <h2 id="metricas" className="mb-4">
          {t('Métricas de mercado')}
        </h2>
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label={t('Capitalización de mercado')}>{formatWholeCurrency(coin.market_cap, language)}</Stat>
          <Stat label={t('Volumen de negociación 24 h')}>{formatWholeCurrency(coin.total_volume, language)}</Stat>
          <Stat label={t('Máximo 24 h')}>{formatCurrency(coin.high_24h, language)}</Stat>
          <Stat label={t('Mínimo 24 h')}>{formatCurrency(coin.low_24h, language)}</Stat>
        </dl>
      </section>

      <section aria-labelledby="descripcion" className="card p-6">
        <h2 id="descripcion" className="mb-3">
          {t('Descripción')}
        </h2>
        {description ? (
          <p className="max-w-prose whitespace-pre-line leading-relaxed">{description}</p>
        ) : (
          <p className="text-muted">{t('CoinGecko no ofrece una descripción para esta moneda.')}</p>
        )}
        {description && (
          <p className="mt-3 text-sm text-muted">{t('Texto proporcionado por CoinGecko, en inglés.')}</p>
        )}
      </section>
    </div>
  );
};
