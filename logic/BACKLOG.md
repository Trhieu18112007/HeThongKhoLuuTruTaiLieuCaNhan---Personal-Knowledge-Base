# BACKLOG.md - Danh sách Issue cho GitHub Projects

> Mỗi mục `KB-xx` bên dưới là **1 Issue** trên GitHub. Cách dùng:
> 1. Nhóm trưởng tạo Issue với tiêu đề `KB-xx · Tên việc`, dán phần Mô tả và Tiêu chí vào nội dung Issue
> 2. Gán người phụ trách (Assignee), gắn nhãn (Label) theo dòng **Nhãn**, đặt vào cột **To-do** của GitHub Projects
> 3. Khi bắt đầu làm: kéo sang **In Progress**; khi PR đã merge vào `main`: kéo sang **Done**
> 4. Commit/PR nhắc số Issue, ví dụ `[Logic] Thêm hàm filterByKeyword (KB-21)`

**Nhãn gợi ý:** `sprint-1`, `sprint-2`, `tuan-15`, `ui`, `logic`, `dom`, `form`, `data`, `docs`, `must`, `should`, `could`.

**Bảng tổng quan**

| Người | Số Issue | Sprint 1 | Sprint 2 |
|---|---|---|---|
| Nhóm trưởng | 8 | KB-01 → KB-05 | KB-06 → KB-08 |
| Hiền | 9 | KB-10 → KB-13 | KB-14 → KB-18 |
| Khang | 7 | KB-20 → KB-22 | KB-23 → KB-26 |
| Đăng | 7 | KB-30, KB-31 | KB-32 → KB-36 |
| Tài | 8 | KB-40, KB-41 | KB-42 → KB-47 |

---

## NHÓM TRƯỞNG (Scrum Master + Data)

### KB-01 · Khởi tạo repository và cấu trúc thư mục
- **Sprint 1** · **Nhánh:** `main` (làm trực tiếp lần đầu) · **Nhãn:** `sprint-1`, `docs`, `must`
- **Mô tả:** Tạo 1 repo duy nhất cho nhóm, tạo thư mục theo mục 8 trong `PLAN.md`, mời 4 thành viên làm Collaborators.
- **Tiêu chí hoàn thành:**
  - [ ] Repo có `/assets`, `/css`, `/js`, `/docs`, `index.html`, `README.md`, `PLAN.md`, `prompt_log.md`
  - [ ] 4 thành viên đã chấp nhận lời mời và clone được repo
  - [ ] Bật branch protection cho `main` (bắt buộc Pull Request trước khi merge)
- **Gợi ý prompt AI:** *"Tạo cấu trúc thư mục dự án web tĩnh gồm assets, css, js, docs, các file index.html, library.html, detail.html, add.html rỗng với khung HTML5 Semantic."*

### KB-02 · Viết PLAN.md hoàn chỉnh
- **Sprint 1** · **Nhánh:** `docs-plan` · **Nhãn:** `sprint-1`, `docs`, `must`
- **Mô tả:** Điền các chỗ `[...]` (tên nhóm, lớp, giảng viên, link repo), chỉnh phạm vi sau khi Pitching và nghe phản hồi của giảng viên.
- **Tiêu chí hoàn thành:**
  - [ ] Không còn chỗ `[...]` ở mục 1
  - [ ] Phạm vi (mục 3) đã được giảng viên đồng ý ở buổi Pitching
  - [ ] Cả nhóm đã đọc

### KB-03 · Hoàn thiện data.js và storage.js (Data Contract)
- **Sprint 1** · **Nhánh:** `feature-data` · **Nhãn:** `sprint-1`, `data`, `must`
- **Mô tả:** Đưa `data.js` và `storage.js` lên `main` **trước tiên** để mọi người làm song song. Thay các `url: "#"` bằng link thật nếu có.
- **Tiêu chí hoàn thành:**
  - [ ] ≥ 12 tài liệu mẫu, đủ 3 định dạng, mỗi tài liệu có đủ 9 thuộc tính
  - [ ] Cả nhóm đã đọc phần chú thích đầu `data.js` và đồng ý tên thuộc tính
  - [ ] Nhờ AI kiểm tra logic cấu trúc dữ liệu, ghi prompt vào `prompt_log.md`
