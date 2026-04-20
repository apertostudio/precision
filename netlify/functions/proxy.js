exports.handler = async (event) => {
  const url = (event.queryStringParameters || {}).url;
  if (!url) return { statusCode: 400, body: 'Missing url parameter' };

  try {
    const resp = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'it-IT,it;q=0.9,en;q=0.8',
      },
      redirect: 'follow',
    });

    let html = await resp.text();

    // Inject <base> so all relative URLs resolve to the target origin
    const origin = new URL(url).origin;
    if (!html.includes('<base')) {
      html = html.replace(/(<head\b[^>]*>)/i, `$1<base href="${origin}/">`);
    }

    // Force all animation initial states to be visible
    // (Webflow IX2 / GSAP hide elements via opacity:0, transform, visibility:hidden on load)
    const reviewFix = `<style id="precision-fix">
      *, *::before, *::after {
        animation-duration: 0.001s !important;
        animation-delay: 0s !important;
        transition-duration: 0.001s !important;
      }
      [style*="opacity: 0"],[style*="opacity:0"] { opacity: 1 !important; }
      [style*="visibility: hidden"] { visibility: visible !important; }
      [style*="pointer-events: none"] { pointer-events: auto !important; }
    </style>
    <script>
      // After DOM ready, override any inline opacity:0 set by Webflow IX2
      document.addEventListener('DOMContentLoaded', () => {
        const fix = () => {
          document.querySelectorAll('[style]').forEach(el => {
            if (el.id === 'precision-fix') return;
            const s = el.style;
            if (s.opacity === '0') s.opacity = '1';
            if (s.visibility === 'hidden') s.visibility = 'visible';
          });
        };
        fix();
        // Run again after Webflow IX2 initialises (~300ms)
        setTimeout(fix, 300);
        setTimeout(fix, 800);
        setTimeout(fix, 1500);
      });
    </script>`;
    html = html.replace(/<\/head>/i, reviewFix + '</head>');

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
      body: html,
    };
  } catch (err) {
    return { statusCode: 502, body: 'Proxy error: ' + err.message };
  }
};
