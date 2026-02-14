const express = require('express');
const cors = require('cors');
const Quote = require('inspirational-quotes');

const app = express();

// CORS + JSON
app.use(cors());
app.use(express.json());

// เปิดให้เข้าถึงรูป
app.use('/images', express.static('public/images'));

// ROUTES
const typeRoute = require('./Typerouter');
app.use('/api', typeRoute);

// Home Test
app.get('/', (req, res) => {
    res.send(Quote.getQuote());
});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});
