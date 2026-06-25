const mysql = require('mysql2/promise');
async function main() {
  const conn = await mysql.createConnection({host:'localhost',user:'fah',password:'Fapatan11',database:'web_selling_cosmetics'});
  
  const [rows] = await conn.query(
    'SELECT o.Order_id, o.Status, od.Product_id, od.Quantity, od.Product_price FROM `order` o LEFT JOIN order_detail od ON o.Order_id=od.Order_id WHERE o.MemberID=48 ORDER BY o.Order_id DESC'
  );
  console.log('Orders member 48:');
  rows.forEach(r => console.log(r));

  const [stocks] = await conn.query('SELECT Product_id, Product_name, Stock FROM product WHERE Product_id IN (43,44)');
  console.log('\nStocks:', stocks);

  const [promos] = await conn.query('SELECT pp.Product_id, pp.Max_buy, pp.Promo_used FROM pro_product pp WHERE pp.Product_id IN (43,44)');
  console.log('\nPromos:', promos);

  await conn.end();
}
main().catch(e => console.log('ERROR:', e.message));
