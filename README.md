Người	Vai trò	Nhiệm vụ chính	File phụ trách	Nhánh Git
Bạn	Nhóm trưởng (Scrum Master) + Data	Repo, GitHub Projects, PLAN.md, data.js, review và merge PR, README, deploy, soạn slide pitching	data.js, README.md, PLAN.md	feature-data, docs-readme
Hiền	UI/UX	:root (xanh-trắng LHU), Navbar/Footer, layout 3 trang, Card/List view, Responsive, trạng thái rỗng	css/style.css, index.html, library.html	feature-layout, feature-card-list
Khang	Logic dữ liệu	Hàm thuần: filterByKeyword, filterByType, filterByTag, sortByViews, sortByDate, getTopViewed, getRecent (không đụng DOM)	js/logic.js	feature-filter-logic
Đăng	Tương tác (Library + Home)	Render bằng map(), search real-time, lọc Tag/định dạng, chuyển Card⇄List, widget trang chủ	js/ui.js, js/app.js	feature-search-ui
Tài	Trang chi tiết + Note + Form	detail.html, đọc id từ URL, ghi chú, form thêm tài liệu (Regex URL, báo lỗi khi gõ), tổng hợp PDF nhật ký AI	detail.html, js/detail.js, css/detail.css	feature-detail-note

Lưu ý khi giao: vị trí Khang (Logic) và Đăng (DOM) cần JavaScript vững nhất, vì rubric dành 30% cho JS/DOM. Mình xếp theo thứ tự bạn đưa tên, nên nếu bạn biết ai mạnh JS hơn thì đổi chỗ cho hợp. Cách đổi dễ nhất là hoán đổi trọn vai trò cho nhau, không chia nhỏ file.

Việc chung
Việc	Ai làm
prompt_log.md	Mỗi người tự ghi prompt của mình (thầy hỏi ngẫu nhiên “tại sao hỏi vậy?”)
PDF “Nhật ký đồng hành cùng AI”	Tài tổng hợp, mỗi người gửi prompt + ảnh chụp lỗi của mình
Video demo 3–5 phút	Hiền quay, cả nhóm góp kịch bản
Slide + kịch bản pitching 5 phút	Bạn soạn, mỗi người nói phần của mình
Test chéo (Mobile + Console)	Khang test code của Đăng, Đăng test code của Khang
Danh sách Issue để tạo ngay trên GitHub Projects (cột To-do)

Hiền

[ ] Wireframe 3 trang (vẽ tay hoặc Figma/Canva)
[ ] Biến :root và Navbar/Footer chung
[ ] Layout index.html và library.html
[ ] Card view (Grid) và List view (Flexbox)
[ ] Responsive + trạng thái “Không tìm thấy tài liệu”

Khang

[ ] Liệt kê tên hàm, tham số, giá trị trả về (gửi cho Đăng)
[ ] filterByKeyword (không phân biệt hoa thường, xử lý chuỗi rỗng)
[ ] filterByType và filterByTag
[ ] sortByViews, sortByDate, getTopViewed, getRecent

Đăng

[ ] Render danh sách từ DOCUMENTS bằng map()
[ ] Ô search real-time (sự kiện input)
[ ] Bộ lọc Tag và định dạng (PDF/Video/Link)
[ ] Nút chuyển Card⇄List
[ ] Widget trang chủ (xem nhiều nhất, mới thêm)

Tài

[ ] Wireframe + khung detail.html
[ ] Đọc id từ URL và hiển thị tài liệu
[ ] Ô ghi chú (kiểm tra rỗng, giới hạn độ dài, báo lỗi)
[ ] Form thêm tài liệu mới (Regex URL, validation khi gõ)
[ ] Khung PDF nhật ký đồng hành cùng AI

Bạn

[ ] Tạo repo, mời Khang/Tài/Hiền/Đăng làm Collaborators, bật GitHub Projects
[ ] PLAN.md + data.js (10–15 tài liệu mẫu) → đẩy lên main đầu tiên
[ ] Review PR bằng AI và merge
[ ] README (tên dự án, vai trò từng người, link Live Demo, 3–5 prompt nổi bật)
[ ] Deploy GitHub Pages + slide pitching
Thứ tự để không ai phải chờ
Bạn xong data.js trước, rồi nhắn cả nhóm đọc và đồng ý với tên thuộc tính (id, title, type, tags, description, url, views, addedAt, note).
Hiền, Khang, Đăng, Tài làm song song trên nhánh riêng.
Đăng nối hàm của Khang vào giao diện của Hiền, bạn review PR rồi merge.
3 quy tắc cần nhắc cả nhóm ngay từ đầu
Mỗi người chỉ sửa file của mình, cần sửa file người khác thì nhắn họ
Không push thẳng lên main, luôn tạo Pull Request
Commit nhỏ, đều đặn theo mẫu [Tên-Tính-Năng] mô tả (rubric Git/Agile 15% tính cả lịch sử commit của từng người)
