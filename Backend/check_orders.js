const db = require('./db');
db.query('SELECT Status, COUNT(*) cnt, SUM(Proprice) total FROM `order` GROUP BY Status')
  .then(([r])=>{ console.log(JSON.stringify(r,null,2)); process.exit(0); })
  .catch(e=>{ console.error(e.message); process.exit(1); });