- **Gợi ý prompt AI:** *"Hãy kiểm tra mảng DOCUMENTS này: tìm id trùng, tag không đúng quy ước chữ thường không dấu, type không thuộc pdf/video/link, ngày không đúng YYYY-MM-DD."*

### KB-04 · Họp Sprint Planning và tạo bảng Kanban
- **Sprint 1** · **Nhãn:** `sprint-1`, `docs`, `must`
- **Mô tả:** Bật GitHub Projects, tạo 3 cột To-do / In Progress / Done, tạo toàn bộ Issue trong file này và gán người.
- **Tiêu chí hoàn thành:**
  - [ ] Mỗi Issue có người phụ trách và nhãn Sprint
  - [ ] Cả nhóm biết cách kéo thẻ giữa các cột
  - [ ] Thống nhất giờ Daily Stand-up

### KB-05 · Review và merge Pull Request (việc liên tục)
- **Sprint 1-2** · **Nhãn:** `must`
- **Mô tả:** Với mỗi PR: kiểm tra phạm vi file, nhờ AI tìm xung đột tên biến/hàm rồi mới merge.
- **Tiêu chí hoàn thành:**
  - [ ] Không có PR nào chờ quá 24 giờ
  - [ ] Mỗi PR chỉ sửa file thuộc phạm vi của người gửi
  - [ ] `main` luôn chạy được sau mỗi lần merge
- **Gợi ý prompt AI:** *"Đây là code của bạn A (logic.js) và bạn B (ui.js). Hãy kiểm tra có xung đột về tên biến, tên hàm hoặc cách gọi hàm không trước khi tôi merge."*

### KB-06 · Viết README.md chuyên nghiệp
- **Sprint 2** · **Nhánh:** `docs-readme` · **Nhãn:** `sprint-2`, `docs`, `must`
- **Tiêu chí hoàn thành:**
  - [ ] Tên dự án, thành viên và vai trò (Scrum Master, Dev Team)
  - [ ] Mô tả bài toán giải quyết, tính năng chính, ảnh chụp màn hình
  - [ ] Hướng dẫn chạy và **link Live Demo**
  - [ ] 3-5 prompt nổi bật nhất dùng để xử lý logic khó

### KB-07 · Deploy GitHub Pages
- **Sprint 2** (deploy thử sớm ở Sprint 1 cũng được) · **Nhãn:** `sprint-2`, `must`
- **Tiêu chí hoàn thành:**
  - [ ] Web chạy Live, mở được trên điện thoại
  - [ ] Đường dẫn file (css/js/ảnh) đúng khi chạy trên GitHub Pages
  - [ ] Cả nhóm thử mở link và đồng ý

### KB-08 · Slide và kịch bản Pitching 5 phút
- **Tuần 15** · **Nhãn:** `tuan-15`, `docs`, `must`
- **Tiêu chí hoàn thành:**
  - [ ] Nội dung: Tên dự án → Lý do chọn đề tài → Tính năng JavaScript nổi bật → Demo trực tiếp
  - [ ] Mỗi thành viên có phần nói, tổng đúng 5 phút
  - [ ] Đã tập thử ít nhất 2 lần, có danh sách câu hỏi phản biện dự kiến

---

## HIỀN (UI/UX)

