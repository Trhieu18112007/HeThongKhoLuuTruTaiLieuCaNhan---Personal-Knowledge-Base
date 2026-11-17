/**
 * 4. Sắp xếp danh sách tài liệu theo số lượt xem (views).
 *
 * @param {DocItem[]} docs - Mảng tài liệu gốc.
 * @param {'asc'|'desc'} [order='desc'] - Thứ tự sắp xếp: 'desc' (nhiều nhất trước) hoặc 'asc' (ít nhất trước).
 * @returns {DocItem[]} Mảng tài liệu mới đã được sắp xếp theo lượt xem.
 */
function sortByViews(docs, order = 'desc') {
  if (!Array.isArray(docs)) return [];

  const isAsc = String(order).toLowerCase() === 'asc';

  return [...docs].sort((a, b) => {
    const viewsA = Number(a?.views) || 0;
    const viewsB = Number(b?.views) || 0;

    return isAsc ? viewsA - viewsB : viewsB - viewsA;
  });
}

/**
 * 5. Sắp xếp danh sách tài liệu theo ngày tạo (createdAt hoặc date).
 * Hỗ trợ chuẩn xác chuỗi định dạng "YYYY-MM-DD" và chuỗi ISO 8601.
 *
 * @param {DocItem[]} docs - Mảng tài liệu gốc.
 * @param {'asc'|'desc'} [order='desc'] - Thứ tự sắp xếp: 'desc' (mới nhất lên đầu) hoặc 'asc' (cũ nhất lên đầu).
 * @returns {DocItem[]} Mảng tài liệu mới đã được sắp xếp theo ngày.
 */
function sortByDate(docs, order = 'desc') {
  if (!Array.isArray(docs)) return [];

  const isAsc = String(order).toLowerCase() === 'asc';

  return [...docs].sort((a, b) => {
    // Ưu tiên lấy thuộc tính createdAt, nếu không có thì lấy thuộc tính date
    const rawDateA = a?.createdAt || a?.date || '';
    const rawDateB = b?.createdAt || b?.date || '';

    // Chuyển đổi sang timestamp (mili-giây) để so sánh chính xác cả "YYYY-MM-DD" lẫn ISO string
    const timeA = Date.parse(rawDateA) || 0;
    const timeB = Date.parse(rawDateB) || 0;

    return isAsc ? timeA - timeB : timeB - timeA;
  });
}

/**
 * 6. Sắp xếp danh sách tài liệu theo tiêu đề (title) chuẩn bảng chữ cái tiếng Việt.
 *
 * @param {DocItem[]} docs - Mảng tài liệu gốc.
 * @param {'asc'|'desc'} [order='asc'] - Thứ tự sắp xếp: 'asc' (A-Z) hoặc 'desc' (Z-A).
 * @returns {DocItem[]} Mảng tài liệu mới đã được sắp xếp theo tiêu đề.
 */
function sortByTitle(docs, order = 'asc') {
  if (!Array.isArray(docs)) return [];

  const isDesc = String(order).toLowerCase() === 'desc';

  return [...docs].sort((a, b) => {
    const titleA = typeof a?.title === 'string' ? a.title.trim() : '';
    const titleB = typeof b?.title === 'string' ? b.title.trim() : '';

    // So sánh chuỗi theo chuẩn bảng chữ cái tiếng Việt (A, Ă, Â, B, C, D, Đ,...)
    const comparison = titleA.localeCompare(titleB, 'vi', {
      sensitivity: 'variant', // Phân biệt rõ dấu thanh và chữ hoa/thường
      numeric: true           // Hỗ trợ so sánh số tự nhiên trong chuỗi (VD: "Bài 2" đứng trước "Bài 10")
    });

    return isDesc ? -comparison : comparison;
  });
}