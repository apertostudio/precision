// ── Precision shared JS ──

// Active nav link
document.querySelectorAll('.topbar__nav a').forEach(a => {
  try {
    const ap = new URL(a.href).pathname.replace(/\/$/, '') || '/';
    const lp = location.pathname.replace(/\/$/, '') || '/';
    if (ap === lp) a.classList.add('active');
  } catch {}
});

// ── API helpers ──
const API = {
  get:   (path)       => fetch('/.netlify/functions/' + path).then(r => r.json()),
  post:  (path, data) => fetch('/.netlify/functions/' + path, { method:'POST',  body: JSON.stringify(data) }).then(r => r.json()),
  patch: (path, data) => fetch('/.netlify/functions/' + path, { method:'PATCH', body: JSON.stringify(data) }).then(r => r.json()),
};

// Esposto globalmente per le pagine
window.API = API;
