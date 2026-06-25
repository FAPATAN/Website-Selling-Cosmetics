const mysql = require('mysql2');

// ใช้ Pool แทน createConnection เพื่อ auto-reconnect เมื่อ MySQL ตัด connection
const db = mysql.createPool({
    host: "localhost",
    user: "fah",
    password: "Fapatan11",
    database: "web_selling_cosmetics",
    waitForConnections: true,
    connectionLimit: 10,
});

module.exports = db;
