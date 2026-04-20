const { neon } = require('@neondatabase/serverless');
const H = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' };
const ok = (data, code = 200) => ({ statusCode: code, headers: H, body: JSON.stringify(data) });

exports.handler = async (event) => {
  const sql = neon(process.env.DATABASE_URL);
  const { httpMethod, queryStringParameters, body } = event;

  if (httpMethod === 'GET') {
    const rows = await sql`SELECT * FROM projects ORDER BY created_at DESC`;
    return ok(rows);
  }

  if (httpMethod === 'POST') {
    const { name, url: rawUrl } = JSON.parse(body);
    const url = /^https?:\/\//.test(rawUrl) ? rawUrl : 'https://' + rawUrl;
    const [row] = await sql`INSERT INTO projects (name, url) VALUES (${name}, ${url}) RETURNING *`;
    return ok(row, 201);
  }

  if (httpMethod === 'DELETE') {
    const { id } = queryStringParameters || {};
    await sql`DELETE FROM projects WHERE id = ${id}`;
    return ok({ ok: true });
  }

  return { statusCode: 405, body: 'Method Not Allowed' };
};
