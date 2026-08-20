import { useState } from 'react';
import ThresholdSettingsForm from '../components/ThresholdSettingsForm.jsx';
import { getThresholds } from '../services/thresholdService.js';

export default function Dashboard() {
  const [thresholds, setThresholds] = useState(getThresholds);

  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col gap-6 px-4 py-10">
      <header>
        <p className="text-sm uppercase tracking-wide text-amber-400">
          Light Sensor Monitor
        </p>
        <h1 className="mt-1 text-2xl font-bold text-white">Dashboard</h1>
      </header>

      <section className="rounded-2xl border border-slate-700 bg-slate-800/60 p-5">
        <h2 className="text-sm font-medium text-slate-400">Threshold aktif</h2>
        <p className="mt-2 text-slate-200">
          {thresholds.alertsEnabled
            ? `Alert: < ${thresholds.minLux} lux atau > ${thresholds.maxLux} lux`
            : 'Alert dimatikan'}
        </p>
      </section>

      <ThresholdSettingsForm
        defaultValues={thresholds}
        onSaved={setThresholds}
      />
    </main>
  );
}
