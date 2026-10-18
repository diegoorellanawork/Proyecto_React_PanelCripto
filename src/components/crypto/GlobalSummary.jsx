import { ChangeBadge } from '../common/ChangeBadge';
import {
  formatInteger,
  formatPlainPercent,
  formatWholeCurrency,
} from '../../utils/formatters';
import { useLanguage } from '../../context/useLanguage';

const Metric = ({ label, children }) => (
  <div className="card p-4">
    <dt className="text-sm font-medium text-muted">{label}</dt>
    <dd className="num mt-1 text-xl font-semibold text-navy">{children}</dd>
  </div>
);

// Indicadores globales de CoinGecko (/global). Lo que falta se muestra como "—".
export const GlobalSummary = ({ data, compact = false }) => {
  const { t, language } = useLanguage();
  return (
    <dl className={`grid grid-cols-1 gap-4 sm:grid-cols-2 ${compact ? 'lg:grid-cols-4' : 'lg:grid-cols-3'}`}>
      <Metric label={t('Capitalización global')}>{formatWholeCurrency(data.totalMarketCap, language)}</Metric>
      <Metric label={t('Volumen global 24 h')}>{formatWholeCurrency(data.totalVolume, language)}</Metric>
      <Metric label={t('Dominancia de BTC')}>{formatPlainPercent(data.btcDominance, language)}</Metric>
      <Metric label={t('Dominancia de ETH')}>{formatPlainPercent(data.ethDominance, language)}</Metric>
      {!compact && (
        <>
          <Metric label={t('Variación de la capitalización 24 h')}>
            <ChangeBadge value={data.marketCapChange24h} />
          </Metric>
          <Metric label={t('Criptomonedas activas')}>{formatInteger(data.activeCryptocurrencies, language)}</Metric>
          <Metric label={t('Mercados')}>{formatInteger(data.markets, language)}</Metric>
        </>
      )}
    </dl>
  );
};
