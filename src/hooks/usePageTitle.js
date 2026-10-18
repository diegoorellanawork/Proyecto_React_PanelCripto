import { useEffect } from 'react';

export function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} · Panel Cripto` : 'Panel Cripto';
  }, [title]);
}
