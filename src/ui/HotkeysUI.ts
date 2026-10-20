// Hotkeys / Controls Guide Modal

import { GameState } from '../core/GameState';
import { i18n } from '../i18n';

export class HotkeysUI {
  private container: HTMLDivElement;

  constructor(private gameState: GameState) {
    this.container = document.createElement('div');
    this.container.id = 'modal-hotkeys';
    document.getElementById('app')?.appendChild(this.container);
    this.render();

    this.gameState.subscribe(() => this.render());
    i18n.subscribe(() => this.render());
  }

  public render(): void {
    if (this.gameState.activeModal !== 'hotkeys') {
      this.container.innerHTML = '';
      this.container.style.display = 'none';
      return;
    }

    this.container.style.display = 'flex';
    this.container.className = 'modal-overlay';

    const t = i18n.t();
    const h = t.hotkeys;

    this.container.innerHTML = `
      <div class="modal-card" style="max-width: 580px;">
        <div class="modal-header">
          <div>
            <div class="modal-title">⌨️ ${h.title}</div>
            <div class="modal-subtitle">Thao tác điều khiển bàn phím & chuột trên máy tính / cảm ứng trên di động</div>
          </div>
          <button id="hk-close-btn" class="btn-close">&times;</button>
        </div>

        <div style="display: flex; flex-direction: column; gap: 12px; font-size: 13px;">
          <div style="background: rgba(30,41,59,0.5); padding: 10px 14px; border-radius: 6px;">
            <strong>[WASD] hoặc [Phím Mũi Tên]:</strong> ${h.wasd}
          </div>
          <div style="background: rgba(30,41,59,0.5); padding: 10px 14px; border-radius: 6px;">
            <strong>[Con Trỏ Chuột]:</strong> ${h.mouse}
          </div>
          <div style="background: rgba(30,41,59,0.5); padding: 10px 14px; border-radius: 6px;">
            <strong>[Chuột Trái]:</strong> ${h.click}
          </div>
          <div style="background: rgba(30,41,59,0.5); padding: 10px 14px; border-radius: 6px;">
            <strong>[Phím Space]:</strong> ${h.space}
          </div>
          <div style="background: rgba(30,41,59,0.5); padding: 10px 14px; border-radius: 6px;">
            <strong>[Phím F]:</strong> ${h.keyF}
          </div>
          <div style="background: rgba(30,41,59,0.5); padding: 10px 14px; border-radius: 6px;">
            <strong>[Phím H]:</strong> ${h.keyH}
          </div>
          <div style="background: rgba(30,41,59,0.5); padding: 10px 14px; border-radius: 6px;">
            <strong>[Phím Esc]:</strong> ${h.esc}
          </div>
        </div>

        <div style="display: flex; justify-content: flex-end; margin-top: 14px;">
          <button id="hk-ok-btn" class="btn btn-primary">
            Đã Hiểu
          </button>
        </div>
      </div>
    `;

    document.getElementById('hk-close-btn')?.addEventListener('click', () => {
      this.gameState.closeModal();
    });

    document.getElementById('hk-ok-btn')?.addEventListener('click', () => {
      this.gameState.closeModal();
    });
  }
}