### KB-10 · Vẽ Wireframe 3-4 trang
- **Sprint 1** · **Nhánh:** `feature-layout` · **Nhãn:** `sprint-1`, `ui`, `must`
- **Mô tả:** Vẽ phác thảo `index`, `library` (cả Card và List view) bằng giấy hoặc Figma/Canva rồi lưu ảnh vào `/docs`. Có thể dựa trên các hình ASCII trong `PLAN.md` mục 5. Phối hợp với Tài để thống nhất wireframe `detail` và `add`.
- **Tiêu chí hoàn thành:**
  - [ ] ≥ 1 wireframe (đạt Milestone 1), tốt nhất đủ 3-4 trang
  - [ ] Ảnh nằm trong `/docs`, tên rõ ràng (`wireframe-library.png`)

### KB-11 · Biến `:root`, reset và typography
- **Sprint 1** · **Nhánh:** `feature-layout` · **Nhãn:** `sprint-1`, `ui`, `must`
- **Mô tả:** Định nghĩa màu xanh - trắng theo LHU, font, khoảng cách, bo góc trong `css/style.css`.
- **Tiêu chí hoàn thành:**
  - [ ] Có biến cho: màu chính, màu phụ, nền, chữ, viền, bo góc, bóng đổ, khoảng cách
  - [ ] Mọi màu trong file đều dùng biến `var(--...)`, không viết mã màu rải rác
  - [ ] Dùng font hỗ trợ tiếng Việt, hiển thị đúng dấu
- **Gợi ý prompt AI:** *"Tạo bộ biến CSS :root theo tông xanh - trắng của trường đại học, gồm màu chính, màu nhấn, màu nền, màu chữ, bo góc và đổ bóng. Chỉ trả về khối :root và phần reset cơ bản."*

### KB-12 · Navbar và Footer dùng chung + `docs/components.md`
- **Sprint 1** · **Nhánh:** `feature-layout` · **Nhãn:** `sprint-1`, `ui`, `must`
- **Mô tả:** Làm Navbar (Trang chủ / Kho tài liệu / Thêm tài liệu) và Footer; lưu đoạn HTML mẫu vào `docs/components.md` để **Tài copy nguyên xi** cho `detail.html` và `add.html`.
- **Tiêu chí hoàn thành:**
  - [ ] Navbar có menu thu gọn trên mobile
  - [ ] Dùng thẻ Semantic (`header`, `nav`, `footer`)
  - [ ] Class có tiền tố `kb-`
  - [ ] Đã nhắn Tài khi Navbar có thay đổi

### KB-13 · Khung HTML + CSS cho `index.html` và `library.html`
- **Sprint 1** · **Nhánh:** `feature-layout` · **Nhãn:** `sprint-1`, `ui`, `must`
- **Mô tả:** Dựng khung tĩnh theo wireframe. Chừa sẵn các container cho Đăng đổ dữ liệu: `#top-viewed`, `#recent`, `#stats`, `#doc-container`, `#tag-chips`, `#result-count`, `#search-input`, `#type-filter`, `#sort-select`, `#view-toggle`. **Báo Đăng danh sách id này.**
- **Tiêu chí hoàn thành:**
  - [ ] Hai trang hiển thị đúng bố cục với dữ liệu giả
  - [ ] Có `<input type="search">`, `<select>` định dạng, `<select>` sắp xếp, nút chuyển view
  - [ ] Nạp script đúng thứ tự mục 8 `PLAN.md`
  - [ ] Có thẻ `<meta name="viewport">`

### KB-14 · Card view (CSS Grid)
- **Sprint 2** · **Nhánh:** `feature-card-list` · **Nhãn:** `sprint-2`, `ui`, `must`
- **Tiêu chí hoàn thành:**
  - [ ] Grid 3 cột desktop, 2 cột tablet, 1 cột mobile
  - [ ] Thẻ có badge định dạng (màu khác nhau cho PDF/Video/Liên kết), tiêu đề, mô tả cắt gọn, tag, lượt xem, ngày
  - [ ] Hiệu ứng hover mượt (`transition`)
  - [ ] **Báo Đăng** tên class của thẻ để Đăng gắn vào HTML sinh ra

