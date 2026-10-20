// Event Engine for ECHOES OF THE CROWD
// Manages dynamic spontaneous street events, participant choreography, and camera viewfinder detection.

import { ActiveGameEvent, GameEventDefinition } from '../types/game';
import { Character } from '../entities/Character';
import { CityWorld } from '../entities/CityWorld';

export class EventSystem {
  private eventCatalog: GameEventDefinition[] = [];
  private activeEvents: Map<string, ActiveGameEvent> = new Map();
  private eventCooldownTimer: number = 0;
  private lastCapturedEventDefId: string | null = null;

  constructor() {
    this.initCatalog();
  }

  private initCatalog(): void {
    this.eventCatalog = [
      // 1. Positive: Street Busker brings spontaneous harmony
      {
        id: 'busker_concert',
        category: 'positive',
        title: 'Giai Điệu Phố Thị',
        description: 'Nhạc sĩ đường phố gảy đàn ghi-ta, đám đông dừng bước mỉm cười và nhịp chân theo điệu nhạc.',
        durationSeconds: 22,
        location: 'Quảng Trường Ánh Sáng',
        chapterRequired: 1,
        requiredParticipants: 2,
        onTriggerDialogue: ['Nghe bản nhạc này thấy lòng nhẹ tênh!', 'Giai điệu quen thuộc quá...', 'Cùng vỗ tay nào!'],
        headlineOptions: [
          {
            id: 'busker_factual',
            angle: 'factual',
            title: 'Âm nhạc đường phố sưởi ấm quảng trường trung tâm',
            subtitle: 'Người dân dừng bước tận hưởng bản nhạc ngẫu hứng giữa buổi sáng thanh bình.',
            biasDescription: 'Đưa tin chính xác, khách quan về khoảnh khắc nghệ thuật thường nhật.',
            metricImpact: { trust: 4, empathy: 6, tension: -4, socialStability: 3 },
            groupReactions: { youth: 'support', elders: 'support', intellect: 'neutral', commuters: 'support', activists: 'support' },
            viralityBonus: 1.1
          },
          {
            id: 'busker_bridging',
            angle: 'bridging',
            title: 'Khi những nốt nhạc xóa nhòa khoảng cách thế hệ',
            subtitle: 'Từ người già đến người trẻ cùng đứng chung dưới bóng cây, sẻ chia một nụ cười.',
            biasDescription: 'Tập trung vào tính gắn kết cộng đồng và lòng trắc ẩn.',
            metricImpact: { empathy: 12, cooperation: 8, polarization: -6, tension: -6 },
            groupReactions: { youth: 'support', elders: 'support', intellect: 'support', commuters: 'support', activists: 'support' },
            viralityBonus: 1.35
          },
          {
            id: 'busker_sensational',
            angle: 'sensational',
            title: 'Gây tắc nghẽn quảng trường: Biểu diễn tự phát có đang vượt tầm kiểm soát?',
            subtitle: 'Đám đông tụ tập đông đảo khiến việc lưu thông bị chậm trễ cục bộ.',
            biasDescription: 'Khai thác khía cạnh bất tiện giao thông để kích thích tranh luận tiêu cực.',
            metricImpact: { tension: 8, polarization: 6, trust: -4 },
            groupReactions: { youth: 'oppose', elders: 'support', intellect: 'oppose', commuters: 'support', activists: 'oppose' },
            viralityBonus: 1.6
          },
          {
            id: 'busker_inquisitive',
            angle: 'inquisitive',
            title: 'Khoảng lặng quý giá hay chỉ là giây phút thoát ly thực tại?',
            subtitle: 'Liệu thành phố có đang thiếu những không gian nghệ thuật công cộng thực thụ?',
            biasDescription: 'Gợi mở suy ngẫm sâu sắc về chất lượng sống đô thị.',
            metricImpact: { curiosity: 10, mediaInfluence: 5 },
            groupReactions: { youth: 'support', elders: 'neutral', intellect: 'support', commuters: 'neutral', activists: 'support' },
            viralityBonus: 1.2
          }
        ]
      },

      // 2. Positive: Kind act - Picking up fallen groceries & umbrella share
      {
        id: 'kindness_umbrella',
        category: 'positive',
        title: 'Cử Chỉ Sẻ Chia',
        description: 'Một người qua đường vội nhặt giúp túi đồ bị rơi và nhường ô che nắng cho người cao tuổi.',
        durationSeconds: 20,
        location: 'Trạm Trung Chuyển Xe Tuyến',
        chapterRequired: 1,
        requiredParticipants: 2,
        onTriggerDialogue: ['Bác có sao không ạ? Để cháu nhặt giúp!', 'Cảm ơn cháu nhiều nhé!', 'Thật ấm lòng.'],
        headlineOptions: [
          {
            id: 'kindness_factual',
            angle: 'factual',
            title: 'Hành động đẹp tại trạm xe bus: Giúp đỡ người lớn tuổi',
            subtitle: 'Khoảnh khắc tử tế bình dị được ghi nhận trong giờ cao điểm.',
            biasDescription: 'Ghi lại trung thực hành vi văn minh đô thị.',
            metricImpact: { trust: 6, empathy: 7, socialStability: 5 },
            groupReactions: { youth: 'support', elders: 'support', intellect: 'support', commuters: 'support', activists: 'support' },
            viralityBonus: 1.15
          },
          {
            id: 'kindness_bridging',
            angle: 'bridging',
            title: 'Lòng trắc ẩn vẫn luôn hiện diện giữa nhịp sống vội vã',
            subtitle: 'Chỉ cần một cử chỉ quan tâm nhỏ cũng đủ làm bừng sáng cả ngày dài.',
            biasDescription: 'Tôn vinh sự đồng cảm giữa những người xa lạ.',
            metricImpact: { empathy: 14, trust: 8, cooperation: 7, tension: -8 },
            groupReactions: { youth: 'support', elders: 'support', intellect: 'support', commuters: 'support', activists: 'support' },
            viralityBonus: 1.4
          },
          {
            id: 'kindness_alarmist',
            angle: 'alarmist',
            title: 'Sơ hở trên đường phố: Nguy cơ tiềm ẩn từ những cuộc tiếp xúc bất ngờ?',
            subtitle: 'Chuyên gia khuyến cáo người dân cần luôn nâng cao cảnh giác nơi đông người.',
            biasDescription: 'Bẻ cong một hành động nhân ái thành nỗi sợ hãi và nghi kỵ lẫn nhau.',
            metricImpact: { tension: 12, trust: -10, polarization: 8 },
            groupReactions: { youth: 'oppose', elders: 'support', intellect: 'oppose', commuters: 'oppose', activists: 'oppose' },
            viralityBonus: 1.55
          }
        ]
      },

      // 3. Neutral: Intellectual cafe debate on urban future & tech
      {
        id: 'cafe_debate',
        category: 'neutral',
        title: 'Tranh Luận Bên Ly Cà Phê',
        description: 'Hai trí thức trẻ và một vị bô lão tranh luận say mê về ảnh hưởng của mạng xã hội.',
        durationSeconds: 24,
        location: "Quán Cà Phê L'Aura",
        chapterRequired: 2,
        requiredParticipants: 2,
        onTriggerDialogue: ['Thuật toán đang cô lập chúng ta!', 'Nhưng nó mở ra cơ hội bình đẳng mà?', 'Hãy nhìn vào bản chất con người.'],
        headlineOptions: [
          {
            id: 'debate_factual',
            angle: 'factual',
            title: 'Góc nhìn đa chiều về kỷ nguyên thông tin tại quán cà phê phố cổ',
            subtitle: 'Cuộc đối thoại trí tuệ giữa các thế hệ về tương lai văn hóa số.',
            biasDescription: 'Trình bày cân bằng các luận điểm đối lập một cách khách quan.',
            metricImpact: { curiosity: 8, trust: 4, socialStability: 3 },
            groupReactions: { youth: 'support', elders: 'support', intellect: 'support', commuters: 'neutral', activists: 'support' },
            viralityBonus: 1.2
          },
          {
            id: 'debate_sensational',
            angle: 'sensational',
            title: 'Khẩu chiến nảy lửa: Giới trẻ và bô lão không còn tiếng nói chung!',
            subtitle: 'Bất đồng sâu sắc khiến không khí tại quán cà phê trở nên căng như dây đàn.',
            biasDescription: 'Cường điệu hóa sự bất đồng học thuật thành cuộc xung đột thế hệ kịch liệt.',
            metricImpact: { tension: 10, polarization: 12, trust: -6 },
            groupReactions: { youth: 'neutral', elders: 'neutral', intellect: 'oppose', commuters: 'support', activists: 'support' },
            viralityBonus: 1.7
          },
          {
            id: 'debate_inquisitive',
            angle: 'inquisitive',
            title: 'Chúng ta đang đối thoại hay chỉ cố bảo vệ thành kiến của chính mình?',
            subtitle: 'Khi mọi người nói nhiều hơn lắng nghe, điều gì sẽ xảy ra với sự đồng thuận xã hội?',
            biasDescription: 'Chất vấn sâu sắc bản chất của giao tiếp hiện đại.',
            metricImpact: { curiosity: 14, empathy: 6, mediaInfluence: 8 },
            groupReactions: { youth: 'support', elders: 'support', intellect: 'support', commuters: 'neutral', activists: 'support' },
            viralityBonus: 1.35
          }
        ]
      },

      // 4. Negative: Accidental bump turned into altercation
      {
        id: 'accidental_altercation',
        category: 'negative',
        title: 'Va Chạm Nơi Công Cộng',
        description: 'Hai người vô tình va quẹt khi sang đường, lời qua tiếng lại gây xôn xao cả góc phố.',
        durationSeconds: 20,
        location: 'Khu Dân Cư Phố Cổ',
        chapterRequired: 2,
        requiredParticipants: 2,
        onTriggerDialogue: ['Đi đứng kiểu gì vậy hả?!', 'Tôi xin lỗi nhưng anh không nhìn đường trước!', 'Bình tĩnh lại đi hai anh ơi!'],
        headlineOptions: [
          {
            id: 'altercation_factual',
            angle: 'factual',
            title: 'Xô xát nhỏ trên phố: Bài học về sự kiềm chế khi tham gia giao thông',
            subtitle: 'Sự cố va quẹt nhanh chóng được giải tỏa sau khi người dân can ngăn.',
            biasDescription: 'Báo cáo trung thực, giảm nhẹ căng thẳng bằng giải pháp hòa giải.',
            metricImpact: { trust: 2, tension: 2, socialStability: 1 },
            groupReactions: { youth: 'neutral', elders: 'support', intellect: 'support', commuters: 'support', activists: 'support' },
            viralityBonus: 1.1
          },
          {
            id: 'altercation_sensational',
            angle: 'sensational',
            title: 'BẠO LỰC ĐƯỜNG PHỐ BÙNG PHÁT: Văn hóa ứng xử chạm đáy cảnh báo đỏ!',
            subtitle: 'Người dân hoang mang trước sự hung hãn vô cớ diễn ra giữa thanh thiên bạch nhật.',
            biasDescription: 'Giật gân kịch phát, thổi bùng sự sợ hãi và phẫn nộ trong cộng đồng.',
            metricImpact: { tension: 16, polarization: 14, trust: -12, socialStability: -10 },
            groupReactions: { youth: 'support', elders: 'support', intellect: 'oppose', commuters: 'oppose', activists: 'support' },
            viralityBonus: 1.95
          },
          {
            id: 'altercation_bridging',
            angle: 'bridging',
            title: 'Áp lực mưu sinh và sự tha thứ: Chúng ta đều đang mang những gánh nặng riêng',
            subtitle: 'Sau những lời gắt gỏng, ai cũng cần một chút kiên nhẫn và thấu hiểu từ đối phương.',
            biasDescription: 'Chuyển hóa xung đột thành sự đồng cảm với áp lực cuộc sống.',
            metricImpact: { empathy: 12, tension: -6, cooperation: 5 },
            groupReactions: { youth: 'support', elders: 'support', intellect: 'support', commuters: 'support', activists: 'support' },
            viralityBonus: 1.25
          }
        ]
      },

      // 5. Negative: Rumor spreading about town water contamination
      {
        id: 'rumor_whisper',
        category: 'negative',
        title: 'Lời Đồn Lan Truyền',
        description: 'Một nhóm người xì xào bàn tán về thông tin nguồn nước ô nhiễm chưa qua kiểm chứng.',
        durationSeconds: 22,
        location: 'Trạm Trung Chuyển Xe Tuyến',
        chapterRequired: 3,
        requiredParticipants: 2,
        onTriggerDialogue: ['Nghe bảo nguồn nước có vấn đề đấy!', 'Thật không? Tôi thấy nước vẫn trong mà?', 'Đừng uống vội, nguy hiểm lắm!'],
        headlineOptions: [
          {
            id: 'rumor_factual',
            angle: 'factual',
            title: 'Kiểm chứng tin đồn: Cơ quan chức năng khẳng định nguồn nước an toàn',
            subtitle: 'Người dân được khuyến cáo không chia sẻ những thông tin vô căn cứ gây hoang mang.',
            biasDescription: 'Đính chính tin giả bằng số liệu và kết quả kiểm nghiệm thực tế.',
            metricImpact: { trust: 10, tension: -8, curiosity: 6, socialStability: 8 },
            groupReactions: { youth: 'neutral', elders: 'support', intellect: 'support', commuters: 'support', activists: 'neutral' },
            viralityBonus: 1.2
          },
          {
            id: 'rumor_alarmist',
            angle: 'alarmist',
            title: 'BÁO ĐỘNG ĐỎ: Bí mật ô nhiễm bị che giấu suốt nhiều tháng qua?!',
            subtitle: 'Hàng ngàn hộ dân đứng trước nguy cơ sức khỏe khi cơ quan quản lý im lặng.',
            biasDescription: 'Kích động thuyết âm mưu, triệt tiêu niềm tin vào thể chế công cộng.',
            metricImpact: { tension: 18, trust: -16, polarization: 15, socialStability: -15 },
            groupReactions: { youth: 'support', elders: 'support', intellect: 'oppose', commuters: 'support', activists: 'support' },
            viralityBonus: 2.1
          },
          {
            id: 'rumor_inquisitive',
            angle: 'inquisitive',
            title: 'Tại sao những nỗi sợ vô căn cứ lại dễ dàng thao túng tâm lý chúng ta?',
            subtitle: 'Giải mã cơ chế lan truyền của tin đồn trong một xã hội thiếu vắng sự minh bạch.',
            biasDescription: 'Phân tích tâm lý học truyền thông về lý do tin giả phát triển.',
            metricImpact: { curiosity: 15, trust: 4 },
            groupReactions: { youth: 'support', elders: 'neutral', intellect: 'support', commuters: 'neutral', activists: 'support' },
            viralityBonus: 1.4
          }
        ]
      },

      // 6. Escalating / Climax: Community Demonstration & Solidarity March
      {
        id: 'solidarity_march',
        category: 'critical',
        title: 'Cuộc Tuần Hành Nguyện Vọng',
        description: 'Đông đảo người dân mang biểu ngữ ôn hòa đòi quyền lợi không gian xanh và minh bạch thông tin.',
        durationSeconds: 28,
        location: 'Tháp Màn Hình Tin Tức',
        chapterRequired: 4,
        requiredParticipants: 3,
        onTriggerDialogue: ['Chúng tôi cần sự thật!', 'Vì tương lai con em chúng ta!', 'Hãy lắng nghe tiếng nói cộng đồng!'],
        headlineOptions: [
          {
            id: 'march_factual',
            angle: 'factual',
            title: 'Người dân tuần hành ôn hòa bày tỏ nguyện vọng xây dựng thành phố',
            subtitle: 'Sự kiện diễn ra trong trật tự, đối thoại cởi mở giữa đại diện các bên.',
            biasDescription: 'Phản ánh chính xác tinh thần công dân và yêu cầu chính đáng.',
            metricImpact: { trust: 8, cooperation: 10, socialStability: 6 },
            groupReactions: { youth: 'support', elders: 'support', intellect: 'support', commuters: 'support', activists: 'support' },
            viralityBonus: 1.3
          },
          {
            id: 'march_alarmist',
            angle: 'alarmist',
            title: 'HỖN LOẠN BAO TRÙM THỊ CHÍNH: Nhóm quá khích đe dọa an ninh trật tự!',
            subtitle: 'Cảnh tượng tụ tập đông người bị coi là mối đe dọa nghiêm trọng tới sự yên ổn.',
            biasDescription: 'Bôi nhọ cuộc tuần hành ôn hòa thành bạo loạn gây chia rẽ sâu sắc.',
            metricImpact: { polarization: 22, tension: 20, trust: -15, socialStability: -18 },
            groupReactions: { youth: 'oppose', elders: 'support', intellect: 'oppose', commuters: 'oppose', activists: 'oppose' },
            viralityBonus: 2.2
          },
          {
            id: 'march_bridging',
            angle: 'bridging',
            title: 'Bức tranh đoàn kết: Khi mọi tầng lớp tìm thấy mẫu số chung vì ngày mai',
            subtitle: 'Không phân biệt tuổi tác hay nghề nghiệp, tất cả cùng hướng về một mái nhà chung.',
            biasDescription: 'Tôn vinh sức mạnh gắn kết của lương tri và tinh thần tương trợ.',
            metricImpact: { empathy: 18, cooperation: 16, polarization: -14, trust: 12 },
            groupReactions: { youth: 'support', elders: 'support', intellect: 'support', commuters: 'support', activists: 'support' },
            viralityBonus: 1.5
          }
        ]
      }
    ];
  }

