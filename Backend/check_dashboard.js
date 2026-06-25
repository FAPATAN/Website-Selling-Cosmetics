const db = require('./db');
async function test() {
  try {
    const [[{ members }]] = await db.query('SELECT COUNT(*) AS members FROM member WHERE Member_role != "A"');
    console.log('members:', members);
    const [[{ orders }]] = await db.query('SELECT COUNT(*) AS orders FROM `order`');
    console.log('orders:', orders);
    const [[{ products }]] = await db.query('SELECT COUNT(*) AS products FROM product');
    console.log('products:', products);
    const [[{ revenue }]] = await db.query('SELECT COALESCE(SUM(Proprice),0) AS revenue FROM `order` WHERE Status IN ("P","A","S","R","C")');
    console.log('revenue:', revenue);
    const [pendingOrders] = await db.query(
      'SELECT o.Order_id, o.MemberID, o.Name, o.Surname, o.Proprice, o.Status, o.Order_date, o.Invoice_pic FROM `order` o WHERE o.Status IN (\'O\',\'P\') ORDER BY o.Order_date DESC LIMIT 5'
    );
    console.log('pendingOrders count:', pendingOrders.length);
    process.exit(0);
  } catch(e) {
    console.error('ERROR:', e.message);
    process.exit(1);
  }
}
test();
