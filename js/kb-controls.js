/*
 * KB-13..18 - Kết nối phần giao diện mới với JS hiện có của nhóm.
 * Không thay đổi js/data.js, js/storage.js, js/logic.js, js/ui.js, js/app.js.
 * Bỏ file này khi Đăng đã tích hợp đầy đủ bộ lọc, thống kê và trang chủ vào app.js.
 */
document.addEventListener('DOMContentLoaded', () => {
  const docs = typeof KBStorage !== 'undefined' && typeof KBStorage.getAllDocuments === 'function'
    ? KBStorage.getAllDocuments()
    : (typeof DOCUMENTS !== 'undefined' ? DOCUMENTS : []);
  if (!Array.isArray(docs)) return;

  // Nếu không có js/ui.js (ví dụ xem bản ZIP độc lập), dựng card tối giản.
  function showDocs(items, containerId) {
    if (typeof renderDocumentCards === 'function') {
      renderDocumentCards(items, containerId);
      return;
    }
    const box = document.getElementById(containerId);
    if (!box) return;
    box.replaceChildren();
    items.forEach(doc => {
      const article = document.createElement('article');
      article.className = 'doc-card';
      article.dataset.id = doc.id;
      const meta = document.createElement('div');
      meta.className = 'doc-meta';
      const badge = document.createElement('span');
      badge.className = `doc-badge badge-${doc.type}`;
      badge.textContent = doc.type === 'link' ? 'LIÊN KẾT' : doc.type.toUpperCase();
      const views = document.createElement('span');
      views.className = 'doc-views';
      views.textContent = `👁 ${doc.views || 0} lượt xem`;
      meta.append(badge, views);
      const heading = document.createElement('h3');
      heading.className = 'doc-title';
      const link = document.createElement('a');
      link.href = `detail.html?id=${encodeURIComponent(doc.id)}`;
      link.textContent = doc.title;
      heading.append(link);
      const description = document.createElement('p');
      description.className = 'doc-snippet';
      description.textContent = doc.description || '';
      const tags = document.createElement('div');
      tags.className = 'doc-tags';
      (doc.tags || []).forEach(tag => {
        const tagEl = document.createElement('span');
        tagEl.className = 'tag';
        tagEl.textContent = `#${tag}`;
        tags.append(tagEl);
      });
      const date = document.createElement('time');
      date.className = 'kb-doc-date';
      date.dateTime = doc.addedAt || '';
      date.textContent = `Ngày thêm: ${doc.addedAt || ''}`;
      article.append(meta, heading, description, tags, date);
      box.append(article);
    });
  }

  // Đồng nhất cách trang chủ và Kho tài liệu hiển thị từng tài liệu.
  function decorateCards(container, displayedDocs) {
    if (!container) return;
    const cards = container.querySelectorAll('.doc-card');
    cards.forEach((card, index) => {
      const doc = displayedDocs[index];
      if (!doc) return;
      const title = card.querySelector('.doc-title');
      if (title && !title.querySelector('a')) {
        const link = document.createElement('a');
        link.href = `detail.html?id=${encodeURIComponent(doc.id)}`;
        link.textContent = title.textContent;
        link.className = 'kb-card-link';
        title.textContent = '';
        title.append(link);
      }
      // UI hiện tại render bằng div + onclick, thêm điều hướng bằng bàn phím.
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'link');
      card.setAttribute('aria-label', `Xem chi tiết: ${doc.title}`);
      card.addEventListener('keydown', (event) => {
        if (event.target !== card) return;
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          window.location.href = `detail.html?id=${encodeURIComponent(doc.id)}`;
        }
      });
      if (doc.addedAt && !card.querySelector('.kb-doc-date')) {
        const time = document.createElement('time');
        time.className = 'kb-doc-date';
        time.dateTime = doc.addedAt;
        // Giữ ngày gốc dễ đối chiếu với data.js, không phụ thuộc múi giờ.
        const parts = String(doc.addedAt).split('-');
        time.textContent = parts.length === 3
          ? `Ngày thêm: ${parts[2]}/${parts[1]}/${parts[0]}`
          : `Ngày thêm: ${doc.addedAt}`;
        card.append(time);
      }
    });
  }

  const libraryContainer = document.getElementById('doc-container');
  if (libraryContainer) {
    const search = document.getElementById('searchInput');
    const typeSelect = document.getElementById('type-filter');
    const sortSelect = document.getElementById('sort-select');
    const chips = document.getElementById('tag-chips');
    const count = document.getElementById('result-count');
    const cardButton = document.getElementById('cardViewBtn');
    const listButton = document.getElementById('listViewBtn');
    const params = new URLSearchParams(window.location.search);
    let activeTag = params.get('tag') || '';
    let view = 'card';
    if (search && params.has('q')) search.value = params.get('q') || '';
    if (typeSelect && ['pdf', 'video', 'link'].includes(params.get('type'))) typeSelect.value = params.get('type');
    if (sortSelect && ['views', 'date', 'title'].includes(params.get('sort'))) sortSelect.value = params.get('sort');
    // PLAN.md dùng sortBy, hỗ trợ cả hai cách ghi URL.
    if (sortSelect && ['views', 'date', 'title'].includes(params.get('sortBy'))) sortSelect.value = params.get('sortBy');

    // Card ⇄ List chỉ thay class của container, không render lại dữ liệu.
    function setView(nextView) {
      view = nextView === 'list' ? 'list' : 'card';
      libraryContainer.classList.remove('card-view', 'list-view', 'kb-view-card', 'kb-view-list');
      libraryContainer.classList.add(view === 'card' ? 'card-view' : 'list-view', view === 'card' ? 'kb-view-card' : 'kb-view-list');
      if (cardButton) {
        cardButton.classList.toggle('kb-btn--active', view === 'card');
        cardButton.classList.toggle('active', view === 'card');
        cardButton.setAttribute('aria-pressed', String(view === 'card'));
      }
      if (listButton) {
        listButton.classList.toggle('kb-btn--active', view === 'list');
        listButton.classList.toggle('active', view === 'list');
        listButton.setAttribute('aria-pressed', String(view === 'list'));
      }
    }

    // Dùng các hàm thuần của Khang theo đúng Data Contract.
    function filteredDocs() {
      const options = {
        keyword: search ? search.value.trim() : '',
        type: typeSelect ? typeSelect.value : 'all',
        tag: activeTag,
        sortBy: sortSelect ? sortSelect.value : 'views'
      };
      if (typeof applyFilters === 'function') return applyFilters(docs, options);
      const key = options.keyword.toLocaleLowerCase('vi');
      let result = docs.filter(doc => {
        const matchesKey = !key || [doc.title, doc.description, ...(doc.tags || [])]
          .some(x => String(x || '').toLocaleLowerCase('vi').includes(key));
        return matchesKey && (options.type === 'all' || doc.type === options.type)
          && (!options.tag || (doc.tags || []).includes(options.tag));
      });
      if (options.sortBy === 'date') result = result.sort((a, b) => String(b.addedAt).localeCompare(String(a.addedAt)));
      else if (options.sortBy === 'title') result = result.sort((a, b) => a.title.localeCompare(b.title, 'vi'));
      else result = result.sort((a, b) => Number(b.views || 0) - Number(a.views || 0));
      return result;
    }

    function refresh() {
      const results = filteredDocs();
      showDocs(results, 'doc-container');
      decorateCards(libraryContainer, results);
      if (count) count.textContent = `Tìm thấy ${results.length} tài liệu`;
      // Để người dùng thoát tình trạng lọc không có kết quả.
      if (!results.length) {
        const empty = libraryContainer.querySelector('.kb-empty-state') || libraryContainer;
        if (!empty.querySelector('.kb-reset-btn')) {
          const resetButton = document.createElement('button');
          resetButton.type = 'button';
          resetButton.className = 'kb-btn kb-reset-btn';
          resetButton.textContent = 'Xóa bộ lọc';
          resetButton.addEventListener('click', () => {
            if (search) search.value = '';
            if (typeSelect) typeSelect.value = 'all';
            if (sortSelect) sortSelect.value = 'views';
            activeTag = '';
            renderChips();
            refresh();
          });
          empty.append(resetButton);
        }
      }
      setView(view);
    }

    function renderChips() {
      if (!chips) return;
      const tags = typeof getAllTags === 'function'
        ? getAllTags(docs)
        : [...new Set(docs.flatMap(doc => doc.tags || []))].sort((a, b) => a.localeCompare(b, 'vi'));
      chips.replaceChildren();
      const all = document.createElement('button');
      all.type = 'button';
      all.className = `kb-chip${activeTag === '' ? ' kb-chip--active' : ''}`;
      all.textContent = 'Tất cả';
      all.setAttribute('aria-pressed', String(activeTag === ''));
      all.addEventListener('click', () => { activeTag = ''; renderChips(); refresh(); });
      chips.append(all);
      tags.forEach(tag => {
        const chip = document.createElement('button');
        chip.type = 'button';
        chip.className = `kb-chip${activeTag === tag ? ' kb-chip--active' : ''}`;
        chip.textContent = `#${tag}`;
        chip.setAttribute('aria-pressed', String(activeTag === tag));
        chip.addEventListener('click', () => { activeTag = activeTag === tag ? '' : tag; renderChips(); refresh(); });
        chips.append(chip);
      });
    }
    // Các listener này chạy sau js/app.js: chuẩn hóa kết quả cho mọi bộ lọc cùng lúc.
    if (search) search.addEventListener('input', refresh);
    if (typeSelect) typeSelect.addEventListener('change', refresh);
    if (sortSelect) sortSelect.addEventListener('change', refresh);
    if (cardButton) cardButton.addEventListener('click', () => setView('card'));
    if (listButton) listButton.addEventListener('click', () => setView('list'));
    renderChips();
    refresh();
  }

  // Trang chủ: 5 tài liệu xem nhiều nhất, 5 tài liệu mới nhất và thống kê thực.
  const homeTop = document.getElementById('home-top-container');
  if (homeTop) {
    const top = typeof getTopViewed === 'function'
      ? getTopViewed(docs, 5)
      : [...docs].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 5);
    showDocs(top, 'home-top-container');
    decorateCards(homeTop, top);
  }
  const recent = document.getElementById('recent');
  if (recent) {
    const newest = typeof getRecent === 'function'
      ? getRecent(docs, 5)
      : [...docs].sort((a, b) => String(b.addedAt).localeCompare(String(a.addedAt))).slice(0, 5);
    showDocs(newest, 'recent');
    decorateCards(recent, newest);
  }
  const stats = document.getElementById('stats');
  if (stats) {
    const types = typeof countByType === 'function'
      ? countByType(docs)
      : docs.reduce((total, doc) => { total[doc.type] = (total[doc.type] || 0) + 1; return total; }, {});
    stats.replaceChildren();
    [
      [docs.length, 'Tổng tài liệu'],
      [types.pdf || 0, 'Tài liệu PDF'],
      [types.video || 0, 'Video học tập'],
      [types.link || 0, 'Liên kết']
    ].forEach(([number, label]) => {
      const item = document.createElement('div');
      item.className = 'kb-stat';
      const value = document.createElement('strong');
      value.className = 'kb-stat__value';
      value.textContent = String(number);
      const caption = document.createElement('span');
      caption.className = 'kb-stat__label';
      caption.textContent = label;
      item.append(value, caption);
      stats.append(item);
    });
  }
});
