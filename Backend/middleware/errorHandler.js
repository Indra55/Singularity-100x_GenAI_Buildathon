const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);
  
    // Multer errors
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          error: 'File too large. Maximum size is 50MB.'
        });
      }
      return res.status(400).json({
        success: false,
        error: err.message
      });
    }
  
    // Custom errors
    if (err.message.includes('Invalid file type')) {
      return res.status(400).json({
        success: false,
        error: err.message
      });
    }
  
    // Default error response
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      ...(process.env.NODE_ENV === 'development' && { details: err.message })
    });
  };
  
  module.exports = { errorHandler };