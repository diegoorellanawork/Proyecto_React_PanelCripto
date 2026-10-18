# Panel Cripto

Aplicación frontend informativa para seguir criptomonedas con datos reales de
[CoinGecko](https://www.coingecko.com). Construida con React, Vite, Tailwind CSS
y React Router. No hay backend, base de datos, cuentas de usuario ni operaciones
financieras reales.

## Funcionalidades

| Ruta | Vista |
| --- | --- |
| `/` | **Mercado**: resumen global, búsqueda (local + remota con debounce) y las 100 principales monedas |
| `/coin/:id` | **Detalle** de una moneda (precio, variación 24 h, capitalización, volumen, máx./mín. 24 h, descripción) |
| `/portfolio` | **Portafolio**: lista temporal de favoritos |
| `/convertidor` | **Convertidor** informativo entre criptomonedas (`/exchange` redirige aquí) |
| `/global` | **Resumen global** del mercado |
| `/iniciar-sesion`, `/registrarse` | Formularios visuales con validación local: no existe autenticación ni se envían datos |
| `*` | Página 404 |

La interfaz está disponible en español e inglés. El idioma puede cambiarse desde
el botón **EN/ES** de la navegación y la selección se conserva al volver a abrir
la aplicación.

### Favoritos (Portafolio)

Los favoritos viven **solo en memoria de React** (`src/context/FavoritesProvider.jsx`).
No se usa `localStorage`, `sessionStorage`, cookies ni IndexedDB: al recargar la
página la lista queda vacía. No hay saldos, cantidades, precios de compra ni ganancias.

### Convertidor

`cantidad destino = cantidad origen × precio origen (USD) / precio destino (USD)`,
con precios de `/simple/price`. Se validan precios numéricos, finitos y mayores que
cero; si faltan no se asume ninguna tasa. Cambiar la cantidad recalcula en memoria
sin nuevas peticiones. Admite coma decimal.

## Puesta en marcha

```bash
npm install
npm run dev      # desarrollo
npm run lint
npm run build
npm run preview
```

### Clave de CoinGecko (opcional)

Sin clave se usa el acceso público de CoinGecko, que tiene límites bajos; si se
superan, la aplicación muestra un aviso de límite y permite reintentar.

1. Crea una clave Demo en CoinGecko.
2. Copia `.env.example` a `.env.local` (ignorado por git gracias a `*.local`).
3. Define `VITE_COINGECKO_API_KEY=tu_clave_demo`.

> **Las variables `VITE_` quedan expuestas en el navegador.** No es un secreto:
> usa únicamente una clave Demo y nunca claves privadas o de pago.

## Estructura

```
src/
  components/{common,crypto,layout}/   interfaz reutilizable
  context/                             favoritos en memoria
  hooks/                               useApiResource, useCryptoData, useDebouncedValue, usePageTitle
  pages/                               vistas
  services/cryptoApi.js                cliente CoinGecko (caché, errores, validación)
  utils/formatters.js                  formateo y validación de cantidades
```

## Diseño

La identidad visual está definida en `DESIGN.md` (paleta, tipografía, accesibilidad)
y se aplica mediante tokens en `src/index.css`.

**Tipografía:** se usa Inter si está instalada en el sistema; si no, una fuente del
sistema. El proyecto no incluye archivos de Inter. Para usarla localmente, copia los
`.woff2` a `public/fonts/` y añade un `@font-face` en `src/index.css` (sin instalar
dependencias).
