/**
 * Servicio de CoinGecko (API pública / Demo).
 *
 * - Un único punto de salida HTTP (`request`) que comprueba `response.ok`,
 *   distingue errores de red, tiempo de espera, límite de uso (429), 404,
 *   autenticación y respuestas inválidas.
 * - Caché en memoria con expiración + deduplicación de peticiones en curso
 *   (tolera el doble efecto de React StrictMode en desarrollo).
 * - Nunca devuelve datos de respaldo inventados: si algo falla, lanza ApiError.
 *
 * Endpoints (verificados en docs.coingecko.com, API Demo/Keyless,
 * base https://api.coingecko.com/api/v3):
 *   /coins/markets, /simple/price, /search, /global, /coins/{id}
 *
 * VITE_COINGECKO_API_KEY (opcional, clave Demo): las variables VITE_ quedan
 * expuestas en el navegador; no debe contener secretos privados.
 */

const BASE_URL = 'https://api.coingecko.com/api/v3';
const API_KEY = (import.meta.env && import.meta.env.VITE_COINGECKO_API_KEY) || '';

const REQUEST_TIMEOUT_MS = 15000;
const RATE_LIMIT_COOLDOWN_MS = 30000;
const CACHE_MAX_ENTRIES = 100;

// TTL de caché (ms). Los datos de mercado se actualizan en CoinGecko cada ~60 s.
const TTL_MARKET = 50 * 1000;
const TTL_SEARCH = 5 * 60 * 1000;
const TTL_GLOBAL = 2 * 60 * 1000;

export class ApiError extends Error {
  constructor(kind, message, { status = null, cause } = {}) {
    super(message, { cause });
    this.name = 'ApiError';
    this.kind = kind; // 'network' | 'timeout' | 'rate-limit' | 'not-found' | 'auth' | 'http' | 'invalid'
    this.status = status;
  }
}

const rateLimitError = (remainingMs) => {
  const seconds = Math.max(1, Math.ceil(remainingMs / 1000));
  return new ApiError(
    'rate-limit',
    `El servicio de CoinGecko está temporalmente limitado por exceso de solicitudes. Vuelve a intentarlo en unos ${seconds} segundos.`,
    { status: 429 }
  );
};

const invalidResponse = (detail) => {
  console.warn('[CoinGecko] Respuesta inesperada:', detail);
  return new ApiError(
    'invalid',
    'CoinGecko devolvió una respuesta inesperada. Inténtalo de nuevo más tarde.'
  );
};

const cache = new Map(); // url -> { entry: { data, fetchedAt }, expires }
const inflight = new Map(); // url -> Promise<entry>
let rateLimitedUntil = 0;

const pruneCache = () => {
  if (cache.size <= CACHE_MAX_ENTRIES) return;
  const now = Date.now();
  for (const [key, value] of cache) {
    if (value.expires <= now) cache.delete(key);
  }
  while (cache.size > CACHE_MAX_ENTRIES) {
    cache.delete(cache.keys().next().value);
  }
};

