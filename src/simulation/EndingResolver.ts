// Ending Resolver & Retrospective Analyzer for ECHOES OF THE CROWD
// Resolves 6 distinct societal endings based on full journalistic history and emergent metrics.

import { EditorialAngle, EndingResult, EndingType, SocialMetricsState } from '../types/game';
import { PublishedArticle } from './NewsPropagation';

export class EndingResolver {
  public static resolve(
    metrics: SocialMetricsState,
    articles: PublishedArticle[],
    totalPhotosTaken: number
  ): EndingResult {
    // Analyze editorial history
    const angleCounts: Record<EditorialAngle, number> = {
      factual: 0,
      sensational: 0,
      bridging: 0,
      alarmist: 0,
      inquisitive: 0
    };

    articles.forEach(a => {
      angleCounts[a.headline.angle]++;
    });

    let mostFrequentAngle: EditorialAngle = 'factual';
    let maxAngleCount = -1;
    for (const angle of Object.keys(angleCounts) as EditorialAngle[]) {
      if (angleCounts[angle] > maxAngleCount) {
        maxAngleCount = angleCounts[angle];
        mostFrequentAngle = angle;
      }
    }

    let endingType: EndingType = 'fragile_horizon';

    // 1. United Harmony: High Empathy + High Trust + Low Polarization
    if (metrics.empathy >= 62 && metrics.trust >= 58 && metrics.polarization <= 35) {
      endingType = 'united_harmony';
    }
    // 2. Divided Chambers: High Polarization + High Tension
    else if (metrics.polarization >= 60 && metrics.tension >= 58) {
      endingType = 'divided_chambers';
    }
    // 3. Spectacle Circus: High Sensationalism + High Media Influence
    else if (
      (mostFrequentAngle === 'sensational' || mostFrequentAngle === 'alarmist') &&
      metrics.mediaInfluence >= 65 &&
      metrics.trust < 48
    ) {
      endingType = 'spectacle_circus';
    }
    // 4. Apathetic Silence: Low Trust + Low Curiosity
    else if (metrics.trust <= 32 && metrics.curiosity <= 35) {
      endingType = 'apathetic_silence';
    }
    // 5. Mindful Bridge: Balanced Empathy + High Factual/Bridging approach
    else if (
      (mostFrequentAngle === 'bridging' || mostFrequentAngle === 'factual' || mostFrequentAngle === 'inquisitive') &&
      metrics.empathy >= 50 &&
      metrics.socialStability >= 60
    ) {
      endingType = 'mindful_bridge';
    }
    // 6. Fragile Open Horizon: Default balanced / nuanced ending
    else {
      endingType = 'fragile_horizon';
    }

    return this.generateEndingContent(endingType, metrics, articles, totalPhotosTaken, mostFrequentAngle);
  }

