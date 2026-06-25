const express = require('express');
const router = express.Router();
const NewController = require('./Newcontroller');

// ดึงสินค้าทั้งหมดที่เป็นประเภท CHEEK
router.get('/', async (req, res) => {
    try {
        const result = await NewController.getProductsByType('CHEEK');
        res.json({ data: result });
    } catch (err) {
        res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: err.message });
    }
});

module.exports = router;
