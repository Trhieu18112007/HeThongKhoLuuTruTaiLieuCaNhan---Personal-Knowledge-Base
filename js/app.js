/** js/app.js · Đăng (DOM) — tìm kiếm, lọc, sắp xếp và Card/List. */
document.addEventListener('DOMContentLoaded', () => {
  const docs = KBStorage.getAllDocuments();
  if (document.getElementById('home-top-container')) renderHomeWidgets(docs);
  const container = document.getElementById('doc-container');
  if (!container) return;

  const search = document.getElementById('searchInput');
  const typeFilter = document.getElementById('type-filter');
  const sortSelect = document.getElementById('sort-select');
  const chips = document.getElementById('tag-chips');
  const resultCount = document.getElementById('result-count');
  const cardButton = document.getElementById('cardViewBtn');
  const listButton = document.getElementById('listViewBtn');
  const url = new URLSearchParams(window.location.search);
  const state = {
    keyword: url.get('q') || '',
    type: ['pdf','video','link'].includes(url.get('type')) ? url.get('type') : 'all',
    tag: url.get('tag') || '',
    sortBy: ['views','date','title'].includes(url.get('sort')) ? url.get('sort') : 'views',
    view: 'card'
  };
  search.value = state.keyword;
  typeFilter.value = state.type;
  sortSelect.value = state.sortBy;
  const tags = getAllTags(docs);
  if (!tags.includes(state.tag)) state.tag = '';

  /** Cập nhật kiểu hiển thị mà không render lại danh sách. */
  function setView(view) {
    state.view = view;
    container.classList.toggle('kb-view-list', view === 'list');
    container.classList.toggle('kb-view-card', view !== 'list');
    cardButton.classList.toggle('kb-btn--active', view === 'card');
    cardButton.classList.toggle('kb-btn--ghost', view !== 'card');
    listButton.classList.toggle('kb-btn--active', view === 'list');
    listButton.classList.toggle('kb-btn--ghost', view !== 'list');
    cardButton.setAttribute('aria-pressed', String(view === 'card'));
    listButton.setAttribute('aria-pressed', String(view === 'list'));
  }

  function renderTags() {
    const entries = ['', ...tags];
    chips.replaceChildren();
    for (const tag of entries) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'kb-chip' + (state.tag === tag ? ' kb-chip--active' : '');
      button.textContent = tag ? `#${tag}` : 'Tất cả';
      button.setAttribute('aria-pressed', String(state.tag === tag));
      button.addEventListener('click', () => {
        state.tag = state.tag === tag ? '' : tag;
        renderTags();
        refresh();
      });
      chips.append(button);
    }
  }

  function refresh() {
    const result = applyFilters(docs, {
      keyword: state.keyword, type: state.type, tag: state.tag, sortBy: state.sortBy
    });
    renderDocumentCards(result, container);
    resultCount.textContent = `Tìm thấy ${result.length} tài liệu`;
    const clearButton = document.getElementById('kb-clear-filters');
    if (clearButton) clearButton.addEventListener('click', reset);
  }

  function reset() {
    state.keyword = '';
    state.type = 'all';
    state.tag = '';
    state.sortBy = 'views';
    search.value = '';
    typeFilter.value = 'all';
    sortSelect.value = 'views';
    renderTags();
    refresh();
  }

  search.addEventListener('input', () => { state.keyword = search.value; refresh(); });
  typeFilter.addEventListener('change', () => { state.type = typeFilter.value; refresh(); });
  sortSelect.addEventListener('change', () => { state.sortBy = sortSelect.value; refresh(); });
  cardButton.addEventListener('click', () => setView('card'));
  listButton.addEventListener('click', () => setView('list'));
  renderTags();
  refresh();
  setView('card');
});
