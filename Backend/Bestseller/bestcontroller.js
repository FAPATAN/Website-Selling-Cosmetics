const mysql = require('mysql2');

// ใช้ Pool แทน createConnection เพื่อ auto-reconnect เมื่อ MySQL ตัด connection
const connection = mysql.createPool({
   host: process.env.DB_HOST,         // แทน localhostเดิม
    user: process.env.DB_USER,         // แทน user เดิม
    password: process.env.DB_PASSWORD, // แทน password เดิม
    database: process.env.DB_NAME,     // แทน database เดิม
    port: process.env.DB_PORT || 3306, // พอร์ต MySQL ปกติ
    charset: 'utf8mb4',
    dateStrings: ['DATE'],
    waitForConnections: true,
    connectionLimit: 10,
});

exports.read = (req, res) => {
    try {
        const { id } = req.params;

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
                p.Product_price,
                p.Color,
                p.Stock,
                p.Sale_date,
                p.Description,
                pp.Promotion_id,
                prom.Discount_value,
                prom.DiscountType
            FROM product p
            LEFT JOIN type t ON p.Type_id = t.Type_id
            LEFT JOIN price_range pr ON p.Price_range_id = pr.Price_range_id
            LEFT JOIN pro_product pp ON p.Product_id = pp.Product_id
            LEFT JOIN promotion prom ON prom.Promotion_id = pp.Promotion_id
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

            const product = rows[0];
            connection.query(
                'SELECT product_images_id AS id, Image FROM product_images WHERE Product_id = ? ORDER BY sort_order, product_images_id',
                [id],
                (err2, imgs) => {
                    product.gallery_images = err2 ? [] : imgs;
                    res.json(product);
                }
            );
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
        // ดึง bestseller จาก sold_total column (sync ตรงกับหน้า admin)
        const query = `
            SELECT 
                p.Product_id,
                t.Type_id,
                t.Type_name,
                p.Product_name,
                p.Product_model,
                p.Product_detail,
                p.Image,
                p.Product_price,
                p.Stock,
                p.sold_total AS total_sold
            FROM product p
            LEFT JOIN type t ON p.Type_id = t.Type_id
            WHERE p.sold_total > 0
            ORDER BY p.sold_total DESC, p.Product_id ASC
            LIMIT 4
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

exports.productColors = (req, res) => {
    try {
        const query = `
            SELECT Product_id, Product_name, Color, Image
            FROM product
            WHERE Color IS NOT NULL AND Color != ''
            ORDER BY Product_name ASC
        `;
        connection.query(query, (err, rows) => {
            if (err) return res.status(500).json({ error: err.sqlMessage });
            res.json({ data: rows });
        });
    } catch (err) {
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
                p.Product_price,
                p.Color,
                p.Stock,
                p.sold_total AS total_sold
            FROM product p
            LEFT JOIN type t ON p.Type_id = t.Type_id
            LEFT JOIN price_range pr ON p.Price_range_id = pr.Price_range_id
            WHERE p.sold_total > 0
            ORDER BY p.sold_total DESC, p.Product_id ASC
            LIMIT 8
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
