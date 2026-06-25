const express = require('express');
const Quote = require('inspirational-quotes');

const app = express();

const bestRouter = require('./Bestseller/bestrouter');
app.use(bestRouter);

app.get('/', (req, res) => {
    res.send(Quote.getQuote());
})

app.listen(3000, () => {
    console.log('Server started successfully!')
})