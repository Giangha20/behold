// News Propagation & Social Ripple Simulation
// Calculates virality, group reception, and simulates information spread across town.

import { CapturedPhoto, HeadlineOption, SocialGroup, SocialMetricsState } from '../types/game';
import { SocialMetricsManager } from './SocialMetrics';
import { RelationshipSystem } from './RelationshipSystem';
import { Character } from '../entities/Character';
import { CityWorld } from '../entities/CityWorld';

export interface PublishedArticle {
  photo: CapturedPhoto;
  headline: HeadlineOption;
  reach: number;
  reactions: Record<SocialGroup, 'support' | 'neutral' | 'oppose'>;
  publishedAt: number;
  likes: number;
  shares: number;
  impactMetrics: Partial<SocialMetricsState>;
}

export class NewsPropagation {
  private publishedHistory: PublishedArticle[] = [];
  private listeners: Array<(article: PublishedArticle) => void> = [];

  constructor(
    private metricsManager: SocialMetricsManager,
    private relationshipSystem: RelationshipSystem,
    private world: CityWorld
  ) {}

  public subscribe(fn: (article: PublishedArticle) => void): () => void {
    this.listeners.push(fn);
    return () => {
      this.listeners = this.listeners.filter(l => l !== fn);
    };
  }

  /**
   * Publishes an article from a captured photo and selected editorial headline.
   */
  public publishStory(photo: CapturedPhoto, headline: HeadlineOption, characters: Character[]): PublishedArticle {
    const currentMetrics = this.metricsManager.state;

    // Calculate dynamic virality:
    // Base virality is augmented if sensational/alarmist in high tension environment,
    // or if bridging in an environment eager for hope.
    let viralityMultiplier = headline.viralityBonus;
    if (headline.angle === 'sensational' || headline.angle === 'alarmist') {
      viralityMultiplier += (currentMetrics.tension / 100) * 0.45;
    } else if (headline.angle === 'bridging') {
      viralityMultiplier += (currentMetrics.empathy / 100) * 0.35;
    } else if (headline.angle === 'inquisitive') {
      viralityMultiplier += (currentMetrics.curiosity / 100) * 0.4;
    }

    // Reach is roughly proportional to city population and media influence
    const baseAudience = 1200 + currentMetrics.mediaInfluence * 65;
    const reach = Math.round(baseAudience * viralityMultiplier);
    const likes = Math.round(reach * (0.08 + Math.random() * 0.12));
    const shares = Math.round(reach * (0.02 + Math.random() * 0.05 * viralityMultiplier));

    const article: PublishedArticle = {
      photo: { ...photo, published: true, publishedAt: Date.now(), selectedHeadline: headline },
      headline,
      reach,
      reactions: headline.groupReactions,
      publishedAt: Date.now(),
      likes,
      shares,
      impactMetrics: headline.metricImpact
    };

    this.publishedHistory.push(article);

    // 1. Update Media Screen Monolith in City Center with captured photo and headline
    this.world.setBroadcast(headline.title, headline.subtitle, photo.imageDataUrl);

    // 2. Apply societal metric impacts
    this.metricsManager.applyImpact(headline.metricImpact, viralityMultiplier * 0.85);

    // 3. Update demographic group sentiments
    this.relationshipSystem.reactToStory(headline.groupReactions, reach);

    // 4. Ripple effect onto in-world characters
    this.triggerPhysicalWorldRipple(article, characters);

    // 5. Notify listeners
    this.listeners.forEach(fn => fn(article));

    return article;
  }

  private triggerPhysicalWorldRipple(article: PublishedArticle, characters: Character[]): void {
    // Media screen is at x = 1530
    const screenX = 1530;

    characters.forEach(char => {
      const distFromScreen = Math.abs(char.x - screenX);
      const groupReaction = article.reactions[char.group] || 'neutral';

      // Characters closer to the screen immediately notice the broadcast
      if (distFromScreen < 380 && Math.random() < 0.75) {
        char.state = 'reading_news';
        char.facing = char.x < screenX ? 'right' : 'left';
        char.lastNewsReadId = article.headline.id;

        if (groupReaction === 'support') {
          char.emotion = 'happy';
          char.sayRandom(['Tin tức này đúng ý tôi!', 'Thật tuyệt vời!', 'Cần nhiều bài báo như thế này.'], 4);
        } else if (groupReaction === 'oppose') {
          char.emotion = 'angry';
          char.sayRandom(['Tại sao lại viết sai sự thật thế này?!', 'Báo chí giật gân quá đáng!', 'Thật phẫn nộ.'], 4);
        } else {
          char.emotion = 'surprised';
          char.sayRandom(['Chuyện này lạ thật...', 'Có nên tin không nhỉ?', 'Dư luận đang xôn xao kìa.'], 4);
        }
      }
    });
  }

  public getPublishedArticles(): PublishedArticle[] {
    return [...this.publishedHistory];
  }

  public getTotalReach(): number {
    return this.publishedHistory.reduce((sum, a) => sum + a.reach, 0);
  }

  public getDominantAngle(): string {
    if (this.publishedHistory.length === 0) return 'none';
    const counts: Record<string, number> = {};
    for (const a of this.publishedHistory) {
      counts[a.headline.angle] = (counts[a.headline.angle] || 0) + 1;
    }
    let topAngle = 'factual';
    let maxCount = 0;
    for (const [angle, cnt] of Object.entries(counts)) {
      if (cnt > maxCount) {
        maxCount = cnt;
        topAngle = angle;
      }
    }
    return topAngle;
  }
}
