const { neon } = require('@neondatabase/serverless');

exports.handler = async (event) => {
  const sql = neon(process.env.DATABASE_URL);
  const { httpMethod, queryStringParameters, body } = event;

  // GET /comments?project_id=1
  if (httpMethod === 'GET') {
    const { project_id } = queryStringParameters || {};
    const rows = project_id
      ? await sql`SELECT * FROM comments WHERE project_id=${project_id} ORDER BY created_at DESC`
      : await sql`SELECT c.*, p.name as project_name, p.url as project_url FROM comments c JOIN projects p ON c.project_id=p.id ORDER BY c.created_at DESC`;
    return ok(rows);
  }

  // POST — nuovo commento
  if (httpMethod === 'POST') {
    const { project_id, page, author, body: text, x_pct, y_pct } = JSON.parse(body);
    const [row] = await sql`
      INSERT INTO comments (project_id, page, author, body, x_pct, y_pct)
      VALUES (${project_id}, ${page}, ${author}, ${text}, ${x_pct||null}, ${y_pct||null})
      RETURNING *`;
    return ok(row, 201);
  }

  // PATCH /comments?id=5  { status: 'resolved' }
  if (httpMethod === 'PATCH') {
    const { id } = queryStringParameters || {};
    const { status } = JSON.parse(body);
    const [row] = await sql`UPDATE comments SET status=${status} WHERE id=${id} RETURNING *`;
    return ok(row);
  }

  return { statusCode: 405, body: 'Method Not Allowed' };
};

const ok = (data, code = 200) => ({
  statusCode: code,
  headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
  body: JSON.stringify(data)
});
