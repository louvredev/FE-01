const STORAGE_KEY = 'lightSensorThresholds';

export const DEFAULT_THRESHOLDS = {
  minLux: 50,
  maxLux: 800,
  alertsEnabled: true,
};

export function getThresholds() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return { ...DEFAULT_THRESHOLDS };
  }

  try {
    const parsed = JSON.parse(raw);
    return {
      minLux: Number(parsed.minLux) || DEFAULT_THRESHOLDS.minLux,
      maxLux: Number(parsed.maxLux) || DEFAULT_THRESHOLDS.maxLux,
      alertsEnabled:
        typeof parsed.alertsEnabled === 'boolean'
          ? parsed.alertsEnabled
          : DEFAULT_THRESHOLDS.alertsEnabled,
    };
  } catch {
    return { ...DEFAULT_THRESHOLDS };
  }
}

export async function saveThresholds(thresholds) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(thresholds));
  return thresholds;
}
