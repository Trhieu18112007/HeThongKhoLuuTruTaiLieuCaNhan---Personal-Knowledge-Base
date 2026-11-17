# components.md · Navbar & Footer dùng chung (KB-12)
> Tài copy NGUYÊN XI vào `detail.html` và `add.html`. Trang hiện tại thêm `class="kb-active"` vào link tương ứng. Khi Hiền sửa Navbar sẽ nhắn Tài.

## Head chuẩn
```html
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="css/style.css">
<link rel="stylesheet" href="css/detail.css"> <!-- của Tài, tiền tố dt- -->
```
## Navbar (menu thu gọn mobile bằng checkbox, không cần JS)
```html
<header class="kb-header">
  <nav class="kb-nav" aria-label="Điều hướng chính">
    <a class="kb-brand" href="index.html">📚 Kho tài liệu</a>
    <input type="checkbox" id="kb-nav-toggle" class="kb-nav__toggle">
    <label for="kb-nav-toggle" class="kb-nav__burger" aria-label="Mở menu">☰</label>
    <ul class="kb-nav__menu">
      <li><a href="index.html">Trang chủ</a></li>
      <li><a href="library.html">Kho tài liệu</a></li>
      <li><a href="add.html">Thêm tài liệu</a></li>
    </ul>
  </nav>
</header>
```
## Footer
```html
<footer class="kb-footer"><p>© 2026 Nhóm [Tên nhóm] · Thiết kế Web · Đại học Lạc Hồng</p></footer>
```
## Class Hiền báo cho Đăng
- Container: `#doc-container.kb-doc-container`; chuyển List view: thêm/bỏ `.kb-view-list` (Card = bỏ class, hoặc dùng `.kb-view-card`)
- Thẻ: `article.kb-card` > `.kb-badge.kb-badge--pdf|video|link`, `.kb-card__title`, `.kb-card__desc`, `ul.kb-card__tags > li.kb-tag`, `.kb-card__meta`
- Chip: `.kb-chip`, đang chọn `.kb-chip--active`
- Nút chuyển view đang chọn: `.kb-btn--active` (nút còn lại `.kb-btn--ghost`)
- Rỗng: `.kb-empty`; thông báo: `.kb-toast.kb-toast--success|error`
- Mã loại tài liệu (`type`) khớp hậu tố badge: `pdf`, `video`, `link`
