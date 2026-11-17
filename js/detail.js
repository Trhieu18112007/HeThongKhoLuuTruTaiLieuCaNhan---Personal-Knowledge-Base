/**
 * Logic Trang Chi tiết tài liệu & Ghi chú (detail.html)
 * Tác giả: Tài | Các task: KB-41, KB-42, KB-43, KB-45, KB-46
 */

const NOTE_MAX_LENGTH = 500;

document.addEventListener("DOMContentLoaded", () => {
    initDetailPage();
});

function initDetailPage() {
    // 1. Đọc tham số id từ URL (?id=...) bằng URLSearchParams (KB-41)
    const params = new URLSearchParams(window.location.search);
    const rawId = params.get("id");
    const docId = Number(rawId);

    const notFoundEl = document.getElementById("dt-not-found");
    const mainWrapperEl = document.getElementById("dt-main-wrapper");

    // Kiểm tra id không tồn tại hoặc không phải số hợp lệ
    if (!rawId || Number.isNaN(docId) || docId <= 0) {
        showNotFound(notFoundEl, mainWrapperEl);
        return;
    }

    // Lấy danh sách tài liệu từ KBStorage và tìm bằng findById của Khang
    const allDocs = KBStorage.getDocuments();
    const doc = findById(allDocs, docId);

    if (!doc) {
        showNotFound(notFoundEl, mainWrapperEl);
        return;
    }

    // 2. Tăng lượt xem đúng 1 lần khi mở trang (KB-42)
    const updatedViews = KBStorage.increaseViews(docId);
    const currentViews = typeof updatedViews === "number" ? updatedViews : (doc.views || 0) + 1;

    // 3. Hiển thị thông tin chi tiết tài liệu lên DOM (KB-41)
    renderDocumentInfo(doc, currentViews);

    // 4. Khởi tạo ô ghi chú & validation n/500 (KB-43)
    initNoteFeature(docId);

    // 5. Hiển thị tối đa 3 tài liệu liên quan cùng tag bằng findRelated của Khang (KB-45)
    renderRelatedDocuments(allDocs, doc);
}

function showNotFound(notFoundEl, mainWrapperEl) {
    if (mainWrapperEl) mainWrapperEl.hidden = true;
    if (notFoundEl) notFoundEl.hidden = false;
}

function renderDocumentInfo(doc, viewsCount) {
    const formatEl = document.getElementById("dt-format");
    formatEl.textContent = doc.format || "PDF";
    formatEl.className = `dt-badge ${doc.format || "PDF"}`;

    document.getElementById("dt-date").textContent = `📅 Ngày thêm: ${doc.dateAdded || "N/A"}`;
    document.getElementById("dt-views").textContent = `👁️ ${viewsCount} lượt xem`;
    document.getElementById("dt-title").textContent = doc.title;
    document.getElementById("dt-description").textContent = doc.description || doc.summary || "Không có mô tả.";

    // Render danh sách tags
    const tagsEl = document.getElementById("dt-tags");
    const tags = Array.isArray(doc.tags) ? doc.tags : [];
    tagsEl.innerHTML = tags.map(tag => `<span class="dt-tag">#${escapeHTML(tag)}</span>`).join("");

    // Xử lý nút "Mở tài liệu" (KB-41): url === "#" thì vô hiệu hóa
    const openBtn = document.getElementById("dt-open-btn");
    if (!doc.url || doc.url.trim() === "#") {
        openBtn.removeAttribute("href");
        openBtn.setAttribute("aria-disabled", "true");
        openBtn.textContent = "🚫 Không có liên kết ngoài";
    } else {
        openBtn.href = doc.url;
        openBtn.setAttribute("target", "_blank");
        openBtn.setAttribute("rel", "noopener");
    }
}

/**
 * Xử lý Ô ghi chú cá nhân: tải ghi chú, đếm ký tự n/500, lưu & xóa có confirm (KB-43)
 */
