// ดึงสินค้าตาม id array
exports.getProductsByIds = async (ids) => {
    return new Promise((resolve, reject) => {
        if (!Array.isArray(ids) || ids.length === 0) return resolve([]);
        const placeholders = ids.map(() => '?').join(',');
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
                p.Color
            FROM product p
            LEFT JOIN type t ON p.Type_id = t.Type_id
            WHERE p.Product_id IN (${placeholders})
            ORDER BY FIELD(p.Product_id, ${ids.map(() => '?').join(',')})
        `;
        connection.query(query, [...ids, ...ids], (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
};
// ดึงสินค้าตามประเภท (Type_name)
exports.getProductsByType = async (typeName) => {
    return new Promise((resolve, reject) => {
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
                p.Color,
                p.Stock
            FROM product p
            LEFT JOIN type t ON p.Type_id = t.Type_id
            WHERE t.Type_name = ?
            ORDER BY p.Product_id DESC
        `;
        connection.query(query, [typeName], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
};
// ดึงข้อมูลจากตาราง promotion
exports.getPromotions = async () => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT 
                Promotion_id,
                Promotion_name,
                DiscountType,
                Discount_value,
                \`condition\`
            FROM promotion
        `;
        connection.query(query, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
};
// ดึงข้อมูลจากตาราง pro_product และเชื่อมกับ promotion
exports.getProProducts = async () => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT 
                pp.Pro_product_id,
                pp.Product_id,
                pp.Promotion_id,
                p.Promotion_name,
                p.DiscountType,
                p.Discount_value,
                p.condition,
                pp.Max_buy,
                pp.Promo_used,
                pr.Product_name,
                pr.Product_model,
                pr.Product_detail,
                pr.Image,
                pr.Product_price,
                pr.Color,
                pr.Stock
            FROM pro_product pp
            LEFT JOIN promotion p ON pp.Promotion_id = p.Promotion_id
            LEFT JOIN product pr ON pp.Product_id = pr.Product_id
            WHERE (p.Status IS NULL OR p.Status = 'Y')
              AND (pp.Max_buy = 0 OR pp.Promo_used < pp.Max_buy)
            ORDER BY pp.Promotion_id ASC, pr.Product_name ASC, pp.Product_id ASC
        `;
        connection.query(query, (err, rows) => {
            if (err) reject(err);
            else {
                // แปลง Discount_value ให้เป็น string ตัวเลข (ไม่มี %)
                const mappedRows = rows.map(row => ({
                    ...row,
                    Discount_value: row.Discount_value ? row.Discount_value.replace('%', '') : null
                }));
                resolve(mappedRows);
            }
        });
    });
};
const mysql = require('mysql2');

// ใช้ Pool แทน createConnection เพื่อ auto-reconnect เมื่อ MySQL ตัด connection
const connection = mysql.createPool({
    host: "localhost",
    user: "fah",
    password: "Fapatan11",
    database: "web_selling_cosmetics",
    dateStrings: ['DATE'], // Return DATE columns as "YYYY-MM-DD" string to avoid timezone offset
    waitForConnections: true,
    connectionLimit: 10,
});

exports.randomProducts = (req, res) => {
    const limit = parseInt(req.query.limit) || 4;
    const query = `
        SELECT 
            p.Product_id,
            t.Type_name,
            p.Product_name,
            p.Product_detail,
            p.Image,
            p.Product_price,
            p.Color
        FROM product p
        LEFT JOIN type t ON p.Type_id = t.Type_id
        ORDER BY RAND()
        LIMIT ?
    `;
    connection.query(query, [limit], (err, rows) => {
        if (err) return res.status(500).json({ error: err.sqlMessage });
        res.json(rows);
    });
};

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
                p.Product_price,
                p.Color
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

// ดึงข้อมูลสินค้า new (ชื่อ, ราคา, รูป)
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

exports.newproduct = (req, res) => {
    try {
        // Return a deterministic set of new products (ids 1,2,3,4) - ปรับตามต้องการ
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
                p.Color
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
                p.Product_price,
                p.Color,
                p.Stock,
                p.Sale_date
            FROM product p
            LEFT JOIN type t ON p.Type_id = t.Type_id
            LEFT JOIN price_range pr ON p.Price_range_id = pr.Price_range_id
            WHERE p.Image LIKE 'new_%'
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
