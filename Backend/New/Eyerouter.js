const express = require('express');
const router = express.Router();
const NewController = require('./Newcontroller');

// ดึงสินค้าทั้งหมดที่เป็นประเภท EYE (หรือปรับตาม field จริงในฐานข้อมูล)
router.get('/', async (req, res) => {
    try {
        // สมมติว่ามี field Product_type หรือ Type_name เป็น 'EYE'
        const result = await NewController.getProductsByType('EYE');
        res.json({ data: result });
    } catch (err) {
        res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: err.message });
    }
});

module.exports = router;
