const mysql = require('mysql2');

// ใช้ Pool แทน createConnection เพื่อ auto-reconnect เมื่อ MySQL ตัด connection
const db = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "fah",
    password: process.env.DB_PASSWORD || "Fapatan11",
    database: process.env.DB_NAME || "web_selling_cosmetics",
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
});

module.exports = db;
