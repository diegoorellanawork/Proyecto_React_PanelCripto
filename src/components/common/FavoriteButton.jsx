import { useFavorites } from '../../context/useFavorites';
import { StarIcon } from './Icons';
import { useLanguage } from '../../context/useLanguage';

// Botón de favoritos. `showLabel` muestra texto (detalle); si no, solo icono con nombre accesible.
export const FavoriteButton = ({ coinId, coinName, showLabel = false }) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { t } = useLanguage();
  const active = isFavorite(coinId);
  const label = active
    ? `${t('Quitar')} ${coinName}${t(' de favoritos')}`
    : `${t('Añadir')} ${coinName}${t(' a favoritos')}`;

  if (showLabel) {
    return (
      <button
        type="button"
        aria-pressed={active}
        onClick={() => toggleFavorite(coinId)}
        className="btn btn-secondary"
      >
        <StarIcon filled={active} />
        {t(active ? 'Quitar de favoritos' : 'Añadir a favoritos')}
      </button>
    );
  }

  return (
    <button
      type="button"
      aria-pressed={active}
      aria-label={label}
      title={label}
      onClick={() => toggleFavorite(coinId)}
      className={`relative z-10 inline-flex h-11 w-11 items-center justify-center rounded-full border border-line bg-surface hover:bg-page ${
        active ? 'text-navy' : 'text-muted'
      }`}
    >
      <StarIcon filled={active} />
    </button>
  );
};
