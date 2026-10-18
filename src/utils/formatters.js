// Formateadores. Los valores ausentes o inválidos se muestran con un guion,
// nunca como $0.00 ni 0.00 %.
export const EMPTY_VALUE = '—';
const localeFor = (language = globalThis.document?.documentElement.lang) => language === 'en' ? 'en-US' : 'es-BO';
const formatters = new Map();

const getFormatters = (language) => {
  const locale = localeFor(language);
  if (!formatters.has(locale)) {
    const currency = (min, max) =>
      new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: 'USD',
        currencyDisplay: 'narrowSymbol',
        minimumFractionDigits: min,
        maximumFractionDigits: max,
      });
    formatters.set(locale, {
      standard: currency(2, 2),
      small: currency(2, 6),
      tiny: new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: 'USD',
        currencyDisplay: 'narrowSymbol',
        maximumSignificantDigits: 4,
      }),
      whole: currency(0, 0),
      percent: new Intl.NumberFormat(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      integer: new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }),
      amountLarge: new Intl.NumberFormat(locale, { maximumFractionDigits: 6 }),
      amountSmall: new Intl.NumberFormat(locale, { maximumSignificantDigits: 8 }),
      dateTime: new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'medium' }),
      time: new Intl.DateTimeFormat(locale, { timeStyle: 'medium' }),
    });
  }
  return formatters.get(locale);
};

export const isValidNumber = (value) => typeof value === 'number' && Number.isFinite(value);

// Precio unitario en USD: 2 decimales desde $1; más decimales para precios bajos.
export const formatCurrency = (value, language) => {
  if (!isValidNumber(value)) return EMPTY_VALUE;
  const abs = Math.abs(value);
  const formats = getFormatters(language);
  if (abs >= 1 || abs === 0) return formats.standard.format(value);
  if (abs >= 0.01) return formats.small.format(value);
  return formats.tiny.format(value);
};

// Cifras grandes (capitalización, volumen): USD enteros, sin abreviaturas ambiguas.
export const formatWholeCurrency = (value, language) =>
  isValidNumber(value) ? getFormatters(language).whole.format(value) : EMPTY_VALUE;

// Porcentaje sin signo (dominancia).
export const formatPlainPercent = (value, language) =>
  isValidNumber(value) ? `${getFormatters(language).percent.format(value)} %` : EMPTY_VALUE;

// Porcentaje con signo explícito: +1,23 % / −1,23 %.
export const formatPercent = (value, language) => {
  if (!isValidNumber(value)) return EMPTY_VALUE;
  const percentFormat = getFormatters(language).percent;
  const rounded = Number(value.toFixed(2));
  if (rounded === 0) return `${percentFormat.format(0)} %`;
  const sign = rounded > 0 ? '+' : '−';
  return `${sign}${percentFormat.format(Math.abs(rounded))} %`;
};

// 'up' | 'down' | 'flat' | null según el valor redondeado a 2 decimales.
export const getTrend = (value) => {
  if (!isValidNumber(value)) return null;
  const rounded = Number(value.toFixed(2));
  if (rounded > 0) return 'up';
  if (rounded < 0) return 'down';
  return 'flat';
};

export const formatInteger = (value, language) =>
  isValidNumber(value) ? getFormatters(language).integer.format(value) : EMPTY_VALUE;

// Cantidad de una criptomoneda (resultado del convertidor).
export const formatAmount = (value, language) => {
  if (!isValidNumber(value)) return EMPTY_VALUE;
  if (value === 0) return '0';
  const formats = getFormatters(language);
  return Math.abs(value) >= 1 ? formats.amountLarge.format(value) : formats.amountSmall.format(value);
};

export const formatRank = (value) => (isValidNumber(value) ? `#${value}` : EMPTY_VALUE);

const toDate = (value) => {
  if (value === null || value === undefined) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

export const formatDateTime = (value, language) => {
  const date = toDate(value);
  return date ? getFormatters(language).dateTime.format(date) : EMPTY_VALUE;
};

export const formatTime = (value, language) => {
  const date = toDate(value);
  return date ? getFormatters(language).time.format(date) : EMPTY_VALUE;
};

// Convierte HTML de CoinGecko en texto plano sin ejecutar ni insertar HTML.
export const htmlToText = (html) => {
  if (typeof html !== 'string' || html.trim() === '') return '';
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return (doc.body.textContent || '').replace(/\r\n/g, '\n').replace(/[ \t]+/g, ' ').trim();
};

// Interpreta una cantidad escrita por el usuario (admite coma decimal).
// Devuelve { value } o { error }.
export const parseAmount = (raw, { max = 1e15, language } = {}) => {
  const messages = language === 'en' ? {
    'Introduce una cantidad.': 'Enter an amount.',
    'La cantidad no puede ser negativa.': 'The amount cannot be negative.',
    'Introduce un número válido, por ejemplo 1,5 o 0.25.': 'Enter a valid number, for example 1.5 or 0.25.',
    'Introduce un número válido.': 'Enter a valid number.',
    'La cantidad debe ser mayor que cero.': 'The amount must be greater than zero.',
    'La cantidad es demasiado grande.': 'The amount is too large.',
  } : {};
  const error = (message) => messages[message] ?? message;
  const text = String(raw ?? '').trim();
  if (text === '') return { error: error('Introduce una cantidad.') };
  if (text.startsWith('-') || text.startsWith('−')) {
    return { error: error('La cantidad no puede ser negativa.') };
  }
  if (!/^(\d+([.,]\d*)?|[.,]\d+)$/.test(text)) {
    return { error: error('Introduce un número válido, por ejemplo 1,5 o 0.25.') };
  }
  const value = Number(text.replace(',', '.'));
  if (!Number.isFinite(value)) return { error: error('Introduce un número válido.') };
  if (value <= 0) return { error: error('La cantidad debe ser mayor que cero.') };
  if (value > max) return { error: error('La cantidad es demasiado grande.') };
  return { value };
};
