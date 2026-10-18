import { useId, useState } from 'react';
import { AlertIcon, EyeIcon, EyeOffIcon } from '../common/Icons';
import { useLanguage } from '../../context/useLanguage';

const FieldError = ({ id, message }) =>
  message ? (
    <p id={id} className="mt-2 flex items-start gap-2 text-sm font-medium text-negative">
      <AlertIcon width={16} height={16} className="mt-0.5 shrink-0" />
      <span>{message}</span>
    </p>
  ) : null;

const describedBy = (...ids) => ids.filter(Boolean).join(' ') || undefined;

// Campo de texto con etiqueta visible, ayuda opcional y mensaje de error asociado.
export const TextField = ({ label, name, error, hint, trailing, className = '', ...inputProps }) => {
  const id = useId();
  const hintId = hint ? `${id}-hint` : null;
  const errorId = error ? `${id}-error` : null;

  return (
    <div>
      <label htmlFor={id} className="label">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          name={name}
          required
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy(hintId, errorId)}
          className={`field ${className}`}
          {...inputProps}
        />
        {trailing}
      </div>
      {hint && (
        <p id={hintId} className="mt-2 text-sm text-muted">
          {hint}
        </p>
      )}
      <FieldError id={errorId} message={error} />
    </div>
  );
};

// Contraseña con botón para mostrar u ocultar. Cada campo lleva su propio estado.
export const PasswordField = ({ label, ...props }) => {
  const [visible, setVisible] = useState(false);
  const toggleId = useId();
  const { t } = useLanguage();

  return (
    <TextField
      label={label}
      type={visible ? 'text' : 'password'}
      spellCheck={false}
      autoCapitalize="none"
      className="pr-14 [&::-ms-reveal]:hidden"
      trailing={
        <button
          id={toggleId}
          type="button"
          onClick={() => setVisible((current) => !current)}
          aria-label={`${t(visible ? 'Ocultar' : 'Mostrar')} ${label.toLowerCase()}`}
          className="absolute right-1 top-0.5 inline-flex h-10 w-10 items-center justify-center rounded-full text-muted hover:text-navy"
        >
          {visible ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      }
      {...props}
    />
  );
};

// Casilla con etiqueta clicable. Sin `checked` funciona sin control de estado (solo visual).
export const CheckboxField = ({ label, name, error, ...inputProps }) => {
  const id = useId();
  const errorId = error ? `${id}-error` : null;

  return (
    <div>
      <label htmlFor={id} className="flex min-h-11 cursor-pointer items-start gap-3 py-2">
        <input
          id={id}
          name={name}
          type="checkbox"
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy(errorId)}
          className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer accent-navy"
          {...inputProps}
        />
        <span>{label}</span>
      </label>
      <FieldError id={errorId} message={error} />
    </div>
  );
};
