# Nhật ký Phát triển & Prompt Log (Personal Knowledge Base - Module `js/logic.js`)

Tài liệu này ghi lại toàn bộ tiến trình xây dựng, các yêu cầu kỹ thuật và mã nguồn hoàn chỉnh của file `js/logic.js` cho dự án **Hệ thống Kho lưu trữ Tài liệu cá nhân** sử dụng HTML5, CSS3 và Vanilla JavaScript.

---

## 📋 1. Bảng Tóm tắt Tiến trình & Yêu cầu Kỹ thuật

| STT | Giai đoạn / Chức năng | Yêu cầu Kỹ thuật Cốt lõi | Trạng thái |
| :--- | :--- | :--- | :--- |
| **1** | **Khởi tạo khung logic** | - Định nghĩa 13 hàm thuần (pure functions).<br>- JSDoc đầy đủ (`@typedef`, `@param`, `@returns`).<br>- Đảm bảo tính bất biến (`[...docs]`). | ✅ Hoàn thành |
| **2** | **Tìm kiếm từ khóa (`filterByKeyword`)** | - Tự động `trim()`, xử lý chuỗi rỗng trả về toàn bộ mảng.<br>- Không phân biệt hoa/thường trên `title`, `description` và mảng `tags`.<br>- Tích hợp hàm `normalizeVietnamese()` hỗ trợ tìm kiếm tiếng Việt không dấu. | ✅ Hoàn thành |
| **3** | **Nhóm sắp xếp (`sortByViews`, `sortByDate`, `sortByTitle`)** | - `sortByViews`: Sắp xếp theo số lượt xem (`desc`/`asc`).<br>- `sortByDate`: So sánh chuỗi ngày `"YYYY-MM-DD"` và ISO string qua `Date.parse()`.<br>- `sortByTitle`: Sắp xếp bảng chữ cái tiếng Việt chuẩn xác bằng `localeCompare('vi')`. | ✅ Hoàn thành |
| **4** | **Thống kê & Trích xuất (`getTopViewed`, `getRecent`, `getAllTags`, `countByType`)** | - Lấy giới hạn `limit`, tự động co giãn khi mảng nhỏ hơn limit.<br>- `getAllTags`: Khử trùng lặp bằng `Set`, sắp xếp A-Z chuẩn tiếng Việt.<br>- `countByType`: Dùng `.reduce()`, luôn trả về đủ 3 khóa `{ pdf, video, link }`. | ✅ Hoàn thành |
| **5** | **Lọc theo loại & thẻ (`filterByType`, `filterByTag`)** | - `filterByType`: Hỗ trợ `"all"` hoặc chuỗi rỗng trả về toàn bộ.<br>- `filterByTag`: So khớp chính xác tên thẻ trong mảng `doc.tags`. | ✅ Hoàn thành |
| **6** | **Logic trung tâm (`findById`, `findRelated`, `applyFilters`)** | - `findById`: Tìm linh hoạt theo ID số hoặc chuỗi, trả về bản sao an toàn.<br>- `findRelated`: Chấm điểm độ liên quan (tag chung + cùng type), loại bỏ tài liệu hiện tại.<br>- `applyFilters`: Pipeline tổng hợp tuần tự các bộ lọc và sắp xếp động theo `options`. | ✅ Hoàn thành |

---

## 💻 2. Mã nguồn Hoàn chỉnh: `js/logic.js`

