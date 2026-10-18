import { useCallback, useEffect, useState } from 'react';

/**
 * Carga un recurso de la API y expone { data, error, loading, refreshing, updatedAt, refetch }.
 *
 * - `key`: identifica el recurso; `null` deja el hook inactivo.
 * - `loader({ force })`: debe ser estable (función de módulo o useCallback) y
 *   devolver una promesa con `{ data, fetchedAt }`.
 * - Si una actualización falla pero ya había datos de la misma clave, se
 *   conservan junto con `error` (la interfaz debe indicar que son datos
 *   anteriores, con su hora `updatedAt`).
 * - `refreshMs`: actualización automática (solo con la pestaña visible).
 * - `keepPrevious`: conserva datos de otra clave mientras se carga la nueva.
 */
export function useApiResource(key, loader, { refreshMs = 0, keepPrevious = false } = {}) {
  const [request, setRequest] = useState({ id: 0, force: false });
  const [state, setState] = useState({
    key: null,
    data: null,
    updatedAt: null,
    error: null,
    settled: null,
  });

  const token = key === null ? null : `${key}#${request.id}`;

  useEffect(() => {
    if (key === null) return undefined;
    let cancelled = false;

    loader({ force: request.force })
      .then(({ data, fetchedAt }) => {
        if (cancelled) return;
        setState({ key, data, updatedAt: fetchedAt, error: null, settled: token });
      })
      .catch((error) => {
        if (cancelled) return;
        console.warn('[useApiResource]', key, error);
        setState((previous) => ({ ...previous, error, settled: token }));
      });

    return () => {
      cancelled = true;
    };
  }, [key, loader, request, token]);

  useEffect(() => {
    if (key === null || !refreshMs) return undefined;
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        setRequest((current) => ({ id: current.id + 1, force: false }));
      }
    }, refreshMs);
    return () => clearInterval(interval);
  }, [key, refreshMs]);

  const refetch = useCallback(() => {
    setRequest((current) => ({ id: current.id + 1, force: true }));
  }, []);

  const settled = token !== null && state.settled === token;
  const visible = key !== null && (state.key === key || (keepPrevious && state.key !== null));
  const data = visible ? state.data : null;

  return {
    data,
    updatedAt: visible ? state.updatedAt : null,
    error: settled ? state.error : null,
    loading: key !== null && !settled && data === null,
    refreshing: key !== null && !settled && data !== null,
    refetch,
  };
}
