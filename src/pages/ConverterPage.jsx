import { useCallback, useId, useMemo, useState } from 'react';
import { ErrorState, StaleNotice } from '../components/common/ErrorState';
import { InfoIcon, RefreshIcon, SwapIcon } from '../components/common/Icons';
import { ExtraCoinSearch } from '../components/crypto/ExtraCoinSearch';
import { useApiResource } from '../hooks/useApiResource';
import { usePageTitle } from '../hooks/usePageTitle';
import { getSimplePrices, getTopCoins } from '../services/cryptoApi';
import { formatAmount, formatDateTime, formatTime, isValidNumber, parseAmount } from '../utils/formatters';
import { useLanguage } from '../context/useLanguage';

const loadCoinList = ({ force }) => getTopCoins('usd', 250, { force });

// Solo etiquetas (sin precios) para poder elegir BTC/USDT si la lista no carga.
const BASIC_OPTIONS = [
  { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC' },
  { id: 'tether', name: 'Tether', symbol: 'USDT' },
];

export const ConverterPage = () => {
  const { t, language, errorMessage } = useLanguage();
  usePageTitle(t('Convertidor'));
  const ids = useId();

  const [fromId, setFromId] = useState('bitcoin');
  const [toId, setToId] = useState('tether');
  const [amountText, setAmountText] = useState('1');
  const [extraCoins, setExtraCoins] = useState([]);

  const coinList = useApiResource('converter:coins', loadCoinList);

  const options = useMemo(() => {
    const map = new Map();
    for (const coin of coinList.data ?? BASIC_OPTIONS) map.set(coin.id, coin);
    for (const coin of extraCoins) if (!map.has(coin.id)) map.set(coin.id, coin);
    return [...map.values()];
  }, [coinList.data, extraCoins]);

  const find = (id) => options.find((coin) => coin.id === id);
  const symbolOf = (id) => (find(id) ? find(id).symbol || find(id).name : id);

  const sameCoin = fromId === toId;
  const priceKey = sameCoin ? null : `prices:${[fromId, toId].sort().join(',')}`;
  const priceLoader = useCallback(({ force }) => getSimplePrices([fromId, toId], { force }), [fromId, toId]);
  const prices = useApiResource(priceKey, priceLoader);

  const parsed = parseAmount(amountText, { language });

  // Cálculo en memoria: cambiar la cantidad no genera peticiones.
  let rate = null;
  let missing = null;
  let quoteTime = null;
  if (sameCoin) {
    rate = 1;
  } else if (prices.data) {
    const from = prices.data[fromId];
    const to = prices.data[toId];
    if (!from) missing = fromId;
    else if (!to) missing = toId;
    else {
      const candidate = from.price / to.price;
      if (isValidNumber(candidate) && candidate > 0) rate = candidate;
      const times = [from.updatedAt, to.updatedAt].filter(isValidNumber);
      quoteTime = times.length ? Math.min(...times) : prices.updatedAt;
    }
  }
  const result = parsed.value !== undefined && rate !== null ? parsed.value * rate : null;
  const resultValid = isValidNumber(result) && result > 0;

  const addCoin = (coin) => setExtraCoins((current) => (current.some((item) => item.id === coin.id) ? current : [...current, coin]));
  const useAsFrom = (coin) => {
    addCoin(coin);
    setFromId(coin.id);
  };
  const useAsTo = (coin) => {
    addCoin(coin);
    setToId(coin.id);
  };
  const swap = () => {
    setFromId(toId);
    setToId(fromId);
  };

  const refreshAll = () => {
    prices.refetch();
    if (coinList.error) coinList.refetch();
  };

  const amountErrorId = `${ids}-amount-error`;
  const showAmountError = parsed.error !== undefined;
  const refreshing = prices.refreshing;

  const renderSelect = (id, label, value, onChange) => (
    <div className="flex-1">
      <label htmlFor={id} className="label">
        {label}
      </label>
      <select id={id} value={value} onChange={(event) => onChange(event.target.value)} className="field">
        {options.map((coin) => (
          <option key={coin.id} value={coin.id}>
            {coin.name} ({coin.symbol})
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header>
        <h1>{t('Convertidor')}</h1>
        <p className="mt-2 max-w-prose text-muted">
          {t('Calcula cuánto equivale una cantidad de una criptomoneda en otra, usando cotizaciones en USD de CoinGecko.')}
        </p>
      </header>

      {coinList.error && (
        <div role="alert" className="flex flex-col gap-3 rounded-field border border-negative bg-error-soft p-4 sm:flex-row sm:items-center">
          <p className="flex-1">
            {t('No se pudo cargar la lista completa de monedas.')} {errorMessage(coinList.error)} {t(' Mientras tanto puedes usar BTC y USDT o buscar otra moneda.')}
          </p>
          <button type="button" onClick={coinList.refetch} className="btn btn-secondary">
            {t('Reintentar')}
          </button>
        </div>
      )}

      <section aria-labelledby={`${ids}-form`} className="card space-y-6 p-4 sm:p-6">
        <h2 id={`${ids}-form`} className="sr-only">
          {t('Datos de la conversión')}
        </h2>

        <div>
          <label htmlFor={`${ids}-amount`} className="label">
            {t('Cantidad')}
          </label>
          <input
            id={`${ids}-amount`}
            type="text"
            inputMode="decimal"
            autoComplete="off"
            value={amountText}
            onChange={(event) => setAmountText(event.target.value)}
            aria-invalid={showAmountError}
            aria-describedby={showAmountError ? amountErrorId : undefined}
            className="field num"
          />
          {showAmountError && (
            <p id={amountErrorId} role="alert" className="mt-2 text-sm font-medium text-negative">
              <span aria-hidden="true">▼ </span>
              {parsed.error}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-end">
          {renderSelect(`${ids}-from`, t('Moneda de origen'), fromId, setFromId)}
          <button type="button" onClick={swap} className="btn btn-secondary self-center md:mb-0" aria-label={t('Intercambiar origen y destino')}>
            <SwapIcon />
            <span className="md:sr-only">{t('Invertir')}</span>
          </button>
          {renderSelect(`${ids}-to`, t('Moneda de destino'), toId, setToId)}
        </div>
      </section>

      <section aria-labelledby={`${ids}-result`} className="card p-4 sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <h2 id={`${ids}-result`}>{t('Resultado')}</h2>
          {!sameCoin && (
            <button type="button" onClick={refreshAll} disabled={refreshing || prices.loading} className="btn btn-secondary !min-h-11 !px-4 !text-sm">
              <RefreshIcon width={16} height={16} />
              {t('Actualizar cotizaciones')}
            </button>
          )}
        </div>

        {prices.error && !prices.data && (
          <div className="mt-4">
            <ErrorState title={t('No se pudieron obtener las cotizaciones')} message={errorMessage(prices.error)} onRetry={prices.refetch} />
          </div>
        )}
        {prices.error && prices.data && (
          <div className="mt-4">
            <StaleNotice message={errorMessage(prices.error)} timeLabel={formatTime(prices.updatedAt, language)} onRetry={prices.refetch} />
          </div>
        )}

        {prices.loading && (
          <p role="status" className="mt-4 text-muted">
            {t('Consultando cotizaciones en CoinGecko…')}
          </p>
        )}

        {missing && (
          <p role="alert" className="mt-4 font-medium text-negative">
            <span aria-hidden="true">▼ </span>
            {t('CoinGecko no devolvió una cotización válida para {symbol}. No es posible calcular la conversión.', { symbol: symbolOf(missing) })}
          </p>
        )}

        <div aria-live="polite" aria-atomic="true">
          {resultValid && (
            <div className="mt-4">
              <p className="num text-lg text-muted">
                {formatAmount(parsed.value, language)} {symbolOf(fromId)}{t(' equivale aproximadamente a')}
              </p>
              <p className="num mt-1 break-words text-3xl font-bold text-navy">
                {formatAmount(result, language)} {symbolOf(toId)}
              </p>
            </div>
          )}
          {!resultValid && !prices.loading && !missing && !prices.error && showAmountError && (
            <p className="mt-4 text-muted">{t('Corrige la cantidad para ver el resultado.')}</p>
          )}
        </div>

        {resultValid && rate !== null && (
          <dl className="mt-6 space-y-2 text-sm">
            <div className="flex flex-wrap justify-between gap-2">
              <dt className="text-muted">{t('Tasa utilizada')}</dt>
              <dd className="num text-navy">
                1 {symbolOf(fromId)} = {formatAmount(rate, language)} {symbolOf(toId)}
              </dd>
            </div>
            <div className="flex flex-wrap justify-between gap-2">
              <dt className="text-muted">{t('Tasa inversa')}</dt>
              <dd className="num text-navy">
                1 {symbolOf(toId)} = {formatAmount(1 / rate, language)} {symbolOf(fromId)}
              </dd>
            </div>
            {!sameCoin && (
              <div className="flex flex-wrap justify-between gap-2">
                <dt className="text-muted">{t('Cotización de CoinGecko')}</dt>
                <dd className="num text-navy">{formatDateTime(quoteTime ?? prices.updatedAt, language)}</dd>
              </div>
            )}
          </dl>
        )}

        <p className="mt-6 flex gap-3 rounded-field bg-page p-4 text-sm text-navy">
          <InfoIcon className="mt-0.5 h-5 w-5 shrink-0 text-teal-dark" />
          <span>{t('Equivalencia estimada basada en las cotizaciones consultadas. No representa una orden de compra o venta ni una operación ejecutada en un exchange.')}</span>
        </p>
      </section>

      <ExtraCoinSearch onUseAsFrom={useAsFrom} onUseAsTo={useAsTo} />
    </div>
  );
};
