const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { readJson, writeJson } = require('../utils/storage');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/conversations', authMiddleware, (req, res) => {
  const messages = readJson('messages.json');
  const users = readJson('users.json');
  const myId = req.user.id;

  const userMessages = {};
  messages.forEach(m => {
    const otherId = m.senderId === myId ? m.receiverId : m.senderId;
    if (m.senderId === myId || m.receiverId === myId) {
      if (!userMessages[otherId]) {
        userMessages[otherId] = [];
      }
      userMessages[otherId].push(m);
    }
  });

  const conversations = Object.entries(userMessages).map(([userId, msgs]) => {
    const user = users.find(u => u.id === userId);
    const lastMsg = msgs[msgs.length - 1];
    const unreadCount = msgs.filter(m => m.receiverId === myId && !m.read).length;
    return {
      userId,
      username: user?.username || '未知用户',
      avatar: user?.avatar,
      lastMessage: lastMsg.content,
      lastMessageTime: lastMsg.createdAt,
      unreadCount
    };
  }).sort((a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime));

  res.json(conversations);
});

router.get('/messages/:userId', authMiddleware, (req, res) => {
  const messages = readJson('messages.json');
  const { userId } = req.params;
  const myId = req.user.id;

  const conversation = messages.filter(m =>
    (m.senderId === myId && m.receiverId === userId) ||
    (m.senderId === userId && m.receiverId === myId)
  ).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  conversation.forEach(m => {
    if (m.receiverId === myId && !m.read) {
      m.read = true;
    }
  });
  writeJson('messages.json', messages);

  res.json(conversation);
});

router.post('/messages', authMiddleware, (req, res) => {
  const { receiverId, content } = req.body;

  if (!receiverId || !content) {
    return res.status(400).json({ error: '请指定接收者和消息内容' });
  }
  if (receiverId === req.user.id) {
    return res.status(400).json({ error: '不能给自己发送消息' });
  }

  const messages = readJson('messages.json');
  const newMessage = {
    id: uuidv4(),
    senderId: req.user.id,
    receiverId: req.body.receiverId,
    content: req.body.content,
    read: false,
    createdAt: new Date().toISOString()
  };
  messages.push(newMessage);
  writeJson('messages.json', messages);
  res.json(newMessage);
});

module.exports = router;
