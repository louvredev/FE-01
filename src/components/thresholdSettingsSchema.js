import { z } from 'zod';

export const LUX_MIN = 0;
export const LUX_MAX = 100000;

const EMPTY_ERROR = 'Nilai threshold wajib diisi.';
const NUMBER_ERROR = 'Nilai threshold harus berupa angka.';
const RANGE_ERROR = `Nilai lux harus antara ${LUX_MIN} dan ${LUX_MAX}.`;
export const MIN_LESS_THAN_MAX_ERROR =
  'Ambang bawah harus lebih kecil dari ambang atas.';

function parseLux(value) {
  if (value === '' || value === null || value === undefined) {
    return undefined;
  }

  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : undefined;
  }

  const trimmed = String(value).trim();
  if (trimmed === '') {
    return undefined;
  }

  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : undefined;
}

const luxValueSchema = z
  .number({
    required_error: EMPTY_ERROR,
    invalid_type_error: NUMBER_ERROR,
  })
  .min(LUX_MIN, RANGE_ERROR)
  .max(LUX_MAX, RANGE_ERROR);

export const thresholdSettingsSchema = z
  .object({
    minLux: z.preprocess(parseLux, luxValueSchema),
    maxLux: z.preprocess(parseLux, luxValueSchema),
    alertsEnabled: z.boolean().default(true),
  })
  .refine((data) => data.minLux < data.maxLux, {
    message: MIN_LESS_THAN_MAX_ERROR,
    path: ['minLux'],
  });
