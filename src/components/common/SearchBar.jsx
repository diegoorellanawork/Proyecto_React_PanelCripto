import { useId } from 'react';
import { CloseIcon, SearchIcon } from './Icons';
import { useLanguage } from '../../context/useLanguage';

export const SearchBar = ({ searchTerm, setSearchTerm, onSubmit }) => {
  const inputId = useId();
  const { t } = useLanguage();

  return (
    <form
      role="search"
      className="w-full max-w-xl"
      onSubmit={(event) => {
        event.preventDefault();
        if (onSubmit) onSubmit(searchTerm);
      }}
    >
      <label htmlFor={inputId} className="label">
        {t('Buscar criptomoneda por nombre o símbolo')}
      </label>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <SearchIcon className="pointer-events-none absolute left-4 top-3 text-muted" />
          <input
            id={inputId}
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder={t('Ej.: Bitcoin o BTC')}
            autoComplete="off"
            className="field pl-12 pr-12 [&::-webkit-search-cancel-button]:hidden"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              aria-label={t('Borrar búsqueda')}
              className="absolute right-1 top-0.5 inline-flex h-10 w-10 items-center justify-center rounded-full text-muted hover:text-navy"
            >
              <CloseIcon />
            </button>
          )}
        </div>
        <button type="submit" className="btn btn-primary">
          {t('Buscar')}
        </button>
      </div>
    </form>
  );
};
