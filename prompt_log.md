# prompt_log.md - Nhật ký đồng hành cùng AI

> Học phần: Thiết kế Web (111101) - Trường Đại học Lạc Hồng (LHU)
> **Tên nhóm:** Nhóm 6 · **Lớp:** 25CT112 · **Tên dự án:** LHU Second Brain

**Cách dùng:** mỗi người ghi prompt của mình **ngay khi làm** vào bảng của mình (mục 2), không để cuối mới viết. Dự án chỉ có 120 phút nên ghi ngắn gọn: dán prompt ngay sau khi gửi AI, điền cột kết quả khi xong. Cuối dự án, Tài tổng hợp 5-10 prompt hay nhất sang file PDF nộp bài. Chụp màn hình những đoạn đối thoại hay với AI, đặt trong `docs/screenshots/` (không bắt đầu bằng `/`) và ghi tên ảnh ở cột cuối.

---

## 1. Công cụ AI sử dụng

| Loại | Công cụ |
|---|---|
| Công cụ chính | Claude, ChatGPT, Gemini |
| Công cụ hỗ trợ code (extension) | [VD: GitHub Copilot, Codeium, Cursor...] |
| Công cụ tạo hình ảnh/nội dung | [VD: Canva AI...] |

---

## 2. Nhật ký quá trình thực hiện

> Dòng đầu mỗi bảng là **dòng mẫu**: ghi đè hoặc xóa khi bắt đầu ghi thật. Cột "Ngày" ghi cả giờ (VD `17/11 09:40`).

### Nhóm trưởng: Hiếu

| Ngày/giờ | Issue | Giai đoạn | Mục tiêu (muốn AI làm gì?) | Prompt đã dùng | Kết quả và tùy chỉnh (AI làm đúng không? đã sửa gì?) | Ảnh chụp |
|---|---|---|---|---|---|---|
| [dd/mm hh:mm] | KB-01 | Khởi tạo | Tạo/kiểm tra dữ liệu mẫu | "..." | ... | |
| | | | | | | |

### Hiền (UI/UX)

> Công cụ AI: Claude (Anthropic). Prompt bám theo tiêu chí hoàn thành của từng Issue trong BACKLOG.md.

