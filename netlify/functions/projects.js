const { neon } = require('@neondatabase/serverless');

exports.handler = async () => {
  const sql = neon(process.env.DATABASE_URL);
  const rows = await sql`SELECT * FROM projects ORDER BY created_at DESC`;
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify(rows)
  };
};
