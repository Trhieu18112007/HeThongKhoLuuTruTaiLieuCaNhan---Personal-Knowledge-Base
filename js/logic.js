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
 * @property {string} type - Loại tài liệu (ví dụ: 'pdf', 'video', 'note', 'link').
 * @property {string[]} tags - Danh sách các thẻ (tags) gắn với tài liệu.
 * @property {number} views - Số lượt xem tài liệu.
 * @property {string} addedAt - Ngày thêm tài liệu (định dạng YYYY-MM-DD, theo data.js).
 */

/**
 * Định nghĩa cấu trúc tùy chọn cho hàm lọc tổng hợp.
 * @typedef {Object} FilterOptions
 * @property {string} [keyword] - Từ khóa tìm kiếm.
 * @property {string} [type] - Loại tài liệu cần lọc.
 * @property {string} [tag] - Thẻ (tag) cần lọc.
 * @property {'views'|'date'|'title'} [sortBy] - Tiêu chí sắp xếp.
 * @property {'asc'|'desc'} [order] - Thứ tự sắp xếp ('asc' tăng dần, 'desc' giảm dần).
 */

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
 * 5. Sắp xếp danh sách tài liệu theo ngày tạo (addedAt, createdAt hoặc date).
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
    // Ưu tiên lấy thuộc tính addedAt (data.js), rồi createdAt, nếu không có thì lấy thuộc tính date
    const rawDateA = a?.addedAt || a?.createdAt || a?.date || '';
    const rawDateB = b?.addedAt || b?.createdAt || b?.date || '';

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

// Hỗ trợ export cho môi trường kiểm thử (Node.js); khi nhúng bằng <script> thì đoạn này tự bỏ qua.
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    filterByKeyword, filterByType, filterByTag,
    sortByViews, sortByDate, sortByTitle,
    getTopViewed, getRecent, getAllTags, countByType,
    findById, findRelated, applyFilters,
  };
}
