# HUONG_DAN.md - Hướng dẫn cho nhóm trưởng (Hiếu)

Dự án chạy **13:15 → 15:15**. Việc của Hiếu quyết định 4 bạn có làm song song được hay không, nên làm theo đúng thứ tự dưới đây.

| Giờ | Việc |
|---|---|
| 13:15-13:25 | Họp Sprint Planning ngắn, gửi tin nhắn giao việc |
| **13:30** (T+15) | Đã push `main`, mời xong 4 bạn |
| 13:35 (T+20) | Đã tạo Issue và bảng Kanban |
| 13:45, 14:15, 14:45 | Check-in nhanh (mỗi lần ≤ 5 phút) |
| 13:45-15:00 | Review và merge PR |
| ~14:00 | Bật GitHub Pages khi Hiền đã merge khung giao diện |
| 15:00 | Đóng băng code |
| 15:00-15:15 | Merge cuối, deploy lại, điền README |

Đặt biến cho gọn (Git Bash / macOS / Linux):

```bash
REPO="Trhieu18112007/HeThongKhoLuuTruTaiLieuCaNhan---Personal-Knowledge-Base"
```

## Bước 1. Đẩy code lần đầu lên `main` (KB-01)

Thư mục đã soạn có sẵn cấu trúc, `data.js`, `storage.js`, `PLAN.md`, `prompt_log.md`, khung 4 trang HTML.

```bash
git clone https://github.com/$REPO.git
cd HeThongKhoLuuTruTaiLieuCaNhan---Personal-Knowledge-Base
# Chép NỘI DUNG thư mục đã tải (không chép thư mục cha) vào đây
git checkout -B main
git add .
git commit -m "[Khoi-Tao] Cau truc du an, data.js, storage.js, PLAN.md"
git push -u origin main
```

Mở Console trong trình duyệt (F12) ở một trang đã nạp `data.js` và `storage.js`, gõ `KBStorage.getAllDocuments()`: phải ra 14 tài liệu.

## Bước 2. Mời 4 bạn làm Collaborator

```bash
for u in NGUYENTHANHHIEN26 KhangHa2007 Ttrandangkhoa98 Trantantai1; do
  gh api -X PUT "repos/$REPO/collaborators/$u" -f permission=push
done
```

Hoặc bằng giao diện: **Settings → Collaborators → Add people**. Nhắc 4 bạn **mở email / thông báo GitHub bấm Accept** ngay. Chưa Accept thì không gán Issue được và không push được.

## Bước 3. Bảo vệ nhánh `main` (chỉ làm SAU khi đã push ở bước 1)

Giao diện: **Settings → Branches → Add branch ruleset / protection rule** cho `main`, bật *Require a pull request before merging*.

Hoặc bằng lệnh (yêu cầu 1 người duyệt, Hiếu vẫn là admin nên có thể merge PR của chính mình khi cần):

```bash
gh api -X PUT "repos/$REPO/branches/main/protection" --input - <<'JSON'
{"required_status_checks":null,"enforce_admins":false,
 "required_pull_request_reviews":{"required_approving_review_count":1},
 "restrictions":null}
JSON
```

Nếu thấy việc duyệt làm chậm cả nhóm, đổi `1` thành `0`: vẫn bắt buộc PR nhưng không cần bấm Approve.

## Bước 4. Tạo nhãn và 20 Issue

```bash
gh auth login          # lần đầu, chọn GitHub.com → HTTPS → đăng nhập bằng trình duyệt
bash scripts/create_issues.sh
```

Script có thể chạy lại an toàn (bỏ qua Issue đã có). Nếu báo "Không gán được @...", người đó chưa Accept lời mời: gán tay sau trong Issue. Cài `gh` nếu chưa có: https://cli.github.com

## Bước 5. Bảng Kanban

1. Repo → tab **Projects → New project → Board**, đặt tên "LHU Second Brain".
2. Cột Status giữ 3 cột: **Todo / In Progress / Done**.
3. Bấm **+ Add item**, gõ `#` rồi chọn từng Issue, hoặc dùng *Add item from repository* để chọn nhiều Issue một lúc.
4. Bật **Workflows → Auto-add to project** và **Item closed → Done** nếu muốn tự động.

## Bước 6. Review và merge PR (KB-05)

Với mỗi PR (mục tiêu ≤ 5 phút):

1. Tab **Files changed**: chỉ có file thuộc phạm vi của người gửi? Không có `console.log` thừa?
2. Nếu có hai PR chạm vào nhau (ví dụ `logic.js` và `ui.js`), dán cả hai vào AI với prompt trong KB-05 để tìm xung đột tên hàm/biến.
3. Bấm **Merge pull request** (kiểu *Squash and merge* cho lịch sử gọn). Kéo Issue sang **Done**.
4. Sau khi merge, nhắn nhóm: "kéo `main` về trước khi làm tiếp" (`git pull origin main`).

## Bước 7. Deploy GitHub Pages (KB-06)

Khi `index.html` của Hiền đã merge:

```bash
gh api -X POST "repos/$REPO/pages" -f "source[branch]=main" -f "source[path]=/"
```

Hoặc **Settings → Pages → Build and deployment → Deploy from a branch → `main` / `(root)` → Save**. Chờ 1-2 phút, mở:

https://trhieu18112007.github.io/HeThongKhoLuuTruTaiLieuCaNhan---Personal-Knowledge-Base/

Mở thử trên điện thoại. Mỗi lần merge, Pages tự cập nhật sau khoảng 1 phút.

## Sự cố hay gặp

| Hiện tượng | Cách xử lý |
|---|---|
| Trang Live mất CSS/JS (404 trong Console) | Có đường dẫn bắt đầu bằng `/` (ví dụ `/css/style.css`). Sửa thành `css/style.css` |
| Push `main` bị từ chối | Đúng quy định, tạo nhánh `feature-...` rồi mở PR. Hiếu là admin nên có thể push khẩn cấp |
| Bật bảo vệ `main` báo lỗi hoặc không có tùy chọn | Bạn chưa push lần đầu (bước 1), hoặc repo Private ở gói miễn phí. Repo nên để **Public** |
| PR báo "conflict" | Người gửi chạy `git pull origin main` trên nhánh của mình, sửa xung đột, push lại. Nếu 2 người cùng sửa 1 file là vi phạm phân chia file: hỏi lại ai sửa file của ai |
| Tài liệu thêm bằng form biến mất | `localStorage` gắn với từng trình duyệt và từng địa chỉ. Demo trên đúng trình duyệt đã dùng, đừng đổi giữa `localhost` và link Pages |
| Hai người tên gần giống (Hiếu / Hiền) bị gán nhầm Issue | Kiểm tra `@username` khi gán: Hiếu = `TrHieu18112007`, Hiền = `NGUYENTHANHHIEN26` |

## Chốt lúc 15:00 - 15:15

1. Kéo `main` về, mở link Live trên điện thoại, Console không lỗi.
2. Điền bảng "Prompt nổi bật" trong `README.md` (3-5 prompt từ `prompt_log.md`).
3. Nhắc mỗi người ghi nốt `prompt_log.md`.
4. Retrospective 3 câu: làm tốt gì / chưa tốt gì / lần sau đổi gì.
