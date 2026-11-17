# PLAN.md - LHU Second Brain (Kho lưu trữ tài liệu cá nhân)

> Học phần 111101 - Thiết kế Web · Đại học Lạc Hồng · Đề tài 2.4.3 (EdTech): Personal Knowledge Base
> Phiên bản v1.1, lập ở buổi Sprint Planning đầu buổi làm việc. **Dự án chạy trong 120 phút** (xem mục 10). Muốn thay đổi kế hoạch: sửa file này bằng Pull Request để cả nhóm cùng thấy.
> Chỗ có dấu `[...]` là thông tin nhóm cần điền.

---

## 1. Thông tin chung

| Mục | Nội dung |
|---|---|
| Tên dự án (tạm) | **LHU Second Brain** (nhóm có thể đổi tên) |
| Nhóm / Lớp | Nhóm 6 / 25CT112 |
| Giảng viên (Product Owner) | Nguyễn Minh Phúc |
| Repository | https://github.com/Trhieu18112007/HeThongKhoLuuTruTaiLieuCaNhan---Personal-Knowledge-Base |
| Live Demo | https://trhieu18112007.github.io/HeThongKhoLuuTruTaiLieuCaNhan---Personal-Knowledge-Base/ (bật ở KB-06) |
| Thời gian thực hiện | 120 phút: **13:15 đến 15:15** |

### Thành viên và vai trò

| Thành viên | Vai trò Scrum | Vai trò kỹ thuật | Phạm vi file |
|---|---|---|---|
| Hiếu (`@TrHieu18112007`, nhóm trưởng) | Scrum Master | Data + Quản lý repo | `data.js`, `storage.js`, `README.md`, `PLAN.md` |
| Hiền (Nguyễn Thanh Hiền, `@NGUYENTHANHHIEN26`) | Dev Team | UI/UX | `css/style.css`, `index.html`, `library.html` |
| Khang (Hà Lưu Nhật Khang, `@KhangHa2007`) | Dev Team | Logic dữ liệu | `js/logic.js` (+ `js/logic.test.js`) |
| Đăng (Hoàng Hải Đăng, `@Ttrandangkhoa98`) | Dev Team | Tương tác DOM (Home + Library) | `js/ui.js`, `js/app.js` |
| Tài (Tran Tan Tai, `@Trantantai1`) | Dev Team | Trang chi tiết, ghi chú, form thêm tài liệu | `detail.html`, `add.html`, `js/detail.js`, `js/add.js`, `css/detail.css` |

> **Lưu ý tên:** **Hiếu** (nhóm trưởng) và **Hiền** (UI/UX) là hai người khác nhau, tên chỉ khác một chữ. Trong Issue, Pull Request và tin nhắn nên ghi kèm vai trò hoặc `@username` GitHub để khỏi giao nhầm việc. Ở các mục sau, "Nhóm trưởng" = Hiếu.

---

## 2. Bài toán (Driving Question)

> **Làm thế nào để sinh viên LHU gom tài liệu học tập (PDF, video, liên kết) về một nơi, tìm lại nhanh theo từ khóa, tag hoặc định dạng, và ghi chú ngay khi đọc, thay vì để rải rác khắp nơi?**

### Vấn đề thực tế
Sinh viên lưu tài liệu ở nhiều chỗ (Zalo, Drive, bookmark trình duyệt, thư mục máy). Đến mùa thi hoặc làm đồ án thì mất thời gian tìm lại, quên mình đã ghi chú gì.

### Đối tượng người dùng
- Sinh viên LHU cần quản lý tài liệu học tập và tài liệu làm đồ án
- Nhu cầu chính: **thêm nhanh, tìm nhanh, ghi chú nhanh**

### Giá trị mang lại
Một "bộ não thứ hai" nhỏ gọn: mở là thấy tài liệu hay dùng, gõ tới đâu lọc tới đó, mỗi tài liệu có ô ghi chú riêng.

---

