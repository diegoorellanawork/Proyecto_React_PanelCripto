import { useCallback } from 'react';
import { getTopCoins } from '../services/cryptoApi';
import { useApiResource } from './useApiResource';

/**
 * Top de criptomonedas por capitalización.
 * Corrige el import roto anterior: `getTopCoins` ahora existe en el servicio.
 */
export const useCryptoData = (currency = 'usd', perPage = 100, { refreshMs = 60000 } = {}) => {
  const loader = useCallback(
    ({ force }) => getTopCoins(currency, perPage, { force }),
    [currency, perPage]
  );
  const { data, ...rest } = useApiResource(`top:${currency}:${perPage}`, loader, { refreshMs });
  return { coins: data ?? [], hasData: data !== null, ...rest };
};
