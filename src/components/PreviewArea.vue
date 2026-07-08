<template>
  <section class="preview-section" aria-label="Anteprima schermo">
    <div class="preview-frame" role="img" :aria-label="previewAriaLabel">
      <!-- Bracket angolari — l'elemento firma: mirino da strumento di calibrazione -->
      <span class="corner-bracket corner-tl" aria-hidden="true"></span>
      <span class="corner-bracket corner-tr" aria-hidden="true"></span>
      <span class="corner-bracket corner-bl" aria-hidden="true"></span>
      <span class="corner-bracket corner-br" aria-hidden="true"></span>

      <!-- Schermo con aspect ratio dinamico -->
      <div
        class="preview-screen"
        :style="{
          aspectRatio: String(aspectRatio),
          maxWidth: orientation === 'portrait' ? '320px' : '560px',
        }"
      >
        <!-- Overlay tinta temperatura colore -->
        <div
          class="temperature-overlay"
          :style="{ backgroundColor: tintCSS }"
          aria-hidden="true"
        ></div>

        <!-- Contenuto scalato con filtri -->
        <div
          class="preview-content"
          :style="{
            transform: `scale(${scaleFactor})`,
            filter: `brightness(${brightnessFilter}) contrast(${contrastFilter})`,
          }"
        >
          <!-- Wallpaper desktop -->
          <div class="desktop-wallpaper"></div>

          <!-- Barra menu superiore -->
          <div class="desktop-menubar">
            <span class="menubar-item">Finder</span>
            <span class="menubar-item">File</span>
            <span class="menubar-item">Modifica</span>
            <span class="menubar-item">Vista</span>
            <span class="menubar-item">Aiuto</span>
            <span class="menubar-clock">14:32</span>
          </div>

          <!-- Icone desktop -->
          <div class="desktop-icons">
            <div class="desktop-icon">
              <div class="icon-folder"></div>
              <span>Documenti</span>
            </div>
            <div class="desktop-icon">
              <div class="icon-folder"></div>
              <span>Immagini</span>
            </div>
            <div class="desktop-icon">
              <div class="icon-disk"></div>
              <span>Macintosh HD</span>
            </div>
          </div>

          <!-- Finestre -->
          <div class="desktop-window window-document">
            <div class="window-titlebar">
              <span class="win-dot win-dot-red"></span>
              <span class="win-dot win-dot-yellow"></span>
              <span class="win-dot win-dot-green"></span>
              <span class="window-title">Documento — Note</span>
            </div>
            <div class="window-body">
              <div class="fake-line" style="width: 85%"></div>
              <div class="fake-line" style="width: 92%"></div>
              <div class="fake-line" style="width: 60%"></div>
              <div class="fake-line" style="width: 78%"></div>
              <div class="fake-line" style="width: 45%"></div>
            </div>
          </div>

          <div class="desktop-window window-settings">
            <div class="window-titlebar">
              <span class="win-dot win-dot-red"></span>
              <span class="win-dot win-dot-yellow"></span>
              <span class="win-dot win-dot-green"></span>
              <span class="window-title">Impostazioni Sc</span>
            </div>
            <div class="window-body window-body-settings">
              <div class="settings-row">
                <span class="settings-label">Wi‑Fi</span>
                <span class="settings-toggle on">On</span>
              </div>
              <div class="settings-row">
                <span class="settings-label">Bluetooth</span>
                <span class="settings-toggle">Off</span>
              </div>
            </div>
          </div>

          <!-- Dock -->
          <div class="desktop-dock">
            <span class="dock-icon dock-blue"></span>
            <span class="dock-icon dock-green"></span>
            <span class="dock-icon dock-orange"></span>
            <span class="dock-icon dock-purple"></span>
            <span class="dock-icon dock-red"></span>
          </div>
        </div>
      </div>
    </div>

    <!-- Etichetta risoluzione corrente sotto il preview -->
    <p class="preview-label">
      {{ effectiveResolution.width }} × {{ effectiveResolution.height }}
      <span class="preview-label-sep">·</span>
      {{ settings.scale }}%
      <span class="preview-label-sep">·</span>
      {{ settings.colorTemperature }}K
    </p>
  </section>
</template>

