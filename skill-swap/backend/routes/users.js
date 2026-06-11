const express = require('express');
const { readJson, writeJson } = require('../utils/storage');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.put('/profile', authMiddleware, (req, res) => {
  const users = readJson('users.json');
  const userIndex = users.findIndex(u => u.id === req.user.id);
  if (userIndex === -1) {
    return res.status(404).json({ error: '用户不存在' });
  }

  users[userIndex] = { ...users[userIndex], ...req.body, id: req.user.id };
  writeJson('users.json', users);
  const { password: _, ...userWithoutPassword } = users[userIndex];
  res.json(userWithoutPassword);
});

router.get('/', authMiddleware, (req, res) => {
  const users = readJson('users.json');
  const { minRating, city, skill } = req.query;
  let filtered = users.map(u => {
    const { password: _, ...userWithoutPassword } = u;
    return userWithoutPassword;
  });

  if (minRating) {
    filtered = filtered.filter(u => u.rating >= parseFloat(minRating));
  }
  if (city) {
    filtered = filtered.filter(u =>
      u.preferences?.location?.city?.includes(city)
    );
  }
  if (skill) {
    const skills = readJson('skills.json');
    const userIdsWithSkill = skills
      .filter(s => s.name.includes(skill))
      .map(s => s.userId);
    filtered = filtered.filter(u => userIdsWithSkill.includes(u.id));
  }

  res.json(filtered);
});

router.get('/:userId', (req, res) => {
  const users = readJson('users.json');
  const skills = readJson('skills.json');
  const user = users.find(u => u.id === req.params.userId);
  if (!user) {
    return res.status(404).json({ error: '用户不存在' });
  }

  const { password: _, ...userWithoutPassword } = user;
  const userSkills = skills.filter(s => s.userId === req.params.userId);
  res.json({
    ...userWithoutPassword,
    skills: userSkills
  });
});

module.exports = router;
