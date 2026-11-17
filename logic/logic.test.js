/**
 * @file js/logic.test.js
 * @description Bộ kiểm thử tự động (Unit Tests) cho các hàm thuần trong js/logic.js
 * sử dụng console.assert().
 */

// Hỗ trợ chạy kiểm thử trên cả trình duyệt (nhúng thẻ <script>) lẫn môi trường Node.js
if (typeof require !== 'undefined' && typeof filterByKeyword === 'undefined') {
  const logic = require('./logic.js');
  Object.assign(globalThis, logic);
}

// ============================================================================
// 1. KHỞI TẠO DỮ LIỆU MẪU (MOCK_DOCS - 6 TÀI LIỆU ĐA DẠNG)
// ============================================================================
const MOCK_DOCS = [
  {
    id: 1,
    title: 'Đề cương Giải tích 1',
    description: 'Tài liệu ôn thi cuối kỳ môn toán đại cương cho sinh viên năm nhất.',
    type: 'pdf',
    tags: ['Toán học', 'Đại học', 'Cơ bản'],
    views: 150,
    createdAt: '2025-01-10'
  },
  {
    id: 2,
    title: 'Ăn uống khoa học cho lập trình viên',
    description: 'Video hướng dẫn chế độ dinh dưỡng và vận động khi ngồi máy tính nhiều.',
    type: 'video',
    tags: ['Sức khỏe', 'Đời sống'],
    views: 420,
    createdAt: '2025-03-05'
  },
  {
    id: 3,
    title: 'Bài giảng Cấu trúc dữ liệu và Giải thuật',
    description: 'Tổng hợp các thuật toán sắp xếp, tìm kiếm và cây nhị phân.',
    type: 'pdf',
    tags: ['Lập trình', 'Thuật toán', 'Cơ bản'],
    views: 310,
    createdAt: '2025-02-20'
  },
  {
    id: 4,
    title: 'Tài liệu tham khảo MDN Web Docs',
    description: 'Trang tra cứu chuẩn xác nhất về HTML5, CSS3 và Vanilla JavaScript.',
    type: 'link',
    tags: ['Lập trình', 'Frontend', 'JS'],
    views: 85,
    createdAt: '2024-11-15'
  },
  {
    id: 5,
    title: 'Âm thanh trắng giúp tập trung code',
    description: 'Danh sách nhạc không lời hỗ trợ học tập và làm việc sâu (Deep Work).',
    type: 'video',
    tags: ['Đời sống', 'Tập trung'],
    views: 210,
    createdAt: '2025-02-01'
  },
  {
    id: 6,
    title: 'Dữ liệu lớn (Big Data) cơ bản',
    description: 'Giới thiệu tổng quan về hệ sinh thái Hadoop và Spark.',
    type: 'pdf',
    tags: ['Lập trình', 'Dữ liệu', 'Đại học'],
    views: 95,
    createdAt: '2025-01-25'
  }
];

// Lưu lại bản chụp (snapshot) ban đầu của MOCK_DOCS để kiểm tra tính bất biến (Immutability) ở cuối file
const INITIAL_SNAPSHOT = JSON.stringify(MOCK_DOCS);
const INITIAL_IDS_ORDER = MOCK_DOCS.map((d) => d.id).join(',');

console.log('🚀 Bắt đầu chạy bộ kiểm thử cho js/logic.js...');

// ============================================================================
// 2. KIỂM THỬ filterByKeyword (TÌM KIẾM TỪ KHÓA & TIẾNG VIỆT KHÔNG DẤU)
// ============================================================================

// Test 1: Từ khóa rỗng hoặc toàn khoảng trắng -> trả về toàn bộ 6 tài liệu
console.assert(
  filterByKeyword(MOCK_DOCS, '     ').length === 6,
  '❌ [Test 1 Thất bại]: filterByKeyword với chuỗi toàn khoảng trắng phải trả về đủ 6 tài liệu.'
);

// Test 2: Tìm kiếm không phân biệt hoa/thường và hỗ trợ tiếng Việt không dấu (trong title & description)
const kwResult = filterByKeyword(MOCK_DOCS, '  GIAI THUAT ');
console.assert(
  kwResult.length === 1 && kwResult[0].id === 3,
  '❌ [Test 2 Thất bại]: filterByKeyword("  GIAI THUAT ") phải tìm thấy tài liệu ID = 3 ("Giải thuật").'
);

// Test 3: Tìm kiếm chữ Đ/đ không dấu trong mảng tags ("dai hoc" -> khớp tag "Đại học" của ID 1 và ID 6)
const tagKwResult = filterByKeyword(MOCK_DOCS, 'dai hoc');
console.assert(
  tagKwResult.length === 2 && tagKwResult.some((d) => d.id === 1) && tagKwResult.some((d) => d.id === 6),
  '❌ [Test 3 Thất bại]: filterByKeyword("dai hoc") phải khớp với tag "Đại học" của tài liệu ID 1 và 6.'
);

