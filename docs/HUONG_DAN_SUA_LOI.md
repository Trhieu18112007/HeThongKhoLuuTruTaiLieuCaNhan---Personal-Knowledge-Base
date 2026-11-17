# Hướng dẫn cập nhật bản website đã sửa

## Nguyên nhân

- `detail.html` ban đầu chỉ có tiêu đề, thiếu các ID mà `detail.js` dùng để hiển thị.
- `detail.js` dùng `format` và `dateAdded`, trong khi `data.js` quy ước là `type`, `addedAt`.
- `app.js` không thống nhất `#searchInput`, bộ lọc, chế độ Card/List và render với `ui.js`.
- 9/14 dữ liệu mẫu đặt `url: "#"`: chưa gắn nguồn thật nên không thể mở PDF/video gốc; xem trang chi tiết, mô tả và ghi chú vẫn hoạt động.
- `add.js` lưu tag chưa chuẩn hóa và không kiểm tra `KBStorage.addDocument()` có trả lỗi không.

## Tập tin thay thế

Các file được nhóm theo đúng thư mục, gồm 4 trang HTML, `css/`, `js/`, `docs/`.
Lưu ý: đây là **bản tích hợp chạy thử**, có chỉnh cả file của Đăng và Tài. Hãy để nhóm trưởng review PR trước khi merge vào main.
Không dùng đồng thời `kb-controls.js`, `kb-add.js`, `kb-storage-standalone.js` của ZIP trước vì dễ tạo event listener trùng.

## Cách chạy

1. Giải nén ZIP và mở thư mục bằng VS Code.
2. Dùng Live Server mở `index.html`.
3. Vào `library.html`, bấm **Xem chi tiết** trên 1 thẻ. URL phải có dạng `detail.html?id=2`.
4. Tài liệu có URL thật (ví dụ mã **2**, MDN JavaScript) sẽ có nút **Mở tài liệu gốc**.
5. Tài liệu mẫu có `url: "#"` thì không thể mở tệp gốc; thay `#` bằng URL PDF/video thật trong `js/data.js` sau khi bạn có nguồn.
6. Thử lưu ghi chú, tải lại trang để kiểm tra còn ghi chú.
7. Vào **Thêm tài liệu**, nhập Link/Video hợp lệ, lưu; trang sẽ chuyển đến chi tiết tài liệu vừa thêm.

## Chú ý về dữ liệu

LocalStorage lưu theo trình duyệt/nguồn trang (origin) — dữ liệu lưu tại Live Server máy bạn không tự đồng bộ sang GitHub Pages hoặc máy của người khác. Chưa có upload file PDF, backend hay tài khoản.
