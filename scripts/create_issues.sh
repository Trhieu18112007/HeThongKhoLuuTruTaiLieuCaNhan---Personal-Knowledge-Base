#!/usr/bin/env bash
# create_issues.sh - Tạo nhãn + 20 Issue cho dự án LHU Second Brain (Nhóm 6, lớp 25CT112).
# Chạy bằng Git Bash (Windows) / Terminal (macOS, Linux). Cần: GitHub CLI (gh) đã đăng nhập (gh auth login).
# Chạy lại an toàn: Issue đã có (trùng mã KB-xx ở đầu tiêu đề) sẽ được bỏ qua.
# Muốn tạo cả 4 Issue "sau 120 phút":  CREATE_LATER=1 bash scripts/create_issues.sh

REPO="Trhieu18112007/HeThongKhoLuuTruTaiLieuCaNhan---Personal-Knowledge-Base"

if ! command -v gh >/dev/null 2>&1; then echo "Chưa cài GitHub CLI (gh). Xem HUONG_DAN.md."; exit 1; fi
if ! gh auth status >/dev/null 2>&1; then echo "Chưa đăng nhập. Chạy: gh auth login"; exit 1; fi

echo "== Tạo nhãn =="
label() { gh label create "$1" --color "$2" --description "$3" --repo "$REPO" --force >/dev/null 2>&1 && echo "  nhãn $1" || echo "  LỖI nhãn $1"; }
label sprint-1 1D76DB "Sprint 1: T+10 đến T+55"
label sprint-2 5319E7 "Sprint 2: T+60 đến T+105"
label sau-120p 6A737D "Làm sau 120 phút"
label ui FBCA04 "Giao diện"
label logic 0E8A16 "Logic dữ liệu"
label dom 006B75 "Tương tác DOM"
label form D93F0B "Form và validation"
label data B60205 "Dữ liệu"
label docs C5DEF5 "Tài liệu"
label must 000000 "Must have"
label should E99695 "Should have"
label could F9D0C4 "Could have"

EXISTING=$(gh issue list --repo "$REPO" --state all --limit 300 --json title -q ".[].title" 2>/dev/null)

# issue <mã> <tiêu đề> <assignee> <nhãn cách nhau bằng dấu phẩy> <nội dung>
issue() {
  local id="$1" title="$2" who="$3" labels="$4" body="$5"
  if printf "%s\n" "$EXISTING" | grep -qF "$id ·"; then echo "BỎ QUA (đã có) $id"; return; fi
  if gh issue create --repo "$REPO" --title "$id · $title" --assignee "$who" --label "$labels" --body "$body" ; then
    return
  fi
  echo "  -> Không gán được @$who (chưa nhận lời mời Collaborator?). Tạo không gán người, gán lại sau."
  gh issue create --repo "$REPO" --title "$id · $title" --label "$labels" --body "$body" || echo "LỖI $id"
}

echo "== Tạo Issue Sprint 1 và Sprint 2 =="
BODY=$(cat <<'ISSUE_EOF'
**Người phụ trách:** Hiếu (@TrHieu18112007) · **Sprint 1** · **Hạn:** T+15 (13:30) · **Nhánh:** `main` · **Nhãn:** `sprint-1`, `docs`, `data`, `must`

**Mô tả:** Làm đầu tiên để 4 bạn làm song song. Repo + `data.js` + `storage.js` lên `main` trước T+15; Issue và bảng Kanban xong trước T+20. Làm theo `HUONG_DAN.md`.

**Tiêu chí hoàn thành:**
- [ ] Repo có `assets/`, `css/`, `js/`, `docs/`, 4 trang HTML, `README.md`, `PLAN.md`, `prompt_log.md`
- [ ] `main` có `data.js`, `storage.js`; Console chạy `KBStorage.getAllDocuments()` trả đủ 14 tài liệu
- [ ] 4 thành viên đã nhận lời mời Collaborator và clone được repo
- [ ] Bật branch protection cho `main` **sau** lần push đầu tiên
- [ ] Đủ 20 Issue, mỗi Issue có người phụ trách + nhãn sprint; Project có 3 cột To-do / In Progress / Done
- [ ] Có `docs/wireframe.md` (đạt Milestone 1)

**Gợi ý prompt AI:** *"Hãy kiểm tra mảng DOCUMENTS này: tìm id trùng, tag không đúng quy ước chữ thường không dấu, type không thuộc pdf/video/link, ngày không đúng YYYY-MM-DD."*

_Commit/PR nhắc số Issue, ví dụ `[Logic] Thêm hàm filterByKeyword (KB-01)`._
ISSUE_EOF
)
issue "KB-01" "Khởi tạo repo, Data Contract, Kanban và wireframe" "TrHieu18112007" "sprint-1,docs,data,must" "$BODY"

