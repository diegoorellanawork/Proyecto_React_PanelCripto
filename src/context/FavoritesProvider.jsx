import { useCallback, useMemo, useState } from 'react';
import { FavoritesContext } from './favoritesContext';

/**
 * Favoritos temporales: solo estado en memoria de React.
 * No usa localStorage, sessionStorage, cookies ni IndexedDB: al recargar
 * la página la lista vuelve a estar vacía.
 */
export function FavoritesProvider({ children }) {
  const [favoriteIds, setFavoriteIds] = useState([]);

  const isFavorite = useCallback((id) => favoriteIds.includes(id), [favoriteIds]);

  const toggleFavorite = useCallback((id) => {
    setFavoriteIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  }, []);

  const removeFavorite = useCallback((id) => {
    setFavoriteIds((current) => current.filter((item) => item !== id));
  }, []);

  const value = useMemo(
    () => ({ favoriteIds, isFavorite, toggleFavorite, removeFavorite }),
    [favoriteIds, isFavorite, toggleFavorite, removeFavorite]
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}
