const express = require('express');
const { readJson } = require('../utils/storage');

const router = express.Router();

router.get('/', (req, res) => {
  const categories = readJson('skillCategories.json');
  res.json(categories);
});

module.exports = router;
