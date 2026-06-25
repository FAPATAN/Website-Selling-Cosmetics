const mysql = require('mysql2');
const conn = mysql.createPool({host:'localhost',user:'fah',password:'Fapatan11',database:'web_selling_cosmetics'});
conn.query("SELECT Product_id, Product_name, Image, Color FROM product WHERE Product_name LIKE '%glaze%' OR Product_name LIKE '%Glaze%'", (err,rows) => {
  console.log('glaze products:', JSON.stringify(rows,null,2));
  conn.end();
});
