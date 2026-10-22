// Gameplay HUD Overlay: Top bar, Bottom controls, Quick tickers, Optical Zoom Controls

import { GameState } from '../core/GameState';
import { i18n } from '../i18n';

export class HUD {
  private container: HTMLDivElement;

  constructor(private gameState: GameState, private onShutterClick: () => void) {
    this.container = document.createElement('div');
    this.container.id = 'hud-root';
    document.getElementById('app')?.appendChild(this.container);
    this.render();

    this.gameState.subscribe(() => this.render());
    i18n.subscribe(() => this.render());
  }

  public render(): void {
    if (this.gameState.activeModal === 'menu' || this.gameState.activeModal === 'ending') {
      this.container.style.display = 'none';
      return;
    }
    this.container.style.display = 'block';

    const t = i18n.t();
    const chapter = this.gameState.chapterCampaign.getCurrentChapter();
    const metrics = this.gameState.metricsManager.state;
    const isPaused = this.gameState.isPaused;
    const camera = this.gameState.camera;

    this.container.innerHTML = `
      <!-- Top HUD -->
      <div class="hud-top">
        <div class="hud-panel">
          <div class="chapter-tag">${t.hud.chapter} ${chapter.index}: ${chapter.title}</div>
          <div style="width: 1px; height: 16px; background: rgba(255,255,255,0.2);"></div>
          <div class="objective-text">
            <strong>${t.hud.objective}:</strong> ${chapter.objectives[0]?.description || ''}
          </div>
        </div>

        <div class="hud-panel">
          <div style="display: flex; gap: 12px; font-size: 11px;">
            <span title="${t.social.trust}">🤝 ${metrics.trust}%</span>
            <span title="${t.social.tension}" style="color: ${metrics.tension > 60 ? '#ef4444' : 'inherit'};">⚡ ${metrics.tension}%</span>
            <span title="${t.social.empathy}">💖 ${metrics.empathy}%</span>
            <span title="${t.social.polarization}" style="color: ${metrics.polarization > 60 ? '#f59e0b' : 'inherit'};">⚖️ ${metrics.polarization}%</span>
            <span title="${t.social.socialStability}">🏙️ ${metrics.socialStability}%</span>
          </div>
          <div style="width: 1px; height: 16px; background: rgba(255,255,255,0.2);"></div>
          <button id="hud-pause-btn" class="hud-btn" style="padding: 4px 8px;">
            ${isPaused ? '▶ ' + t.hud.resume : '⏸ ' + t.hud.pause}
          </button>
          <button id="hud-speed-btn" class="hud-btn" style="padding: 4px 8px;">
            ${this.gameState.gameSpeed === 1.0 ? '1x' : '2x'}
          </button>
        </div>
      </div>

      <!-- Live Broadcast Breaking News Banner with Photo & Community Evaluation -->
      ${this.gameState.lastPublishedArticle ? `
        <div class="breaking-news-toast" style="position: absolute; top: 62px; left: 50%; transform: translateX(-50%); background: rgba(15, 23, 42, 0.95); border: 1.5px solid #0284c7; box-shadow: 0 10px 30px rgba(0,0,0,0.7); border-radius: 8px; padding: 10px 16px; display: flex; align-items: center; gap: 14px; z-index: 30; animation: fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1); max-width: 720px; width: 92%;">
          <img src="${this.gameState.lastPublishedArticle.photo.imageDataUrl}" style="width: 60px; height: 46px; object-fit: cover; border-radius: 4px; border: 1px solid #38bdf8; flex-shrink: 0;" alt="News Photo" />
          <div style="flex: 1; overflow: hidden;">
            <div style="display: flex; align-items: center; gap: 8px; font-size: 10px; font-weight: 700; flex-wrap: wrap;">
              <span style="background: #dc2626; color: #ffffff; padding: 2px 6px; border-radius: 3px; letter-spacing: 0.05em;">BẢN TIN VỪA LÊN SÓNG</span>
              <span style="color: #f59e0b;">ĐÁNH GIÁ ĐỘC GIẢ: ★★★★☆</span>
              <span style="color: #38bdf8;">👥 ${this.gameState.lastPublishedArticle.reach.toLocaleString()} người tiếp cận</span>
            </div>
            <div style="font-family: var(--font-serif); font-size: 13.5px; font-weight: 700; color: #ffffff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-top: 3px;">
              ${this.gameState.lastPublishedArticle.headline.title}
            </div>
          </div>
        </div>
      ` : ''}

      <!-- Bottom HUD with Zoom Controls -->
      <div class="hud-bottom">
        <button id="hud-shutter-btn" class="shutter-btn">
          📷 ${t.hud.takePhoto}
        </button>

        <!-- Optical Zoom Controls Group -->
        <div class="hud-panel" style="display: flex; align-items: center; gap: 5px; padding: 4px 8px;">
          <button id="hud-zoom-out-btn" class="hud-btn" style="padding: 6px 10px; font-weight: 800; font-size: 13px;" title="Thu nhỏ (Góc rộng - Phím X hoặc Cuộn chuột xuống)">
            ➖
          </button>
          <button id="hud-zoom-badge" class="hud-btn" style="padding: 6px 10px; font-family: monospace; font-weight: 700; color: #38bdf8; min-width: 52px; text-align: center;" title="Bấm để đặt lại Zoom 1.0x (Phím 0)">
            ${camera.zoomLevel.toFixed(1)}x
          </button>
          <button id="hud-zoom-in-btn" class="hud-btn" style="padding: 6px 10px; font-weight: 800; font-size: 13px;" title="Phóng to (Cận cảnh - Phím Z hoặc Cuộn chuột lên)">
            ➕
          </button>
        </div>

        <button id="hud-newsroom-btn" class="hud-btn">
          📰 ${t.hud.newsroom}
        </button>

        <button id="hud-journal-btn" class="hud-btn">
          📖 ${t.hud.journal}
        </button>

        <button id="hud-social-btn" class="hud-btn">
          📊 ${t.hud.social}
        </button>

        <button id="hud-focus-btn" class="hud-btn">
          🔍 ${t.hud.focusMode}
        </button>

        <button id="hud-hotkeys-btn" class="hud-btn">
          ⌨️ ${t.hud.help}
        </button>

        <button id="hud-menu-btn" class="hud-btn">
          ⚙️
        </button>
      </div>
    `;

    this.bindEvents();
  }

