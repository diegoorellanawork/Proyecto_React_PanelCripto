import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { FavoriteButton } from './FavoriteButton';
import { FavoritesProvider } from '../../context/FavoritesProvider';
import { LanguageProvider } from '../../context/LanguageProvider';

// FavoriteButton lee los contextos de favoritos e idioma: se renderiza dentro de sus Providers.
const renderWithProviders = (ui) =>
  render(
    <LanguageProvider>
      <FavoritesProvider>{ui}</FavoritesProvider>
    </LanguageProvider>
  );

describe('FavoriteButton', () => {
  it('muestra el botón para añadir la moneda a favoritos', () => {
    renderWithProviders(<FavoriteButton coinId="bitcoin" coinName="Bitcoin" />);

    const button = screen.getByRole('button', { name: 'Añadir Bitcoin a favoritos' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('aria-pressed', 'false');
  });

  it('al hacer clic marca la moneda como favorita y al volver a hacer clic la quita', async () => {
    const user = userEvent.setup();
    renderWithProviders(<FavoriteButton coinId="bitcoin" coinName="Bitcoin" />);

    await user.click(screen.getByRole('button', { name: 'Añadir Bitcoin a favoritos' }));

    const activeButton = screen.getByRole('button', { name: 'Quitar Bitcoin de favoritos' });
    expect(activeButton).toHaveAttribute('aria-pressed', 'true');

    await user.click(activeButton);

    expect(screen.getByRole('button', { name: 'Añadir Bitcoin a favoritos' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('con showLabel cambia el texto visible después del clic', async () => {
    const user = userEvent.setup();
    renderWithProviders(<FavoriteButton coinId="ethereum" coinName="Ethereum" showLabel />);

    await user.click(screen.getByText('Añadir a favoritos'));

    expect(screen.getByText('Quitar de favoritos')).toBeInTheDocument();
    expect(screen.queryByText('Añadir a favoritos')).not.toBeInTheDocument();
  });
});
