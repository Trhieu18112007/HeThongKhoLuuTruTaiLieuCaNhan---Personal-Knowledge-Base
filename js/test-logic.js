/**
 * test-logic.js - Bản logic TẠM để Đăng test. Không commit.
 * Khi Khang merge js/logic.js vào main thì xóa file này.
 */
function normText(s) {
  return String(s === undefined || s === null ? "" : s).trim().toLowerCase();
}

// Bỏ dấu tiếng Việt: "Toán" → "toan"
function removeAccents(s) {
  return normText(s).normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d");
}

// data.js dùng addedAt
function docDate(d) {
  return String(d.addedAt || d.createdAt || d.dateAdded || d.date || "");
}

function filterByKeyword(docs, keyword) {
  if (!Array.isArray(docs)) return [];
  const k = removeAccents(keyword);
  if (!k) return [...docs];
  return docs.filter(d =>
    removeAccents(d.title).includes(k) ||
    removeAccents(d.description).includes(k) ||
    (d.tags || []).some(t => removeAccents(t).includes(k))
  );
}

function filterByType(docs, type) {
  if (!Array.isArray(docs)) return [];
  const t = normText(type);
  if (!t || t === "all") return [...docs];
  return docs.filter(d => normText(d.type) === t);
}

function filterByTag(docs, tag) {
  if (!Array.isArray(docs)) return [];
  const t = normText(tag);
  if (!t) return [...docs];
  return docs.filter(d => (d.tags || []).some(x => normText(x) === t));
}

function sortByViews(docs, order = "desc") {
  const dir = order === "asc" ? 1 : -1;
  return [...docs].sort((a, b) => dir * ((Number(a.views) || 0) - (Number(b.views) || 0)));
}

function sortByDate(docs, order = "desc") {
  const dir = order === "asc" ? 1 : -1;
  return [...docs].sort((a, b) => dir * docDate(a).localeCompare(docDate(b)));
}

function sortByTitle(docs, order = "asc") {
  const dir = order === "desc" ? -1 : 1;
  return [...docs].sort((a, b) => dir * String(a.title).localeCompare(String(b.title), "vi"));
}

function getTopViewed(docs, limit = 5) {
  return sortByViews(docs, "desc").slice(0, limit);
}

function getRecent(docs, limit = 5) {
  return sortByDate(docs, "desc").slice(0, limit);
}

function getAllTags(docs) {
  const all = docs.flatMap(d => d.tags || []);
  return [...new Set(all)].sort((a, b) => a.localeCompare(b));
}

function countByType(docs) {
  return docs.reduce((acc, d) => {
    acc[d.type] = (acc[d.type] || 0) + 1;
    return acc;
  }, { pdf: 0, video: 0, link: 0 });
}

function findById(docs, id) {
  if (!Array.isArray(docs) || id === undefined || id === null) return null;
  return docs.find(d => String(d.id) === String(id).trim()) || null;
}

function findRelated(docs, currentDoc, limit = 3) {
  if (!currentDoc) return [];
  const tags = currentDoc.tags || [];
  return docs
    .filter(d => String(d.id) !== String(currentDoc.id) && (d.tags || []).some(t => tags.includes(t)))
    .slice(0, limit);
}

function applyFilters(docs, options = {}) {
  let result = [...docs];
  const { keyword, type, tag, sortBy, order } = options || {};

  if (keyword && String(keyword).trim()) result = filterByKeyword(result, keyword);
  if (type && String(type).trim()) result = filterByType(result, type);
  if (tag && String(tag).trim()) result = filterByTag(result, tag);

  if (sortBy) {
    const [field, inlineOrder] = String(sortBy).toLowerCase().split(/[-_]/);
    const dir = inlineOrder || order;
    if (field === "views") result = sortByViews(result, dir || "desc");
    else if (field === "date") result = sortByDate(result, dir || "desc");
    else if (field === "title") result = sortByTitle(result, dir || "asc");
  }
  return result;
}