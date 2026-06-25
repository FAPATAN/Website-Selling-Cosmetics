const db = require('./db');
async function test() {
  const [rows] = await db.query(
    'SELECT Order_id, MemberID, Name, Surname, Proprice, Status, Order_date FROM `order` WHERE Status IN ("P","A","S","R","C") ORDER BY Order_id'
  );
  console.log(JSON.stringify(rows, null, 2));
  const total = rows.reduce((s, r) => s + parseFloat(r.Proprice), 0);
  console.log('TOTAL:', total.toFixed(2));
  process.exit(0);
}
test().catch(e => { console.error(e.message); process.exit(1); });
