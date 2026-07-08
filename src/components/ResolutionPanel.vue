<template>
  <fieldset class="panel resolution-panel">
    <legend class="panel-title">Risoluzione e scala</legend>

    <!-- Preset risoluzioni -->
    <div class="preset-grid" role="radiogroup" aria-label="Risoluzioni predefinite">
      <button
        v-for="preset in RESOLUTION_PRESETS"
        :key="preset.label"
        type="button"
        class="preset-btn"
        :class="{ active: isPresetActive(preset) }"
        :aria-pressed="isPresetActive(preset)"
        :aria-label="`Risoluzione ${preset.label}: ${preset.width} × ${preset.height}`"
        @click="setResolution(preset.width, preset.height)"
      >
        <span class="preset-icon">{{ preset.icon }}</span>
        <span class="preset-label">{{ preset.label }}</span>
        <span class="preset-dims">{{ preset.width }}×{{ preset.height }}</span>
      </button>
    </div>

    <!-- Dimensioni personalizzate -->
    <div class="custom-dims">
      <div class="dim-group">
        <label for="res-width">Larghezza</label>
        <input
          id="res-width"
          type="number"
          :value="settings.resolution.width"
          min="640"
          max="7680"
          step="2"
          @input="onWidthInput"
        />
      </div>
      <span class="dim-sep">×</span>
      <div class="dim-group">
        <label for="res-height">Altezza</label>
        <input
          id="res-height"
          type="number"
          :value="settings.resolution.height"
          min="480"
          max="4320"
          step="2"
          @input="onHeightInput"
        />
      </div>
    </div>

    <!-- Slider scala -->
    <div class="slider-group">
      <div class="slider-header">
        <label for="scale-slider" class="slider-label">Scala</label>
        <output class="slider-value" for="scale-slider">{{ settings.scale }}%</output>
      </div>
      <div class="slider-with-stops">
        <input
          id="scale-slider"
          type="range"
          :value="settings.scale"
          min="100"
          max="200"
          step="25"
          class="slider scale-slider"
          @input="onScaleInput"
        />
        <div class="slider-stops" aria-hidden="true">
          <span
            v-for="step in SCALE_STEPS"
            :key="step"
            class="slider-stop"
            :class="{ filled: step <= settings.scale }"
          ></span>
        </div>
      </div>
      <div class="scale-labels">
        <span v-for="step in SCALE_STEPS" :key="step" class="scale-label">{{ step }}%</span>
      </div>
    </div>
  </fieldset>
</template>

<script setup>
import { useDisplaySettings, RESOLUTION_PRESETS, SCALE_STEPS } from '../composables/useDisplaySettings.js';

const { settings, setResolution, setScale } = useDisplaySettings();

function isPresetActive(preset) {
  return (
    settings.resolution.width === preset.width &&
    settings.resolution.height === preset.height
  );
}

function onScaleInput(e) {
  setScale(Number(e.target.value));
}

function onWidthInput(e) {
  const w = Number(e.target.value) || 1920;
  setResolution(Math.max(640, Math.min(7680, w)), settings.resolution.height);
}

function onHeightInput(e) {
  const h = Number(e.target.value) || 1080;
  setResolution(settings.resolution.width, Math.max(480, Math.min(4320, h)));
}
</script>

<style scoped>
/* ═══════════════════════════════════════════════════════════════════════════
   Pannello Risoluzione & Scala
   ═══════════════════════════════════════════════════════════════════════════ */

.resolution-panel {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* Preset grid */
.preset-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.preset-btn {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 2px;
  padding: 10px 12px;
  background: var(--color-surface);
  border: 1.5px solid var(--color-border);
  border-radius: 10px;
  cursor: pointer;
  transition: border-color 200ms ease, background 200ms ease, box-shadow 200ms ease;
  font-family: var(--font-body);
  text-align: left;
  min-height: 44px;
}

.preset-btn:hover {
  border-color: var(--color-accent);
  background: var(--color-accent-light);
}

.preset-btn:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}

.preset-btn.active {
  border-color: var(--color-accent);
  background: var(--color-accent-light);
  box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.15);
}

.preset-icon {
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 700;
  color: var(--color-accent);
  letter-spacing: 0.05em;
}

.preset-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text);
  line-height: 1.2;
}

.preset-dims {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--color-text-secondary);
}

/* Dimensioni personalizzate */
.custom-dims {
  display: flex;
  align-items: flex-end;
  gap: 8px;
}

.dim-group {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.dim-group label {
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.dim-group input {
  width: 100%;
  padding: 8px 10px;
  border: 1.5px solid var(--color-border);
  border-radius: 8px;
  font-family: var(--font-mono);
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text);
  background: var(--color-surface);
  box-sizing: border-box;
  transition: border-color 200ms ease;
  min-height: 44px;
}

.dim-group input:focus {
  outline: 2px solid var(--color-accent);
  outline-offset: -2px;
  border-color: var(--color-accent);
}

.dim-sep {
  font-size: 18px;
  font-weight: 300;
  color: var(--color-text-secondary);
  padding-bottom: 10px;
}

/* Slider */
.slider-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.slider-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
}

.slider-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.slider-value {
  font-family: var(--font-mono);
  font-size: 15px;
  font-weight: 600;
  color: var(--color-accent);
  min-width: 44px;
  text-align: right;
}

.slider-with-stops {
  position: relative;
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

.slider-stops {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 6px;
  border-radius: 3px;
  display: flex;
  pointer-events: none;
  overflow: hidden;
}

.slider-stop {
  flex: 1;
  height: 100%;
}

.slider-stop.filled {
  background: var(--color-accent);
  opacity: 0.4;
}

.scale-labels {
  display: flex;
  justify-content: space-between;
  padding: 0 2px;
}

.scale-label {
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--color-text-secondary);
}
</style>
