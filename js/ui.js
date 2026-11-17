/**
 * js/ui.js - Quản lý hiển thị và render giao diện DOM (Đã Refactor theo chuẩn KB-36)
 */

/**
 * Render danh sách tài liệu ra container dưới dạng Card hoặc List
 * @param {Array} docs - Mảng các đối tượng tài liệu
 * @param {string} containerId - ID của thẻ chứa (mặc định là 'doc-container')
 */
function renderDocumentCards(docs, containerId = 'doc-container') {
    const container = document.getElementById(containerId);
    if (!container) return; // Bảo vệ: Nếu trang hiện tại không có container thì thoát an toàn

    // Trạng thái rỗng (Empty state)
    if (!docs || docs.length === 0) {
        container.innerHTML = `
            <div class="kb-empty-state" style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-muted);">
                <i class="fa-solid fa-folder-open" style="font-size: 2rem; margin-bottom: 8px;"></i>
                <p>Không tìm thấy tài liệu phù hợp với yêu cầu của bạn.</p>
            </div>
        `;
        return;
    }

    // Render danh sách tài liệu với cơ chế chống lỗi XSS (Escape HTML)
    container.innerHTML = docs.map(doc => {
        const fileType = doc.type ? doc.type.toLowerCase() : 'pdf';
        const badgeClass = `badge-${fileType}`;
        const tagsHTML = doc.tags ? doc.tags.map(tag => `<span class="tag">#${escapeHTML(tag)}</span>`).join('') : '';
        
        return `
            <div class="doc-card" onclick="openDetailDoc(${doc.id})">
                <div class="doc-meta">
                    <span class="doc-badge ${badgeClass}">${escapeHTML(doc.type || 'PDF')}</span>
                    <span class="doc-views"><i class="fa-solid fa-eye"></i> ${doc.views || 0}</span>
                </div>
                <div class="doc-title">${escapeHTML(doc.title)}</div>
                <div class="doc-snippet">${escapeHTML(doc.description || doc.snippet || '')}</div>
                <div class="doc-tags">
                    ${tagsHTML}
                </div>
            </div>
        `;
    }).join('');
}

/**
 * Hàm chống lỗi bảo mật XSS khi render chuỗi ra HTML
 * @param {string} str - Chuỗi cần escape
 * @returns {string} Chuỗi an toàn
 */
function escapeHTML(str) {
    if (!str) return '';
    return String(str).replace(/[&<>'"]/g, 
        tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
}

/**
 * Điều hướng người dùng sang trang chi tiết kèm theo ID tài liệu trên URL
 * @param {number|string} id - ID tài liệu
 */
function openDetailDoc(id) {
    if (!id) return;
    window.location.href = `detail.html?id=${id}`;
}