import { useCallback, useId, useState } from 'react';
import { useApiResource } from '../../hooks/useApiResource';
import { useDebouncedValue } from '../../hooks/useDebouncedValue';
import { searchCoinsBasic } from '../../services/cryptoApi';
import { ErrorState } from '../common/ErrorState';
import { useLanguage } from '../../context/useLanguage';

// Permite añadir al convertidor monedas que no están en la lista principal.
export const ExtraCoinSearch = ({ onUseAsFrom, onUseAsTo }) => {
  const { t, errorMessage } = useLanguage();
  const inputId = useId();
  const [query, setQuery] = useState('');
  const term = useDebouncedValue(query, 400).trim();
  const active = term.length >= 2 && term === query.trim();

  const loader = useCallback(({ force }) => searchCoinsBasic(term, { force }), [term]);
  const { data, loading, error, refetch } = useApiResource(active ? `extra:${term}` : null, loader);

  return (
    <section aria-labelledby={`${inputId}-title`} className="card p-4">
      <h2 id={`${inputId}-title`} className="text-[17px]">
        {t('¿No encuentras una moneda?')}
      </h2>
      <p className="mt-1 text-sm text-muted">{t('Búscala en CoinGecko y úsala como origen o destino.')}</p>
      <label htmlFor={inputId} className="label mt-4">
        {t('Buscar otra moneda')}
      </label>
      <input
        id={inputId}
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={t('Nombre o símbolo (mín. 2 letras)')}
        autoComplete="off"
        className="field"
      />

      <div aria-live="polite" className="mt-3">
        {loading && <p className="text-muted">{t('Buscando en CoinGecko…')}</p>}
        {active && !loading && !error && data && data.length === 0 && (
          <p className="text-muted">{t('No encontramos monedas que coincidan con tu búsqueda')}</p>
        )}
      </div>
      {error && <ErrorState title={t('No se pudo buscar')} message={errorMessage(error)} onRetry={refetch} />}

      {data && data.length > 0 && (
        <ul className="mt-2 divide-y divide-line">
          {data.map((coin) => (
            <li key={coin.id} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
              <span className="flex items-center gap-3">
                {coin.image && <img src={coin.image} alt="" width="24" height="24" className="h-6 w-6 rounded-full" />}
                <span className="font-medium">
                  {coin.name} <span className="text-muted">({coin.symbol})</span>
                </span>
              </span>
              <span className="flex gap-2">
                <button type="button" className="btn btn-secondary !min-h-11 !px-4" onClick={() => onUseAsFrom(coin)}>
                  {t('Usar como origen')}
                </button>
                <button type="button" className="btn btn-secondary !min-h-11 !px-4" onClick={() => onUseAsTo(coin)}>
                  {t('Usar como destino')}
                </button>
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};
