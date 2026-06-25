const db = require('./db');
async function run() {
  await db.query('DELETE FROM order_detail WHERE Order_id IN (2, 8)');
  await db.query('DELETE FROM `order` WHERE Order_id IN (2, 8)');
  console.log('Deleted orders #2 and #8');
  process.exit(0);
}
run().catch(e => { console.error(e.message); process.exit(1); });
