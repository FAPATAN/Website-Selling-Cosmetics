const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/reviews/:productId  — ดึง rating summary + รายการรีวิว
router.get('/:productId', async (req, res) => {
  const { productId } = req.params;
  try {
    const [[summary]] = await db.query(
      `SELECT COUNT(*) AS total, ROUND(AVG(Rating), 1) AS avg_rating FROM review WHERE Product_id = ?`,
      [productId]
    );
    const [reviews] = await db.query(
      `SELECT r.Review_id, r.Rating, r.Comment, r.Created_at,
              m.Name, m.Surname
       FROM review r
       JOIN member m ON r.Member_id = m.MemberID
       WHERE r.Product_id = ?
       ORDER BY r.Created_at DESC`,
      [productId]
    );
    res.json({
      total: summary.total,
      avg_rating: summary.avg_rating || 0,
      reviews
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/reviews/:productId  — เพิ่มรีวิว (ต้อง login)
router.post('/:productId', async (req, res) => {
  const { productId } = req.params;
  const { Member_id, Rating, Comment } = req.body;
  if (!Member_id || !Rating) return res.status(400).json({ error: 'Member_id and Rating required' });
  if (Rating < 1 || Rating > 5) return res.status(400).json({ error: 'Rating must be 1-5' });
  try {
    await db.query(
      `INSERT INTO review (Product_id, Member_id, Rating, Comment)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE Rating = VALUES(Rating), Comment = VALUES(Comment), Created_at = NOW()`,
      [productId, Member_id, Rating, Comment || null]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
