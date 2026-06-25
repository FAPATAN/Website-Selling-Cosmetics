const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const db = require('../db'); // mysql2/promise pool

// ───── Multer setup (slip images stored in Backend/uploads/slips/) ─────
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads/slips'));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `slip-${Date.now()}${ext}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files are allowed'));
  },
});

// ─────────────────────────────────────────────────────────────────────────
// POST /api/orders/create
// สร้าง order + order_detail เมื่อ user มาถึงหน้า Pay
// Body: { Member_id, Name, Surname, Address, Phone, items: [{Product_id, Type_id?, Product_model, Product_price, Quantity, Discount?}] }
// ─────────────────────────────────────────────────────────────────────────
router.post('/create', async (req, res) => {
  const { Member_id, Name, Surname, Address, Phone, items } = req.body;

  if (!Member_id || !items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Missing required fields: Member_id, items' });
  }

  const Proprice = items.reduce((sum, i) => {
    const price = parseFloat(i.Product_price) || 0;
    const qty   = parseInt(i.Quantity, 10) || 0;
    const disc  = parseFloat(i.Discount) || 0;
    return sum + (price * qty - disc);
  }, 0);

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    // ── รวม qty ต่อ Product_id (paid + free นับรวมกัน = จำนวนจริงที่ออกจากสต๊อก) ──
    const qtyByProduct = {};
    for (const i of items) {
      const pid = i.Product_id;
      const qty = parseInt(i.Quantity, 10) || 1;
      qtyByProduct[pid] = (qtyByProduct[pid] || 0) + qty;
    }

    // ── ตรวจสต๊อกและ Max_buy สำหรับ Buy 1 Get 1 ──
    for (const [pid, totalQty] of Object.entries(qtyByProduct)) {
      const [pRows] = await conn.query(
        'SELECT Product_name, Stock FROM product WHERE Product_id = ?', [pid]
      );
      if (!pRows.length) { await conn.rollback(); conn.release(); return res.status(400).json({ error: `ไม่พบสินค้า Product_id ${pid}` }); }

      const { Product_name, Stock } = pRows[0];
      if (Stock < totalQty) {
        await conn.rollback(); conn.release();
        return res.status(400).json({ error: `สินค้า "${Product_name}" สต๊อกไม่เพียงพอ (เหลือ ${Stock} ชิ้น)` });
      }

      // ตรวจโควต้า Buy 1 Get 1 (Max_buy = จำนวนสูงสุดทั้งหมด, Promo_used = ใช้ไปแล้ว)
      const [ppRows] = await conn.query(
        `SELECT pp.Promotion_id, pp.Max_buy, pp.Promo_used, pr.DiscountType
         FROM pro_product pp
         JOIN promotion pr ON pp.Promotion_id = pr.Promotion_id
         WHERE pp.Product_id = ? AND pr.DiscountType = 'buy 1 get 1' AND pr.Status = 'Y'`,
        [pid]
      );
      if (ppRows.length && ppRows[0].Max_buy > 0) {
        const paidQty = items
          .filter(i => String(i.Product_id) === String(pid) && parseFloat(i.Product_price) > 0)
          .reduce((s, i) => s + (parseInt(i.Quantity, 10) || 1), 0);
        const remaining = ppRows[0].Max_buy - ppRows[0].Promo_used;
        if (paidQty > remaining) {
          await conn.rollback(); conn.release();
          return res.status(400).json({
            error: `สินค้า "${Product_name}" เหลือโควต้า 1แถม1 อีก ${remaining} ชิ้น (ต้องการ ${paidQty} ชิ้น)`,
          });
        }
      }
    }

    // ── Insert into `order` ──
    const [orderResult] = await conn.query(
      `INSERT INTO \`order\`
         (MemberID, Name, Surname, Address, Phone, Order_date, Proprice, Status)
       VALUES (?, ?, ?, ?, ?, NOW(), ?, 'O')`,
      [Member_id, Name || '', Surname || '', Address || '', Phone || '', Proprice]
    );
    const orderId = orderResult.insertId;

    // ── Insert into `order_detail` ──
    const detailValues = await Promise.all(items.map(async (i) => {
      let typeId = i.Type_id || null;
      if (!typeId && i.Product_id) {
        const [pRows] = await conn.query(
          'SELECT Type_id FROM product WHERE Product_id = ?',
          [i.Product_id]
        );
        typeId = pRows[0]?.Type_id || 1;
      }
      const price = parseFloat(i.Product_price) || 0;
      const qty   = parseInt(i.Quantity, 10) || 1;
      const disc  = parseFloat(i.Discount) || 0;
      return [
        orderId,
        i.Product_id,
        typeId,
        i.Product_model || '',
        price,
        qty,
        disc,
        price * qty - disc,
      ];
    }));

    await conn.query(
      `INSERT INTO order_detail
         (Order_id, Product_id, Type_id, Product_model, Product_price, Quantity, Discount, Total)
       VALUES ?`,
      [detailValues]
    );

    // ── ตัดสต๊อก (paid + free รวมกัน = จำนวนจริงที่ออก) + เพิ่ม Promo_used ──
    for (const [pid, totalQty] of Object.entries(qtyByProduct)) {
      await conn.query(
        'UPDATE product SET Stock = Stock - ? WHERE Product_id = ?',
        [totalQty, pid]
      );
      // นับ paid qty สำหรับเพิ่ม Promo_used (free item ไม่นับ)
      const paidQtyForPromo = items
        .filter(i => String(i.Product_id) === String(pid) && parseFloat(i.Product_price) > 0)
        .reduce((s, i) => s + (parseInt(i.Quantity, 10) || 1), 0);
      if (paidQtyForPromo > 0) {
        await conn.query(
          `UPDATE pro_product pp
           JOIN promotion pr ON pp.Promotion_id = pr.Promotion_id
           SET pp.Promo_used = pp.Promo_used + ?
           WHERE pp.Product_id = ? AND pr.DiscountType = 'buy 1 get 1' AND pr.Status = 'Y'`,
          [paidQtyForPromo, pid]
        );
      }

      // เพิ่ม sold_total ให้สินค้า
      await conn.query(
        'UPDATE product SET sold_total = sold_total + ? WHERE Product_id=?',
        [qtyByProduct[pid], pid]
      );
    }

    await conn.commit();
    res.json({ success: true, Order_id: orderId });
  } catch (err) {
    await conn.rollback();
    console.error('POST /api/orders/create error:', err);
    res.status(500).json({ error: err.message });
  } finally {
    conn.release();
  }
});

