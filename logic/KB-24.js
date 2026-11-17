/**
 * 7. Lấy danh sách các tài liệu có lượt xem cao nhất.
 * Nếu tổng số tài liệu ít hơn `limit` thì trả về toàn bộ mảng đã sắp xếp.
 *
 * @param {DocItem[]} docs - Mảng tài liệu gốc.
 * @param {number} [limit=5] - Số lượng tài liệu tối đa cần lấy.
 * @returns {DocItem[]} Mảng chứa tối đa `limit` tài liệu có lượt xem cao nhất.
 */
function getTopViewed(docs, limit = 5) {
  if (!Array.isArray(docs)) return [];

  const validLimit = Math.max(0, Number(limit) || 0);

  // Tái sử dụng hàm sortByViews (đã tạo bản sao mảng mới) và cắt bằng .slice()
  return sortByViews(docs, 'desc').slice(0, validLimit);
}

/**
 * 8. Lấy danh sách các tài liệu mới được thêm gần đây nhất (dựa theo ngày YYYY-MM-DD).
 * Nếu tổng số tài liệu ít hơn `limit` thì trả về toàn bộ mảng đã sắp xếp.
 *
 * @param {DocItem[]} docs - Mảng tài liệu gốc.
 * @param {number} [limit=5] - Số lượng tài liệu tối đa cần lấy.
 * @returns {DocItem[]} Mảng chứa tối đa `limit` tài liệu mới nhất.
 */
function getRecent(docs, limit = 5) {
  if (!Array.isArray(docs)) return [];

  const validLimit = Math.max(0, Number(limit) || 0);

  // Tái sử dụng hàm sortByDate (đã tạo bản sao mảng mới) và cắt bằng .slice()
  return sortByDate(docs, 'desc').slice(0, validLimit);
}

/**
 * 9. Trích xuất toàn bộ danh sách các thẻ (tags) duy nhất từ mảng tài liệu,
 * loại bỏ trùng lặp và sắp xếp theo bảng chữ cái tiếng Việt (A -> Z).
 *
 * @param {DocItem[]} docs - Mảng tài liệu gốc.
 * @returns {string[]} Mảng chứa các chuỗi tag duy nhất đã sắp xếp A -> Z.
 */
function getAllTags(docs) {
  if (!Array.isArray(docs)) return [];

  // Gom toàn bộ mảng tags của từng tài liệu và làm phẳng thành 1 mảng duy nhất
  const allRawTags = docs
    .map((doc) => (Array.isArray(doc?.tags) ? doc.tags : []))
    .reduce((acc, tags) => acc.concat(tags), [])
    .filter((tag) => typeof tag === 'string' && tag.trim() !== '')
    .map((tag) => tag.trim());

  // Loại bỏ phần tử trùng lặp bằng Set và sắp xếp tiếng Việt A -> Z
  return [...new Set(allRawTags)].sort((a, b) => a.localeCompare(b, 'vi'));
}

/**
 * 10. Thống kê số lượng tài liệu theo từng phân loại (type).
 * Luôn trả về object có đủ 3 khóa mặc định { pdf, video, link } kể cả khi số lượng bằng 0.
 *
 * @param {DocItem[]} docs - Mảng tài liệu gốc.
 * @returns {{ pdf: number, video: number, link: number, [key: string]: number }} Object thống kê số lượng theo loại.
 */
function countByType(docs) {
  // Khởi tạo giá trị mặc định luôn có đủ 3 khóa với số lượng bằng 0
  const initialCounts = { pdf: 0, video: 0, link: 0 };

  if (!Array.isArray(docs)) return initialCounts;

  return docs.reduce((acc, doc) => {
    const type = typeof doc?.type === 'string' ? doc.type.trim().toLowerCase() : '';

    if (type) {
      acc[type] = (acc[type] || 0) + 1;
    }

    return acc;
  }, initialCounts);
}