const db = require('./config/db');

exports.getCategories = async (req, res) => {
    const sql = `SELECT Type_id, Type_name, Type_pic FROM type`;
    const BASE_URL = process.env.BASE_URL || process.env.RENDER_EXTERNAL_URL || process.env.REACT_APP_API_URL || 'http://localhost:5000';

    try {
        const [results] = await db.promise().query(sql);

        // ปรับรูปให้เป็น URL จริง (ใช้ uploads)
        const newData = results.map(item => ({
            ...item,
            Type_pic: item.Type_pic ? `${BASE_URL}/uploads/${item.Type_pic}` : null
        }));

        res.json(newData);
    } catch (err) {
        console.log("DB Error:", err);
        return res.status(500).json({ message: "Database error", error: err.message });
    }
};
