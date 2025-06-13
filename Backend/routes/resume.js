const express = require('express');
const router = express.Router();
const resumeController = require('../controllers/resumeController');
const { uploadMiddleware } = require('../middleware/uploadMiddleware');

// Parse single resume
router.post('/parse', uploadMiddleware.single('resume'), resumeController.parseSingleResume);

// Parse multiple resumes (ZIP file)
router.post('/parse-batch', uploadMiddleware.single('zipFile'), resumeController.parseMultipleResumes);

// Parse resumes from local folder
router.post('/parse-folder', resumeController.parseFolderResumes);

// Parse multiple individual files
router.post('/parse-multiple', uploadMiddleware.array('resumes', 50), resumeController.parseMultipleFiles);

module.exports = router;