### KB-15 · List view (Flexbox)
- **Sprint 2** · **Nhánh:** `feature-card-list` · **Nhãn:** `sprint-2`, `ui`, `must`
- **Tiêu chí hoàn thành:**
  - [ ] Mỗi tài liệu một dòng: badge, tiêu đề, tag, lượt xem, ngày
  - [ ] Trên mobile tự xuống dòng gọn gàng, không tràn ngang
  - [ ] Có class chuyển đổi (ví dụ `.kb-view-list` / `.kb-view-card`) báo cho Đăng

### KB-16 · Chip tag, thanh công cụ và badge trạng thái
- **Sprint 2** · **Nhánh:** `feature-card-list` · **Nhãn:** `sprint-2`, `ui`, `should`
- **Tiêu chí hoàn thành:**
  - [ ] Chip tag có trạng thái thường / hover / đang chọn (`.kb-chip--active`)
  - [ ] Thanh công cụ gọn trên mobile (xếp dọc)

### KB-17 · Responsive toàn bộ giao diện
- **Sprint 2** · **Nhánh:** `feature-responsive` · **Nhãn:** `sprint-2`, `ui`, `must`
- **Tiêu chí hoàn thành:**
  - [ ] Đẹp ở 360px, 768px, 1280px
  - [ ] Không có thanh cuộn ngang
  - [ ] Nút bấm đủ lớn để chạm trên điện thoại
  - [ ] Đã test bằng DevTools và 1 điện thoại thật

### KB-18 · Trạng thái rỗng, hiệu ứng và làm đẹp
- **Sprint 2** · **Nhánh:** `feature-polish` · **Nhãn:** `sprint-2`, `ui`, `should`
- **Tiêu chí hoàn thành:**
  - [ ] Có style cho "Không tìm thấy tài liệu" kèm nút "Xóa bộ lọc"
  - [ ] Có style cho toast thông báo (thành công/lỗi) để Tài và Đăng dùng chung
  - [ ] Không còn thành phần nào lệch, vỡ hoặc thiếu hover

*(Việc ngoài Kanban: quay Video demo ở Tuần 15, xem KB-47.)*

---

## KHANG (Logic dữ liệu)

> Tất cả hàm là **hàm thuần**: không đụng DOM, không sửa mảng gốc. Chữ ký hàm xem `PLAN.md` mục 8.

### KB-20 · Chốt danh sách hàm và gửi cho cả nhóm
- **Sprint 1** · **Nhánh:** `feature-filter-logic` · **Nhãn:** `sprint-1`, `logic`, `must`
- **Mô tả:** Dựa trên bảng chữ ký hàm ở `PLAN.md`, tạo khung `js/logic.js` với đầy đủ hàm (thân hàm có thể tạm trả `docs`) và comment mô tả từng hàm để Đăng và Tài gọi được ngay.
- **Tiêu chí hoàn thành:**
  - [ ] Đủ 13 hàm đúng tên và đúng tham số như `PLAN.md`
  - [ ] Mỗi hàm có comment: làm gì, tham số, trả về
  - [ ] Đã đẩy PR sớm để Đăng và Tài bắt đầu gọi

### KB-21 · `filterByKeyword`
- **Sprint 1** · **Nhánh:** `feature-filter-logic` · **Nhãn:** `sprint-1`, `logic`, `must`
- **Tiêu chí hoàn thành:**
  - [ ] Không phân biệt hoa/thường; tìm trong `title`, `description`, `tags`
  - [ ] Từ khóa rỗng hoặc toàn dấu cách → trả toàn bộ
  - [ ] Tự bỏ khoảng trắng đầu/cuối
  - [ ] (Nâng cao) tìm không phân biệt dấu tiếng Việt: gõ "toan" ra "Toán"
- **Gợi ý prompt AI:** *"Viết hàm JavaScript thuần filterByKeyword(docs, keyword) lọc mảng tài liệu theo từ khóa không phân biệt hoa thường trong title, description và tags. Từ khóa rỗng trả toàn bộ. Không dùng DOM, không sửa mảng gốc."*

