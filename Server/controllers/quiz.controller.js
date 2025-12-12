const mongoose = require('mongoose');
const Quiz = require('../models/quiz.model');

// @desc    Create a new quiz
// @route   POST /api/quizzes
// @access  Private/Admin
exports.createQuiz = async (req, res) => {
  try {
    const { title, description, questions } = req.body;

    const newQuiz = new Quiz({
      title,
      description,
      createdBy: req.user.id,
      questions: questions || [],
    });

    const quiz = await newQuiz.save();
    res.status(201).json(quiz);
  } catch (error) {
    console.error('Create quiz error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all quizzes
// @route   GET /api/quizzes
// @access  Private
exports.getQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ isPublished: true })
      .select('-questions')
      .populate('createdBy', 'username');
    res.json(quizzes);
  } catch (error) {
    console.error('Get quizzes error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get quiz by ID
// @route   GET /api/quizzes/:id
// @access  Private
exports.getQuizById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid quiz id' });
    }

    const quiz = await Quiz.findById(req.params.id).populate('createdBy', 'username');
    
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // If user is not admin and quiz is not published, don't show it
    if (!quiz.isPublished && req.user.role !== 'admin' && !quiz.createdBy.equals(req.user.id)) {
      return res.status(403).json({ message: 'Not authorized to view this quiz' });
    }

    res.json(quiz);
  } catch (error) {
    console.error('Get quiz by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update a quiz
// @route   PUT /api/quizzes/:id
// @access  Private/Admin
exports.updateQuiz = async (req, res) => {
  try {
    const { title, description, questions, isPublished } = req.body;

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid quiz id' });
    }

    let quiz = await Quiz.findById(req.params.id);
    
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Check if user is the creator or admin
    if (quiz.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this quiz' });
    }

    // Update fields
    if (title) quiz.title = title;
    if (description) quiz.description = description;
    if (questions) quiz.questions = questions;
    if (typeof isPublished !== 'undefined') quiz.isPublished = isPublished;

    await quiz.save();
    res.json(quiz);
  } catch (error) {
    console.error('Update quiz error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a quiz
// @route   DELETE /api/quizzes/:id
// @access  Private/Admin
exports.deleteQuiz = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid quiz id' });
    }

    const quiz = await Quiz.findById(req.params.id);
    
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Check if user is the creator or admin
    if (quiz.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this quiz' });
    }

    await quiz.deleteOne();
    res.json({ message: 'Quiz removed' });
  } catch (error) {
    console.error('Delete quiz error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Add a question to a quiz
// @route   POST /api/quizzes/:id/questions
// @access  Private/Admin
exports.addQuestion = async (req, res) => {
  try {
    const { questionType, question, options, correctAnswer, points } = req.body;

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid quiz id' });
    }

    const quiz = await Quiz.findById(req.params.id);
    
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Check if user is the creator or admin
    if (quiz.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to modify this quiz' });
    }

    const newQuestion = {
      questionType,
      question,
      options: options || [],
      correctAnswer: correctAnswer || '',
      points: points || 1,
      order: quiz.questions.length + 1,
    };

    quiz.questions.push(newQuestion);
    await quiz.save();

    res.status(201).json(quiz.questions[quiz.questions.length - 1]);
  } catch (error) {
    console.error('Add question error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user's quizzes
// @route   GET /api/quizzes/my-quizzes
// @access  Private
exports.getMyQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ createdBy: req.user.id })
      .sort({ createdAt: -1 })
      .populate('createdBy', 'username');
    res.json(quizzes);
  } catch (error) {
    console.error('Get my quizzes error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
