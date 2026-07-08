import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createApp, reactive } from 'vue';

// Import the composable to test its logic directly
import { useDisplaySettings, RESOLUTION_PRESETS, SCALE_STEPS } from '../src/composables/useDisplaySettings.js';

// ─── Composable tests ─────────────────────────────────────────────────────

describe('useDisplaySettings', () => {
  let ds;

  beforeEach(() => {
    // Each call gets the same singleton — reset before each test
    ds = useDisplaySettings();
    ds.resetAll();
  });

  it('initializes with default values', () => {
    expect(ds.settings.resolution.width).toBe(1920);
    expect(ds.settings.resolution.height).toBe(1080);
    expect(ds.settings.scale).toBe(100);
    expect(ds.settings.orientation).toBe('landscape');
    expect(ds.settings.brightness).toBe(50);
    expect(ds.settings.contrast).toBe(50);
    expect(ds.settings.colorTemperature).toBe(6500);
  });

  it('computes effective resolution for landscape', () => {
    ds.setResolution(2560, 1440);
    ds.setOrientation('landscape');
    expect(ds.effectiveResolution.value.width).toBe(2560);
    expect(ds.effectiveResolution.value.height).toBe(1440);
  });

  it('swaps dimensions for portrait orientation', () => {
    ds.setResolution(1920, 1080);
    ds.setOrientation('portrait');
    expect(ds.effectiveResolution.value.width).toBe(1080);
    expect(ds.effectiveResolution.value.height).toBe(1920);
  });

  it('computes correct aspect ratio', () => {
    ds.setResolution(1920, 1080);
    ds.setOrientation('landscape');
    expect(ds.aspectRatio.value).toBeCloseTo(16 / 9, 2);
  });

  it('setScale clamps to valid range', () => {
    ds.setScale(50);
    expect(ds.settings.scale).toBe(100);
    ds.setScale(250);
    expect(ds.settings.scale).toBe(200);
    ds.setScale(150);
    expect(ds.settings.scale).toBe(150);
  });

  it('setBrightness clamps between 0 and 100', () => {
    ds.setBrightness(-10);
    expect(ds.settings.brightness).toBe(0);
    ds.setBrightness(150);
    expect(ds.settings.brightness).toBe(100);
    ds.setBrightness(75);
    expect(ds.settings.brightness).toBe(75);
  });

  it('setContrast clamps between 0 and 100', () => {
    ds.setContrast(-5);
    expect(ds.settings.contrast).toBe(0);
    ds.setContrast(200);
    expect(ds.settings.contrast).toBe(100);
  });

  it('setColorTemperature clamps between 3000 and 9500', () => {
    ds.setColorTemperature(1000);
    expect(ds.settings.colorTemperature).toBe(3000);
    ds.setColorTemperature(20000);
    expect(ds.settings.colorTemperature).toBe(9500);
    ds.setColorTemperature(5000);
    expect(ds.settings.colorTemperature).toBe(5000);
  });

  it('toggleOrientation swaps orientation', () => {
    expect(ds.settings.orientation).toBe('landscape');
    ds.toggleOrientation();
    expect(ds.settings.orientation).toBe('portrait');
    ds.toggleOrientation();
    expect(ds.settings.orientation).toBe('landscape');
  });

  it('resetAll restores defaults', () => {
    ds.setResolution(3840, 2160);
    ds.setScale(200);
    ds.setOrientation('portrait');
    ds.setBrightness(80);
    ds.setContrast(20);
    ds.setColorTemperature(9000);
    ds.resetAll();
    expect(ds.settings.resolution.width).toBe(1920);
    expect(ds.settings.scale).toBe(100);
    expect(ds.settings.orientation).toBe('landscape');
    expect(ds.settings.brightness).toBe(50);
    expect(ds.settings.contrast).toBe(50);
    expect(ds.settings.colorTemperature).toBe(6500);
  });

  it('colorTint returns valid RGB object', () => {
    const tint = ds.colorTint.value;
    expect(tint).toHaveProperty('r');
    expect(tint).toHaveProperty('g');
    expect(tint).toHaveProperty('b');
    expect(tint.r).toBeGreaterThanOrEqual(0);
    expect(tint.r).toBeLessThanOrEqual(255);
    expect(tint.g).toBeGreaterThanOrEqual(0);
    expect(tint.g).toBeLessThanOrEqual(255);
    expect(tint.b).toBeGreaterThanOrEqual(0);
    expect(tint.b).toBeLessThanOrEqual(255);
  });

  it('warm temperature produces warmer tint (higher R relative to B)', () => {
    ds.setColorTemperature(3000);
    const warm = ds.colorTint.value;
    ds.setColorTemperature(9500);
    const cool = ds.colorTint.value;
    // Warm should have higher R relative to B
    const warmRatio = warm.r / Math.max(1, warm.b);
    const coolRatio = cool.r / Math.max(1, cool.b);
    expect(warmRatio).toBeGreaterThan(coolRatio);
  });

  it('scaleFactor is correct', () => {
    ds.setScale(100);
    expect(ds.scaleFactor.value).toBe(1.0);
    ds.setScale(150);
    expect(ds.scaleFactor.value).toBe(1.5);
    ds.setScale(200);
    expect(ds.scaleFactor.value).toBe(2.0);
  });

  it('brightnessFilter is correct', () => {
    ds.setBrightness(50);
    expect(ds.brightnessFilter.value).toBe(1.0);
    ds.setBrightness(0);
    expect(ds.brightnessFilter.value).toBe(0.5);
    ds.setBrightness(100);
    expect(ds.brightnessFilter.value).toBe(1.5);
  });

  it('contrastFilter is correct', () => {
    ds.setContrast(50);
    expect(ds.contrastFilter.value).toBe(1.0);
    ds.setContrast(0);
    expect(ds.contrastFilter.value).toBe(0.5);
    ds.setContrast(100);
    expect(ds.contrastFilter.value).toBe(1.5);
  });
});