  public update(
    dt: number,
    characters: Character[],
    world: CityWorld,
    currentChapter: number,
    tension: number
  ): void {
    this.eventCooldownTimer -= dt;

    // 1. Update active events & trigger participant choreography
    const now = Date.now();
    for (const [id, ev] of this.activeEvents.entries()) {
      if (now >= ev.endTime) {
        // Resolve event
        ev.resolved = true;
        this.activeEvents.delete(id);
      } else {
        // Steer assigned characters toward the event center
        ev.participantIds.forEach((charId, idx) => {
          const char = characters.find(c => c.id === charId);
          if (char) {
            const targetX = ev.worldX + (idx === 0 ? -25 : idx === 1 ? 25 : 0);
            char.targetX = targetX;
            char.state = ev.definition.category === 'negative' ? 'arguing' : 'chatting';
            char.facing = char.x < ev.worldX ? 'right' : 'left';
            if (!char.currentSpeechBubble && Math.random() < 0.05) {
              char.sayRandom(ev.definition.onTriggerDialogue, 3);
            }
          }
        });
      }
    }

    // 2. Spawn a new event if under limit and cooldown elapsed
    if (this.activeEvents.size < 2 && this.eventCooldownTimer <= 0) {
      this.trySpawnEvent(characters, world, currentChapter, tension);
    }
  }

