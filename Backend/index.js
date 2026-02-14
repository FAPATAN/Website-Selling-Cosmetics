const express = require("express");
const mysql = require('mysql2');
const nodemailer = require("nodemailer");
const cors = require("cors");
const path = require('path');
const app = express();
const port = 5000;
require("dotenv").config();

const tempStorage = require('./utils/tempStorage');
const bestRouter = require('./Bestseller/bestrouter');
const typeRouter = require('./Type/Typerouter');

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

app.use(cors());
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ limit: "25mb" }));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

// 📁 Serve static files (images, etc.)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 🔍 Debug middleware
app.use((req, res, next) => {
  console.log(`📍 ${req.method} ${req.path}`);
  next();
});

// MySQL Connection Setup
const connection = mysql.createConnection({
    host: "localhost",
    user: "fah",
    password: "Fapatan11",
    database: "web_selling_cosmetics"
});

connection.connect((err) => {
    if(err) {
        console.error("Error connecting to MySQL", err);
        return;
    }
    console.log("✅ connected to MySQL Successfully!")
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

    const query = "INSERT INTO member(Username, Password, Name, Surname, Email, Phone, Address, Member_role, Status) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)";
    connection.query(query, [Username, Password, Name, Surname, Email, Phone, Address, Member_role, Status], (err, results) => {
        if (err) {
            console.error("Error inserting data: ", err);
            return res.status(500).json({error: "Internal Server Error"});
        }
        res.json({
            msg: "Data inserted successfully",
            insertedID: results.insertID
        })
    })
});

// 2. 🔑 LOGIN Endpoint
app.post('/api/login', (req, res) => {
    const { Email, Password } = req.body; 

    const query = "SELECT Username, Password, Member_role FROM member WHERE Email = ?";
    
    connection.query(query, [Email], (err, results) => {
        if (err) {
            console.error("Login Query Error: ", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }

        if (results.length === 0) {
            return res.status(401).json({ message: "Invalid email or password." });
        }

        const user = results[0];

        if (Password === user.Password) {
            res.json({
                message: "Login successful",
                username: user.Username,
                userRole: user.Member_role
            });
        } else {
            return res.status(401).json({ message: "Invalid email or password." });
        }
    });
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
app.get('/api/members', (req, res) => {
    const query = "SELECT Email, Username FROM member";
    
    connection.query(query, (err, results) => {
        if (err) {
            console.error("Query Error: ", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }

        res.json({
            count: results.length,
            members: results
        });
    });
});

// 7. 🛍️ BEST SELLER Routes
app.use('/api', bestRouter);
app.use('/api', typeRouter);

// Start Server
app.listen(port, () => {
    console.log(`🚀 Server is running on port: ${port}`);
});
