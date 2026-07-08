import { reactive, computed } from 'vue';

/**
 * Converte una temperatura in Kelvin in un colore RGB approssimato.
 * Algoritmo di Tanner Helland — mapping da temperatura di corpo nero a RGB.
 * Range utile: 1000K – 40000K, noi usiamo 3000K – 9500K.
 */
function temperatureToRGB(kelvin) {
  const temp = kelvin / 100;
  let r, g, b;

  if (temp <= 66) {
    r = 255;
    g = 99.4708025861 * Math.log(temp) - 161.1195681661;
    b = temp <= 19 ? 0 : 138.5177312231 * Math.log(temp - 10) - 305.0447927307;
  } else {
    r = 329.698727446 * Math.pow(temp - 60, -0.1332047592);
    g = 288.1221695283 * Math.pow(temp - 60, -0.0755148492);
    b = 255;
  }

  r = Math.max(0, Math.min(255, Math.round(r)));
  g = Math.max(0, Math.min(255, Math.round(g)));
  b = Math.max(0, Math.min(255, Math.round(b)));

  return { r, g, b };
}

/** Risoluzioni predefinite con etichette leggibili */
export const RESOLUTION_PRESETS = [
  { label: 'HD Ready', width: 1366, height: 768, icon: 'HD' },
  { label: 'Full HD', width: 1920, height: 1080, icon: 'FHD' },
  { label: 'QHD', width: 2560, height: 1440, icon: 'QHD' },
  { label: '4K UHD', width: 3840, height: 2160, icon: '4K' },
];

/** Incrementi disponibili per la scala */
export const SCALE_STEPS = [100, 125, 150, 175, 200];

// ─── Stato reattivo condiviso (modulo singleton) ────────────────────────────

const settings = reactive({
  resolution: { width: 1920, height: 1080 },
  scale: 100,
  orientation: /** @type {'landscape' | 'portrait'} */ ('landscape'),
  brightness: 50,
  contrast: 50,
  colorTemperature: 6500,
});

// ─── Composizione pubblica ──────────────────────────────────────────────────

export function useDisplaySettings() {
  /** Risoluzione effettiva tenendo conto dell'orientamento */
  const effectiveResolution = computed(() => {
    const { width, height } = settings.resolution;
    return settings.orientation === 'portrait'
      ? { width: height, height: width }
      : { width, height };
  });

  /** Aspect ratio effettivo (width / height) */
  const aspectRatio = computed(() => {
    const { width, height } = effectiveResolution.value;
    return width / height;
  });

  /** Colore RGB corrispondente alla temperatura corrente */
  const colorTint = computed(() => temperatureToRGB(settings.colorTemperature));

  /** Stringa CSS rgb() per la tinta di temperatura */
  const tintCSS = computed(() => {
    const { r, g, b } = colorTint.value;
    return `rgb(${r}, ${g}, ${b})`;
  });

  /** Luminosità come frazione 0-2 (1 = normale) per il filtro CSS */
  const brightnessFilter = computed(() => {
    // 0% slider → 0.5x, 50% → 1x, 100% → 1.5x
    return 0.5 + (settings.brightness / 100) * 1.0;
  });

  /** Contrasto come frazione 0-2 */
  const contrastFilter = computed(() => {
    // 0% slider → 0.5x, 50% → 1x, 100% → 1.5x
    return 0.5 + (settings.contrast / 100) * 1.0;
  });

  /** Fattore di scala come decimale (1.0 = 100%) */
  const scaleFactor = computed(() => settings.scale / 100);

  // ─── Azioni (mutazioni) ──────────────────────────────────────────────────

  function setResolution(width, height) {
    settings.resolution = { width, height };
  }

  function setScale(percent) {
    settings.scale = Math.max(100, Math.min(200, percent));
  }

  function toggleOrientation() {
    settings.orientation =
      settings.orientation === 'landscape' ? 'portrait' : 'landscape';
  }

  function setOrientation(orientation) {
    if (orientation === 'landscape' || orientation === 'portrait') {
      settings.orientation = orientation;
    }
  }

  function setBrightness(value) {
    settings.brightness = Math.max(0, Math.min(100, value));
  }

  function setContrast(value) {
    settings.contrast = Math.max(0, Math.min(100, value));
  }

  function setColorTemperature(kelvin) {
    settings.colorTemperature = Math.max(3000, Math.min(9500, kelvin));
  }

  /** Reimposta tutte le impostazioni ai valori predefiniti */
  function resetAll() {
    settings.resolution = { width: 1920, height: 1080 };
    settings.scale = 100;
    settings.orientation = 'landscape';
    settings.brightness = 50;
    settings.contrast = 50;
    settings.colorTemperature = 6500;
  }

  return {
    // Stato (sola lettura tramite computed)
    settings,
    effectiveResolution,
    aspectRatio,
    colorTint,
    tintCSS,
    brightnessFilter,
    contrastFilter,
    scaleFactor,
    // Azioni
    setResolution,
    setScale,
    toggleOrientation,
    setOrientation,
    setBrightness,
    setContrast,
    setColorTemperature,
    resetAll,
  };
}
