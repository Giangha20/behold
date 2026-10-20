// Main Menu Modal: Title Screen, Start, Continue, Chapter Selection, Settings, Credits

import { GameState } from '../core/GameState';
import { i18n } from '../i18n';
import { SaveSystem } from '../core/SaveSystem';

export class MainMenuUI {
  private container: HTMLDivElement;

  constructor(private gameState: GameState) {
    this.container = document.createElement('div');
    this.container.id = 'modal-main-menu';
    document.getElementById('app')?.appendChild(this.container);
    this.render();

    this.gameState.subscribe(() => this.render());
    i18n.subscribe(() => this.render());
  }

  public render(): void {
    if (this.gameState.activeModal !== 'menu') {
      this.container.innerHTML = '';
      this.container.style.display = 'none';
      return;
    }

    this.container.style.display = 'flex';
    this.container.className = 'modal-overlay';

    const t = i18n.t();
    const hasSave = SaveSystem.hasSaveData();

    this.container.innerHTML = `
      <div class="modal-card" style="max-width: 580px; text-align: center; padding: 40px 32px;">
        <div style="margin-bottom: 24px;">
          <div style="font-family: var(--font-serif); font-size: 32px; font-weight: 800; letter-spacing: -0.03em; color: #ffffff; text-shadow: 0 4px 20px rgba(2,132,199,0.5);">
            ${t.appName.toUpperCase()}
          </div>
          <div style="font-size: 13px; font-weight: 600; color: #38bdf8; text-transform: uppercase; letter-spacing: 0.15em; margin-top: 4px;">
            ${t.appSubtitle}
          </div>
          <div style="font-size: 13px; color: #94a3b8; font-style: italic; margin-top: 14px; max-width: 440px; margin-left: auto; margin-right: auto;">
            “${t.tagline}”
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 12px; max-width: 340px; margin: 0 auto; width: 100%;">
          <button id="menu-new-game" class="btn btn-primary" style="padding: 12px; font-size: 14px;">
            📸 ${t.menu.startNew}
          </button>

          <button id="menu-continue" class="btn btn-secondary" style="padding: 12px; font-size: 14px; ${!hasSave ? 'opacity: 0.45; cursor: not-allowed;' : ''}">
            📂 ${t.menu.continueGame}
          </button>

          <button id="menu-social" class="btn btn-secondary" style="padding: 10px; font-size: 13px;">
            📊 ${t.menu.socialOverview}
          </button>

          <button id="menu-settings" class="btn btn-secondary" style="padding: 10px; font-size: 13px;">
            ⚙️ ${t.menu.settings}
          </button>

          <button id="menu-hotkeys" class="btn btn-secondary" style="padding: 10px; font-size: 13px;">
            ⌨️ ${t.hotkeys.title}
          </button>
        </div>

        <div style="margin-top: 28px; font-size: 11px; color: #64748b; line-height: 1.6;">
          Trò chơi quan sát xã hội và châm biếm truyền thông độc lập.<br/>
          Thiết kế & phát triển với công nghệ thuần Web Canvas & Web Audio API.
        </div>
      </div>
    `;

    this.bindEvents();
  }

  private bindEvents(): void {
    document.getElementById('menu-new-game')?.addEventListener('click', () => {
      if (SaveSystem.hasSaveData()) {
        if (!confirm(i18n.t().menu.confirmNewGame)) return;
      }
      this.gameState.startNewGame();
    });

    document.getElementById('menu-continue')?.addEventListener('click', () => {
      if (!SaveSystem.hasSaveData()) {
        alert(i18n.t().menu.noSaveData);
        return;
      }
      if (this.gameState.loadSavedGame()) {
        this.gameState.closeModal();
      }
    });

    document.getElementById('menu-social')?.addEventListener('click', () => {
      this.gameState.openModal('social');
    });

    document.getElementById('menu-settings')?.addEventListener('click', () => {
      this.gameState.openModal('settings');
    });

    document.getElementById('menu-hotkeys')?.addEventListener('click', () => {
      this.gameState.openModal('hotkeys');
    });
  }
}
