const express = require("express");
const mysql = require('mysql2/promise');
const nodemailer = require("nodemailer");
const cors = require("cors");
const path = require('path');
const app = express();
const port = 5000;
require("dotenv").config();

// ─── Global error handlers — ป้องกัน backend crash จาก unhandled errors ────
process.on('uncaughtException', (err) => {
  console.error('💥 Uncaught Exception (kept alive):', err.message);
  console.error(err.stack);
});
process.on('unhandledRejection', (reason) => {
  console.error('💥 Unhandled Rejection (kept alive):', reason);
});

const tempStorage = require('./utils/tempStorage');
const bestRouter = require('./Bestseller/bestrouter');
const typeRouter = require('./Type/Typerouter');
const newRouter = require('./New/Newrouter');
const faceRouter = require('./New/Facerouter');
const eyeRouter = require('./New/Eyerouter');
const lipRouter = require('./New/Liprouter');
const cheekRouter = require('./New/Cheekrouter');
const promotionRouter = require('./New/Promotionrouter');
const cartItemRouter = require('./New/cartitemrouter');
const orderRouter    = require('./New/orderrouter');
const adminRouter    = require('./Admin/adminrouter');
const reviewRouter   = require('./New/reviewrouter');

console.log("🔧 DEBUG ENV:", { 
  EMAIL: process.env.EMAIL, 
  PASSWORD: process.env.PASSWORD ? "***" : "MISSING" 
});
console.log("✅ bestRouter loaded:", typeof bestRouter);

// ✉️ Create Nodemailer Transporter (reusable)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Must be BEFORE cors() so the header is present on preflight responses
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Private-Network', 'true');
  next();
});
app.use(cors({
  origin: '*',
  allowedHeaders: ['Content-Type', 'Authorization', 'x-member-id'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
}));
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ limit: "25mb", extended: false }));

// 📁 Serve static files (images, etc.)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads/slips', express.static(path.join(__dirname, 'uploads', 'slips')));
app.use('/uploads/products', express.static(path.join(__dirname, 'uploads', 'products')));

// 🔍 Debug middleware
app.use((req, res, next) => {
  console.log(`📍 ${req.method} ${req.path}`);
  next();
});

// MySQL Connection Setup — ใช้ Pool แทน createConnection เพื่อ auto-reconnect
const connection = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    charset: 'utf8mb4',
    dateStrings: ['DATE'],
    waitForConnections: true,
    connectionLimit: 10,
});

// auto-add TrackingNo column if not exists
connection.query("ALTER TABLE `order` ADD COLUMN `TrackingNo` VARCHAR(100) DEFAULT NULL")
  .then(() => {
    console.log("✅ connected to MySQL Successfully!");
  })
  .catch((e) => {
    if (e && e.code !== 'ER_DUP_FIELDNAME') {
      console.error("TrackingNo column:", e.message);
    } else {
      console.log("✅ connected to MySQL Successfully!");
    }
  });