  private trySpawnEvent(
    characters: Character[],
    world: CityWorld,
    currentChapter: number,
    tension: number
  ): void {
    const candidates = this.eventCatalog.filter(def => {
      if (def.chapterRequired && def.chapterRequired > currentChapter) return false;
      if (def.id === this.lastCapturedEventDefId) return false;
      // High tension favors negative events; low tension favors positive
      if (tension > 60 && def.category === 'positive' && Math.random() < 0.4) return false;
      if (tension < 30 && def.category === 'negative' && Math.random() < 0.4) return false;
      return true;
    });

    if (candidates.length === 0) return;
    const def = candidates[Math.floor(Math.random() * candidates.length)];

    // Find zone
    const targetZone = world.zones.find(z => z.nameVi.includes(def.location) || z.nameEn.includes(def.location)) || world.zones[2];
    const eventX = targetZone.centerX + (Math.random() * 80 - 40);

    // Find closest free characters
    const available = characters.filter(c => c.state !== 'arguing' && c.state !== 'reading_news');
    if (available.length < def.requiredParticipants) return;

    available.sort((a, b) => Math.abs(a.x - eventX) - Math.abs(b.x - eventX));
    const participants = available.slice(0, def.requiredParticipants).map(c => c.id);

    const instanceId = 'ev_' + Date.now();
    const activeEvent: ActiveGameEvent = {
      instanceId,
      definition: def,
      startTime: Date.now(),
      endTime: Date.now() + def.durationSeconds * 1000,
      participantIds: participants,
      worldX: eventX,
      worldY: world.groundY,
      radius: 90,
      resolved: false,
      captured: false
    };

    this.activeEvents.set(instanceId, activeEvent);
    this.eventCooldownTimer = 10 + Math.random() * 8;
  }

