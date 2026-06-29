// ดึงสินค้าตาม id array
exports.getProductsByIds = async (ids) => {
    if (!Array.isArray(ids) || ids.length === 0) return [];
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
    const [rows] = await connection.query(query, [...ids, ...ids]);
    return rows;
};

// ดึงสินค้าตามประเภท (Type_name)
exports.getProductsByType = async (typeName) => {
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
    const [rows] = await connection.query(query, [typeName]);
    return rows;
};

// ดึงข้อมูลจากตาราง promotion
exports.getPromotions = async () => {
    const query = `
        SELECT 
            Promotion_id,
            Promotion_name,
            DiscountType,
            Discount_value,
            \`condition\`
        FROM promotion
    `;
    const [rows] = await connection.query(query);
    return rows;
};

// ดึงข้อมูลจากตาราง pro_product และเชื่อมกับ promotion
exports.getProProducts = async () => {
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
    const [rows] = await connection.query(query);
    return rows.map(row => ({
        ...row,
        Discount_value: row.Discount_value ? row.Discount_value.replace('%', '') : null
    }));
};
const mysql = require('mysql2/promise');

// ใช้ Pool แทน createConnection เพื่อ auto-reconnect เมื่อ MySQL ตัด connection
const connection = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    dateStrings: ['DATE'],
    waitForConnections: true,
    connectionLimit: 10,
});

exports.randomProducts = async (req, res) => {
    try {
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
        const [rows] = await connection.query(query, [limit]);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.sqlMessage || err.message });
    }
};

exports.read = async (req, res) => {
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
        const [rows] = await connection.query(query, [id]);
        if (rows.length === 0) {
            return res.status(404).json({ msg: 'ไม่พบสินค้า' });
        }
        res.json(rows[0]);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
};

// ดึงข้อมูลสินค้า new (ชื่อ, ราคา, รูป)
exports.getBetterThanContour = async (req, res) => {
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
        const [rows] = await connection.query(query);
        if (rows.length === 0) {
            return res.status(404).json({ msg: 'ไม่พบสินค้า' });
        }
        res.json(rows[0]);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
};

exports.newproduct = async (req, res) => {
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
        const [rows] = await connection.query(query);

        if (rows.length === 0) {
            return res.status(404).json({ msg: 'ไม่พบสินค้า' });
        }
        res.json({ count: rows.length, data: rows });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
};

exports.list = async (req, res) => {
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
        const [rows] = await connection.query(query);
        res.json({
            count: rows.length,
            data: rows
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
};
