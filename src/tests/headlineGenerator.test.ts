import { describe, it, expect } from 'vitest';
import { HeadlineGenerator } from '../simulation/HeadlineGenerator';
import { Character } from '../entities/Character';
import { CityZone } from '../entities/CityWorld';

describe('HeadlineGenerator 300+ Combinatorial Situations Tests', () => {
  const dummyZone: CityZone = {
    id: 'plaza',
    nameVi: 'Quảng Trường Ánh Sáng',
    nameEn: 'Central Plaza',
    startX: 840,
    endX: 1320,
    centerX: 1080,
    descriptionVi: 'Quảng trường'
  };

  const dummyChar = new Character('char_linh', 'Linh (Sinh Viên)', 'youth', 'linh_student', 1000, 490, {
    headShape: 'oval', skinTone: '#fed7aa', hairStyle: 'ponytail', hairColor: '#000000',
    outfitColor: '#0284c7', pantsColor: '#1e293b', scale: 1.0
  });

  it('should generate tailored romance headlines when love moment is detected', () => {
    const headlines = HeadlineGenerator.generateHeadlines({
      primaryCharacter: dummyChar,
      allCharacters: [dummyChar],
      zone: dummyZone,
      primaryAction: 'in_love',
      dominantEmotion: 'happy',
      isPigeonInFrame: false,
      hasCrowd: false,
      hasConflict: false,
      hasRomance: true,
      hasPerformance: false,
      hasProtest: false
    });

    expect(headlines.length).toBe(4);
    expect(headlines.some(h => h.title.includes('tình cảm') || h.title.includes('TỎ TÌNH') || h.title.includes('Tình yêu'))).toBe(true);
  });

  it('should generate street performance headlines when music/dance is detected', () => {
    const headlines = HeadlineGenerator.generateHeadlines({
      primaryCharacter: dummyChar,
      allCharacters: [dummyChar],
      zone: dummyZone,
      primaryAction: 'dancing',
      dominantEmotion: 'happy',
      isPigeonInFrame: false,
      hasCrowd: true,
      hasConflict: false,
      hasRomance: false,
      hasPerformance: true,
      hasProtest: false
    });

    expect(headlines.length).toBe(4);
    expect(headlines.some(h => h.title.includes('đường phố') || h.title.includes('HỖN LOẠN ÂM THANH') || h.title.includes('âm nhạc'))).toBe(true);
  });

  it('should generate animal/pigeon headlines when pigeon is in frame', () => {
    const headlines = HeadlineGenerator.generateHeadlines({
      allCharacters: [],
      zone: dummyZone,
      primaryAction: 'feeding_birds',
      dominantEmotion: 'neutral',
      isPigeonInFrame: true,
      hasCrowd: false,
      hasConflict: false,
      hasRomance: false,
      hasPerformance: false,
      hasProtest: false
    });

    expect(headlines.length).toBe(4);
    expect(headlines.some(h => h.title.includes('bồ câu') || h.title.includes('BỒ CÂU'))).toBe(true);
  });

  it('should generate clumsy mishap headlines when character trips over cobblestone', () => {
    const headlines = HeadlineGenerator.generateHeadlines({
      primaryCharacter: dummyChar,
      allCharacters: [dummyChar],
      zone: dummyZone,
      primaryAction: 'tripping',
      dominantEmotion: 'surprised',
      isPigeonInFrame: false,
      hasCrowd: false,
      hasConflict: false,
      hasRomance: false,
      hasPerformance: false,
      hasProtest: false
    });

    expect(headlines.length).toBe(4);
    expect(headlines.some(h => h.title.includes('vấp ngã') || h.title.includes('BẪY TỬ THẦN'))).toBe(true);
  });
});
