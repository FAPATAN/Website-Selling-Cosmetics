const db = require('./config/db');

exports.getCategories = (req, res) => {
    const sql = `SELECT Type_id, Type_name, Type_pic FROM type`;

    db.query(sql, (err, results) => {
        if (err) {
            console.log("DB Error:", err);
            return res.status(500).json({ message: "Database error", error: err.message });
        }

        // ปรับรูปให้เป็น URL จริง (ใช้ uploads)
        const newData = results.map(item => ({
            ...item,
            Type_pic: item.Type_pic ? `http://localhost:5000/uploads/${item.Type_pic}` : null
        }));

        res.json(newData);
    });
};
