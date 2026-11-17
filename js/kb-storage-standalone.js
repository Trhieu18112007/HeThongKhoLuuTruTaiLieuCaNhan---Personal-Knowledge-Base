/*
 * Chế độ dự phòng chỉ chạy khi repo CHƯA có KBStorage của Hiếu.
 * Không ghi đè KBStorage sẵn có. Mọi trang tương tác qua API KBStorage.
 * Chế độ dự phòng lưu bằng localStorage theo Data Contract trong PLAN.md.
 */
if (typeof KBStorage === 'undefined') {
  const KB_SEED = [
    [1,'Giáo trình HTML5 cơ bản','pdf',['html','web'],'Tổng quan HTML5, Semantic và biểu mẫu',120,'2026-10-01'],
    [2,'CSS Grid trong 30 phút','video',['css','web'],'Thiết kế bố cục Grid responsive',98,'2026-10-12'],
    [3,'MDN: Array.prototype.filter','link',['javascript'],'Cách dùng filter, map, reduce',75,'2026-11-02'],
    [4,'Sổ tay JavaScript ES6','pdf',['javascript','web'],'Arrow function, destructuring, modules',82,'2026-11-10'],
    [5,'Responsive Web Design','video',['css','responsive'],'Thiết kế giao diện đa thiết bị',67,'2026-11-03'],
    [6,'Git và GitHub cơ bản','link',['git','github'],'Quản lý mã nguồn theo nhóm',63,'2026-11-05'],
    [7,'Tài liệu Toán rời rạc','pdf',['on-thi','toan'],'Quan hệ, đồ thị và tổ hợp',53,'2026-09-26'],
    [8,'SQL Server căn bản','pdf',['database','sql'],'Các lệnh SELECT và JOIN',89,'2026-09-18'],
    [9,'Wokwi mô phỏng ESP32','link',['iot','esp32'],'Làm quen mô phỏng thiết bị IoT',38,'2026-10-16'],
    [10,'Học Python qua ví dụ','video',['python'],'Điều kiện, vòng lặp và hàm',72,'2026-10-23'],
    [11,'Tài liệu Mạng máy tính','pdf',['mang-may-tinh'],'Subnet mask và cấu hình mạng',49,'2026-11-08'],
    [12,'Figma cho sinh viên','link',['ui-ux','figma'],'Wireframe và thiết kế giao diện',41,'2026-11-11']
  ].map(([id,title,type,tags,description,views,addedAt])=>({id,title,type,tags,description,views,addedAt,url:'#',note:''}));
  function read(key, fallback) {
    try { const saved = JSON.parse(localStorage.getItem(key) || 'null'); return saved === null ? fallback : saved; }
    catch (_) { return fallback; }
  }
  function write(key, data) { localStorage.setItem(key, JSON.stringify(data)); }
  window.KBStorage = {
    getAllDocuments() {
      const notes = read('kb_notes', {}), views = read('kb_views', {});
      const extra = read('kb_user_docs', []);
      return [...KB_SEED, ...extra].map(doc => ({
        ...doc, note: notes[doc.id] ?? doc.note,
        views: Number(doc.views || 0) + Number(views[doc.id] || 0)
      }));
    },
    addDocument(doc) {
      try {
        const extra = read('kb_user_docs', []);
        const id = Math.max(999, ...extra.map(item=>Number(item.id) || 999)) + 1;
        const fresh = {...doc, id};
        extra.push(fresh);
        write('kb_user_docs', extra);
        return fresh;
      } catch (_) { return null; }
    },
    increaseViews(id) {
      try { const views=read('kb_views',{}); views[id]=(Number(views[id]) || 0)+1; write('kb_views',views); return true; }
      catch (_) { return false; }
    },
    saveNote(id,note) {
      try { const notes=read('kb_notes',{}); notes[id]=note; write('kb_notes',notes); return true; }
      catch (_) { return false; }
    }
  };
}
