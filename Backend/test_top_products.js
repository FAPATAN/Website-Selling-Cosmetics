const db = require('./db');
async function main() {
  try {
    const [rows] = await db.query(`
      SELECT p.Product_id, p.Product_name, p.Product_model, p.Product_price,
             p.Image AS Product_img,
             COALESCE(SUM(od.Quantity), 0) AS sold_total
      FROM product p
      JOIN order_detail od ON od.Product_id = p.Product_id
      JOIN \`order\` o ON o.Order_id = od.Order_id
      WHERE o.Status NOT IN ('Ca')
      GROUP BY p.Product_id
      ORDER BY sold_total DESC
      LIMIT 5
    `);
    console.log('rows:', JSON.stringify(rows, null, 2));
  } catch(e) {
    console.error('ERROR:', e.message);
  }
  process.exit();
}
main();