## 3. Phạm vi (Scope) theo nguyên tắc MVP

| Mức | Nội dung |
|---|---|
| **Must have (MVP)** | Xem danh sách dạng thẻ và dạng danh sách; tìm kiếm real-time; lọc theo định dạng và tag; trang chi tiết; ghi chú lưu được |
| **Should have** | Trang chủ có "Xem nhiều nhất" và "Mới thêm"; sắp xếp; form thêm tài liệu có validation; tăng lượt xem |
| **Could have** | Tài liệu liên quan theo tag; thống kê số tài liệu theo định dạng; tóm tắt AI giả lập (chuỗi mô phỏng, không gọi API thật) |
| **Won't have (ngoài phạm vi)** | Đăng nhập, backend/database, upload file thật, sơ đồ liên kết ý tưởng, AI tóm tắt thật |

Nguyên tắc Agile: **làm xong Must have chạy được trước**, rồi mới sang Should và Could. Vì chỉ có 120 phút, **Could have chỉ làm nếu còn dư giờ sau T+90** (xem mục 10).

---

## 4. Sơ đồ trang và User Flow

### Sơ đồ trang

```
                 +---------------------------+
                 |  index.html (Trang chủ)   |
                 +---------------------------+
                   |          |            |
            (search)     (card click)   (nút "Thêm")
                   v          v            v
         +----------------+  +-----------------+  +--------------+
         | library.html   |->| detail.html?id= |  |  add.html    |
         | (Kho tài liệu) |  | (Chi tiết+Note) |  | (Thêm tài    |
         +----------------+  +-----------------+  |  liệu: form) |
                  ^                  |            +--------------+
                  +------ quay lại --+                    |
                  ^---------------------------------------+ (lưu xong về library)
```

### User Flow chính

1. Vào **Trang chủ** thấy tài liệu xem nhiều nhất và mới thêm
2. Gõ từ khóa ở ô tìm kiếm → chuyển sang **Kho tài liệu** với kết quả đã lọc (qua `library.html?q=...`)
3. Tinh chỉnh bằng bộ lọc định dạng, tag, sắp xếp; đổi giữa Card view và List view
4. Bấm một tài liệu → **Trang chi tiết** (`detail.html?id=3`), lượt xem tăng 1
5. Viết ghi chú → bấm Lưu → quay lại lần sau vẫn còn ghi chú
6. Cần thêm tài liệu → trang **Thêm tài liệu** → điền form → hệ thống báo lỗi ngay khi gõ sai → Lưu → thấy trong Kho tài liệu

---

## 5. Mô tả chi tiết từng trang

### 5.1. Trang chủ `index.html`

- **Hero**: tiêu đề dự án + ô tìm kiếm nhanh (gửi sang `library.html?q=từ-khóa`)
- **Widget thống kê**: tổng số tài liệu, số lượng PDF / Video / Liên kết
- **Widget "Xem nhiều nhất"**: 5 tài liệu có `views` cao nhất
- **Widget "Mới thêm"**: 5 tài liệu có `addedAt` mới nhất
- Dữ liệu đổ **tự động** từ `KBStorage.getAllDocuments()` (không viết cứng HTML)
- Layout: CSS Grid/Flexbox, dùng thẻ Semantic (`header`, `nav`, `main`, `section`, `article`, `footer`)

```
+----------------------------------------------------------+
| LOGO  LHU Second Brain      Trang chủ | Kho | Thêm       |
+----------------------------------------------------------+
|        Gom tài liệu - Tìm nhanh - Ghi chú ngay           |
|        [ Tìm tài liệu...                    ] [Tìm]      |
+----------------------------------------------------------+
|  [ 14 Tài liệu ]  [ 5 PDF ]  [ 4 Video ]  [ 5 Link ]     |
+----------------------------------------------------------+
|  Xem nhiều nhất            |  Mới thêm                   |
|  [card] [card] [card]...   |  [card] [card] [card]...    |
+----------------------------------------------------------+
| Footer                                                   |
+----------------------------------------------------------+
```

