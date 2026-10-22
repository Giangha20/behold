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
      <div class="modal-card" style="max-width: 600px;">
        <div class="modal-header">
          <div>
            <div class="modal-title">⌨️ ${h.title}</div>
            <div class="modal-subtitle">Thao tác điều khiển trên máy tính và cảm ứng di động</div>
          </div>
          <button id="hk-close-btn" class="btn-close">&times;</button>
        </div>

        <div style="display: flex; flex-direction: column; gap: 10px; font-size: 13px;">
          <div style="background: rgba(30,41,59,0.5); padding: 10px 14px; border-radius: 6px;">
            <strong>[WASD] hoặc [Mũi tên]:</strong> ${h.wasd}
          </div>
          <div style="background: rgba(30,41,59,0.5); padding: 10px 14px; border-radius: 6px;">
            <strong>[Chuột]:</strong> ${h.mouse}
          </div>
          <div style="background: rgba(30,41,59,0.5); padding: 10px 14px; border-radius: 6px;">
            <strong>[Chuột trái / Chạm màn hình]:</strong> ${h.click}
          </div>
          <div style="background: rgba(2,132,199,0.18); border: 1px solid rgba(56,189,248,0.3); padding: 10px 14px; border-radius: 6px;">
            <strong>🔍 [Cuộn Chuột] hoặc [Phím Z] / [Phím X]:</strong> Phóng to (Zoom In) và Thu nhỏ (Zoom Out) ống kính máy ảnh
          </div>
          <div style="background: rgba(2,132,199,0.18); border: 1px solid rgba(56,189,248,0.3); padding: 10px 14px; border-radius: 6px;">
            <strong>📱 [Cảm ứng 2 ngón (Pinch)]:</strong> Chụm hoặc mở rộng 2 ngón tay trên màn hình điện thoại để thu phóng
          </div>
          <div style="background: rgba(30,41,59,0.5); padding: 10px 14px; border-radius: 6px;">
            <strong>[Phím F]:</strong> Chuyển nhanh giữa các nấc tiêu cự (Góc rộng -> Tiêu chuẩn -> Cận cảnh)
          </div>
          <div style="background: rgba(30,41,59,0.5); padding: 10px 14px; border-radius: 6px;">
            <strong>[Phím 0]:</strong> Đặt lại độ phóng đại ống kính về 1.0x
          </div>
          <div style="background: rgba(30,41,59,0.5); padding: 10px 14px; border-radius: 6px;">
            <strong>[Phím Space]:</strong> ${h.space}
          </div>
          <div style="background: rgba(30,41,59,0.5); padding: 10px 14px; border-radius: 6px;">
            <strong>[Phím H]:</strong> ${h.keyH}
          </div>
          <div style="background: rgba(30,41,59,0.5); padding: 10px 14px; border-radius: 6px;">
            <strong>[Phím Esc]:</strong> ${h.esc}
          </div>
        </div>

        <div style="display: flex; justify-content: flex-end; margin-top: 10px;">
          <button id="hk-ok-btn" class="btn btn-primary" style="padding: 8px 24px;">
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
