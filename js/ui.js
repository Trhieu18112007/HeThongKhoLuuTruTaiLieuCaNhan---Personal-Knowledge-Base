/** js/ui.js · Đăng (DOM) — thẻ tài liệu, trạng thái rỗng, trang chủ. */
function escapeHTML(value) {
  return String(value ?? '').replace(/[&<>"']/g, character =>
    ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));
}

/** Hiển thị danh sách tài liệu theo 1 cấu trúc DOM dùng được cho cả Card và List. */
function renderDocumentCards(docs, containerId = 'doc-container') {
  const container = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
  if (!container) return;
  const items = Array.isArray(docs) ? docs : [];
  if (!items.length) {
    container.innerHTML = '<div class="kb-empty"><p>Không tìm thấy tài liệu phù hợp.</p><button type="button" class="kb-btn" id="kb-clear-filters">Xóa bộ lọc</button></div>';
    return;
  }
  container.innerHTML = items.map(doc => {
    const type = ['pdf','video','link'].includes(doc.type) ? doc.type : 'link';
    const label = {pdf:'PDF',video:'VIDEO',link:'LIÊN KẾT'}[type];
    const url = `detail.html?id=${encodeURIComponent(doc.id)}`;
    const tags = (Array.isArray(doc.tags) ? doc.tags : []).map(t =>
      `<li class="kb-tag">#${escapeHTML(t)}</li>`).join('');
    return `<article class="kb-card" data-id="${escapeHTML(doc.id)}">
      <span class="kb-badge kb-badge--${type}">${label}</span>
      <h3 class="kb-card__title"><a href="${url}" aria-label="Xem chi tiết ${escapeHTML(doc.title)}">${escapeHTML(doc.title)}</a></h3>
      <p class="kb-card__desc">${escapeHTML(doc.description || 'Chưa có mô tả cho tài liệu này.')}</p>
      <ul class="kb-card__tags">${tags}</ul>
      <div class="kb-card__meta"><span>👁 ${Number(doc.views) || 0} lượt xem</span><time datetime="${escapeHTML(doc.addedAt || '')}">${escapeHTML(doc.addedAt || '')}</time></div>
      <a class="kb-card__open" href="${url}">Xem chi tiết <span aria-hidden="true">→</span></a>
    </article>`;
  }).join('');
}

/** Trang chủ: xem nhiều nhất, mới thêm và thống kê theo dữ liệu thực. */
function renderHomeWidgets(docs) {
  const top = getTopViewed(docs, 5);
  const recent = getRecent(docs, 5);
  renderDocumentCards(top, 'home-top-container');
  renderDocumentCards(recent, 'recent');
  const container = document.getElementById('stats');
  if (!container) return;
  const counts = countByType(docs);
  const values = [
    [docs.length,'Tổng tài liệu'],[counts.pdf,'Tài liệu PDF'],
    [counts.video,'Video học tập'],[counts.link,'Liên kết']
  ];
  container.innerHTML = values.map(([value,label]) =>
    `<div class="kb-stat"><strong class="kb-stat__value">${Number(value) || 0}</strong><span class="kb-stat__label">${label}</span></div>`).join('');
}

/** Giữ tên hàm tương thích với các nhánh đang phát triển. */
function renderCards(docs, container) { renderDocumentCards(docs, container); }
function renderList(docs, container) { renderDocumentCards(docs, container); }
function openDetailDoc(id) { window.location.href = `detail.html?id=${encodeURIComponent(id)}`; }
