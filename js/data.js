/* ==========================================================================
   data.js - HỢP ĐỒNG DỮ LIỆU CHUNG (DATA CONTRACT)
   Dự án: LHU Second Brain - Kho lưu trữ tài liệu cá nhân
   Chủ sở hữu file: Nhóm trưởng (Hiếu). Muốn thêm/đổi thuộc tính phải báo nhóm trưởng
   và sửa mục 7 trong PLAN.md cùng lúc.

   Mỗi tài liệu (document) gồm ĐÚNG các thuộc tính sau:
   ---------------------------------------------------------------------------
   id          number    Duy nhất. Tài liệu mẫu: 1-999. Tài liệu người dùng thêm: từ 1000 (do storage.js cấp)
   title       string    Tiêu đề, 3-100 ký tự
   type        string    CHỈ MỘT TRONG: "pdf" | "video" | "link"
   tags        string[]  Nhãn, viết thường, không dấu, nối bằng gạch ngang. VD: "responsive", "ctdl", "on-thi"
   description string    Mô tả ngắn, tối đa 200 ký tự
   url         string    Đường dẫn mở tài liệu ("#" nếu chưa có)
   views       number    Số lượt xem ban đầu (>= 0)
   addedAt     string    Ngày thêm, định dạng "YYYY-MM-DD"
   note        string    Ghi chú của người dùng ("" nếu chưa có)
   ---------------------------------------------------------------------------
   Lưu ý: tên thuộc tính viết đúng như trên (chữ thường, camelCase). KHÔNG ai tự đặt
   tên khác như "ten", "name", "loai", "tag" (số ít)...
   ========================================================================== */

/** Các định dạng hợp lệ + nhãn hiển thị tiếng Việt (dùng cho bộ lọc và badge) */
const DOC_TYPES = {
  pdf: "PDF",
  video: "Video",
  link: "Liên kết"
};

/** Dữ liệu mẫu. Các url "#" là chỗ giữ chỗ, thay bằng link thật khi có. */
const DOCUMENTS = [
  {
    id: 1,
    title: "Giáo trình Thiết kế Web (LHU)",
    type: "pdf",
    tags: ["web", "html", "css", "javascript"],
    description: "Giáo trình học phần Thiết kế Web, gồm lộ trình 15 tuần và hướng dẫn làm dự án PBL.",
    url: "#",
    views: 128,
    addedAt: "2026-10-05",
    note: "Đọc kỹ phần Rubric ở Phụ lục 4 trước khi nộp bài."
  },
  {
    id: 2,
    title: "MDN Web Docs - JavaScript Guide",
    type: "link",
    tags: ["javascript", "tham-khao"],
    description: "Tài liệu tham khảo JavaScript chính thức từ Mozilla, có ví dụ cho mảng, DOM và sự kiện.",
    url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide",
    views: 97,
    addedAt: "2026-10-08",
    note: ""
  },
  {
    id: 3,
    title: "CSS Grid trong 20 phút",
    type: "video",
    tags: ["css", "layout", "grid"],
    description: "Video hướng dẫn dựng layout nhiều cột bằng CSS Grid, kèm bài tập thực hành.",
    url: "#",
    views: 76,
    addedAt: "2026-10-12",
    note: ""
  },
  {
    id: 4,
    title: "Flexbox Cheat Sheet",
    type: "pdf",
    tags: ["css", "layout", "flexbox"],
    description: "Bảng tóm tắt các thuộc tính Flexbox thường dùng, in một trang A4.",
    url: "#",
    views: 64,
    addedAt: "2026-10-14",
    note: ""
  },
  {
    id: 5,
    title: "The Modern JavaScript Tutorial",
    type: "link",
    tags: ["javascript", "co-ban"],
    description: "Giáo trình JavaScript từ cơ bản đến nâng cao: hàm, mảng, DOM, sự kiện, bất đồng bộ.",
    url: "https://javascript.info/",
    views: 111,
    addedAt: "2026-10-15",
    note: ""
  },
  {
    id: 6,
    title: "Git và GitHub cho người mới",
    type: "video",
    tags: ["git", "github", "lam-nhom"],
    description: "Hướng dẫn tạo repository, tạo nhánh, commit và Pull Request khi làm việc nhóm.",
    url: "#",
    views: 58,
    addedAt: "2026-10-18",
    note: ""
  },
  {
    id: 7,
    title: "Pro Git Book",
    type: "link",
    tags: ["git", "tham-khao"],
    description: "Sách miễn phí về Git: nhánh, gộp code, xử lý xung đột, quy trình làm việc nhóm.",
    url: "https://git-scm.com/book",
    views: 41,
    addedAt: "2026-10-20",
    note: ""
  },
  {
    id: 8,
    title: "Hướng dẫn dùng GitHub Projects (Kanban)",
    type: "pdf",
    tags: ["git", "agile", "scrum", "lam-nhom"],
    description: "Cách tạo bảng To-do / In Progress / Done và gắn Issue cho từng thành viên.",
    url: "#",
    views: 35,
    addedAt: "2026-10-24",
    note: ""
  },
  {
    id: 9,
    title: "Tóm tắt Scrum bằng tiếng Việt",
    type: "pdf",
    tags: ["agile", "scrum", "lam-nhom"],
    description: "Vai trò, sự kiện và artifacts của Scrum trong một trang, phù hợp cho dự án nhóm sinh viên.",
    url: "#",
    views: 29,
    addedAt: "2026-10-27",
    note: ""
  },
  {
    id: 10,
    title: "Regex cơ bản cho kiểm tra form",
    type: "video",
    tags: ["javascript", "regex", "form"],
    description: "Viết biểu thức chính quy để kiểm tra email, số điện thoại và URL trong form.",
    url: "#",
    views: 52,
    addedAt: "2026-11-02",
    note: ""
  },
  {
    id: 11,
    title: "Tổng hợp công thức Toán cao cấp",
    type: "pdf",
    tags: ["toan", "on-thi"],
    description: "File tổng hợp công thức giới hạn, đạo hàm, tích phân dùng để ôn thi cuối kỳ.",
    url: "#",
    views: 88,
    addedAt: "2026-11-04",
    note: ""
  },
  {
    id: 12,
    title: "Hướng dẫn viết báo cáo và trích dẫn APA",
    type: "link",
    tags: ["bao-cao", "trich-dan"],
    description: "Quy tắc trích dẫn nguồn và trình bày danh mục tài liệu tham khảo theo chuẩn APA.",
    url: "https://apastyle.apa.org/",
    views: 33,
    addedAt: "2026-11-06",
    note: ""
  },
  {
    id: 13,
    title: "Responsive Design cơ bản",
    type: "video",
    tags: ["css", "responsive", "mobile"],
    description: "Media query, đơn vị tương đối và thẻ meta viewport để giao diện chạy tốt trên điện thoại.",
    url: "#",
    views: 47,
    addedAt: "2026-11-09",
    note: ""
  },
  {
    id: 14,
    title: "WebAIM - Khả năng truy cập web",
    type: "link",
    tags: ["web", "accessibility"],
    description: "Danh sách kiểm tra giúp trang web dễ dùng hơn với mọi người dùng.",
    url: "https://webaim.org/",
    views: 22,
    addedAt: "2026-11-12",
    note: ""
  }
];