BODY=$(cat <<'ISSUE_EOF'
**Người phụ trách:** Hiếu (@TrHieu18112007) · **Sprint 2** · **Hạn:** T+105 (15:00) · **Nhánh:** (không có) · **Nhãn:** `sprint-2`, `docs`, `must`

**Mô tả:** Từ T+30 đến T+105: với mỗi PR, kiểm tra phạm vi file, nhờ AI tìm xung đột tên biến/hàm rồi merge ngay. Mỗi PR không quá 5 phút.

**Tiêu chí hoàn thành:**
- [ ] Không PR nào chờ quá 5 phút khi Hiếu đang rảnh
- [ ] Mỗi PR chỉ sửa file thuộc phạm vi của người gửi
- [ ] `main` luôn chạy được sau mỗi lần merge

**Gợi ý prompt AI:** *"Đây là code của bạn A (logic.js) và bạn B (ui.js). Hãy kiểm tra có xung đột về tên biến, tên hàm hoặc cách gọi hàm không trước khi tôi merge."*

_Commit/PR nhắc số Issue, ví dụ `[Logic] Thêm hàm filterByKeyword (KB-05)`._
ISSUE_EOF
)
issue "KB-05" "Review và merge Pull Request (việc liên tục)" "TrHieu18112007" "sprint-2,docs,must" "$BODY"

BODY=$(cat <<'ISSUE_EOF'
**Người phụ trách:** Hiếu (@TrHieu18112007) · **Sprint 2** · **Hạn:** T+90 (14:45) · **Nhánh:** `docs-readme` · **Nhãn:** `sprint-2`, `docs`, `must`

**Mô tả:** Bật Pages ngay khi Hiền merge khung giao diện (khoảng T+45), kiểm tra link lúc T+60. README viết xong bản đầu trước T+90, phần prompt nổi bật điền ở T+105-T+115.

**Tiêu chí hoàn thành:**
- [ ] Web chạy Live, mở được trên điện thoại
- [ ] Đường dẫn css/js/ảnh dùng đường dẫn tương đối (`css/style.css`, không bắt đầu bằng `/`)
- [ ] README có tên dự án, thành viên + vai trò, bài toán, tính năng, hướng dẫn chạy, link Live Demo
- [ ] README có 3-5 prompt nổi bật nhất (điền ở bước Chốt)

_Commit/PR nhắc số Issue, ví dụ `[Logic] Thêm hàm filterByKeyword (KB-06)`._
ISSUE_EOF
)
issue "KB-06" "Deploy GitHub Pages và viết README.md" "TrHieu18112007" "sprint-2,docs,must" "$BODY"

BODY=$(cat <<'ISSUE_EOF'
**Người phụ trách:** Hiền (@NGUYENTHANHHIEN26) · **Sprint 1** · **Hạn:** T+20 (13:35) · **Nhánh:** `feature-layout` · **Nhãn:** `sprint-1`, `ui`, `must`

**Mô tả:** Định nghĩa màu xanh - trắng theo LHU, font, khoảng cách, bo góc trong `css/style.css`.

**Tiêu chí hoàn thành:**
- [ ] Có biến cho: màu chính, màu phụ, nền, chữ, viền, bo góc, bóng đổ, khoảng cách
- [ ] Mọi màu dùng `var(--...)`, không viết mã màu rải rác
- [ ] Dùng font hỗ trợ tiếng Việt, hiển thị đúng dấu
- [ ] Class có tiền tố `kb-`

**Gợi ý prompt AI:** *"Tạo bộ biến CSS :root theo tông xanh - trắng của trường đại học, gồm màu chính, màu nhấn, màu nền, màu chữ, bo góc và đổ bóng. Chỉ trả về khối :root và phần reset cơ bản."*

_Commit/PR nhắc số Issue, ví dụ `[Logic] Thêm hàm filterByKeyword (KB-11)`._
ISSUE_EOF
)
issue "KB-11" "Biến \`:root\`, reset và typography" "NGUYENTHANHHIEN26" "sprint-1,ui,must" "$BODY"