| Ngày/giờ | Issue | Giai đoạn | Mục tiêu | Prompt đã dùng | Kết quả và tùy chỉnh | Ảnh chụp |
|---|---|---|---|---|---|---|
| | KB-10 | Thiết kế | Wireframe 3-4 trang | "Vẽ wireframe ASCII cho trang index và library (cả Card view và List view) của web Kho lưu trữ tài liệu cá nhân. Trang library có: ô tìm kiếm, lọc định dạng, sắp xếp, chip tag, nút chuyển view. Trang index có: hero tìm kiếm, widget Xem nhiều nhất, Mới thêm, Thống kê." | AI cho 3 sơ đồ ASCII. Em vẽ lại bằng Figma/Canva, lưu `/docs/wireframe-library.png`. | |
| | KB-11 | CSS | Biến `:root`, reset, typography | "Tạo bộ biến CSS :root theo tông xanh - trắng của trường đại học, gồm màu chính, màu phụ, nền, chữ, viền, bo góc, bóng đổ và khoảng cách. Chỉ trả về khối :root và phần reset cơ bản. Dùng font hỗ trợ tiếng Việt, hiển thị đúng dấu." | Em kiểm tra mọi màu đều dùng `var(--...)`; thêm màu badge PDF/Video/Liên kết. | |
| | KB-12 | HTML/CSS | Navbar + Footer dùng chung | "Viết Navbar (Trang chủ / Kho tài liệu / Thêm tài liệu) và Footer bằng thẻ semantic header, nav, footer. Menu thu gọn trên mobile. Class có tiền tố kb-. Kèm đoạn HTML mẫu để bạn cùng nhóm copy nguyên xi." | AI dùng checkbox thay JavaScript. Em lưu mẫu vào `docs/components.md`, nhắn Tài. | |
| | KB-13 | HTML | Khung index + library | "Dựng khung HTML + CSS tĩnh cho index.html và library.html với dữ liệu giả. Chừa container có id: top-viewed, recent, stats, doc-container, tag-chips, result-count, search-input, type-filter, sort-select, view-toggle. Có input type=search, select định dạng, select sắp xếp, nút chuyển view, thẻ meta viewport." | Em đối chiếu đủ 10 id và báo Đăng. Nạp script theo mục 8 PLAN.md. | |
| | KB-14 | CSS Grid | Card view | "Viết CSS Grid cho thẻ tài liệu: 3 cột desktop, 2 cột tablet, 1 cột mobile. Thẻ có badge định dạng màu khác nhau cho PDF/Video/Liên kết, tiêu đề, mô tả cắt gọn, tag, lượt xem, ngày. Hover mượt bằng transition. Cho biết tên class của thẻ." | Em báo Đăng class `.kb-card`, `.kb-badge--*`, `.kb-card__*`. | |
| | KB-15 | Flexbox | List view | "Viết CSS Flexbox cho List view: mỗi tài liệu một dòng gồm badge, tiêu đề, tag, lượt xem, ngày. Trên mobile tự xuống dòng gọn, không tràn ngang. Dùng class chuyển đổi .kb-view-list / .kb-view-card trên container." | Em ẩn mô tả ở List view; báo Đăng cách đổi class. | |
| | KB-16 | CSS | Chip, thanh công cụ | "Viết CSS chip tag có 3 trạng thái: thường, hover, đang chọn (.kb-chip--active). Thanh công cụ gọn, xếp dọc trên mobile." | Em tăng chiều cao chip để dễ chạm. | |
| | KB-17 | Responsive | 360 / 768 / 1280px | "Rà soát CSS này ở 360px, 768px, 1280px: chỗ nào gây thanh cuộn ngang, nút nào quá nhỏ để chạm trên điện thoại? Sửa giúp." | Đặt `min-height:44px`; test DevTools + 1 điện thoại thật. | |
| | KB-18 | CSS | Trạng thái rỗng, toast, làm đẹp | "Viết style cho 'Không tìm thấy tài liệu' kèm nút 'Xóa bộ lọc', và toast thông báo thành công/lỗi dùng chung cho cả nhóm. Rà soát thành phần nào lệch, vỡ hoặc thiếu hover." | Em thêm `prefers-reduced-motion`, báo Tài và Đăng class `.kb-toast--success/--error`. | |

### Khang (Logic dữ liệu)

| Ngày/giờ | Issue | Giai đoạn | Mục tiêu | Prompt đã dùng | Kết quả và tùy chỉnh | Ảnh chụp |
|---|---|---|---|---|---|---|
| [dd/mm hh:mm] | KB-21 | Tính năng | Viết hàm filterByKeyword | "..." | ... | |
| | | | | | | |

### Đăng (Tương tác DOM)

| Ngày/giờ | Issue | Giai đoạn | Mục tiêu | Prompt đã dùng | Kết quả và tùy chỉnh | Ảnh chụp |
|---|---|---|---|---|---|---|
| [dd/mm hh:mm] | KB-31 | Tính năng | Tìm kiếm real-time | "..." | ... | |
| | | | | | | |

### Tài (Chi tiết, Ghi chú, Form)

| Ngày/giờ | Issue | Giai đoạn | Mục tiêu | Prompt đã dùng | Kết quả và tùy chỉnh | Ảnh chụp |
|---|---|---|---|---|---|---|
| [dd/mm hh:mm] | KB-44 | Tính năng | Regex kiểm tra URL | "..." | ... | |
| | | | | | | |

---

## 3. Minh chứng sửa lỗi (bắt buộc có ít nhất 1)