### 5.2. Kho tài liệu `library.html`

- **Thanh công cụ**:
  - `<input type="search">` tìm theo tiêu đề, mô tả, tag
  - Bộ lọc định dạng: Tất cả / PDF / Video / Liên kết
  - Bộ lọc tag: các "chip" sinh tự động từ dữ liệu (bấm để bật/tắt)
  - Sắp xếp: Xem nhiều nhất / Mới nhất / Tên A→Z
  - Nút chuyển **Card view ⇄ List view**
- **Dòng kết quả**: "Tìm thấy N tài liệu"
- **Danh sách**: Card view (Grid 3 cột desktop, 2 cột tablet, 1 cột mobile) hoặc List view (mỗi dòng một tài liệu)
- **Trạng thái rỗng**: "Không tìm thấy tài liệu phù hợp" kèm nút "Xóa bộ lọc"
- Đọc tham số URL (`?q=`, `?type=`, `?tag=`) để nhận bộ lọc từ trang chủ

```
+----------------------------------------------------------+
| Navbar                                                   |
+----------------------------------------------------------+
| [ Tìm... ]  Định dạng [Tất cả v]  Sắp xếp [Mới nhất v]   |
| Tag: (html) (css) (javascript) (git) ...        [▦][≡]   |
| Tìm thấy 14 tài liệu                                     |
+----------------------------------------------------------+
| [Card] [Card] [Card]                                     |
| [Card] [Card] [Card]                                     |
+----------------------------------------------------------+
```

**Thẻ tài liệu (Card)** gồm: badge định dạng, tiêu đề, mô tả ngắn, các tag, số lượt xem, ngày thêm, liên kết sang trang chi tiết.

### 5.3. Trang chi tiết `detail.html?id=<id>`

- Đọc `id` từ URL, tìm tài liệu bằng `findById`
- Hiển thị: tiêu đề, badge định dạng, mô tả, tag, ngày thêm, lượt xem
- Nút "Mở tài liệu" (mở `url` ở tab mới)
- **Ô ghi chú**:
  - `<textarea>` tối đa 500 ký tự, đếm ký tự trực tiếp ("123/500")
  - Nút Lưu, nút Xóa ghi chú
  - Báo lỗi nếu ghi chú rỗng khi bấm Lưu; hiện toast "Đã lưu" khi thành công
- **Tài liệu liên quan** (Could have): các tài liệu khác trùng tag
- Nếu `id` không tồn tại: hiện thông báo "Không tìm thấy tài liệu" + link về Kho
- Khi mở trang: gọi `KBStorage.increaseViews(id)` đúng **1 lần**

### 5.4. Trang thêm tài liệu `add.html` (trang Form & Validation)

| Trường | Quy tắc kiểm tra | Thông báo lỗi mẫu |
|---|---|---|
| Tiêu đề | Bắt buộc, 3-100 ký tự | "Tiêu đề cần từ 3 đến 100 ký tự" |
| Định dạng | Bắt buộc chọn pdf/video/link | "Hãy chọn định dạng" |
| Đường dẫn | Regex URL hợp lệ (http/https) hoặc để trống cho PDF | "Đường dẫn chưa đúng định dạng" |
| Tag | Tách bằng dấu phẩy, tối đa 5 tag, mỗi tag 2-20 ký tự. Trước khi lưu phải **chuẩn hóa** cho đúng Data Contract: chữ thường, bỏ dấu, khoảng trắng thành `-` (VD `Ôn thi` → `on-thi`) | "Tối đa 5 tag" |
| Mô tả | Tối đa 200 ký tự, có bộ đếm | "Mô tả tối đa 200 ký tự" |