BODY=$(cat <<'ISSUE_EOF'
**Người phụ trách:** Hiền (@NGUYENTHANHHIEN26) · **Sprint 1** · **Hạn:** T+20 (13:35) · **Nhánh:** `feature-layout` · **Nhãn:** `sprint-1`, `ui`, `must`

**Mô tả:** **Tài đang chờ việc này.** Làm Navbar (Trang chủ / Kho tài liệu / Thêm tài liệu) và Footer; lưu đoạn HTML mẫu vào `docs/components.md` để Tài copy nguyên xi vào `detail.html` và `add.html`.

**Tiêu chí hoàn thành:**
- [ ] Navbar có menu thu gọn trên mobile
- [ ] Dùng thẻ Semantic (`header`, `nav`, `footer`)
- [ ] `docs/components.md` đã push và đã nhắn Tài
- [ ] Đường dẫn trong Navbar là tương đối (`library.html`, không `/library.html`)

_Commit/PR nhắc số Issue, ví dụ `[Logic] Thêm hàm filterByKeyword (KB-12)`._
ISSUE_EOF
)
issue "KB-12" "Navbar và Footer dùng chung + \`docs/components.md\`" "NGUYENTHANHHIEN26" "sprint-1,ui,must" "$BODY"

BODY=$(cat <<'ISSUE_EOF'
**Người phụ trách:** Hiền (@NGUYENTHANHHIEN26) · **Sprint 1** · **Hạn:** T+45 (14:00) · **Nhánh:** `feature-layout` · **Nhãn:** `sprint-1`, `ui`, `must`

**Mô tả:** Dựng khung tĩnh theo wireframe. Chừa sẵn container cho Đăng đổ dữ liệu: `#top-viewed`, `#recent`, `#stats`, `#doc-container`, `#tag-chips`, `#result-count`, `#search-input`, `#type-filter`, `#sort-select`, `#view-toggle`. **Nhắn Đăng danh sách id này trước T+25.**

**Tiêu chí hoàn thành:**
- [ ] Hai trang hiển thị đúng bố cục với dữ liệu giả
- [ ] Có `<input type="search">`, `<select>` định dạng, `<select>` sắp xếp, nút chuyển view
- [ ] Nạp script đúng thứ tự mục 8 `PLAN.md`; có `<meta name="viewport">`

_Commit/PR nhắc số Issue, ví dụ `[Logic] Thêm hàm filterByKeyword (KB-13)`._
ISSUE_EOF
)
issue "KB-13" "Khung HTML + CSS cho \`index.html\` và \`library.html\`" "NGUYENTHANHHIEN26" "sprint-1,ui,must" "$BODY"

BODY=$(cat <<'ISSUE_EOF'
**Người phụ trách:** Hiền (@NGUYENTHANHHIEN26) · **Sprint 2** · **Hạn:** T+95 (14:50) · **Nhánh:** `feature-card-list` · **Nhãn:** `sprint-2`, `ui`, `must`

**Mô tả:** Hoàn thiện hai kiểu hiển thị. **Nhắn Đăng tên class** của thẻ và class chuyển view (ví dụ `.kb-view-card` / `.kb-view-list`) ngay khi đặt xong.

**Tiêu chí hoàn thành:**
- [ ] Card: Grid 3 cột desktop, 2 cột tablet, 1 cột mobile; badge định dạng màu khác nhau; hover mượt
- [ ] List: mỗi tài liệu một dòng (badge, tiêu đề, tag, lượt xem, ngày); mobile không tràn ngang
- [ ] Đã báo Đăng tên class

_Commit/PR nhắc số Issue, ví dụ `[Logic] Thêm hàm filterByKeyword (KB-14)`._
ISSUE_EOF
)
issue "KB-14" "Card view (Grid) và List view (Flexbox)" "NGUYENTHANHHIEN26" "sprint-2,ui,must" "$BODY"

