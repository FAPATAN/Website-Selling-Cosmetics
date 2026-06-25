const db = require('./db');

async function main() {
  // เพิ่ม Product 44 เข้า Promotion 2 (Buy 1 Get 1)
  try {
    const [check] = await db.query('SELECT * FROM pro_product WHERE Promotion_id=2 AND Product_id=44');
    if (check.length === 0) {
      await db.query('INSERT INTO pro_product (Promotion_id, Product_id) VALUES (2, 44)');
      console.log('✅ Added Product 44 to Promotion 2');
    } else {
      console.log('ℹ️  Product 44 already in Promotion 2');
    }

    // แสดง pro_product ทั้งหมด
    const [all] = await db.query(`
      SELECT pp.Pro_Product_id, pp.Promotion_id, pp.Product_id, 
             pr.Product_name, pr.Image
      FROM pro_product pp 
      LEFT JOIN product pr ON pp.Product_id = pr.Product_id 
      ORDER BY pp.Promotion_id, pp.Product_id
    `);
    console.log('\n📦 pro_product table:');
    all.forEach(r => console.log(`  Promo ${r.Promotion_id} → Product ${r.Product_id}: ${r.Product_name} (${r.Image})`));
    process.exit(0);
  } catch (e) {
    console.error('❌ Error:', e.message);
    process.exit(1);
  }
}

main();
