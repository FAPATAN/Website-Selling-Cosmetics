const express = require('express');
const Quote = require('inspirational-quotes');

const app = express();

app.get('/', (req, res) => {
    res.send(Quote.getQuote());
})

app.listen(3000, () => {
    console.log('Server started successfully!')
})