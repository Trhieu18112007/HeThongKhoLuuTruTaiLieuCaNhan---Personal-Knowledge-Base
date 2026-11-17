/**
 * 2. Lọc danh sách tài liệu theo phân loại (pdf, video, link).
 * Nếu `type` là "all" hoặc chuỗi rỗng thì trả về bản sao toàn bộ danh sách.
 *
 * @param {DocItem[]} docs - Mảng tài liệu gốc.
 * @param {string} type - Loại tài liệu cần lọc ('all', 'pdf', 'video', 'link',...).
 * @returns {DocItem[]} Mảng tài liệu mới thuộc loại được chỉ định (hoặc [] nếu không khớp).
 */
function filterByType(docs, type) {
  if (!Array.isArray(docs)) return [];

  const cleanType = typeof type === 'string' ? type.trim().toLowerCase() : '';

  // Nếu type rỗng hoặc bằng "all" -> trả về bản sao toàn bộ mảng gốc
  if (cleanType === '' || cleanType === 'all') {
    return [...docs];
  }

  // Sử dụng .filter() tạo mảng mới, nếu không có phần tử nào khớp sẽ tự động trả về []
  return docs.filter((doc) => {
    const docType = typeof doc?.type === 'string' ? doc.type.trim().toLowerCase() : '';
    return docType === cleanType;
  });
}

/**
 * 3. Lọc danh sách tài liệu có chứa một thẻ (tag) cụ thể.
 * Nếu `tag` rỗng ("") thì trả về bản sao toàn bộ danh sách.
 * So khớp chính xác tên tag trong mảng `doc.tags`.
 *
 * @param {DocItem[]} docs - Mảng tài liệu gốc.
 * @param {string} tag - Tên thẻ (tag) cần lọc.
 * @returns {DocItem[]} Mảng tài liệu mới có chứa tag được chỉ định.
 */
function filterByTag(docs, tag) {
  if (!Array.isArray(docs)) return [];

  // Nếu tag không phải chuỗi hoặc là chuỗi rỗng -> trả về bản sao toàn bộ mảng gốc
  if (typeof tag !== 'string' || tag.trim() === '') {
    return [...docs];
  }

  const targetTag = tag.trim();

  // Sử dụng .filter() kết hợp .includes() để so khớp chính xác tên tag trong mảng doc.tags
  return docs.filter((doc) => {
    return Array.isArray(doc?.tags) && doc.tags.includes(targetTag);
  });
}