// ✉️ Send Email Function
function sendEmail({ recipient_email, OTP }) {
  return new Promise((resolve, reject) => {
    const mail_configs = {
      from: `Cosmetics Shop <${process.env.EMAIL}>`,
      to: recipient_email,
      subject: "Password Recovery OTP",
      html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Password Recovery OTP</title>
</head>
<body>
<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
  <div style="margin:50px auto;width:70%;padding:20px 0">
    <div style="border-bottom:1px solid #eee">
      <a href="" style="font-size:1.4em;color: #667eea;text-decoration:none;font-weight:600">Cosmetics Shop</a>
    </div>
    <p style="font-size:1.1em">Hi,</p>
    <p>Thank you for using our service. Use the following OTP to complete your Password Recovery. OTP is valid for 5 minutes</p>
    <h2 style="background: #667eea;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${OTP}</h2>
    <p style="font-size:0.9em;">Regards,<br />Cosmetics Shop Team</p>
    <hr style="border:none;border-top:1px solid #eee" />
    <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
      <p>Cosmetics Shop Inc</p>
      <p>Bangkok, Thailand</p>
    </div>
  </div>
</div>
</body>
</html>`,
    };
    transporter.sendMail(mail_configs, function (error, info) {
      if (error) {
        console.log("Email Error:", error);
        return reject({ message: `An error has occured` });
      }
      return resolve({ message: "Email sent successfully" });
    });
  });
}

// --- API ENDPOINTS ---

// 1. 📝 REGISTER Endpoint
app.post('/api/insert', (req, res) => {
    const {Username, Password, Name, Surname, Email, Phone, Address, Member_role, Status} = req.body;

    // เช็ค email ซ้ำก่อน insert
    connection.query('SELECT MemberID FROM member WHERE Email = ?', [Email], (checkErr, checkRows) => {
        if (checkErr) {
            console.error("Check email error: ", checkErr);
            return res.status(500).json({error: "Internal Server Error"});
        }
        if (checkRows.length > 0) {
            return res.status(400).json({error: "อีเมลนี้ถูกใช้งานแล้ว กรุณาใช้อีเมลอื่น"});
        }
        const query = "INSERT INTO member(Username, Password, Name, Surname, Email, Phone, Address, Member_role, Status) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)";
        connection.query(query, [Username, Password, Name, Surname, Email, Phone, Address, Member_role, Status], (err, results) => {
            if (err) {
                console.error("Error inserting data: ", err);
                return res.status(500).json({error: "Internal Server Error"});
            }
            res.json({
                msg: "Data inserted successfully",
                insertedID: results.insertId
            })
        })
    });
});

// 2. 🔑 LOGIN Endpoint
app.post('/api/login', async (req, res) => {
    try {
        const { Email, Password } = req.body;

        const query = "SELECT MemberID AS Member_id, Username, Password, Member_role FROM member WHERE Email = ? ORDER BY MemberID DESC LIMIT 1";
        const [results] = await connection.query(query, [Email]);

        if (results.length === 0) {
            return res.status(401).json({ message: "Invalid email or password." });
        }

        const user = results[0];

        if (Password === user.Password) {
            return res.json({
                message: "Login successful",
                username: user.Username,
                userRole: user.Member_role,
                Member_id: user.Member_id
            });
        }

        return res.status(401).json({ message: "Invalid email or password." });
    } catch (err) {
        console.error("Login Query Error: ", err);
        return res.status(500).json({ error: "Internal Server Error", details: err.message });
    }
});

// 3. ✅ CHECK EMAIL & SEND OTP Endpoint
app.post('/api/check-email', (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: "Email is required" });
    }

    const query = "SELECT Email FROM member WHERE Email = ?";
    
    connection.query(query, [email], (err, results) => {
        if (err) {
            console.error("Check Email Query Error: ", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: "Email not found in system" });
        }

        // สร้าง OTP 6 หลัก
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        tempStorage.set(email, otp, 1000 * 60 * 5); // 5 minutes

        // ส่งเมล
        sendEmail({ recipient_email: email, OTP: otp })
            .then(response => {
                console.log('✅ OTP sent to:', email);
                res.json({
                    message: "OTP sent to your email",
                    email: email
                });
            })
            .catch(error => {
                console.error("Email Send Error: ", error);
                return res.status(500).json({ error: "Failed to send OTP email" });
            });
    });
});

// 4. 🔐 VERIFY OTP Endpoint
app.post('/api/verify-otp', (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({ error: "Email and OTP are required" });
    }

    // ตรวจสอบ OTP โดยใช้ tempStorage
    if (tempStorage.verify(email, otp)) {
        tempStorage.delete(email);
        res.json({
            message: "OTP verified successfully",
            email: email
        });
    } else {
        res.status(401).json({ error: "Invalid or expired OTP" });
    }
});

// 5. 🔄 RESET PASSWORD Endpoint
app.post('/api/reset-password', (req, res) => {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
        return res.status(400).json({ error: "Email and new password are required" });
    }

    const query = "UPDATE member SET Password = ? WHERE Email = ?";
    
    connection.query(query, [newPassword, email], (err, results) => {
        if (err) {
            console.error("Reset Password Query Error: ", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ error: "Email not found" });
        }

        res.json({
            message: "Password reset successfully",
            email: email
        });
    });
});

// 6. 📋 GET ALL MEMBERS (สำหรับ debug)

// 6.1 👤 GET MEMBER PROFILE BY EMAIL
app.get('/api/member', (req, res) => {
    const { email, id } = req.query;
    if (!email && !id) {
        return res.status(400).json({ error: "Email or Member ID is required" });
    }

    const query = id
        ? "SELECT Name, Surname, Email, Phone, Address, Username FROM member WHERE MemberID = ?"
        : "SELECT Name, Surname, Email, Phone, Address, Username FROM member WHERE Email = ?";
    const params = id ? [id] : [email];

    connection.query(query, params, (err, results) => {
        if (err) {
            console.error("Query Error: ", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: "Member not found" });
        }
        res.json(results[0]);
    });
});

// 6.2 ✏️ UPDATE MEMBER PROFILE
app.post('/api/update-member', (req, res) => {
    const { email, name, surname, contact, username, address } = req.body;
    if (!email) {
        return res.status(400).json({ error: "Email is required" });
    }
    const query = `UPDATE member SET Name=?, Surname=?, Phone=?, Username=?, Address=? WHERE Email=?`;
    connection.query(query, [name, surname, contact, username, address, email], (err, results) => {
        if (err) {
            console.error("Update Member Query Error: ", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: "Member not found" });
        }
        res.json({ message: "Profile updated successfully" });
    });
});

// 6.3 🔑 CHANGE PASSWORD
app.post('/api/change-password', (req, res) => {
    const { email, currentPassword, newPassword } = req.body;
    if (!email || !currentPassword || !newPassword) {
        return res.status(400).json({ error: "Email, current password, and new password are required" });
    }
    // ตรวจสอบ current password
    const selectQuery = "SELECT Password FROM member WHERE Email = ?";
    connection.query(selectQuery, [email], (err, results) => {
        if (err) {
            console.error("Change Password Query Error: ", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: "Member not found" });
        }
        if (results[0].Password !== currentPassword) {
            return res.status(401).json({ error: "Current password is incorrect" });
        }
        // อัปเดตรหัสผ่านใหม่
        const updateQuery = "UPDATE member SET Password = ? WHERE Email = ?";
        connection.query(updateQuery, [newPassword, email], (err2, results2) => {
            if (err2) {
                console.error("Update Password Error: ", err2);
                return res.status(500).json({ error: "Internal Server Error" });
            }
            res.json({ message: "Password changed successfully" });
        });
    });
});


// 🔍 Product Search (must be BEFORE newRouter to avoid /products/* wildcard conflict)
app.get('/api/products/search', (req, res) => {
  const q = (req.query.q || '').trim();
  if (!q) return res.json([]);
  const like = `%${q}%`;
  connection.query(
    'SELECT Product_id, Product_name, Product_price, Image AS Product_image, Product_model FROM product WHERE Product_name LIKE ? OR Product_model LIKE ? LIMIT 10',
    [like, like],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    }
  );
});

// 7. 🛍️ BEST SELLER Routes
app.use('/api', bestRouter);
app.use('/api', typeRouter);
app.use('/api', newRouter);
app.use('/api', faceRouter);
app.use('/api/eye', eyeRouter);
app.use('/api/lip', lipRouter);
app.use('/api/cheek', cheekRouter);
app.use('/api/promotion', promotionRouter);
app.use('/api/cart', cartItemRouter);
app.use('/api/orders', orderRouter);
app.use('/api/admin', adminRouter);
app.use('/api/reviews', reviewRouter);

// Global error middleware (prevent crashes from unhandled route errors)
app.use((err, req, res, next) => {
    console.error("❌ Unhandled route error:", err.message, err.stack);
    if (!res.headersSent) res.status(500).json({ error: err.message || "Internal Server Error" });
});

// ── Auto-cancel orders ที่เกิน 24 ชั่วโมง (รันทุกครั้งที่ backend start) ──────
const dbPool = require('./db');
async function autoCancelExpiredOrders() {
  try {
    const [expired] = await dbPool.query(
      `SELECT Order_id FROM \`order\`
       WHERE Status = 'O' AND Order_date <= NOW() - INTERVAL 24 HOUR`
    );
    if (!expired.length) {
      console.log('✅ Auto-cancel: ไม่มี order ที่หมดเวลา');
      return;
    }
    console.log(`🔄 Auto-cancel: พบ ${expired.length} order(s) ที่หมดเวลา`);
    for (const { Order_id } of expired) {
      const conn = await dbPool.getConnection();
      try {
        await conn.beginTransaction();
        const [details] = await conn.query(
          `SELECT Product_id, Quantity, Product_price FROM order_detail WHERE Order_id = ?`,
          [Order_id]
        );
        for (const item of details) {
          if (!item.Product_id) continue;
          await conn.query(
            'UPDATE product SET Stock = Stock + ? WHERE Product_id = ?',
            [item.Quantity, item.Product_id]
          );
          if (parseFloat(item.Product_price) > 0) {
            await conn.query(
              `UPDATE pro_product pp
               JOIN promotion pr ON pp.Promotion_id = pr.Promotion_id
               SET pp.Promo_used = GREATEST(0, pp.Promo_used - ?)
               WHERE pp.Product_id = ? AND pr.DiscountType = 'buy 1 get 1' AND pr.Status = 'Y'`,
              [item.Quantity, item.Product_id]
            );
          }
        }
        await conn.query(`UPDATE \`order\` SET Status = 'Ca' WHERE Order_id = ?`, [Order_id]);
        await conn.commit();
        console.log(`  ✅ Order #${Order_id} ถูก cancel แล้ว`);
      } catch (err) {
        await conn.rollback();
        console.error(`  ❌ Order #${Order_id} cancel ไม่สำเร็จ:`, err.message);
      } finally {
        conn.release();
      }
    }
  } catch (err) {
    console.error('❌ Auto-cancel startup error:', err.message);
  }
}

// Start Server
app.listen(port, () => {
    console.log(`🚀 Server is running on port: ${port}`);
    autoCancelExpiredOrders();
});
