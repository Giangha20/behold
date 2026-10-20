// Persistence & Save System for ECHOES OF THE CROWD
// Handles versioned saves, auto-saving, JSON export/import, and robust recovery.

import { CapturedPhoto, GameSettings, SocialMetricsState } from '../types/game';
import { PublishedArticle } from '../simulation/NewsPropagation';

export const SAVE_KEY = 'echoes_of_the_crowd_save_v1';

export interface SerializedGameState {
  version: number;
  timestamp: number;
  currentChapterIndex: number;
  metrics: SocialMetricsState;
  photos: CapturedPhoto[];
  publishedArticles: PublishedArticle[];
  unlockedEndings: string[];
  settings: GameSettings;
  stats: {
    totalPhotosTaken: number;
    playtimeSeconds: number;
  };
}

export class SaveSystem {
  public static readonly CURRENT_VERSION = 1;

  public static hasSaveData(): boolean {
    try {
      return localStorage.getItem(SAVE_KEY) !== null;
    } catch {
      return false;
    }
  }

  public static saveGame(data: SerializedGameState): boolean {
    try {
      const payload = JSON.stringify({
        ...data,
        version: this.CURRENT_VERSION,
        timestamp: Date.now()
      });
      localStorage.setItem(SAVE_KEY, payload);
      return true;
    } catch (e) {
      console.error('Failed to save game:', e);
      return false;
    }
  }

  public static loadGame(): SerializedGameState | null {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as SerializedGameState;
      if (!parsed || typeof parsed !== 'object' || !parsed.metrics) {
        console.warn('Corrupt save data detected');
        return null;
      }
      return parsed;
    } catch (e) {
      console.error('Error loading save:', e);
      return null;
    }
  }

  public static clearSave(): void {
    try {
      localStorage.removeItem(SAVE_KEY);
    } catch (e) {
      console.error('Failed to clear save:', e);
    }
  }

  public static exportJSON(data: SerializedGameState): string {
    return JSON.stringify(data, null, 2);
  }

  public static importJSON(jsonStr: string): SerializedGameState | null {
    try {
      const parsed = JSON.parse(jsonStr) as SerializedGameState;
      if (!parsed || !parsed.metrics) {
        throw new Error('Invalid game state structure');
      }
      this.saveGame(parsed);
      return parsed;
    } catch (e) {
      console.error('Failed to import JSON save:', e);
      return null;
    }
  }
}
