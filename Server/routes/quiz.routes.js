const express = require('express');
const router = express.Router();
const { auth, admin } = require('../middlewares/auth.middleware');
const {
  createQuiz,
  getQuizzes,
  getQuizById,
  updateQuiz,
  deleteQuiz,
  addQuestion,
  getMyQuizzes,
} = require('../controllers/quiz.controller');

// Public routes
router.get('/', getQuizzes);
router.get('/:id', auth, getQuizById);

// Protected routes (require authentication)
router.use(auth);

// User-specific routes
router.get('/my-quizzes', getMyQuizzes);

// Admin routes (require admin role)
router.post('/', admin, createQuiz);
router.put('/:id', updateQuiz);
router.delete('/:id', deleteQuiz);
router.post('/:id/questions', addQuestion);

module.exports = router;
