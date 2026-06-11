const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { readJson, writeJson } = require('../utils/storage');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/', authMiddleware, (req, res) => {
  const exchanges = readJson('exchanges.json');
  const myExchanges = exchanges.filter(e =>
    e.initiatorId === req.user.id || e.partnerId === req.user.id
  );
  res.json(myExchanges);
});

router.post('/', authMiddleware, (req, res) => {
  const { partnerId, skills } = req.body;

  if (!partnerId || !skills) {
    return res.status(400).json({ error: '请指定交换对象和交换技能' });
  }
  if (partnerId === req.user.id) {
    return res.status(400).json({ error: '不能和自己发起交换' });
  }

  const exchanges = readJson('exchanges.json');
  const newExchange = {
    id: uuidv4(),
    initiatorId: req.user.id,
    partnerId: req.body.partnerId,
    skills: req.body.skills,
    status: 'pending',
    createdAt: new Date().toISOString(),
    confirmedBy: []
  };
  exchanges.push(newExchange);
  writeJson('exchanges.json', exchanges);
  res.json(newExchange);
});

router.put('/:id/confirm', authMiddleware, (req, res) => {
  const exchanges = readJson('exchanges.json');
  const index = exchanges.findIndex(e => e.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: '交换不存在' });
  }

  const exchange = exchanges[index];
  if (!exchange.confirmedBy.includes(req.user.id)) {
    exchange.confirmedBy.push(req.user.id);
  }

  if (exchange.confirmedBy.length >= 2) {
    exchange.status = 'completed';
    exchange.completedAt = new Date().toISOString();

    const users = readJson('users.json');
    [exchange.initiatorId, exchange.partnerId].forEach(userId => {
      const userIndex = users.findIndex(u => u.id === userId);
      if (userIndex !== -1) {
        users[userIndex].exchangeCount = (users[userIndex].exchangeCount || 0) + 1;
        users[userIndex].skillPoints = (users[userIndex].skillPoints || 0) + 50;
      }
    });
    writeJson('users.json', users);
  }

  exchanges[index] = exchange;
  writeJson('exchanges.json', exchanges);
  res.json(exchange);
});

module.exports = router;
