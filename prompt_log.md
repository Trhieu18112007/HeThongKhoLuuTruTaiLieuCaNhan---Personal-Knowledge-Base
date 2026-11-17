# prompt_log.md · Nhật ký đồng hành cùng AI (Hiền · UI/UX)
> Công cụ AI: Claude (Anthropic). Prompt bám theo tiêu chí hoàn thành của từng Issue trong BACKLOG.md. Ghi ngay khi làm.

| # | Issue | Giai đoạn | Mục tiêu | Prompt | Kết quả & tùy chỉnh |
|---|---|---|---|---|---|
| 1 | KB-10 | Thiết kế | Wireframe 3-4 trang | "Vẽ wireframe ASCII cho trang index và library (cả Card view và List view) của web Kho lưu trữ tài liệu cá nhân. Trang library có: ô tìm kiếm, lọc định dạng, sắp xếp, chip tag, nút chuyển view. Trang index có: hero tìm kiếm, widget Xem nhiều nhất, Mới thêm, Thống kê." | AI cho 3 sơ đồ ASCII. Em vẽ lại bằng Figma/Canva, lưu `/docs/wireframe-library.png`. |
| 2 | KB-11 | CSS | Biến `:root`, reset, typography | "Tạo bộ biến CSS :root theo tông xanh - trắng của trường đại học, gồm màu chính, màu phụ, nền, chữ, viền, bo góc, bóng đổ và khoảng cách. Chỉ trả về khối :root và phần reset cơ bản. Dùng font hỗ trợ tiếng Việt, hiển thị đúng dấu." | Em kiểm tra mọi màu đều dùng `var(--...)`; thêm màu badge PDF/Video/Liên kết. |
| 3 | KB-12 | HTML/CSS | Navbar + Footer dùng chung | "Viết Navbar (Trang chủ / Kho tài liệu / Thêm tài liệu) và Footer bằng thẻ semantic header, nav, footer. Menu thu gọn trên mobile. Class có tiền tố kb-. Kèm đoạn HTML mẫu để bạn cùng nhóm copy nguyên xi." | AI dùng checkbox thay JavaScript. Em lưu mẫu vào `docs/components.md`, nhắn Tài. |
| 4 | KB-13 | HTML | Khung index + library | "Dựng khung HTML + CSS tĩnh cho index.html và library.html với dữ liệu giả. Chừa container có id: top-viewed, recent, stats, doc-container, tag-chips, result-count, search-input, type-filter, sort-select, view-toggle. Có input type=search, select định dạng, select sắp xếp, nút chuyển view, thẻ meta viewport." | Em đối chiếu đủ 10 id và báo Đăng. Nạp script theo mục 8 PLAN.md. |
| 5 | KB-14 | CSS Grid | Card view | "Viết CSS Grid cho thẻ tài liệu: 3 cột desktop, 2 cột tablet, 1 cột mobile. Thẻ có badge định dạng màu khác nhau cho PDF/Video/Liên kết, tiêu đề, mô tả cắt gọn, tag, lượt xem, ngày. Hover mượt bằng transition. Cho biết tên class của thẻ." | Em báo Đăng class `.kb-card`, `.kb-badge--*`, `.kb-card__*`. |
| 6 | KB-15 | Flexbox | List view | "Viết CSS Flexbox cho List view: mỗi tài liệu một dòng gồm badge, tiêu đề, tag, lượt xem, ngày. Trên mobile tự xuống dòng gọn, không tràn ngang. Dùng class chuyển đổi .kb-view-list / .kb-view-card trên container." | Em ẩn mô tả ở List view; báo Đăng cách đổi class. |
| 7 | KB-16 | CSS | Chip, thanh công cụ | "Viết CSS chip tag có 3 trạng thái: thường, hover, đang chọn (.kb-chip--active). Thanh công cụ gọn, xếp dọc trên mobile." | Em tăng chiều cao chip để dễ chạm. |
| 8 | KB-17 | Responsive | 360 / 768 / 1280px | "Rà soát CSS này ở 360px, 768px, 1280px: chỗ nào gây thanh cuộn ngang, nút nào quá nhỏ để chạm trên điện thoại? Sửa giúp." | Đặt `min-height:44px`; test DevTools + 1 điện thoại thật. |
| 9 | KB-18 | CSS | Trạng thái rỗng, toast, làm đẹp | "Viết style cho 'Không tìm thấy tài liệu' kèm nút 'Xóa bộ lọc', và toast thông báo thành công/lỗi dùng chung cho cả nhóm. Rà soát thành phần nào lệch, vỡ hoặc thiếu hover." | Em thêm `prefers-reduced-motion`, báo Tài và Đăng class `.kb-toast--success/--error`. |

## Lỗi đã gặp & cách AI hướng dẫn sửa (cho PDF KB-47)
- **Lỗi:** (điền lỗi thật của em)
- **AI hướng dẫn:** (điền)
- **Em đã sửa:** (điền)

## Bài học & cam kết
- Em đã hiểu ≥ 80% code AI tạo và giải thích được lý do cho từng prompt.