<script setup>
import { computed } from 'vue';
import { useDisplaySettings } from '../composables/useDisplaySettings.js';

const {
  settings,
  effectiveResolution,
  aspectRatio,
  tintCSS,
  brightnessFilter,
  contrastFilter,
  scaleFactor,
} = useDisplaySettings();

const orientation = computed(() => settings.orientation);

const previewAriaLabel = computed(() =>
  `Anteprima schermo: ${effectiveResolution.value.width} per ${effectiveResolution.value.height} pixel, orientamento ${settings.orientation === 'landscape' ? 'orizzontale' : 'verticale'}, scala ${settings.scale}%, luminosità ${settings.brightness}%, contrasto ${settings.contrast}%, temperatura colore ${settings.colorTemperature} Kelvin`
);
</script>

<style scoped>
/* ═══════════════════════════════════════════════════════════════════════════
   Preview — l'elemento firma dell'interfaccia
   Desktop simulato con bracket angolari da strumento di calibrazione
   ═══════════════════════════════════════════════════════════════════════════ */

.preview-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.preview-frame {
  position: relative;
  padding: 20px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  box-shadow: var(--shadow-card);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  box-sizing: border-box;
}

/* Bracket angolari — il tocco distintivo */
.corner-bracket {
  position: absolute;
  width: 18px;
  height: 18px;
  pointer-events: none;
  z-index: 2;
}

.corner-bracket::before,
.corner-bracket::after {
  content: '';
  position: absolute;
  background: var(--color-accent);
  border-radius: 1px;
}

.corner-bracket::before {
  /* Tratto orizzontale */
  width: 18px;
  height: 2px;
}

.corner-bracket::after {
  /* Tratto verticale */
  width: 2px;
  height: 18px;
}

.corner-tl { top: 10px; left: 10px; }
.corner-tl::before { top: 0; left: 0; }
.corner-tl::after  { top: 0; left: 0; }

.corner-tr { top: 10px; right: 10px; }
.corner-tr::before { top: 0; right: 0; }
.corner-tr::after  { top: 0; right: 0; }

.corner-bl { bottom: 10px; left: 10px; }
.corner-bl::before { bottom: 0; left: 0; }
.corner-bl::after  { bottom: 0; left: 0; }

.corner-br { bottom: 10px; right: 10px; }
.corner-br::before { bottom: 0; right: 0; }
.corner-br::after  { bottom: 0; right: 0; }

/* Schermo */
.preview-screen {
  position: relative;
  width: 100%;
  overflow: hidden;
  border-radius: 6px;
  background: #e8ecf1;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.08);
}

/* Overlay tinta temperatura — simula lo shift del punto di bianco */
.temperature-overlay {
  position: absolute;
  inset: 0;
  opacity: 0.18;
  mix-blend-mode: overlay;
  pointer-events: none;
  z-index: 10;
  transition: background-color 250ms ease;
}

/* Contenuto scalabile */
.preview-content {
  position: absolute;
  inset: 0;
  transform-origin: center center;
  transition: transform 250ms ease;
  display: flex;
  flex-direction: column;
  font-family: var(--font-body);
  font-size: 10px;
  color: var(--color-text);
}

/* ─── Wallpaper ─────────────────────────────────────────────────────────── */

.desktop-wallpaper {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    #3a1c71 0%,
    #d76d77 30%,
    #ffaf7b 70%,
    #3a1c71 100%
  );
  z-index: 0;
}

/* ─── Menubar ───────────────────────────────────────────────────────────── */

.desktop-menubar {
  position: relative;
  z-index: 5;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 3px 12px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  font-size: 9px;
  font-weight: 500;
  color: #1d1d1f;
  flex-shrink: 0;
}

.menubar-item {
  cursor: default;
  opacity: 0.8;
}

.menubar-clock {
  margin-left: auto;
  font-variant-numeric: tabular-nums;
}

/* ─── Icone desktop ─────────────────────────────────────────────────────── */

.desktop-icons {
  position: relative;
  z-index: 3;
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 16px 12px;
  flex: 1;
}

.desktop-icon {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  width: 52px;
  cursor: default;
}

