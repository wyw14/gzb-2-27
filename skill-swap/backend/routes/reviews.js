const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { readJson, writeJson } = require('../utils/storage');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.post('/', authMiddleware, (req, res) => {
  const { exchangeId, targetUserId, rating, comment } = req.body;

  if (!exchangeId || !targetUserId || !rating) {
    return res.status(400).json({ error: '请填写交换ID、评价对象和评分' });
  }
  if (rating < 1 || rating > 5) {
    return res.status(400).json({ error: '评分需在1-5分之间' });
  }
  if (targetUserId === req.user.id) {
    return res.status(400).json({ error: '不能评价自己' });
  }

  const reviews = readJson('reviews.json');
  const users = readJson('users.json');

  const existingReview = reviews.find(r =>
    r.exchangeId === req.body.exchangeId && r.reviewerId === req.user.id
  );
  if (existingReview) {
    return res.status(400).json({ error: '已评价过此交换' });
  }

  const newReview = {
    id: uuidv4(),
    exchangeId: req.body.exchangeId,
    reviewerId: req.user.id,
    targetUserId: req.body.targetUserId,
    rating: req.body.rating,
    comment: req.body.comment,
    createdAt: new Date().toISOString()
  };
  reviews.push(newReview);
  writeJson('reviews.json', reviews);

  const targetIndex = users.findIndex(u => u.id === req.body.targetUserId);
  if (targetIndex !== -1) {
    const targetUser = users[targetIndex];
    const userReviews = reviews.filter(r => r.targetUserId === req.body.targetUserId);
    const avgRating = userReviews.reduce((sum, r) => sum + r.rating, 0) / userReviews.length;
    users[targetIndex].rating = Math.round(avgRating * 10) / 10;
    users[targetIndex].reviewCount = userReviews.length;
    writeJson('users.json', users);
  }

  res.json(newReview);
});

router.get('/:userId', (req, res) => {
  const reviews = readJson('reviews.json');
  const users = readJson('users.json');
  const userReviews = reviews.filter(r => r.targetUserId === req.params.userId);

  const reviewsWithUser = userReviews.map(r => {
    const reviewer = users.find(u => u.id === r.reviewerId);
    return {
      ...r,
      reviewerName: reviewer?.username || '匿名用户',
      reviewerAvatar: reviewer?.avatar
    };
  });

  res.json(reviewsWithUser);
});

module.exports = router;
