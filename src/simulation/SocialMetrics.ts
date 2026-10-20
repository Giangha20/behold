import { SocialMetricsState } from '../types/game';

export class SocialMetricsManager {
  private metrics: SocialMetricsState;
  private changeHistory: Array<{ timestamp: number; metrics: SocialMetricsState }> = [];
  private listeners: Array<(metrics: SocialMetricsState) => void> = [];

  constructor(initialState?: Partial<SocialMetricsState>) {
    this.metrics = {
      trust: 52,
      tension: 24,
      empathy: 50,
      polarization: 22,
      curiosity: 58,
      cooperation: 48,
      mediaInfluence: 28,
      socialStability: 76,
      ...initialState
    };
    this.recordHistory();
  }

  public get state(): Readonly<SocialMetricsState> {
    return { ...this.metrics };
  }

  public subscribe(fn: (m: SocialMetricsState) => void): () => void {
    this.listeners.push(fn);
    return () => {
      this.listeners = this.listeners.filter(l => l !== fn);
    };
  }

  private notify(): void {
    const copy = { ...this.metrics };
    this.listeners.forEach(fn => fn(copy));
  }

  private recordHistory(): void {
    this.changeHistory.push({
      timestamp: Date.now(),
      metrics: { ...this.metrics }
    });
    // Keep last 100 historical checkpoints
    if (this.changeHistory.length > 100) {
      this.changeHistory.shift();
    }
  }

  /**
   * Applies deliberate metric changes from published stories or major events.
   */
  public applyImpact(impact: Partial<SocialMetricsState>, factor: number = 1.0): void {
    const keys = Object.keys(impact) as Array<keyof SocialMetricsState>;
    keys.forEach(key => {
      const delta = (impact[key] ?? 0) * factor;
      this.metrics[key] = Math.max(0, Math.min(100, Math.round(this.metrics[key] + delta)));
    });

    // Recalculate dynamic derived stability
    this.recomputeStability();
    this.recordHistory();
    this.notify();
  }

  /**
   * Continuous subtle tick: prevents wild jumps and applies mild social inertia.
   * Stability is influenced by the harmony of trust + cooperation vs tension + polarization.
   */
  public update(dtSeconds: number): void {
    // Naturally, high tension creates friction that dampens trust
    if (this.metrics.tension > 60) {
      this.metrics.trust = Math.max(5, this.metrics.trust - 0.08 * dtSeconds);
    }

    // High empathy naturally reduces tension
    if (this.metrics.empathy > 60 && this.metrics.tension > 20) {
      this.metrics.tension = Math.max(10, this.metrics.tension - 0.06 * dtSeconds);
    }

    // High polarization slowly erodes cooperation
    if (this.metrics.polarization > 65) {
      this.metrics.cooperation = Math.max(10, this.metrics.cooperation - 0.05 * dtSeconds);
    }

    this.recomputeStability();
  }

  private recomputeStability(): void {
    // Stability Formula:
    // Positive drivers: Trust (30%), Empathy (20%), Cooperation (30%)
    // Destabilizing drivers: Tension (40%), Polarization (40%)
    const positivePool = (this.metrics.trust * 0.3) + (this.metrics.empathy * 0.2) + (this.metrics.cooperation * 0.3);
    const negativePool = (this.metrics.tension * 0.45) + (this.metrics.polarization * 0.35);
    
    // Balanced base is 50
    const rawStability = 45 + (positivePool - negativePool);
    this.metrics.socialStability = Math.max(0, Math.min(100, Math.round(rawStability)));
  }

  public getHistory(): Array<{ timestamp: number; metrics: SocialMetricsState }> {
    return [...this.changeHistory];
  }

  public serialize(): SocialMetricsState {
    return { ...this.metrics };
  }

  public load(saved: SocialMetricsState): void {
    this.metrics = { ...saved };
    this.recomputeStability();
    this.recordHistory();
    this.notify();
  }
}