### KB-22 · `filterByType` và `filterByTag`
- **Sprint 1** · **Nhánh:** `feature-filter-logic` · **Nhãn:** `sprint-1`, `logic`, `must`
- **Tiêu chí hoàn thành:**
  - [ ] `filterByType(docs, "all")` trả toàn bộ; type không tồn tại → mảng rỗng
  - [ ] `filterByTag(docs, "")` trả toàn bộ; so khớp tag chính xác
  - [ ] Dùng `filter()`, không dùng vòng `for` thủ công

### KB-23 · `sortByViews`, `sortByDate`, `sortByTitle`
- **Sprint 2** · **Nhánh:** `feature-sort-logic` · **Nhãn:** `sprint-2`, `logic`, `should`
- **Tiêu chí hoàn thành:**
  - [ ] Trả về **mảng mới** (dùng `[...docs].sort(...)`), mảng gốc không đổi
  - [ ] `sortByDate` so sánh đúng chuỗi `YYYY-MM-DD`
  - [ ] `sortByTitle` dùng `localeCompare("vi")` để tiếng Việt sắp đúng

### KB-24 · `getTopViewed`, `getRecent`, `getAllTags`, `countByType`
- **Sprint 2** · **Nhánh:** `feature-stats-logic` · **Nhãn:** `sprint-2`, `logic`, `should`
- **Tiêu chí hoàn thành:**
  - [ ] `getTopViewed(docs, 5)` đúng 5 phần tử có `views` cao nhất; ít hơn 5 tài liệu thì trả hết
  - [ ] `getAllTags` không trùng, sắp A→Z
  - [ ] `countByType` trả `{ pdf: n, video: n, link: n }`, kể cả loại có 0 tài liệu
  - [ ] Dùng `map`, `filter`, `reduce`

### KB-25 · `findById`, `findRelated`, `applyFilters`
- **Sprint 2** · **Nhánh:** `feature-apply-filters` · **Nhãn:** `sprint-2`, `logic`, `must`
- **Mô tả:** `applyFilters(docs, { keyword, type, tag, sortBy })` gộp các hàm lọc và sắp xếp, là hàm Đăng gọi chính. Phải ưu tiên xong hàm này sớm.
- **Tiêu chí hoàn thành:**
  - [ ] Kết hợp được cả 3 bộ lọc cùng lúc
  - [ ] `options` thiếu thuộc tính nào thì bỏ qua bộ lọc đó, không báo lỗi
  - [ ] `findById` nhận id dạng chuỗi hoặc số đều đúng; không thấy → `null`
  - [ ] `findRelated` loại bỏ chính tài liệu đó, tối đa n kết quả

### KB-26 · Kiểm thử `logic.test.js`
- **Sprint 2** · **Nhánh:** `feature-logic-test` · **Nhãn:** `sprint-2`, `logic`, `must`
- **Mô tả:** Viết ≥ 12 phép kiểm tra bằng `console.assert` trên dữ liệu mẫu, chạy được bằng cách nạp tạm vào một trang test hoặc dán vào Console. Test chéo code của Đăng (Mobile + Console).
- **Tiêu chí hoàn thành:**
  - [ ] Có test cho các trường hợp biên: từ khóa rỗng, không có kết quả, hoa/thường, tag không tồn tại
  - [ ] Tất cả test đạt (không có dòng `Assertion failed`)
  - [ ] Chụp ảnh Console đạt để làm minh chứng
- **Gợi ý prompt AI:** *"Viết các lệnh console.assert để kiểm tra hàm filterByKeyword, filterByType, filterByTag, applyFilters trên mảng DOCUMENTS, gồm cả trường hợp biên: từ khóa rỗng, không có kết quả, hoa/thường."*

---

## ĐĂNG (Tương tác DOM: Home và Library)

> Đăng là "người kết nối": **chỉ gọi hàm** của Khang (`logic.js`) và `KBStorage`, không tự viết lại logic lọc.

