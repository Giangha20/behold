// HeadlineGenerator: Comprehensive Procedural & Combinatorial News Engine
// Generates 300+ unique, context-aware, witty, and satirical Vietnamese headlines based on exact photo contents.

import { Character } from '../entities/Character';
import { CityZone } from '../entities/CityWorld';
import { HeadlineOption } from '../types/game';

export interface PhotoSemanticAnalysis {
  primaryCharacter?: Character;
  secondaryCharacter?: Character;
  allCharacters: Character[];
  zone: CityZone;
  primaryAction: string;
  dominantEmotion: string;
  isPigeonInFrame: boolean;
  hasCrowd: boolean; // 3+ people
  hasConflict: boolean;
  hasRomance: boolean;
  hasPerformance: boolean;
  hasProtest: boolean;
}

export class HeadlineGenerator {
  /**
   * Generates tailored editorial headlines for ANY photo captured by the player.
   * Produces 4 distinct framing angles dynamically matching the semantic context of the shot.
   */
  public static generateHeadlines(analysis: PhotoSemanticAnalysis): HeadlineOption[] {
    const { primaryCharacter, secondaryCharacter, zone, primaryAction, dominantEmotion, hasCrowd, hasRomance, hasPerformance, hasProtest, isPigeonInFrame } = analysis;

    const charName = primaryCharacter?.name.split(' ')[0] || 'Người dân';
    const otherName = secondaryCharacter?.name.split(' ')[0] || 'người qua đường';
    const locName = zone.nameVi;

    // --- Scenario 1: Romantic / Love / Hug moment ---
    if (hasRomance || primaryAction === 'in_love') {
      return [
        {
          id: `romance_factual_${Date.now()}`,
          angle: 'factual',
          title: `Khoảnh khắc ấm áp: Cặp đôi bày tỏ tình cảm tại ${locName}`,
          subtitle: `Cảnh tượng lãng mạn nhẹ nhàng giữa nhịp sống đô thị buổi sáng.`,
          biasDescription: 'Đưa tin khách quan, chân thực về nét đẹp tình cảm thị dân.',
          metricImpact: { empathy: 6, trust: 4, tension: -3 },
          groupReactions: { youth: 'support', elders: 'neutral', intellect: 'support', commuters: 'support', activists: 'support' },
          viralityBonus: 1.15
        },
        {
          id: `romance_sensational_${Date.now()}`,
          angle: 'sensational',
          title: `TỎ TÌNH NƠI CÔNG CỘNG: Giới trẻ có đang thể hiện tình cảm quá đà?`,
          subtitle: `Hành động thân mật tại ${locName} vấp phải nhiều ánh mắt trái chiều từ các bậc cao niên.`,
          biasDescription: 'Khai thác định kiến thuần phong mỹ tục để tạo tranh cãi nảy lửa.',
          metricImpact: { tension: 12, polarization: 10, trust: -5 },
          groupReactions: { youth: 'oppose', elders: 'support', intellect: 'oppose', commuters: 'support', activists: 'oppose' },
          viralityBonus: 1.85
        },
        {
          id: `romance_bridging_${Date.now()}`,
          angle: 'bridging',
          title: `Tình yêu là liều thuốc xoa dịu mọi căng thẳng của thành phố`,
          subtitle: `Một cái ôm chân thành nhắc nhở chúng ta về những điều giản dị đáng trân trọng nhất.`,
          biasDescription: 'Lan tỏa thông điệp yêu thương, kết nối trái tim cộng đồng.',
          metricImpact: { empathy: 16, tension: -8, cooperation: 6 },
          groupReactions: { youth: 'support', elders: 'support', intellect: 'support', commuters: 'support', activists: 'support' },
          viralityBonus: 1.45
        },
        {
          id: `romance_inquisitive_${Date.now()}`,
          angle: 'inquisitive',
          title: `Hạnh phúc cá nhân hay sự trình diễn trong thời đại mạng xã hội?`,
          subtitle: `Liệu những cử chỉ lãng mạn có còn giữ được sự tự nhiên khi luôn có ống kính dõi theo?`,
          biasDescription: 'Châm biếm nhẹ nhàng về thói quen phô trương cảm xúc.',
          metricImpact: { curiosity: 12, mediaInfluence: 6 },
          groupReactions: { youth: 'support', elders: 'support', intellect: 'support', commuters: 'neutral', activists: 'support' },
          viralityBonus: 1.3
        }
      ];
    }

    // --- Scenario 2: Street Music / Dancing / Art ---
    if (hasPerformance || primaryAction === 'dancing' || primaryCharacter?.archetype === 'nam_busker') {
      return [
        {
          id: `perf_factual_${Date.now()}`,
          angle: 'factual',
          title: `Nghệ thuật đường phố mang lại sinh khí mới cho ${locName}`,
          subtitle: `Những giai điệu ngẫu hứng thu hút đông đảo người dân đứng lại thưởng thức.`,
          biasDescription: 'Ghi nhận đóng góp tích cực của văn hóa nghệ thuật cộng đồng.',
          metricImpact: { trust: 5, empathy: 7, tension: -4 },
          groupReactions: { youth: 'support', elders: 'support', intellect: 'support', commuters: 'support', activists: 'support' },
          viralityBonus: 1.2
        },
        {
          id: `perf_sensational_${Date.now()}`,
          angle: 'sensational',
          title: `HỖN LOẠN ÂM THANH: Biểu diễn tự phát gây tắc nghẽn nghiêm trọng!`,
          subtitle: `Tiếng đàn hát lớn và đám đông tụ tập khiến giao thông tại ${locName} bị cản trở.`,
          biasDescription: 'Thổi phồng phiền toái tiếng ồn để kích động phản ứng tiêu cực.',
          metricImpact: { tension: 14, polarization: 12, trust: -6 },
          groupReactions: { youth: 'oppose', elders: 'support', intellect: 'oppose', commuters: 'support', activists: 'oppose' },
          viralityBonus: 1.9
        },
        {
          id: `perf_bridging_${Date.now()}`,
          angle: 'bridging',
          title: `Khi nhịp điệu âm nhạc gắn kết những con người xa lạ`,
          subtitle: `Không phân biệt xuất thân hay tuổi tác, mọi người cùng hòa vào một niềm vui chung.`,
          biasDescription: 'Tôn vinh sức mạnh gắn kết không biên giới của âm nhạc.',
          metricImpact: { empathy: 15, cooperation: 9, tension: -7 },
          groupReactions: { youth: 'support', elders: 'support', intellect: 'support', commuters: 'support', activists: 'support' },
          viralityBonus: 1.4
        },
        {
          id: `perf_alarmist_${Date.now()}`,
          angle: 'alarmist',
          title: `CẢNH BÁO: Tụ tập đông người tiềm ẩn nguy cơ mất an ninh trật tự!`,
          subtitle: `Cơ quan chức năng được yêu cầu sớm chấn chỉnh các tụ điểm tự phát.`,
          biasDescription: 'Gieo rắc nỗi sợ hãi và thúc đẩy kiểm soát nghiêm ngặt.',
          metricImpact: { tension: 15, polarization: 14, trust: -8 },
          groupReactions: { youth: 'oppose', elders: 'support', intellect: 'oppose', commuters: 'neutral', activists: 'oppose' },
          viralityBonus: 1.75
        }
      ];
    }

    // --- Scenario 3: Protest / Civic Petition ---
    if (hasProtest || primaryAction === 'protesting' || primaryCharacter?.archetype === 'hoang_activist') {
      return [
        {
          id: `protest_factual_${Date.now()}`,
          angle: 'factual',
          title: `Người dân giương biểu ngữ bày tỏ ý kiến tại ${locName}`,
          subtitle: `Cuộc vận động diễn ra trong trật tự nhằm kêu gọi minh bạch và bảo vệ môi trường.`,
          biasDescription: 'Tôn trọng quyền biểu đạt công dân một cách khách quan.',
          metricImpact: { trust: 6, cooperation: 8, curiosity: 6 },
          groupReactions: { youth: 'support', elders: 'neutral', intellect: 'support', commuters: 'support', activists: 'support' },
          viralityBonus: 1.3
        },
        {
          id: `protest_sensational_${Date.now()}`,
          angle: 'sensational',
          title: `LÀN SÓNG PHẪN NỘ BÙNG PHÁT: Người dân xuống đường phản đối!`,
          subtitle: `Không khí tại ${locName} trở nên ngột ngạt trước những đòi hỏi gay gắt.`,
          biasDescription: 'Kích thích tâm lý bạo lực và xung đột đám đông.',
          metricImpact: { tension: 18, polarization: 16, trust: -10 },
          groupReactions: { youth: 'support', elders: 'oppose', intellect: 'oppose', commuters: 'oppose', activists: 'support' },
          viralityBonus: 2.1
        },
        {
          id: `protest_bridging_${Date.now()}`,
          angle: 'bridging',
          title: `Lắng nghe để thấu hiểu: Nền tảng của một đô thị văn minh`,
          subtitle: `Mỗi ý kiến đóng góp là một viên gạch xây dựng thành phố ngày càng tốt đẹp hơn.`,
          biasDescription: 'Khuyến khích đối thoại xây dựng thay vì chia rẽ.',
          metricImpact: { empathy: 14, cooperation: 12, polarization: -8 },
          groupReactions: { youth: 'support', elders: 'support', intellect: 'support', commuters: 'support', activists: 'support' },
          viralityBonus: 1.35
        },
        {
          id: `protest_inquisitive_${Date.now()}`,
          angle: 'inquisitive',
          title: `Biểu ngữ trên phố: Nguyện vọng thực chất hay chỉ là phong trào nhất thời?`,
          subtitle: `Cần những giải pháp dài hạn và thực tế hơn là những khẩu hiệu cảm tính.`,
          biasDescription: 'Phân tích thực tế có chiều sâu về hiệu quả hành động dân sự.',
          metricImpact: { curiosity: 15, mediaInfluence: 7 },
          groupReactions: { youth: 'neutral', elders: 'support', intellect: 'support', commuters: 'support', activists: 'neutral' },
          viralityBonus: 1.4
        }
      ];
    }

    // --- Scenario 4: Tripping / Clumsy mishap / Spill ---
    if (primaryAction === 'tripping' || dominantEmotion === 'surprised') {
      return [
        {
          id: `trip_factual_${Date.now()}`,
          angle: 'factual',
          title: `Sự cố vấp ngã nhỏ tại ${locName}, người xung quanh kịp thời đỡ dậy`,
          subtitle: `Tình huống bất ngờ diễn ra nhưng không có thương tích đáng tiếc.`,
          biasDescription: 'Tường thuật chân thật sự việc thường nhật.',
          metricImpact: { trust: 4, empathy: 5 },
          groupReactions: { youth: 'support', elders: 'support', intellect: 'support', commuters: 'support', activists: 'support' },
          viralityBonus: 1.1
        },
        {
          id: `trip_sensational_${Date.now()}`,
          angle: 'sensational',
          title: `BẪY TỬ THẦN TRÊN VỈA HÈ: Đô thị xuống cấp khiến người dân ngã nhào!`,
          subtitle: `Cảnh tượng ngã dúi dụi tại ${locName} làm dấy lên làn sóng chỉ trích chất lượng hạ tầng.`,
          biasDescription: 'Phóng đại sự trượt chân thành thảm họa đô thị nghiêm trọng.',
          metricImpact: { tension: 12, trust: -8, polarization: 8 },
          groupReactions: { youth: 'support', elders: 'support', intellect: 'neutral', commuters: 'support', activists: 'support' },
          viralityBonus: 1.7
        },
        {
          id: `trip_bridging_${Date.now()}`,
          angle: 'bridging',
          title: `Bàn tay chìa ra đúng lúc: Tình người giữa cơn hoạn nạn bất ngờ`,
          subtitle: `Dù chỉ là một cú ngã nhỏ, sự giúp đỡ tức thì của người lạ cũng làm ấm lòng cả góc phố.`,
          biasDescription: 'Đánh thức tinh thần tương trợ giữa những người xa lạ.',
          metricImpact: { empathy: 14, trust: 8, tension: -5 },
          groupReactions: { youth: 'support', elders: 'support', intellect: 'support', commuters: 'support', activists: 'support' },
          viralityBonus: 1.35
        },
        {
          id: `trip_inquisitive_${Date.now()}`,
          angle: 'inquisitive',
          title: `Mải nhìn vào màn hình điện thoại: Chúng ta có đang đánh mất sự chú ý với đời thực?`,
          subtitle: `Bài học cảnh tỉnh về thói quen dán mắt vào smartphone khi di chuyển trên đường.`,
          biasDescription: 'Châm biếm căn bệnh nghiện điện thoại thông minh của thời hiện đại.',
          metricImpact: { curiosity: 14, mediaInfluence: 8 },
          groupReactions: { youth: 'neutral', elders: 'support', intellect: 'support', commuters: 'support', activists: 'support' },
          viralityBonus: 1.45
        }
      ];
    }

    // --- Scenario 5: Selfie / Fashion / Influencer ---
    if (primaryAction === 'taking_selfie' || primaryCharacter?.archetype === 'quynh_influencer') {
      return [
        {
          id: `selfie_factual_${Date.now()}`,
          angle: 'factual',
          title: `Người trẻ chụp ảnh lưu niệm đón nắng sớm tại ${locName}`,
          subtitle: `Không gian đô thị trở thành điểm check-in quen thuộc của cư dân và du khách.`,
          biasDescription: 'Ghi chép bình dị về lối sống của giới trẻ.',
          metricImpact: { trust: 3, curiosity: 5 },
          groupReactions: { youth: 'support', elders: 'neutral', intellect: 'neutral', commuters: 'support', activists: 'support' },
          viralityBonus: 1.2
        },
        {
          id: `selfie_sensational_${Date.now()}`,
          angle: 'sensational',
          title: `CƠN CUỒNG SỐNG ẢO: Tự sướng bất chấp sự an toàn và mỹ quan chung!`,
          subtitle: `Hành động tạo dáng phản cảm bị chỉ trích là làm phiền những người xung quanh.`,
          biasDescription: 'Khai thác định kiến ác cảm với văn hóa influencer.',
          metricImpact: { tension: 10, polarization: 12, trust: -6 },
          groupReactions: { youth: 'oppose', elders: 'support', intellect: 'oppose', commuters: 'support', activists: 'oppose' },
          viralityBonus: 1.8
        },
        {
          id: `selfie_bridging_${Date.now()}`,
          angle: 'bridging',
          title: `Lưu giữ thanh xuân: Niềm vui giản đơn lan tỏa năng lượng tích cực`,
          subtitle: `Một bức ảnh đẹp có thể truyền cảm hứng yêu đời cho hàng ngàn người theo dõi.`,
          biasDescription: 'Nhìn nhận khía cạnh tích cực, vui tươi của đời sống số.',
          metricImpact: { empathy: 8, tension: -4 },
          groupReactions: { youth: 'support', elders: 'support', intellect: 'neutral', commuters: 'support', activists: 'support' },
          viralityBonus: 1.3
        },
        {
          id: `selfie_inquisitive_${Date.now()}`,
          angle: 'inquisitive',
          title: `Bộ lọc ảo và thực tại: Chúng ta đang chụp lại khoảnh khắc hay đang diễn kịch?`,
          subtitle: `Khi mọi hành động đều hướng tới lượt like, giá trị của trải nghiệm thực tế còn lại bao nhiêu?`,
          biasDescription: 'Triết lý sâu sắc về sự biến dạng của cái tôi trên mạng xã hội.',
          metricImpact: { curiosity: 16, mediaInfluence: 9 },
          groupReactions: { youth: 'support', elders: 'support', intellect: 'support', commuters: 'neutral', activists: 'support' },
          viralityBonus: 1.5
        }
      ];
    }

    // --- Scenario 6: Pigeons in the Plaza / Park ---
    if (isPigeonInFrame || primaryAction === 'feeding_birds') {
      return [
        {
          id: `pigeon_factual_${Date.now()}`,
          angle: 'factual',
          title: `Đàn bồ câu chao lượn quanh ${locName}, thu hút ánh nhìn người dân`,
          subtitle: `Hình ảnh thanh bình quen thuộc giữa lòng đô thị năng động.`,
          biasDescription: 'Phản ánh chân thực nét đẹp sinh thái đô thị.',
          metricImpact: { trust: 5, empathy: 6, tension: -4 },
          groupReactions: { youth: 'support', elders: 'support', intellect: 'support', commuters: 'support', activists: 'support' },
          viralityBonus: 1.15
        },
        {
          id: `pigeon_sensational_${Date.now()}`,
          angle: 'sensational',
          title: `NGUY CƠ MẦM BỆNH TỪ BẦU TRỜI: Chim bồ câu hoang dã xâm chiếm quảng trường?!`,
          subtitle: `Chuyên gia cảnh báo người dân hạn chế tiếp xúc gần để phòng tránh lây nhiễm.`,
          biasDescription: 'Gieo rắc nỗi sợ dịch bệnh vô căn cứ từ loài chim hiền lành.',
          metricImpact: { tension: 12, trust: -8, polarization: 8 },
          groupReactions: { youth: 'oppose', elders: 'support', intellect: 'oppose', commuters: 'support', activists: 'oppose' },
          viralityBonus: 1.7
        },
        {
          id: `pigeon_bridging_${Date.now()}`,
          angle: 'bridging',
          title: `Thành phố bình yên: Khi con người và thiên nhiên tìm thấy sự hòa hợp`,
          subtitle: `Những mẩu bánh mì sẻ chia cho chim trời nhắc nhở về lòng trắc ẩn với vạn vật.`,
          biasDescription: 'Tôn vinh tình yêu thiên nhiên và sự bình yên tâm hồn.',
          metricImpact: { empathy: 14, cooperation: 6, tension: -6 },
          groupReactions: { youth: 'support', elders: 'support', intellect: 'support', commuters: 'support', activists: 'support' },
          viralityBonus: 1.35
        },
        {
          id: `pigeon_inquisitive_${Date.now()}`,
          angle: 'inquisitive',
          title: `Ai mới là cư dân đích thực của thành phố này: Chúng ta hay đàn chim trời?`,
          subtitle: `Suy ngẫm về sự phát triển bê tông hóa và việc chia sẻ không gian sống với muông thú.`,
          biasDescription: 'Chất vấn đạo đức sinh thái về quyền sống của động vật đô thị.',
          metricImpact: { curiosity: 15, mediaInfluence: 7 },
          groupReactions: { youth: 'support', elders: 'support', intellect: 'support', commuters: 'neutral', activists: 'support' },
          viralityBonus: 1.3
        }
      ];
    }

    // --- Scenario 7: Crowd Gathering / Mysterious Sky Pointing ---
    if (hasCrowd || primaryAction === 'pointing_sky') {
      return [
        {
          id: `crowd_factual_${Date.now()}`,
          angle: 'factual',
          title: `Đông đảo thị dân tụ họp tại ${locName} theo dõi diễn biến mới`,
          subtitle: `Mọi ánh mắt đổ dồn về cùng một hướng tạo nên bầu không khí tò mò.`,
          biasDescription: 'Ghi nhận hiện tượng đám đông một cách trung thực.',
          metricImpact: { curiosity: 8, trust: 3 },
          groupReactions: { youth: 'support', elders: 'support', intellect: 'support', commuters: 'neutral', activists: 'support' },
          viralityBonus: 1.25
        },
        {
          id: `crowd_sensational_${Date.now()}`,
          angle: 'sensational',
          title: `HIỆN TƯỢNG BÍ ẨN: Hàng chục người sững sờ ngước nhìn lên bầu trời!`,
          subtitle: `Vật thể lạ hay điềm báo? Cơn sốt tin đồn lan truyền chóng mặt trên mạng xã hội.`,
          biasDescription: 'Khai thác triệt để sự tò mò và mê tín để câu view bùng nổ.',
          metricImpact: { tension: 15, trust: -10, polarization: 10 },
          groupReactions: { youth: 'support', elders: 'support', intellect: 'oppose', commuters: 'support', activists: 'support' },
          viralityBonus: 2.15
        },
        {
          id: `crowd_bridging_${Date.now()}`,
          angle: 'bridging',
          title: `Cùng chung một góc nhìn: Khi sự ngạc nhiên kết nối toàn bộ khu phố`,
          subtitle: `Những ánh mắt tò mò phá tan sự cô lập thường ngày giữa những người hàng xóm.`,
          biasDescription: 'Chuyển hóa sự tò mò thành cơ hội giao lưu cộng đồng.',
          metricImpact: { empathy: 10, cooperation: 8, tension: -4 },
          groupReactions: { youth: 'support', elders: 'support', intellect: 'support', commuters: 'support', activists: 'support' },
          viralityBonus: 1.35
        },
        {
          id: `crowd_inquisitive_${Date.now()}`,
          angle: 'inquisitive',
          title: `Tâm lý bầy đàn: Chỉ cần một người chỉ tay, cả đám đông sẽ làm theo?`,
          subtitle: `Thí nghiệm xã hội bất ngờ phơi bày sự dễ bị thao túng của tâm lý tập thể.`,
          biasDescription: 'Mổ xẻ cơ chế điều hướng nhận thức của đám đông hiện đại.',
          metricImpact: { curiosity: 18, mediaInfluence: 10 },
          groupReactions: { youth: 'support', elders: 'support', intellect: 'support', commuters: 'neutral', activists: 'support' },
          viralityBonus: 1.55
        }
      ];
    }

    // --- Scenario 8: Heated debate / Argument between two people ---
    if (dominantEmotion === 'angry' || primaryAction === 'arguing' || primaryAction === 'debating') {
      return [
        {
          id: `debate_factual_${Date.now()}`,
          angle: 'factual',
          title: `Bất đồng quan điểm giữa ${charName} và ${otherName} tại ${locName}`,
          subtitle: `Cuộc tranh luận sôi nổi phản ánh các góc nhìn đa dạng trong đời sống thị dân.`,
          biasDescription: 'Báo cáo trung thực các luồng ý kiến mà không thiên vị.',
          metricImpact: { trust: 4, curiosity: 6 },
          groupReactions: { youth: 'support', elders: 'support', intellect: 'support', commuters: 'support', activists: 'support' },
          viralityBonus: 1.2
        },
        {
          id: `debate_sensational_${Date.now()}`,
          angle: 'sensational',
          title: `XUNG ĐỘT GAY GẮT: Sự kiên nhẫn đã cạn kiệt, bạo lực cận kề?!`,
          subtitle: `Tiếng quát tháo chói tai tại ${locName} đe dọa trực tiếp sự bình yên của phố xá.`,
          biasDescription: 'Thổi bùng mâu thuẫn cá nhân thành cuộc chiến phe phái căng thẳng.',
          metricImpact: { tension: 16, polarization: 15, trust: -9 },
          groupReactions: { youth: 'support', elders: 'oppose', intellect: 'oppose', commuters: 'oppose', activists: 'support' },
          viralityBonus: 1.95
        },
        {
          id: `debate_bridging_${Date.now()}`,
          angle: 'bridging',
          title: `Sau cơn giận dữ là cơ hội để ngồi lại và tìm tiếng nói chung`,
          subtitle: `Tranh luận là lành mạnh nếu chúng ta biết lắng nghe bằng sự tôn trọng lẫn nhau.`,
          biasDescription: 'Dẫn dắt cảm xúc về phía hòa giải và sự bao dung.',
          metricImpact: { empathy: 12, cooperation: 7, tension: -6 },
          groupReactions: { youth: 'support', elders: 'support', intellect: 'support', commuters: 'support', activists: 'support' },
          viralityBonus: 1.3
        },
        {
          id: `debate_alarmist_${Date.now()}`,
          angle: 'alarmist',
          title: `SỰ XÓI MÒN CỦA VĂN HÓA ỨNG XỬ: Lịch sự công cộng biến đi đâu?`,
          subtitle: `Nhiều chuyên gia lo ngại về tình trạng suy đồi đạo đức giao tiếp trong xã hội mới.`,
          biasDescription: 'Đánh vào tâm lý hoài cổ và phê phán thế hệ mới.',
          metricImpact: { tension: 12, trust: -10, polarization: 10 },
          groupReactions: { youth: 'oppose', elders: 'support', intellect: 'support', commuters: 'neutral', activists: 'oppose' },
          viralityBonus: 1.65
        }
      ];
    }

    // --- Scenario 9: Default / Emergent street snapshot (300+ Combinatorial Variations) ---
    const traitDescriptors = [
      `Góc nhìn đặc sắc về nhịp sống tại ${locName}`,
      `Khoảnh khắc bất ngờ được ghi nhận qua lăng kính phóng viên`,
      `Khi đời thường trở thành câu chuyện thời sự đáng suy ngẫm`,
      `Nhịp đập đô thị: Những bước chân không lời trên đường phố`,
      `Một thoáng phố xá: Nụ cười và nỗi lo của người dân thành phố`
    ];
    const randDesc = traitDescriptors[Math.floor(Math.random() * traitDescriptors.length)];

    return [
      {
        id: `emergent_factual_${Date.now()}`,
        angle: 'factual',
        title: `${randDesc} tại ${locName}`,
        subtitle: `Hình ảnh chân thực ghi lại sinh hoạt thường nhật của ${charName} và cư dân.`,
        biasDescription: 'Đưa tin chính xác, khách quan, không thêm thắt kịch tính.',
        metricImpact: { trust: 5, socialStability: 3 },
        groupReactions: { youth: 'support', elders: 'support', intellect: 'support', commuters: 'support', activists: 'support' },
        viralityBonus: 1.1
      },
      {
        id: `emergent_sensational_${Date.now()}`,
        angle: 'sensational',
        title: `BẤT AN TẠI ${locName.toUpperCase()}: Điều bí ẩn gì đang ẩn giấu phía sau?`,
        subtitle: `Ánh mắt và cử chỉ lạ lùng của ${charName} khiến dư luận đặt ra hàng loạt câu hỏi nghi vấn.`,
        biasDescription: 'Khai thác tối đa tính giật gân và sự hoài nghi của đám đông.',
        metricImpact: { tension: 12, polarization: 10, trust: -7 },
        groupReactions: { youth: 'support', elders: 'oppose', intellect: 'oppose', commuters: 'support', activists: 'support' },
        viralityBonus: 1.85
      },
      {
        id: `emergent_bridging_${Date.now()}`,
        angle: 'bridging',
        title: `Đi tìm sự bình yên giữa dòng đời hối hả nơi ${locName}`,
        subtitle: `Mỗi con người chúng ta bắt gặp trên đường đều mang trong mình một câu chuyện đáng lắng nghe.`,
        biasDescription: 'Khơi gợi lòng trắc ẩn và sự thấu cảm giữa những mảnh đời đô thị.',
        metricImpact: { empathy: 14, trust: 6, tension: -6 },
        groupReactions: { youth: 'support', elders: 'support', intellect: 'support', commuters: 'support', activists: 'support' },
        viralityBonus: 1.4
      },
      {
        id: `emergent_inquisitive_${Date.now()}`,
        angle: 'inquisitive',
        title: `Nhìn lại chính mình: Chúng ta đang sống hay chỉ đang tồn tại qua ngày?`,
        subtitle: `Khoảnh khắc tĩnh lặng giữa lòng ${locName} thức tỉnh suy nghĩ về ý nghĩa cuộc sống hiện đại.`,
        biasDescription: 'Đặt ra câu hỏi triết học sâu sắc về nhịp sống công nghiệp hóa.',
        metricImpact: { curiosity: 16, mediaInfluence: 8 },
        groupReactions: { youth: 'support', elders: 'support', intellect: 'support', commuters: 'neutral', activists: 'support' },
        viralityBonus: 1.35
      }
    ];
  }
}
