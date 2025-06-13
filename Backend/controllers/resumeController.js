const resumeService = require('../services/resumeService');
const fileService = require('../services/fileService');

class ResumeController {
  async parseSingleResume(req, res, next) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const filePath = req.file.path;
      const fileType = req.file.mimetype;

      // Extract text from file
      const extractedText = await fileService.extractTextFromFile(filePath, fileType);
      
      // Parse resume using Gemini AI
      const parsedData = await resumeService.parseResumeText(extractedText);

      // Clean up uploaded file
      await fileService.deleteFile(filePath);

      res.json({
        success: true,
        data: parsedData,
        originalFileName: req.file.originalname
      });

    } catch (error) {
      next(error);
    }
  }

  async parseMultipleResumes(req, res, next) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No ZIP file uploaded' });
      }

      const zipFilePath = req.file.path;
      
      // Extract files from ZIP
      const extractedFiles = await fileService.extractZipFile(zipFilePath);
      
      const results = [];
      
      for (const file of extractedFiles) {
        try {
          // Extract text from each file
          const extractedText = await fileService.extractTextFromFile(file.path, file.type);
          
          // Parse resume using Gemini AI
          const parsedData = await resumeService.parseResumeText(extractedText);
          
          results.push({
            fileName: file.name,
            success: true,
            data: parsedData
          });
          
          // Clean up extracted file
          await fileService.deleteFile(file.path);
          
        } catch (error) {
          results.push({
            fileName: file.name,
            success: false,
            error: error.message
          });
        }
      }

      // Clean up ZIP file
      await fileService.deleteFile(zipFilePath);

      res.json({
        success: true,
        totalFiles: extractedFiles.length,
        results: results
      });

    } catch (error) {
      next(error);
    }
  }

  async parseFolderResumes(req, res, next) {
    try {
      const { folderPath } = req.body;
      
      if (!folderPath) {
        return res.status(400).json({ error: 'folderPath is required in request body' });
      }

      // Get all resume files from folder
      const files = await fileService.getFilesFromFolder(folderPath);
      
      if (files.length === 0) {
        return res.status(404).json({ error: 'No supported resume files found in folder' });
      }

      const results = [];
      
      for (const file of files) {
        try {
          // Extract text from each file
          const extractedText = await fileService.extractTextFromFile(file.path, file.type);
          
          // Parse resume using Gemini AI
          const parsedData = await resumeService.parseResumeText(extractedText);
          
          results.push({
            fileName: file.name,
            success: true,
            data: parsedData
          });
          
        } catch (error) {
          results.push({
            fileName: file.name,
            success: false,
            error: error.message
          });
        }
      }

      res.json({
        success: true,
        folderPath: folderPath,
        totalFiles: files.length,
        results: results
      });

    } catch (error) {
      next(error);
    }
  }

  async parseMultipleFiles(req, res, next) {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: 'No files uploaded' });
      }

      const results = [];
      
      for (const file of req.files) {
        try {
          // Extract text from each file
          const extractedText = await fileService.extractTextFromFile(file.path, file.mimetype);
          
          // Parse resume using Gemini AI
          const parsedData = await resumeService.parseResumeText(extractedText);
          
          results.push({
            fileName: file.originalname,
            success: true,
            data: parsedData
          });
          
          // Clean up uploaded file
          await fileService.deleteFile(file.path);
          
        } catch (error) {
          results.push({
            fileName: file.originalname,
            success: false,
            error: error.message
          });
          
          // Clean up file even if processing failed
          await fileService.deleteFile(file.path);
        }
      }

      res.json({
        success: true,
        totalFiles: req.files.length,
        results: results
      });

    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ResumeController();