### KB-30 · Khung `ui.js`/`app.js` và render thử danh sách
- **Sprint 1** · **Nhánh:** `feature-search-ui` · **Nhãn:** `sprint-1`, `dom`, `must`
- **Mô tả:** Dùng `KBStorage.getAllDocuments()` để lấy dữ liệu, render thử bằng `map()` vào `#doc-container`. Nhận danh sách id container từ Hiền (KB-13).
- **Tiêu chí hoàn thành:**
  - [ ] Hiện ≥ 12 thẻ trên `library.html`, HTML không viết cứng tài liệu
  - [ ] `ui.js` chỉ chứa hàm hiển thị; `app.js` chỉ gắn sự kiện và điều phối
  - [ ] Không có biến toàn cục thừa
- **Gợi ý prompt AI:** *"Viết hàm renderCards(docs, container) dùng map() để tạo HTML cho mỗi tài liệu gồm badge định dạng, tiêu đề, mô tả, tag, lượt xem và link sang detail.html?id=. Dùng data-id lưu id."*

### KB-31 · Tìm kiếm real-time
- **Sprint 1-2** · **Nhánh:** `feature-search-ui` · **Nhãn:** `sprint-2`, `dom`, `must`
- **Tiêu chí hoàn thành:**
  - [ ] Gõ tới đâu lọc tới đó (sự kiện `input`), không tải lại trang
  - [ ] Gọi `applyFilters` của Khang
  - [ ] Cập nhật dòng "Tìm thấy N tài liệu" mỗi lần lọc
  - [ ] Không lỗi Console khi xóa hết chữ hoặc gõ ký tự đặc biệt

### KB-32 · Bộ lọc định dạng, tag và sắp xếp
- **Sprint 2** · **Nhánh:** `feature-filter-ui` · **Nhãn:** `sprint-2`, `dom`, `must`
- **Tiêu chí hoàn thành:**
  - [ ] Chip tag sinh tự động từ `getAllTags`; bấm để bật/tắt (class `.kb-chip--active`)
  - [ ] Đổi định dạng hoặc sắp xếp thì cập nhật ngay
  - [ ] Ba bộ lọc kết hợp được với ô tìm kiếm
  - [ ] Dùng event delegation cho chip (một listener trên container)

### KB-33 · Chuyển Card view ⇄ List view
- **Sprint 2** · **Nhánh:** `feature-view-toggle` · **Nhãn:** `sprint-2`, `dom`, `must`
- **Tiêu chí hoàn thành:**
  - [ ] Bấm nút đổi ngay, giữ nguyên bộ lọc
  - [ ] Nút hiển thị đúng trạng thái đang chọn
  - [ ] (Nâng cao) nhớ lựa chọn bằng `localStorage` (key riêng, ví dụ `kb_view_mode`, báo nhóm trưởng ghi vào `PLAN.md`)

### KB-34 · Widget trang chủ
- **Sprint 2** · **Nhánh:** `feature-home-widgets` · **Nhãn:** `sprint-2`, `dom`, `should`
- **Tiêu chí hoàn thành:**
  - [ ] "Xem nhiều nhất" dùng `getTopViewed(docs, 5)`, "Mới thêm" dùng `getRecent(docs, 5)`
  - [ ] Widget thống kê dùng `countByType` và tổng số tài liệu
  - [ ] Ô tìm kiếm ở hero chuyển sang `library.html?q=...`

### KB-35 · Đọc tham số URL ở Kho tài liệu
- **Sprint 2** · **Nhánh:** `feature-url-params` · **Nhãn:** `sprint-2`, `dom`, `should`
- **Tiêu chí hoàn thành:**
  - [ ] `library.html?q=css` tự điền ô tìm kiếm và lọc sẵn
  - [ ] Hỗ trợ `?type=` và `?tag=`
  - [ ] Tham số không hợp lệ thì bỏ qua, không lỗi
  - [ ] Dùng `URLSearchParams`