// Test 4: Từ khóa không khớp với bất kỳ tài liệu nào -> trả về mảng rỗng []
console.assert(
  Array.isArray(filterByKeyword(MOCK_DOCS, 'blockchain_xyz_123')) &&
    filterByKeyword(MOCK_DOCS, 'blockchain_xyz_123').length === 0,
  '❌ [Test 4 Thất bại]: filterByKeyword với từ khóa không tồn tại phải trả về mảng rỗng [].'
);

// ============================================================================
// 3. KIỂM THỬ filterByType & filterByTag (BỘ LỌC PHÂN LOẠI & THẺ)
// ============================================================================

// Test 5: Lọc theo type = "all" hoặc rỗng "" -> trả về toàn bộ 6 tài liệu
console.assert(
  filterByType(MOCK_DOCS, 'all').length === 6 && filterByType(MOCK_DOCS, '').length === 6,
  '❌ [Test 5 Thất bại]: filterByType với type="all" hoặc "" phải trả về toàn bộ 6 tài liệu.'
);

// Test 6: Lọc theo type cụ thể ("pdf" có 3 tài liệu) và type không tồn tại ("audio" -> [])
console.assert(
  filterByType(MOCK_DOCS, 'pdf').length === 3 && filterByType(MOCK_DOCS, 'audio').length === 0,
  '❌ [Test 6 Thất bại]: filterByType("pdf") phải trả về 3 và filterByType("audio") phải trả về 0.'
);

// Test 7: Lọc theo tag = "" (trả về đủ 6) và tag cụ thể ("Lập trình" có ở ID 3, 4, 6)
console.assert(
  filterByTag(MOCK_DOCS, '').length === 6 && filterByTag(MOCK_DOCS, 'Lập trình').length === 3,
  '❌ [Test 7 Thất bại]: filterByTag("") phải trả về 6 và filterByTag("Lập trình") phải trả về 3.'
);

// Test 8: Lọc theo tag không tồn tại hoặc sai chữ hoa/thường -> trả về mảng rỗng []
console.assert(
  filterByTag(MOCK_DOCS, 'TagKhôngTồnTại').length === 0 && filterByTag(MOCK_DOCS, 'lập trình').length === 0,
  '❌ [Test 8 Thất bại]: filterByTag phải so khớp chính xác tên tag và trả về [] nếu không khớp.'
);

// ============================================================================
// 4. KIỂM THỬ NHÓM HÀM SẮP XẾP (sortByTitle, sortByViews, sortByDate)
// ============================================================================

// Test 9: sortByTitle sắp xếp đúng chuẩn bảng chữ cái tiếng Việt (Ă -> Â -> B -> D -> Đ -> T)
const sortedByTitleAsc = sortByTitle(MOCK_DOCS, 'asc').map((d) => d.id);
console.assert(
  sortedByTitleAsc.join(',') === '2,5,3,6,1,4',
  `❌ [Test 9 Thất bại]: sortByTitle('asc') sai thứ tự tiếng Việt. Nhận được: ${sortedByTitleAsc.join(',')}`
);

// Test 10: sortByViews giảm dần ('desc') và tăng dần ('asc')
const sortedViewsDesc = sortByViews(MOCK_DOCS, 'desc');
const sortedViewsAsc = sortByViews(MOCK_DOCS, 'asc');
console.assert(
  sortedViewsDesc[0].id === 2 && sortedViewsDesc[5].id === 4 && sortedViewsAsc[0].id === 4,
  '❌ [Test 10 Thất bại]: sortByViews sắp xếp không chính xác theo số lượt xem.'
);

// Test 11: sortByDate mới nhất lên đầu ('desc': ID 2 ngày 2025-03-05) và cũ nhất lên đầu ('asc': ID 4 ngày 2024-11-15)
const sortedDateDesc = sortByDate(MOCK_DOCS, 'desc');
const sortedDateAsc = sortByDate(MOCK_DOCS, 'asc');
console.assert(
  sortedDateDesc[0].id === 2 && sortedDateAsc[0].id === 4,
  '❌ [Test 11 Thất bại]: sortByDate so sánh chuỗi ngày YYYY-MM-DD chưa chính xác.'
);

// ============================================================================
// 5. KIỂM THỬ NHÓM THỐNG KÊ (getTopViewed, getRecent, getAllTags, countByType)
// ============================================================================

// Test 12: getTopViewed và getRecent giới hạn đúng số lượng `limit` và xử lý được khi limit > tổng số bài
console.assert(
  getTopViewed(MOCK_DOCS, 2).length === 2 &&
    getTopViewed(MOCK_DOCS, 2)[0].id === 2 &&
    getRecent(MOCK_DOCS, 10).length === 6,
  '❌ [Test 12 Thất bại]: getTopViewed hoặc getRecent xử lý tham số limit chưa đúng.'
);

