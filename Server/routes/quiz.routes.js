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

// Protected routes (require authentication)
// NOTE: Keep specific routes BEFORE '/:id' to avoid treating them as ids.
router.get('/my-quizzes', auth, getMyQuizzes);
router.get('/:id', auth, getQuizById);

// Admin routes (require admin role)
router.post('/', auth, admin, createQuiz);
router.put('/:id', auth, updateQuiz);
router.delete('/:id', auth, deleteQuiz);
router.post('/:id/questions', auth, addQuestion);

module.exports = router;
