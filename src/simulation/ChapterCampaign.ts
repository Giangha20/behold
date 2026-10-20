// 6-Chapter Narrative Campaign System for ECHOES OF THE CROWD
// Handles chapter progression, objectives, narrative milestones, and stage transitions.

import { ChapterData } from '../types/game';

export class ChapterCampaign {
  private chapters: ChapterData[] = [
    {
      index: 1,
      code: 'CH_1',
      title: 'Khởi Đầu Quan Sát',
      subTitle: 'The First Gaze',
      introNarrative: 'Bạn cầm trên tay chiếc máy ảnh cơ cũ. Thành phố thức giấc trong nhịp điệu bình dị. Hãy làm quen với việc quan sát những tia sáng đầu tiên của đời sống thị chính.',
      objectives: [
        {
          id: 'obj_1_1',
          description: 'Ghi lại ít nhất 1 khoảnh khắc tích cực tại quảng trường hoặc trạm xe',
          isComplete: false,
          requiredCount: 1,
          currentCount: 0
        },
        {
          id: 'obj_1_2',
          description: 'Xuất bản bài báo đầu tiên lên Màn Hình Thị Chính',
          isComplete: false,
          requiredCount: 1,
          currentCount: 0
        }
      ],
      unlockThreshold: { publishedPhotos: 0 },
      narrativeHint: 'Di chuyển khung ngắm theo các nhân vật. Khi họ trò chuyện hoặc biểu diễn, hãy nhấn Chuột Trái để chụp!'
    },
    {
      index: 2,
      code: 'CH_2',
      title: 'Tiếng Vọng Truyền Thông',
      subTitle: 'The Echo Begins',
      introNarrative: 'Bản tin đầu tiên của bạn đã xuất hiện trên Màn Hình Trung Tâm. Mọi người bắt đầu dừng lại bàn tán. Chiếc máy ảnh của bạn không còn đơn thuần là công cụ lưu niệm nữa.',
      objectives: [
        {
          id: 'obj_2_1',
          description: 'Bắt trọn 2 khoảnh khắc đối thoại hoặc tranh luận trên đường phố',
          isComplete: false,
          requiredCount: 2,
          currentCount: 0
        },
        {
          id: 'obj_2_2',
          description: 'Lựa chọn tiêu đề định hình góc nhìn độc giả',
          isComplete: false,
          requiredCount: 2,
          currentCount: 0
        }
      ],
      unlockThreshold: { publishedPhotos: 1 },
      narrativeHint: 'Chú ý cách mỗi nhóm xã hội phản ứng khác nhau tùy thuộc vào góc nhìn bạn lựa chọn.'
    },
    {
      index: 3,
      code: 'CH_3',
      title: 'Góc Nhìn & Định Kiến',
      subTitle: 'Framing the Narrative',
      introNarrative: 'Cùng một sự việc, hai góc máy khác nhau có thể tạo ra hai thực tại đối nghịch. Sự thật là điều đã xảy ra, hay là điều đám đông tin rằng đã xảy ra?',
      objectives: [
        {
          id: 'obj_3_1',
          description: 'Ghi lại một tình huống có thể diễn giải theo nhiều chiều hướng',
          isComplete: false,
          requiredCount: 1,
          currentCount: 0
        },
        {
          id: 'obj_3_2',
          description: 'Đạt tổng cộng 3 bài báo được xuất bản',
          isComplete: false,
          requiredCount: 3,
          currentCount: 0
        }
      ],
      unlockThreshold: { publishedPhotos: 2 },
      narrativeHint: 'Tiêu đề giật gân có thể mang lại tương tác bùng nổ, nhưng cái giá phải trả cho sự ổn định là gì?'
    },
    {
      index: 4,
      code: 'CH_4',
      title: 'Dòng Thác Lan Truyền',
      subTitle: 'The Polarizing Tide',
      introNarrative: 'Tin đồn và sự phân cực bắt đầu ngấm sâu vào đời sống phố thị. Những cái bắt tay thưa thớt dần, thay vào đó là ánh mắt dò xét giữa các nhóm người.',
      objectives: [
        {
          id: 'obj_4_1',
          description: 'Ghi lại phản ứng của cộng đồng khi tin tức lan tỏa',
          isComplete: false,
          requiredCount: 1,
          currentCount: 0
        },
        {
          id: 'obj_4_2',
          description: 'Đạt tổng cộng 4 bài báo được xuất bản',
          isComplete: false,
          requiredCount: 4,
          currentCount: 0
        }
      ],
      unlockThreshold: { publishedPhotos: 3 },
      narrativeHint: 'Hãy quan sát biểu cảm của các nhân vật khi họ đứng trước Tháp Màn Hình Tin Tức.'
    },
    {
      index: 5,
      code: 'CH_5',
      title: 'Dư Chấn Xã Hội',
      subTitle: 'The Fallout & Weight of Truth',
      introNarrative: 'Thành phố bước vào khúc quanh quyết định. Căng thẳng xã hội và lòng trắc ẩn đang giằng co quyết liệt. Mỗi bài viết bây giờ là giọt nước tràn ly hoặc chiếc cầu hàn gắn.',
      objectives: [
        {
          id: 'obj_5_1',
          description: 'Ghi lại sự kiện then chốt của thành phố',
          isComplete: false,
          requiredCount: 1,
          currentCount: 0
        },
        {
          id: 'obj_5_2',
          description: 'Đạt tổng cộng 5 bài báo được xuất bản',
          isComplete: false,
          requiredCount: 5,
          currentCount: 0
        }
      ],
      unlockThreshold: { publishedPhotos: 4 },
      narrativeHint: 'Cân nhắc kỹ lưỡng tác động xã hội của bài báo tiếp theo của bạn.'
    },
    {
      index: 6,
      code: 'CH_6',
      title: 'Khoảnh Khắc Quyết Định',
      subTitle: 'The Final Edition',
      introNarrative: 'Số báo đặc biệt cuối cùng sắp lên khuôn. Bức tranh toàn cảnh về thành phố mà bạn góp phần nhào nặn giờ đây đã thành hình. Hãy chọn khoảnh khắc định mệnh để khép lại thiên phóng sự.',
      objectives: [
        {
          id: 'obj_6_1',
          description: 'Chụp và xuất bản bài báo định hình tương lai thành phố',
          isComplete: false,
          requiredCount: 1,
          currentCount: 0
        }
      ],
      unlockThreshold: { publishedPhotos: 5 },
      narrativeHint: 'Sau bài báo này, trò chơi sẽ chuyển sang Hồi Kết và tổng kết toàn bộ hành trình.'
    }
  ];

