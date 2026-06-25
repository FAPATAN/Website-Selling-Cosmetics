const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: "localhost",
    user: "fah",
    password: "Fapatan11",
    database: "web_selling_cosmetics",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    timezone: '+07:00', // Thailand UTC+7 — ensures DATETIME columns are read/written correctly
    dateStrings: ['DATE'], // Return DATE columns as "YYYY-MM-DD" strings (not Date objects) to avoid timezone offset
});

module.exports = pool;