- Báo lỗi **ngay khi gõ** (sự kiện `input`/`blur`), nút Lưu bị vô hiệu cho đến khi form hợp lệ
- Lưu thành công: gọi `KBStorage.addDocument(...)`; nếu hàm trả về `null` thì báo "Không lưu được", ngược lại hiện toast, chờ khoảng 1 giây rồi chuyển sang `library.html`

---

## 6. User Stories và tiêu chí chấp nhận

| ID | User Story | Tiêu chí chấp nhận (Acceptance Criteria) | Ưu tiên |
|---|---|---|---|
| US-01 | Là sinh viên, tôi muốn xem tài liệu dạng thẻ để duyệt nhanh | Có ≥ 12 thẻ render từ mảng; không có tài liệu nào viết cứng trong HTML | Must |
| US-02 | Tôi muốn gõ từ khóa và thấy kết quả ngay | Gõ tới đâu lọc tới đó, không tải lại trang; không phân biệt hoa/thường; tìm cả tiêu đề, mô tả, tag | Must |
| US-03 | Tôi muốn lọc theo định dạng PDF/Video/Liên kết | Chọn định dạng thì chỉ còn đúng loại đó; kết hợp được với từ khóa | Must |
| US-04 | Tôi muốn lọc theo tag | Bấm tag thì lọc theo tag; bấm lại để bỏ; số kết quả cập nhật | Must |
| US-05 | Tôi muốn đổi giữa Card view và List view | Bấm nút đổi ngay; giữ nguyên bộ lọc đang chọn | Must |
| US-06 | Tôi muốn mở trang chi tiết của một tài liệu | `detail.html?id=` hiện đúng tài liệu; id sai thì báo không tìm thấy | Must |
| US-07 | Tôi muốn ghi chú và lưu lại | Lưu được, tải lại trang vẫn còn; có đếm ký tự; báo lỗi nếu rỗng | Must |
| US-08 | Tôi muốn trang chủ cho thấy tài liệu nổi bật | Có "Xem nhiều nhất" (5) và "Mới thêm" (5), đúng thứ tự | Should |
| US-09 | Tôi muốn sắp xếp danh sách | Sắp theo lượt xem, ngày thêm, tên A→Z | Should |
| US-10 | Tôi muốn thêm tài liệu mới bằng form | Form có validation theo mục 5.4; tài liệu mới xuất hiện trong Kho | Should |
| US-11 | Tôi muốn thấy tài liệu liên quan | Hiện tối đa 3 tài liệu trùng tag trong trang chi tiết | Could |

---

## 7. Hợp đồng dữ liệu (Data Contract)

Nguồn chân lý: `js/data.js`. Mỗi tài liệu có **đúng** các thuộc tính sau:

| Thuộc tính | Kiểu | Quy ước |
|---|---|---|
| `id` | number | Duy nhất; mẫu 1-999; do người dùng thêm từ 1000 |
| `title` | string | 3-100 ký tự |
| `type` | string | Chỉ `"pdf"`, `"video"` hoặc `"link"` |
| `tags` | string[] | Chữ thường, không dấu, nối bằng gạch ngang (`on-thi`, `lam-nhom`) |
| `description` | string | Tối đa 200 ký tự |
| `url` | string | `"#"` nếu chưa có |
| `views` | number | ≥ 0 |
| `addedAt` | string | `"YYYY-MM-DD"` |
| `note` | string | `""` nếu chưa có |

**Cấm** tự đặt tên khác (`ten`, `name`, `loai`, `tag`...). Cần thêm thuộc tính thì báo nhóm trưởng, sửa `data.js` và bảng này trong cùng một Pull Request.

### Dữ liệu lưu trong localStorage (quản lý bởi `js/storage.js`)

| Key | Nội dung |
|---|---|
| `kb_user_docs` | Mảng tài liệu người dùng thêm (cùng cấu trúc trên) |
| `kb_notes` | `{ "<id>": "nội dung ghi chú" }` |
| `kb_views` | `{ "<id>": số lượt xem tăng thêm }` |

Mọi người **chỉ dùng `KBStorage`**, không gọi `localStorage` trực tiếp.

