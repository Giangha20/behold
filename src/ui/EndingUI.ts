// Ending Retrospective UI: Detailed sociological outcome, key statistics, moral reflection, and replay options

import { GameState } from '../core/GameState';
import { i18n } from '../i18n';

export class EndingUI {
  private container: HTMLDivElement;

  constructor(private gameState: GameState) {
    this.container = document.createElement('div');
    this.container.id = 'modal-ending';
    document.getElementById('app')?.appendChild(this.container);
    this.render();

    this.gameState.subscribe(() => this.render());
    i18n.subscribe(() => this.render());
  }

  public render(): void {
    if (this.gameState.activeModal !== 'ending' || !this.gameState.currentEndingResult) {
      this.container.innerHTML = '';
      this.container.style.display = 'none';
      return;
    }

    this.container.style.display = 'flex';
    this.container.className = 'modal-overlay';

    const t = i18n.t();
    const ending = this.gameState.currentEndingResult;
    const stats = ending.keyStatistics;

    this.container.innerHTML = `
      <div class="modal-card" style="max-width: 820px; padding: 36px;">
        <div style="border-bottom: 2px solid rgba(255,255,255,0.15); padding-bottom: 18px; margin-bottom: 20px;">
          <div style="font-size: 11px; font-weight: 700; color: #38bdf8; text-transform: uppercase; letter-spacing: 0.15em;">
            ${t.endings.title}
          </div>
          <div style="font-family: var(--font-serif); font-size: 28px; font-weight: 800; color: #ffffff; margin-top: 6px;">
            ${ending.title}
          </div>
          <div style="font-size: 14px; font-style: italic; color: #cbd5e1; margin-top: 8px;">
            ${ending.epigraph}
          </div>
        </div>

        <!-- Narrative Summary -->
        <div style="line-height: 1.7; font-size: 14px; color: #e2e8f0; margin-bottom: 20px; background: rgba(30,41,59,0.3); padding: 16px; border-radius: 8px;">
          ${ending.summary}
        </div>

        <!-- Verdict & Stats Grid -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px;">
          <div style="background: rgba(15,23,42,0.8); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 16px;">
            <div style="font-size: 12px; font-weight: 700; color: #38bdf8; margin-bottom: 10px;">
              KẾT LUẬN THỊ CHÍNH
            </div>
            <div style="font-size: 13px; color: #f8fafc; line-height: 1.6;">
              ${ending.societalVerdict}
            </div>
          </div>

          <div style="background: rgba(15,23,42,0.8); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 16px;">
            <div style="font-size: 12px; font-weight: 700; color: #38bdf8; margin-bottom: 10px;">
              CHỈ SỐ BÁO CHÍ CỦA BẠN
            </div>
            <div style="font-size: 12px; display: flex; flex-direction: column; gap: 6px; color: #cbd5e1;">
              <div>Tổng ảnh đã chụp: <strong style="color: #ffffff;">${stats.totalPhotosTaken}</strong></div>
              <div>Bài báo đã phát sóng: <strong style="color: #ffffff;">${stats.totalPublished}</strong></div>
              <div>Góc nhìn chủ đạo: <strong style="color: #38bdf8; text-transform: uppercase;">${stats.mostFrequentAngle}</strong></div>
              <div>Tâm lý cư dân thịnh hành: <strong style="color: #22c55e;">${stats.dominantGroupSentiment}</strong></div>
              <div>Độ ổn định trật tự đô thị: <strong style="color: #f59e0b;">${stats.finalStabilityScore}%</strong></div>
            </div>
          </div>
        </div>

        <!-- Philosophical Reflection -->
        <div style="border-left: 3px solid #0284c7; padding-left: 14px; font-size: 13px; color: #94a3b8; font-style: italic; margin-bottom: 24px;">
          ${ending.reflectionText}
        </div>

        <!-- Action Buttons -->
        <div style="display: flex; justify-content: flex-end; gap: 12px;">
          <button id="end-journal-btn" class="btn btn-secondary">
            📖 ${t.endings.reviewJournal}
          </button>
          <button id="end-replay-btn" class="btn btn-primary">
            🔄 ${t.endings.playAgain}
          </button>
        </div>
      </div>
    `;

    document.getElementById('end-journal-btn')?.addEventListener('click', () => {
      this.gameState.openModal('journal');
    });

    document.getElementById('end-replay-btn')?.addEventListener('click', () => {
      this.gameState.startNewGame();
    });
  }
}
