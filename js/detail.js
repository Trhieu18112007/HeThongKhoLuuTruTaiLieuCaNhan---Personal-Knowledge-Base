/** js/detail.js · Tài — chi tiết tài liệu, lượt xem, ghi chú, liên quan. */
const NOTE_MAX_LENGTH = 500;
document.addEventListener('DOMContentLoaded', () => {
  const rawId = new URLSearchParams(window.location.search).get('id');
  const id = rawId === null ? NaN : Number(rawId);
  const notFound = document.getElementById('dt-not-found');
  const wrapper = document.getElementById('dt-main-wrapper');
  const allDocs = KBStorage.getAllDocuments();
  const doc = Number.isSafeInteger(id) && id > 0 ? findById(allDocs, id) : null;
  if (!doc) { notFound.hidden = false; wrapper.hidden = true; return; }
  notFound.hidden = true;
  wrapper.hidden = false;

  // Chỉ tăng 1 lượt khi mở trang có ID hợp lệ.
  const views = KBStorage.increaseViews(id);
  const type = ['pdf','video','link'].includes(doc.type) ? doc.type : 'link';
  const badge = document.getElementById('dt-format');
  badge.textContent = {pdf:'PDF',video:'VIDEO',link:'LIÊN KẾT'}[type];
  badge.className = `dt-badge dt-badge--${type}`;
  document.getElementById('dt-date').textContent = `📅 Ngày thêm: ${doc.addedAt || 'Không rõ'}`;
  document.getElementById('dt-views').textContent = `👁 ${Number(views) || (doc.views + 1)} lượt xem`;
  document.getElementById('dt-title').textContent = doc.title;
  document.title = `${doc.title} | LHU Second Brain`;
  document.getElementById('dt-description').textContent = doc.description || 'Tài liệu này chưa có mô tả.';

  const tagElement = document.getElementById('dt-tags');
  tagElement.replaceChildren();
  (doc.tags || []).forEach(tag => {
    const el = document.createElement('span');
    el.className = 'dt-tag';
    el.textContent = '#' + tag;
    tagElement.append(el);
  });

  // URL trong dữ liệu mẫu là "#" thì chỉ có thông tin chi tiết, không có PDF/video gốc.
  const external = document.getElementById('dt-open-btn');
  const hint = document.getElementById('dt-source-hint');
  let validUrl = false;
  try {
    const link = new URL(doc.url);
    validUrl = ['http:','https:'].includes(link.protocol) && !!link.hostname;
  } catch (_) { /* Chưa có URL thật */ }
  if (validUrl) {
    external.href = doc.url;
    external.removeAttribute('aria-disabled');
    external.textContent = '↗ Mở tài liệu gốc';
    hint.textContent = 'Tài liệu gốc sẽ mở trong tab mới.';
  } else {
    external.removeAttribute('href');
    external.setAttribute('aria-disabled','true');
    external.textContent = 'Chưa có đường dẫn tài liệu gốc';
    hint.textContent = 'Đây là tài liệu mẫu mới có tiêu đề và mô tả, chưa có tệp/URL thật. Bạn vẫn có thể xem thông tin, tìm tài liệu liên quan và lưu ghi chú.';
  }

  const textarea = document.getElementById('dt-note-textarea');
  const counter = document.getElementById('dt-note-counter');
  const error = document.getElementById('dt-note-error');
  const saved = KBStorage.getNote(id) || '';
  textarea.value = saved;
  function validateNote() {
    const length = textarea.value.length;
    counter.textContent = `${length}/${NOTE_MAX_LENGTH}`;
    const valid = length <= NOTE_MAX_LENGTH;
    error.textContent = valid ? '' : 'Ghi chú vượt quá 500 ký tự.';
    return valid;
  }
  textarea.addEventListener('input', () => {error.textContent = ''; validateNote();});
  validateNote();
  document.getElementById('dt-save-note-btn').addEventListener('click', () => {
    const text = textarea.value.trim();
    if (!text) { error.textContent = 'Vui lòng nhập ghi chú trước khi lưu.'; textarea.focus(); return; }
    if (!validateNote()) return;
    if (!KBStorage.saveNote(id, text)) { error.textContent = 'Không lưu được ghi chú, hãy kiểm tra bộ nhớ trình duyệt.'; return; }
    textarea.value = text;
    validateNote();
    showDetailToast('Đã lưu ghi chú thành công!');
  });
  document.getElementById('dt-delete-note-btn').addEventListener('click', () => {
    if (!textarea.value && !KBStorage.getNote(id)) { showDetailToast('Chưa có ghi chú để xóa.'); return; }
    if (!window.confirm('Bạn có chắc muốn xóa ghi chú này?')) return;
    if (!KBStorage.deleteNote(id)) { error.textContent = 'Không xóa được ghi chú.'; return; }
    textarea.value = '';
    error.textContent = '';
    validateNote();
    showDetailToast('Đã xóa ghi chú.');
  });

  const related = findRelated(allDocs, doc, 3);
  const section = document.getElementById('dt-related-section');
  if (related.length) {
    section.hidden = false;
    const grid = document.getElementById('dt-related-grid');
    grid.replaceChildren();
    for (const other of related) {
      const link = document.createElement('a');
      link.href = `detail.html?id=${encodeURIComponent(other.id)}`;
      link.className = 'dt-related-card';
      const badge = document.createElement('span');
      badge.className = 'dt-badge dt-badge--' + other.type;
      badge.textContent = (other.type || 'link').toUpperCase();
      const title = document.createElement('h3');
      title.textContent = other.title;
      const tags = document.createElement('p');
      tags.className = 'dt-meta-text';
      tags.textContent = (other.tags || []).map(t => '#' + t).join('  ');
      link.append(badge, title, tags);
      grid.append(link);
    }
  }
});
function showDetailToast(message) {
  const toast = document.getElementById('dt-toast');
  toast.textContent = message;
  toast.classList.add('show');
  window.clearTimeout(showDetailToast.timer);
  showDetailToast.timer = window.setTimeout(() => toast.classList.remove('show'), 2600);
}