  /**
   * Evaluates what is inside the camera viewfinder frame.
   * Viewfinder rect: [frameX, frameY, frameW, frameH] in world space.
   */
  public evaluateViewfinder(
    frameX: number,
    frameY: number,
    frameW: number,
    frameH: number,
    characters: Character[]
  ): {
    hasNotableEvent: boolean;
    activeEvent: ActiveGameEvent | null;
    charactersInFrame: Character[];
    framingScore: number;
  } {
    const frameRight = frameX + frameW;
    const frameBottom = frameY + frameH;
    const frameCenterX = frameX + frameW / 2;

    // Detect characters whose visual boundary overlaps
    const inFrame = characters.filter(c => {
      const charLeft = c.x - 20;
      const charRight = c.x + 20;
      const charTop = c.y - 65;
      const charBottom = c.y + 10;
      return (
        charRight >= frameX &&
        charLeft <= frameRight &&
        charBottom >= frameY &&
        charTop <= frameBottom
      );
    });

    // Detect active events inside frame
    let matchedEvent: ActiveGameEvent | null = null;
    for (const ev of this.activeEvents.values()) {
      if (Math.abs(ev.worldX - frameCenterX) < (frameW / 2 + ev.radius * 0.5)) {
        matchedEvent = ev;
        break;
      }
    }

    let framingScore = 40; // baseline
    if (inFrame.length > 0) {
      // Calculate centering score
      const avgCharX = inFrame.reduce((sum, c) => sum + c.x, 0) / inFrame.length;
      const distFromCenter = Math.abs(avgCharX - frameCenterX);
      const centerFactor = Math.max(0, 1 - distFromCenter / (frameW / 2));
      framingScore = Math.round(50 + centerFactor * 45);
      if (matchedEvent) {
        framingScore = Math.min(100, framingScore + 10);
      }
    }

    return {
      hasNotableEvent: matchedEvent !== null || inFrame.length >= 2,
      activeEvent: matchedEvent,
      charactersInFrame: inFrame,
      framingScore
    };
  }

  public markCaptured(eventInstanceId: string, eventDefId?: string): void {
    if (this.activeEvents.has(eventInstanceId)) {
      this.activeEvents.get(eventInstanceId)!.captured = true;
    }
    if (eventDefId) {
      this.lastCapturedEventDefId = eventDefId;
    }
  }

  public getActiveEvents(): ActiveGameEvent[] {
    return Array.from(this.activeEvents.values());
  }

  public getCatalog(): GameEventDefinition[] {
    return [...this.eventCatalog];
  }
}
