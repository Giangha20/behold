import { SocialGroup } from '../types/game';

export interface GroupProfile {
  id: SocialGroup;
  nameVi: string;
  nameEn: string;
  coreValues: string;
  mediaSkepticism: number; // 0 (gullible) - 100 (deeply critical)
  affinity: Record<SocialGroup, number>; // -100 to +100
  sentiment: number; // -100 (disillusioned) to +100 (optimistic/supportive)
  currentConcerns: string;
}

export class RelationshipSystem {
  private groups: Record<SocialGroup, GroupProfile>;
  private characterAffinities: Map<string, Map<string, number>> = new Map();

  constructor() {
    this.groups = {
      youth: {
        id: 'youth',
        nameVi: 'Giới Trẻ & Sáng Tạo',
        nameEn: 'Youth & Creative Vanguard',
        coreValues: 'Tự do biểu đạt, đổi mới, xu hướng lan truyền, khao khát kết nối',
        mediaSkepticism: 35,
        affinity: { youth: 80, elders: -15, intellect: 40, commuters: 10, activists: 55 },
        sentiment: 20,
        currentConcerns: 'Cơ hội phát triển, sự bảo thủ của thế hệ trước, áp lực đồng trang lứa'
      },
      elders: {
        id: 'elders',
        nameVi: 'Cư Dân Lão Thành',
        nameEn: 'Senior Residents & Traditionalists',
        coreValues: 'Trật tự, tình làng nghĩa xóm, phong tục chuẩn mực, sự yên bình',
        mediaSkepticism: 50,
        affinity: { youth: -15, elders: 75, intellect: 30, commuters: 45, activists: -25 },
        sentiment: 15,
        currentConcerns: 'Mất mát giá trị truyền thống, tiếng ồn đô thị, sự vội vã thiếu lễ độ'
      },
      intellect: {
        id: 'intellect',
        nameVi: 'Giới Trí Thức & Chuyên Gia',
        nameEn: 'Intellectuals & Academics',
        coreValues: 'Sự thật khoa học, tính kiểm chứng, chiều sâu phân tích, tư duy phản biện',
        mediaSkepticism: 75,
        affinity: { youth: 35, elders: 25, intellect: 85, commuters: 20, activists: 40 },
        sentiment: 10,
        currentConcerns: 'Tin giả lan truyền, sự xói mòn của văn hóa đọc, định kiến bầy đàn'
      },
      commuters: {
        id: 'commuters',
        nameVi: 'Người Lao Động & Đi Lại',
        nameEn: 'Working Commuters & Pragmatists',
        coreValues: 'Kinh tế gia đình, sự thuận tiện giao thông, công việc thực tế hàng ngày',
        mediaSkepticism: 40,
        affinity: { youth: 10, elders: 40, intellect: 25, commuters: 70, activists: -10 },
        sentiment: 5,
        currentConcerns: 'Kẹt xe, bão giá, xung đột đường phố gây gián đoạn mưu sinh'
      },
      activists: {
        id: 'activists',
        nameVi: 'Nhóm Vận Động Cộng Đồng',
        nameEn: 'Civic Activists & Reformers',
        coreValues: 'Công bằng xã hội, bảo vệ môi trường, tương thân tương ái, tiếng nói yếu thế',
        mediaSkepticism: 45,
        affinity: { youth: 60, elders: -20, intellect: 45, commuters: -10, activists: 85 },
        sentiment: 15,
        currentConcerns: 'Sự thờ ơ của đám đông, bất công vô hình, thiếu không gian xanh'
      }
    };
  }

  public getGroups(): Record<SocialGroup, GroupProfile> {
    return { ...this.groups };
  }

  public getGroup(id: SocialGroup): GroupProfile {
    return this.groups[id];
  }

  /**
   * Modifies group sentiment based on published angle and credibility.
   */
  public reactToStory(groupReactions: Record<SocialGroup, 'support' | 'neutral' | 'oppose'>, virality: number): void {
    const keys = Object.keys(groupReactions) as SocialGroup[];
    keys.forEach(groupId => {
      const reaction = groupReactions[groupId];
      const grp = this.groups[groupId];
      if (!grp) return;

      const scale = virality / 100;
      if (reaction === 'support') {
        grp.sentiment = Math.max(-100, Math.min(100, grp.sentiment + 12 * scale));
      } else if (reaction === 'oppose') {
        grp.sentiment = Math.max(-100, Math.min(100, grp.sentiment - 14 * scale));
      }
    });
  }

  /**
   * Adjusts interpersonal affinity between two specific characters.
   */
  public adjustInterpersonal(charAId: string, charBId: string, delta: number): void {
    if (!this.characterAffinities.has(charAId)) {
      this.characterAffinities.set(charAId, new Map());
    }
    const mapA = this.characterAffinities.get(charAId)!;
    const current = mapA.get(charBId) ?? 0;
    const updated = Math.max(-100, Math.min(100, current + delta));
    mapA.set(charBId, updated);

    // Mutual mirror
    if (!this.characterAffinities.has(charBId)) {
      this.characterAffinities.set(charBId, new Map());
    }
    this.characterAffinities.get(charBId)!.set(charAId, updated);
  }

  public getInterpersonal(charAId: string, charBId: string): number {
    return this.characterAffinities.get(charAId)?.get(charBId) ?? 0;
  }
}
