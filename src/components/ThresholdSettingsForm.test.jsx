import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import ThresholdSettingsForm from './ThresholdSettingsForm.jsx';
import {
  MIN_LESS_THAN_MAX_ERROR,
  thresholdSettingsSchema,
} from './thresholdSettingsSchema.js';

vi.mock('../services/thresholdService.js', () => ({
  saveThresholds: vi.fn(async (values) => values),
}));

describe('thresholdSettingsSchema', () => {
  it('menolak nilai kosong atau null', () => {
    const emptyMin = thresholdSettingsSchema.safeParse({
      minLux: '',
      maxLux: 800,
      alertsEnabled: true,
    });
    const emptyMax = thresholdSettingsSchema.safeParse({
      minLux: 50,
      maxLux: '',
      alertsEnabled: true,
    });
    const nullMin = thresholdSettingsSchema.safeParse({
      minLux: null,
      maxLux: 800,
      alertsEnabled: true,
    });

    expect(emptyMin.success).toBe(false);
    expect(emptyMax.success).toBe(false);
    expect(nullMin.success).toBe(false);
    expect(emptyMin.error.issues.some((issue) => issue.message.includes('wajib diisi'))).toBe(
      true,
    );
  });

  it('menolak ambang bawah yang lebih besar dari ambang atas', () => {
    const result = thresholdSettingsSchema.safeParse({
      minLux: 900,
      maxLux: 100,
      alertsEnabled: true,
    });

    expect(result.success).toBe(false);
    expect(result.error.issues.some((issue) => issue.message === MIN_LESS_THAN_MAX_ERROR)).toBe(
      true,
    );
  });

  it('menolak nilai di luar rentang 0-100000 lux', () => {
    const belowRange = thresholdSettingsSchema.safeParse({
      minLux: -1,
      maxLux: 800,
      alertsEnabled: true,
    });
    const aboveRange = thresholdSettingsSchema.safeParse({
      minLux: 50,
      maxLux: 100001,
      alertsEnabled: true,
    });

    expect(belowRange.success).toBe(false);
    expect(aboveRange.success).toBe(false);
    expect(
      belowRange.error.issues.some((issue) => issue.message.includes('antara 0 dan 100000')),
    ).toBe(true);
    expect(
      aboveRange.error.issues.some((issue) => issue.message.includes('antara 0 dan 100000')),
    ).toBe(true);
  });
});

describe('ThresholdSettingsForm', () => {
  it('menampilkan error jika input dikosongkan lalu disubmit tanpa blur ke 0', async () => {
    const user = userEvent.setup();
    render(<ThresholdSettingsForm />);

    await user.clear(screen.getByLabelText(/ambang bawah/i));
    await user.clear(screen.getByLabelText(/ambang atas/i));
    await user.click(screen.getByRole('button', { name: /simpan pengaturan/i }));

    const alerts = await screen.findAllByRole('alert');
    expect(alerts.length).toBeGreaterThan(0);
  });

  it('menampilkan error jika ambang bawah lebih besar dari ambang atas', async () => {
    const user = userEvent.setup();
    render(<ThresholdSettingsForm />);

    await user.clear(screen.getByLabelText(/ambang bawah/i));
    await user.type(screen.getByLabelText(/ambang bawah/i), '900');
    await user.clear(screen.getByLabelText(/ambang atas/i));
    await user.type(screen.getByLabelText(/ambang atas/i), '100');
    await user.click(screen.getByRole('button', { name: /simpan pengaturan/i }));

    expect(await screen.findByText(MIN_LESS_THAN_MAX_ERROR)).toBeInTheDocument();
  });

  it('menampilkan error jika nilai di luar rentang', async () => {
    const user = userEvent.setup();
    render(<ThresholdSettingsForm />);

    await user.clear(screen.getByLabelText(/ambang atas/i));
    await user.type(screen.getByLabelText(/ambang atas/i), '100001');
    await user.click(screen.getByRole('button', { name: /simpan pengaturan/i }));

    expect(
      await screen.findByText(/nilai lux harus antara 0 dan 100000/i),
    ).toBeInTheDocument();
  });
});
