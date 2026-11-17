/**
 * 11. Tìm kiếm một tài liệu cụ thể dựa vào mã định danh (id).
 * Hỗ trợ so khớp cả khi id truyền vào là chuỗi ("1") hoặc số (1).
 *
 * @param {DocItem[]} docs - Mảng tài liệu gốc.
 * @param {string|number} id - ID của tài liệu cần tìm.
 * @returns {DocItem|null} Trả về bản sao object tài liệu nếu tìm thấy, ngược lại trả về `null`.
 */
function findById(docs, id) {
  if (!Array.isArray(docs) || id === undefined || id === null || String(id).trim() === '') {
    return null;
  }

  const targetId = String(id).trim();
  const foundDoc = docs.find(
    (doc) => doc && doc.id !== undefined && doc.id !== null && String(doc.id).trim() === targetId
  );

  // Trả về bản sao nông của object (và mảng tags bên trong) để tránh làm biến đổi dữ liệu gốc
  if (!foundDoc) return null;
  return {
    ...foundDoc,
    tags: Array.isArray(foundDoc.tags) ? [...foundDoc.tags] : []
  };
}

/**
 * 12. Tìm các tài liệu liên quan đến tài liệu hiện tại (có chung ít nhất 1 tag hoặc cùng type).
 * Loại bỏ chính `currentDoc` khỏi kết quả và ưu tiên tài liệu có nhiều điểm chung nhất.
 *
 * @param {DocItem[]} docs - Mảng tài liệu gốc.
 * @param {DocItem} currentDoc - Đối tượng tài liệu đang xem.
 * @param {number} [limit=3] - Số lượng tài liệu liên quan tối đa cần lấy.
 * @returns {DocItem[]} Mảng chứa tối đa `limit` tài liệu liên quan.
 */
function findRelated(docs, currentDoc, limit = 3) {
  if (!Array.isArray(docs) || !currentDoc || typeof currentDoc !== 'object') {
    return [];
  }

  const validLimit = Math.max(0, Number(limit) || 0);
  if (validLimit === 0) return [];

  const currentId = currentDoc.id !== undefined && currentDoc.id !== null ? String(currentDoc.id).trim() : null;
  const currentType = typeof currentDoc.type === 'string' ? currentDoc.type.trim().toLowerCase() : '';
  const currentTags = Array.isArray(currentDoc.tags) ? currentDoc.tags : [];

  return docs
    // Bước 1: Loại bỏ chính currentDoc ra khỏi danh sách xét duyệt
    .filter((doc) => {
      if (!doc || typeof doc !== 'object') return false;
      if (currentId !== null && doc.id !== undefined && String(doc.id).trim() === currentId) {
        return false;
      }
      return doc !== currentDoc;
    })
    // Bước 2: Đánh giá mức độ liên quan (đếm số tag trùng và kiểm tra cùng type)
    .map((doc) => {
      const docTags = Array.isArray(doc.tags) ? doc.tags : [];
      const sharedTagsCount = docTags.filter((tag) => currentTags.includes(tag)).length;

      const docType = typeof doc.type === 'string' ? doc.type.trim().toLowerCase() : '';
      const isSameType = currentType !== '' && docType === currentType;

      return {
        doc,
        sharedTagsCount,
        isSameType,
        // Điểm ưu tiên: mỗi tag trùng được 2 điểm, cùng type được 1 điểm
        relevanceScore: sharedTagsCount * 2 + (isSameType ? 1 : 0)
      };
    })
    // Bước 3: Chỉ giữ lại tài liệu có ít nhất 1 tag chung HOẶC cùng type
    .filter((item) => item.sharedTagsCount > 0 || item.isSameType)
    // Bước 4: Sắp xếp tài liệu có độ liên quan cao nhất lên đầu (nếu bằng điểm thì ưu tiên lượt xem cao hơn)
    .sort((a, b) => {
      if (b.relevanceScore !== a.relevanceScore) {
        return b.relevanceScore - a.relevanceScore;
      }
      return (Number(b.doc.views) || 0) - (Number(a.doc.views) || 0);
    })
    // Bước 5: Cắt theo giới hạn limit và trả về mảng các object tài liệu gốc
    .slice(0, validLimit)
    .map((item) => item.doc);
}

/**
 * 13. Hàm tổng hợp (pipeline): Áp dụng đồng thời các bộ lọc (keyword, type, tag) và sắp xếp.
 * Tự động bỏ qua các tiêu chí bị thiếu hoặc `undefined` trong `options`.
 *
 * @param {DocItem[]} docs - Mảng tài liệu gốc.
 * @param {FilterOptions} [options={}] - Object chứa các tiêu chí: { keyword, type, tag, sortBy, order }.
 * @returns {DocItem[]} Mảng tài liệu mới sau khi đã qua toàn bộ chuỗi lọc và sắp xếp.
 */
function applyFilters(docs, options = {}) {
  if (!Array.isArray(docs)) return [];

  // Khởi tạo bản sao mảng ban đầu để đảm bảo tính bất biến nếu không có bộ lọc nào chạy
  let result = [...docs];

  if (!options || typeof options !== 'object') {
    return result;
  }

  const { keyword, type, tag, sortBy, order } = options;

  // 1. Lọc theo từ khóa (nếu có truyền keyword)
  if (keyword !== undefined && keyword !== null && String(keyword).trim() !== '') {
    result = filterByKeyword(result, String(keyword));
  }

  // 2. Lọc theo loại tài liệu (nếu có truyền type)
  if (type !== undefined && type !== null && String(type).trim() !== '') {
    result = filterByType(result, String(type));
  }

  // 3. Lọc theo thẻ tag (nếu có truyền tag)
  if (tag !== undefined && tag !== null && String(tag).trim() !== '') {
    result = filterByTag(result, String(tag));
  }

  // 4. Sắp xếp kết quả (nếu có truyền sortBy)
  if (typeof sortBy === 'string' && sortBy.trim() !== '') {
    const cleanSortBy = sortBy.trim().toLowerCase();

    // Hỗ trợ cả định dạng gộp (VD: 'views-asc', 'date-desc') hoặc truyền tách rời qua thuộc tính `order`
    const [field, inlineOrder] = cleanSortBy.split(/[-_]/);
    const finalOrder = inlineOrder || order;

    switch (field) {
      case 'views':
      case 'view':
        result = sortByViews(result, finalOrder || 'desc');
        break;
      case 'date':
      case 'createdat':
      case 'recent':
        result = sortByDate(result, finalOrder || 'desc');
        break;
      case 'title':
      case 'name':
        result = sortByTitle(result, finalOrder || 'asc');
        break;
      default:
        // Nếu giá trị sortBy không khớp với các trường hỗ trợ, giữ nguyên thứ tự hiện tại
        break;
    }
  }

  return result;
}