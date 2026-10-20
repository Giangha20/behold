import { describe, it, expect, beforeEach } from 'vitest';
import { SocialMetricsManager } from '../simulation/SocialMetrics';

describe('SocialMetricsManager Unit Tests', () => {
  let manager: SocialMetricsManager;

  beforeEach(() => {
    manager = new SocialMetricsManager({
      trust: 50,
      tension: 25,
      empathy: 50,
      polarization: 20,
      curiosity: 60,
      cooperation: 50,
      mediaInfluence: 30,
      socialStability: 75
    });
  });

  it('should initialize with provided metrics and compute stability', () => {
    const state = manager.state;
    expect(state.trust).toBe(50);
    expect(state.tension).toBe(25);
    expect(state.empathy).toBe(50);
    expect(state.socialStability).toBeGreaterThan(0);
    expect(state.socialStability).toBeLessThanOrEqual(100);
  });

  it('should apply positive metric impacts correctly', () => {
    manager.applyImpact({ empathy: 15, trust: 10, tension: -8 });
    const state = manager.state;
    expect(state.empathy).toBe(65);
    expect(state.trust).toBe(60);
    expect(state.tension).toBe(17);
  });

  it('should clamp metrics within [0, 100]', () => {
    manager.applyImpact({ tension: 200, trust: -100 });
    const state = manager.state;
    expect(state.tension).toBe(100);
    expect(state.trust).toBe(0);
  });

  it('should update stability dynamically when tension surges', () => {
    const initialStability = manager.state.socialStability;
    manager.applyImpact({ tension: 60, polarization: 50 });
    expect(manager.state.socialStability).toBeLessThan(initialStability);
  });

  it('should apply natural drift over time during update cycle', () => {
    manager.applyImpact({ tension: 75 });
    const trustBefore = manager.state.trust;
    // Simulate 10 seconds of high tension
    manager.update(10);
    expect(manager.state.trust).toBeLessThan(trustBefore);
  });
});
