const express = require('express');
const router = express.Router();
const db = require('../db'); // เพิ่มบรรทัดนี้เพื่อเชื่อมต่อฐานข้อมูล

// เรียกฟังก์ชันจาก controller
const { read, list, bestseller, getBetterThanContour, productColors } = require('./bestcontroller');

// อ่านทั้งหมด
router.get('/best', list);

// อ่านสินค้า bestseller เดี่ยว
router.get('/bestseller', bestseller);

// อ่านตาม id
router.get('/best/:id', read);

// อ่านข้อมูล better than contour
router.get('/best/better-than-contour', getBetterThanContour);

// ดึง Color ของสินค้าทั้งหมด (สำหรับ sibling color swatches)
router.get('/product-colors', productColors);

// API ดึงช่วงราคาจากราคาจริงของสินค้า
router.get('/price-range', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT MIN(Product_price) AS min, MAX(Product_price) AS max FROM product');
    res.json({ min: Number(rows[0].min) || 0, max: Number(rows[0].max) || 9999 });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// API ดึงช่วงราคาตาม id จากตาราง price_range
router.get('/price-range/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query(
      'SELECT Min_price, Max_price FROM price_range WHERE Price_range_id = ?',
      [id]
    );
    if (rows && rows.length > 0) {
      res.json({ min: Number(rows[0].Min_price), max: Number(rows[0].Max_price) });
    } else {
      res.json({ min: 0, max: 0 });
    }
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