  private currentChapterIndex: number = 1;

  constructor() {}

  public getCurrentChapter(): ChapterData {
    return this.chapters[this.currentChapterIndex - 1] || this.chapters[0];
  }

  public getChapterByIndex(idx: number): ChapterData | undefined {
    return this.chapters[idx - 1];
  }

  public getAllChapters(): ChapterData[] {
    return [...this.chapters];
  }

  public setChapter(index: number): void {
    if (index >= 1 && index <= this.chapters.length) {
      this.currentChapterIndex = index;
    }
  }

  /**
   * Evaluates progression after each published article.
   * Returns true if chapter progressed.
   */
  public onArticlePublished(totalPublishedCount: number): boolean {
    const current = this.getCurrentChapter();
    current.objectives.forEach(obj => {
      obj.currentCount = totalPublishedCount;
      if (obj.currentCount >= obj.requiredCount) {
        obj.isComplete = true;
      }
    });

    // Check if next chapter should unlock
    if (this.currentChapterIndex < 6) {
      const nextChapter = this.chapters[this.currentChapterIndex];
      if (totalPublishedCount >= nextChapter.unlockThreshold.publishedPhotos) {
        this.currentChapterIndex++;
        return true;
      }
    }
    return false;
  }

  public isFinalChapterComplete(totalPublishedCount: number): boolean {
    return totalPublishedCount >= 6;
  }
}
