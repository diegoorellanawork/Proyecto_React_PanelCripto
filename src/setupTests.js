import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Desmonta lo renderizado después de cada prueba para que no se mezclen entre sí.
afterEach(() => {
  cleanup();
});
