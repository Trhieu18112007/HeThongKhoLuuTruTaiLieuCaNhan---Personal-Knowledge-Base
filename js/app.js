// js/app.js - Điều phối sự kiện trang Kho tài liệu và Trang chủ

document.addEventListener('DOMContentLoaded', () => {
    // 1. Lấy toàn bộ tài liệu từ Storage (hoặc dữ liệu mặc định)
    const allDocs = typeof KBStorage !== 'undefined' ? KBStorage.getAllDocuments() : (typeof DOCUMENTS !== 'undefined' ? DOCUMENTS : []);
    
    // Trạng thái bộ lọc hiện tại
    let currentFilter = {
        keyword: '',
        type: 'ALL',
        tag: ''
    };

    // Khởi tạo hiển thị ban đầu nếu đang ở trang Kho tài liệu
    const repoContainer = document.getElementById('doc-container');
    if (repoContainer) {
        renderDocumentCards(allDocs, 'doc-container');
        updateResultCount(allDocs.length);
    }

    // Khởi tạo hiển thị cho Trang chủ (Top viewed & Recent)
    const homeTopContainer = document.getElementById('home-top-container');
    if (homeTopContainer && typeof getTopViewed === 'function') {
        const topDocs = getTopViewed(allDocs, 4);
        renderDocumentCards(topDocs, 'home-top-container');
    }

    // 2. Lắng nghe sự kiện tìm kiếm nhanh trên thẻ <input type="search" id="searchInput">
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        // Hỗ trợ đọc tham số ?q= từ URL nếu có (KB-35)
        const urlParams = new URLSearchParams(window.location.search);
        const qParam = urlParams.get('q');
        if (qParam) {
            searchInput.value = qParam;
            currentFilter.keyword = qParam;
        }

        searchInput.addEventListener('input', (e) => {
            currentFilter.keyword = e.target.value;
            applyAndRender(allDocs, currentFilter);
        });
    }

    // Xử lý sự kiện lọc theo định dạng file từ các nút bấm
    window.handleTypeFilter = function(type, btnElement) {
        currentFilter.type = type;
        
        // Đổi trạng thái active của nút
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        if (btnElement) btnElement.classList.add('active');

        applyAndRender(allDocs, currentFilter);
    };

    // Xử lý chuyển đổi qua lại giữa Card view và List view (KB-33)
    window.switchViewMode = function(mode) {
        const container = document.getElementById('doc-container');
        if (!container) return;

        document.getElementById('cardViewBtn')?.classList.remove('active');
        document.getElementById('listViewBtn')?.classList.remove('active');

        if (mode === 'card') {
            container.className = 'documents-container card-view';
            document.getElementById('cardViewBtn')?.classList.add('active');
        } else {
            container.className = 'documents-container list-view';
            document.getElementById('listViewBtn')?.classList.add('active');
        }
    };

    // Hàm chung gọi logic lọc và render lại DOM
    function applyAndRender(docs, filter) {
        let result = docs;
        
        // Gọi hàm applyFilters từ logic.js của Khang nếu tồn tại
        if (typeof applyFilters === 'function') {
            result = applyFilters(docs, {
                keyword: filter.keyword,
                type: filter.type === 'ALL' ? '' : filter.type,
                tag: filter.tag
            });
        } else {
            // Fallback cơ bản nếu chưa tích hợp logic.js
            if (filter.keyword) {
                const kw = filter.keyword.toLowerCase();
                result = result.filter(d => d.title.toLowerCase().includes(kw) || d.snippet?.toLowerCase().includes(kw));
            }
            if (filter.type && filter.type !== 'ALL') {
                result = result.filter(d => d.type === filter.type);
            }
        }

        renderDocumentCards(result, 'doc-container');
        updateResultCount(result.length);
    }

    function updateResultCount(count) {
        const countEl = document.getElementById('result-count');
        if (countEl) {
            countEl.innerText = `Tìm thấy ${count} tài liệu`;
        }
    }
});