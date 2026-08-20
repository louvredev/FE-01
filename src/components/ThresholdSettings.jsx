import { useEffect, useState } from "react";
import {
  getThresholds,
  saveThresholds,
  validateThresholds,
} from "../services/thresholdService";

export default function ThresholdSettings({ onSaved }) {
  const [minLux, setMinLux] = useState(50);
  const [maxLux, setMaxLux] = useState(800);
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const saved = getThresholds();
    setMinLux(saved.minLux);
    setMaxLux(saved.maxLux);
    setAlertsEnabled(saved.alertsEnabled);
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setSuccess("");

    const nextThresholds = {
      minLux: Number(minLux),
      maxLux: Number(maxLux),
      alertsEnabled,
    };

    const validationError = validateThresholds(nextThresholds);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      const saved = await saveThresholds(nextThresholds);
      setSuccess("Pengaturan threshold berhasil disimpan.");
      onSaved?.(saved);
    } catch {
      setError("Gagal menyimpan pengaturan. Coba lagi.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-700 bg-slate-800/80 p-6 shadow-lg"
    >
      <h2 className="text-lg font-semibold text-white">
        Pengaturan Threshold
      </h2>
      <p className="mt-1 text-sm text-slate-400">
        Alert aktif jika intensitas cahaya di bawah ambang bawah atau di atas
        ambang atas.
      </p>

      <label className="mt-5 block text-sm font-medium text-slate-200">
        Ambang bawah (lux)
        <input
          type="number"
          min="0"
          step="1"
          value={minLux}
          onChange={(event) => setMinLux(event.target.value)}
          className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-white outline-none focus:border-amber-400"
          required
        />
      </label>

      <label className="mt-4 block text-sm font-medium text-slate-200">
        Ambang atas (lux)
        <input
          type="number"
          min="0"
          step="1"
          value={maxLux}
          onChange={(event) => setMaxLux(event.target.value)}
          className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-white outline-none focus:border-amber-400"
          required
        />
      </label>

      <label className="mt-4 flex items-center gap-2 text-sm text-slate-200">
        <input
          type="checkbox"
          checked={alertsEnabled}
          onChange={(event) => setAlertsEnabled(event.target.checked)}
          className="size-4 accent-amber-400"
        />
        Aktifkan alert
      </label>

      {error ? (
        <p className="mt-4 text-sm text-rose-400" role="alert">
          {error}
        </p>
      ) : null}

      {success ? (
        <p className="mt-4 text-sm text-emerald-400" role="status">
          {success}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isSaving}
        className="mt-5 w-full rounded-lg bg-amber-400 px-4 py-2 font-semibold text-slate-900 hover:bg-amber-300 disabled:opacity-60"
      >
        {isSaving ? "Menyimpan..." : "Simpan pengaturan"}
      </button>
    </form>
  );
}
