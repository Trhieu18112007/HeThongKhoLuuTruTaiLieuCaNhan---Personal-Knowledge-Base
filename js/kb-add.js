/*
 * Trang Thêm tài liệu - bản sửa lỗi độc lập UI/UX.
 * Không ghi đè js/add.js của Tài. Tương tác lưu chỉ thông qua KBStorage.
 */
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('kb-add-form');
  if (!form) return;

  const fields = {
    title: document.getElementById('kb-add-title'),
    type: document.getElementById('kb-add-type'),
    url: document.getElementById('kb-add-url'),
    tags: document.getElementById('kb-add-tags'),
    description: document.getElementById('kb-add-description')
  };
  const submitButton = document.getElementById('kb-add-submit');
  const notice = document.getElementById('kb-add-message');
  const count = document.getElementById('kb-add-description-count');
  const urlRequired = document.getElementById('kb-add-url-required');
  let submitted = false;

  // Chuẩn hóa tiếng Việt thành tag không dấu, chữ thường, nối từ bằng dấu gạch ngang.
  function toSlug(value) {
    return value.trim().toLocaleLowerCase('vi')
      .replace(/đ/g, 'd')
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-').replace(/^-|-$/g, '');
  }

  function normalizedTags() {
    const raw = fields.tags.value.split(',').map(x => x.trim()).filter(Boolean);
    return [...new Set(raw.map(toSlug))];
  }

  function errors() {
    const values = {
      title: fields.title.value.trim(),
      type: fields.type.value,
      url: fields.url.value.trim(),
      description: fields.description.value.trim()
    };
    const result = { title: '', type: '', url: '', tags: '', description: '' };
    if (values.title.length < 3 || values.title.length > 100) result.title = 'Tiêu đề cần từ 3 đến 100 ký tự.';
    if (!['pdf', 'video', 'link'].includes(values.type)) result.type = 'Hãy chọn định dạng tài liệu.';
    if (!values.url && (values.type === 'video' || values.type === 'link')) {
      result.url = 'Video và liên kết phải có đường dẫn.';
    } else if (values.url) {
      try {
        const parsed = new URL(values.url);
        if (!['http:', 'https:'].includes(parsed.protocol) || !parsed.hostname) throw new Error('invalid');
      } catch (_) {
        result.url = 'Đường dẫn chưa đúng định dạng (http:// hoặc https://).';
      }
    }
    const original = fields.tags.value.split(',').map(x => x.trim()).filter(Boolean);
    const slugs = original.map(toSlug);
    if (original.length > 5) result.tags = 'Tối đa 5 tag.';
    else if (slugs.some(x => x.length < 2 || x.length > 20)) result.tags = 'Mỗi tag phải dài từ 2 đến 20 ký tự sau khi chuẩn hóa.';
    if (values.description.length > 200) result.description = 'Mô tả tối đa 200 ký tự.';
    return result;
  }

  function setMessage(message, kind) {
    notice.textContent = message;
    notice.className = 'kb-add-message' + (kind ? ` kb-add-message--${kind}` : '');
  }

  function validate(showErrors = false) {
    const errs = errors();
    Object.entries(fields).forEach(([name, field]) => {
      const errorMessage = errs[name] || '';
      const errorElement = document.getElementById(`kb-add-${name}-error`);
      const shouldShow = showErrors && (submitted || field.dataset.touched === 'true');
      if (errorElement) errorElement.textContent = shouldShow ? errorMessage : '';
      field.setAttribute('aria-invalid', String(shouldShow && Boolean(errorMessage)));
    });
    count.textContent = `${fields.description.value.length}/200`;
    const needsUrl = ['video', 'link'].includes(fields.type.value);
    fields.url.required = needsUrl;
    urlRequired.textContent = needsUrl ? '*' : '';
    const valid = !Object.values(errs).some(Boolean);
    submitButton.disabled = !valid;
    return valid;
  }

  Object.values(fields).forEach(field => {
    field.addEventListener('input', () => { setMessage('', ''); validate(submitted || field.dataset.touched === 'true'); });
    field.addEventListener('change', () => { setMessage('', ''); validate(submitted || field.dataset.touched === 'true'); });
    field.addEventListener('blur', () => { field.dataset.touched = 'true'; validate(true); });
  });

  form.addEventListener('submit', event => {
    event.preventDefault();
    submitted = true;
    if (!validate(true)) { setMessage('Vui lòng kiểm tra các trường được đánh dấu.', 'error'); return; }
    if (typeof KBStorage === 'undefined' || typeof KBStorage.addDocument !== 'function') {
      setMessage('Không thể lưu: chưa nạp js/storage.js hoặc KBStorage.addDocument. Hãy chép trang này vào đầy đủ thư mục dự án của nhóm.', 'error');
      return;
    }
    const doc = {
      title: fields.title.value.trim(),
      type: fields.type.value,
      tags: normalizedTags(),
      description: fields.description.value.trim(),
      url: fields.url.value.trim() || '#',
      views: 0,
      addedAt: (() => { const today = new Date(); const pad = x => String(x).padStart(2, '0'); return `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`; })(),
      note: ''
    };
    try {
      const result = KBStorage.addDocument(doc);
      if (result === null || result === false) {
        setMessage('Không thể lưu tài liệu. Hãy kiểm tra dung lượng bộ nhớ trình duyệt.', 'error');
        return;
      }
      setMessage('Đã thêm tài liệu thành công! Đang chuyển về Kho tài liệu…', 'success');
      submitButton.disabled = true;
      window.setTimeout(() => { window.location.href = 'library.html'; }, 900);
    } catch (err) {
      setMessage('Có lỗi khi lưu tài liệu. Hãy kiểm tra Console hoặc chức năng KBStorage.', 'error');
      console.error('[KB add]', err);
    }
  });
  validate();
});
