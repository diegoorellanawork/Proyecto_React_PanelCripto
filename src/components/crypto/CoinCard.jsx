import { Link } from 'react-router-dom';
import { ChangeBadge } from '../common/ChangeBadge';
import { FavoriteButton } from '../common/FavoriteButton';
import { formatCurrency, formatRank, formatWholeCurrency } from '../../utils/formatters';
import { useLanguage } from '../../context/useLanguage';

// Tarjeta de moneda: el enlace al detalle cubre toda la tarjeta; el botón de
// favoritos queda por encima (z-10) y es un control independiente.
export const CoinCard = ({ coin }) => {
  const { t, language } = useLanguage();
  return (
    <article className="card relative flex w-full flex-col gap-4 p-4 transition-colors focus-within:border-navy hover:border-muted">
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-3">
          {coin.image ? (
            <img src={coin.image} alt="" width="40" height="40" loading="lazy" className="h-10 w-10 rounded-full" />
          ) : (
            <div aria-hidden="true" className="h-10 w-10 rounded-full bg-line" />
          )}
          <div className="min-w-0">
            <h3 className="truncate">
              <Link
                to={`/coin/${encodeURIComponent(coin.id)}`}
                className="text-navy no-underline after:absolute after:inset-0 after:content-[''] hover:underline"
              >
                {coin.name}
              </Link>
            </h3>
            <p className="text-sm font-medium text-muted">
              {coin.symbol || '—'} · <span className="num">{formatRank(coin.market_cap_rank)}</span>
            </p>
          </div>
        </div>
        <FavoriteButton coinId={coin.id} coinName={coin.name} />
      </div>

      <div>
        <p className="num text-2xl font-bold text-navy">{formatCurrency(coin.current_price, language)}</p>
        <dl className="mt-3 space-y-1 text-sm">
          <div className="flex items-center justify-between gap-2">
            <dt className="text-muted">{t('Variación 24 h')}</dt>
            <dd>
              <ChangeBadge value={coin.price_change_percentage_24h} />
            </dd>
          </div>
          <div className="flex items-center justify-between gap-2">
            <dt className="text-muted">{t('Cap. de mercado')}</dt>
            <dd className="num text-right text-navy">{formatWholeCurrency(coin.market_cap, language)}</dd>
          </div>
        </dl>
      </div>
    </article>
  );
};
