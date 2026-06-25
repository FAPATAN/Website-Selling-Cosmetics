const express = require('express');
const router = express.Router();
const NewController = require('./Newcontroller');

// ดึงข้อมูลสินค้าตาม id, โปรโมชั่น, และสินค้าที่เชื่อมกับโปรโมชั่น
router.get('/', async (req, res) => {
    try {
        const products = await NewController.getProductsByIds([1,2,3,4]);
        const promotions = await NewController.getPromotions();
        const proProducts = await NewController.getProProducts();
        res.json({ products, promotions, proProducts });
    } catch (err) {
        console.error('API /api/promotion error:', err); // เพิ่ม log
        res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: err.message });
    }
});

// ดึงข้อมูลโปรโมชั่นทั้งหมด
router.get('/promotions', async (req, res) => {
    try {
        const promotions = await NewController.getPromotions();
        res.json({ data: promotions });
    } catch (err) {
        res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: err.message });
    }
});

// ดึงข้อมูลสินค้าจากตาราง pro_product
router.get('/pro-products', async (req, res) => {
    try {
        const proProducts = await NewController.getProProducts();
        res.json({ data: proProducts });
    } catch (err) {
        res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: err.message });
    }
});

module.exports = router;
