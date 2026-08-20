import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { saveThresholds } from '../services/thresholdService.js';
import {
  LUX_MAX,
  LUX_MIN,
  thresholdSettingsSchema,
} from './thresholdSettingsSchema.js';

const inputClassName =
  'mt-2 w-full rounded-xl border border-slate-600 bg-slate-950/80 px-3 py-2.5 text-white outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30';

export default function ThresholdSettingsForm({
  defaultValues,
  onSaved,
}) {
  const [submitError, setSubmitError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(thresholdSettingsSchema),
    defaultValues: {
      minLux: defaultValues?.minLux ?? 50,
      maxLux: defaultValues?.maxLux ?? 800,
      alertsEnabled: defaultValues?.alertsEnabled ?? true,
    },
  });

  useEffect(() => {
    if (!defaultValues) {
      return;
    }

    reset({
      minLux: defaultValues.minLux,
      maxLux: defaultValues.maxLux,
      alertsEnabled: defaultValues.alertsEnabled,
    });
  }, [defaultValues, reset]);

  const minLux = Number(watch('minLux'));
  const maxLux = Number(watch('maxLux'));

  function registerLuxField(name) {
    const field = register(name, { valueAsNumber: true });

    return {
      ...field,
      onBlur: (event) => {
        field.onBlur(event);
        // Field angka tidak boleh kosong: kosong saat blur kembali ke 0.
        if (event.target.value === '') {
          setValue(name, 0, { shouldValidate: true, shouldDirty: true });
        }
      },
    };
  }

  async function onSubmit(values) {
    setSuccessMessage('');
    setSubmitError('');

    try {
      const saved = await saveThresholds(values);
      setSuccessMessage('Pengaturan threshold berhasil disimpan.');
      onSaved?.(saved);
    } catch {
      setSubmitError('Gagal menyimpan pengaturan. Coba lagi.');
    }
  }

  const rangeSpan = LUX_MAX - LUX_MIN;
  const safeStart = Number.isFinite(minLux)
    ? Math.min(Math.max(minLux, LUX_MIN), LUX_MAX)
    : LUX_MIN;
  const safeEnd = Number.isFinite(maxLux)
    ? Math.min(Math.max(maxLux, LUX_MIN), LUX_MAX)
    : LUX_MAX;
  const bandLeft = `${(safeStart / rangeSpan) * 100}%`;
  const bandWidth = `${(Math.max(safeEnd - safeStart, 0) / rangeSpan) * 100}%`;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="relative overflow-hidden rounded-2xl border border-slate-700 bg-slate-800/80 p-6 shadow-lg"
      noValidate
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-10 -top-16 h-40 w-40 rounded-full bg-amber-400/10 blur-2xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-16 -left-8 h-36 w-36 rounded-full bg-emerald-400/10 blur-2xl"
      />

      <div className="relative">
        <p className="text-xs font-semibold uppercase tracking-wide text-amber-400">
          Alert cahaya
        </p>
        <h2 className="mt-1 text-lg font-semibold text-white">
          Pengaturan Threshold
        </h2>
        <p className="mt-1 text-sm text-slate-400">
          Tentukan zona aman intensitas cahaya. Alert aktif jika pembacaan
          sensor keluar dari rentang ini.
        </p>

        <div className="mt-5 rounded-xl border border-slate-700/80 bg-slate-900/70 p-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Gelap</span>
            <span>Zona aman</span>
            <span>Terang</span>
          </div>
          <div className="relative mt-2 h-2 overflow-hidden rounded-full bg-slate-700">
            <div
              className="absolute inset-y-0 rounded-full bg-gradient-to-r from-emerald-400 to-amber-400"
              style={{ left: bandLeft, width: bandWidth }}
            />
          </div>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-4">
            <label
              htmlFor="minLux"
              className="block text-sm font-medium text-slate-200"
            >
              Ambang bawah (lux)
            </label>
            <input
              id="minLux"
              type="number"
              min={LUX_MIN}
              max={LUX_MAX}
              step="1"
              className={inputClassName}
              {...registerLuxField('minLux')}
            />
            {errors.minLux ? (
              <p className="mt-2 text-sm text-rose-400" role="alert">
                {errors.minLux.message}
              </p>
            ) : null}
            <p id="minLux-help" className="mt-3 text-sm leading-relaxed text-slate-400">
              Ambang bawah adalah batas gelap. Kalau ruangan lebih gelap dari
              angka ini (misalnya malam hari atau lampu mati), sistem menganggap
              cahaya terlalu rendah dan bisa mengirim alert.
            </p>
          </div>

          <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-4">
            <label
              htmlFor="maxLux"
              className="block text-sm font-medium text-slate-200"
            >
              Ambang atas (lux)
            </label>
            <input
              id="maxLux"
              type="number"
              min={LUX_MIN}
              max={LUX_MAX}
              step="1"
              className={inputClassName}
              {...registerLuxField('maxLux')}
            />
            {errors.maxLux ? (
              <p className="mt-2 text-sm text-rose-400" role="alert">
                {errors.maxLux.message}
              </p>
            ) : null}
            <p id="maxLux-help" className="mt-3 text-sm leading-relaxed text-slate-400">
              Ambang atas adalah batas silau. Kalau cahaya lebih terang dari
              angka ini (misalnya terkena matahari langsung), sistem menganggap
              intensitas terlalu tinggi dan bisa mengirim alert.
            </p>
          </div>
        </div>

        <label className="mt-4 flex items-center gap-2 text-sm text-slate-200">
          <input
            type="checkbox"
            className="size-4 accent-amber-400"
            {...register('alertsEnabled')}
          />
          Aktifkan alert
        </label>

        {submitError ? (
          <p className="mt-4 text-sm text-rose-400" role="alert">
            {submitError}
          </p>
        ) : null}
        {successMessage ? (
          <p className="mt-4 text-sm text-emerald-400" role="status">
            {successMessage}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-5 w-full rounded-lg bg-amber-400 px-4 py-2 font-semibold text-slate-900 hover:bg-amber-300 disabled:opacity-60"
        >
          {isSubmitting ? 'Menyimpan...' : 'Simpan pengaturan'}
        </button>
      </div>
    </form>
  );
}
