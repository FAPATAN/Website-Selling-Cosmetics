const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../db'); // mysql2/promise pool

// ─── Multer (product images) ─────────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../uploads');
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files are allowed'));
  },
});

// ─── Middleware: ตรวจ Member_role = 'A' ─────────────────────────────────────
async function requireAdmin(req, res, next) {
  const memberId = req.headers['x-member-id'];
  if (!memberId) return res.status(401).json({ error: 'Unauthorized: missing member id' });
  try {
    const [rows] = await db.query(
      'SELECT Member_role FROM member WHERE MemberID = ?',
      [memberId]
    );
    if (!rows.length || rows[0].Member_role !== 'A') {
      return res.status(403).json({ error: 'Forbidden: admin only' });
    }
    req.adminId = memberId;
    next();
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

router.use(requireAdmin);

// เพิ่ม column sold_total ใน product table ถ้ายังไม่มี
db.query(`ALTER TABLE product ADD COLUMN sold_total INT NOT NULL DEFAULT 0`)
  .catch(err => {
    if (err.code !== 'ER_DUP_FIELDNAME') {
      console.warn('[sold_total column init]', err.message);
    }
  });

// Sync sold_total จาก order_detail จริง (รันทุกครั้งที่ server start)
db.query(`
  UPDATE product p
  SET p.sold_total = (
    SELECT COALESCE(SUM(od.Quantity), 0)
    FROM order_detail od
    JOIN \`order\` o ON od.Order_id = o.Order_id
    WHERE od.Product_id = p.Product_id
      AND o.Status NOT IN ('Ca', 'T')
  )
`).then(() => console.log('✅ sold_total synced from orders'))
  .catch(err => console.warn('[sold_total sync]', err.message));

// ═══════════════════════════════════════════════
// DASHBOARD
// GET /api/admin/dashboard
// ═══════════════════════════════════════════════
router.get('/dashboard', async (req, res) => {
  try {
    const [[{ members }]]      = await db.query('SELECT COUNT(*) AS members FROM member WHERE Member_role != "A"');
    const [[{ orders }]]       = await db.query('SELECT COUNT(*) AS orders FROM `order`');
    const [[{ products }]]     = await db.query('SELECT COUNT(*) AS products FROM product');
    const [[{ revenue }]]      = await db.query('SELECT COALESCE(SUM(Proprice),0) AS revenue FROM `order` WHERE Status IN ("P","A","S","R","C")');
    const [[{ revenueWeek }]]  = await db.query(
      'SELECT COALESCE(SUM(Proprice),0) AS revenueWeek FROM `order` WHERE Status IN ("P","A","S","R","C") AND Order_date >= DATE_SUB(NOW(), INTERVAL 7 DAY)'
    );
    const [[{ revenueMonth }]] = await db.query(
      'SELECT COALESCE(SUM(Proprice),0) AS revenueMonth FROM `order` WHERE Status IN ("P","A","S","R","C") AND MONTH(Order_date) = MONTH(NOW()) AND YEAR(Order_date) = YEAR(NOW())'
    );
    const [[{ revenueYear }]]  = await db.query(
      'SELECT COALESCE(SUM(Proprice),0) AS revenueYear FROM `order` WHERE Status IN ("P","A","S","R","C") AND YEAR(Order_date) = YEAR(NOW())'
    );
    const [pendingOrders]   = await db.query(
      `SELECT o.Order_id, o.MemberID, o.Name, o.Surname, o.Proprice, o.Status, o.Order_date,
              o.Invoice_pic
       FROM \`order\` o WHERE o.Status IN ('O','P') ORDER BY o.Order_date DESC LIMIT 5`
    );
    res.json({ members, orders, products, revenue, revenueWeek, revenueMonth, revenueYear, pendingOrders });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/admin/revenue/history?type=week|month|year&ref=2026-W17
router.get('/revenue/history', async (req, res) => {
  const type = req.query.type || 'month';
  try {
    let rows = [];
    if (type === 'week') {
      const ref = (req.query.ref || '').replace(/[^0-9W-]/g, '');
      if (!/^\d{4}-W\d{2}$/.test(ref)) return res.status(400).json({ error: 'Invalid week' });
      const [yr, wPart] = ref.split('-W');
      const [result] = await db.query(`
        SELECT DATE_FORMAT(MIN(Order_date), '%x-W%v') AS label,
               COALESCE(SUM(Proprice),0) AS revenue
        FROM \`order\`
        WHERE Status IN ('P','A','S','R','C')
          AND YEARWEEK(Order_date, 1) <= YEARWEEK(STR_TO_DATE(CONCAT(?, ' ', ?, ' 1'), '%X %V %w'), 1)
          AND Order_date >= DATE_SUB(STR_TO_DATE(CONCAT(?, ' ', ?, ' 1'), '%X %V %w'), INTERVAL 7 WEEK)
        GROUP BY YEARWEEK(Order_date, 1)
        ORDER BY YEARWEEK(Order_date, 1)
      `, [yr, wPart, yr, wPart]);
      rows = result.map(r => ({ label: r.label, revenue: Number(r.revenue) }));
    } else if (type === 'day') {
      const start = (req.query.start || '').replace(/[^0-9-]/g, '');
      const end   = (req.query.end   || '').replace(/[^0-9-]/g, '');
      if (!/^\d{4}-\d{2}-\d{2}$/.test(start) || !/^\d{4}-\d{2}-\d{2}$/.test(end))
        return res.status(400).json({ error: 'Invalid date range' });
      const [result] = await db.query(`
        SELECT DATE_FORMAT(Order_date, '%Y-%m-%d') AS label,
               COALESCE(SUM(Proprice),0) AS revenue
        FROM \`order\`
        WHERE Status IN ('P','A','S','R','C')
          AND DATE(Order_date) >= ? AND DATE(Order_date) <= ?
        GROUP BY DATE_FORMAT(Order_date, '%Y-%m-%d')
        ORDER BY label
      `, [start, end]);
      rows = result.map(r => ({ label: r.label, revenue: Number(r.revenue) }));
    } else if (type === 'month') {
      const ref = (req.query.ref || '').replace(/[^0-9-]/g, '');
      if (!/^\d{4}-\d{2}$/.test(ref)) return res.status(400).json({ error: 'Invalid month' });
      const [yr, mo] = ref.split('-').map(Number);
      const [result] = await db.query(`
        SELECT DATE_FORMAT(Order_date, '%Y-%m') AS label,
               COALESCE(SUM(Proprice),0) AS revenue
        FROM \`order\`
        WHERE Status IN ('P','A','S','R','C')
          AND (YEAR(Order_date) * 12 + MONTH(Order_date)) <= ?
          AND (YEAR(Order_date) * 12 + MONTH(Order_date)) > ?
        GROUP BY DATE_FORMAT(Order_date, '%Y-%m')
        ORDER BY label
      `, [yr * 12 + mo, yr * 12 + mo - 6]);
      rows = result.map(r => ({ label: r.label, revenue: Number(r.revenue) }));
    } else {
      const year = parseInt(req.query.ref) || new Date().getFullYear();
      if (year < 1900 || year > 2200) return res.status(400).json({ error: 'Invalid year' });
      const [result] = await db.query(`
        SELECT YEAR(Order_date) AS label,
               COALESCE(SUM(Proprice),0) AS revenue
        FROM \`order\`
        WHERE Status IN ('P','A','S','R','C')
          AND YEAR(Order_date) <= ?
          AND YEAR(Order_date) > ?
        GROUP BY YEAR(Order_date)
        ORDER BY label
      `, [year, year - 5]);
      rows = result.map(r => ({ label: String(r.label), revenue: Number(r.revenue) }));
    }
    res.json({ history: rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/admin/revenue?type=week|month|year&week=2026-W17|month=2026-04|year=2026
router.get('/revenue', async (req, res) => {
  const type = req.query.type || 'month';
  try {
    let query;
    if (type === 'week') {
      const week = (req.query.week || '').replace(/[^0-9W-]/g, '');
      if (!/^\d{4}-W\d{2}$/.test(week)) return res.status(400).json({ error: 'Invalid week format' });
      const [yr, wPart] = week.split('-W');
      query = `SELECT COALESCE(SUM(Proprice),0) AS revenue FROM \`order\`
               WHERE Status IN ('P','A','S','R','C')
               AND YEARWEEK(Order_date, 1) = YEARWEEK(STR_TO_DATE('${yr} ${wPart} 1', '%X %V %w'), 1)`;
    } else if (type === 'month') {
      const month = (req.query.month || '').replace(/[^0-9-]/g, '');
      if (!/^\d{4}-\d{2}$/.test(month)) return res.status(400).json({ error: 'Invalid month format' });
      const [yr, mo] = month.split('-');
      query = `SELECT COALESCE(SUM(Proprice),0) AS revenue FROM \`order\`
               WHERE Status IN ('P','A','S','R','C')
               AND YEAR(Order_date) = ${parseInt(yr)} AND MONTH(Order_date) = ${parseInt(mo)}`;
    } else {
      const year = parseInt(req.query.year) || new Date().getFullYear();
      if (year < 1900 || year > 2200) return res.status(400).json({ error: 'Invalid year' });
      query = `SELECT COALESCE(SUM(Proprice),0) AS revenue FROM \`order\`
               WHERE Status IN ('P','A','S','R','C')
               AND YEAR(Order_date) = ${year}`;
    }
    const [[{ revenue }]] = await db.query(query);
    res.json({ revenue: Number(revenue) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ═══════════════════════════════════════════════
// MEMBERS
// ═══════════════════════════════════════════════
// GET /api/admin/members
router.get('/members', async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT m.MemberID, m.Username, m.Name, m.Surname, m.Email, m.Phone, m.Address, m.Member_role, m.Status,
              COALESCE(SUM(CASE WHEN o.Status IN ('P','A','S','R','C') THEN o.Proprice ELSE 0 END), 0) AS total_spent,
              COUNT(CASE WHEN o.Status IN ('P','A','S','R','C') THEN 1 END) AS order_count
       FROM member m
       LEFT JOIN \`order\` o ON o.MemberID = m.MemberID
       GROUP BY m.MemberID
       ORDER BY m.MemberID DESC`
    );
    res.json({ members: rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/admin/members
router.post('/members', async (req, res) => {
  const { Username, Password, Name, Surname, Email, Phone, Address, Member_role, Status } = req.body;
  try {
    await db.query(
      `INSERT INTO member (Username, Password, Name, Surname, Email, Phone, Address, Member_role, Status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [Username, Password || "", Name, Surname, Email, Phone, Address, Member_role || "U", Status || "active"]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/admin/members/:id
router.get('/members/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query(
      'SELECT MemberID, Username, Name, Surname, Email, Member_role FROM member WHERE MemberID = ?',
      [id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/admin/members/:id
router.put('/members/:id', async (req, res) => {
  const { id } = req.params;
  const { Username, Name, Surname, Email, Phone, Address, Member_role, Status } = req.body;
  try {
    await db.query(
      `UPDATE member SET Username=?, Name=?, Surname=?, Email=?, Phone=?, Address=?, Member_role=?, Status=?
       WHERE MemberID=?`,
      [Username, Name, Surname, Email, Phone, Address, Member_role, Status, id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/admin/members/:id
router.delete('/members/:id', async (req, res) => {
  const { id } = req.params;
  try {
    // ลบ cart ของ member ก่อน (FK: cart.MemberID)
    await db.query('DELETE FROM cart WHERE MemberID=?', [id]);
    // ตั้ง NULL ใน order เพื่อเก็บประวัติ order ไว้ (FK: order.MemberID)
    await db.query('UPDATE `order` SET MemberID=NULL WHERE MemberID=?', [id]);
    await db.query('DELETE FROM member WHERE MemberID=?', [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ═══════════════════════════════════════════════
// ORDERS
// ═══════════════════════════════════════════════
// GET /api/admin/orders
router.get('/orders', async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT o.*, m.Email,
        GROUP_CONCAT(
          CONCAT(od.Product_model,'|',od.Quantity,'|',od.Product_price)
          ORDER BY od.Order_detail_id SEPARATOR ';;'
        ) AS detail_summary
       FROM \`order\` o
       LEFT JOIN member m ON m.MemberID = o.MemberID
       LEFT JOIN order_detail od ON o.Order_id = od.Order_id
       GROUP BY o.Order_id
       ORDER BY o.Order_date DESC`
    );
    res.json({ orders: rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/admin/orders/:id/status
// Body: { Status: 'P'|'A'|'T'|'S' }
router.put('/orders/:id/status', async (req, res) => {
  const { id } = req.params;
  const { Status, TrackingNo } = req.body;
  if (!['O','P','A','S','R','C','Ca'].includes(Status)) {
    return res.status(400).json({ error: 'Invalid status. Use O/P/A/S/R/C/Ca' });
  }
  try {
    // ดึง status เดิมก่อน เพื่อตัดสินใจว่าต้อง update sold_total ไหม
    const [[prevOrder]] = await db.query('SELECT Status FROM `order` WHERE Order_id=?', [id]);
    const prevStatus = prevOrder?.Status;

    if (TrackingNo !== undefined) {
      await db.query('UPDATE `order` SET Status=?, TrackingNo=? WHERE Order_id=?', [Status, TrackingNo || null, id]);
    } else {
      await db.query('UPDATE `order` SET Status=? WHERE Order_id=?', [Status, id]);
    }

    // อัปเดต sold_total เมื่อ status เปลี่ยนเข้า/ออก 'Ca'
    const wasCancelled = prevStatus === 'Ca';
    const nowCancelled = Status === 'Ca';
    if (wasCancelled !== nowCancelled) {
      const [items] = await db.query(
        'SELECT Product_id, Quantity FROM order_detail WHERE Order_id=?', [id]
      );
      for (const item of items) {
        if (nowCancelled) {
          // ยกเลิก order → ลด sold_total
          await db.query(
            'UPDATE product SET sold_total = GREATEST(0, sold_total - ?) WHERE Product_id=?',
            [item.Quantity, item.Product_id]
          );
        } else {
          // กู้ order จาก Ca → เพิ่ม sold_total กลับ
          await db.query(
            'UPDATE product SET sold_total = sold_total + ? WHERE Product_id=?',
            [item.Quantity, item.Product_id]
          );
        }
      }
    }

    res.json({ success: true, Order_id: id, Status });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/admin/orders/:id/items
// ดึงรายการสินค้าใน order สำหรับ admin
router.get('/orders/:id/items', async (req, res) => {
  const { id } = req.params;
  try {
    const [items] = await db.query(
      `SELECT od.Order_detail_id, od.Product_id, od.Product_model,
              od.Product_price, od.Quantity, od.Discount, od.Total,
              p.Product_name, p.Image,
              pr.DiscountType, pr.Discount_value
       FROM order_detail od
       LEFT JOIN product p ON p.Product_id = od.Product_id
       LEFT JOIN pro_product pp ON pp.Product_id = od.Product_id
       LEFT JOIN promotion pr ON pr.Promotion_id = pp.Promotion_id
       WHERE od.Order_id = ?
       ORDER BY od.Order_detail_id`,
      [id]
    );
    res.json({ items });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/admin/orders/:id/info
// แก้ไขข้อมูลลูกค้าใน order
router.put('/orders/:id/info', async (req, res) => {
  const { id } = req.params;
  const { Name, Surname, Email, Phone, Address } = req.body;
  try {
    await db.query(
      'UPDATE `order` SET Name=?, Surname=?, Phone=?, Address=? WHERE Order_id=?',
      [Name, Surname, Phone, Address, id]
    );
    if (Email) {
      const [[order]] = await db.query('SELECT MemberID FROM `order` WHERE Order_id=?', [id]);
      if (order) await db.query('UPDATE member SET Email=? WHERE MemberID=?', [Email, order.MemberID]);
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ═══════════════════════════════════════════════
// PRODUCTS
// ═══════════════════════════════════════════════
// GET /api/admin/products
router.get('/products', async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT p.*, t.Type_name, p.sold_total AS total_sold
       FROM product p
       LEFT JOIN type t ON p.Type_id = t.Type_id
       ORDER BY p.Product_id DESC`
    );
    res.json({ products: rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/admin/types  (for dropdown in product form)
router.get('/types', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT Type_id, Type_name FROM type ORDER BY Type_id');
    res.json({ types: rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/admin/products
// Helper: run multer as promise (same pattern as gallery — works with Express 5 + Node.js v24)
function uploadProductFiles(req, res) {
  return new Promise((resolve, reject) => {
    upload.any()(req, res, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

router.post('/products', async (req, res) => {
  try {
    await uploadProductFiles(req, res);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
  const { Type_id, Product_name, Product_model, Product_price, Color, Stock, Sale_date, Description } = req.body;
  const Image = req.files?.find(f => f.fieldname === 'image')?.filename || '';
  const Product_detail = req.files?.find(f => f.fieldname === 'detailImage')?.filename || '';
  const stockVal = Stock !== undefined && Stock !== '' && !isNaN(parseInt(Stock, 10)) ? parseInt(Stock, 10) : 0;
  const saleDateVal = Sale_date || null;
  try {
    const [result] = await db.query(
      `INSERT INTO product (Type_id, Product_name, Product_model, Product_detail, Image, Product_price, Color, Stock, Sale_date, Description)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [Type_id, Product_name, Product_model || '', Product_detail, Image, Product_price, Color || null, stockVal, saleDateVal, Description || null]
    );
    res.json({ success: true, Product_id: result.insertId });
  } catch (err) {
    const imgFile = req.files?.find(f => f.fieldname === 'image');
    const detFile = req.files?.find(f => f.fieldname === 'detailImage');
    if (imgFile) fs.unlink(imgFile.path, () => {});
    if (detFile) fs.unlink(detFile.path, () => {});
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/admin/products/:id
router.put('/products/:id', async (req, res) => {
  console.log('📥 PUT content-type:', req.headers['content-type']?.substring(0, 80));
  try {
    await uploadProductFiles(req, res);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
  console.log('✅ multer done, files:', JSON.stringify((req.files||[]).map(f=>f.fieldname)), 'body keys:', Object.keys(req.body||{}));
  const { id } = req.params;
  const { Type_id, Product_name, Product_model, Product_price, Color, Stock, Sale_date, Description, clearDetail } = req.body;
  const newImage = req.files?.find(f => f.fieldname === 'image')?.filename;
  const newDetailImage = req.files?.find(f => f.fieldname === 'detailImage')?.filename;
  const stockVal = Stock !== undefined && Stock !== '' && !isNaN(parseInt(Stock, 10)) ? parseInt(Stock, 10) : null;
  const saleDateVal = Sale_date || null;
  // เลือก Product_detail ที่จะ set: รูปใหม่ > ลบ > ไม่เปลี่ยน
  const detailVal = newDetailImage ? newDetailImage : (clearDetail === '1' ? '' : undefined);
  try {
    const setCols = [
      'Type_id=?', 'Product_name=?', 'Product_model=?', 'Product_price=?',
      'Color=?', 'Sale_date=?', 'Description=?',
    ];
    const vals = [Type_id, Product_name, Product_model || '', Product_price, Color || null, saleDateVal, Description || null];
    if (newImage) { setCols.push('Image=?'); vals.push(newImage); }
    if (detailVal !== undefined) { setCols.push('Product_detail=?'); vals.push(detailVal); }
    if (stockVal !== null) { setCols.push('Stock=?'); vals.push(stockVal); }
    vals.push(id);
    await db.query(`UPDATE product SET ${setCols.join(', ')} WHERE Product_id=?`, vals);
    res.json({ success: true });
  } catch (err) {
    const imgFile = req.files?.find(f => f.fieldname === 'image');
    const detFile = req.files?.find(f => f.fieldname === 'detailImage');
    if (imgFile) fs.unlink(imgFile.path, () => {});
    if (detFile) fs.unlink(detFile.path, () => {});
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/admin/products/:id
router.delete('/products/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM product WHERE Product_id=?', [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/admin/products/:id/sold — แก้ไขยอดขาย (sold_total) ใน product table
router.put('/products/:id/sold', async (req, res) => {
  const { id } = req.params;
  const { total_sold } = req.body;
  if (total_sold === undefined || isNaN(Number(total_sold))) {
    return res.status(400).json({ error: 'total_sold ต้องเป็นตัวเลข' });
  }
  try {
    await db.query(
      `UPDATE product SET sold_total = ? WHERE Product_id = ?`,
      [Math.max(0, Number(total_sold)), id]
    );
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ═══════════════════════════════════════════════
// PROMOTIONS
// ═══════════════════════════════════════════════
// GET /api/admin/promotions
router.get('/promotions', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM promotion ORDER BY Promotion_id DESC'
    );
    res.json({ promotions: rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/admin/promotions
router.post('/promotions', async (req, res) => {
  const { Promotion_name, DiscountType, Discount_value, condition, StartDate, EndDate, Status } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO promotion (Promotion_name, DiscountType, Discount_value, `condition`, StartDate, EndDate, Status) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [Promotion_name, DiscountType || 'percent', Discount_value || 0, condition || '', StartDate || null, EndDate || null, Status || 'Y']
    );
    res.json({ success: true, Promotion_id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/admin/promotions/:id
router.put('/promotions/:id', async (req, res) => {
  const { id } = req.params;
  const { Promotion_name, DiscountType, Discount_value, condition, StartDate, EndDate, Status } = req.body;
  try {
    await db.query(
      'UPDATE promotion SET Promotion_name=?, DiscountType=?, Discount_value=?, `condition`=?, StartDate=?, EndDate=?, Status=? WHERE Promotion_id=?',
      [Promotion_name, DiscountType, Discount_value, condition, StartDate || null, EndDate || null, Status || 'Y', id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/admin/promotions/:id
router.delete('/promotions/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM promotion WHERE Promotion_id=?', [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/admin/promotions/:id/products — ดึงสินค้าที่อยู่ในโปรโมชั่น
router.get('/promotions/:id/products', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query(
      `SELECT pr.Product_id, pr.Product_name, pr.Product_model, pr.Product_detail,
              pr.Product_price, pr.Image, pp.Max_buy, pp.Promo_used
       FROM pro_product pp
       LEFT JOIN product pr ON pp.Product_id = pr.Product_id
       WHERE pp.Promotion_id = ?`,
      [id]
    );
    const products = rows.map(p => ({
      ...p,
      image_url: p.Image ? `http://localhost:5000/uploads/${p.Image}` : null,
    }));
    res.json({ products });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/admin/promotions/:id/products — เพิ่มสินค้าเข้าโปรโมชั่น
router.post('/promotions/:id/products', async (req, res) => {
  const { id } = req.params;
  const { Product_id, Max_buy } = req.body;
  if (!Product_id) return res.status(400).json({ error: 'Product_id required' });
  const maxBuy = parseInt(Max_buy, 10) || 0;
  try {
    // เก็บ Type เดิมของสินค้าไว้ใน pro_product เพื่อ revert ได้ภายหลัง
    const [[product]] = await db.query('SELECT Type_id FROM product WHERE Product_id = ?', [Product_id]);
    const originalTypeId = product ? product.Type_id : null;
    await db.query(
      'INSERT INTO pro_product (Promotion_id, Product_id, Max_buy, Original_type_id) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE Max_buy = VALUES(Max_buy)',
      [id, Product_id, maxBuy, originalTypeId]
    );
    // ย้าย Type สินค้าเป็น PROMOTION อัตโนมัติ
    const [[promoType]] = await db.query("SELECT Type_id FROM type WHERE UPPER(Type_name) = 'PROMOTION' LIMIT 1");
    if (promoType) {
      await db.query('UPDATE product SET Type_id = ? WHERE Product_id = ?', [promoType.Type_id, Product_id]);
    }
    res.json({ success: true });
  } catch (err) {
    // ถ้า column Original_type_id ยังไม่มีใน DB ให้ fallback INSERT โดยไม่เก็บ
    try {
      await db.query(
        'INSERT INTO pro_product (Promotion_id, Product_id, Max_buy) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE Max_buy = VALUES(Max_buy)',
        [id, Product_id, maxBuy]
      );
      const [[promoType]] = await db.query("SELECT Type_id FROM type WHERE UPPER(Type_name) = 'PROMOTION' LIMIT 1");
      if (promoType) {
        await db.query('UPDATE product SET Type_id = ? WHERE Product_id = ?', [promoType.Type_id, Product_id]);
      }
      res.json({ success: true });
    } catch (err2) {
      res.status(500).json({ error: err2.message });
    }
  }
});

// PUT /api/admin/promotions/:id/products/:pid — อัปเดต Max_buy
router.put('/promotions/:id/products/:pid', async (req, res) => {
  const { id, pid } = req.params;
  const maxBuy = parseInt(req.body.Max_buy, 10) || 0;
  try {
    await db.query(
      'UPDATE pro_product SET Max_buy = ? WHERE Promotion_id = ? AND Product_id = ?',
      [maxBuy, id, pid]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/admin/promotions/:id/products/:pid/reset-quota — รีเซ็ต Promo_used = 0
router.put('/promotions/:id/products/:pid/reset-quota', async (req, res) => {
  const { id, pid } = req.params;
  try {
    await db.query(
      'UPDATE pro_product SET Promo_used = 0 WHERE Promotion_id = ? AND Product_id = ?',
      [id, pid]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/admin/promotions/:id/products/:pid — นำสินค้าออกจากโปรโมชั่น
router.delete('/promotions/:id/products/:pid', async (req, res) => {
  const { id, pid } = req.params;
  try {
    // ดึง Original_type_id ก่อนลบ
    const [[pp]] = await db.query(
      'SELECT Original_type_id FROM pro_product WHERE Promotion_id = ? AND Product_id = ?', [id, pid]
    ).catch(() => [[null]]);
    await db.query(
      'DELETE FROM pro_product WHERE Promotion_id = ? AND Product_id = ?',
      [id, pid]
    );
    // ถ้าไม่มีโปรโมชั่นอื่นอีก ให้ revert Type กลับ
    const [[{ cnt }]] = await db.query('SELECT COUNT(*) AS cnt FROM pro_product WHERE Product_id = ?', [pid]);
    if (cnt === 0) {
      const revertTypeId = pp && pp.Original_type_id ? pp.Original_type_id : null;
      if (revertTypeId) {
        await db.query('UPDATE product SET Type_id = ? WHERE Product_id = ?', [revertTypeId, pid]);
      }
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/admin/products/:id/type — เปลี่ยนหมวดหมู่สินค้า
router.patch('/products/:id/type', async (req, res) => {
  const { id } = req.params;
  const { Type_id } = req.body;
  if (!Type_id) return res.status(400).json({ error: 'Missing Type_id' });
  try {
    await db.query('UPDATE product SET Type_id = ? WHERE Product_id = ?', [Type_id, id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Price Range Management ──────────────────────────────────────────
// GET /api/admin/price-ranges — ดึงทุก row ใน price_range พร้อม Type info
router.get('/price-ranges', async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT pr.Price_range_id, pr.Min_price, pr.Max_price,
              t.Type_name,
              CASE
                WHEN pr.Price_range_id = 1 THEN
                  (SELECT COUNT(DISTINCT od.Product_id)
                   FROM order_detail od
                   INNER JOIN \`order\` o ON od.Order_id = o.Order_id
                   WHERE o.Status NOT IN ('Ca','T'))
                ELSE
                  (SELECT COUNT(*) FROM product p WHERE p.Type_id = pr.Price_range_id)
              END AS product_count
       FROM price_range pr
       LEFT JOIN type t ON t.Type_id = pr.Price_range_id
       ORDER BY pr.Price_range_id`
    );
    res.json({ priceRanges: rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/admin/price-ranges/:id/products — ดึงสินค้าทั้งหมดใน price range นั้น
router.get('/price-ranges/:id/products', async (req, res) => {
  const { id } = req.params;
  try {
    let rows;
    if (String(id) === '1') {
      // BEST = สินค้าที่เคยมียอดขายจริง เรียงตาม total_sold DESC, Product_id ASC (เหมือน AdminProducts)
      [rows] = await db.query(
        `SELECT p.Product_id, p.Product_name, p.Product_model, p.Product_price, p.Image, p.Color,
                t.Type_name,
                COALESCE(SUM(od.Quantity), 0) AS total_sold
         FROM product p
         LEFT JOIN type t ON t.Type_id = p.Type_id
         INNER JOIN order_detail od ON od.Product_id = p.Product_id
         INNER JOIN \`order\` o ON o.Order_id = od.Order_id AND o.Status NOT IN ('Ca','T')
         GROUP BY p.Product_id, p.Product_name, p.Product_model, p.Product_price, p.Image, p.Color, t.Type_name
         ORDER BY total_sold DESC, p.Product_id ASC`
      );
    } else {
      [rows] = await db.query(
        `SELECT p.Product_id, p.Product_name, p.Product_model, p.Product_price, p.Image, p.Color,
                t.Type_name
         FROM product p
         LEFT JOIN type t ON t.Type_id = p.Type_id
         WHERE p.Type_id = ?
         ORDER BY p.Product_id DESC`,
        [id]
      );
    }
    res.json({ products: rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/admin/price-ranges/:id — แก้ไข Min_price / Max_price
router.put('/price-ranges/:id', async (req, res) => {
  const { id } = req.params;
  const { Min_price, Max_price } = req.body;
  if (Min_price == null || Max_price == null) return res.status(400).json({ error: 'Min_price and Max_price required' });
  try {
    await db.query(
      'UPDATE price_range SET Min_price = ?, Max_price = ? WHERE Price_range_id = ?',
      [Number(Min_price), Number(Max_price), id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ═══════════════════════════════════════════════
// PRODUCT GALLERY IMAGES
// ═══════════════════════════════════════════════

// GET /api/admin/products/:id/images
router.get('/products/:id/images', async (req, res) => {
  const { id } = req.params;
  try {
    const [imgs] = await db.query(
      'SELECT product_images_id AS id, Image FROM product_images WHERE Product_id = ? ORDER BY sort_order, product_images_id',
      [id]
    );
    res.json({ images: imgs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/admin/products/:id/images
function uploadGalleryImage(req, res) {
  return new Promise((resolve, reject) => {
    upload.single('image')(req, res, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

router.post('/products/:id/images', async (req, res) => {
  try {
    await uploadGalleryImage(req, res);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
  const uploadedFile = req.file;
  if (!uploadedFile) return res.status(400).json({ error: 'No file uploaded' });
  const { id } = req.params;
  try {
    await db.query(
      'INSERT INTO product_images (Product_id, Image, sort_order) SELECT ?, ?, COALESCE(MAX(sort_order), -1) + 1 FROM product_images WHERE Product_id = ?',
      [id, uploadedFile.filename, id]
    );
    res.json({ success: true });
  } catch (err) {
    fs.unlink(uploadedFile.path, () => {});
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/admin/products-images/:imgId
router.delete('/products-images/:imgId', async (req, res) => {
  const { imgId } = req.params;
  try {
    const [rows] = await db.query('SELECT Image FROM product_images WHERE product_images_id = ?', [imgId]);
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    await db.query('DELETE FROM product_images WHERE product_images_id = ?', [imgId]);
    const filePath = path.join(__dirname, '../uploads', rows[0].Image.replace(/^uploads[/\\]/, ''));
    fs.unlink(filePath, () => {});
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/admin/products/:id/images/reorder
router.put('/products/:id/images/reorder', async (req, res) => {
  const { orders } = req.body; // [{ id, sort_order }]
  if (!Array.isArray(orders)) return res.status(400).json({ error: 'orders must be an array' });
  try {
    for (const item of orders) {
      await db.query('UPDATE product_images SET sort_order = ? WHERE product_images_id = ?', [item.sort_order, item.id]);
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/admin/top-spenders
router.get('/top-spenders', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT m.MemberID, m.Name, m.Surname, m.Email,
             COUNT(o.Order_id) AS order_count,
             COALESCE(SUM(o.Proprice), 0) AS total_spent
      FROM member m
      JOIN \`order\` o ON o.MemberID = m.MemberID
      WHERE o.Status IN ('P','A','S','R','C')
      GROUP BY m.MemberID
      ORDER BY total_spent DESC
      LIMIT 5
    `);
    res.json({ topSpenders: rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/admin/top-products
router.get('/top-products', async (req, res) => {
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
      ORDER BY sold_total DESC, p.Product_id ASC
      LIMIT 5
    `);
    if (!rows.length) {
      // fallback: ส่งข้อมูลสินค้าทั้งหมดที่มี sold_total > 0 จาก column
      const [fallback] = await db.query(`
        SELECT Product_id, Product_name, Product_model, Product_price,
               Image AS Product_img, sold_total
        FROM product
        ORDER BY sold_total DESC
        LIMIT 5
      `);
      return res.json({ topProducts: fallback });
    }
    res.json({ topProducts: rows });
  } catch (err) {
    console.error('[top-products]', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
