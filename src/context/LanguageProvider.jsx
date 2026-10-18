import { useEffect, useMemo, useState } from 'react';
import { LanguageContext } from './languageContext';

const translations = {
  'Panel Cripto': 'Crypto Dashboard',
  Mercado: 'Market',
  Portafolio: 'Portfolio',
  'Resumen global': 'Global overview',
  'Iniciar sesión': 'Log in',
  Registrarse: 'Sign up',
  Principal: 'Main',
  'Principal (mobile)': 'Main (mobile)',
  favoritos: 'favorites',
  'Cerrar menú de navegación': 'Close navigation menu',
  'Abrir menú de navegación': 'Open navigation menu',
  'Saltar al contenido principal': 'Skip to main content',
  'Datos de mercado proporcionados por': 'Market data provided by',
  'es informativo: no ejecuta operaciones, no gestiona fondos y no constituye asesoría financiera.':
    'is for informational purposes only: it does not execute trades, manage funds, or provide financial advice.',
  'Mercado de criptomonedas': 'Cryptocurrency market',
  'Precios en USD, variación de 24 horas y capitalización de las 100 principales criptomonedas según CoinGecko.':
    'USD prices, 24-hour changes, and market capitalization for the top 100 cryptocurrencies according to CoinGecko.',
  'Cargando resumen global…': 'Loading global overview…',
  'No se pudo cargar el resumen global.': 'Could not load the global overview.',
  ' Los indicadores mostrados pueden estar desactualizados.': ' The displayed metrics may be outdated.',
  Reintentar: 'Try again',
  Criptomonedas: 'Cryptocurrencies',
  'Datos de CoinGecko · actualizados a las': 'CoinGecko data · updated at',
  ' · actualizando…': ' · updating…',
  Actualizar: 'Refresh',
  'No se pudo cargar el mercado': 'Could not load the market',
  '{count} resultado(s) para “{term}”': '{count} result(s) for “{term}”',
  'Mostrando {count} criptomonedas': 'Showing {count} cryptocurrencies',
  'CoinGecko no devolvió monedas': 'CoinGecko returned no coins',
  'Inténtalo de nuevo en unos momentos.': 'Please try again in a moment.',
  'No hay coincidencias entre las 100 principales para “{term}”.': 'No matches among the top 100 for “{term}”.',
  ' Mostrando resultados de la búsqueda en CoinGecko.': ' Showing search results from CoinGecko.',
  ' Escribe al menos 2 caracteres para buscar en CoinGecko.': ' Enter at least 2 characters to search CoinGecko.',
  'Buscando en CoinGecko…': 'Searching CoinGecko…',
  'No se pudo completar la búsqueda': 'Could not complete the search',
  'Revisa la ortografía o prueba con el símbolo de la moneda.': 'Check the spelling or try the coin symbol.',
  'No encontramos monedas que coincidan con tu búsqueda': 'No coins matched your search',
  'Detalle de moneda': 'Coin details',
  '← Volver al mercado': '← Back to market',
  'Cargando datos de la moneda…': 'Loading coin data…',
  'Moneda no encontrada': 'Coin not found',
  'Ir al Mercado': 'Go to Market',
  'CoinGecko no tiene datos para “{id}”. Comprueba la dirección o busca la moneda desde el Mercado.':
    'CoinGecko has no data for “{id}”. Check the address or find the coin from the Market.',
  'No se pudieron cargar los datos de la moneda': 'Could not load coin data',
  Ranking: 'Rank',
  'Precio actual (USD)': 'Current price (USD)',
  'Variación 24 h:': '24-hour change:',
  'Datos de CoinGecko · última actualización de la moneda:': 'CoinGecko data · coin last updated:',
  'Métricas de mercado': 'Market metrics',
  'Capitalización de mercado': 'Market capitalization',
  'Volumen de negociación 24 h': '24-hour trading volume',
  'Máximo 24 h': '24-hour high',
  'Mínimo 24 h': '24-hour low',
  Descripción: 'Description',
  'CoinGecko no ofrece una descripción para esta moneda.': 'CoinGecko does not provide a description for this coin.',
  'Texto proporcionado por CoinGecko, en inglés.': 'Text provided by CoinGecko, in English.',
  'Convertidor': 'Converter',
  'Calcula cuánto equivale una cantidad de una criptomoneda en otra, usando cotizaciones en USD de CoinGecko.':
    'Convert an amount of one cryptocurrency to another using CoinGecko USD quotes.',
  'No se pudo cargar la lista completa de monedas.': 'Could not load the complete coin list.',
  ' Mientras tanto puedes usar BTC y USDT o buscar otra moneda.': ' Meanwhile, you can use BTC and USDT or search for another coin.',
  Cantidad: 'Amount',
  'Moneda de origen': 'From coin',
  'Intercambiar origen y destino': 'Swap source and destination',
  Invertir: 'Swap',
  'Moneda de destino': 'To coin',
  Resultado: 'Result',
  'Actualizar cotizaciones': 'Refresh quotes',
  'No se pudieron obtener las cotizaciones': 'Could not retrieve quotes',
  'Consultando cotizaciones en CoinGecko…': 'Fetching quotes from CoinGecko…',
  'CoinGecko no devolvió una cotización válida para {symbol}. No es posible calcular la conversión.':
    'CoinGecko returned no valid quote for {symbol}. The conversion cannot be calculated.',
  ' equivale aproximadamente a': ' is approximately equal to',
  'Corrige la cantidad para ver el resultado.': 'Correct the amount to see the result.',
  'Tasa utilizada': 'Rate used',
  'Tasa inversa': 'Inverse rate',
  'Cotización de CoinGecko': 'CoinGecko quote',
  'Equivalencia estimada basada en las cotizaciones consultadas. No representa una orden de compra o venta ni una operación ejecutada en un exchange.':
    'Estimated conversion based on the quotes retrieved. This is not a buy or sell order, nor a trade executed on an exchange.',
  'Resumen global del mercado': 'Global market overview',
  'Indicadores agregados de todo el mercado cripto, en USD, según CoinGecko.':
    'Aggregated indicators for the entire crypto market in USD, according to CoinGecko.',
  'No se pudo cargar el resumen global': 'Could not load the global overview',
  'Indicadores globales': 'Global indicators',
  'Última actualización de CoinGecko:': 'Last updated by CoinGecko:',
  '. Los datos globales se actualizan aproximadamente cada 10 minutos.':
    '. Global data is updated approximately every 10 minutes.',
  'Lista temporal de criptomonedas favoritas para seguimiento. No es una cartera de inversión: no hay saldos, cantidades ni ganancias, y los favoritos se borran al recargar la página.':
    'A temporary list of favorite cryptocurrencies to follow. This is not an investment portfolio: it has no balances, quantities, or gains, and favorites are cleared when the page reloads.',
  'Aún no tienes favoritos': 'You have no favorites yet',
  'Explorar el Mercado': 'Explore the Market',
  'Pulsa la estrella de cualquier criptomoneda del Mercado, de la búsqueda o de su página de detalle para seguirla aquí.':
    'Select the star on any cryptocurrency in the Market, search results, or its details page to follow it here.',
  'No se pudieron cargar tus favoritos': 'Could not load your favorites',
  'Cargando tus favoritos…': 'Loading your favorites…',
  'favorito': 'favorite',
  ' · datos de CoinGecko actualizados a las': ' · CoinGecko data updated at',
  'Cargando datos de {id}…': 'Loading data for {id}…',
  'CoinGecko no devolvió datos de mercado para esta moneda.': 'CoinGecko returned no market data for this coin.',
  'Quitar': 'Remove',
  ' de favoritos': ' from favorites',
  'Añadir': 'Add',
  ' a favoritos': ' to favorites',
  'Quitar de favoritos': 'Remove from favorites',
  'Añadir a favoritos': 'Add to favorites',
  'Datos de la conversión': 'Conversion details',
  'Añadir {coin} a favoritos': 'Add {coin} to favorites',
  'Quitar {coin} de favoritos': 'Remove {coin} from favorites',
  'Página no encontrada': 'Page not found',
  'Error 404: página no encontrada': 'Error 404: page not found',
  'Volver al Mercado': 'Back to Market',
  'La dirección que buscas no existe en Panel Cripto.': 'The address you are looking for does not exist in Crypto Dashboard.',
  'Buscar criptomoneda por nombre o símbolo': 'Search cryptocurrency by name or symbol',
  'Ej.: Bitcoin o BTC': 'E.g. Bitcoin or BTC',
  'Borrar búsqueda': 'Clear search',
  Buscar: 'Search',
  'Variación 24 h': '24-hour change',
  'Cap. de mercado': 'Market cap',
  'Capitalización global': 'Global market capitalization',
  'Volumen global 24 h': 'Global volume 24 h',
  'Dominancia de BTC': 'BTC dominance',
  'Dominancia de ETH': 'ETH dominance',
  'Variación de la capitalización 24 h': '24-hour market cap change',
  'Criptomonedas activas': 'Active cryptocurrencies',
  Mercados: 'Markets',
  '¿No encuentras una moneda?': 'Can’t find a coin?',
  'Búscala en CoinGecko y úsala como origen o destino.': 'Search CoinGecko and use it as the source or destination.',
  'Buscar otra moneda': 'Search for another coin',
  'Nombre o símbolo (mín. 2 letras)': 'Name or symbol (at least 2 characters)',
  'No se pudo buscar': 'Could not search',
  'Usar como origen': 'Use as source',
  'Usar como destino': 'Use as destination',
  subida: 'increase',
  bajada: 'decrease',
  'sin cambios': 'no change',
  'No se pudieron cargar los datos': 'Could not load data',
  'Estás viendo datos anteriores': 'You are viewing older data',
  ' (obtenidos a las {time})': ' (retrieved at {time})',
  '; pueden no reflejar el precio actual.': '; it may not reflect the current price.',
  'Cargando datos del mercado…': 'Loading market data…',
  'Versión de demostración.': 'Demo version.',
  'Este formulario valida los campos, pero no envía datos, no crea cuentas ni inicia sesiones.':
    'This form validates fields but does not send data, create accounts, or start sessions.',
  'Hay 1 campo por corregir.': 'There is 1 field to correct.',
  'Hay {count} campos por corregir.': 'There are {count} fields to correct.',
  ' Revisa los mensajes indicados.': ' Review the messages shown.',
  'Ocultar': 'Hide',
  'Mostrar': 'Show',
  'Ingresa tu correo y tu contraseña.': 'Enter your email and password.',
  '¿No tienes cuenta?': 'Don’t have an account?',
  'Regístrate': 'Sign up',
  'Todos los campos son obligatorios.': 'All fields are required.',
  'Correo electrónico': 'Email address',
  Contraseña: 'Password',
  Recordarme: 'Remember me',
  'El inicio de sesión no está disponible en esta versión.': 'Sign-in is not available in this version.',
  'Revisamos el formato de tus datos, pero no se enviaron a ningún servidor, no se guardaron y no se inició ninguna sesión. Puedes seguir consultando el':
    'Your data format was checked, but it was not sent to any server or saved, and no session was started. You can continue browsing the',
  'sin cuenta.': 'without an account.',
  'Completa los datos para crear tu cuenta.': 'Fill in the details to create your account.',
  '¿Ya tienes cuenta?': 'Already have an account?',
  'Inicia sesión': 'Log in',
  'Nombre completo': 'Full name',
  'Mínimo {count} caracteres.': 'At least {count} characters.',
  'Confirmar contraseña': 'Confirm password',
  'Acepto los términos y condiciones': 'I accept the terms and conditions',
  'Crear cuenta': 'Create account',
  'El registro no está disponible en esta versión.': 'Registration is not available in this version.',
  'Tus datos cumplen el formato requerido, pero no se enviaron a ningún servidor, no se guardaron y no se creó ninguna cuenta. Puedes seguir consultando el':
    'Your data matches the required format, but it was not sent to any server or saved, and no account was created. You can continue browsing the',
  'sin registrarte.': 'without signing up.',
  'Ingresa tu correo electrónico.': 'Enter your email address.',
  'Ingresa un correo válido, por ejemplo nombre@dominio.com.': 'Enter a valid email, for example name@example.com.',
  'Ingresa tu contraseña.': 'Enter your password.',
  'Crea una contraseña.': 'Create a password.',
  'La contraseña debe tener al menos {count} caracteres.': 'Password must be at least {count} characters.',
  'Confirma tu contraseña.': 'Confirm your password.',
  'Las contraseñas no coinciden.': 'Passwords do not match.',
  'Escribe tu nombre completo.': 'Enter your full name.',
  'Debes aceptar los términos y condiciones para continuar.': 'You must accept the terms and conditions to continue.',
  'Introduce una cantidad.': 'Enter an amount.',
  'La cantidad no puede ser negativa.': 'The amount cannot be negative.',
  'Introduce un número válido, por ejemplo 1,5 o 0.25.': 'Enter a valid number, for example 1.5 or 0.25.',
  'Introduce un número válido.': 'Enter a valid number.',
  'La cantidad debe ser mayor que cero.': 'The amount must be greater than zero.',
  'La cantidad es demasiado grande.': 'The amount is too large.',
  'No pudimos conectar con CoinGecko. Revisa tu conexión a internet e inténtalo de nuevo.':
    'Could not connect to CoinGecko. Check your internet connection and try again.',
  'CoinGecko tardó demasiado en responder. Inténtalo de nuevo.':
    'CoinGecko took too long to respond. Please try again.',
  'El servicio de CoinGecko está temporalmente limitado por exceso de solicitudes. Vuelve a intentarlo en unos {seconds} segundos.':
    'CoinGecko is temporarily rate-limiting requests. Try again in about {seconds} seconds.',
  'CoinGecko no encontró el recurso solicitado.': 'CoinGecko could not find the requested resource.',
  'CoinGecko rechazó la solicitud (clave de API no válida o sin permisos). Revisa VITE_COINGECKO_API_KEY.':
    'CoinGecko rejected the request (invalid API key or insufficient permissions). Check VITE_COINGECKO_API_KEY.',
  'CoinGecko respondió con un error (código {status}). Inténtalo más tarde.':
    'CoinGecko returned an error (code {status}). Please try again later.',
  'CoinGecko devolvió una respuesta inesperada. Inténtalo de nuevo más tarde.':
    'CoinGecko returned an unexpected response. Please try again later.',
  'Español': 'Spanish',
  'Cambiar idioma a inglés': 'Change language to English',
  'Change language to Spanish': 'Cambiar idioma a español',
};

