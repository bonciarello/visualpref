<template>
  <div class="app-shell">
    <!-- Header -->
    <header class="app-header">
      <div class="header-inner">
        <div class="header-brand">
          <span class="brand-dot" aria-hidden="true"></span>
          <h1 class="brand-name">VisualPref</h1>
        </div>
        <p class="brand-tagline">Regola risoluzione e colore del tuo schermo con anteprima in tempo reale</p>
      </div>
    </header>

    <!-- Main layout: anteprima al centro, controlli ai lati -->
    <main class="app-main">
      <div class="layout-grid">
        <!-- Colonna sinistra: Risoluzione + Orientamento -->
        <div class="controls-col controls-left">
          <ResolutionPanel />
          <OrientationToggle />
        </div>

        <!-- Centro: Anteprima -->
        <div class="preview-col">
          <PreviewArea />
        </div>

        <!-- Colonna destra: Colore -->
        <div class="controls-col controls-right">
          <ColorPanel />
        </div>
      </div>

      <!-- Riepilogo in fondo -->
      <SettingsSummary />
    </main>

    <!-- Footer -->
    <footer class="app-footer">
      <p>Le modifiche sono solo dimostrative — non alterano le impostazioni reali del tuo dispositivo.</p>
    </footer>
  </div>
</template>

<script setup>
import PreviewArea from './components/PreviewArea.vue';
import ResolutionPanel from './components/ResolutionPanel.vue';
import ColorPanel from './components/ColorPanel.vue';
import OrientationToggle from './components/OrientationToggle.vue';
import SettingsSummary from './components/SettingsSummary.vue';
</script>

<style scoped>
/* ═══════════════════════════════════════════════════════════════════════════
   App Shell — Layout principale
   ═══════════════════════════════════════════════════════════════════════════ */

.app-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--color-bg);
}

/* ─── Header ────────────────────────────────────────────────────────────── */

.app-header {
  padding: 20px 20px 0;
  text-align: center;
}

.header-inner {
  max-width: 960px;
  margin: 0 auto;
}

.header-brand {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.brand-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--color-accent);
  box-shadow: 0 0 8px rgba(67, 97, 238, 0.4);
  flex-shrink: 0;
}

.brand-name {
  font-family: var(--font-display);
  font-size: 26px;
  font-weight: 700;
  color: var(--color-text);
  margin: 0;
  letter-spacing: -0.02em;
  line-height: 1.1;
}

.brand-tagline {
  margin: 6px 0 0;
  font-size: 14px;
  color: var(--color-text-secondary);
  line-height: 1.4;
  max-width: 480px;
  margin-left: auto;
  margin-right: auto;
}

/* ─── Main layout ───────────────────────────────────────────────────────── */

.app-main {
  flex: 1;
  padding: 16px 16px 24px;
  max-width: 1080px;
  width: 100%;
  margin: 0 auto;
  box-sizing: border-box;
}

.layout-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 20px;
}

/* Mobile-first: tutto in colonna */
.controls-col {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.preview-col {
  order: -1; /* Anteprima prima su mobile */
}

/* Tablet e desktop: layout a 3 colonne */
@media (min-width: 900px) {
  .layout-grid {
    display: grid;
    grid-template-columns: 260px 1fr 260px;
    gap: 20px;
    align-items: start;
  }

  .preview-col {
    order: 0;
    position: sticky;
    top: 16px;
  }

  .controls-left,
  .controls-right {
    position: sticky;
    top: 16px;
  }
}

/* ─── Footer ────────────────────────────────────────────────────────────── */

.app-footer {
  padding: 16px 20px;
  text-align: center;
  border-top: 1px solid var(--color-border);
  margin-top: auto;
}

.app-footer p {
  margin: 0;
  font-size: 12px;
  color: var(--color-text-secondary);
  line-height: 1.5;
}
</style>