BODY=$(cat <<'ISSUE_EOF'
**Người phụ trách:** Hiền (@NGUYENTHANHHIEN26) · **Sprint 2** · **Hạn:** T+100 (14:55) · **Nhánh:** `feature-card-list` · **Nhãn:** `sprint-2`, `ui`, `must`

**Mô tả:** Style toast (thành công/lỗi) **trước T+70** để Tài và Đăng dùng chung; phần còn lại xong trước T+100.

**Tiêu chí hoàn thành:**
- [ ] Đẹp ở 360px, 768px, 1280px; không có thanh cuộn ngang
- [ ] Chip tag có trạng thái thường / hover / đang chọn (`.kb-chip--active`)
- [ ] Có style "Không tìm thấy tài liệu" kèm nút "Xóa bộ lọc"
- [ ] Có style toast; nút đủ lớn để chạm trên điện thoại

_Commit/PR nhắc số Issue, ví dụ `[Logic] Thêm hàm filterByKeyword (KB-17)`._
ISSUE_EOF
)
issue "KB-17" "Responsive, chip tag, trạng thái rỗng và toast" "NGUYENTHANHHIEN26" "sprint-2,ui,must" "$BODY"

BODY=$(cat <<'ISSUE_EOF'
**Người phụ trách:** Khang (@KhangHa2007) · **Sprint 1** · **Hạn:** T+15 (13:30) · **Nhánh:** `feature-filter-logic` · **Nhãn:** `sprint-1`, `logic`, `must`

**Mô tả:** Dựa trên bảng chữ ký ở `PLAN.md` mục 8, tạo khung `js/logic.js` (thân hàm tạm trả `docs`) và comment từng hàm. **Mở PR sớm** để Đăng và Tài gọi được ngay.

**Tiêu chí hoàn thành:**
- [ ] Đủ 13 hàm đúng tên và tham số như `PLAN.md`
- [ ] Mỗi hàm có comment: làm gì, tham số, trả về
- [ ] PR đã mở trước T+15

_Commit/PR nhắc số Issue, ví dụ `[Logic] Thêm hàm filterByKeyword (KB-20)`._
ISSUE_EOF
)
issue "KB-20" "Khung \`logic.js\` với đủ 13 chữ ký hàm" "KhangHa2007" "sprint-1,logic,must" "$BODY"

BODY=$(cat <<'ISSUE_EOF'
**Người phụ trách:** Khang (@KhangHa2007) · **Sprint 1** · **Hạn:** T+45 (14:00) · **Nhánh:** `feature-filter-logic` · **Nhãn:** `sprint-1`, `logic`, `must`

**Mô tả:** Ưu tiên `filterByKeyword`, `filterByType`, `filterByTag`, `applyFilters` xong trước T+45 (Đăng cần gọi). Các hàm sắp xếp và `findById` xong trước T+60.

**Tiêu chí hoàn thành:**
- [ ] `filterByKeyword`: không phân biệt hoa/thường; tìm trong `title`, `description`, `tags`; từ khóa rỗng → trả toàn bộ
- [ ] `filterByType(docs, "all")` trả toàn bộ; `filterByTag(docs, "")` trả toàn bộ
- [ ] `sortByViews`, `sortByDate`, `sortByTitle` trả **mảng mới** (không sửa mảng gốc); `sortByTitle` dùng `localeCompare("vi")`
- [ ] `findById` nhận id dạng chuỗi hoặc số; không thấy → `null`
- [ ] `applyFilters(docs, { keyword, type, tag, sortBy })` kết hợp được cả 3 bộ lọc; thiếu thuộc tính nào thì bỏ qua bộ lọc đó
- [ ] Chạy thử được trong Console

**Gợi ý prompt AI:** *"Viết hàm JavaScript thuần filterByKeyword(docs, keyword) lọc mảng tài liệu theo từ khóa không phân biệt hoa thường trong title, description và tags. Từ khóa rỗng trả toàn bộ. Không dùng DOM, không sửa mảng gốc."*

_Commit/PR nhắc số Issue, ví dụ `[Logic] Thêm hàm filterByKeyword (KB-21)`._
ISSUE_EOF
)
issue "KB-21" "Hàm lọc, sắp xếp, \`findById\` và \`applyFilters\`" "KhangHa2007" "sprint-1,logic,must" "$BODY"

