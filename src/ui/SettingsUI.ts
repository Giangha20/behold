// Settings Modal: Audio, Accessibility, Language, and Data Management

import { GameState } from '../core/GameState';
import { i18n } from '../i18n';
import { sound } from '../audio/AudioEngine';
import { SaveSystem } from '../core/SaveSystem';

export class SettingsUI {
  private container: HTMLDivElement;

  constructor(private gameState: GameState) {
    this.container = document.createElement('div');
    this.container.id = 'modal-settings';
    document.getElementById('app')?.appendChild(this.container);
    this.render();

    this.gameState.subscribe(() => this.render());
    i18n.subscribe(() => this.render());
  }

  public render(): void {
    if (this.gameState.activeModal !== 'settings') {
      this.container.innerHTML = '';
      this.container.style.display = 'none';
      return;
    }

    this.container.style.display = 'flex';
    this.container.className = 'modal-overlay';

    const t = i18n.t();
    const s = this.gameState.settings;

    this.container.innerHTML = `
      <div class="modal-card" style="max-width: 680px;">
        <div class="modal-header">
          <div>
            <div class="modal-title">⚙️ ${t.settings.title}</div>
            <div class="modal-subtitle">Tùy biến trải nghiệm và quản lý dữ liệu trò chơi</div>
          </div>
          <button id="set-close-btn" class="btn-close">&times;</button>
        </div>

        <div style="display: flex; flex-direction: column; gap: 20px;">
          <!-- Audio Settings -->
          <div>
            <div style="font-weight: 700; color: #38bdf8; margin-bottom: 12px; font-size: 13px;">
              ${t.settings.audioTab}
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
              <div>
                <label style="font-size: 12px; display: block; margin-bottom: 4px;">${t.settings.masterVolume}: <span id="val-master">${Math.round(s.masterVolume * 100)}%</span></label>
                <input type="range" id="slider-master" min="0" max="1" step="0.05" value="${s.masterVolume}" style="width: 100%;" />
              </div>
              <div>
                <label style="font-size: 12px; display: block; margin-bottom: 4px;">${t.settings.sfxVolume}: <span id="val-sfx">${Math.round(s.sfxVolume * 100)}%</span></label>
                <input type="range" id="slider-sfx" min="0" max="1" step="0.05" value="${s.sfxVolume}" style="width: 100%;" />
              </div>
              <div>
                <label style="font-size: 12px; display: block; margin-bottom: 4px;">${t.settings.musicVolume}: <span id="val-music">${Math.round(s.musicVolume * 100)}%</span></label>
                <input type="range" id="slider-music" min="0" max="1" step="0.05" value="${s.musicVolume}" style="width: 100%;" />
              </div>
              <div>
                <label style="font-size: 12px; display: block; margin-bottom: 4px;">${t.settings.ambientVolume}: <span id="val-ambient">${Math.round(s.ambientVolume * 100)}%</span></label>
                <input type="range" id="slider-ambient" min="0" max="1" step="0.05" value="${s.ambientVolume}" style="width: 100%;" />
              </div>
            </div>
          </div>

          <!-- Visual & Accessibility -->
          <div style="border-top: 1px solid rgba(255,255,255,0.08); padding-top: 16px;">
            <div style="font-weight: 700; color: #38bdf8; margin-bottom: 12px; font-size: 13px;">
              ${t.settings.visualTab}
            </div>

            <div style="display: flex; flex-direction: column; gap: 10px;">
              <label style="display: flex; align-items: center; gap: 10px; font-size: 13px; cursor: pointer;">
                <input type="checkbox" id="chk-reduced-motion" ${s.reducedMotion ? 'checked' : ''} />
                <span>${t.settings.reducedMotion}</span>
              </label>

              <label style="display: flex; align-items: center; gap: 10px; font-size: 13px; cursor: pointer;">
                <input type="checkbox" id="chk-high-contrast" ${s.highContrast ? 'checked' : ''} />
                <span>${t.settings.highContrast}</span>
              </label>

              <div style="margin-top: 6px;">
                <label style="font-size: 12px; display: block; margin-bottom: 4px;">
                  ${t.settings.cameraSensitivity}: <span id="val-sens">${s.cameraSensitivity.toFixed(1)}x</span>
                </label>
                <input type="range" id="slider-sens" min="0.5" max="2.0" step="0.1" value="${s.cameraSensitivity}" style="width: 240px;" />
              </div>
            </div>
          </div>

          <!-- Language Switch -->
          <div style="border-top: 1px solid rgba(255,255,255,0.08); padding-top: 16px;">
            <div style="font-weight: 700; color: #38bdf8; margin-bottom: 12px; font-size: 13px;">
              ${t.settings.language}
            </div>
            <div style="display: flex; gap: 10px;">
              <button id="lang-vi-btn" class="btn ${i18n.lang === 'vi' ? 'btn-primary' : 'btn-secondary'}">
                Tiếng Việt (Mặc định)
              </button>
              <button id="lang-en-btn" class="btn ${i18n.lang === 'en' ? 'btn-primary' : 'btn-secondary'}">
                English (International)
              </button>
            </div>
          </div>

          <!-- Data & Persistence Management -->
          <div style="border-top: 1px solid rgba(255,255,255,0.08); padding-top: 16px;">
            <div style="font-weight: 700; color: #38bdf8; margin-bottom: 12px; font-size: 13px;">
              ${t.settings.dataTab}
            </div>

            <div style="display: flex; flex-wrap: wrap; gap: 10px;">
              <button id="btn-export-save" class="btn btn-secondary">
                💾 ${t.settings.exportSave}
              </button>
              <button id="btn-import-save" class="btn btn-secondary">
                📂 ${t.settings.importSave}
              </button>
              <button id="btn-reset-save" class="btn btn-danger">
                🗑️ ${t.settings.resetSave}
              </button>
            </div>
          </div>

          <div style="display: flex; justify-content: flex-end; margin-top: 10px;">
            <button id="set-save-btn" class="btn btn-primary">
              ✓ ${t.settings.close}
            </button>
          </div>
        </div>
      </div>
    `;

    this.bindEvents();
  }

