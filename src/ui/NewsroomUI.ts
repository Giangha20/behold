// Newsroom Desk Modal: Review captured snapshot proof, select framing angle, forecast virality, and publish

import { GameState } from '../core/GameState';
import { i18n } from '../i18n';
import { HeadlineOption } from '../types/game';

export class NewsroomUI {
  private container: HTMLDivElement;
  private selectedAngleIndex: number = 0;

  constructor(private gameState: GameState) {
    this.container = document.createElement('div');
    this.container.id = 'modal-newsroom';
    document.getElementById('app')?.appendChild(this.container);
    this.render();

    this.gameState.subscribe(() => this.render());
    i18n.subscribe(() => this.render());
  }

  public render(): void {
    if (this.gameState.activeModal !== 'newsroom' || !this.gameState.selectedPhotoForEditorial) {
      this.container.innerHTML = '';
      this.container.style.display = 'none';
      return;
    }

    this.container.style.display = 'flex';
    this.container.className = 'modal-overlay';

    const t = i18n.t();
    const photo = this.gameState.selectedPhotoForEditorial;

    // Retrieve tailored semantic headline options
    let headlineOptions: HeadlineOption[] = [];
    if (photo.generatedHeadlines && photo.generatedHeadlines.length > 0) {
      headlineOptions = photo.generatedHeadlines;
    } else if (photo.eventDefId) {
      const def = this.gameState.eventSystem.getCatalog().find(d => d.id === photo.eventDefId);
      if (def) {
        headlineOptions = def.headlineOptions;
      }
    }

    // Fallback headline options if generic capture
    if (headlineOptions.length === 0) {
      headlineOptions = [
        {
          id: 'gen_1',
          angle: 'factual',
          title: `Nhịp sống thường nhật tại ${photo.locationName}`,
          subtitle: 'Ghi chép bình dị về những khoảnh khắc đời thường của người dân thành phố.',
          biasDescription: 'Đưa tin trung thực, không thêm thắt yếu tố giật gân.',
          metricImpact: { trust: 4, socialStability: 3 },
          groupReactions: { youth: 'support', elders: 'support', intellect: 'support', commuters: 'support', activists: 'support' },
          viralityBonus: 1.05
        },
        {
          id: 'gen_2',
          angle: 'sensational',
          title: `BẤT AN TẠI ${photo.locationName.toUpperCase()}: Điều gì đang xảy ra dưới mắt chúng ta?`,
          subtitle: 'Những dấu hiệu đáng ngờ làm dấy lên làn sóng lo lắng giữa các cư dân.',
          biasDescription: 'Khai thác nỗi bất an vô hình để tối đa hóa lượt xem.',
          metricImpact: { tension: 10, polarization: 8, trust: -6 },
          groupReactions: { youth: 'support', elders: 'oppose', intellect: 'oppose', commuters: 'support', activists: 'support' },
          viralityBonus: 1.8
        },
        {
          id: 'gen_3',
          angle: 'bridging',
          title: `Tìm kiếm sự kết nối: Những bước chân tìm nhau nơi ${photo.locationName}`,
          subtitle: 'Giữa lòng phố thị huyên náo, mỗi con người vẫn luôn khao khát được thấu hiểu.',
          biasDescription: 'Tập trung vào tính nhân văn và sự gắn kết cộng đồng.',
          metricImpact: { empathy: 12, trust: 6, tension: -5 },
          groupReactions: { youth: 'support', elders: 'support', intellect: 'support', commuters: 'support', activists: 'support' },
          viralityBonus: 1.3
        }
      ];
    }

    this.container.innerHTML = `
      <div class="modal-card" style="max-width: 900px;">
        <div class="modal-header">
          <div>
            <div class="modal-title">📰 ${t.newsroom.title}</div>
            <div class="modal-subtitle">${t.newsroom.subtitle}</div>
          </div>
          <button id="nr-close-btn" class="btn-close">&times;</button>
        </div>

        <div class="newsroom-layout">
          <!-- Left: Photo Contact Print & Evaluation -->
          <div class="photo-preview-box">
            <div style="font-size: 11px; font-weight: 700; color: #38bdf8; text-transform: uppercase; letter-spacing: 0.05em;">
              📸 ${t.newsroom.previewPhoto}
            </div>
            <img src="${photo.imageDataUrl}" class="photo-preview-img" alt="Captured Moment" />
            <div class="photo-meta">
              <div><strong>${t.newsroom.location}</strong> ${photo.locationName}</div>
              <div><strong>${t.newsroom.eventCaptured}</strong> ${photo.eventTitle}</div>
              <div><strong>${t.newsroom.charactersInvolved}</strong> ${photo.charactersInFrame.join(', ') || 'Cư dân đô thị'}</div>
              <div><strong>Độ chuẩn bố cục:</strong> <span style="color: #22c55e; font-weight: 700;">${photo.framingScore}%</span></div>
            </div>

            <!-- Community Photo Evaluation Box -->
            <div style="width: 100%; background: rgba(30, 41, 59, 0.7); border: 1px solid rgba(56, 189, 248, 0.25); border-radius: 6px; padding: 10px; font-size: 11px; line-height: 1.5; color: #cbd5e1;">
              <div style="font-weight: 700; color: #f59e0b; margin-bottom: 4px; display: flex; align-items: center; justify-content: space-between;">
                <span>ĐÁNH GIÁ ẢNH CỦA ĐỘC GIẢ</span>
                <span>★★★★☆</span>
              </div>
              <div style="color: #94a3b8; font-size: 10.5px;">
                Hình ảnh có độ sắc nét và tính đại diện cao. Khi phát sóng, ảnh chụp này sẽ hiển thị trực tiếp trên <strong>Tháp Màn Hình Tin Tức</strong> để toàn bộ người dân cùng chiêm ngưỡng và phản ứng!
              </div>
            </div>
          </div>

          <!-- Right: Editorial Angles & Impact Forecast -->
          <div style="display: flex; flex-direction: column; gap: 14px;">
            <div style="font-size: 13px; font-weight: 600; color: #ffffff;">
              ${t.newsroom.selectAnglePrompt}
            </div>

            <div class="angle-options-list">
              ${headlineOptions.map((opt, idx) => `
                <div class="angle-card ${idx === this.selectedAngleIndex ? 'selected' : ''}" data-idx="${idx}">
                  <span class="angle-badge badge-${opt.angle}">${this.getAngleLabel(opt.angle)}</span>
                  <div class="angle-title">${opt.title}</div>
                  <div class="angle-subtitle">${opt.subtitle}</div>
                  <div style="font-size: 11px; color: #94a3b8; font-style: italic; margin-bottom: 6px;">
                    “${opt.biasDescription}”
                  </div>
                  <div class="angle-forecast">
                    <span>⚡ Lan truyền: x${opt.viralityBonus.toFixed(2)}</span>
                    <span>📈 Tác động: ${this.formatImpact(opt.metricImpact)}</span>
                  </div>
                </div>
              `).join('')}
            </div>

            <div style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 10px;">
              <button id="nr-discard-btn" class="btn btn-secondary">
                ${t.newsroom.discardAction}
              </button>
              <button id="nr-publish-btn" class="btn btn-primary">
                📡 ${t.newsroom.publishAction}
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    this.bindEvents();
  }

  private getAngleLabel(angle: string): string {
    const t = i18n.t().newsroom;
    switch (angle) {
      case 'factual': return t.angleFactual;
      case 'sensational': return t.angleSensational;
      case 'bridging': return t.angleBridging;
      case 'alarmist': return t.angleAlarmist;
      case 'inquisitive': return t.angleInquisitive;
      default: return angle;
    }
  }

  private formatImpact(impact: any): string {
    const parts: string[] = [];
    if (impact.trust) parts.push(`Tin tưởng ${impact.trust > 0 ? '+' : ''}${impact.trust}`);
    if (impact.tension) parts.push(`Căng thẳng ${impact.tension > 0 ? '+' : ''}${impact.tension}`);
    if (impact.empathy) parts.push(`Thấu cảm ${impact.empathy > 0 ? '+' : ''}${impact.empathy}`);
    if (impact.polarization) parts.push(`Phân cực ${impact.polarization > 0 ? '+' : ''}${impact.polarization}`);
    return parts.join(' | ') || 'Cân bằng';
  }

  private bindEvents(): void {
    document.getElementById('nr-close-btn')?.addEventListener('click', () => {
      this.gameState.closeModal();
    });

    document.getElementById('nr-discard-btn')?.addEventListener('click', () => {
      this.gameState.closeModal();
    });

    document.querySelectorAll('.angle-card').forEach(el => {
      el.addEventListener('click', () => {
        const idx = parseInt(el.getAttribute('data-idx') || '0', 10);
        this.selectedAngleIndex = idx;
        this.render();
      });
    });

    document.getElementById('nr-publish-btn')?.addEventListener('click', () => {
      this.gameState.publishSelectedPhoto(this.selectedAngleIndex);
    });
  }
}
