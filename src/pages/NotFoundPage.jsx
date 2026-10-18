import { Link } from 'react-router-dom';
import { EmptyState } from '../components/common/EmptyState';
import { usePageTitle } from '../hooks/usePageTitle';
import { useLanguage } from '../context/useLanguage';

export const NotFoundPage = () => {
  const { t } = useLanguage();
  usePageTitle(t('Página no encontrada'));
  return (
    <EmptyState
      title={t('Error 404: página no encontrada')}
      action={
        <Link to="/" className="btn btn-primary no-underline">
          {t('Volver al Mercado')}
        </Link>
      }
    >
      <p>{t('La dirección que buscas no existe en Panel Cripto.')}</p>
    </EmptyState>
  );
};
