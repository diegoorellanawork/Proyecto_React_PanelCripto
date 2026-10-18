import { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { useLanguage } from '../../context/useLanguage';

export const Layout = () => {
  const { t } = useLanguage();
  const { pathname } = useLocation();
  const mainRef = useRef(null);
  const firstRender = useRef(true);

  // Al navegar, devuelve el foco al contenido y vuelve arriba (lectores de pantalla y teclado).
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    window.scrollTo(0, 0);
    mainRef.current?.focus({ preventScroll: true });
  }, [pathname]);

  return (
    <div className="flex min-h-screen flex-col bg-page text-navy">
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-field focus:bg-navy focus:px-4 focus:py-2 focus:text-white"
      >
        {t('Saltar al contenido principal')}
      </a>
      <Navbar />
      <main id="contenido" ref={mainRef} tabIndex={-1} className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6">
        <Outlet />
      </main>
      <footer className="border-t border-line bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-6 text-sm text-muted sm:px-6">
          <p>
            {t('Datos de mercado proporcionados por')}{' '}
            <a href="https://www.coingecko.com" target="_blank" rel="noreferrer">
              CoinGecko
            </a>
            . {t('Panel Cripto')} {t('es informativo: no ejecuta operaciones, no gestiona fondos y no constituye asesoría financiera.')}
          </p>
        </div>
      </footer>
    </div>
  );
};
