from flask import Blueprint, request, jsonify
import os
from google.cloud import speech_v1
from google.cloud import storage
import openai
from datetime import datetime
import json

interview_bp = Blueprint('interview', __name__)

# Initialize clients
speech_client = speech_v1.SpeechClient()
storage_client = storage.Client()
openai.api_key = os.getenv('OPENAI_API_KEY')

# Configure storage
BUCKET_NAME = os.getenv('GCS_BUCKET_NAME')
bucket = storage_client.bucket(BUCKET_NAME)

def transcribe_video(audio_file_path):
    """Transcribe audio from video file using Google Speech-to-Text"""
    with open(audio_file_path, 'rb') as audio_file:
        content = audio_file.read()

    audio = speech_v1.RecognitionAudio(content=content)
    config = speech_v1.RecognitionConfig(
        encoding=speech_v1.RecognitionConfig.AudioEncoding.LINEAR16,
        sample_rate_hertz=16000,
        language_code="en-US",
        enable_automatic_punctuation=True,
    )

    response = speech_client.recognize(config=config, audio=audio)
    return ' '.join([result.alternatives[0].transcript for result in response.results])

def analyze_response(transcription, question):
    """Analyze the candidate's response using OpenAI"""
    prompt = f"""
    Question: {question}
    Candidate's Response: {transcription}
    
    Please analyze this response and provide:
    1. A rating from 1-5
    2. Key strengths
    3. Areas for improvement
    4. Suggested follow-up questions
    
    Format the response as JSON.
    """

    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are an expert interviewer analyzing candidate responses."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.7,
    )

    return json.loads(response.choices[0].message.content)

@interview_bp.route('/upload-response', methods=['POST'])
def upload_response():
    """Handle video response upload and processing"""
    try:
        if 'video' not in request.files:
            return jsonify({'error': 'No video file provided'}), 400

        video_file = request.files['video']
        question = request.form.get('question')
        candidate_id = request.form.get('candidate_id')
        interview_id = request.form.get('interview_id')

        if not all([video_file, question, candidate_id, interview_id]):
            return jsonify({'error': 'Missing required fields'}), 400

        # Generate unique filename
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = f"interviews/{interview_id}/{candidate_id}_{timestamp}.webm"
        
        # Upload to Google Cloud Storage
        blob = bucket.blob(filename)
        blob.upload_from_file(video_file)

        # Get the video URL
        video_url = blob.public_url

        # Download for processing
        local_path = f"/tmp/{filename.split('/')[-1]}"
        blob.download_to_filename(local_path)

        # Transcribe the video
        transcription = transcribe_video(local_path)

        # Analyze the response
        analysis = analyze_response(transcription, question)

        # Clean up
        os.remove(local_path)

        return jsonify({
            'success': True,
            'video_url': video_url,
            'transcription': transcription,
            'analysis': analysis
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@interview_bp.route('/get-questions', methods=['GET'])
def get_questions():
    """Get interview questions based on job position and type"""
    try:
        job_position = request.args.get('position')
        interview_type = request.args.get('type')

        if not all([job_position, interview_type]):
            return jsonify({'error': 'Missing required parameters'}), 400

        # Generate questions using OpenAI
        prompt = f"""
        Generate 5 interview questions for a {job_position} position.
        Interview type: {interview_type}
        Format the response as a JSON array of questions.
        """

        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are an expert interviewer."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
        )

        questions = json.loads(response.choices[0].message.content)
        return jsonify({'questions': questions})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@interview_bp.route('/complete-interview', methods=['POST'])
def complete_interview():
    """Handle interview completion and generate final report"""
    try:
        data = request.json
        interview_id = data.get('interview_id')
        responses = data.get('responses')

        if not all([interview_id, responses]):
            return jsonify({'error': 'Missing required fields'}), 400

        # Generate final report using OpenAI
        prompt = f"""
        Based on the following interview responses, generate a comprehensive evaluation report:
        {json.dumps(responses, indent=2)}
        
        Include:
        1. Overall assessment
        2. Technical skills evaluation
        3. Communication skills
        4. Areas of strength
    . Areas for improvement
        6. Hiring recommendation
        
        Format the response as JSON.
        """

        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are an expert interviewer providing a final evaluation."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
        )

        report = json.loads(response.choices[0].message.content)
        return jsonify({'report': report})

    except Exception as e:
        return jsonify({'error': str(e)}), 500 