const mysql = require('mysql2/promise');
async function main() {
  const conn = await mysql.createConnection({host:'localhost',user:'fah',password:'Fapatan11',database:'web_selling_cosmetics'});
  
  // Check promotion table columns
  const [cols] = await conn.query('DESCRIBE promotion');
  console.log('promotion columns:', cols.map(c=>c.Field));

  // Check actual promotion data
  const [promos] = await conn.query('SELECT * FROM promotion');
  console.log('promotions:', promos);

  // Check pro_product data
  const [pp] = await conn.query('SELECT * FROM pro_product WHERE Product_id IN (43,44)');
  console.log('pro_product:', pp);

  // Try the exact UPDATE query from cancel route (without executing it)
  const [test] = await conn.query(
    `SELECT pp.Pro_Product_id, pp.Product_id, pp.Promo_used, pr.DiscountType, pr.Status
     FROM pro_product pp
     JOIN promotion pr ON pp.Promotion_id = pr.Promotion_id
     WHERE pp.Product_id = 44 AND pr.DiscountType = 'buy 1 get 1'`
  );
  console.log('\nJOIN result for product 44:', test);

  await conn.end();
}
main().catch(e => console.log('ERROR:', e.message));