  private static generateEndingContent(
    type: EndingType,
    metrics: SocialMetricsState,
    articles: PublishedArticle[],
    totalPhotosTaken: number,
    mostFrequentAngle: EditorialAngle
  ): EndingResult {
    const commonStats = {
      totalPhotosTaken,
      totalPublished: articles.length,
      mostFrequentAngle,
      dominantGroupSentiment: metrics.empathy > metrics.tension ? 'Ôn hòa & Tích cực' : 'Hoài nghi & Đề phòng',
      finalStabilityScore: metrics.socialStability
    };

    switch (type) {
      case 'united_harmony':
        return {
          type,
          title: 'Hồi Kết 1: Bản Hòa Âm Đồng Điệu',
          epigraph: '“Khi truyền thông chọn chiếu rọi sự tử tế, cộng đồng sẽ tìm thấy lý do để tin tưởng lẫn nhau.”',
          summary: 'Những bài viết giàu tính thấu cảm và sự gắn kết của bạn đã truyền cảm hứng mạnh mẽ khắp các góc phố. Người dân bắt đầu cởi mở trò chuyện, dẹp bỏ định kiến ban đầu. Quảng trường thành phố rộn ràng tiếng cười và những cái bắt tay chân thành.',
          societalVerdict: 'Xã hội đạt mức độ đồng thuận và thấu cảm rất cao. Mức phân cực suy giảm rõ rệt.',
          keyStatistics: commonStats,
          reflectionText: 'Bạn đã chứng minh rằng báo chí không chỉ phản ánh thế giới, mà còn có thể đánh thức những phẩm chất tốt đẹp nhất tiềm ẩn trong mỗi con người.'
        };

      case 'divided_chambers':
        return {
          type,
          title: 'Hồi Kết 2: Bức Tường Vô Hình Của Định Kiến',
          epigraph: '“Một nửa sự thật được giật gân hóa đã dựng nên những ranh giới không thể vượt qua.”',
          summary: 'Các bài viết cảnh báo và đào sâu bất đồng đã biến những hiểu lầm thường nhật thành hố sâu ngăn cách. Người trẻ và các bô lão không còn nhìn mặt nhau tại quán cà phê; công viên vắng bóng người vì sự nghi kỵ bao trùm.',
          societalVerdict: 'Đô thị bị phân mảnh thành các nhóm khép kín, bài trừ quan điểm trái chiều.',
          keyStatistics: commonStats,
          reflectionText: 'Sự chú ý đám đông đã đạt đến đỉnh điểm, nhưng cái giá phải trả là sự tan rã của mối dây liên kết cộng đồng bền chặt thuở nào.'
        };

      case 'spectacle_circus':
        return {
          type,
          title: 'Hồi Kết 3: Cơn Cuồng Loạn Chú Ý',
          epigraph: '“Khi mọi khoảnh khắc đều trở thành mồi nhử cảm xúc, sự thật trở thành thứ hàng hóa rẻ rúng nhất.”',
          summary: 'Thành phố rơi vào vòng xoáy khát khao tin tức giật gân không hồi kết. Mọi cử chỉ đời thường đều bị mổ xẻ, phóng đại và biến thành cuộc chiến giành giật lượt xem trên Màn Hình Trung Tâm.',
          societalVerdict: 'Truyền thông nắm quyền thống trị tuyệt đối, nhưng tính trung thực đã hoàn toàn biến mất.',
          keyStatistics: commonStats,
          reflectionText: 'Bạn đã trở thành biên tập viên nổi tiếng nhất thành phố, nhưng liệu đây là xã hội bạn thực sự mong muốn nhìn thấy?'
        };

      case 'apathetic_silence':
        return {
          type,
          title: 'Hồi Kết 4: Sự Im Lặng U Ám Của Hoài Nghi',
          epigraph: '“Cực điểm của sự thất vọng không phải là phẫn nộ, mà là sự thờ ơ tuyệt đối.”',
          summary: 'Sau chuỗi ngày tiếp xúc với các luồng thông tin mâu thuẫn và tin đồn vô căn cứ, thị dân bắt đầu quay lưng với mọi phát thanh. Màn Hình Trung Tâm vẫn sáng đèn, nhưng bên dưới không còn ai buồn ngước mắt nhìn.',
          societalVerdict: 'Xã hội rơi vào trạng thái tê liệt niềm tin. Sự thờ ơ thay thế mọi đối thoại công dân.',
          keyStatistics: commonStats,
          reflectionText: 'Khi niềm tin sụp đổ, ngay cả sự thật chân chính nhất cũng chẳng còn ai muốn lắng nghe.'
        };

      case 'mindful_bridge':
        return {
          type,
          title: 'Hồi Kết 5: Cầu Nối Chữa Lành & Đối Thoại Tỉnh Thức',
          epigraph: '“Sự thật không cần ồn ào; nó cần sự dũng cảm để lắng nghe và đức kiên nhẫn để thấu hiểu.”',
          summary: 'Bằng phong cách đưa tin trung thực kết hợp các câu hỏi gợi mở sâu sắc, bạn đã dẫn dắt dư luận bước qua những bẫy kích động. Các nhóm xã hội cùng ngồi lại quanh bàn tròn, thẳng thắn nhìn nhận sai sót và cùng nhau tìm kiếm giải pháp bền vững.',
          societalVerdict: 'Một nền báo chí có trách nhiệm, phục hồi phẩm giá của đối thoại và lý tính đô thị.',
          keyStatistics: commonStats,
          reflectionText: 'Bạn không làm hài lòng tất cả mọi người trong chốc lát, nhưng bạn đã trao cho thành phố nền tảng vững chắc nhất: sự thật đi cùng lòng nhân ái.'
        };

      case 'fragile_horizon':
      default:
        return {
          type: 'fragile_horizon',
          title: 'Hồi Kết 6: Chân Trời Bất Định Giữa Nhịp Sống Đô Thị',
          epigraph: '“Thành phố vẫn tiếp tục vận động với mọi mâu thuẫn vốn có, và trang báo của ngày mai vẫn đang chờ được viết.”',
          summary: 'Thành phố không hoàn toàn hòa thuận, nhưng cũng không sụp đổ trong chia rẽ. Những mâu thuẫn vẫn âm ỉ, song le lói giữa đó vẫn là những mầm xanh của sự tử tế. Tương lai vẫn là một bức tranh dang dở đầy biến số.',
          societalVerdict: 'Một trạng thái cân bằng động mong manh, phản ánh chân thực nhịp sống phức hợp của xã hội con người.',
          keyStatistics: commonStats,
          reflectionText: 'Bức ảnh chụp hôm nay có thể đã khép lại, nhưng hành trình quan sát xã hội và tự chất vấn đạo đức truyền thông thì không bao giờ kết thúc.'
        };
    }
  }
}