BODY=$(cat <<'ISSUE_EOF'
**Người phụ trách:** Khang (@KhangHa2007) · **Sprint 2** · **Hạn:** T+90 (14:45) · **Nhánh:** `feature-filter-logic` · **Nhãn:** `sprint-2`, `logic`, `should`

**Mô tả:** Các hàm thống kê cho trang chủ và trang chi tiết.

**Tiêu chí hoàn thành:**
- [ ] `getTopViewed(docs, 5)` và `getRecent(docs, 5)` đúng thứ tự; ít hơn 5 tài liệu thì trả hết
- [ ] `getAllTags` không trùng, sắp A→Z
- [ ] `countByType` trả `{ pdf, video, link }`, kể cả loại có 0 tài liệu
- [ ] `findRelated` loại bỏ chính tài liệu đó, tối đa n kết quả

_Commit/PR nhắc số Issue, ví dụ `[Logic] Thêm hàm filterByKeyword (KB-23)`._
ISSUE_EOF
)
issue "KB-23" "\`getTopViewed\`, \`getRecent\`, \`getAllTags\`, \`countByType\`, \`findRelated\`" "KhangHa2007" "sprint-2,logic,should" "$BODY"

BODY=$(cat <<'ISSUE_EOF'
**Người phụ trách:** Khang (@KhangHa2007) · **Sprint 2** · **Hạn:** T+100 (14:55) · **Nhánh:** `feature-filter-logic` · **Nhãn:** `sprint-2`, `logic`, `must`

**Mô tả:** Viết ≥ 8 phép kiểm tra bằng `console.assert` trên dữ liệu mẫu. Sau đó test chéo code của Đăng.

**Tiêu chí hoàn thành:**
- [ ] Có test cho các trường hợp biên: từ khóa rỗng, không có kết quả, hoa/thường, tag không tồn tại
- [ ] Tất cả test đạt (không có dòng `Assertion failed`)
- [ ] Chụp ảnh Console đạt làm minh chứng, lưu vào `docs/screenshots/`

**Gợi ý prompt AI:** *"Viết các lệnh console.assert để kiểm tra hàm filterByKeyword, filterByType, filterByTag, applyFilters trên mảng DOCUMENTS, gồm cả trường hợp biên: từ khóa rỗng, không có kết quả, hoa/thường."*

_Commit/PR nhắc số Issue, ví dụ `[Logic] Thêm hàm filterByKeyword (KB-26)`._
ISSUE_EOF
)
issue "KB-26" "Kiểm thử \`logic.test.js\`" "KhangHa2007" "sprint-2,logic,must" "$BODY"

BODY=$(cat <<'ISSUE_EOF'
**Người phụ trách:** Đăng (@Ttrandangkhoa98) · **Sprint 1** · **Hạn:** T+45 (14:00) · **Nhánh:** `feature-search-ui` · **Nhãn:** `sprint-1`, `dom`, `must`

**Mô tả:** Dùng `KBStorage.getAllDocuments()` lấy dữ liệu, render bằng `map()` vào `#doc-container`. Đăng **chỉ gọi hàm** của Khang và `KBStorage`, không tự viết lại logic lọc.

**Tiêu chí hoàn thành:**
- [ ] Hiện ≥ 12 thẻ trên `library.html`, HTML không viết cứng tài liệu
- [ ] `ui.js` chỉ chứa hàm hiển thị; `app.js` chỉ gắn sự kiện và điều phối
- [ ] Không có biến toàn cục thừa; thoát ký tự HTML khi chèn tiêu đề/mô tả

**Gợi ý prompt AI:** *"Viết hàm renderCards(docs, container) dùng map() để tạo HTML cho mỗi tài liệu gồm badge định dạng, tiêu đề, mô tả, tag, lượt xem và link sang detail.html?id=. Dùng data-id lưu id."*

_Commit/PR nhắc số Issue, ví dụ `[Logic] Thêm hàm filterByKeyword (KB-30)`._
ISSUE_EOF
)
issue "KB-30" "Khung \`ui.js\`/\`app.js\` và render thử danh sách" "Ttrandangkhoa98" "sprint-1,dom,must" "$BODY"

