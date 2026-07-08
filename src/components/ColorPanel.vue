<template>
  <fieldset class="panel color-panel">
    <legend class="panel-title">Calibrazione colore</legend>

    <!-- Luminosità -->
    <div class="slider-group">
      <div class="slider-header">
        <label for="brightness-slider" class="slider-label">
          <svg class="slider-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="4"/>
            <path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/>
            <path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/>
            <path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>
          </svg>
          Luminosità
        </label>
        <output class="slider-value" for="brightness-slider">{{ settings.brightness }}%</output>
      </div>
      <input
        id="brightness-slider"
        type="range"
        :value="settings.brightness"
        min="0"
        max="100"
        step="1"
        class="slider"
        @input="onBrightnessInput"
      />
    </div>

    <!-- Contrasto -->
    <div class="slider-group">
      <div class="slider-header">
        <label for="contrast-slider" class="slider-label">
          <svg class="slider-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 2a10 10 0 0 1 0 20V2z"/>
          </svg>
          Contrasto
        </label>
        <output class="slider-value" for="contrast-slider">{{ settings.contrast }}%</output>
      </div>
      <input
        id="contrast-slider"
        type="range"
        :value="settings.contrast"
        min="0"
        max="100"
        step="1"
        class="slider"
        @input="onContrastInput"
      />
    </div>

    <!-- Temperatura colore -->
    <div class="slider-group temp-group">
      <div class="slider-header">
        <label for="temperature-slider" class="slider-label">
          <svg class="slider-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z"/>
          </svg>
          Temperatura colore
        </label>
        <output class="slider-value" for="temperature-slider">{{ settings.colorTemperature }}K</output>
      </div>
      <div class="temp-slider-wrap">
        <span class="temp-end temp-warm" aria-hidden="true">Calda</span>
        <input
          id="temperature-slider"
          type="range"
          :value="settings.colorTemperature"
          min="3000"
          max="9500"
          step="100"
          class="slider temperature-slider"
          @input="onTemperatureInput"
        />
        <span class="temp-end temp-cool" aria-hidden="true">Fredda</span>
      </div>
      <div class="temp-presets">
        <button
          v-for="preset in TEMP_PRESETS"
          :key="preset.value"
          type="button"
          class="temp-preset-btn"
          :class="{ active: settings.colorTemperature === preset.value }"
          @click="setColorTemperature(preset.value)"
          :aria-label="`Temperatura ${preset.label}: ${preset.value} Kelvin`"
        >
          <span
            class="temp-swatch"
            :style="{ background: tempSwatchColor(preset.value) }"
            aria-hidden="true"
          ></span>
          {{ preset.label }}
        </button>
      </div>
    </div>

    <!-- Pulsante reset -->
    <button type="button" class="reset-btn" @click="resetAll">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/>
        <path d="M21 3v5h-5"/>
      </svg>
      Ripristina impostazioni predefinite
    </button>
  </fieldset>
</template>

<script setup>
import { useDisplaySettings } from '../composables/useDisplaySettings.js';

const { settings, setBrightness, setContrast, setColorTemperature, resetAll } =
  useDisplaySettings();

const TEMP_PRESETS = [
  { label: 'Luce calda', value: 3000 },
  { label: 'Neutro', value: 6500 },
  { label: 'Luce fredda', value: 9500 },
];

function tempSwatchColor(kelvin) {
  if (kelvin <= 3000) return '#ffb46b';
  if (kelvin >= 9500) return '#d6e2ff';
  if (kelvin <= 6500) return '#fff5e8';
  return '#eef2ff';
}

function onBrightnessInput(e) {
  setBrightness(Number(e.target.value));
}

function onContrastInput(e) {
  setContrast(Number(e.target.value));
}

function onTemperatureInput(e) {
  setColorTemperature(Number(e.target.value));
}
</script>

<style scoped>
/* ═══════════════════════════════════════════════════════════════════════════
   Pannello Calibrazione Colore
   ═══════════════════════════════════════════════════════════════════════════ */

.color-panel {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

/* Gruppo slider */
.slider-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.slider-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.slider-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text);
}

.slider-icon {
  color: var(--color-text-secondary);
  flex-shrink: 0;
}

.slider-value {
  font-family: var(--font-mono);
  font-size: 14px;
  font-weight: 600;
  color: var(--color-accent);
  min-width: 48px;
  text-align: right;
}

.slider {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: var(--color-border);
  outline: none;
  cursor: pointer;
  margin: 0;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: var(--color-accent);
  border: 2px solid #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: box-shadow 150ms ease;
}

.slider::-webkit-slider-thumb:hover {
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.3);
}

.slider::-moz-range-thumb {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: var(--color-accent);
  border: 2px solid #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
  cursor: pointer;
}

.slider:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 4px;
}

/* ─── Temperature slider special ────────────────────────────────────────── */

.temp-group {
  background: var(--color-accent-light);
  border-radius: 12px;
  padding: 14px;
  margin: 0 -6px;
}

.temp-slider-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
}

.temp-end {
  font-size: 11px;
  font-weight: 500;
  color: var(--color-text-secondary);
  flex-shrink: 0;
  min-width: 36px;
}

.temp-warm { text-align: right; }
.temp-cool { text-align: left; }

.temperature-slider {
  background: linear-gradient(
    to right,
    #ffb46b 0%,
    #ffd8a8 25%,
    #fff5e8 50%,
    #eef2ff 75%,
    #d6e2ff 100%
  ) !important;
}

/* Preset temperatura */
.temp-presets {
  display: flex;
  gap: 8px;
  margin-top: 4px;
}

.temp-preset-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: var(--color-surface);
  border: 1.5px solid var(--color-border);
  border-radius: 20px;
  cursor: pointer;
  font-family: var(--font-body);
  font-size: 12px;
  font-weight: 500;
  color: var(--color-text);
  transition: border-color 200ms ease, background 200ms ease;
  min-height: 36px;
  flex: 1;
  justify-content: center;
}

.temp-preset-btn:hover {
  border-color: var(--color-accent);
}

.temp-preset-btn:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}

.temp-preset-btn.active {
  border-color: var(--color-accent);
  background: var(--color-accent-light);
  font-weight: 600;
}

.temp-swatch {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 1px solid rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
}

/* ─── Reset button ──────────────────────────────────────────────────────── */

.reset-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 10px 16px;
  background: transparent;
  border: 1.5px solid var(--color-border);
  border-radius: 10px;
  cursor: pointer;
  font-family: var(--font-body);
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-secondary);
  transition: border-color 200ms ease, color 200ms ease, background 200ms ease;
  min-height: 44px;
}

.reset-btn:hover {
  border-color: var(--color-accent);
  color: var(--color-accent);
  background: var(--color-accent-light);
}

.reset-btn:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}
</style>
