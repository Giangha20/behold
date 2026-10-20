# ECHOES OF THE CROWD (VỌNG ÂM ĐÁM ĐÔNG)
> *“Điều xã hội nhìn thấy có thể thay đổi điều xã hội trở thành.”*
> Một trò chơi quan sát xã hội, tương tác tin tức và châm biếm truyền thông 2D độc lập.

---

## 1. TỔNG QUAN DỰ ÁN

**Echoes of the Crowd (Vọng Âm Đám Đông)** là một web game 2D độc lập lấy cảm hứng từ thể loại social satire, observation và emergent narrative (tương tự như ý tưởng cốt lõi của *We Become What We Behold*), nhưng được tái cấu trúc hoàn toàn với:
- **Tên trò chơi & Bối cảnh riêng**: Đô thị mở với Quảng trường Ánh Sáng, Quán Cà Phê L'Aura, Trạm Xe Tuyến, Tháp Màn Hình Tin Tức và Công Viên Hòa Bình.
- **Phong cách nghệ thuật nguyên bản**: Đồ họa vector thủ tục (procedural canvas vector art) không sao chép bất kỳ asset đồ họa hay âm thanh có bản quyền nào.
- **Hệ thống âm thanh tổng hợp Web Audio API**: Tự tạo hoàn toàn 100% bằng code synthesizer (tiếng trập cơ học của máy ảnh, tiếng nạp pin flash, tiếng bước chân có stereo panning, tiếng reo hò / tranh cãi và nhạc nền phản ứng động theo chỉ số căng thẳng và thấu cảm).
- **Hệ thống nhân vật AI**: Roster nhân vật có tên tuổi và tính cách đặc trưng (Linh, Nam, Bác Ba, Quỳnh, Hoàng, Mai, Phong, Bé An) cùng cư dân đô thị đa dạng, tự động di chuyển, giao tiếp, phản ứng khi thấy máy ảnh hoặc đọc màn hình tin tức.
- **Tòa soạn & Định hướng truyền thông**: Khi chụp khoảnh khắc, người chơi có thể lựa chọn các góc độ biên tập khác nhau (*Trung Thực*, *Giật Gân*, *Thấu Cảm / Kết Nối*, *Cảnh Báo / Chia Rẽ*, *Gợi Mở / Châm Biếm*).
- **Mô phỏng xã hội 8 chỉ số**: *Trust (Niềm Tin)*, *Tension (Căng Thẳng)*, *Empathy (Thấu Cảm)*, *Polarization (Phân Cực)*, *Curiosity (Hiếu Kỳ)*, *Cooperation (Hợp Tác)*, *Media Influence (Ảnh Hưởng Truyền Thông)*, *Social Stability (Độ Ổn Định)*.
- **Chiến dịch 6 giai đoạn** dẫn đến **6 kết thúc phân nhánh thực sự**.

---

## 2. KIẾN TRÚC MÃ NGUỒN