async function fetchJson(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  const headers = { Accept: 'application/json' };
  if (API_KEY) headers['x-cg-demo-api-key'] = API_KEY;

  try {
    let response;
    try {
      response = await fetch(url, { headers, signal: controller.signal });
    } catch (error) {
      if (error && error.name === 'AbortError') {
        throw new ApiError(
          'timeout',
          'CoinGecko tardó demasiado en responder. Inténtalo de nuevo.',
          { cause: error }
        );
      }
      throw new ApiError(
        'network',
        'No pudimos conectar con CoinGecko. Revisa tu conexión a internet e inténtalo de nuevo.',
        { cause: error }
      );
    }

    if (!response.ok) {
      const { status } = response;
      if (status === 429) {
        rateLimitedUntil = Date.now() + RATE_LIMIT_COOLDOWN_MS;
        throw rateLimitError(RATE_LIMIT_COOLDOWN_MS);
      }
      if (status === 404) {
        throw new ApiError('not-found', 'CoinGecko no encontró el recurso solicitado.', { status });
      }
      if (status === 401 || status === 403) {
        throw new ApiError(
          'auth',
          'CoinGecko rechazó la solicitud (clave de API no válida o sin permisos). Revisa VITE_COINGECKO_API_KEY.',
          { status }
        );
      }
      throw new ApiError(
        'http',
        `CoinGecko respondió con un error (código ${status}). Inténtalo más tarde.`,
        { status }
      );
    }

    try {
      return await response.json();
    } catch (error) {
      throw new ApiError(
        'invalid',
        'CoinGecko devolvió una respuesta inesperada. Inténtalo de nuevo más tarde.',
        { cause: error }
      );
    }
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Petición GET común. Devuelve `{ data, fetchedAt }` (fetchedAt en ms).
 * `force: true` ignora la caché (actualización solicitada por el usuario).
 */
export function request(path, params = {}, { ttl = TTL_MARKET, force = false } = {}) {
  const query = new URLSearchParams(params).toString();
  const url = `${BASE_URL}${path}${query ? `?${query}` : ''}`;

  const cached = cache.get(url);
  if (!force && cached && cached.expires > Date.now()) {
    return Promise.resolve(cached.entry);
  }

  const pending = inflight.get(url);
  if (pending) return pending;

  const remaining = rateLimitedUntil - Date.now();
  if (remaining > 0) return Promise.reject(rateLimitError(remaining));

  const promise = fetchJson(url)
    .then((data) => {
      const entry = { data, fetchedAt: Date.now() };
      cache.set(url, { entry, expires: Date.now() + ttl });
      pruneCache();
      return entry;
    })
    .finally(() => {
      inflight.delete(url);
    });

  inflight.set(url, promise);
  return promise;
}

// ---------- Normalización y validación ----------

const toNumber = (value) => (typeof value === 'number' && Number.isFinite(value) ? value : null);
const toText = (value) => (typeof value === 'string' && value.trim() !== '' ? value : null);

export const normalizeCoin = (raw) => {
  if (!raw || typeof raw !== 'object') return null;
  const id = toText(raw.id);
  const name = toText(raw.name);
  if (!id || !name) return null;
  return {
    id,
    name,
    symbol: String(raw.symbol ?? '').toUpperCase(),
    image: toText(raw.image),
    current_price: toNumber(raw.current_price),
    market_cap_rank: toNumber(raw.market_cap_rank),
    market_cap: toNumber(raw.market_cap),
    total_volume: toNumber(raw.total_volume),
    high_24h: toNumber(raw.high_24h),
    low_24h: toNumber(raw.low_24h),
    price_change_percentage_24h: toNumber(raw.price_change_percentage_24h),
    last_updated: toText(raw.last_updated),
  };
};

const normalizeCoinList = (payload) => {
  if (!Array.isArray(payload)) throw invalidResponse('se esperaba un arreglo de monedas');
  return payload.map(normalizeCoin).filter(Boolean);
};

// ---------- Funciones públicas ----------

/** Top de monedas por capitalización (USD por defecto). */
export const getTopCoins = async (currency = 'usd', perPage = 100, { force = false } = {}) => {
  const { data, fetchedAt } = await request(
    '/coins/markets',
    {
      vs_currency: currency,
      order: 'market_cap_desc',
      per_page: String(perPage),
      page: '1',
      sparkline: 'false',
    },
    { ttl: TTL_MARKET, force }
  );
  return { data: normalizeCoinList(data), fetchedAt };
};

/** Datos de mercado para una lista de ids (máx. 250 por petición). */
export const getCoinsByIds = async (ids, currency = 'usd', { force = false } = {}) => {
  const unique = [...new Set(ids)].filter(Boolean).slice(0, 250).sort();
  if (unique.length === 0) return { data: [], fetchedAt: Date.now() };
  const { data, fetchedAt } = await request(
    '/coins/markets',
    {
      vs_currency: currency,
      ids: unique.join(','),
      order: 'market_cap_desc',
      per_page: '250',
      page: '1',
      sparkline: 'false',
    },
    { ttl: TTL_MARKET, force }
  );
  return { data: normalizeCoinList(data), fetchedAt };
};

/**
 * Búsqueda remota (/search) enriquecida con datos de mercado de los primeros
 * resultados (/coins/markets?ids=...). Si no hay datos de mercado para una
 * moneda, sus valores quedan en null (la interfaz muestra un guion).
 */
export const searchCoins = async (query, { force = false } = {}) => {
  const term = String(query ?? '').trim();
  if (term.length < 2) return { data: [], fetchedAt: Date.now() };

  const { data, fetchedAt } = await request('/search', { query: term }, { ttl: TTL_SEARCH, force });
  if (!data || !Array.isArray(data.coins)) throw invalidResponse('/search sin arreglo "coins"');

  const found = data.coins
    .filter((coin) => coin && toText(coin.id) && toText(coin.name))
    .slice(0, 12);
  if (found.length === 0) return { data: [], fetchedAt };

  const market = await getCoinsByIds(
    found.map((coin) => coin.id),
    'usd',
    { force }
  );
  const byId = new Map(market.data.map((coin) => [coin.id, coin]));

  const merged = found.map(
    (coin) =>
      byId.get(coin.id) ??
      normalizeCoin({
        id: coin.id,
        name: coin.name,
        symbol: coin.symbol,
        image: coin.large || coin.thumb,
        market_cap_rank: coin.market_cap_rank,
      })
  );
  return { data: merged.filter(Boolean), fetchedAt: Math.min(fetchedAt, market.fetchedAt) };
};

/** Detalle de una moneda (/coins/{id}) sin datos de comunidad, desarrolladores ni tickers. */
export const getCoinDetail = async (id, { force = false } = {}) => {
  const { data, fetchedAt } = await request(
    `/coins/${encodeURIComponent(id)}`,
    {
      localization: 'false',
      tickers: 'false',
      market_data: 'true',
      community_data: 'false',
      developer_data: 'false',
      sparkline: 'false',
    },
    { ttl: TTL_MARKET, force }
  );
  if (!data || typeof data !== 'object' || !toText(data.id) || !toText(data.name)) {
    throw invalidResponse('/coins/{id} sin id o nombre');
  }
  const market = data.market_data && typeof data.market_data === 'object' ? data.market_data : {};
  const usd = (field) => toNumber(market[field] && market[field].usd);
  const description =
    data.description && typeof data.description === 'object' ? toText(data.description.en) : null;

  return {
    data: {
      id: data.id,
      name: data.name,
      symbol: String(data.symbol ?? '').toUpperCase(),
      image: toText(data.image && data.image.large) ?? toText(data.image && data.image.small),
      market_cap_rank: toNumber(data.market_cap_rank),
      current_price: usd('current_price'),
      market_cap: usd('market_cap'),
      total_volume: usd('total_volume'),
      high_24h: usd('high_24h'),
      low_24h: usd('low_24h'),
      price_change_percentage_24h: toNumber(market.price_change_percentage_24h),
      description, // HTML sin procesar: convertir a texto con htmlToText antes de mostrar
      last_updated: toText(data.last_updated) ?? toText(market.last_updated),
    },
    fetchedAt,
  };
};

/** Resumen global del mercado (/global). */
export const getGlobalData = async ({ force = false } = {}) => {
  const { data, fetchedAt } = await request('/global', {}, { ttl: TTL_GLOBAL, force });
  const g = data && data.data;
  if (!g || typeof g !== 'object') throw invalidResponse('/global sin objeto "data"');
  const pick = (group, key) => toNumber(g[group] && g[group][key]);
  return {
    data: {
      totalMarketCap: pick('total_market_cap', 'usd'),
      totalVolume: pick('total_volume', 'usd'),
      btcDominance: pick('market_cap_percentage', 'btc'),
      ethDominance: pick('market_cap_percentage', 'eth'),
      marketCapChange24h: toNumber(g.market_cap_change_percentage_24h_usd),
      activeCryptocurrencies: toNumber(g.active_cryptocurrencies),
      markets: toNumber(g.markets),
      updatedAt: toNumber(g.updated_at) ? g.updated_at * 1000 : null,
    },
    fetchedAt,
  };
};

/**
 * Precios en USD (/simple/price) para el convertidor.
 * Devuelve { [id]: { price, updatedAt } | null }; null si CoinGecko no tiene
 * una cotización válida (numérica, finita y > 0) para ese id.
 */
export const getSimplePrices = async (ids, { force = false } = {}) => {
  const unique = [...new Set(ids)].filter(Boolean).sort();
  const { data, fetchedAt } = await request(
    '/simple/price',
    {
      ids: unique.join(','),
      vs_currencies: 'usd',
      include_last_updated_at: 'true',
      precision: 'full',
    },
    { ttl: TTL_MARKET, force }
  );
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    throw invalidResponse('/simple/price no devolvió un objeto');
  }
  const prices = {};
  for (const id of unique) {
    const price = toNumber(data[id] && data[id].usd);
    const updated = toNumber(data[id] && data[id].last_updated_at);
    prices[id] = price !== null && price > 0 ? { price, updatedAt: updated ? updated * 1000 : null } : null;
  }
  return { data: prices, fetchedAt };
};

/**
 * Búsqueda ligera (/search) sin datos de mercado: solo identifica monedas
 * (id, nombre, símbolo, logotipo). La usa el convertidor para añadir monedas
 * que no están entre las 250 principales.
 */
export const searchCoinsBasic = async (query, { force = false } = {}) => {
  const term = String(query ?? '').trim();
  if (term.length < 2) return { data: [], fetchedAt: Date.now() };
  const { data, fetchedAt } = await request('/search', { query: term }, { ttl: TTL_SEARCH, force });
  if (!data || !Array.isArray(data.coins)) throw invalidResponse('/search sin arreglo "coins"');
  const coins = data.coins
    .slice(0, 10)
    .map((coin) =>
      normalizeCoin({
        id: coin && coin.id,
        name: coin && coin.name,
        symbol: coin && coin.symbol,
        image: coin && (coin.large || coin.thumb),
        market_cap_rank: coin && coin.market_cap_rank,
      })
    )
    .filter(Boolean);
  return { data: coins, fetchedAt };
};
