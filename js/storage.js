/* ==========================================================================
   storage.js - LỚP LƯU TRỮ DÙNG CHUNG (localStorage)
   Chủ sở hữu file: Nhóm trưởng (Hiếu). Mọi trang đều đọc/ghi dữ liệu người dùng
   THÔNG QUA đối tượng KBStorage, không ai gọi localStorage trực tiếp.

   Phải nạp SAU data.js (cần biến DOCUMENTS).

   Dữ liệu lưu trong localStorage:
     kb_user_docs  : mảng tài liệu do người dùng thêm (cùng cấu trúc như DOCUMENTS)
     kb_notes      : object { "<id>": "nội dung ghi chú" }  (chuỗi rỗng "" = người dùng đã xóa ghi chú)
     kb_views      : object { "<id>": số lượt xem tăng thêm }
   ========================================================================== */

const KBStorage = (function () {
  const KEYS = {
    USER_DOCS: "kb_user_docs",
    NOTES: "kb_notes",
    VIEWS: "kb_views"
  };
  const USER_DOC_START_ID = 1000;
  const NOTE_MAX_LENGTH = 500;

  /* ---------- Hàm nội bộ: đọc/ghi JSON an toàn ---------- */
  function readJSON(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (error) {
      console.warn("[KBStorage] Không đọc được", key, error);
      return fallback;
    }
  }

  /** Đọc một object thuần; nếu dữ liệu hỏng (null, mảng...) thì trả {} để không bị lỗi. */
  function readObject(key) {
    const value = readJSON(key, {});
    return value && typeof value === "object" && !Array.isArray(value) ? value : {};
  }

  function writeJSON(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.warn("[KBStorage] Không ghi được", key, error);
      return false;
    }
  }

  /** Ngày hôm nay theo GIỜ MÁY (YYYY-MM-DD). Không dùng toISOString vì nó tính theo UTC, sẽ lệch 1 ngày trước 7h sáng ở Việt Nam. */
  function todayISO() {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return now.getFullYear() + "-" + month + "-" + day;
  }

  /* ---------- Tài liệu ---------- */

  /** Tài liệu do người dùng thêm (chỉ phần lưu trong localStorage). */
  function getUserDocuments() {
    const docs = readJSON(KEYS.USER_DOCS, []);
    return Array.isArray(docs) ? docs : [];
  }

  /**
   * Trả về TẤT CẢ tài liệu = DOCUMENTS (data.js) + tài liệu người dùng thêm,
   * đã cộng lượt xem tăng thêm và gắn ghi chú của người dùng.
   * Đây là hàm DUY NHẤT các trang nên gọi để lấy danh sách tài liệu.
   */
  function getAllDocuments() {
    const views = readObject(KEYS.VIEWS);
    const notes = readObject(KEYS.NOTES);
    return DOCUMENTS.concat(getUserDocuments()).map(function (doc) {
      return Object.assign({}, doc, {
        views: doc.views + (Number(views[doc.id]) || 0),
        note: typeof notes[doc.id] === "string" ? notes[doc.id] : doc.note
      });
    });
  }

  /** Cấp id mới cho tài liệu người dùng thêm (>= 1000). */
  function getNextId() {
    const ids = getUserDocuments().map(function (d) { return d.id; });
    return ids.length ? Math.max.apply(null, ids) + 1 : USER_DOC_START_ID;
  }

  /**
   * Thêm tài liệu mới. Truyền vào { title, type/format, tags, description, url }.
   * Trả về tài liệu đã lưu (có id, views, addedAt, note) hoặc null nếu ghi thất bại.
   */
  function addDocument(input) {
    const docType = input.type || input.format;
    if (typeof DOC_TYPES !== "undefined" && !DOC_TYPES[docType]) return null;
    const url = String(input.url || "").trim();
    const doc = {
      id: getNextId(),
      title: String(input.title || "").trim(),
      type: docType,
      format: docType,
      tags: Array.isArray(input.tags) ? input.tags : [],
      description: String(input.description || "").trim(),
      url: url || "#",
      views: 0,
      addedAt: todayISO(),
      dateAdded: todayISO(),
      note: ""
    };
    const docs = getUserDocuments();
    docs.push(doc);
    return writeJSON(KEYS.USER_DOCS, docs) ? doc : null;
  }

  /* ---------- Ghi chú ---------- */

  /** Ghi chú hiện tại của tài liệu: ghi chú người dùng đã lưu, nếu chưa có thì lấy ghi chú mẫu trong data.js. */
  function getNote(id) {
    const notes = readObject(KEYS.NOTES);
    if (typeof notes[id] === "string") return notes[id];
    const doc = DOCUMENTS.concat(getUserDocuments()).find(function (d) { return d.id === Number(id); });
    return doc ? doc.note : "";
  }

  /** Lưu ghi chú (tự cắt còn tối đa NOTE_MAX_LENGTH ký tự). Trả về true/false. */
  function saveNote(id, text) {
    const notes = readObject(KEYS.NOTES);
    notes[id] = String(text).slice(0, NOTE_MAX_LENGTH);
    return writeJSON(KEYS.NOTES, notes);
  }

  /** Xóa ghi chú. Lưu "" thay vì xóa key, để ghi chú mẫu trong data.js không hiện lại. */
  function deleteNote(id) {
    const notes = readObject(KEYS.NOTES);
    notes[id] = "";
    return writeJSON(KEYS.NOTES, notes);
  }

  /* ---------- Lượt xem ---------- */

  /** Tăng lượt xem của tài liệu thêm 1 (gọi khi mở trang chi tiết). Trả về số lượt xem mới. */
  function increaseViews(id) {
    const views = readObject(KEYS.VIEWS);
    views[id] = (Number(views[id]) || 0) + 1;
    writeJSON(KEYS.VIEWS, views);
    // Trả về tổng lượt xem (base + tăng thêm) cho detail.js dùng
    const baseDoc = DOCUMENTS.concat(getUserDocuments()).find(function (d) { return d.id === Number(id); });
    const baseViews = baseDoc ? (baseDoc.views || 0) : 0;
    return baseViews + views[id];
  }

  return {
    NOTE_MAX_LENGTH: NOTE_MAX_LENGTH,
    getAllDocuments: getAllDocuments,
    getDocuments: getAllDocuments,
    getUserDocuments: getUserDocuments,
    addDocument: addDocument,
    getNote: getNote,
    saveNote: saveNote,
    deleteNote: deleteNote,
    increaseViews: increaseViews
  };
})();
