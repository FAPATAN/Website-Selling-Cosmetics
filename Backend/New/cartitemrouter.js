const express = require('express');
const router = express.Router();
const db = require('../db'); // mysql2/promise pool

// เพิ่มหรืออัปเดต cart
router.post('/', async (req, res) => {
  const { Member_id, cart_items } = req.body;
  console.log('POST /api/cart', { Member_id, cart_items });
  if (!Member_id || !Array.isArray(cart_items)) {
    return res.status(400).json({ error: 'Missing Member_id or cart_items' });
  }
  try {
    // หา cart ทั้งหมดของ member นี้ (เรียงใหม่ก่อน)
    const [cartRows] = await db.query('SELECT Cart_id FROM cart WHERE MemberID = ? ORDER BY Cart_id DESC', [Member_id]);

    let cartId;
    if (cartRows.length === 0) {
      // สร้าง cart ใหม่
      const [insertResult] = await db.query('INSERT INTO cart (MemberID, Update_at) VALUES (?, NOW())', [Member_id]);
      cartId = insertResult.insertId;
      console.log('Created new cart, cartId:', cartId);
    } else {
      cartId = cartRows[0].Cart_id;
      // ลบ cart ซ้ำ (ถ้ามีมากกว่า 1 cart)
      if (cartRows.length > 1) {
        const extraIds = cartRows.slice(1).map(r => r.Cart_id);
        await db.query(`DELETE FROM cart_item WHERE Cart_id IN (${extraIds.map(() => '?').join(',')})`, extraIds);
        await db.query(`DELETE FROM cart WHERE Cart_id IN (${extraIds.map(() => '?').join(',')})`, extraIds);
        console.log('Removed duplicate carts:', extraIds);
      }
      // ลบ cart_item เดิมก่อน
      await db.query('DELETE FROM cart_item WHERE Cart_id = ?', [cartId]);
      console.log('Deleted old cart_items for cartId:', cartId);
    }

    // dedup cart_items ก่อน insert (รวม Quantity ถ้า Product_id และ Price ซ้ำ - แยก paid vs free)
    const dedupMap = {};
    for (const i of cart_items) {
      const key = `${i.Product_id}_${i.Price}`;
      if (dedupMap[key]) {
        dedupMap[key].Quantity += i.Quantity;
        dedupMap[key].Total = dedupMap[key].Price * dedupMap[key].Quantity;
      } else {
        dedupMap[key] = { ...i };
      }
    }
    const dedupedItems = Object.values(dedupMap);

    // insert cart_item ใหม่
    if (dedupedItems.length > 0) {
      const values = dedupedItems.map(i => [cartId, i.Product_id, i.Quantity, i.Price, i.Total]);
      await db.query('INSERT INTO cart_item (Cart_id, Product_id, Quantity, Price, Total) VALUES ?', [values]);
      console.log('Inserted cart_items:', values);
    }

    res.json({ success: true, cartId });
  } catch (err) {
    console.error('POST /api/cart error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ดึง cart ตาม Member_id
router.get('/:member_id', async (req, res) => {
  const memberId = req.params.member_id;
  console.log('GET /api/cart/', memberId);
  try {
    const [results] = await db.query(
      `SELECT c.Cart_id, MIN(ci.Cart_Item_id) as Cart_Item_id, ci.Product_id,
              SUM(ci.Quantity) as Quantity, ci.Price, SUM(ci.Total) as Total,
              p.Product_name, p.Image, p.Product_model,
              pp.Promotion_id, pr.Discount_value
       FROM cart c
       LEFT JOIN cart_item ci ON c.Cart_id = ci.Cart_id
       LEFT JOIN product p ON ci.Product_id = p.Product_id
       LEFT JOIN pro_product pp ON p.Product_id = pp.Product_id
       LEFT JOIN promotion pr ON pp.Promotion_id = pr.Promotion_id
       WHERE c.Cart_id = (
         SELECT Cart_id FROM cart WHERE MemberID = ? ORDER BY Cart_id DESC LIMIT 1
       )
       GROUP BY c.Cart_id, ci.Product_id, ci.Price, p.Product_name, p.Image, p.Product_model, pp.Promotion_id, pr.Discount_value`,
      [memberId]
    );
    console.log('GET cart results:', results);
    res.json({ cart: results });
  } catch (err) {
    console.error('GET /api/cart error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ลบ cart_item
router.delete('/item/:cart_item_id', async (req, res) => {
  const id = req.params.cart_item_id;
  try {
    await db.query('DELETE FROM cart_item WHERE Cart_Item_id = ?', [id]);
    res.json({ success: true });
  } catch (err) {
    console.error('DELETE cart_item error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;