<template>
  <fieldset class="panel orientation-panel">
    <legend class="panel-title">Orientamento</legend>

    <div class="orientation-toggle" role="radiogroup" aria-label="Orientamento schermo">
      <button
        type="button"
        class="orient-btn"
        :class="{ active: settings.orientation === 'landscape' }"
        :aria-pressed="settings.orientation === 'landscape'"
        aria-label="Orientamento orizzontale"
        @click="setOrientation('landscape')"
      >
        <svg
          class="orient-icon"
          width="36"
          height="24"
          viewBox="0 0 36 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <rect x="2" y="2" width="32" height="20" rx="3" />
          <line x1="6" y1="7" x2="30" y2="7" />
          <line x1="6" y1="19" x2="24" y2="19" />
        </svg>
        <span class="orient-label">Orizzontale</span>
      </button>

      <button
        type="button"
        class="orient-btn"
        :class="{ active: settings.orientation === 'portrait' }"
        :aria-pressed="settings.orientation === 'portrait'"
        aria-label="Orientamento verticale"
        @click="setOrientation('portrait')"
      >
        <svg
          class="orient-icon"
          width="20"
          height="32"
          viewBox="0 0 20 32"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <rect x="2" y="2" width="16" height="28" rx="3" />
          <line x1="5" y1="7" x2="15" y2="7" />
          <line x1="5" y1="27" x2="11" y2="27" />
        </svg>
        <span class="orient-label">Verticale</span>
      </button>
    </div>
  </fieldset>
</template>

<script setup>
import { useDisplaySettings } from '../composables/useDisplaySettings.js';

const { settings, setOrientation } = useDisplaySettings();
</script>

<style scoped>
/* ═══════════════════════════════════════════════════════════════════════════
   Pannello Orientamento
   ═══════════════════════════════════════════════════════════════════════════ */

.orientation-panel {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.orientation-toggle {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.orient-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 14px 12px;
  background: var(--color-surface);
  border: 1.5px solid var(--color-border);
  border-radius: 10px;
  cursor: pointer;
  transition: border-color 200ms ease, background 200ms ease, box-shadow 200ms ease;
  min-height: 80px;
}

.orient-btn:hover {
  border-color: var(--color-accent);
  background: var(--color-accent-light);
}

.orient-btn:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}

.orient-btn.active {
  border-color: var(--color-accent);
  background: var(--color-accent-light);
  box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.15);
}

.orient-icon {
  color: var(--color-text-secondary);
  transition: color 200ms ease;
}

.orient-btn.active .orient-icon {
  color: var(--color-accent);
}

.orient-label {
  font-family: var(--font-body);
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text);
}
</style>