- **Gợi ý prompt AI:** *"Viết đoạn JavaScript đọc tham số q, type, tag từ URL bằng URLSearchParams, điền vào ô tìm kiếm và bộ lọc rồi gọi hàm render. Nếu tham số không hợp lệ thì dùng giá trị mặc định."*

### KB-36 · Tinh gọn code và xử lý lỗi (Refactor)
- **Sprint 2** · **Nhánh:** `feature-refactor-ui` · **Nhãn:** `sprint-2`, `dom`, `must`
- **Tiêu chí hoàn thành:**
  - [ ] Không còn `console.log` thừa, không lỗi Console
  - [ ] Hàm ngắn, tên rõ nghĩa, có comment
  - [ ] Đã nhờ AI Refactor, ghi prompt vào `prompt_log.md`
  - [ ] Thoát ký tự HTML khi chèn dữ liệu người dùng (tiêu đề, mô tả) để tránh vỡ giao diện

---

## TÀI (Chi tiết, Ghi chú, Form)

### KB-40 · Wireframe `detail` và `add`, khung `detail.html` + `add.html`
- **Sprint 1** · **Nhánh:** `feature-detail-note` · **Nhãn:** `sprint-1`, `ui`, `must`
- **Mô tả:** Phối hợp Hiền về wireframe. Copy Navbar/Footer từ `docs/components.md`, link `css/style.css` (chỉ đọc) và `css/detail.css` của mình (tiền tố `dt-`).
- **Tiêu chí hoàn thành:**
  - [ ] Có wireframe trong `/docs`
  - [ ] Hai trang có khung đúng, nạp script đúng thứ tự mục 8 `PLAN.md`
  - [ ] Không sửa `style.css`

### KB-41 · Trang chi tiết: đọc `id` từ URL và hiển thị
- **Sprint 1-2** · **Nhánh:** `feature-detail-note` · **Nhãn:** `sprint-1`, `dom`, `must`
- **Tiêu chí hoàn thành:**
  - [ ] `detail.html?id=3` hiện đúng tiêu đề, badge, mô tả, tag, ngày thêm, lượt xem
  - [ ] Nút "Mở tài liệu" mở `url` ở tab mới (`rel="noopener"`); `url` là `"#"` thì ẩn hoặc vô hiệu nút
  - [ ] `id` không tồn tại/không hợp lệ → thông báo "Không tìm thấy tài liệu" + link về Kho
  - [ ] Dùng `findById` của Khang, `URLSearchParams`
- **Gợi ý prompt AI:** *"Viết JavaScript đọc tham số id từ URL, tìm tài liệu trong mảng bằng hàm findById, hiển thị lên các phần tử trang. Nếu không tìm thấy hoặc id không phải số thì hiện thông báo lỗi và link về trang kho tài liệu."*

### KB-42 · Tăng lượt xem khi mở trang chi tiết
- **Sprint 2** · **Nhánh:** `feature-detail-note` · **Nhãn:** `sprint-2`, `dom`, `should`
- **Tiêu chí hoàn thành:**
  - [ ] Mở trang → gọi `KBStorage.increaseViews(id)` đúng 1 lần
  - [ ] Lượt xem hiển thị trên trang đã cộng đúng
  - [ ] Quay lại trang chủ/Kho thấy số lượt xem tăng

### KB-43 · Ô ghi chú (lưu, xóa, đếm ký tự, validation)
- **Sprint 2** · **Nhánh:** `feature-detail-note` · **Nhãn:** `sprint-2`, `dom`, `form`, `must`
- **Tiêu chí hoàn thành:**
  - [ ] `<textarea>` hiện ghi chú đã lưu khi mở trang (`KBStorage.getNote`)
  - [ ] Bộ đếm "n/500" cập nhật theo từng ký tự gõ; vượt giới hạn thì cảnh báo màu đỏ
  - [ ] Lưu rỗng → báo lỗi, không lưu; lưu thành công → hiện toast
  - [ ] Nút Xóa ghi chú có hỏi xác nhận (`confirm`)
  - [ ] Tải lại trang vẫn còn ghi chú