const STORAGE_KEY = 'panel-cripto-language';

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === 'en' ? 'en' : 'es';
    } catch (error) {
      console.warn('[LanguageProvider] Could not read saved language preference.', error);
      return 'es';
    }
  });

  useEffect(() => {
    document.documentElement.lang = language;
    try {
      localStorage.setItem(STORAGE_KEY, language);
    } catch (error) {
      console.warn('[LanguageProvider] Could not save language preference.', error);
    }
  }, [language]);

  const value = useMemo(() => {
    const t = (text, params = {}) => {
      const template = language === 'en' ? translations[text] ?? text : text;
      return template.replace(/\{(\w+)\}/g, (_, key) => String(params[key] ?? `{${key}}`));
    };
    const errorMessage = (error) => {
      if (!error?.kind) return error?.message ?? '';
      if (error.kind === 'network') return t('No pudimos conectar con CoinGecko. Revisa tu conexión a internet e inténtalo de nuevo.');
      if (error.kind === 'timeout') return t('CoinGecko tardó demasiado en responder. Inténtalo de nuevo.');
      if (error.kind === 'rate-limit') {
        const seconds = Number(error.message.match(/(\d+)\s+segundos?/)?.[1] ?? 1);
        return t('El servicio de CoinGecko está temporalmente limitado por exceso de solicitudes. Vuelve a intentarlo en unos {seconds} segundos.', { seconds });
      }
      if (error.kind === 'not-found') return t('CoinGecko no encontró el recurso solicitado.');
      if (error.kind === 'auth') return t('CoinGecko rechazó la solicitud (clave de API no válida o sin permisos). Revisa VITE_COINGECKO_API_KEY.');
      if (error.kind === 'http') return t('CoinGecko respondió con un error (código {status}). Inténtalo más tarde.', { status: error.status });
      if (error.kind === 'invalid') return t('CoinGecko devolvió una respuesta inesperada. Inténtalo de nuevo más tarde.');
      return error.message;
    };
    return { language, setLanguage, t, errorMessage };
  }, [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