| Mục | Nội dung |
|---|---|
| Người gặp lỗi | [...] |
| Hiện tượng lỗi | [VD: Menu bị mất trên iPhone] |
| Đoạn code lỗi | (dán code hoặc chèn ảnh chụp màn hình) |
| Prompt đã dùng để nhờ AI tìm lỗi | "..." |
| AI hướng dẫn sửa thế nào | ... |
| Kết quả sau khi sửa | ... |

**Lỗi đã gặp & cách AI hướng dẫn sửa (Hiền - cho PDF KB-47):**
- **Lỗi:** (điền lỗi thật của em)
- **AI hướng dẫn:** (điền)
- **Em đã sửa:** (điền)

---

## 4. Những bài học kinh nghiệm khi dùng AI

- **Câu lệnh (prompt) hiệu quả nhất nhóm đúc kết được:** ...
- **Khó khăn khi làm việc với AI** (VD: AI viết code quá dài, dùng thư viện cũ, tự đổi tên biến...): ...
- **Cách nhóm kiểm tra độ chính xác của code AI** (VD: chạy thử trên Chrome DevTools, hỏi AI giải thích từng dòng, test chéo `logic.test.js`...): ...

---

## 5. Cam kết của nhóm

- [ ] Nhóm đã đọc và hiểu rõ ít nhất 80% mã nguồn do AI tạo ra
- [ ] Nhóm đã tự tay chỉnh sửa lại giao diện (màu sắc, hình ảnh, nội dung) để phù hợp với thực tế

---

## 6. Chuẩn bị cho câu hỏi của giảng viên

Khi chấm, giảng viên sẽ chọn ngẫu nhiên 1 prompt trong nhật ký và hỏi: **"Tại sao em lại đặt câu hỏi như thế này mà không hỏi khác đi?"**

Mỗi người ghi sẵn lý do cho 2-3 prompt quan trọng nhất của mình:

| Người | Prompt | Vì sao hỏi như vậy? |
|---|---|---|
| | | |

---

## Phụ lục: Nhật ký Phát triển Module `js/logic.js` (Khang)

> Tài liệu này ghi lại toàn bộ tiến trình xây dựng, các yêu cầu kỹ thuật và mã nguồn hoàn chỉnh của file `js/logic.js` cho dự án **Hệ thống Kho lưu trữ Tài liệu cá nhân** sử dụng HTML5, CSS3 và Vanilla JavaScript.

### Bảng Tóm tắt Tiến trình & Yêu cầu Kỹ thuật

| STT | Giai đoạn / Chức năng | Yêu cầu Kỹ thuật Cốt lõi | Trạng thái |
| :--- | :--- | :--- | :--- |
| **1** | **Khởi tạo khung logic** | Định nghĩa 13 hàm thuần (pure functions). JSDoc đầy đủ. Đảm bảo tính bất biến (`[...docs]`). | ✅ Hoàn thành |
| **2** | **Tìm kiếm từ khóa (`filterByKeyword`)** | Tự động `trim()`, xử lý chuỗi rỗng. Không phân biệt hoa/thường. Tích hợp `normalizeVietnamese()`. | ✅ Hoàn thành |
| **3** | **Nhóm sắp xếp** | `sortByViews`, `sortByDate` (Date.parse), `sortByTitle` (localeCompare('vi')). | ✅ Hoàn thành |
| **4** | **Thống kê & Trích xuất** | `getTopViewed`, `getRecent`, `getAllTags` (Set + sort A-Z), `countByType` (reduce). | ✅ Hoàn thành |
| **5** | **Lọc theo loại & thẻ** | `filterByType` (hỗ trợ "all"), `filterByTag` (so khớp chính xác). | ✅ Hoàn thành |
| **6** | **Logic trung tâm** | `findById`, `findRelated` (chấm điểm tag + type), `applyFilters` (pipeline tổng hợp). | ✅ Hoàn thành |
