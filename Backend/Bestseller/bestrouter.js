const express = require('express');
const router = express.Router();

// เรียกฟังก์ชันจาก controller
const { read, list, bestseller, getBetterThanContour } = require('./bestcontroller');

// อ่านทั้งหมด
router.get('/best', list);

// อ่านสินค้า bestseller เดี่ยว
router.get('/bestseller', bestseller);

// อ่านตาม id
router.get('/best/:id', read);

// อ่านข้อมูล better than contour
router.get('/best/better-than-contour', getBetterThanContour);

module.exports = router;
