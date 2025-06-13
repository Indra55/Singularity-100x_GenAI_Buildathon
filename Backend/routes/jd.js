const express = require('express');
const router = express.Router();
const { generateJobDescription } = require('../controllers/jdController');


/**
 * @route   POST /api/jd/generate
 * @desc    Generate a job description
 * @access  Private
 */
router.post('/generate_jd', generateJobDescription);

module.exports = router;
