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

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
      body: html,
    };
  } catch (err) {
    return { statusCode: 502, body: 'Proxy error: ' + err.message };
  }
};