// ─────────────────────────────────────────────────────────────────────────
// POST /api/orders/check-stock
// ตรวจสต๊อกก่อนสร้าง order (ไม่เขียน DB) — ใช้จากหน้า Cart
// Body: { items: [{Product_id, Quantity, Product_price?}] }
// ─────────────────────────────────────────────────────────────────────────
router.post('/check-stock', async (req, res) => {
  const { items } = req.body;
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Missing items' });
  }

  const qtyByProduct = {};
  for (const i of items) {
    const pid = i.Product_id;
    const qty = parseInt(i.Quantity, 10) || 1;
    qtyByProduct[pid] = (qtyByProduct[pid] || 0) + qty;
  }

  const conn = await db.getConnection();
  try {
    const errors = [];
    for (const [pid, totalQty] of Object.entries(qtyByProduct)) {
      const [pRows] = await conn.query(
        'SELECT Product_name, Stock FROM product WHERE Product_id = ?', [pid]
      );
      if (!pRows.length) {
        errors.push(`ไม่พบสินค้า Product_id ${pid}`);
        continue;
      }
      const { Product_name, Stock } = pRows[0];
      if (Stock < totalQty) {
        errors.push(`สินค้า "${Product_name}" สต๊อกไม่เพียงพอ (เหลือ ${Stock} ชิ้น)`);
      }
    }
    conn.release();
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }
    res.json({ ok: true });
  } catch (err) {
    conn.release();
    console.error('POST /api/orders/check-stock error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────
// POST /api/orders/submit-slip
// อัปโหลดสลิป + อัปเดต invoice_date / invoice_pic / Status
// FormData: { Order_id, slip (file) }
// ─────────────────────────────────────────────────────────────────────────
router.post('/submit-slip', upload.single('slip'), async (req, res) => {
  const { Order_id } = req.body;

  if (!Order_id) {
    return res.status(400).json({ error: 'Missing Order_id' });
  }
  if (!req.file) {
    return res.status(400).json({ error: 'No slip image uploaded' });
  }

  const slipPath = `slips/${req.file.filename}`;

  try {
    const [result] = await db.query(
      `UPDATE \`order\`
          SET Invoice_date = NOW(),
              Invoice_pic  = ?,
              Status       = 'P'
        WHERE Order_id = ?`,
      [slipPath, Order_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ success: true, invoice_pic: slipPath });
  } catch (err) {
    console.error('POST /api/orders/submit-slip error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────
// POST /api/orders/cancel
// ยกเลิก order โดย user — ตั้ง Status='T' ใน DB
// Body: { Order_id }
// ─────────────────────────────────────────────────────────────────────────
router.post('/cancel', async (req, res) => {
  const { Order_id } = req.body;
  if (!Order_id) {
    return res.status(400).json({ error: 'Missing Order_id' });
  }
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    const [[order]] = await conn.query(
      `SELECT Status FROM \`order\` WHERE Order_id = ?`, [Order_id]
    );
    if (!order) {
      await conn.rollback();
      return res.status(404).json({ error: 'Order not found' });
    }
    if (order.Status === 'Ca') {
      await conn.rollback();
      return res.status(400).json({ error: 'Order already cancelled' });
    }

    const [details] = await conn.query(
      `SELECT Product_id, Quantity, Product_price FROM order_detail WHERE Order_id = ?`,
      [Order_id]
    );

    for (const item of details) {
      if (!item.Product_id) continue;

      // คืน Stock (ทั้ง paid และ free item)
      await conn.query(
        'UPDATE product SET Stock = Stock + ? WHERE Product_id = ?',
        [item.Quantity, item.Product_id]
      );

      // คืน Promo_used เฉพาะ paid item (Product_price > 0)
      if (parseFloat(item.Product_price) > 0) {
        await conn.query(
          `UPDATE pro_product pp
           JOIN promotion pr ON pp.Promotion_id = pr.Promotion_id
           SET pp.Promo_used = GREATEST(0, pp.Promo_used - ?)
           WHERE pp.Product_id = ? AND pr.DiscountType = 'buy 1 get 1' AND pr.Status = 'Y'`,
          [item.Quantity, item.Product_id]
        );
      }
    }

    await conn.query(
      `UPDATE \`order\` SET Status = 'Ca' WHERE Order_id = ?`, [Order_id]
    );

    await conn.commit();
    res.json({ success: true, Order_id });
  } catch (err) {
    await conn.rollback();
    console.error('POST /api/orders/cancel error:', err);
    res.status(500).json({ error: err.message });
  } finally {
    conn.release();
  }
});

// ─────────────────────────────────────────────────────────────────────────
// PUT /api/orders/:order_id/address
// แก้ไขที่อยู่จัดส่งของ order (เฉพาะ status 'O' หรือ 'P')
// Body: { Name, Surname, Phone, Address, member_id }
// ─────────────────────────────────────────────────────────────────────────
router.put('/:order_id/address', async (req, res) => {
  const { order_id } = req.params;
  const { Name, Surname, Phone, Address, member_id } = req.body;
  if (!Name || !Address || !member_id) return res.status(400).json({ error: 'Missing required fields' });
  try {
    const [[order]] = await db.query(
      'SELECT MemberID, Status FROM `order` WHERE Order_id = ?', [order_id]
    );
    if (!order) return res.status(404).json({ error: 'Order not found' });
    if (String(order.MemberID) !== String(member_id)) return res.status(403).json({ error: 'Forbidden' });
    if (!['O', 'P'].includes(order.Status)) return res.status(400).json({ error: 'ไม่สามารถแก้ไขที่อยู่ได้ในสถานะนี้' });
    await db.query(
      'UPDATE `order` SET Name=?, Surname=?, Phone=?, Address=? WHERE Order_id=?',
      [Name, Surname || '', Phone || '', Address, order_id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────
// GET /api/orders/:member_id
// ดึง orders ของ member (สำหรับหน้า Orders)
// ─────────────────────────────────────────────────────────────────────────
router.get('/:member_id', async (req, res) => {
  const { member_id } = req.params;
  try {
    const [orders] = await db.query(
      `SELECT o.*, GROUP_CONCAT(
         CONCAT(
           COALESCE(p.Product_name, od.Product_model), '|',
           od.Quantity, '|',
           od.Product_price, '|',
           COALESCE(p.Image, ''), '|',
           od.Product_model, '|',
           COALESCE(pp.Promotion_id, '')
         )
         ORDER BY od.Order_detail_id SEPARATOR ';;'
       ) AS detail_summary
       FROM \`order\` o
       LEFT JOIN order_detail od ON o.Order_id = od.Order_id
       LEFT JOIN product p ON p.Product_id = od.Product_id
       LEFT JOIN (
         SELECT Product_id, MIN(Promotion_id) AS Promotion_id
         FROM pro_product
         GROUP BY Product_id
       ) pp ON p.Product_id = pp.Product_id
       WHERE o.MemberID = ?
       GROUP BY o.Order_id
       ORDER BY o.Order_date DESC`,
      [member_id]
    );
    res.json({ orders });
  } catch (err) {
    console.error('GET /api/orders error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
