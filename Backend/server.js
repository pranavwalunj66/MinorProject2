const express = require('express');
const cors = require('cors');
const config = require('./config/config');
const connectDB = require('./config/db');

// Import routes
const authRoutes = require('./routes/authRoutes');
const classRoutes = require('./routes/classRoutes');
const quizRoutes = require('./routes/quizRoutes');
const attemptRoutes = require('./routes/attemptRoutes');
const questionBankRoutes = require('./routes/questionBankRoutes');
const selfPracticeRoutes = require('./routes/selfPracticeRoutes');
const leaderboardRoutes = require('./routes/leaderboardRoutes');

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: config.CORS_ORIGIN,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/attempts', attemptRoutes);
app.use('/api/question-banks', questionBankRoutes);
app.use('/api/self-practice', selfPracticeRoutes);
app.use('/api/leaderboards', leaderboardRoutes);

// Default route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the QuizCraze API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: config.NODE_ENV === 'production' ? null : err.stack,
  });
});

// Start server
const PORT = config.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${config.NODE_ENV} mode on port ${PORT}`);
}); 