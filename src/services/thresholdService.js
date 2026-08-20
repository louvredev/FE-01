const STORAGE_KEY = "lightSensorThresholds";

export const defaultThresholds = {
  minLux: 50,
  maxLux: 800,
  alertsEnabled: true,
};

export function getThresholds() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return { ...defaultThresholds };
  }

  try {
    const parsed = JSON.parse(raw);
    return {
      minLux: Number(parsed.minLux) || defaultThresholds.minLux,
      maxLux: Number(parsed.maxLux) || defaultThresholds.maxLux,
      alertsEnabled:
        typeof parsed.alertsEnabled === "boolean"
          ? parsed.alertsEnabled
          : defaultThresholds.alertsEnabled,
    };
  } catch {
    return { ...defaultThresholds };
  }
}

export async function saveThresholds(thresholds) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(thresholds));
  return thresholds;
}

export function validateThresholds({ minLux, maxLux }) {
  const min = Number(minLux);
  const max = Number(maxLux);

  if (!Number.isFinite(min) || !Number.isFinite(max)) {
    return "Nilai threshold harus berupa angka.";
  }

  if (min < 0 || max < 0) {
    return "Nilai lux tidak boleh negatif.";
  }

  // Alert terpicu jika pembacaan < minLux atau > maxLux
  if (min >= max) {
    return "Ambang bawah harus lebih kecil dari ambang atas.";
  }

  return null;
}
