const db = require('./db');
async function main() {
  const [rows] = await db.query('SHOW INDEX FROM `order`');
  rows.forEach(r => console.log('index:', r.Key_name, '| col:', r.Column_name, '| unique:', r.Non_unique === 0));
  const [orders] = await db.query('SELECT * FROM `order`');
  console.log('\norders:', JSON.stringify(orders, null, 2));
  const [detail] = await db.query('SELECT * FROM `order_detail`');
  console.log('\norder_detail:', JSON.stringify(detail, null, 2));
  process.exit();
}
main().catch(e => { console.error(e.message); process.exit(1); });
