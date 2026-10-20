import { describe, it, expect, beforeEach } from 'vitest';
import { NewsPropagation } from '../simulation/NewsPropagation';
import { SocialMetricsManager } from '../simulation/SocialMetrics';
import { RelationshipSystem } from '../simulation/RelationshipSystem';
import { CityWorld } from '../entities/CityWorld';
import { Character } from '../entities/Character';
import { CapturedPhoto, HeadlineOption } from '../types/game';

describe('NewsPropagation Simulation Tests', () => {
  let metricsManager: SocialMetricsManager;
  let relSystem: RelationshipSystem;
  let world: CityWorld;
  let propagation: NewsPropagation;
  let testPhoto: CapturedPhoto;

  beforeEach(() => {
    metricsManager = new SocialMetricsManager({ trust: 50, tension: 25, empathy: 50 });
    relSystem = new RelationshipSystem();
    world = new CityWorld();
    propagation = new NewsPropagation(metricsManager, relSystem, world);

    testPhoto = {
      id: 'photo_test',
      timestamp: Date.now(),
      gameTimeStr: '10:00',
      chapterIndex: 1,
      eventTitle: 'Âm nhạc đường phố',
      locationName: 'Quảng Trường',
      charactersInFrame: ['Nam'],
      framingScore: 85,
      imageDataUrl: 'data:image/jpeg;base64,test',
      published: false
    };
  });

  it('should publish story, update monolith screen, and impact social metrics', () => {
    const headline: HeadlineOption = {
      id: 'h_test',
      angle: 'bridging',
      title: 'Âm nhạc hàn gắn cộng đồng',
      subtitle: 'Nụ cười trên quảng trường',
      biasDescription: 'Kết nối',
      metricImpact: { empathy: 15, trust: 8, tension: -6 },
      groupReactions: { youth: 'support', elders: 'support', intellect: 'support', commuters: 'support', activists: 'support' },
      viralityBonus: 1.3
    };

    const dummyChar = new Character('char_dummy', 'Dummy', 'youth', 'nam_busker', 1500, 490, {
      headShape: 'round', skinTone: '#fed7aa', hairStyle: 'beanie', hairColor: '#000000',
      outfitColor: '#059669', pantsColor: '#1e293b', scale: 1.0
    });

    const initialEmpathy = metricsManager.state.empathy;
    const article = propagation.publishStory(testPhoto, headline, [dummyChar]);

    expect(article.reach).toBeGreaterThan(1000);
    expect(world.activeBroadcastHeadline).toBe(headline.title);
    expect(metricsManager.state.empathy).toBeGreaterThan(initialEmpathy);
    expect(propagation.getPublishedArticles().length).toBe(1);
  });

  it('should compute dominant angle accurately across multiple publications', () => {
    const chars: Character[] = [];
    const sensationalHeadline: HeadlineOption = {
      id: 'h_sens',
      angle: 'sensational',
      title: 'Hỗn Loạn',
      subtitle: 'Cảnh báo đỏ',
      biasDescription: 'Giật gân',
      metricImpact: { tension: 10 },
      groupReactions: { youth: 'support', elders: 'support', intellect: 'oppose', commuters: 'oppose', activists: 'support' },
      viralityBonus: 1.6
    };

    propagation.publishStory(testPhoto, sensationalHeadline, chars);
    propagation.publishStory(testPhoto, sensationalHeadline, chars);
    expect(propagation.getDominantAngle()).toBe('sensational');
  });
});
