const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
app.use(cors());
app.use(express.json());

const connection = mysql.createConnection({
    host: "localhost",
    user: "fah",
    password: "Fapatan11",
    database: "web_selling_cosmetics"
});

connection.connect((err) => {
    if (err) throw err;
    console.log('MySQL connected!');
});

app.get('/api/categories', (req, res) => {
    connection.query('SELECT * FROM type', (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

app.get('/api/bestseller', (req, res) => {
    connection.query(`
        SELECT 
            p.Product_id,
            p.Product_name,
            p.Product_detail,
            p.Image,
            p.Product_price
        FROM product p
        LIMIT 1
    `, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: err.message });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'No product found' });
        }
        res.json(results[0]);
    });
});

app.listen(5000, () => {
    console.log('Server running on port 5000');
});