BODY=$(cat <<'ISSUE_EOF'
**Người phụ trách:** Đăng (@Ttrandangkhoa98) · **Sprint 2** · **Hạn:** T+70 (14:25) · **Nhánh:** `feature-search-ui` · **Nhãn:** `sprint-2`, `dom`, `must`

**Mô tả:** Gõ tới đâu lọc tới đó.

**Tiêu chí hoàn thành:**
- [ ] Sự kiện `input`, không tải lại trang; gọi `applyFilters` của Khang
- [ ] Cập nhật dòng "Tìm thấy N tài liệu" mỗi lần lọc
- [ ] Không lỗi Console khi xóa hết chữ hoặc gõ ký tự đặc biệt

_Commit/PR nhắc số Issue, ví dụ `[Logic] Thêm hàm filterByKeyword (KB-31)`._
ISSUE_EOF
)
issue "KB-31" "Tìm kiếm real-time" "Ttrandangkhoa98" "sprint-2,dom,must" "$BODY"

BODY=$(cat <<'ISSUE_EOF'
**Người phụ trách:** Đăng (@Ttrandangkhoa98) · **Sprint 2** · **Hạn:** T+90 (14:45) · **Nhánh:** `feature-search-ui` · **Nhãn:** `sprint-2`, `dom`, `must`

**Mô tả:** Gắn các bộ lọc vào giao diện; dùng class Hiền cung cấp ở KB-14.

**Tiêu chí hoàn thành:**
- [ ] Chip tag sinh từ `getAllTags`, bấm để bật/tắt (`.kb-chip--active`), dùng event delegation
- [ ] Đổi định dạng hoặc sắp xếp thì cập nhật ngay; kết hợp được với ô tìm kiếm
- [ ] Nút đổi Card ⇄ List giữ nguyên bộ lọc đang chọn và hiển thị đúng trạng thái

_Commit/PR nhắc số Issue, ví dụ `[Logic] Thêm hàm filterByKeyword (KB-32)`._
ISSUE_EOF
)
issue "KB-32" "Bộ lọc định dạng, tag, sắp xếp và đổi Card ⇄ List" "Ttrandangkhoa98" "sprint-2,dom,must" "$BODY"

BODY=$(cat <<'ISSUE_EOF'
**Người phụ trách:** Đăng (@Ttrandangkhoa98) · **Sprint 2** · **Hạn:** T+100 (14:55) · **Nhánh:** `feature-search-ui` · **Nhãn:** `sprint-2`, `dom`, `should`

**Mô tả:** Làm xong phần Must trước; đây là phần Should.

**Tiêu chí hoàn thành:**
- [ ] "Xem nhiều nhất" dùng `getTopViewed(docs, 5)`, "Mới thêm" dùng `getRecent(docs, 5)`; thống kê dùng `countByType`
- [ ] Ô tìm kiếm ở hero chuyển sang `library.html?q=...`
- [ ] `library.html?q=css` tự điền ô tìm kiếm và lọc sẵn; hỗ trợ `?type=` và `?tag=`; tham số sai thì bỏ qua (dùng `URLSearchParams`)

**Gợi ý prompt AI:** *"Viết đoạn JavaScript đọc tham số q, type, tag từ URL bằng URLSearchParams, điền vào ô tìm kiếm và bộ lọc rồi gọi hàm render. Nếu tham số không hợp lệ thì dùng giá trị mặc định."*

_Commit/PR nhắc số Issue, ví dụ `[Logic] Thêm hàm filterByKeyword (KB-34)`._
ISSUE_EOF
)
issue "KB-34" "Widget trang chủ và tham số URL" "Ttrandangkhoa98" "sprint-2,dom,should" "$BODY"

BODY=$(cat <<'ISSUE_EOF'
**Người phụ trách:** Tài (@Trantantai1) · **Sprint 1** · **Hạn:** T+45 (14:00) · **Nhánh:** `feature-detail-note` · **Nhãn:** `sprint-1`, `ui`, `must`

**Mô tả:** Copy Navbar/Footer từ `docs/components.md` (Hiền sẽ push trước T+20), link `css/style.css` (chỉ đọc) và `css/detail.css` của mình (tiền tố `dt-`). Trong lúc chờ, dựng khung và đọc `id` từ URL.

**Tiêu chí hoàn thành:**
- [ ] Hai trang có khung đúng, nạp script đúng thứ tự mục 8 `PLAN.md`
- [ ] Không sửa `style.css`
- [ ] Có phác thảo wireframe `detail` và `add` (giấy hoặc ASCII) trong `docs/`

_Commit/PR nhắc số Issue, ví dụ `[Logic] Thêm hàm filterByKeyword (KB-40)`._
ISSUE_EOF
)
issue "KB-40" "Khung \`detail.html\` và \`add.html\`" "Trantantai1" "sprint-1,ui,must" "$BODY"