---

## 8. Kiến trúc mã nguồn

### Cấu trúc thư mục

```
/du-an-nhom-x
├── /assets            ảnh, icon, font
├── /css
│   ├── style.css      (Hiền) biến :root, layout, card, list, responsive
│   └── detail.css     (Tài)  riêng cho trang chi tiết và trang thêm
├── /js
│   ├── data.js        (Nhóm trưởng) dữ liệu mẫu DOCUMENTS
│   ├── storage.js     (Nhóm trưởng) lớp KBStorage
│   ├── logic.js       (Khang) hàm thuần, không đụng DOM
│   ├── logic.test.js  (Khang) kiểm thử bằng console.assert
│   ├── ui.js          (Đăng) hàm hiển thị: renderCards, renderList...
│   ├── app.js         (Đăng) gắn sự kiện, điều phối trang chủ và Kho
│   ├── detail.js      (Tài)  trang chi tiết + ghi chú
│   └── add.js         (Tài)  form thêm tài liệu + validation
├── /docs              wireframe, BACKLOG.md, components.md (snippet Navbar/Footer), screenshots/
├── index.html         (Hiền)
├── library.html       (Hiền)
├── detail.html        (Tài)
├── add.html           (Tài)
├── README.md
├── HUONG_DAN.md       (Hiếu) cách tạo repo, Issue, deploy
├── PLAN.md
└── prompt_log.md
```

### Thứ tự nạp script (bắt buộc đúng thứ tự)

| Trang | Thứ tự `<script>` ở cuối `<body>` |
|---|---|
| `index.html`, `library.html` | `data.js` → `storage.js` → `logic.js` → `ui.js` → `app.js` |
| `detail.html` | `data.js` → `storage.js` → `logic.js` → `detail.js` |
| `add.html` | `data.js` → `storage.js` → `add.js` |

### Chữ ký hàm trong `logic.js` (Khang viết, Đăng và Tài gọi)

Tất cả là **hàm thuần**: nhận mảng vào, trả mảng/giá trị mới, **không sửa mảng gốc**, **không đụng DOM**.

| Hàm | Tham số | Trả về |
|---|---|---|
| `filterByKeyword(docs, keyword)` | `keyword` rỗng → trả toàn bộ; so khớp không phân biệt hoa/thường, tìm trong `title`, `description`, `tags` | mảng đã lọc |
| `filterByType(docs, type)` | `type` là `"all"` hoặc `"pdf"/"video"/"link"` | mảng đã lọc |
| `filterByTag(docs, tag)` | `tag` rỗng → trả toàn bộ | mảng đã lọc |
| `sortByViews(docs, order = "desc")` | `order`: `"asc"`/`"desc"` | mảng mới đã sắp |
| `sortByDate(docs, order = "desc")` | so sánh theo `addedAt` | mảng mới đã sắp |
| `sortByTitle(docs)` | A→Z, hỗ trợ tiếng Việt (`localeCompare`) | mảng mới đã sắp |
| `getTopViewed(docs, n = 5)` | n phần tử xem nhiều nhất | mảng |
| `getRecent(docs, n = 5)` | n phần tử mới thêm nhất | mảng |
| `getAllTags(docs)` | không trùng, sắp A→Z | `string[]` |
| `countByType(docs)` | | `{ pdf: 5, video: 4, link: 5 }` |
| `findById(docs, id)` | `id` là number | tài liệu hoặc `null` |
| `findRelated(docs, doc, n = 3)` | cùng tag với `doc`, bỏ chính nó | mảng |
| `applyFilters(docs, options)` | `options = { keyword, type, tag, sortBy }`, `sortBy` là `"views"`/`"date"`/`"title"` | mảng đã lọc + sắp xếp (gọi các hàm ở trên) |

### Hàm trong `ui.js` (Đăng)

