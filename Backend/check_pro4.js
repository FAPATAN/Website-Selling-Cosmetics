const mysql = require('mysql2');
const db = mysql.createConnection({ host:'localhost', user:'fah', password:'Fapatan11', database:'web_selling_cosmetics' });
db.query('SELECT p.Product_id, p.Product_name, p.Image, p.Color FROM product p JOIN pro_product pp ON p.Product_id=pp.Product_id WHERE p.Image LIKE "pro_4%"', (err, rows) => {
  rows.forEach(r => console.log(r.Product_id, r.Image, r.Color, r.Product_name));
  db.end();
});
