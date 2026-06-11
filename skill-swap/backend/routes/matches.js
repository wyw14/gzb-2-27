const express = require('express');
const { readJson } = require('../utils/storage');
const { findMatchesForUser } = require('../utils/matching');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/', authMiddleware, (req, res) => {
  const users = readJson('users.json');
  const skills = readJson('skills.json');
  const { minScore, category } = req.query;

  let matches = findMatchesForUser(req.user.id, users, skills);

  if (minScore) {
    matches = matches.filter(m => m.score >= parseInt(minScore));
  }
  if (category) {
    matches = matches.filter(m =>
      m.matchedSkills.iCanTeach.some(s => s.includes(category)) ||
      m.matchedSkills.iCanLearn.some(s => s.includes(category))
    );
  }

  res.json(matches);
});

module.exports = router;
