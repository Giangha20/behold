// Social Overview Modal: In-depth civic metrics and demographic group sentiment meters

import { GameState } from '../core/GameState';
import { i18n } from '../i18n';
import { SocialGroup } from '../types/game';

export class SocialOverviewUI {
  private container: HTMLDivElement;

  constructor(private gameState: GameState) {
    this.container = document.createElement('div');
    this.container.id = 'modal-social';
    document.getElementById('app')?.appendChild(this.container);
    this.render();

    this.gameState.subscribe(() => this.render());
    i18n.subscribe(() => this.render());
  }

  public render(): void {
    if (this.gameState.activeModal !== 'social') {
      this.container.innerHTML = '';
      this.container.style.display = 'none';
      return;
    }

    this.container.style.display = 'flex';
    this.container.className = 'modal-overlay';

    const t = i18n.t();
    const metrics = this.gameState.metricsManager.state;
    const groups = this.gameState.relationshipSystem.getGroups();

    this.container.innerHTML = `
      <div class="modal-card" style="max-width: 900px;">
        <div class="modal-header">
          <div>
            <div class="modal-title">📊 ${t.social.title}</div>
            <div class="modal-subtitle">${t.social.subtitle}</div>
          </div>
          <button id="soc-close-btn" class="btn-close">&times;</button>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
          <!-- Left: 8 Core Societal Metrics -->
          <div style="background: rgba(30, 41, 59, 0.4); border-radius: 8px; padding: 16px;">
            <div style="font-weight: 700; font-size: 14px; margin-bottom: 14px; color: #38bdf8;">
              Mô Hình Chỉ Số Đô Thị
            </div>

            ${this.renderMetricRow(t.social.trust, metrics.trust, '#22c55e')}
            ${this.renderMetricRow(t.social.tension, metrics.tension, '#ef4444')}
            ${this.renderMetricRow(t.social.empathy, metrics.empathy, '#ec4899')}
            ${this.renderMetricRow(t.social.polarization, metrics.polarization, '#f59e0b')}
            ${this.renderMetricRow(t.social.curiosity, metrics.curiosity, '#a855f7')}
            ${this.renderMetricRow(t.social.cooperation, metrics.cooperation, '#06b6d4')}
            ${this.renderMetricRow(t.social.mediaInfluence, metrics.mediaInfluence, '#3b82f6')}
            ${this.renderMetricRow(t.social.socialStability, metrics.socialStability, '#10b981')}
          </div>

          <!-- Right: Demographic Group Sentiments -->
          <div style="background: rgba(30, 41, 59, 0.4); border-radius: 8px; padding: 16px;">
            <div style="font-weight: 700; font-size: 14px; margin-bottom: 14px; color: #38bdf8;">
              ${t.social.groupSentimentTitle}
            </div>

            <div style="display: flex; flex-direction: column; gap: 14px;">
              ${(Object.keys(groups) as SocialGroup[]).map(gid => {
                const grp = groups[gid];
                const normalizedSentiment = Math.round((grp.sentiment + 100) / 2); // 0 - 100%
                const sentimentColor = grp.sentiment > 20 ? '#22c55e' : grp.sentiment < -20 ? '#ef4444' : '#eab308';
                return `
                  <div style="border-bottom: 1px solid rgba(255,255,255,0.06); padding-bottom: 8px;">
                    <div style="display: flex; justify-content: space-between; font-size: 12px; font-weight: 600;">
                      <span>${grp.nameVi}</span>
                      <span style="color: ${sentimentColor};">${grp.sentiment > 0 ? '+' : ''}${Math.round(grp.sentiment)}</span>
                    </div>
                    <div class="metric-bar-bg" style="margin: 4px 0;">
                      <div class="metric-bar-fill" style="width: ${normalizedSentiment}%; background: ${sentimentColor};"></div>
                    </div>
                    <div style="font-size: 10px; color: #94a3b8;">
                      <strong>Mối quan tâm:</strong> ${grp.currentConcerns}
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        </div>
      </div>
    `;

    document.getElementById('soc-close-btn')?.addEventListener('click', () => {
      this.gameState.closeModal();
    });
  }

  private renderMetricRow(label: string, value: number, color: string): string {
    return `
      <div class="metric-row">
        <span style="font-size: 12px; color: #e2e8f0;">${label}</span>
        <div class="metric-bar-bg">
          <div class="metric-bar-fill" style="width: ${value}%; background: ${color};"></div>
        </div>
        <span style="font-family: var(--font-mono); font-size: 11px; text-align: right; font-weight: 600;">${value}%</span>
      </div>
    `;
  }
}
