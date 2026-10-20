import { describe, it, expect } from 'vitest';
import { ChapterCampaign } from '../simulation/ChapterCampaign';

describe('ChapterCampaign Progression Tests', () => {
  it('should initialize at Chapter 1 with 6 total chapters', () => {
    const campaign = new ChapterCampaign();
    expect(campaign.getCurrentChapter().index).toBe(1);
    expect(campaign.getAllChapters().length).toBe(6);
  });

  it('should progress to Chapter 2 after 1 published article', () => {
    const campaign = new ChapterCampaign();
    const progressed = campaign.onArticlePublished(1);
    expect(progressed).toBe(true);
    expect(campaign.getCurrentChapter().index).toBe(2);
  });

  it('should mark campaign complete after 6 articles', () => {
    const campaign = new ChapterCampaign();
    expect(campaign.isFinalChapterComplete(5)).toBe(false);
    expect(campaign.isFinalChapterComplete(6)).toBe(true);
  });
});
