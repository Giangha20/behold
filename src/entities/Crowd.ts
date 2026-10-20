// Crowd Manager & Named Character Roster for ECHOES OF THE CROWD

import { Character, VisualTraits } from './Character';
import { CityWorld } from './CityWorld';

export class Crowd {
  public characters: Character[] = [];

  constructor(world: CityWorld) {
    this.initCharacters(world);
  }

  private initCharacters(world: CityWorld): void {
    const groundY = world.groundY;

    // 1. Linh - Journalism Student (Tò mò, ham học hỏi)
    this.characters.push(
      new Character('char_linh', 'Linh (Sinh Viên)', 'youth', 'linh_student', 640, groundY, {
        headShape: 'oval',
        skinTone: '#fed7aa',
        hairStyle: 'ponytail',
        hairColor: '#1e293b',
        outfitColor: '#0284c7',
        pantsColor: '#334155',
        accessory: 'notebook',
        scale: 1.0
      })
    );

    // 2. Nam - Street Musician (Hòa đồng, yêu nghệ thuật)
    this.characters.push(
      new Character('char_nam', 'Nam (Nhạc Sĩ)', 'youth', 'nam_busker', 1060, groundY, {
        headShape: 'round',
        skinTone: '#fcd34d',
        hairStyle: 'beanie',
        hairColor: '#d97706',
        outfitColor: '#059669',
        pantsColor: '#1e293b',
        accessory: 'guitar',
        scale: 1.02
      })
    );

    // 3. Bác Ba - Cafe Owner (Thận trọng, chuộng truyền thống)
    this.characters.push(
      new Character('char_ba', 'Bác Ba (Chủ Quán)', 'elders', 'ba_cafe_elder', 520, groundY, {
        headShape: 'round',
        skinTone: '#fbcfe8',
        hairStyle: 'bald_elder',
        hairColor: '#94a3b8',
        outfitColor: '#78350f',
        pantsColor: '#475569',
        scale: 0.98
      })
    );

    // 4. Quỳnh - Trend Influencer (Thích gây chú ý, sống ảo)
    this.characters.push(
      new Character('char_quynh', 'Quỳnh (Influencer)', 'youth', 'quynh_influencer', 1140, groundY, {
        headShape: 'teardrop',
        skinTone: '#fde68a',
        hairStyle: 'ponytail',
        hairColor: '#b91c1c',
        outfitColor: '#ec4899',
        pantsColor: '#0f172a',
        scale: 0.98
      })
    );

    // 5. Hoàng - Passionate Civic Activist (Nóng nảy, đòi hỏi công bằng)
    this.characters.push(
      new Character('char_hoang', 'Hoàng (Nhà Vận Động)', 'activists', 'hoang_activist', 1480, groundY, {
        headShape: 'square',
        skinTone: '#fed7aa',
        hairStyle: 'messy',
        hairColor: '#0f172a',
        outfitColor: '#dc2626',
        pantsColor: '#1e293b',
        accessory: 'scarf',
        scale: 1.04
      })
    );

    // 6. Mai - Volunteer Medic (Đồng cảm, nhẫn nại)
    this.characters.push(
      new Character('char_mai', 'Mai (Bác Sĩ)', 'intellect', 'mai_volunteer', 1880, groundY, {
        headShape: 'oval',
        skinTone: '#fef08a',
        hairStyle: 'short_part',
        hairColor: '#334155',
        outfitColor: '#0d9488',
        pantsColor: '#64748b',
        scale: 1.0
      })
    );

    // 7. Phong - Commuter Engineer (Hoài nghi, bận rộn)
    this.characters.push(
      new Character('char_phong', 'Phong (Kỹ Sư)', 'commuters', 'phong_engineer', 1960, groundY, {
        headShape: 'square',
        skinTone: '#fed7aa',
        hairStyle: 'short_part',
        hairColor: '#1e293b',
        outfitColor: '#475569',
        pantsColor: '#0f172a',
        scale: 1.03
      })
    );

    // 8. Bé An - Innocent Child
    this.characters.push(
      new Character('char_an', 'Bé An', 'youth', 'child_an', 2220, groundY, {
        headShape: 'round',
        skinTone: '#fde68a',
        hairStyle: 'messy',
        hairColor: '#78350f',
        outfitColor: '#eab308',
        pantsColor: '#0284c7',
        scale: 0.78
      })
    );

    // 9. Bé Bình - Playful companion child
    this.characters.push(
      new Character('char_binh', 'Bé Bình', 'youth', 'child_an', 2160, groundY, {
        headShape: 'round',
        skinTone: '#fed7aa',
        hairStyle: 'short_part',
        hairColor: '#0f172a',
        outfitColor: '#ec4899',
        pantsColor: '#1e293b',
        scale: 0.76
      })
    );

    // 10. Tuấn - Jogger in sports headband
    this.characters.push(
      new Character('char_tuan', 'Tuấn (Chạy Bộ)', 'commuters', 'town_resident', 320, groundY, {
        headShape: 'oval',
        skinTone: '#fed7aa',
        hairStyle: 'short_part',
        hairColor: '#0f172a',
        outfitColor: '#ef4444',
        pantsColor: '#1e293b',
        accessory: 'cap',
        scale: 1.02
      })
    );

    // 11. Bác Sáu - Senior Bird Lover in Park
    this.characters.push(
      new Character('char_sau', 'Bác Sáu (Yêu Chim)', 'elders', 'town_resident', 2310, groundY, {
        headShape: 'round',
        skinTone: '#fed7aa',
        hairStyle: 'bald_elder',
        hairColor: '#e2e8f0',
        outfitColor: '#15803d',
        pantsColor: '#475569',
        scale: 0.96
      })
    );

    // 12. Dũng - Hipster with Beanie
    this.characters.push(
      new Character('char_dung', 'Dũng (Mũ Len)', 'youth', 'town_resident', 950, groundY, {
        headShape: 'teardrop',
        skinTone: '#fcd34d',
        hairStyle: 'beanie',
        hairColor: '#d97706',
        outfitColor: '#8b5cf6',
        pantsColor: '#0f172a',
        scale: 1.01
      })
    );

    // 13. Lan - Chic Fashionista with Scarf
    this.characters.push(
      new Character('char_lan', 'Lan (Thời Trang)', 'youth', 'quynh_influencer', 1240, groundY, {
        headShape: 'oval',
        skinTone: '#fde68a',
        hairStyle: 'ponytail',
        hairColor: '#7c2d12',
        outfitColor: '#f43f5e',
        pantsColor: '#1e293b',
        accessory: 'scarf',
        scale: 0.99
      })
    );

    // 14-25: Additional diverse town residents
    const additionalResidents: Array<{ name: string; group: any; x: number; traits: VisualTraits }> = [
      {
        name: 'Bà Tư (Hưu Trí)',
        group: 'elders',
        x: 280,
        traits: { headShape: 'round', skinTone: '#fed7aa', hairStyle: 'bald_elder', hairColor: '#cbd5e1', outfitColor: '#9333ea', pantsColor: '#334155', scale: 0.95 }
      },
      {
        name: 'Minh (Kế Toán)',
        group: 'commuters',
        x: 820,
        traits: { headShape: 'oval', skinTone: '#fef08a', hairStyle: 'short_part', hairColor: '#0f172a', outfitColor: '#2563eb', pantsColor: '#1e293b', scale: 1.0 }
      },
      {
        name: 'Huy (Nhiếp Ảnh Gia)',
        group: 'youth',
        x: 1380,
        traits: { headShape: 'square', skinTone: '#fcd34d', hairStyle: 'beanie', hairColor: '#b45309', outfitColor: '#65a30d', pantsColor: '#0f172a', scale: 1.01 }
      },
      {
        name: 'Giáo Sư Khiêm',
        group: 'intellect',
        x: 740,
        traits: { headShape: 'square', skinTone: '#fed7aa', hairStyle: 'bald_elder', hairColor: '#e2e8f0', outfitColor: '#1e293b', pantsColor: '#475569', scale: 1.02 }
      },
      {
        name: 'Thảo (Cộng Tác Viên)',
        group: 'activists',
        x: 1620,
        traits: { headShape: 'oval', skinTone: '#fed7aa', hairStyle: 'ponytail', hairColor: '#0f172a', outfitColor: '#16a34a', pantsColor: '#334155', scale: 0.99 }
      },
      {
        name: 'Bác Hùng (Tài Xế)',
        group: 'commuters',
        x: 1840,
        traits: { headShape: 'round', skinTone: '#fed7aa', hairStyle: 'short_part', hairColor: '#334155', outfitColor: '#0369a1', pantsColor: '#1e293b', scale: 1.03 }
      },
      {
        name: 'Trúc (Họa Sĩ Trẻ)',
        group: 'youth',
        x: 580,
        traits: { headShape: 'oval', skinTone: '#fde68a', hairStyle: 'ponytail', hairColor: '#0f172a', outfitColor: '#059669', pantsColor: '#475569', scale: 0.97 }
      },
      {
        name: 'Thầy Đức (Triết Học)',
        group: 'intellect',
        x: 690,
        traits: { headShape: 'square', skinTone: '#fef08a', hairStyle: 'bald_elder', hairColor: '#94a3b8', outfitColor: '#475569', pantsColor: '#0f172a', scale: 1.0 }
      },
      {
        name: 'Loan (Nhân Viên Văn Phòng)',
        group: 'commuters',
        x: 2020,
        traits: { headShape: 'oval', skinTone: '#fed7aa', hairStyle: 'short_part', hairColor: '#0f172a', outfitColor: '#6366f1', pantsColor: '#1e293b', scale: 0.98 }
      },
      {
        name: 'Bé Chi (Bong Bóng)',
        group: 'youth',
        x: 1090,
        traits: { headShape: 'round', skinTone: '#fde68a', hairStyle: 'ponytail', hairColor: '#78350f', outfitColor: '#f97316', pantsColor: '#0284c7', scale: 0.75 }
      },
      {
        name: 'Vinh (Tình Nguyện Viên)',
        group: 'activists',
        x: 1540,
        traits: { headShape: 'square', skinTone: '#fed7aa', hairStyle: 'short_part', hairColor: '#0f172a', outfitColor: '#14b8a6', pantsColor: '#1e293b', scale: 1.01 }
      },
      {
        name: 'Cụ Mùi (Đi Dạo)',
        group: 'elders',
        x: 180,
        traits: { headShape: 'round', skinTone: '#fed7aa', hairStyle: 'bald_elder', hairColor: '#f1f5f9', outfitColor: '#854d0e', pantsColor: '#334155', scale: 0.94 }
      }
    ];

    additionalResidents.forEach((res, i) => {
      this.characters.push(
        new Character(`char_town_${i}`, res.name, res.group, 'town_resident', res.x, groundY, res.traits)
      );
    });
  }

  public update(dt: number, bounds: { minX: number; maxX: number }): void {
    for (const char of this.characters) {
      char.update(dt, bounds, this.characters);
    }
  }

  public render(ctx: CanvasRenderingContext2D, minX: number, maxX: number): void {
    // Sort by y and render only characters within or close to camera view
    const visibleChars = this.characters.filter(c => c.x >= minX - 100 && c.x <= maxX + 100);
    visibleChars.sort((a, b) => a.y - b.y);

    for (const char of visibleChars) {
      char.render(ctx);
    }
  }

  public getCharacterById(id: string): Character | undefined {
    return this.characters.find(c => c.id === id);
  }
}
