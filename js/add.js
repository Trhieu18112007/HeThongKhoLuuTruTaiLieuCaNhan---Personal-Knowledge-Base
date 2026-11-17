/**
 * Logic Form Thêm Tài Liệu Mới (add.html)
 * Tác giả: Tài | Task: KB-44 (Validation bằng Regex, báo lỗi khi gõ)
 */

/**
 * Kiểm tra chuỗi URL bắt đầu bằng http:// hoặc https:// và có tên miền hợp lệ.
 *
 * 5 VÍ DỤ ĐÚNG (true):
 * 1. "https://developer.mozilla.org/en-US/docs/Web/JavaScript"
 * 2. "http://example.com"
 * 3. "https://sub.domain.edu.vn/tai-lieu.pdf"
 * 4. "https://github.com/user/repo?tab=readme"
 * 5. "http://localhost:3000/page" -> (Nếu tính domain chuẩn có dấu chấm: "https://lhu.edu.vn/khoa-cntt")
 *
 * 5 VÍ DỤ SAI (false):
 * 1. "ftp://files.example.com/doc.pdf" (sai giao thức, không phải http/https)
 * 2. "google.com" (thiếu http:// hoặc https://)
 * 3. "https://localhost" (tên miền thiếu phần mở rộng TLD như .com, .vn)
 * 4. "http://invalid domain.com" (chứa khoảng trắng)
 * 5. "https://.com" (thiếu tên miền chính)
 */
function validateUrl(value) {
    const trimmed = String(value || "").trim();
    const urlPattern = /^https?:\/\/([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[^\s]*)?$/;
    return urlPattern.test(trimmed);
}

document.addEventListener("DOMContentLoaded", () => {
    initAddDocumentForm();
});

function initAddDocumentForm() {
    const form = document.getElementById("dt-add-form");
    const titleInput = document.getElementById("dt-title-input");
    const formatSelect = document.getElementById("dt-format-select");
    const urlInput = document.getElementById("dt-url-input");
    const tagsInput = document.getElementById("dt-tags-input");
    const descTextarea = document.getElementById("dt-desc-textarea");
    const submitBtn = document.getElementById("dt-submit-doc-btn");

    const touched = {
        title: false,
        format: false,
        url: false,
        tags: false,
        desc: false
    };

    function setFieldValidation(inputEl, errorId, message, showError) {
        const errEl = document.getElementById(errorId);
        if (message) {
            if (showError) {
                errEl.textContent = message;
                inputEl.classList.add("is-invalid");
            }
            inputEl.classList.remove("is-valid");
            return false;
        } else {
            errEl.textContent = "";
            inputEl.classList.remove("is-invalid");
            inputEl.classList.add("is-valid");
            return true;
        }
    }

    function checkTitle(showError = touched.title) {
        const val = titleInput.value.trim();
        let msg = "";
        if (!val) msg = "⚠️ Tiêu đề không được để trống.";
        else if (val.length < 3) msg = "⚠️ Tiêu đề phải có ít nhất 3 ký tự.";
        return setFieldValidation(titleInput, "dt-err-title", msg, showError);
    }

    function checkFormat(showError = touched.format) {
        const val = formatSelect.value;
        const msg = !val ? "⚠️ Vui lòng chọn định dạng tài liệu." : "";
        return setFieldValidation(formatSelect, "dt-err-format", msg, showError);
    }

    function checkUrl(showError = touched.url) {
        const val = urlInput.value.trim();
        let msg = "";
        if (!val) msg = "⚠️ Đường dẫn URL không được để trống.";
        else if (!validateUrl(val)) {
            msg = "⚠️ URL không hợp lệ (phải bắt đầu bằng http:// hoặc https:// và có tên miền hợp lệ).";
        }
        return setFieldValidation(urlInput, "dt-err-url", msg, showError);
    }

    function checkTags(showError = touched.tags) {
        const tags = tagsInput.value.split(",").map(t => t.trim()).filter(Boolean);
        let msg = "";
        if (tags.length === 0) msg = "⚠️ Vui lòng nhập ít nhất 1 tag (cách nhau bởi dấu phẩy).";
        return setFieldValidation(tagsInput, "dt-err-tags", msg, showError);
    }

    function checkDesc(showError = touched.desc) {
        const val = descTextarea.value.trim();
        let msg = "";
        if (!val) msg = "⚠️ Mô tả không được để trống.";
        else if (val.length < 10) msg = `⚠️ Mô tả cần ít nhất 10 ký tự (hiện tại: ${val.length}).`;
        return setFieldValidation(descTextarea, "dt-err-desc", msg, showError);
    }

    function validateAllFields(forceShowError = false) {
        const okTitle = checkTitle(forceShowError || touched.title);
        const okFormat = checkFormat(forceShowError || touched.format);
        const okUrl = checkUrl(forceShowError || touched.url);
        const okTags = checkTags(forceShowError || touched.tags);
        const okDesc = checkDesc(forceShowError || touched.desc);

        const isFormValid = okTitle && okFormat && okUrl && okTags && okDesc;
        // Nút Lưu bị vô hiệu cho đến khi form hợp lệ (KB-44)
        submitBtn.disabled = !isFormValid;
        return isFormValid;
    }

    // Lắng nghe sự kiện gõ (input) và rời ô (blur) để báo lỗi trực tiếp
    const bindings = [
        { el: titleInput, key: "title" },
        { el: formatSelect, key: "format" },
        { el: urlInput, key: "url" },
        { el: tagsInput, key: "tags" },
        { el: descTextarea, key: "desc" }
    ];

    bindings.forEach(({ el, key }) => {
        const eventType = el.tagName === "SELECT" ? "change" : "input";
        el.addEventListener(eventType, () => {
            touched[key] = true;
            validateAllFields(false);
        });
        el.addEventListener("blur", () => {
            touched[key] = true;
            validateAllFields(false);
        });
    });

    // Submit form -> Lưu bằng KBStorage.addDocument, hiện toast, chuyển sang library.html
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        if (!validateAllFields(true)) return;

        const cleanTags = tagsInput.value.split(",").map(t => t.trim()).filter(Boolean);
        const newDocData = {
            title: titleInput.value.trim(),
            format: formatSelect.value,
            url: urlInput.value.trim(),
            tags: cleanTags,
            description: descTextarea.value.trim()
        };

        KBStorage.addDocument(newDocData);
        showToast("🎉 Đã thêm tài liệu mới thành công! Đang chuyển về Kho...");

        submitBtn.disabled = true;
        setTimeout(() => {
            window.location.href = "library.html";
        }, 1000);
    });
}

function showToast(message) {
    const toast = document.getElementById("dt-toast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
}
