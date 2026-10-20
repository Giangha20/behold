import { describe, it, expect, beforeEach } from 'vitest';
import { SaveSystem, SerializedGameState } from '../core/SaveSystem';

// In-memory mock for localStorage in Node environment
const storageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value.toString(); },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; }
  };
})();

Object.defineProperty(globalThis, 'localStorage', {
  value: storageMock,
  writable: true
});

describe('SaveSystem Unit Tests', () => {
  const dummyState: SerializedGameState = {
    version: 1,
    timestamp: Date.now(),
    currentChapterIndex: 2,
    metrics: {
      trust: 55,
      tension: 28,
      empathy: 52,
      polarization: 24,
      curiosity: 60,
      cooperation: 50,
      mediaInfluence: 32,
      socialStability: 74
    },
    photos: [],
    publishedArticles: [],
    unlockedEndings: [],
    settings: {
      language: 'vi',
      masterVolume: 0.8,
      sfxVolume: 0.8,
      musicVolume: 0.6,
      ambientVolume: 0.5,
      reducedMotion: false,
      highContrast: false,
      cameraSensitivity: 1.0,
      autoSaveIntervalSec: 60
    },
    stats: {
      totalPhotosTaken: 3,
      playtimeSeconds: 120
    }
  };

  beforeEach(() => {
    localStorage.clear();
  });

  it('should save and load valid game state correctly', () => {
    const success = SaveSystem.saveGame(dummyState);
    expect(success).toBe(true);
    expect(SaveSystem.hasSaveData()).toBe(true);

    const loaded = SaveSystem.loadGame();
    expect(loaded).not.toBeNull();
    expect(loaded?.currentChapterIndex).toBe(2);
    expect(loaded?.metrics.trust).toBe(55);
  });

  it('should export and import JSON correctly', () => {
    const json = SaveSystem.exportJSON(dummyState);
    expect(typeof json).toBe('string');
    expect(json).toContain('"trust": 55');

    const imported = SaveSystem.importJSON(json);
    expect(imported).not.toBeNull();
    expect(imported?.currentChapterIndex).toBe(2);
  });

  it('should reject invalid or corrupt JSON safely without crashing', () => {
    const result = SaveSystem.importJSON('{ "invalid": true }');
    expect(result).toBeNull();
  });
});
