import { describe, expect, it } from 'vitest';
import { EMPTY_VALUE, formatRank, getTrend } from './formatters';

describe('getTrend', () => {
  it('devuelve "up" cuando la variación es positiva', () => {
    expect(getTrend(5.2)).toBe('up');
  });

  it('devuelve "down" cuando la variación es negativa', () => {
    expect(getTrend(-3.1)).toBe('down');
  });

  it('devuelve "flat" cuando la variación es cero', () => {
    expect(getTrend(0)).toBe('flat');
  });

  it('redondea a 2 decimales: una variación mínima cuenta como "flat"', () => {
    expect(getTrend(0.001)).toBe('flat');
    expect(getTrend(-0.004)).toBe('flat');
  });

  it('devuelve null si el valor no es un número válido', () => {
    expect(getTrend(NaN)).toBeNull();
    expect(getTrend(undefined)).toBeNull();
    expect(getTrend('abc')).toBeNull();
  });
});

describe('formatRank', () => {
  it('antepone # al puesto de la moneda', () => {
    expect(formatRank(1)).toBe('#1');
  });

  it('muestra un guion si no hay puesto', () => {
    expect(formatRank(null)).toBe(EMPTY_VALUE);
  });
});