```
echoes-of-the-crowd/
├── index.html                     # HTML5 Shell
├── package.json                   # Dependencies & Scripts
├── tsconfig.json                  # Cấu hình TypeScript Strict ES2022
├── vite.config.ts                 # Cấu hình Bundler Vite (base: './')
├── dist/                          # Bản build production tối ưu (120kB JS, 5kB CSS)
├── src/
│   ├── main.ts                    # Bootstrap khởi động trò chơi
│   ├── types/
│   │   └── game.ts                # Toàn bộ Data Models & Types
│   ├── i18n/
│   │   ├── vi.ts                  # Tiếng Việt (Bản ngữ chính thức)
│   │   ├── en.ts                  # Tiếng Anh (International)
│   │   └── index.ts               # Trình quản lý đa ngôn ngữ
│   ├── audio/
│   │   └── AudioEngine.ts         # Bộ synthesizer âm thanh thủ tục Web Audio API
│   ├── core/
│   │   ├── Camera.ts              # Điều khiển khung nhìn, viewfinder, framing calculation
│   │   ├── GameState.ts           # State machine trung tâm & điều phối luồng
│   │   ├── SaveSystem.ts          # Lưu trữ LocalStorage, JSON Export/Import
│   │   └── GameApp.ts             # Vòng lặp render Canvas 2D & xử lý input
│   ├── entities/
│   │   ├── Character.ts           # FSM nhân vật, cảm xúc, hoạt ảnh vector, bong bóng thoại
│   │   ├── CityWorld.ts           # Bối cảnh thành phố nhiều lớp (Parallax, Màn hình LED, Công viên)
│   │   └── Crowd.ts               # Quản lý đám đông & khởi tạo dàn nhân vật
│   ├── simulation/
│   │   ├── SocialMetrics.ts       # 8 chỉ số xã hội, độ ổn định động, quán tính tự nhiên
│   │   ├── RelationshipSystem.ts  # 5 nhóm dân cư & ma trận quan hệ
│   │   ├── EventSystem.ts         # Bộ máy sinh sự kiện đường phố & phát hiện viewfinder
│   │   ├── NewsPropagation.ts     # Mô phỏng lan truyền tin tức, virality & dư chấn
│   │   ├── ChapterCampaign.ts     # 6 giai đoạn cốt truyện & mục tiêu bài báo
│   │   └── EndingResolver.ts      # Bộ phân tích 6 kết thúc xã hội & tổng kết lịch sử
│   ├── ui/
│   │   ├── HUD.ts                 # Giao diện HUD chính, thanh trạng thái, nút chụp
│   │   ├── MainMenuUI.ts          # Màn hình Menu chính & chọn chức năng
│   │   ├── NewsroomUI.ts          # Bàn biên tập chọn tiêu đề & dự báo tác động
│   │   ├── JournalUI.ts           # Nhật ký thời sự & thư viện ảnh đã phát sóng
│   │   ├── SocialOverviewUI.ts    # Biểu đồ chỉ số đô thị & đo lường tâm lý nhóm
│   │   ├── SettingsUI.ts          # Tùy biến âm lượng, trợ năng, ngôn ngữ, dữ liệu
│   │   ├── EndingUI.ts            # Màn hình kết thúc điện ảnh & bản tổng kết
│   │   └── HotkeysUI.ts           # Bảng hướng dẫn phím tắt & điều khiển
│   ├── styles/
│   │   └── main.css               # Phong cách giao diện biên tập sang trọng, tương phản cao
│   └── tests/
│       ├── socialSimulation.test.ts # Kiểm thử tính toán chỉ số & độ ổn định
│       ├── eventSystem.test.ts      # Kiểm thử danh mục sự kiện & camera viewfinder
│       ├── newsPropagation.test.ts  # Kiểm thử cơ chế xuất bản & lan truyền
│       ├── chapterCampaign.test.ts  # Kiểm thử tiến trình 6 chương
│       ├── endingResolver.test.ts   # Kiểm thử điều kiện kích hoạt 6 kết thúc
│       └── saveSystem.test.ts       # Kiểm thử lưu trữ & phục hồi dữ liệu
```

---

## 3. THƯ VIỆN & PHIÊN BẢN

| Thư viện | Phiên bản | Mục đích |
|---|---|---|
| `typescript` | `^7.0.2` | Ngôn ngữ phát triển Type-safe |
| `vite` | `^8.3.4` | Build tool và Dev Server cực nhanh |
| `vitest` | `^5.0.5` | Test runner hiện đại cho Unit & Integration tests |
| `@types/node` | `^26.6.5` | Type definitions cho Node runtime |

> **Ghi chú về tài nguyên**: Trò chơi **100% không sử dụng file đồ họa hoặc âm thanh bên ngoài**. Mọi nhân vật, bối cảnh, kiến trúc, hiệu ứng hạt và âm thanh đều được sinh trực tiếp bằng thuật toán Canvas 2D Vector và Web Audio API. Không có nguy cơ bản quyền.

---

## 4. HƯỚNG DẪN CÀI ĐẶT & CHẠY

### 4.1. Yêu cầu hệ thống
- **Node.js**: Phiên bản 18+ (khuyên dùng Node 20 hoặc 22).
- Trình duyệt hiện đại: Chrome, Edge, Firefox, Safari (hỗ trợ HTML5 Canvas và Web Audio API).

### 4.2. Cài đặt dependencies
Mở terminal trong thư mục dự án và chạy:
```bash
npm install
```

