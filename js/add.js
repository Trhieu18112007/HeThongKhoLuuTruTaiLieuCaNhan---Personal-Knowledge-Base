/** js/add.js · Tài — thêm tài liệu, validation khi gõ, lưu bằng KBStorage. */
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('dt-add-form');
  if (!form) return;
  const inputs = {
    title: document.getElementById('dt-title-input'),
    format: document.getElementById('dt-format-select'),
    url: document.getElementById('dt-url-input'),
    tags: document.getElementById('dt-tags-input'),
    desc: document.getElementById('dt-desc-textarea')
  };
  const submit = document.getElementById('dt-submit-doc-btn');
  const message = document.getElementById('dt-form-message');
  const urlReq = document.getElementById('dt-url-req');
  const counter = document.getElementById('dt-desc-counter');
  let attempted = false;
  function slug(text) {
    return text.toLowerCase().replace(/đ/g, 'd')
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .trim().replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,'')
      .replace(/-+/g,'-').replace(/^-|-$/g,'');
  }
  function parseTags() {
    return inputs.tags.value.split(',').map(x => slug(x)).filter(Boolean);
  }
  function check() {
    const result = {title:'',format:'',url:'',tags:'',desc:''};
    const title = inputs.title.value.trim();
    const type = inputs.format.value;
    const url = inputs.url.value.trim();
    if (title.length < 3 || title.length > 100) result.title = 'Tiêu đề cần từ 3 đến 100 ký tự.';
    if (!['pdf','video','link'].includes(type)) result.format = 'Hãy chọn định dạng.';
    if (!url && ['video','link'].includes(type)) result.url = 'Video và Liên kết phải có URL.';
    else if (url) {
      try {
        const parsed = new URL(url);
        if (!['http:','https:'].includes(parsed.protocol) || !parsed.hostname) throw Error();
      } catch (_) { result.url = 'Đường dẫn phải là URL http:// hoặc https:// hợp lệ.'; }
    }
    const tags = parseTags();
    if (tags.length > 5) result.tags = 'Chỉ được nhập tối đa 5 tag.';
    else if (tags.some(t => t.length < 2 || t.length > 20)) result.tags = 'Mỗi tag phải từ 2 đến 20 ký tự.';
    if (inputs.desc.value.trim().length > 200) result.desc = 'Mô tả tối đa 200 ký tự.';
    return result;
  }
  function validate() {
    const errors = check();
    Object.entries(inputs).forEach(([key, el]) => {
      const errEl = document.getElementById('dt-err-' + key);
      const show = attempted || el.dataset.touched === 'yes';
      errEl.textContent = show ? errors[key] : '';
      el.classList.toggle('is-invalid', show && Boolean(errors[key]));
      el.classList.toggle('is-valid', show && !errors[key] && Boolean(el.value.trim()));
      el.setAttribute('aria-invalid', String(show && Boolean(errors[key])));
    });
    counter.textContent = `${inputs.desc.value.length}/200`;
    const requiredUrl = ['video','link'].includes(inputs.format.value);
    inputs.url.required = requiredUrl;
    urlReq.textContent = requiredUrl ? '*' : '';
    const valid = !Object.values(errors).some(Boolean);
    submit.disabled = !valid;
    return valid;
  }
  Object.values(inputs).forEach(el => {
    el.addEventListener('input', () => {el.dataset.touched = 'yes'; message.textContent=''; validate();});
    el.addEventListener('change', () => {el.dataset.touched = 'yes'; message.textContent=''; validate();});
    el.addEventListener('blur', () => {el.dataset.touched = 'yes'; validate();});
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    attempted = true;
    if (!validate()) { message.textContent = 'Hãy kiểm tra lại thông tin trước khi lưu.'; return; }
    const content = {
      title: inputs.title.value.trim(),
      type: inputs.format.value,
      tags: [...new Set(parseTags())],
      url: inputs.url.value.trim() || '#',
      description: inputs.desc.value.trim()
    };
    try {
      const saved = KBStorage.addDocument(content);
      if (!saved) {message.textContent='Không lưu được tài liệu. Hãy kiểm tra bộ nhớ trình duyệt.'; return;}
      message.textContent = 'Đã lưu tài liệu thành công!';
      message.classList.add('dt-form-message--success');
      submit.disabled = true;
      window.location.href = `detail.html?id=${encodeURIComponent(saved.id)}`;
    } catch (err) {
      message.textContent = 'Đã xảy ra lỗi khi lưu tài liệu.';
      console.error('Lỗi lưu tài liệu', err);
    }
  });
  validate();
});