function initNoteFeature(docId) {
    const textarea = document.getElementById("dt-note-textarea");
    const counterEl = document.getElementById("dt-note-counter");
    const errorEl = document.getElementById("dt-note-error");
    const saveBtn = document.getElementById("dt-save-note-btn");
    const deleteBtn = document.getElementById("dt-delete-note-btn");

    // Nạp ghi chú đã lưu khi mở trang
    const savedNote = KBStorage.getNote(docId) || "";
    textarea.value = savedNote;
    updateCounterAndValidate();

    // Cập nhật bộ đếm n/500 theo từng ký tự gõ
    textarea.addEventListener("input", () => {
        updateCounterAndValidate();
    });

    function updateCounterAndValidate() {
        const len = textarea.value.length;
        counterEl.textContent = `${len}/${NOTE_MAX_LENGTH}`;

        if (len > NOTE_MAX_LENGTH) {
            counterEl.classList.add("is-over");
            textarea.classList.add("is-invalid");
            errorEl.textContent = `⚠️ Ghi chú vượt quá ${NOTE_MAX_LENGTH} ký tự!`;
            return false;
        } else {
            counterEl.classList.remove("is-over");
            textarea.classList.remove("is-invalid");
            errorEl.textContent = "";
            return true;
        }
    }

    // Lưu ghi chú
    saveBtn.addEventListener("click", () => {
        const trimmed = textarea.value.trim();

        // Lưu rỗng -> báo lỗi, không lưu
        if (trimmed.length === 0) {
            textarea.classList.add("is-invalid");
            errorEl.textContent = "⚠️ Ghi chú không được để trống!";
            textarea.focus();
            return;
        }

        // Vượt giới hạn 500 ký tự -> không lưu
        if (!updateCounterAndValidate()) {
            textarea.focus();
            return;
        }

        KBStorage.saveNote(docId, trimmed);
        textarea.value = trimmed;
        updateCounterAndValidate();
        showToast("✅ Đã lưu ghi chú thành công!");
    });

    // Xóa ghi chú có hộp thoại xác nhận confirm()
    deleteBtn.addEventListener("click", () => {
        const existingNote = KBStorage.getNote(docId);
        if (!existingNote && textarea.value.trim() === "") {
            showToast("ℹ️ Chưa có ghi chú nào để xóa.");
            return;
        }

        const isConfirmed = confirm("Bạn có chắc chắn muốn xóa ghi chú của tài liệu này không?");
        if (!isConfirmed) return;

        KBStorage.deleteNote(docId);
        textarea.value = "";
        updateCounterAndValidate();
        showToast("🗑️ Đã xóa ghi chú!");
    });
}

/**
 * Hiển thị tối đa 3 tài liệu liên quan cùng tag dùng findRelated của Khang (KB-45)
 */
function renderRelatedDocuments(allDocs, currentDoc) {
    const relatedSection = document.getElementById("dt-related-section");
    const relatedGrid = document.getElementById("dt-related-grid");

    if (typeof findRelated !== "function") return;

    const relatedDocs = findRelated(allDocs, currentDoc, 3);
    if (!relatedDocs || relatedDocs.length === 0) {
        relatedSection.hidden = true;
        return;
    }

    relatedSection.hidden = false;
    relatedGrid.innerHTML = relatedDocs.map(item => `
        <a href="detail.html?id=${item.id}" class="dt-related-card">
            <div>
                <span class="dt-badge ${item.format}">${escapeHTML(item.format)}</span>
                <h3>${escapeHTML(item.title)}</h3>
            </div>
            <div class="dt-meta-text">
                ${(item.tags || []).map(t => "#" + escapeHTML(t)).join(" ")}
            </div>
        </a>
    `).join("");
}

function showToast(message) {
    const toast = document.getElementById("dt-toast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2800);
}

function escapeHTML(str) {
    return String(str).replace(/[&<>"']/g, ch => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[ch]));
}
