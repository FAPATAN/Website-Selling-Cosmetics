const express = require('express');
const router = express.Router();
const NewController = require('./Newcontroller');

// อ่านสินค้าหมวด face
router.get('/face', async (req, res) => {
    try {
        const result = await NewController.getProductsByType('face');
        res.json({ count: result.length, data: result });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