### KB-44 · Form thêm tài liệu: validation bằng Regex, báo lỗi khi gõ
- **Sprint 2** · **Nhánh:** `feature-add-form` · **Nhãn:** `sprint-2`, `form`, `must`
- **Mô tả:** Theo bảng quy tắc ở `PLAN.md` mục 5.4. Đây là trang đáp ứng yêu cầu Form + Regex của đề.
- **Tiêu chí hoàn thành:**
  - [ ] Dùng đủ loại input: `text`, `url`, `select`, `textarea` (HTML5 `required`, `maxlength`)
  - [ ] Báo lỗi ngay dưới từng ô khi gõ/rời ô; ô hợp lệ có viền xanh
  - [ ] Regex URL kiểm tra đúng `http://` / `https://`
  - [ ] Nút Lưu bị vô hiệu cho đến khi form hợp lệ
  - [ ] Lưu bằng `KBStorage.addDocument`, hiện toast, chuyển sang `library.html`; tài liệu mới xuất hiện trong Kho
- **Gợi ý prompt AI:** *"Viết hàm JavaScript validateUrl(value) dùng Regex kiểm tra chuỗi bắt đầu bằng http:// hoặc https://, có tên miền hợp lệ. Cho tôi 5 ví dụ đúng và 5 ví dụ sai để tự kiểm tra."*

### KB-45 · Tài liệu liên quan (Could have)
- **Sprint 2** · **Nhánh:** `feature-related` · **Nhãn:** `sprint-2`, `dom`, `could`
- **Tiêu chí hoàn thành:**
  - [ ] Hiện tối đa 3 tài liệu cùng tag, dùng `findRelated` của Khang
  - [ ] Không có tài liệu liên quan thì ẩn mục này

### KB-46 · Responsive và Refactor cho `detail` + `add`
- **Sprint 2** · **Nhánh:** `feature-detail-polish` · **Nhãn:** `sprint-2`, `ui`, `must`
- **Tiêu chí hoàn thành:**
  - [ ] Đẹp ở 360px, 768px, 1280px; form dễ nhập trên điện thoại
  - [ ] Không lỗi Console; code có comment; đã qua AI Refactor

### KB-47 · PDF "Nhật ký đồng hành cùng AI" (+ hỗ trợ video demo)
- **Tuần 15** · **Nhãn:** `tuan-15`, `docs`, `must`
- **Mô tả:** Tổng hợp từ `prompt_log.md` của cả nhóm theo mẫu Phụ lục 2 của giáo trình. **Hiền quay video demo 3-5 phút** (việc này cũng tính ở KB-47).
- **Tiêu chí hoàn thành:**
  - [ ] Bảng 5-10 prompt quan trọng nhất (giai đoạn / mục tiêu / prompt / kết quả và tùy chỉnh)
  - [ ] Ảnh chụp màn hình 1 đoạn code lỗi và cách AI hướng dẫn sửa
  - [ ] Thông tin công cụ AI, bài học kinh nghiệm, cam kết đã hiểu ≥ 80% code AI tạo
  - [ ] Video demo 3-5 phút quay màn hình các tính năng chính, đã đưa link vào README

---

## Việc chung cả nhóm

| Việc | Ghi chú |
|---|---|
| Ghi `prompt_log.md` | Mỗi người ghi prompt của mình **ngay khi làm**, không để cuối |
| Daily Stand-up | 3 câu hỏi mỗi ngày |
| Test chéo | Khang ⇄ Đăng test code của nhau; Hiền ⇄ Tài test giao diện của nhau |
| Hiểu code của mình | Thầy sẽ chọn ngẫu nhiên 1 prompt và hỏi "tại sao em hỏi như vậy?" |
