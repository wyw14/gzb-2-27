const express = require('express');
const cors = require('cors');
const { PORT } = require('./config');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const skillRoutes = require('./routes/skills');
const matchRoutes = require('./routes/matches');
const messageRoutes = require('./routes/messages');
const exchangeRoutes = require('./routes/exchanges');
const reviewRoutes = require('./routes/reviews');
const statsRoutes = require('./routes/stats');
const skillCategoryRoutes = require('./routes/skillCategories');
const skillTreeRoutes = require('./routes/skillTree');

const { notFoundHandler, errorHandler } = require('./middleware/error');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api', messageRoutes);
app.use('/api/exchanges', exchangeRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/skill-categories', skillCategoryRoutes);
app.use('/api', skillTreeRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Skill Swap Server running on http://localhost:${PORT}`);
});
