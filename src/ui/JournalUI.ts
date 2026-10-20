// Journal Modal: History of all captured moments and published articles

import { GameState } from '../core/GameState';
import { i18n } from '../i18n';

export class JournalUI {
  private container: HTMLDivElement;
  private filter: 'all' | 'published' | 'drafts' = 'all';

  constructor(private gameState: GameState) {
    this.container = document.createElement('div');
    this.container.id = 'modal-journal';
    document.getElementById('app')?.appendChild(this.container);
    this.render();

    this.gameState.subscribe(() => this.render());
    i18n.subscribe(() => this.render());
  }

  public render(): void {
    if (this.gameState.activeModal !== 'journal') {
      this.container.innerHTML = '';
      this.container.style.display = 'none';
      return;
    }

    this.container.style.display = 'flex';
    this.container.className = 'modal-overlay';

    const t = i18n.t();
    const articles = this.gameState.newsPropagation.getPublishedArticles();
    const totalReach = this.gameState.newsPropagation.getTotalReach();

    const filteredPhotos = this.gameState.photos.filter(p => {
      if (this.filter === 'published') return p.published;
      if (this.filter === 'drafts') return !p.published;
      return true;
    });

    this.container.innerHTML = `
      <div class="modal-card" style="max-width: 960px;">
        <div class="modal-header">
          <div>
            <div class="modal-title">📖 ${t.journal.title}</div>
            <div class="modal-subtitle">${t.journal.subtitle}</div>
          </div>
          <button id="jr-close-btn" class="btn-close">&times;</button>
        </div>

        <!-- Chronicle Top Summary -->
        <div style="display: flex; gap: 24px; padding: 12px 16px; background: rgba(30, 41, 59, 0.4); border-radius: 8px; font-size: 13px;">
          <div>${t.journal.statsTotalReach} <strong style="color: #38bdf8;">${totalReach.toLocaleString()} độc giả</strong></div>
          <div>Bài viết đã phát sóng: <strong style="color: #22c55e;">${articles.length}</strong></div>
          <div>Tổng ảnh đã chụp: <strong style="color: #f59e0b;">${this.gameState.totalPhotosTaken}</strong></div>
        </div>

        <!-- Filter Tabs -->
        <div style="display: flex; gap: 8px;">
          <button class="btn btn-secondary ${this.filter === 'all' ? 'active' : ''}" id="flt-all" style="padding: 6px 12px; font-size: 12px;">
            ${t.journal.filterAll} (${this.gameState.photos.length})
          </button>
          <button class="btn btn-secondary ${this.filter === 'published' ? 'active' : ''}" id="flt-pub" style="padding: 6px 12px; font-size: 12px;">
            ${t.journal.filterPublished} (${this.gameState.photos.filter(p => p.published).length})
          </button>
          <button class="btn btn-secondary ${this.filter === 'drafts' ? 'active' : ''}" id="flt-draft" style="padding: 6px 12px; font-size: 12px;">
            ${t.journal.filterDraft} (${this.gameState.photos.filter(p => !p.published).length})
          </button>
        </div>

        <!-- Photo Grid -->
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 16px; max-height: 55vh; overflow-y: auto; padding-right: 4px;">
          ${filteredPhotos.length === 0 ? `
            <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #94a3b8;">
              ${t.journal.empty}
            </div>
          ` : filteredPhotos.map(p => `
            <div style="background: rgba(30, 41, 59, 0.6); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; overflow: hidden; display: flex; flex-direction: column;">
              <img src="${p.imageDataUrl}" style="width: 100%; height: 140px; object-fit: cover;" alt="Photo" />
              <div style="padding: 12px; display: flex; flex-direction: column; gap: 6px; flex: 1;">
                <div style="display: flex; justify-content: space-between; font-size: 10px; color: #94a3b8;">
                  <span>${p.locationName}</span>
                  <span>${p.gameTimeStr}</span>
                </div>
                <div style="font-family: var(--font-serif); font-size: 14px; font-weight: 700; color: #ffffff;">
                  ${p.selectedHeadline ? p.selectedHeadline.title : p.eventTitle}
                </div>
                <div style="font-size: 11px; color: #94a3b8;">
                  ${p.selectedHeadline ? p.selectedHeadline.subtitle : 'Chưa xuất bản (Bản lưu trong máy)'}
                </div>
                ${p.published ? `
                  <div style="margin-top: auto; font-size: 10px; color: #38bdf8; display: flex; gap: 8px;">
                    <span>👥 Tiếp cận: ${p.reachCount || 1200}</span>
                    <span>❤️ ${p.likes || 140}</span>
                    <span>🔁 ${p.shares || 35}</span>
                  </div>
                ` : `
                  <button class="btn btn-primary btn-publish-draft" data-photoid="${p.id}" style="margin-top: auto; padding: 6px 10px; font-size: 11px;">
                    Soạn Bài & Đăng
                  </button>
                `}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    this.bindEvents();
  }

  private bindEvents(): void {
    document.getElementById('jr-close-btn')?.addEventListener('click', () => {
      this.gameState.closeModal();
    });

    document.getElementById('flt-all')?.addEventListener('click', () => {
      this.filter = 'all';
      this.render();
    });

    document.getElementById('flt-pub')?.addEventListener('click', () => {
      this.filter = 'published';
      this.render();
    });

    document.getElementById('flt-draft')?.addEventListener('click', () => {
      this.filter = 'drafts';
      this.render();
    });

    document.querySelectorAll('.btn-publish-draft').forEach(btn => {
      btn.addEventListener('click', () => {
        const pId = btn.getAttribute('data-photoid');
        const found = this.gameState.photos.find(p => p.id === pId);
        if (found) {
          this.gameState.selectedPhotoForEditorial = found;
          this.gameState.openModal('newsroom');
        }
      });
    });
  }
}
