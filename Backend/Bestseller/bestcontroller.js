const mysql = require('mysql2');

// สร้าง connection
const connection = mysql.createConnection({
    host: "localhost",
    user: "fah",
    password: "Fapatan11",
    database: "web_selling_cosmetics"
});

exports.read = (req, res) => {
    try {
        const { id } = req.params;

        const query = `
            SELECT 
                p.Product_id,
                t.Type_id,
                pr.Price_range_id,
                p.Product_name,
                p.Product_model,
                p.Product_detail,
                p.Image,
                p.Product_price
            FROM product p
            LEFT JOIN type t ON p.Type_id = t.Type_id
            LEFT JOIN price_range pr ON p.Price_range_id = pr.Price_range_id
            WHERE p.Product_id = ?
        `;

        connection.query(query, [id], (err, rows) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: err.sqlMessage });
            }

            if (rows.length === 0) {
                return res.status(404).json({ msg: 'ไม่พบสินค้า' });
            }

            res.json(rows[0]);
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
};
        // ดึงข้อมูลสินค้า better than contour (ชื่อ, ราคา, รูป)
        exports.getBetterThanContour = (req, res) => {
            try {
                const query = `
                    SELECT 
                        p.Product_name,
                        p.Product_price,
                        p.Image
                    FROM product p
                    WHERE p.Product_name LIKE '%better than contour%'
                    LIMIT 1
                `;
                connection.query(query, (err, rows) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).json({ error: err.sqlMessage });
                    }
                    if (rows.length === 0) {
                        return res.status(404).json({ msg: 'ไม่พบสินค้า' });
                    }
                    res.json(rows[0]);
                });
            } catch (err) {
                console.log(err);
                res.status(500).json({ error: err.message });
            }
        };

exports.bestseller = (req, res) => {
    try {
        // Return a deterministic set of bestseller products (ids 1,2,3,4)
        const query = `
            SELECT 
                p.Product_id,
                t.Type_id,
                t.Type_name,
                p.Product_name,
                p.Product_model,
                p.Product_detail,
                p.Image,
                p.Product_price
            FROM product p
            LEFT JOIN type t ON p.Type_id = t.Type_id
            WHERE p.Product_id IN (1,2,3,4)
            ORDER BY FIELD(p.Product_id, 1,2,3,4)
        `;

        connection.query(query, (err, rows) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: err.sqlMessage });
            }

            if (rows.length === 0) {
                return res.status(404).json({ msg: 'ไม่พบสินค้า' });
            }

            // Debug: log the selected bestseller rows
            console.log('Selected bestseller rows:', rows.map(r => r.Product_id));

            // ส่งเป็น array ของสินค้า (frontend จะสร้าง slides จากรายการนี้)
            res.json({ count: rows.length, data: rows });
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
};

exports.list = (req, res) => {
    try {
        const query = `
            SELECT 
                p.Product_id,
                t.Type_id,
                t.Type_name,
                pr.Price_range_id,
                p.Product_name,
                p.Product_model,
                p.Product_detail,
                p.Image,
                p.Product_price
            FROM product p
            LEFT JOIN type t ON p.Type_id = t.Type_id
            LEFT JOIN price_range pr ON p.Price_range_id = pr.Price_range_id
            ORDER BY p.Product_id DESC
        `;

        connection.query(query, (err, rows) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: err.sqlMessage });
            }

            res.json({
                count: rows.length,
                data: rows
            });
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
};