### 4.3. Chạy ở chế độ phát triển (Development)
```bash
npm run dev
```
Trình duyệt sẽ mở trò chơi tại: `http://localhost:3000/`.

### 4.4. Chạy kiểm thử tự động (Unit Tests)
```bash
npm test
```
Toàn bộ 6 file test và 20 test cases sẽ được thực thi và báo cáo kết quả.

### 4.5. Đóng gói sản phẩm (Production Build)
```bash
npm run build
```
Bản build hoàn chỉnh sẽ được tạo trong thư mục `dist/`.

### 4.6. Xem thử bản build (Preview)
```bash
npm run preview
```

---

## 5. HƯỚNG DẪN TRIỂN KHAI LÊN HOSTING TĨNH

Do dự án sử dụng đường dẫn tương đối (`base: './'`), thư mục `dist/` có thể được đưa trực tiếp lên bất kỳ dịch vụ lưu trữ nào mà không cần cấu hình máy chủ:
- **GitHub Pages**: Đẩy nội dung thư mục `dist` lên nhánh `gh-pages`.
- **Vercel / Netlify**: Liên kết repo Git với build command `npm run build` và output directory `dist`.
- **Cloudflare Pages**: Chọn Framework preset `Vite`, Build command `npm run build`, Output directory `dist`.

---

## 6. HƯỚNG DẪN ĐIỀU KHIỂN

### Trên Máy tính (PC / Laptop):
- **Di chuyển góc nhìn thành phố**: Phím `A` / `D` hoặc các phím mũi tên `←` / `→`.
- **Điều khiển khung ngắm máy ảnh**: Di chuyển con trỏ chuột. Khung ngắm sẽ lướt theo với độ quán tính mượt mà.
- **Bấm máy chụp ảnh**: Nhấn **Chuột Trái**. Khi có sự kiện hoặc nhân vật lọt vào khung, khung ngắm sẽ chuyển sang màu xanh lá và hiển thị điểm bố cục.
- **Tạm dừng / Tiếp tục**: Phím `Space`.
- **Chế độ thu phóng tiêu điểm (Focus Mode)**: Phím `F`.
- **Mở Tòa soạn biên tập**: Phím `N`.
- **Mở Nhật ký phóng sự**: Phím `J`.
- **Mở Bản đồ chỉ số xã hội**: Phím `M`.
- **Xem hướng dẫn phím tắt**: Phím `H`.
- **Cài đặt / Đóng cửa sổ**: Phím `Esc`.

### Trên Thiết bị di động / Cảm ứng:
- **Chạm & Kéo**: Di chuyển khung ngắm đến vị trí mong muốn.
- **Nút Chụp 📷**: Nút tròn lớn màu đỏ ở góc dưới màn hình, dễ dàng thao tác bằng một ngón tay.
- Các nút chức năng được tối ưu hóa cho màn hình cảm ứng.

---

## 7. HƯỚNG DẪN CHƠI & QUY LUẬT XÃ HỘI

