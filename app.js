// ── Precision shared JS ──

// Active nav link (confronto pathname per resistere a query string e trailing slash)
document.querySelectorAll('.topbar__nav a').forEach(a => {
  const ap = new URL(a.href).pathname.replace(/\/$/, '') || '/';
  const lp = location.pathname.replace(/\/$/, '') || '/';
  if (ap === lp) a.classList.add('active');
});

// Resolve comment
document.addEventListener('click', e => {
  const btn = e.target.closest('[data-resolve]');
  if (!btn) return;
  const thread = btn.closest('.thread');
  const badge = thread.querySelector('.badge');
  if (badge) { badge.className = 'badge badge--resolved'; badge.textContent = 'Risolto'; }
  btn.remove();
});

// Add comment inline
document.addEventListener('keydown', e => {
  if (e.key !== 'Enter' || !e.target.matches('.input[data-new-comment]')) return;
  const val = e.target.value.trim();
  if (!val) return;
  const list = document.querySelector('.comment-list');
  if (!list) return;
  const t = document.createElement('div');
  t.className = 'thread card mb-2';
  t.innerHTML = `
    <div class="thread__header">
      <div class="avatar">Tu</div>
      <span class="thread__author">Tu</span>
      <span class="meta ml-auto">adesso</span>
      <span class="badge badge--active">Attivo</span>
    </div>
    <div class="thread__body">${val}</div>
    <div class="thread__actions">
      <button class="btn btn--ghost btn--sm" data-resolve>✓ Risolvi</button>
    </div>`;
  list.prepend(t);
  e.target.value = '';
});

// Pin click → highlight
document.querySelectorAll('.pin').forEach(pin => {
  pin.addEventListener('click', () => {
    document.querySelectorAll('.pin').forEach(p => p.style.background = '');
    pin.style.background = 'var(--primary)';
    const id = pin.dataset.comment;
    const el = document.getElementById(id);
    if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'center' }); el.style.outline = '2px solid var(--primary)'; setTimeout(() => el.style.outline = '', 1500); }
  });
});