.desktop-icon span {
  font-size: 8px;
  color: #fff;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.6);
  text-align: center;
  line-height: 1.3;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.icon-folder {
  width: 30px;
  height: 24px;
  background: linear-gradient(180deg, #64b5f6 0%, #42a5f5 60%, #1e88e5 100%);
  border-radius: 3px 3px 2px 2px;
  position: relative;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);
}

.icon-folder::before {
  content: '';
  position: absolute;
  top: -4px;
  left: 2px;
  width: 14px;
  height: 5px;
  background: #64b5f6;
  border-radius: 2px 2px 0 0;
}

.icon-disk {
  width: 30px;
  height: 30px;
  background: linear-gradient(135deg, #b0bec5 0%, #90a4ae 50%, #78909c 100%);
  border-radius: 4px;
  position: relative;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);
}

.icon-disk::after {
  content: '';
  position: absolute;
  top: 6px;
  left: 6px;
  right: 6px;
  bottom: 6px;
  background: #cfd8dc;
  border-radius: 2px;
  border: 1px solid rgba(255, 255, 255, 0.5);
}

/* ─── Finestre ──────────────────────────────────────────────────────────── */

.desktop-window {
  position: absolute;
  z-index: 4;
  background: #fff;
  border-radius: 6px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.window-document {
  top: 18%;
  left: 22%;
  width: 50%;
  height: 38%;
  min-width: 140px;
  min-height: 80px;
}

.window-settings {
  top: 42%;
  left: 38%;
  width: 38%;
  height: 30%;
  min-width: 120px;
  min-height: 70px;
}

.window-titlebar {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 8px;
  background: #f0f0f0;
  border-bottom: 1px solid #ddd;
  flex-shrink: 0;
}

.win-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.win-dot-red    { background: #ff5f57; }
.win-dot-yellow { background: #febc2e; }
.win-dot-green  { background: #28c840; }

.window-title {
  font-size: 8px;
  font-weight: 600;
  color: #555;
  margin-left: 4px;
  flex: 1;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.window-body {
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
}

.fake-line {
  height: 4px;
  background: #e0e0e0;
  border-radius: 2px;
}

.fake-line:last-child {
  width: 35% !important;
}

.window-body-settings {
  gap: 8px;
}

.settings-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 3px 0;
  border-bottom: 1px solid #f0f0f0;
}

.settings-label {
  font-size: 8px;
  font-weight: 500;
  color: #333;
}

.settings-toggle {
  font-size: 7px;
  font-weight: 600;
  padding: 1px 6px;
  border-radius: 8px;
  background: #e0e0e0;
  color: #666;
}

.settings-toggle.on {
  background: #34c759;
  color: #fff;
}

/* ─── Dock ──────────────────────────────────────────────────────────────── */

.desktop-dock {
  position: relative;
  z-index: 6;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 5px 12px;
  margin: 0 auto 4px;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(16px);
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
  width: fit-content;
  flex-shrink: 0;
}

.dock-icon {
  width: 22px;
  height: 22px;
  border-radius: 5px;
  flex-shrink: 0;
}

.dock-blue   { background: linear-gradient(135deg, #42a5f5, #1e88e5); }
.dock-green  { background: linear-gradient(135deg, #66bb6a, #43a047); }
.dock-orange { background: linear-gradient(135deg, #ffa726, #fb8c00); }
.dock-purple { background: linear-gradient(135deg, #ab47bc, #8e24aa); }
.dock-red    { background: linear-gradient(135deg, #ef5350, #e53935); }

/* ─── Etichetta informativa ─────────────────────────────────────────────── */

.preview-label {
  font-family: var(--font-mono);
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-secondary);
  letter-spacing: 0.02em;
  text-align: center;
  margin: 0;
}

.preview-label-sep {
  color: var(--color-border);
  margin: 0 4px;
}

/* ─── Portrait override ─────────────────────────────────────────────────── */

.preview-screen[style*="aspect-ratio" i] {
  /* handled inline */
}

/* Quando portrait, scambiamo dimensioni finestre */
:deep(.preview-screen[style*="max-width: 320px"]) .window-document {
  top: 12%;
  left: 8%;
  width: 84%;
  height: 30%;
}

:deep(.preview-screen[style*="max-width: 320px"]) .window-settings {
  top: 48%;
  left: 18%;
  width: 64%;
  height: 28%;
}
</style>
