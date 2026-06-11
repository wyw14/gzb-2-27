const express = require('express');
const { readJson, writeJson } = require('../utils/storage');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.put('/skill-tree', authMiddleware, (req, res) => {
  const users = readJson('users.json');
  const userIndex = users.findIndex(u => u.id === req.user.id);
  if (userIndex === -1) {
    return res.status(404).json({ error: '用户不存在' });
  }

  users[userIndex].skillTree = req.body.skillTree || [];
  writeJson('users.json', users);
  res.json({ skillTree: users[userIndex].skillTree });
});

module.exports = router;
