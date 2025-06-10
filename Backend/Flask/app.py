from flask import Flask
from flask_cors import CORS
import logging

from embeddings.candidate_embeddings import candidates_bp
# from feature import feature_bp

app = Flask(__name__)
CORS(app)
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Register blueprints with optional URL prefixes
app.register_blueprint(candidates_bp, url_prefix='/candidates')
# app.register_blueprint(feature_bp, url_prefix='/feature')

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)
   
