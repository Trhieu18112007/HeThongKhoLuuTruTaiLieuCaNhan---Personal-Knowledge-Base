/**
 * Lớp lưu trữ dùng chung KBStorage & các hàm tìm kiếm (findById, findRelated)
 * Lưu ý: Nếu trong nhánh chính của nhóm đã có file js/storage.js của Khang,
 * hãy ưu tiên giữ file của Khang. File này giúp trang của Tài chạy độc lập không lỗi.
 */

(function (global) {
    const DOCS_KEY = "pkb_documents";
    const NOTE_PREFIX = "pkb_note_";

    const fallbackDocs = [
        {
            id: 1,
            title: "Xây dựng Second Brain với phương pháp PARA",
            format: "PDF",
            tags: ["PKM", "SecondBrain", "Productivity"],
            views: 120,
            dateAdded: "2026-11-01",
            url: "https://fortelabs.com/blog/para/",
            description: "Phương pháp tổ chức thông tin cá nhân thành 4 thư mục: Projects, Areas, Resources, Archives."
        },
        {
            id: 2,
            title: "Khóa học JavaScript DOM & URLSearchParams",
            format: "Video",
            tags: ["JavaScript", "Web", "Frontend"],
            views: 95,
            dateAdded: "2026-11-05",
            url: "https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams",
            description: "Hướng dẫn đọc tham số từ URL, thao tác DOM và xử lý sự kiện form không tải lại trang."
        },
        {
            id: 3,
            title: "Phương pháp ghi chú Zettelkasten (Smart Notes)",
            format: "Link",
            tags: ["PKM", "Zettelkasten", "SecondBrain"],
            views: 84,
            dateAdded: "2026-11-10",
            url: "https://zettelkasten.de/introduction/",
            description: "Kỹ thuật viết ghi chú nguyên tử và liên kết các ý tưởng để tạo mạng lưới tri thức."
        },
        {
            id: 4,
            title: "Tài liệu nội bộ chưa có liên kết ngoài",
            format: "PDF",
            tags: ["PKM", "Web"],
            views: 42,
            dateAdded: "2026-11-12",
            url: "#",
            description: "Tài liệu mẫu dùng để kiểm thử trường hợp url bằng '#' thì vô hiệu hóa nút Mở tài liệu."
        }
    ];

    if (!global.KBStorage) {
        global.KBStorage = {
            getDocuments() {
                const raw = localStorage.getItem(DOCS_KEY);
                if (raw) {
                    try {
                        return JSON.parse(raw);
                    } catch (e) {
                        // fallback
                    }
                }
                const initial = Array.isArray(global.INITIAL_DOCUMENTS) ? global.INITIAL_DOCUMENTS : fallbackDocs;
                localStorage.setItem(DOCS_KEY, JSON.stringify(initial));
                return initial;
            },

            addDocument(docInput) {
                const docs = this.getDocuments();
                const nextId = docs.length > 0 ? Math.max(...docs.map(d => Number(d.id) || 0)) + 1 : 1;
                const newDoc = {
                    id: nextId,
                    title: docInput.title,
                    format: docInput.format,
                    url: docInput.url,
                    tags: docInput.tags || [],
                    description: docInput.description || "",
                    views: 0,
                    dateAdded: new Date().toISOString().split("T")[0]
                };
                docs.unshift(newDoc);
                localStorage.setItem(DOCS_KEY, JSON.stringify(docs));
                return newDoc;
            },

            increaseViews(id) {
                const docs = this.getDocuments();
                const target = docs.find(d => Number(d.id) === Number(id));
                if (!target) return 0;
                target.views = (Number(target.views) || 0) + 1;
                localStorage.setItem(DOCS_KEY, JSON.stringify(docs));
                return target.views;
            },

            getNote(id) {
                return localStorage.getItem(NOTE_PREFIX + id) || "";
            },

            saveNote(id, content) {
                localStorage.setItem(NOTE_PREFIX + id, content);
            },

            deleteNote(id) {
                localStorage.removeItem(NOTE_PREFIX + id);
            }
        };
    }

    if (typeof global.findById !== "function") {
        global.findById = function (list, id) {
            return (list || []).find(item => Number(item.id) === Number(id)) || null;
        };
    }

    if (typeof global.findRelated !== "function") {
        global.findRelated = function (list, currentDoc, limit = 3) {
            if (!currentDoc || !Array.isArray(currentDoc.tags)) return [];
            const currentTags = currentDoc.tags.map(t => t.toLowerCase());
            return (list || [])
                .filter(item => Number(item.id) !== Number(currentDoc.id))
                .filter(item => (item.tags || []).some(t => currentTags.includes(t.toLowerCase())))
                .slice(0, limit);
        };
    }
})(window);
