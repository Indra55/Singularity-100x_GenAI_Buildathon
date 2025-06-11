from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Configuration
app.config['MAX_CONTENT_LENGTH'] = 50 * 1024 * 1024  # 50MB max file size
app.config['UPLOAD_FOLDER'] = 'uploads'

# Ensure upload directory exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

@app.route('/api/interview/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "service": "interview"})

@app.route('/api/interview/upload', methods=['POST'])
def upload_video():
    if 'video' not in request.files:
        return jsonify({"error": "No video file provided"}), 400
    
    video_file = request.files['video']
    if video_file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    # TODO: Implement video upload logic
    return jsonify({"message": "Video upload endpoint ready"}), 200

@app.route('/api/interview/transcribe', methods=['POST'])
def transcribe_video():
    # TODO: Implement transcription logic
    return jsonify({"message": "Transcription endpoint ready"}), 200

@app.route('/api/interview/evaluate', methods=['POST'])
def evaluate_response():
    # TODO: Implement response evaluation logic
    return jsonify({"message": "Evaluation endpoint ready"}), 200

if __name__ == '__main__':
    app.run(debug=True, port=5001) 