const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Authentication routes
router.post('/signup', authController.signup);
router.post('/login', authController.login);

// Company survey route (protected)
router.post('/company-survey', authMiddleware, authController.submitCompanySurvey);

module.exports = router;