BODY=$(cat <<'ISSUE_EOF'
**Người phụ trách:** Tài (@Trantantai1) · **Sprint 2** · **Hạn:** T+70 (14:25) · **Nhánh:** `feature-detail-note` · **Nhãn:** `sprint-2`, `dom`, `must`

**Mô tả:** Đọc `id` từ URL, dùng `findById` của Khang.

**Tiêu chí hoàn thành:**
- [ ] `detail.html?id=3` hiện đúng tiêu đề, badge, mô tả, tag, ngày thêm, lượt xem
- [ ] Nút "Mở tài liệu" mở `url` ở tab mới (`rel="noopener"`); `url` là `"#"` thì ẩn hoặc vô hiệu nút
- [ ] `id` không tồn tại/không hợp lệ → "Không tìm thấy tài liệu" + link về Kho
- [ ] Mở trang → gọi `KBStorage.increaseViews(id)` đúng 1 lần

**Gợi ý prompt AI:** *"Viết JavaScript đọc tham số id từ URL, tìm tài liệu trong mảng bằng hàm findById, hiển thị lên các phần tử trang. Nếu không tìm thấy hoặc id không phải số thì hiện thông báo lỗi và link về trang kho tài liệu."*

_Commit/PR nhắc số Issue, ví dụ `[Logic] Thêm hàm filterByKeyword (KB-41)`._
ISSUE_EOF
)
issue "KB-41" "Trang chi tiết: hiển thị tài liệu và tăng lượt xem" "Trantantai1" "sprint-2,dom,must" "$BODY"

BODY=$(cat <<'ISSUE_EOF'
**Người phụ trách:** Tài (@Trantantai1) · **Sprint 2** · **Hạn:** T+90 (14:45) · **Nhánh:** `feature-detail-note` · **Nhãn:** `sprint-2`, `dom`, `form`, `must`

**Mô tả:** Dùng `KBStorage.getNote`, `saveNote`, `deleteNote`.

**Tiêu chí hoàn thành:**
- [ ] `<textarea>` hiện ghi chú đã lưu khi mở trang
- [ ] Bộ đếm "n/500" cập nhật theo từng ký tự; vượt giới hạn thì cảnh báo đỏ
- [ ] Lưu rỗng → báo lỗi, không lưu; lưu thành công → toast
- [ ] Nút Xóa có hỏi xác nhận (`confirm`); tải lại trang vẫn còn ghi chú

_Commit/PR nhắc số Issue, ví dụ `[Logic] Thêm hàm filterByKeyword (KB-43)`._
ISSUE_EOF
)
issue "KB-43" "Ô ghi chú (lưu, xóa, đếm ký tự, validation)" "Trantantai1" "sprint-2,dom,form,must" "$BODY"

BODY=$(cat <<'ISSUE_EOF'
**Người phụ trách:** Tài (@Trantantai1) · **Sprint 2** · **Hạn:** T+100 (14:55) · **Nhánh:** `feature-add-form` · **Nhãn:** `sprint-2`, `form`, `must`

**Mô tả:** Theo bảng quy tắc ở `PLAN.md` mục 5.4. Đây là trang đáp ứng yêu cầu Form + Regex của đề.

**Tiêu chí hoàn thành:**
- [ ] Dùng đủ `text`, `url`, `select`, `textarea` (HTML5 `required`, `maxlength`)
- [ ] Báo lỗi ngay dưới từng ô khi gõ/rời ô; Regex URL kiểm tra `http://` / `https://`
- [ ] Tag được chuẩn hóa trước khi lưu (chữ thường, bỏ dấu, khoảng trắng → `-`)
- [ ] Nút Lưu bị vô hiệu đến khi form hợp lệ; lưu bằng `KBStorage.addDocument`, toast, rồi chuyển sang `library.html`

**Gợi ý prompt AI:** *"Viết hàm JavaScript validateUrl(value) dùng Regex kiểm tra chuỗi bắt đầu bằng http:// hoặc https://, có tên miền hợp lệ. Cho tôi 5 ví dụ đúng và 5 ví dụ sai để tự kiểm tra."*

_Commit/PR nhắc số Issue, ví dụ `[Logic] Thêm hàm filterByKeyword (KB-44)`._
ISSUE_EOF
)
issue "KB-44" "Form thêm tài liệu: validation bằng Regex" "Trantantai1" "sprint-2,form,must" "$BODY"