`renderCards(docs, container)`, `renderList(docs, container)`, `renderTagChips(tags, container, activeTag)`, `renderResultCount(count, el)`, `renderEmptyState(container)`, `renderHomeWidgets(docs)`.

### Quy ước chung

- Biến/hàm: tiếng Anh, `camelCase`; hằng số: `UPPER_SNAKE_CASE`; class CSS: `kebab-case`
- **Tiền tố CSS**: Hiền dùng `.kb-`, Tài dùng `.dt-` (VD `.kb-card`, `.dt-note-box`)
- Mỗi hàm có 1 dòng comment mô tả; không để `console.log` thừa khi nộp
- Navbar/Footer: Hiền cung cấp snippet trong `docs/components.md`, Tài copy nguyên xi; Hiền đổi thì phải báo Tài
- Màu chủ đạo xanh - trắng theo nhận diện LHU, định nghĩa trong `:root` (Hiền)

---

## 9. Đáp ứng yêu cầu của đề và 3 thử thách

| Yêu cầu | Cách đáp ứng |
|---|---|
| **Thử thách Dynamic** | Mọi thẻ/danh sách render từ `DOCUMENTS` bằng `map()`, HTML không viết cứng tài liệu |
| **Thử thách UX Real-time** | Ô tìm kiếm lọc ngay khi gõ (sự kiện `input`); form thêm tài liệu báo lỗi khi gõ; bộ đếm ký tự ghi chú |
| **Thử thách Clean Code** | Tách module `data.js` / `storage.js` / `logic.js` / `ui.js` / `app.js` |
| HTML5 | Thẻ Semantic; `<input type="search">`; Form đủ các loại input; thuộc tính `data-*` lưu id/tag trên thẻ |
| CSS3 | Grid cho Card view, Flexbox cho List view, hover, transition, Responsive 3 mốc (desktop/tablet/mobile) |
| JavaScript | `map`, `filter`, `sort`, xử lý sự kiện `input`/`click`/`submit`, Regex, localStorage |
| ≥ 3 trang | `index.html`, `library.html`, `detail.html` (+ `add.html`) |
| AI Integration | Ghi lại prompt trong `prompt_log.md`, có minh chứng sửa lỗi |

---

## 10. Kế hoạch 120 phút (2 Sprint ngắn)

Toàn bộ dự án chạy trong **120 phút**. Mốc tính bằng phút kể từ lúc bắt đầu (**T+0**). Bắt đầu 13:15, kết thúc 15:15.

**Quy đổi giờ:** T+0 = 13:15 · T+10 = 13:25 · T+15 = 13:30 · T+20 = 13:35 · T+30 = 13:45 · T+45 = 14:00 · T+55 = 14:10 · T+60 = 14:15 · T+70 = 14:25 · T+90 = 14:45 · T+95 = 14:50 · T+100 = 14:55 · T+105 = 15:00 · T+115 = 15:10 · T+120 = 15:15

**Nguyên tắc:** làm xong Must have chạy được trước; Should/Could chỉ làm khi còn giờ. **Đóng băng code lúc T+105**: 15 phút cuối chỉ kiểm tra và sửa lỗi, không thêm tính năng mới.

### Sprint Planning (T+0 đến T+10)

Hiếu chốt phạm vi MVP và mốc giờ; mỗi người nhận Issue của mình (20 Issue trong `docs/BACKLOG.md`). Trong lúc Hiếu tạo repo (xong trước **T+15**), các bạn đọc mục 7 và 8 và dựng khung file trên máy.

### Sprint 1 (T+10 đến T+55): Khung và giao diện tĩnh

**Mục tiêu:** có repo, dữ liệu chung, khung giao diện, hàm lọc đầu tiên chạy được.

