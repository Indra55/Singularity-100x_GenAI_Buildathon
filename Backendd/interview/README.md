# Interview Service

This service handles video interview processing, transcription, and evaluation.

## Setup

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -e .
```

3. Create a `.env` file with the following variables:
```
# Flask Configuration
FLASK_ENV=development
FLASK_DEBUG=1

# Google Cloud Configuration
GOOGLE_CLOUD_PROJECT=your-project-id
GOOGLE_APPLICATION_CREDENTIALS=path/to/your/credentials.json

# OpenAI Configuration
OPENAI_API_KEY=your-openai-api-key

# Storage Configuration
GCS_BUCKET_NAME=your-bucket-name
```

## Running the Service

```bash
python app.py
```

The service will start on port 5001.

## API Endpoints

- `GET /api/interview/health` - Health check endpoint
- `POST /api/interview/upload` - Upload video response
- `POST /api/interview/transcribe` - Transcribe video
- `POST /api/interview/evaluate` - Evaluate response

## Development

The service uses:
- Flask for the web framework
- Google Cloud Speech-to-Text for transcription
- Google Cloud Storage for video storage
- OpenAI for response evaluation 