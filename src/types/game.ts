// Core Game Types for ECHOES OF THE CROWD (Vọng Âm Đám Đông)

export type SocialGroup = 
  | 'youth'        // Giới Trẻ & Sáng Tạo
  | 'elders'       // Cư Dân Lão Thành
  | 'intellect'    // Trí Thức & Chuyên Gia
  | 'commuters'    // Người Lao Động & Đi Lại
  | 'activists';   // Vận Động & Ý Thức Xã Hội

export type CharacterArchetype =
  | 'linh_student'       // Sinh viên báo chí tò mò
  | 'nam_busker'         // Nhạc sĩ đường phố hòa đồng
  | 'ba_cafe_elder'      // Chủ quán cà phê lão thành
  | 'quynh_influencer'   // Người sáng tạo nội dung thời thượng
  | 'hoang_activist'     // Nhà vận động nhiệt huyết
  | 'mai_volunteer'      // Bác sĩ tình nguyện đồng cảm
  | 'phong_engineer'     // Kỹ sư văn phòng hoài nghi
  | 'child_an'           // Trẻ thơ ngây thơ
  | 'town_resident';     // Cư dân đô thị đa dạng

export type CharacterState = 
  | 'idle'
  | 'wandering'
  | 'chatting'
  | 'debating'
  | 'helping'
  | 'arguing'
  | 'reading_news'
  | 'fleeing'
  | 'celebrating'
  | 'staring_at_camera'
  | 'dancing'
  | 'in_love'
  | 'tripping'
  | 'protesting'
  | 'jogging'
  | 'feeding_birds'
  | 'taking_selfie'
  | 'pointing_sky';

export type EmotionType = 
  | 'happy' 
  | 'neutral' 
  | 'worried' 
  | 'angry' 
  | 'surprised' 
  | 'empathetic' 
  | 'skeptical';

export interface SocialMetricsState {
  trust: number;            // 0 - 100: Mức độ tin tưởng cộng đồng
  tension: number;          // 0 - 100: Mức độ căng thẳng xã hội
  empathy: number;          // 0 - 100: Sự thấu cảm giữa các cá nhân
  polarization: number;     // 0 - 100: Độ phân cực giữa các nhóm
  curiosity: number;        // 0 - 100: Tinh thần tò mò, khám phá sự thật
  cooperation: number;      // 0 - 100: Khả năng hợp tác cộng đồng
  mediaInfluence: number;   // 0 - 100: Ảnh hưởng của truyền thông
  socialStability: number;  // 0 - 100: Độ ổn định trật tự đô thị
}

export type EditorialAngle = 
  | 'factual'       // Trung thực & Đầy đủ
  | 'sensational'   // Giật gân & Thu hút chú ý
  | 'bridging'      // Kết nối & Thấu cảm
  | 'alarmist'      // Cảnh báo gay gắt / Chia rẽ
  | 'inquisitive';  // Đặt câu hỏi / Châm biếm gợi mở

export interface HeadlineOption {
  id: string;
  angle: EditorialAngle;
  title: string;
  subtitle: string;
  biasDescription: string;
  metricImpact: Partial<SocialMetricsState>;
  groupReactions: Record<SocialGroup, 'support' | 'neutral' | 'oppose'>;
  viralityBonus: number; // 0.8 - 2.0
}

export interface GameEventDefinition {
  id: string;
  category: 'positive' | 'neutral' | 'negative' | 'critical';
  title: string;
  description: string;
  durationSeconds: number;
  location: string;
  minTension?: number;
  maxTension?: number;
  minPolarization?: number;
  chapterRequired?: number;
  requiredParticipants: number;
  headlineOptions: HeadlineOption[];
  onTriggerDialogue: string[];
}

export interface ActiveGameEvent {
  instanceId: string;
  definition: GameEventDefinition;
  startTime: number;
  endTime: number;
  participantIds: string[];
  worldX: number;
  worldY: number;
  radius: number;
  resolved: boolean;
  captured: boolean;
}

export interface CapturedPhoto {
  id: string;
  timestamp: number;
  gameTimeStr: string;
  chapterIndex: number;
  eventInstanceId?: string;
  eventDefId?: string;
  eventTitle: string;
  locationName: string;
  charactersInFrame: string[];
  framingScore: number; // 0 - 100 based on composition and centering
  imageDataUrl: string; // Captured low-res canvas snapshot
  generatedHeadlines?: HeadlineOption[];
  selectedHeadline?: HeadlineOption;
  published: boolean;
  publishedAt?: number;
  reachCount?: number;
  likes?: number;
  shares?: number;
  publicReactionSummary?: string;
}

export interface ChapterObjective {
  id: string;
  description: string;
  isComplete: boolean;
  requiredCount: number;
  currentCount: number;
}

export interface ChapterData {
  index: number;
  code: string;
  title: string;
  subTitle: string;
  introNarrative: string;
  objectives: ChapterObjective[];
  unlockThreshold: {
    publishedPhotos: number;
  };
  narrativeHint: string;
}

export type EndingType = 
  | 'united_harmony'     // 1. Bản Hòa Âm Đồng Điệu (High Empathy & Trust)
  | 'divided_chambers'   // 2. Thành Phố Phân Cực (High Polarization & Tension)
  | 'spectacle_circus'   // 3. Cơn Cuồng Loạn Chú Ý (High Sensationalism & Media Influence)
  | 'apathetic_silence'  // 4. Sự Im Lặng U Ám (Low Trust & Low Curiosity)
  | 'mindful_bridge'     // 5. Cầu Nối Chữa Lành (Balanced Truth & Critical Inquiry)
  | 'fragile_horizon';   // 6. Chân Trời Khởi Sắc Bất Định (Emergent Dynamic Balance)

export interface EndingResult {
  type: EndingType;
  title: string;
  epigraph: string;
  summary: string;
  societalVerdict: string;
  keyStatistics: {
    totalPhotosTaken: number;
    totalPublished: number;
    mostFrequentAngle: EditorialAngle;
    dominantGroupSentiment: string;
    finalStabilityScore: number;
  };
  reflectionText: string;
}

export interface GameSettings {
  language: 'vi' | 'en';
  masterVolume: number;    // 0 - 1
  sfxVolume: number;       // 0 - 1
  musicVolume: number;     // 0 - 1
  ambientVolume: number;   // 0 - 1
  reducedMotion: boolean;
  highContrast: boolean;
  cameraSensitivity: number; // 0.5 - 2.0
  autoSaveIntervalSec: number;
}
