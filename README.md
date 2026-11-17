# LHU Second Brain - Kho lưu trữ tài liệu cá nhân

> Dự án học phần **Thiết kế Web (111101)** · Trường Đại học Lạc Hồng · Đề tài 2.4.3 (EdTech): Personal Knowledge Base
> **Nhóm 6** · Lớp **25CT112** · Giảng viên: **Nguyễn Minh Phúc**

**Live Demo:** https://trhieu18112007.github.io/HeThongKhoLuuTruTaiLieuCaNhan---Personal-Knowledge-Base/
**Repository:** https://github.com/Trhieu18112007/HeThongKhoLuuTruTaiLieuCaNhan---Personal-Knowledge-Base

## Thành viên và vai trò

| Thành viên | GitHub | Vai trò Scrum | Vai trò kỹ thuật |
|---|---|---|---|
| Hiếu | [@TrHieu18112007](https://github.com/TrHieu18112007) | Scrum Master | Data, quản lý repo, deploy |
| Nguyễn Thanh Hiền | [@NGUYENTHANHHIEN26](https://github.com/NGUYENTHANHHIEN26) | Dev Team | UI/UX |
| Hà Lưu Nhật Khang | [@KhangHa2007](https://github.com/KhangHa2007) | Dev Team | Logic dữ liệu |
| Hoàng Hải Đăng | [@Ttrandangkhoa98](https://github.com/Ttrandangkhoa98) | Dev Team | Tương tác DOM |
| Tran Tan Tai | [@Trantantai1](https://github.com/Trantantai1) | Dev Team | Trang chi tiết, ghi chú, form |

## Bài toán

Sinh viên lưu tài liệu học tập ở nhiều nơi (Zalo, Drive, bookmark, thư mục máy), đến mùa thi hoặc làm đồ án thì mất thời gian tìm lại và quên mình đã ghi chú gì.

**Câu hỏi dự án:** làm thế nào để sinh viên LHU gom tài liệu (PDF, video, liên kết) về một nơi, tìm lại nhanh theo từ khóa, tag hoặc định dạng, và ghi chú ngay khi đọc?

## Tính năng

- Xem tài liệu dạng **thẻ (Card)** hoặc **danh sách (List)**
- **Tìm kiếm real-time** theo tiêu đề, mô tả, tag; lọc theo định dạng và tag; sắp xếp
- **Trang chi tiết** với ô **ghi chú** lưu được (tối đa 500 ký tự), đếm lượt xem
- **Trang chủ** có thống kê, "Xem nhiều nhất" và "Mới thêm"
- **Form thêm tài liệu** có kiểm tra dữ liệu bằng Regex, báo lỗi ngay khi gõ

*(Chỉnh danh sách này theo những gì thực tế đã hoàn thành khi chốt.)*

## Công nghệ

HTML5 · CSS3 · JavaScript thuần (không backend) · dữ liệu lưu bằng `localStorage` · deploy GitHub Pages.

## Chạy trên máy

```bash
git clone https://github.com/Trhieu18112007/HeThongKhoLuuTruTaiLieuCaNhan---Personal-Knowledge-Base.git
cd HeThongKhoLuuTruTaiLieuCaNhan---Personal-Knowledge-Base
```

Mở `index.html` bằng trình duyệt (hoặc dùng extension Live Server trong VS Code). Không cần cài thêm gì.

## Cấu trúc thư mục

```
css/     style.css (Hiền), detail.css (Tài)
js/      data.js, storage.js (Hiếu) · logic.js (Khang) · ui.js, app.js (Đăng) · detail.js, add.js (Tài)
docs/    wireframe, BACKLOG.md, components.md, screenshots/
PLAN.md  kế hoạch, Data Contract, chữ ký hàm, Sprint
prompt_log.md  nhật ký làm việc với AI
```

## Quy trình làm việc

Scrum rút gọn trong 120 phút (2 Sprint ngắn), bảng Kanban trên GitHub Projects, mỗi tính năng một nhánh `feature-...`, không push thẳng `main`, mọi thay đổi qua Pull Request do nhóm trưởng review. Chi tiết xem [PLAN.md](PLAN.md).

## Làm việc với AI

Nhóm dùng Claude, ChatGPT và Gemini. Toàn bộ prompt được ghi trong [prompt_log.md](prompt_log.md).

### Prompt nổi bật

| # | Người | Mục tiêu | Prompt | Kết quả và tùy chỉnh |
|---|---|---|---|---|
| 1 | | | | |
| 2 | | | | |
| 3 | | | | |

*(Hiếu tổng hợp 3-5 prompt nổi bật nhất từ `prompt_log.md` ở bước Chốt.)*
