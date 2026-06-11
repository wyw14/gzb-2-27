const express = require('express');
const { readJson } = require('../utils/storage');

const router = express.Router();

router.get('/popular-skills', (req, res) => {
  const skills = readJson('skills.json');
  const skillCount = {};

  skills.forEach(s => {
    if (!skillCount[s.name]) {
      skillCount[s.name] = { teach: 0, learn: 0 };
    }
    skillCount[s.name][s.type]++;
  });

  const sorted = Object.entries(skillCount)
    .map(([name, counts]) => ({
      name,
      teachCount: counts.teach,
      learnCount: counts.learn,
      total: counts.teach + counts.learn,
      demand: counts.learn - counts.teach
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 20);

  res.json(sorted);
});

router.get('/success-rate', (req, res) => {
  const exchanges = readJson('exchanges.json');
  const total = exchanges.length;
  const completed = exchanges.filter(e => e.status === 'completed').length;
  const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

  const skills = readJson('skills.json');
  const users = readJson('users.json');

  res.json({
    totalExchanges: total,
    completedExchanges: completed,
    successRate: rate,
    totalUsers: users.length,
    totalSkills: skills.length
  });
});

module.exports = router;
