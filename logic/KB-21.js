/**
 * Hàm phụ trợ (Pure Function): Chuẩn hóa chuỗi tiếng Việt.
 * Chuyển chuỗi về chữ thường, loại bỏ toàn bộ dấu thanh tiếng Việt và cắt khoảng trắng hai đầu.
 *
 * @param {string} str - Chuỗi đầu vào cần chuẩn hóa.
 * @returns {string} Chuỗi đã được bỏ dấu, viết thường và cắt khoảng trắng thừa.
 */
function normalizeVietnamese(str) {
  if (typeof str !== 'string') return '';

  return str
    .normalize('NFD') // Tách các ký tự có dấu thành ký tự gốc + dấu (Unicode tổ hợp)
    .replace(/[\u0300-\u036f]/g, '') // Xóa toàn bộ các dấu thanh và dấu mũ vừa tách
    .replace(/đ/g, 'd') // Xử lý riêng chữ 'đ' thường
    .replace(/Đ/g, 'd') // Xử lý riêng chữ 'Đ' hoa (chuyển thẳng về 'd' thường)
    .toLowerCase()
    .trim();
}

/**
 * 1. Lọc danh sách tài liệu theo từ khóa (tìm trong title, description và tags).
 * Hỗ trợ tìm kiếm không phân biệt hoa/thường và hỗ trợ tìm tiếng Việt không dấu.
 *
 * @param {DocItem[]} docs - Mảng tài liệu gốc.
 * @param {string} keyword - Từ khóa cần tìm kiếm.
 * @returns {DocItem[]} Mảng tài liệu mới thỏa mãn từ khóa tìm kiếm.
 */
function filterByKeyword(docs, keyword) {
  // Đảm bảo an toàn nếu docs truyền vào không phải mảng
  if (!Array.isArray(docs)) return [];

  // Nếu keyword không phải chuỗi hoặc chỉ chứa khoảng trắng -> trả về bản sao mảng gốc
  if (typeof keyword !== 'string' || keyword.trim() === '') {
    return [...docs];
  }

  // Chuẩn hóa từ khóa (cắt khoảng trắng, viết thường, bỏ dấu tiếng Việt)
  const normalizedKeyword = normalizeVietnamese(keyword);

  // Sử dụng .filter() để luôn tạo mảng mới, không làm biến đổi mảng docs gốc
  return docs.filter((doc) => {
    if (!doc || typeof doc !== 'object') return false;

    // 1. Kiểm tra trong title (chuỗi)
    const matchTitle =
      typeof doc.title === 'string' &&
      normalizeVietnamese(doc.title).includes(normalizedKeyword);

    if (matchTitle) return true; // Tối ưu hiệu năng: khớp title thì nhận luôn, không cần xét tiếp

    // 2. Kiểm tra trong description (chuỗi)
    const matchDesc =
      typeof doc.description === 'string' &&
      normalizeVietnamese(doc.description).includes(normalizedKeyword);

    if (matchDesc) return true;

    // 3. Kiểm tra trong tags (mảng các chuỗi)
    const matchTags =
      Array.isArray(doc.tags) &&
      doc.tags.some(
        (tag) =>
          typeof tag === 'string' &&
          normalizeVietnamese(tag).includes(normalizedKeyword)
      );

    return matchTags;
  });
}