import { formatPercent, getTrend } from '../../utils/formatters';
import { useLanguage } from '../../context/useLanguage';

const styles = {
  up: { arrow: '▲', cls: 'text-positive', label: 'subida' },
  down: { arrow: '▼', cls: 'text-negative', label: 'bajada' },
  flat: { arrow: '■', cls: 'text-muted', label: 'sin cambios' },
};

// Variación porcentual: color + flecha + signo (nunca solo color).
export const ChangeBadge = ({ value }) => {
  const { t, language } = useLanguage();
  const trend = getTrend(value);
  if (!trend) return <span className="num text-muted">—</span>;
  const { arrow, cls, label } = styles[trend];
  return (
    <span className={`num inline-flex items-center gap-1 font-semibold ${cls}`}>
      <span aria-hidden="true">{arrow}</span>
      <span className="sr-only">{t(label)}: </span>
      {formatPercent(value, language)}
    </span>
  );
};