// Test 13: getAllTags loại bỏ trùng lặp và sắp xếp A -> Z tiếng Việt (Cơ bản -> Dữ liệu -> Đại học -> ...)
const allTags = getAllTags(MOCK_DOCS);
console.assert(
  allTags.length === 10 &&
    allTags[0] === 'Cơ bản' &&
    allTags[1] === 'Dữ liệu' &&
    allTags[2] === 'Đại học' &&
    allTags[allTags.length - 1] === 'Toán học',
  `❌ [Test 13 Thất bại]: getAllTags chưa khử trùng lặp hoặc sắp xếp sai tiếng Việt: ${allTags.join(', ')}`
);

// Test 14: countByType đếm đúng số lượng từng loại và luôn giữ đủ 3 khóa { pdf, video, link } kể cả khi mảng rỗng
const countsFull = countByType(MOCK_DOCS);
const countsEmpty = countByType([]);
console.assert(
  countsFull.pdf === 3 &&
    countsFull.video === 2 &&
    countsFull.link === 1 &&
    countsEmpty.pdf === 0 &&
    countsEmpty.video === 0 &&
    countsEmpty.link === 0,
  '❌ [Test 14 Thất bại]: countByType không trả về đúng số lượng hoặc thiếu khóa mặc định { pdf, video, link }.'
);

// ============================================================================
// 6. KIỂM THỬ CÁC HÀM TRUNG TÂM (findById, findRelated, applyFilters)
// ============================================================================

// Test 15: findById tìm chính xác với cả id dạng số (3) và chuỗi ("3"), trả về null nếu không tồn tại
console.assert(
  findById(MOCK_DOCS, 3)?.id === 3 &&
    findById(MOCK_DOCS, '3')?.id === 3 &&
    findById(MOCK_DOCS, 999) === null,
  '❌ [Test 15 Thất bại]: findById không tương thích cả số/chuỗi hoặc không trả về null khi không tìm thấy.'
);

// Test 16: findRelated tìm đúng tài liệu liên quan, loại bỏ chính currentDoc và giới hạn theo limit
const currentDoc = MOCK_DOCS[0]; // ID 1 (type: 'pdf', tags: ['Toán học', 'Đại học', 'Cơ bản'])
const relatedDocs = findRelated(MOCK_DOCS, currentDoc, 2);
console.assert(
  relatedDocs.length === 2 &&
    !relatedDocs.some((d) => d.id === currentDoc.id) &&
    relatedDocs.some((d) => d.id === 3) &&
    relatedDocs.some((d) => d.id === 6),
  '❌ [Test 16 Thất bại]: findRelated chưa loại bỏ currentDoc hoặc chọn sai tài liệu liên quan.'
);

// Test 17: applyFilters kết hợp đa bộ lọc (keyword + type + tag + sortBy)
const multiFiltered = applyFilters(MOCK_DOCS, {
  keyword: 'du lieu', // Khớp ID 3 ("Cấu trúc dữ liệu...") và ID 6 ("Dữ liệu lớn...")
  type: 'pdf',
  tag: 'Lập trình',
  sortBy: 'views',
  order: 'asc'
});
console.assert(
  multiFiltered.length === 2 && multiFiltered[0].id === 6 && multiFiltered[1].id === 3,
  '❌ [Test 17 Thất bại]: applyFilters kết hợp đa điều kiện (keyword, type, tag, sortBy) cho kết quả sai.'
);

// Test 18: applyFilters khi truyền options rỗng {} hoặc thiếu thuộc tính -> không gây lỗi, trả về đủ 6 phần tử
console.assert(
  applyFilters(MOCK_DOCS, {}).length === 6 &&
    applyFilters(MOCK_DOCS, { keyword: undefined, type: 'all' }).length === 6,
  '❌ [Test 18 Thất bại]: applyFilters với options={} hoặc thuộc tính undefined phải trả về đủ 6 tài liệu.'
);

// ============================================================================
// 7. KIỂM THỬ TÍNH BẤT BIẾN (IMMUTABILITY) CỦA MẢNG MOCK_DOCS GỐC
// ============================================================================

// Test 19: Độ dài và thứ tự ID của mảng MOCK_DOCS gốc tuyệt đối không bị thay đổi sau hàng loạt lệnh sort/filter
console.assert(
  MOCK_DOCS.length === 6 && MOCK_DOCS.map((d) => d.id).join(',') === INITIAL_IDS_ORDER,
  '❌ [Test 19 Thất bại]: Mảng MOCK_DOCS gốc đã bị thay đổi thứ tự hoặc độ dài (vi phạm tính bất biến)!'
);

// Test 20: Toàn bộ nội dung chi tiết bên trong MOCK_DOCS vẫn giữ nguyên 100% như ban đầu
console.assert(
  JSON.stringify(MOCK_DOCS) === INITIAL_SNAPSHOT,
  '❌ [Test 20 Thất bại]: Thuộc tính bên trong các phần tử của MOCK_DOCS đã bị biến đổi!'
);

console.log('Hoàn tất kiểm thử logic.js!');