  private bindEvents(): void {
    const s = this.gameState.settings;

    document.getElementById('set-close-btn')?.addEventListener('click', () => {
      this.gameState.closeModal();
    });

    document.getElementById('set-save-btn')?.addEventListener('click', () => {
      this.gameState.saveCurrentGame();
      this.gameState.closeModal();
    });

    // Volume Sliders
    const sliderMaster = document.getElementById('slider-master') as HTMLInputElement;
    sliderMaster?.addEventListener('input', () => {
      s.masterVolume = parseFloat(sliderMaster.value);
      document.getElementById('val-master')!.textContent = `${Math.round(s.masterVolume * 100)}%`;
      sound.setVolumes(s.masterVolume, s.sfxVolume, s.musicVolume, s.ambientVolume);
    });

    const sliderSfx = document.getElementById('slider-sfx') as HTMLInputElement;
    sliderSfx?.addEventListener('input', () => {
      s.sfxVolume = parseFloat(sliderSfx.value);
      document.getElementById('val-sfx')!.textContent = `${Math.round(s.sfxVolume * 100)}%`;
      sound.setVolumes(s.masterVolume, s.sfxVolume, s.musicVolume, s.ambientVolume);
    });

    const sliderMusic = document.getElementById('slider-music') as HTMLInputElement;
    sliderMusic?.addEventListener('input', () => {
      s.musicVolume = parseFloat(sliderMusic.value);
      document.getElementById('val-music')!.textContent = `${Math.round(s.musicVolume * 100)}%`;
      sound.setVolumes(s.masterVolume, s.sfxVolume, s.musicVolume, s.ambientVolume);
    });

    const sliderAmbient = document.getElementById('slider-ambient') as HTMLInputElement;
    sliderAmbient?.addEventListener('input', () => {
      s.ambientVolume = parseFloat(sliderAmbient.value);
      document.getElementById('val-ambient')!.textContent = `${Math.round(s.ambientVolume * 100)}%`;
      sound.setVolumes(s.masterVolume, s.sfxVolume, s.musicVolume, s.ambientVolume);
    });

    // Checkboxes
    const chkMotion = document.getElementById('chk-reduced-motion') as HTMLInputElement;
    chkMotion?.addEventListener('change', () => {
      s.reducedMotion = chkMotion.checked;
      document.body.classList.toggle('reduced-motion', s.reducedMotion);
    });

    const chkContrast = document.getElementById('chk-high-contrast') as HTMLInputElement;
    chkContrast?.addEventListener('change', () => {
      s.highContrast = chkContrast.checked;
      document.body.classList.toggle('high-contrast', s.highContrast);
    });

    // Sensitivity
    const sliderSens = document.getElementById('slider-sens') as HTMLInputElement;
    sliderSens?.addEventListener('input', () => {
      s.cameraSensitivity = parseFloat(sliderSens.value);
      document.getElementById('val-sens')!.textContent = `${s.cameraSensitivity.toFixed(1)}x`;
    });

    // Language
    document.getElementById('lang-vi-btn')?.addEventListener('click', () => {
      i18n.setLanguage('vi');
    });

    document.getElementById('lang-en-btn')?.addEventListener('click', () => {
      i18n.setLanguage('en');
    });

    // Export save
    document.getElementById('btn-export-save')?.addEventListener('click', () => {
      const saved = SaveSystem.loadGame();
      if (!saved) {
        alert('Chưa có dữ liệu lưu nào.');
        return;
      }
      const json = SaveSystem.exportJSON(saved);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `echoes_save_${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    });

    // Import save
    document.getElementById('btn-import-save')?.addEventListener('click', () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json';
      input.onchange = e => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
          const content = reader.result as string;
          if (SaveSystem.importJSON(content)) {
            alert('Nhập dữ liệu thành công!');
            this.gameState.loadSavedGame();
          } else {
            alert('Dữ liệu không hợp lệ!');
          }
        };
        reader.readAsText(file);
      };
      input.click();
    });

    // Reset save
    document.getElementById('btn-reset-save')?.addEventListener('click', () => {
      if (confirm(i18n.t().menu.confirmReset)) {
        SaveSystem.clearSave();
        this.gameState.startNewGame();
        this.gameState.closeModal();
      }
    });
  }
}