| Người | Việc | Hạn |
|---|---|---|
| Hiếu | Tạo repo, mời 4 bạn, push `data.js`/`storage.js`/`PLAN.md` lên `main`, rồi mới bật bảo vệ `main`; tạo bảng Kanban và Issue Sprint 1; deploy thử GitHub Pages | Repo xong T+15 |
| Hiền | Wireframe (chụp tay hoặc dùng ASCII ở mục 5, lưu vào `docs/`), `:root`, Navbar/Footer vào `docs/components.md` (**Tài đang chờ**), khung `index.html` và `library.html` | Snippet T+20, giao diện tĩnh T+45 |
| Khang | Khung `logic.js` đủ 13 chữ ký hàm (gửi sớm cho Đăng và Tài), rồi 3 hàm lọc và `applyFilters` | Chữ ký T+15, chạy trong console T+45 |
| Đăng | Khung `ui.js`/`app.js`; render thử danh sách từ `DOCUMENTS` | Hiện được thẻ T+45 |
| Tài | Khung `detail.html` (đọc `id` từ URL, hiện 1 tài liệu) và `add.html` | T+45 |

**Sprint Review (T+55 đến T+60):** demo giao diện tĩnh + dữ liệu, mỗi người 1 phút.

### Sprint 2 (T+60 đến T+105): Logic và tinh chỉnh

| Người | Việc | Hạn |
|---|---|---|
| Hiếu | Review PR (mỗi PR không quá 5 phút) và merge ngay; deploy GitHub Pages; `README.md` | Web chạy Live trước T+90 |
| Hiền | Card/List hoàn chỉnh, Responsive, trạng thái rỗng, hover | T+95 |
| Khang | Các hàm còn lại trong mục 8 + `logic.test.js` | Mọi `console.assert` đạt trước T+95 |
| Đăng | Search real-time, lọc tag/định dạng, đổi view, widget trang chủ, tham số URL | T+100 |
| Tài | Ghi chú, tăng lượt xem, form thêm tài liệu + Regex; tài liệu liên quan nếu còn giờ | T+100 |

### Chốt (T+105 đến T+120)

- Chạy checklist Definition of Done (mục 12): Console không lỗi, thử trên điện thoại (DevTools), test chéo
- Mỗi người bổ sung `prompt_log.md`; Hiếu merge lần cuối và deploy lại
- Video demo, PDF nhật ký và Pitching 5 phút **không nằm trong 120 phút** (xem mục 15)

### Nhịp họp

| Họp | Khi nào | Nội dung |
|---|---|---|
| Sprint Planning | T+0 đến T+10 | Chọn Issue, gán người, chốt mốc giờ |
| Check-in nhanh | T+30, T+60 (cùng Review), T+90; mỗi lần không quá 5 phút | Đã làm gì / Đang làm gì / Vướng gì |
| Sprint Review | T+55 đến T+60 | Demo cho nhau xem |
| Retrospective | T+115 đến T+120 | 3 câu: *làm tốt gì / chưa tốt gì / lần sau đổi gì* |

---

## 11. Quy trình Git

1. **`main`** chỉ chứa code chạy được, có thể demo. **Không push thẳng lên `main`.**
2. Mỗi tính năng làm trên **nhánh riêng** tạo từ `main`:

| Người | Nhánh |
|---|---|
| Nhóm trưởng | `feature-data`, `docs-readme` |
| Hiền | `feature-layout`, `feature-card-list` |
| Khang | `feature-filter-logic` |
| Đăng | `feature-search-ui` |
| Tài | `feature-detail-note`, `feature-add-form` |

3. **Commit nhỏ và đều đặn**, mẫu: `[Tên-Tính-Năng] Mô tả ngắn`
   - `[Logic] Thêm hàm filterByKeyword`
   - `[UI] Hoàn thiện Card view`
   - `[Note] Lưu ghi chú có validation`
4. Làm xong tính năng → mở **Pull Request** → nhóm trưởng nhờ AI kiểm tra xung đột tên biến/hàm → merge.
5. Mỗi người **chỉ sửa file của mình**. Cần sửa file người khác: nhắn người đó hoặc mở Issue.
6. Trước khi bắt đầu làm: `git pull` nhánh `main` về để cập nhật.