if [ "${CREATE_LATER:-0}" = "1" ]; then
echo "== Tạo Issue sau 120 phút =="
BODY=$(cat <<'ISSUE_EOF'
**Người phụ trách:** Hiếu (@TrHieu18112007) · **Sau 120 phút** · **Hạn:** sau 120 phút · **Nhánh:** (không có) · **Nhãn:** `sau-120p`, `docs`, `must`

**Mô tả:** Làm sau 120 phút.

**Tiêu chí hoàn thành:**
- [ ] Nội dung: Tên dự án → Lý do chọn đề tài → Tính năng JavaScript nổi bật → Demo trực tiếp
- [ ] Mỗi thành viên có phần nói, tổng đúng 5 phút; đã tập thử ít nhất 2 lần
- [ ] Có danh sách câu hỏi phản biện dự kiến

_Commit/PR nhắc số Issue, ví dụ `[Logic] Thêm hàm filterByKeyword (KB-08)`._
ISSUE_EOF
)
issue "KB-08" "Slide và kịch bản Pitching 5 phút" "TrHieu18112007" "sau-120p,docs,must" "$BODY"

BODY=$(cat <<'ISSUE_EOF'
**Người phụ trách:** Tài (@Trantantai1) · **Sau 120 phút** · **Hạn:** sau 120 phút · **Nhánh:** `feature-detail-note` · **Nhãn:** `sau-120p`, `dom`, `could`

**Mô tả:** Chỉ làm nếu dư giờ sau T+90, hoặc để sau 120 phút.

**Tiêu chí hoàn thành:**
- [ ] Hiện tối đa 3 tài liệu cùng tag, dùng `findRelated` của Khang
- [ ] Không có tài liệu liên quan thì ẩn mục này

_Commit/PR nhắc số Issue, ví dụ `[Logic] Thêm hàm filterByKeyword (KB-45)`._
ISSUE_EOF
)
issue "KB-45" "Tài liệu liên quan (Could have)" "Trantantai1" "sau-120p,dom,could" "$BODY"

BODY=$(cat <<'ISSUE_EOF'
**Người phụ trách:** Tài (@Trantantai1) · **Sau 120 phút** · **Hạn:** sau 120 phút · **Nhánh:** (không có) · **Nhãn:** `sau-120p`, `docs`, `must`

**Mô tả:** Tổng hợp từ `prompt_log.md` theo mẫu Phụ lục 2 của giáo trình. (Video demo đã tách sang KB-48.)

**Tiêu chí hoàn thành:**
- [ ] Bảng 5-10 prompt quan trọng nhất (giai đoạn / mục tiêu / prompt / kết quả và tùy chỉnh)
- [ ] Ảnh chụp màn hình 1 đoạn code lỗi và cách AI hướng dẫn sửa
- [ ] Thông tin công cụ AI, bài học kinh nghiệm, cam kết đã hiểu ≥ 80% code AI tạo

_Commit/PR nhắc số Issue, ví dụ `[Logic] Thêm hàm filterByKeyword (KB-47)`._
ISSUE_EOF
)
issue "KB-47" "PDF \"Nhật ký đồng hành cùng AI\"" "Trantantai1" "sau-120p,docs,must" "$BODY"

BODY=$(cat <<'ISSUE_EOF'
**Người phụ trách:** Hiền (@NGUYENTHANHHIEN26) · **Sau 120 phút** · **Hạn:** sau 120 phút · **Nhánh:** (không có) · **Nhãn:** `sau-120p`, `docs`, `must`

**Mô tả:** Việc này trước nằm chung KB-47 của Tài, nay tách riêng cho Hiền.

**Tiêu chí hoàn thành:**
- [ ] Video 3-5 phút quay màn hình các tính năng chính
- [ ] Đã đưa link video vào `README.md`

_Commit/PR nhắc số Issue, ví dụ `[Logic] Thêm hàm filterByKeyword (KB-48)`._
ISSUE_EOF
)
issue "KB-48" "Quay video demo 3-5 phút" "NGUYENTHANHHIEN26" "sau-120p,docs,must" "$BODY"

fi

echo "Xong. Mở https://github.com/$REPO/issues để kiểm tra."
