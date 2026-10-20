import { describe, it, expect } from 'vitest';
import { EndingResolver } from '../simulation/EndingResolver';
import { PublishedArticle } from '../simulation/NewsPropagation';
import { HeadlineOption, SocialMetricsState } from '../types/game';

describe('EndingResolver Tests', () => {
  const dummyHeadline: HeadlineOption = {
    id: 'h1', angle: 'bridging', title: 'Test', subtitle: 'Sub', biasDescription: 'Bias',
    metricImpact: {}, groupReactions: { youth: 'support', elders: 'support', intellect: 'support', commuters: 'support', activists: 'support' },
    viralityBonus: 1.0
  };

  const dummyArticle: PublishedArticle = {
    photo: {} as any,
    headline: dummyHeadline,
    reach: 2000,
    reactions: dummyHeadline.groupReactions,
    publishedAt: Date.now(),
    likes: 200,
    shares: 50,
    impactMetrics: {}
  };

  it('should resolve United Harmony ending when empathy and trust are high and polarization is low', () => {
    const highHarmonyMetrics: SocialMetricsState = {
      trust: 75,
      tension: 18,
      empathy: 78,
      polarization: 20,
      curiosity: 65,
      cooperation: 80,
      mediaInfluence: 50,
      socialStability: 88
    };

    const ending = EndingResolver.resolve(highHarmonyMetrics, [dummyArticle], 5);
    expect(ending.type).toBe('united_harmony');
    expect(ending.title).toContain('Hồi Kết 1');
  });

  it('should resolve Divided Chambers ending when polarization and tension are high', () => {
    const dividedMetrics: SocialMetricsState = {
      trust: 25,
      tension: 78,
      empathy: 22,
      polarization: 75,
      curiosity: 40,
      cooperation: 18,
      mediaInfluence: 60,
      socialStability: 20
    };

    const ending = EndingResolver.resolve(dividedMetrics, [dummyArticle], 5);
    expect(ending.type).toBe('divided_chambers');
    expect(ending.title).toContain('Hồi Kết 2');
  });

  it('should resolve Spectacle Circus ending when sensationalism and media influence dominate', () => {
    const spectacleMetrics: SocialMetricsState = {
      trust: 35,
      tension: 45,
      empathy: 30,
      polarization: 45,
      curiosity: 50,
      cooperation: 30,
      mediaInfluence: 80,
      socialStability: 40
    };

    const sensArticle: PublishedArticle = {
      ...dummyArticle,
      headline: { ...dummyHeadline, angle: 'sensational' }
    };

    const ending = EndingResolver.resolve(spectacleMetrics, [sensArticle, sensArticle], 5);
    expect(ending.type).toBe('spectacle_circus');
    expect(ending.title).toContain('Hồi Kết 3');
  });

  it('should resolve Apathetic Silence ending when trust and curiosity are collapsed', () => {
    const silenceMetrics: SocialMetricsState = {
      trust: 18,
      tension: 30,
      empathy: 25,
      polarization: 35,
      curiosity: 20,
      cooperation: 20,
      mediaInfluence: 40,
      socialStability: 30
    };

    const ending = EndingResolver.resolve(silenceMetrics, [dummyArticle], 5);
    expect(ending.type).toBe('apathetic_silence');
    expect(ending.title).toContain('Hồi Kết 4');
  });
});