### GitHub Projects (Kanban)

Ba cột: **To-do → In Progress → Done** (Done = đã merge vào `main`). Mỗi Issue có người phụ trách và nhãn `sprint-1`/`sprint-2`. Chi tiết xem `docs/BACKLOG.md`.

---

## 12. Definition of Done

Một tính năng chỉ được chuyển sang **Done** khi:

- [ ] Chạy đúng logic theo tiêu chí chấp nhận của Issue
- [ ] Không có lỗi trong Console của trình duyệt
- [ ] Hiển thị tốt trên Mobile (kiểm tra bằng DevTools hoặc điện thoại thật)
- [ ] Code sạch: tên rõ nghĩa, có comment, đã qua AI Refactor
- [ ] Đã được người khác trong nhóm test chéo
- [ ] Đã merge vào `main` qua Pull Request
- [ ] Prompt dùng để làm tính năng đã ghi vào `prompt_log.md`

---

## 13. Rủi ro và cách xử lý

| Rủi ro | Cách phòng tránh / xử lý |
|---|---|
| Hai người sửa cùng một file, xung đột code | Chia file theo người; làm trên nhánh riêng; mọi thay đổi qua PR |
| Mỗi người đặt tên thuộc tính khác nhau | Data Contract mục 7; hàm chỉ dùng thuộc tính trong hợp đồng |
| Một người trễ việc, kéo cả nhóm | Check-in T+30/T+60/T+90 phát hiện sớm; việc gối đầu có "dữ liệu giả" để làm song song |
| Dồn commit vào phút cuối | Commit nhỏ khoảng 15 phút một lần; Hiếu xem lịch sử commit ở mỗi lần check-in |
| Hết giờ khi Must have chưa xong | Cắt Could rồi Should trước; đóng băng code lúc T+105; luôn giữ `main` ở trạng thái chạy được |
| AI sinh code quá phức tạp, không ai hiểu | Yêu cầu AI viết lại đơn giản; mỗi người phải giải thích được code của mình |
| Giao diện vỡ trên điện thoại | Test Mobile ngay từ Sprint 1, thêm `<meta name="viewport">` |
| Mất dữ liệu localStorage khi demo | Trước demo, chạy thử trên đúng trình duyệt sẽ dùng; chuẩn bị video demo dự phòng |
| Lỗi deploy GitHub Pages phút chót | Deploy thử từ Sprint 1, không chờ đến cuối |

---

## 14. Checklist PBL Milestone 1 (cuối Sprint 1, khoảng T+55)

- [ ] Có file `PLAN.md` mô tả chi tiết chức năng (file này)
- [ ] Cấu trúc dữ liệu Object hoàn thiện và đã nhờ AI kiểm tra logic (`data.js`)
- [ ] Phân chia công việc rõ ràng trên GitHub (Issue có người phụ trách)
- [ ] Có ít nhất 01 bản vẽ Wireframe trong `docs/`

## 15. Checklist nộp bài (cuối buổi / trước Hackathon)

> Video demo, PDF nhật ký và Pitching 5 phút **không nằm trong 120 phút**; làm sau theo hạn của giảng viên [ngày]. Issue tương ứng ở mục "Sau 120 phút" của `docs/BACKLOG.md` (KB-08, KB-47, KB-48).

- [ ] Repository GitHub có đầy đủ các Task đã hoàn thành
- [ ] File `prompt_log.md` ghi lại hành trình làm việc với AI
- [ ] File PDF "Nhật ký đồng hành cùng AI" (5-10 prompt quan trọng, ảnh chụp lỗi + cách sửa)
- [ ] Video demo 3-5 phút
- [ ] Bản Pitching ngắn gọn
- [ ] Website chạy **Live** trên GitHub Pages/Vercel
- [ ] `README.md` đủ: tên dự án + thành viên + vai trò, mô tả bài toán, link Live Demo, 3-5 prompt nổi bật
