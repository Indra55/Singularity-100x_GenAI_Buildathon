const fs = require('fs').promises;
const path = require('path');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const AdmZip = require('adm-zip');

class FileService {
  async extractTextFromFile(filePath, mimeType) {
    try {
      switch (mimeType) {
        case 'application/pdf':
          return await this.extractFromPDF(filePath);
        
        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        case 'application/msword':
          return await this.extractFromWord(filePath);
        
        case 'text/plain':
          return await this.extractFromText(filePath);
        
        default:
          throw new Error(`Unsupported file type: ${mimeType}`);
      }
    } catch (error) {
      console.error('Error extracting text from file:', error);
      throw new Error('Failed to extract text from file');
    }
  }

  async extractFromPDF(filePath) {
    const dataBuffer = await fs.readFile(filePath);
    const data = await pdfParse(dataBuffer);
    return data.text;
  }

  async extractFromWord(filePath) {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  }

  async extractFromText(filePath) {
    return await fs.readFile(filePath, 'utf8');
  }

  async extractZipFile(zipFilePath) {
    const zip = new AdmZip(zipFilePath);
    const zipEntries = zip.getEntries();
    const extractedFiles = [];
    const extractDir = path.join(path.dirname(zipFilePath), 'extracted');

    // Create extraction directory
    try {
      await fs.mkdir(extractDir, { recursive: true });
    } catch (error) {
      // Directory might already exist
    }

    for (const zipEntry of zipEntries) {
      if (!zipEntry.isDirectory) {
        const fileName = zipEntry.entryName;
        const fileExtension = path.extname(fileName).toLowerCase();
        
        // Only process supported file types
        if (this.isSupportedFileType(fileExtension)) {
          const extractPath = path.join(extractDir, fileName);
          
          // Extract file
          zip.extractEntryTo(zipEntry, extractDir, false, true);
          
          extractedFiles.push({
            name: fileName,
            path: extractPath,
            type: this.getMimeTypeFromExtension(fileExtension)
          });
        }
      }
    }

    return extractedFiles;
  }

  async getFilesFromFolder(folderPath) {
    try {
      // Check if folder exists
      const stats = await fs.stat(folderPath);
      if (!stats.isDirectory()) {
        throw new Error('Provided path is not a directory');
      }

      const files = await fs.readdir(folderPath);
      const resumeFiles = [];

      for (const file of files) {
        const filePath = path.join(folderPath, file);
        const fileStats = await fs.stat(filePath);
        
        // Skip directories
        if (fileStats.isDirectory()) {
          continue;
        }

        const fileExtension = path.extname(file).toLowerCase();
        
        // Only include supported file types
        if (this.isSupportedFileType(fileExtension)) {
          resumeFiles.push({
            name: file,
            path: filePath,
            type: this.getMimeTypeFromExtension(fileExtension)
          });
        }
      }

      return resumeFiles;
    } catch (error) {
      console.error('Error reading folder:', error);
      throw new Error(`Failed to read folder: ${error.message}`);
    }
  }

  async scanFolderRecursively(folderPath) {
    try {
      const files = await fs.readdir(folderPath);
      const resumeFiles = [];

      for (const file of files) {
        const filePath = path.join(folderPath, file);
        const fileStats = await fs.stat(filePath);
        
        if (fileStats.isDirectory()) {
          // Recursively scan subdirectories
          const subFiles = await this.scanFolderRecursively(filePath);
          resumeFiles.push(...subFiles);
        } else {
          const fileExtension = path.extname(file).toLowerCase();
          
          if (this.isSupportedFileType(fileExtension)) {
            resumeFiles.push({
              name: file,
              path: filePath,
              type: this.getMimeTypeFromExtension(fileExtension)
            });
          }
        }
      }

      return resumeFiles;
    } catch (error) {
      console.error('Error scanning folder recursively:', error);
      throw new Error(`Failed to scan folder: ${error.message}`);
    }
  }

  isSupportedFileType(extension) {
    const supportedTypes = ['.pdf', '.doc', '.docx', '.txt'];
    return supportedTypes.includes(extension);
  }

  getMimeTypeFromExtension(extension) {
    const mimeTypes = {
      '.pdf': 'application/pdf',
      '.doc': 'application/msword',
      '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      '.txt': 'text/plain'
    };
    return mimeTypes[extension] || 'application/octet-stream';
  }

  async deleteFile(filePath) {
    try {
      await fs.unlink(filePath);
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  }

  async cleanupDirectory(dirPath) {
    try {
      const files = await fs.readdir(dirPath);
      for (const file of files) {
        await fs.unlink(path.join(dirPath, file));
      }
      await fs.rmdir(dirPath);
    } catch (error) {
      console.error('Error cleaning up directory:', error);
    }
  }
}

module.exports = new FileService();