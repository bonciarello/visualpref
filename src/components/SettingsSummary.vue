<template>
  <section class="summary-section" aria-label="Riepilogo impostazioni">
    <h2 class="summary-title">Riepilogo impostazioni</h2>

    <dl class="summary-grid">
      <div class="summary-item">
        <dt>Risoluzione</dt>
        <dd>
          <span class="summary-mono">{{ effectiveResolution.width }} × {{ effectiveResolution.height }}</span>
          <span class="summary-badge">{{ aspectRatioLabel }}</span>
        </dd>
      </div>

      <div class="summary-item">
        <dt>Orientamento</dt>
        <dd>{{ settings.orientation === 'landscape' ? 'Orizzontale' : 'Verticale' }}</dd>
      </div>

      <div class="summary-item">
        <dt>Scala</dt>
        <dd>{{ settings.scale }}%</dd>
      </div>

      <div class="summary-item">
        <dt>Luminosità</dt>
        <dd>{{ settings.brightness }}%</dd>
      </div>

      <div class="summary-item">
        <dt>Contrasto</dt>
        <dd>{{ settings.contrast }}%</dd>
      </div>

      <div class="summary-item">
        <dt>Temperatura colore</dt>
        <dd>
          <span class="summary-mono">{{ settings.colorTemperature }}K</span>
          <span
            class="temp-indicator"
            :style="{ background: tintCSS }"
            :aria-label="`Tinta ${tempDescription}`"
          ></span>
        </dd>
      </div>
    </dl>

    <p class="summary-hint">
      Ogni modifica è applicata in tempo reale all'anteprima sopra.
      Le impostazioni sono solo dimostrative e non alterano il tuo schermo reale.
    </p>
  </section>
</template>

<script setup>
import { computed } from 'vue';
import { useDisplaySettings } from '../composables/useDisplaySettings.js';

const { settings, effectiveResolution, tintCSS } = useDisplaySettings();

const aspectRatioLabel = computed(() => {
  const { width, height } = effectiveResolution.value;
  const ratio = width / height;
  if (Math.abs(ratio - 16 / 9) < 0.02) return '16:9';
  if (Math.abs(ratio - 16 / 10) < 0.02) return '16:10';
  if (Math.abs(ratio - 4 / 3) < 0.02) return '4:3';
  if (Math.abs(ratio - 21 / 9) < 0.02) return '21:9';
  return `${width}:${height}`;
});

const tempDescription = computed(() => {
  const t = settings.colorTemperature;
  if (t < 4000) return 'calda';
  if (t < 5500) return 'leggermente calda';
  if (t < 7500) return 'neutra';
  return 'fredda';
});
</script>

<style scoped>
/* ═══════════════════════════════════════════════════════════════════════════
   Riepilogo Impostazioni
   ═══════════════════════════════════════════════════════════════════════════ */

.summary-section {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 14px;
  padding: 18px 20px;
}

.summary-title {
  font-family: var(--font-display);
  font-size: 14px;
  font-weight: 700;
  color: var(--color-text);
  margin: 0 0 14px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.summary-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px 24px;
  margin: 0;
  padding: 0;
}

@media (min-width: 640px) {
  .summary-grid {
    grid-template-columns: 1fr 1fr 1fr;
  }
}

.summary-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.summary-item dt {
  font-size: 11px;
  font-weight: 500;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.summary-item dd {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text);
  margin: 0;
}

.summary-mono {
  font-family: var(--font-mono);
  font-size: 13px;
  font-weight: 500;
}

.summary-badge {
  display: inline-block;
  padding: 1px 6px;
  background: var(--color-accent-light);
  color: var(--color-accent);
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 700;
  border-radius: 4px;
  letter-spacing: 0.03em;
}

.temp-indicator {
  display: inline-block;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 1px solid rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
}

.summary-hint {
  margin: 14px 0 0;
  font-size: 12px;
  color: var(--color-text-secondary);
  line-height: 1.5;
}
</style>