```javascript
/**
 * @file js/logic.js
 * @description Tập hợp các hàm thuần (pure functions) xử lý logic nghiệp vụ 
 * cho Hệ thống Kho lưu trữ Tài liệu cá nhân (Personal Knowledge Base).
 * Tuyệt đối không thao tác DOM và không làm biến đổi (mutate) dữ liệu đầu vào.
 */

/**
 * Định nghĩa cấu trúc một đối tượng Tài liệu (Document).
 * @typedef {Object} DocItem
 * @property {string|number} id - Mã định danh duy nhất của tài liệu.
 * @property {string} title - Tiêu đề tài liệu.
 * @property {string} description - Mô tả ngắn gọn nội dung tài liệu.
 * @property {string} type - Loại tài liệu (ví dụ: 'pdf', 'video', 'link').
 * @property {string[]} tags - Danh sách các thẻ (tags) gắn với tài liệu.
 * @property {number} views - Số lượt xem tài liệu.
 * @property {string} createdAt - Ngày tạo tài liệu (định dạng chuỗi ISO 8601 hoặc 'YYYY-MM-DD').
 */

/**
 * Định nghĩa cấu trúc tùy chọn cho hàm lọc tổng hợp.
 * @typedef {Object} FilterOptions
 * @property {string} [keyword] - Từ khóa tìm kiếm.
 * @property {string} [type] - Loại tài liệu cần lọc.
 * @property {string} [tag] - Thẻ (tag) cần lọc.
 * @property {'views'|'date'|'title'} [sortBy] - Tiêu chí sắp xếp.
 * @property {'asc'|'desc'} [order] - Thứ tự sắp xếp.
 */

/**
 * Hàm phụ trợ: Chuẩn hóa tiếng Việt (viết thường, bỏ dấu, cắt khoảng trắng).
 * @param {string} str - Chuỗi đầu vào.
 * @returns {string} Chuỗi đã chuẩn hóa.
 */
function normalizeVietnamese(str) {
  if (typeof str !== 'string') return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'd')
    .toLowerCase()
    .trim();
}

/**
 * 1. Lọc danh sách tài liệu theo từ khóa (trong title, description, tags), hỗ trợ tiếng Việt không dấu.
 * @param {DocItem[]} docs - Mảng tài liệu gốc.
 * @param {string} keyword - Từ khóa tìm kiếm.
 * @returns {DocItem[]} Mảng tài liệu mới thỏa mãn.
 */
function filterByKeyword(docs, keyword) {
  if (!Array.isArray(docs)) return [];
  if (typeof keyword !== 'string' || keyword.trim() === '') return [...docs];
  const normalizedKeyword = normalizeVietnamese(keyword);

  return docs.filter((doc) => {
    if (!doc || typeof doc !== 'object') return false;
    const matchTitle = typeof doc.title === 'string' && normalizeVietnamese(doc.title).includes(normalizedKeyword);
    if (matchTitle) return true;
    const matchDesc = typeof doc.description === 'string' && normalizeVietnamese(doc.description).includes(normalizedKeyword);
    if (matchDesc) return true;
    return Array.isArray(doc.tags) && doc.tags.some(tag => typeof tag === 'string' && normalizeVietnamese(tag).includes(normalizedKeyword));
  });
}

/**
 * 2. Lọc danh sách tài liệu theo phân loại (pdf, video, link).
 * @param {DocItem[]} docs - Mảng tài liệu gốc.
 * @param {string} type - Loại tài liệu ('all', 'pdf', 'video', 'link').
 * @returns {DocItem[]} Mảng tài liệu mới thuộc loại được chỉ định.
 */
function filterByType(docs, type) {
  if (!Array.isArray(docs)) return [];
  const cleanType = typeof type === 'string' ? type.trim().toLowerCase() : '';
  if (cleanType === '' || cleanType === 'all') return [...docs];
  return docs.filter(doc => doc && typeof doc.type === 'string' && doc.type.trim().toLowerCase() === cleanType);
}

/**
 * 3. Lọc danh sách tài liệu có chứa thẻ (tag) cụ thể.
 * @param {DocItem[]} docs - Mảng tài liệu gốc.
 * @param {string} tag - Tên thẻ cần lọc.
 * @returns {DocItem[]} Mảng tài liệu mới chứa tag.
 */
function filterByTag(docs, tag) {
  if (!Array.isArray(docs)) return [];
  if (typeof tag !== 'string' || tag.trim() === '') return [...docs];
  const targetTag = tag.trim();
  return docs.filter(doc => doc && Array.isArray(doc.tags) && doc.tags.includes(targetTag));
}

/**
 * 4. Sắp xếp tài liệu theo số lượt xem (views).
 * @param {DocItem[]} docs - Mảng tài liệu gốc.
 * @param {'asc'|'desc'} [order='desc'] - Thứ tự sắp xếp.
 * @returns {DocItem[]} Mảng tài liệu mới đã sắp xếp.
 */
function sortByViews(docs, order = 'desc') {
  if (!Array.isArray(docs)) return [];
  const isAsc = String(order).toLowerCase() === 'asc';
  return [...docs].sort((a, b) => {
    const vA = Number(a?.views) || 0;
    const vB = Number(b?.views) || 0;
    return isAsc ? vA - vB : vB - vA;
  });
}

/**
 * 5. Sắp xếp tài liệu theo ngày tạo (createdAt hoặc date).
 * @param {DocItem[]} docs - Mảng tài liệu gốc.
 * @param {'asc'|'desc'} [order='desc'] - Thứ tự sắp xếp.
 * @returns {DocItem[]} Mảng tài liệu mới đã sắp xếp theo ngày.
 */
function sortByDate(docs, order = 'desc') {
  if (!Array.isArray(docs)) return [];
  const isAsc = String(order).toLowerCase() === 'asc';
  return [...docs].sort((a, b) => {
    const tA = Date.parse(a?.createdAt || a?.date || '') || 0;
    const tB = Date.parse(b?.createdAt || b?.date || '') || 0;
    return isAsc ? tA - tB : tB - tA;
  });
}

/**
 * 6. Sắp xếp tài liệu theo tiêu đề chuẩn bảng chữ cái tiếng Việt.
 * @param {DocItem[]} docs - Mảng tài liệu gốc.
 * @param {'asc'|'desc'} [order='asc'] - Thứ tự sắp xếp.
 * @returns {DocItem[]} Mảng tài liệu mới đã sắp xếp theo tiêu đề.
 */
function sortByTitle(docs, order = 'asc') {
  if (!Array.isArray(docs)) return [];
  const isDesc = String(order).toLowerCase() === 'desc';
  return [...docs].sort((a, b) => {
    const titleA = typeof a?.title === 'string' ? a.title.trim() : '';
    const titleB = typeof b?.title === 'string' ? b.title.trim() : '';
    const comp = titleA.localeCompare(titleB, 'vi');
    return isDesc ? -comp : comp;
  });
}

/**
 * 7. Lấy danh sách các tài liệu có lượt xem cao nhất.
 * @param {DocItem[]} docs - Mảng tài liệu gốc.
 * @param {number} [limit=5] - Số lượng tối đa.
 * @returns {DocItem[]} Mảng tài liệu xem nhiều nhất.
 */
function getTopViewed(docs, limit = 5) {
  if (!Array.isArray(docs)) return [];
  return sortByViews(docs, 'desc').slice(0, Math.max(0, Number(limit) || 0));
}

/**
 * 8. Lấy danh sách các tài liệu mới được tạo gần đây nhất.
 * @param {DocItem[]} docs - Mảng tài liệu gốc.
 * @param {number} [limit=5] - Số lượng tối đa.
 * @returns {DocItem[]} Mảng tài liệu mới nhất.
 */
function getRecent(docs, limit = 5) {
  if (!Array.isArray(docs)) return [];
  return sortByDate(docs, 'desc').slice(0, Math.max(0, Number(limit) || 0));
}

/**
 * 9. Trích xuất toàn bộ danh sách các thẻ (tags) duy nhất, sắp xếp A-Z chuẩn tiếng Việt.
 * @param {DocItem[]} docs - Mảng tài liệu gốc.
 * @returns {string[]} Mảng các tag duy nhất.
 */
function getAllTags(docs) {
  if (!Array.isArray(docs)) return [];
  const allTags = docs
    .map(doc => (Array.isArray(doc?.tags) ? doc.tags : []))
    .reduce((acc, tags) => acc.concat(tags), [])
    .filter(t => typeof t === 'string' && t.trim() !== '')
    .map(t => t.trim());
  return [...new Set(allTags)].sort((a, b) => a.localeCompare(b, 'vi'));
}

/**
 * 10. Thống kê số lượng tài liệu theo từng phân loại (luôn có đủ pdf, video, link).
 * @param {DocItem[]} docs - Mảng tài liệu gốc.
 * @returns {Object} Object thống kê số lượng.
 */
function countByType(docs) {
  const initial = { pdf: 0, video: 0, link: 0 };
  if (!Array.isArray(docs)) return initial;
  return docs.reduce((acc, doc) => {
    const t = typeof doc?.type === 'string' ? doc.type.trim().toLowerCase() : '';
    if (t) acc[t] = (acc[t] || 0) + 1;
    return acc;
  }, initial);
}

/**
 * 11. Tìm kiếm tài liệu theo ID (hỗ trợ cả chuỗi và số).
 * @param {DocItem[]} docs - Mảng tài liệu gốc.
 * @param {string|number} id - ID cần tìm.
 * @returns {DocItem|null} Bản sao object tài liệu hoặc null.
 */
function findById(docs, id) {
  if (!Array.isArray(docs) || id === undefined || id === null || String(id).trim() === '') return null;
  const targetId = String(id).trim();
  const found = docs.find(doc => doc && doc.id !== undefined && String(doc.id).trim() === targetId);
  if (!found) return null;
  return { ...found, tags: Array.isArray(found.tags) ? [...found.tags] : [] };
}

/**
 * 12. Tìm các tài liệu liên quan dựa trên tag chung hoặc cùng type.
 * @param {DocItem[]} docs - Mảng tài liệu gốc.
 * @param {DocItem} currentDoc - Tài liệu hiện tại.
 * @param {number} [limit=3] - Giới hạn số lượng trả về.
 * @returns {DocItem[]} Mảng tài liệu liên quan.
 */
function findRelated(docs, currentDoc, limit = 3) {
  if (!Array.isArray(docs) || !currentDoc || typeof currentDoc !== 'object') return [];
  const validLimit = Math.max(0, Number(limit) || 0);
  if (validLimit === 0) return [];

  const cId = currentDoc.id !== undefined ? String(currentDoc.id).trim() : null;
  const cType = typeof currentDoc.type === 'string' ? currentDoc.type.trim().toLowerCase() : '';
  const cTags = Array.isArray(currentDoc.tags) ? currentDoc.tags : [];

  return docs
    .filter(doc => doc && doc !== currentDoc && (cId === null || String(doc.id).trim() !== cId))
    .map(doc => {
      const dTags = Array.isArray(doc.tags) ? doc.tags : [];
      const shared = dTags.filter(t => cTags.includes(t)).length;
      const sameType = cType !== '' && typeof doc.type === 'string' && doc.type.trim().toLowerCase() === cType;
      return { doc, shared, sameType, score: shared * 2 + (sameType ? 1 : 0) };
    })
    .filter(item => item.shared > 0 || item.sameType)
    .sort((a, b) => (b.score !== a.score ? b.score - a.score : (Number(b.doc.views) || 0) - (Number(a.doc.views) || 0)))
    .slice(0, validLimit)
    .map(item => item.doc);
}

/**
 * 13. Hàm tổng hợp pipeline: Áp dụng đồng thời các bộ lọc và sắp xếp động.
 * @param {DocItem[]} docs - Mảng tài liệu gốc.
 * @param {FilterOptions} [options={}] - Object chứa các tiêu chí lọc/sắp xếp.
 * @returns {DocItem[]} Mảng kết quả sau khi qua pipeline.
 */
function applyFilters(docs, options = {}) {
  if (!Array.isArray(docs)) return [];
  let result = [...docs];
  if (!options || typeof options !== 'object') return result;

  const { keyword, type, tag, sortBy, order } = options;

  if (keyword !== undefined && keyword !== null && String(keyword).trim() !== '') {
    result = filterByKeyword(result, String(keyword));
  }
  if (type !== undefined && type !== null && String(type).trim() !== '') {
    result = filterByType(result, String(type));
  }
  if (tag !== undefined && tag !== null && String(tag).trim() !== '') {
    result = filterByTag(result, String(tag));
  }
  if (typeof sortBy === 'string' && sortBy.trim() !== '') {
    const clean = sortBy.trim().toLowerCase();
    const [field, inlineOrder] = clean.split(/[-_]/);
    const finalOrder = inlineOrder || order;

    switch (field) {
      case 'views': case 'view':
        result = sortByViews(result, finalOrder || 'desc');
        break;
      case 'date': case 'createdat': case 'recent':
        result = sortByDate(result, finalOrder || 'desc');
        break;
      case 'title': case 'name':
        result = sortByTitle(result, finalOrder || 'asc');
        break;
    }
  }
  return result;
}