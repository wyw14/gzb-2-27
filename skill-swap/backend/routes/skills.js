const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { readJson, writeJson } = require('../utils/storage');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/', authMiddleware, (req, res) => {
  const skills = readJson('skills.json');
  const { category, type, userId } = req.query;
  let filtered = skills;

  if (category) {
    filtered = filtered.filter(s => s.category === category);
  }
  if (type) {
    filtered = filtered.filter(s => s.type === type);
  }
  if (userId) {
    filtered = filtered.filter(s => s.userId === userId);
  }

  res.json(filtered);
});

router.post('/', authMiddleware, (req, res) => {
  const { name, category, type } = req.body;

  if (!name || !category || !type) {
    return res.status(400).json({ error: '请填写技能名称、类别和类型' });
  }
  if (!['teach', 'learn'].includes(type)) {
    return res.status(400).json({ error: '技能类型无效，应为"可教"或"想学"' });
  }

  const skills = readJson('skills.json');
  const newSkill = {
    id: uuidv4(),
    userId: req.user.id,
    ...req.body,
    createdAt: new Date().toISOString()
  };
  skills.push(newSkill);
  writeJson('skills.json', skills);
  res.json(newSkill);
});

router.put('/:id', authMiddleware, (req, res) => {
  const skills = readJson('skills.json');
  const skillIndex = skills.findIndex(s => s.id === req.params.id);
  if (skillIndex === -1) {
    return res.status(404).json({ error: '技能不存在' });
  }
  if (skills[skillIndex].userId !== req.user.id) {
    return res.status(403).json({ error: '无权限修改' });
  }

  skills[skillIndex] = { ...skills[skillIndex], ...req.body };
  writeJson('skills.json', skills);
  res.json(skills[skillIndex]);
});

router.delete('/:id', authMiddleware, (req, res) => {
  const skills = readJson('skills.json');
  const filtered = skills.filter(s => !(s.id === req.params.id && s.userId === req.user.id));
  writeJson('skills.json', filtered);
  res.json({ success: true });
});

module.exports = router;
