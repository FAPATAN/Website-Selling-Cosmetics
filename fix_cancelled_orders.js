// Fix script: restore Stock and Promo_used for all orders that were
// cancelled with the OLD cancel code (which didn't restore anything)
// Run once: node fix_cancelled_orders.js

const mysql = require('mysql2/promise');

async function main() {
  const conn = await mysql.createConnection({
    host: 'localhost', user: 'fah',
    password: 'Fapatan11', database: 'web_selling_cosmetics'
  });

  try {
    // Get ALL cancelled orders and their details
    const [cancelledDetails] = await conn.query(`
      SELECT od.Order_id, od.Product_id, od.Quantity, od.Product_price
      FROM order_detail od
      JOIN \`order\` o ON od.Order_id = o.Order_id
      WHERE o.Status = 'Ca' AND od.Product_id IS NOT NULL
      ORDER BY od.Order_id
    `);

    console.log('Cancelled order details to restore:', cancelledDetails.length, 'rows');

    // Check current state before fix
    const [beforeStocks] = await conn.query(
      'SELECT Product_id, Product_name, Stock FROM product WHERE Product_id IN (43,44)'
    );
    const [beforePromos] = await conn.query(
      'SELECT Product_id, Promo_used FROM pro_product'
    );
    console.log('\nBEFORE - Stocks:', beforeStocks);
    console.log('BEFORE - Promos:', beforePromos);

    await conn.beginTransaction();

    for (const item of cancelledDetails) {
      // Restore Stock
      await conn.query(
        'UPDATE product SET Stock = Stock + ? WHERE Product_id = ?',
        [item.Quantity, item.Product_id]
      );

      // Restore Promo_used (paid items only)
      if (parseFloat(item.Product_price) > 0) {
        await conn.query(
          `UPDATE pro_product pp
           JOIN promotion pr ON pp.Promotion_id = pr.Promotion_id
           SET pp.Promo_used = GREATEST(0, pp.Promo_used - ?)
           WHERE pp.Product_id = ? AND pr.DiscountType = 'buy 1 get 1' AND pr.Status = 'Y'`,
          [item.Quantity, item.Product_id]
        );
      }

      console.log(`  Restored order ${item.Order_id} product ${item.Product_id}: +${item.Quantity} stock${parseFloat(item.Product_price) > 0 ? ', -1 promo' : ' (free item)'}`);
    }

    await conn.commit();

    // Check state after fix
    const [afterStocks] = await conn.query(
      'SELECT Product_id, Product_name, Stock FROM product WHERE Product_id IN (43,44)'
    );
    const [afterPromos] = await conn.query(
      'SELECT Product_id, Promo_used FROM pro_product'
    );
    console.log('\nAFTER - Stocks:', afterStocks);
    console.log('AFTER - Promos:', afterPromos);

    console.log('\nDone! All cancelled orders have been restored.');
  } catch (err) {
    await conn.rollback();
    console.log('ERROR (rolled back):', err.message);
  } finally {
    await conn.end();
  }
}

main();