  private bindEvents(): void {
    document.getElementById('hud-pause-btn')?.addEventListener('click', () => {
      this.gameState.togglePause();
    });

    document.getElementById('hud-speed-btn')?.addEventListener('click', () => {
      this.gameState.setSpeed(this.gameState.gameSpeed === 1.0 ? 2.0 : 1.0);
    });

    document.getElementById('hud-shutter-btn')?.addEventListener('click', () => {
      this.onShutterClick();
    });

    // Zoom Controls
    document.getElementById('hud-zoom-in-btn')?.addEventListener('click', () => {
      this.gameState.camera.zoomIn(0.25);
      this.syncZoomDisplay();
    });

    document.getElementById('hud-zoom-out-btn')?.addEventListener('click', () => {
      this.gameState.camera.zoomOut(0.25);
      this.syncZoomDisplay();
    });

    document.getElementById('hud-zoom-badge')?.addEventListener('click', () => {
      this.gameState.camera.resetZoom();
      this.syncZoomDisplay();
    });

    document.getElementById('hud-newsroom-btn')?.addEventListener('click', () => {
      if (this.gameState.photos.length > 0) {
        this.gameState.selectedPhotoForEditorial = this.gameState.photos[0];
        this.gameState.openModal('newsroom');
      } else {
        alert(i18n.t().journal.empty);
      }
    });

    document.getElementById('hud-journal-btn')?.addEventListener('click', () => {
      this.gameState.openModal('journal');
    });

    document.getElementById('hud-social-btn')?.addEventListener('click', () => {
      this.gameState.openModal('social');
    });

    document.getElementById('hud-focus-btn')?.addEventListener('click', () => {
      this.gameState.camera.toggleFocus();
      this.syncZoomDisplay();
    });

    document.getElementById('hud-hotkeys-btn')?.addEventListener('click', () => {
      this.gameState.openModal('hotkeys');
    });

    document.getElementById('hud-menu-btn')?.addEventListener('click', () => {
      this.gameState.openModal('settings');
    });
  }

  private syncZoomDisplay(): void {
    const badge = document.getElementById('hud-zoom-badge');
    if (badge) {
      badge.textContent = `${this.gameState.camera.zoomLevel.toFixed(1)}x`;
    }
  }
}
