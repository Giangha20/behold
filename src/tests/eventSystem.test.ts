import { describe, it, expect } from 'vitest';
import { EventSystem } from '../simulation/EventSystem';
import { Character } from '../entities/Character';

describe('EventSystem & Viewfinder Detection Tests', () => {
  it('should load full event catalog with valid headline options', () => {
    const eventSystem = new EventSystem();
    const catalog = eventSystem.getCatalog();
    expect(catalog.length).toBeGreaterThanOrEqual(5);

    catalog.forEach(def => {
      expect(def.id).toBeDefined();
      expect(def.title).toBeDefined();
      expect(def.headlineOptions.length).toBeGreaterThanOrEqual(3);
      def.headlineOptions.forEach(opt => {
        expect(['factual', 'sensational', 'bridging', 'alarmist', 'inquisitive']).toContain(opt.angle);
        expect(opt.viralityBonus).toBeGreaterThanOrEqual(1.0);
      });
    });
  });

  it('should detect character inside camera viewfinder frame', () => {
    const eventSystem = new EventSystem();
    const testChar = new Character('char_test', 'Tester', 'youth', 'linh_student', 500, 490, {
      headShape: 'round',
      skinTone: '#fed7aa',
      hairStyle: 'short_part',
      hairColor: '#000000',
      outfitColor: '#0284c7',
      pantsColor: '#1e293b',
      scale: 1.0
    });

    // Viewfinder centered on testChar: frameX = 420, frameW = 160 -> span [420, 580]
    const evaluation = eventSystem.evaluateViewfinder(420, 400, 160, 120, [testChar]);
    expect(evaluation.charactersInFrame.length).toBe(1);
    expect(evaluation.charactersInFrame[0].id).toBe('char_test');
    expect(evaluation.framingScore).toBeGreaterThanOrEqual(70);
  });

  it('should report no subject when camera points to empty street', () => {
    const eventSystem = new EventSystem();
    const testChar = new Character('char_distant', 'Distant', 'elders', 'town_resident', 1800, 490, {
      headShape: 'round',
      skinTone: '#fed7aa',
      hairStyle: 'short_part',
      hairColor: '#000000',
      outfitColor: '#0284c7',
      pantsColor: '#1e293b',
      scale: 1.0
    });

    // Viewfinder far away at x = 200
    const evaluation = eventSystem.evaluateViewfinder(100, 400, 160, 120, [testChar]);
    expect(evaluation.charactersInFrame.length).toBe(0);
    expect(evaluation.hasNotableEvent).toBe(false);
  });
});
