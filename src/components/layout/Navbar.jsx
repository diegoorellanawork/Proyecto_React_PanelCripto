import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useFavorites } from '../../context/useFavorites';
import { useLanguage } from '../../context/useLanguage';
import { BrandMark, CloseIcon, MenuIcon } from '../common/Icons';

const navLinkClass = ({ isActive }) =>
  `inline-flex min-h-11 items-center rounded-field px-4 py-2 text-base font-medium no-underline transition-colors ${
    isActive
      ? 'bg-page text-navy underline decoration-2 underline-offset-8'
      : 'text-navy hover:bg-page hover:text-teal-dark'
  }`;

export const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [previousPath, setPreviousPath] = useState(null);
  const location = useLocation();
  const buttonRef = useRef(null);
  const { favoriteIds } = useFavorites();
  const { language, setLanguage, t } = useLanguage();
  const links = [
    { to: '/', label: t('Mercado'), end: true },
    { to: '/portfolio', label: t('Portafolio') },
    { to: '/convertidor', label: t('Convertidor') },
    { to: '/global', label: t('Resumen global') },
  ];
  const languageButton = (
    <button
      type="button"
      onClick={() => setLanguage(language === 'es' ? 'en' : 'es')}
      className="btn btn-secondary"
      aria-label={t(language === 'es' ? 'Cambiar idioma a inglés' : 'Change language to Spanish')}
      title={t(language === 'es' ? 'Cambiar idioma a inglés' : 'Change language to Spanish')}
    >
      {language === 'es' ? 'EN' : 'ES'}
    </button>
  );

  // Cierra el menú móvil al cambiar de ruta (ajuste de estado durante el render).
  if (previousPath !== location.pathname) {
    setPreviousPath(location.pathname);
    if (open) setOpen(false);
  }

  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

  const authButtons = (
    <>
      <Link to="/iniciar-sesion" className="btn btn-secondary">
        {t('Iniciar sesión')}
      </Link>
      <Link to="/registrarse" className="btn btn-primary">
        {t('Registrarse')}
      </Link>
    </>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-2 text-navy no-underline">
          <BrandMark />
          <span className="text-xl font-bold">{t('Panel Cripto')}</span>
        </Link>

        <nav aria-label={t('Principal')} className="hidden items-center gap-1 lg:flex">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end} className={navLinkClass}>
              {link.label}
              {link.to === '/portfolio' && favoriteIds.length > 0 && (
                <span className="num ml-2 rounded-full bg-navy px-2 text-sm font-semibold text-white">
                  {favoriteIds.length}
                  <span className="sr-only"> {t('favoritos')}</span>
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">{languageButton}{authButtons}</div>

        <button
          ref={buttonRef}
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-field border border-field text-navy lg:hidden"
          aria-expanded={open}
          aria-controls="menu-movil"
          aria-label={t(open ? 'Cerrar menú de navegación' : 'Abrir menú de navegación')}
          onClick={() => setOpen((current) => !current)}
        >
          {open ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      <div id="menu-movil" hidden={!open} className="border-t border-line px-4 pb-4 pt-2 sm:px-6 lg:hidden">
        <nav aria-label={t('Principal (mobile)')} className="flex flex-col gap-1">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end} className={navLinkClass}>
              {link.label}
              {link.to === '/portfolio' && favoriteIds.length > 0 && (
                <span className="num ml-2 rounded-full bg-navy px-2 text-sm font-semibold text-white">
                  {favoriteIds.length}
                  <span className="sr-only"> {t('favoritos')}</span>
                </span>
              )}
            </NavLink>
          ))}
        </nav>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">{languageButton}{authButtons}</div>
      </div>
    </header>
  );
};
