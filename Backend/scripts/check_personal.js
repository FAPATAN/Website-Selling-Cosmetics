const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'fah',
  password: 'Fapatan11',
  database: 'web_selling_cosmetics'
});

connection.connect(err => {
  if (err) return console.error('MySQL connect error:', err);
  console.log('Connected — checking Personal entries...');

  connection.query("SELECT * FROM type WHERE Type_name LIKE '%Personal%';", (err1, types) => {
    if (err1) console.error('Type query error:', err1);
    else {
      console.log('\n=== Types with "Personal" ===');
      console.table(types);
    }

    connection.query("SELECT Product_id, Product_name, Image, Product_price, Type_id FROM product WHERE Image LIKE 'Personal_%';", (err2, productsByImage) => {
      if (err2) console.error('Product by image query error:', err2);
      else {
        console.log('\n=== Products with Image LIKE "Personal_%" ===');
        console.table(productsByImage);
      }

      connection.query("SELECT p.Product_id, p.Product_name, p.Image, p.Product_price, t.Type_name FROM product p LEFT JOIN type t ON p.Type_id = t.Type_id WHERE t.Type_name LIKE '%Personal%';", (err3, productsByType) => {
        if (err3) console.error('Product by type query error:', err3);
        else {
          console.log('\n=== Products with Type LIKE "Personal" ===');
          console.table(productsByType);
        }

        connection.end();
      });
    });
  });
});