// ─── Component rendering tests ────────────────────────────────────────────

describe('Component rendering', () => {
  it('PreviewArea renders', async () => {
    const { default: PreviewArea } = await import('../src/components/PreviewArea.vue');
    const wrapper = mount(PreviewArea);
    expect(wrapper.find('.preview-frame').exists()).toBe(true);
    expect(wrapper.find('.preview-screen').exists()).toBe(true);
    expect(wrapper.find('.desktop-menubar').exists()).toBe(true);
    expect(wrapper.find('.desktop-dock').exists()).toBe(true);
    // Corner brackets (signature element)
    expect(wrapper.findAll('.corner-bracket').length).toBe(4);
  });

  it('ResolutionPanel renders presets', async () => {
    const { default: ResolutionPanel } = await import('../src/components/ResolutionPanel.vue');
    const wrapper = mount(ResolutionPanel);
    const buttons = wrapper.findAll('.preset-btn');
    expect(buttons.length).toBe(RESOLUTION_PRESETS.length);
    // Scale slider present
    expect(wrapper.find('#scale-slider').exists()).toBe(true);
  });

  it('ColorPanel renders all sliders', async () => {
    const { default: ColorPanel } = await import('../src/components/ColorPanel.vue');
    const wrapper = mount(ColorPanel);
    expect(wrapper.find('#brightness-slider').exists()).toBe(true);
    expect(wrapper.find('#contrast-slider').exists()).toBe(true);
    expect(wrapper.find('#temperature-slider').exists()).toBe(true);
    expect(wrapper.find('.reset-btn').exists()).toBe(true);
  });

  it('OrientationToggle renders two buttons', async () => {
    const { default: OrientationToggle } = await import('../src/components/OrientationToggle.vue');
    const wrapper = mount(OrientationToggle);
    const buttons = wrapper.findAll('.orient-btn');
    expect(buttons.length).toBe(2);
  });

  it('SettingsSummary renders all summary items', async () => {
    const { default: SettingsSummary } = await import('../src/components/SettingsSummary.vue');
    const wrapper = mount(SettingsSummary);
    const items = wrapper.findAll('.summary-item');
    expect(items.length).toBe(6);
  });

  it('App renders all sections', async () => {
    const { default: App } = await import('../src/App.vue');
    const wrapper = mount(App);
    expect(wrapper.find('.app-header').exists()).toBe(true);
    expect(wrapper.find('.app-main').exists()).toBe(true);
    expect(wrapper.find('.app-footer').exists()).toBe(true);
  });
});

// ─── Interaction tests ────────────────────────────────────────────────────

describe('User interactions', () => {
  it('clicking a resolution preset updates the composable', async () => {
    const ds = useDisplaySettings();
    ds.resetAll();

    const { default: ResolutionPanel } = await import('../src/components/ResolutionPanel.vue');
    const wrapper = mount(ResolutionPanel);

    // Click the QHD preset (index 2)
    const presets = wrapper.findAll('.preset-btn');
    await presets[2].trigger('click');

    expect(ds.settings.resolution.width).toBe(2560);
    expect(ds.settings.resolution.height).toBe(1440);
  });

  it('clicking orientation toggle updates orientation', async () => {
    const ds = useDisplaySettings();
    ds.resetAll();

    const { default: OrientationToggle } = await import('../src/components/OrientationToggle.vue');
    const wrapper = mount(OrientationToggle);

    const buttons = wrapper.findAll('.orient-btn');
    // Click portrait button (index 1)
    await buttons[1].trigger('click');

    expect(ds.settings.orientation).toBe('portrait');
  });

  it('reset button restores defaults', async () => {
    const ds = useDisplaySettings();
    ds.setResolution(3840, 2160);
    ds.setScale(200);
    ds.setColorTemperature(3000);

    const { default: ColorPanel } = await import('../src/components/ColorPanel.vue');
    const wrapper = mount(ColorPanel);

    await wrapper.find('.reset-btn').trigger('click');

    expect(ds.settings.resolution.width).toBe(1920);
    expect(ds.settings.scale).toBe(100);
    expect(ds.settings.colorTemperature).toBe(6500);
  });
});

// ─── Resolution presets data integrity ────────────────────────────────────

describe('RESOLUTION_PRESETS', () => {
  it('has 4 presets', () => {
    expect(RESOLUTION_PRESETS).toHaveLength(4);
  });

  it('each preset has required fields', () => {
    RESOLUTION_PRESETS.forEach(p => {
      expect(p).toHaveProperty('label');
      expect(p).toHaveProperty('width');
      expect(p).toHaveProperty('height');
      expect(p).toHaveProperty('icon');
      expect(p.width).toBeGreaterThan(0);
      expect(p.height).toBeGreaterThan(0);
    });
  });
});

describe('SCALE_STEPS', () => {
  it('has 5 steps from 100 to 200', () => {
    expect(SCALE_STEPS).toEqual([100, 125, 150, 175, 200]);
  });
});
