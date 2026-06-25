const express = require('express');
const router = express.Router();

// เรียกฟังก์ชันจาก controller
const { read, list, newproduct, getBetterThanContour, randomProducts } = require('./Newcontroller');

// สุ่มสินค้า
router.get('/products/random', randomProducts);

// อ่านทั้งหมด
router.get('/new', list);

// อ่านสินค้า new เดี่ยว
router.get('/newproduct', newproduct);

// อ่านตาม id
router.get('/new/:id', read);

// อ่านข้อมูล better than contour (หรือจะเปลี่ยนชื่อฟังก์ชัน/endpoint ตามหมวดหมู่จริง)
router.get('/new/better-than-contour', getBetterThanContour);

module.exports = router;
