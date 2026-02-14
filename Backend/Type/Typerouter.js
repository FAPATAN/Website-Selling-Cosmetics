const express = require('express');
const router = express.Router();

const { getCategories } = require('./Typecontroller');

// /api/categories
router.get('/categories', getCategories);

module.exports = router;