1. **Khởi đầu**: Chọn **Bắt Đầu Quan Sát Mới** tại Menu chính.
2. **Quan sát nhịp sống**: Di chuyển khung nhìn dọc theo 6 khu vực đô thị (Khu dân cư, Quán cà phê L'Aura, Quảng trường trung tâm, Tháp màn hình, Trạm xe tuyến, Công viên Hòa bình).
3. **Bắt trọn khoảnh khắc**: Canh lúc các nhân vật tương tác, biểu diễn nhạc, giúp đỡ nhau hoặc nảy sinh va chạm để chụp.
4. **Biên tập tin tức**:
   - Sau khi chụp, cửa sổ Tòa Soạn sẽ mở ra với bức ảnh thử nghiệm.
   - Bạn có thể chọn giữa các tiêu đề: **Trung Thực**, **Giật Gân**, **Thấu Cảm**, **Cảnh Báo** hoặc **Gợi Mở**.
   - Mỗi tiêu đề dự báo rõ mức độ lan truyền và tác động trực tiếp đến 8 chỉ số xã hội.
5. **Chứng kiến sự thay đổi**:
   - Khi bấm **Phát Sóng**, tiêu đề sẽ xuất hiện trực tiếp trên Tháp Màn Hình Tin Tức giữa quảng trường.
   - Các nhân vật đi ngang qua sẽ dừng lại đọc tin, xuất hiện bong bóng cảm xúc (vui vẻ, phẫn nộ, hoang mang) và truyền tai nhau.
   - Bầu không khí thành phố và âm nhạc nền sẽ biến chuyển theo: trời ngả màu u ám và tiếng drone trầm nếu căng thẳng leo thang; trời bừng sáng ấm áp và hoa rơi nếu lòng trắc ẩn dâng cao.
6. **Tiến trình 6 giai đoạn & 6 kết thúc**:
   - Sau khi xuất bản đủ 6 bài báo quyết định, trò chơi sẽ kích hoạt một trong 6 hồi kết xã hội dựa trên toàn bộ lịch sử lựa chọn của bạn:
     - **Hồi Kết 1: Bản Hòa Âm Đồng Điệu** (Đoàn kết, thấu cảm và tin tưởng phục hồi).
     - **Hồi Kết 2: Bức Tường Vô Hình Của Định Kiến** (Thành phố chia rẽ sâu sắc thành các buồng phản âm).
     - **Hồi Kết 3: Cơn Cuồng Loạn Chú Ý** (Mọi sự kiện bị biến thành mồi nhử câu view).
     - **Hồi Kết 4: Sự Im Lặng U Ám Của Hoài Nghi** (Người dân mất sạch niềm tin, hoàn toàn thờ ơ).
     - **Hồi Kết 5: Cầu Nối Chữa Lành & Đối Thoại Tỉnh Thức** (Báo chí có trách nhiệm, đối thoại bằng lý tính và sự tử tế).
     - **Hồi Kết 6: Chân Trời Bất Định** (Cân bằng mong manh, tương lai mở).

---

## 8. BÁO CÁO KIỂM THỬ THỰC TẾ

```
Test Files  6 passed (6)
Tests       20 passed (20)
Duration    258ms

✓ src/tests/socialSimulation.test.ts (5 tests) - Kiểm tra giới hạn chỉ số, độ ổn định động, quán tính phân rã.
✓ src/tests/endingResolver.test.ts (4 tests) - Kiểm tra điều kiện logic kích hoạt 6 hồi kết phân nhánh.
✓ src/tests/chapterCampaign.test.ts (3 tests) - Kiểm tra mở khóa chương và điều kiện kết thúc chiến dịch.
✓ src/tests/saveSystem.test.ts (3 tests) - Kiểm tra lưu LocalStorage, khôi phục, Export/Import JSON và phòng chống dữ liệu hỏng.
✓ src/tests/eventSystem.test.ts (3 tests) - Kiểm tra danh mục sự kiện, tính hợp lệ của viewfinder detection và tính điểm bố cục.
✓ src/tests/newsPropagation.test.ts (2 tests) - Kiểm tra thuật toán virality, cập nhật màn hình LED trung tâm và tính góc nhìn chủ đạo.
```

- **TypeScript Compilation**: `npx tsc --noEmit` hoàn thành với **0 lỗi**.
- **Production Build**: `npm run build` hoàn thành trong **86ms**, tạo bundle tối ưu dưới 120kB (gzipped 33kB).

---

## 9. GIẢI QUYẾT LỖI PHỔ BIẾN (TROUBLESHOOTING)

1. **Trình duyệt không phát âm thanh**:
   - *Nguyên nhân*: Chính sách chặn Autoplay của trình duyệt hiện đại.
   - *Cách xử lý*: Âm thanh sẽ tự động kích hoạt ngay sau cú nhấp chuột hoặc thao tác đầu tiên của bạn trong game.
2. **Khung ngắm không chụp được ảnh liên tục**:
   - *Nguyên nhân*: Cơ chế cuộn phim của máy ảnh (cooldown 1.2 giây) để tạo tính chân thực và tránh spam làm hỏng mô phỏng.
   - *Cách xử lý*: Quan sát thanh tiến độ "CUỘN PHIM... %" dưới khung ngắm, khi hoàn tất bạn có thể chụp tiếp.
3. **Muốn xóa dữ liệu và chơi lại từ đầu**:
   - Vào **Cài Đặt (⚙️)** > chọn **Xóa Dữ Liệu Lưu**, hoặc chọn **Bắt Đầu Quan Sát Mới** tại Menu chính.
