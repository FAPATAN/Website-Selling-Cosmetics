// Test cancel route: place a new order, check stock, cancel, check stock again
const mysql = require('mysql2/promise');
const http = require('http');

function httpPost(path, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const req = http.request({
      host: 'localhost', port: 5000, path, method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) }
    }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => { try { resolve(JSON.parse(d)); } catch(e) { resolve(d); } });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function main() {
  const conn = await mysql.createConnection({host:'localhost',user:'fah',password:'Fapatan11',database:'web_selling_cosmetics'});

  // Get stock & promo BEFORE
  const [[p44]] = await conn.query('SELECT Stock FROM product WHERE Product_id=44');
  const [[pp44]] = await conn.query('SELECT Promo_used FROM pro_product WHERE Product_id=44');
  console.log('BEFORE - Stock:', p44.Stock, '| Promo_used:', pp44.Promo_used);

  // Create a test order
  const createRes = await httpPost('/api/orders/create', {
    Member_id: 48, Name: 'Test', Surname: 'Cancel', Address: 'test', Phone: '0000000000', Proprice: 891,
    items: [
      { Product_id: 44, Product_model: 'Cool Tone', Product_price: 891, Quantity: 1, Discount: 0 },
      { Product_id: 44, Product_model: 'Cool Tone', Product_price: 0, Quantity: 1, Discount: 0 }
    ]
  });
  console.log('Create result:', createRes);

  if (!createRes.Order_id) { await conn.end(); return; }
  const orderId = createRes.Order_id;

  // Check stock AFTER create
  const [[p44b]] = await conn.query('SELECT Stock FROM product WHERE Product_id=44');
  const [[pp44b]] = await conn.query('SELECT Promo_used FROM pro_product WHERE Product_id=44');
  console.log('AFTER CREATE - Stock:', p44b.Stock, '| Promo_used:', pp44b.Promo_used);

  // Cancel the order
  const cancelRes = await httpPost('/api/orders/cancel', { Order_id: orderId });
  console.log('Cancel result:', cancelRes);

  // Check stock AFTER cancel
  const [[p44c]] = await conn.query('SELECT Stock FROM product WHERE Product_id=44');
  const [[pp44c]] = await conn.query('SELECT Promo_used FROM pro_product WHERE Product_id=44');
  console.log('AFTER CANCEL - Stock:', p44c.Stock, '| Promo_used:', pp44c.Promo_used);

  await conn.end();
}
main().catch(e => console.log('ERROR:', e.message));
