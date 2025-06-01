from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import os
from dotenv import load_dotenv
import logging

# Load environment variables
load_dotenv()

# Configure the Gemini API
genai.configure(api_key='')

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Set up basic logging to stdout with INFO level
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

@app.route('/generate-outreach', methods=['POST'])
def generate_outreach():
    try:
        data = request.json
        candidate = data.get('candidate', {})
        message_type = data.get('messageType', 'email')
        tone = data.get('tone', 'professional')
        custom_prompt = data.get('customPrompt', '')
        sender_info = data.get('senderInfo', {})
        
        name = candidate.get('name', '')
        
        # Log the request info
        logging.info(f"Endpoint /generate-outreach hit. Candidate: {name}, Message Type: {message_type}, Tone: {tone}")
        
        # Extract sender company information
        sender_name = sender_info.get('name', '')
        sender_email = sender_info.get('email', '')
        company_name = sender_info.get('companyName', '')
        industry_sector = sender_info.get('industrySector', '')
        company_size = sender_info.get('companySize', '')
        office_locations = sender_info.get('officeLocations', [])
        key_departments = sender_info.get('keyDepartments', [])
        
        # Log sender info
        logging.info(f"Sender: {sender_name}, Company: {company_name}, Industry: {industry_sector}")
        
        # Format office locations and departments for prompt
        office_locations_str = ', '.join(office_locations) if office_locations else 'Not specified'
        key_departments_str = ', '.join(key_departments) if key_departments else 'Not specified'
        
        # Create prompt for Gemini
        prompt = f"""
        Generate a personalized {message_type} outreach message to a potential job candidate with the following details:
        
        CANDIDATE INFORMATION:
        Name: {name}
        Current Title: {candidate.get('title', '')}
        Current Company: {candidate.get('company', '')}
        Skills: {', '.join(candidate.get('skills', []))}
        Years of Experience: {candidate.get('experience', '')}
        Location: {candidate.get('location', '')}
        Summary: {candidate.get('summary', '')}
        
        SENDER INFORMATION:
        Sender Name: {sender_name}
        Sender Email: {sender_email}
        Company Name: {company_name}
        Industry/Sector: {industry_sector}
        Company Size: {company_size}
        Office Locations: {office_locations_str}
        Key Departments: {key_departments_str}
        
        The message should be in a {tone} tone.
        
        Additional instructions: {custom_prompt}
        
        The message should be personalized based on the candidate's skills and experience,
        mentioning specific aspects of their background that make them a good fit for {company_name or 'our company'}.
        Include relevant details about the sender's company such as industry, size, or key departments that would be relevant to this candidate.
        Sign the message with the sender's name and company.
        Keep the message concise, engaging, and persuasive.
        Don't include the sender's contact information unless specifically requested.
        """
        
        model = genai.GenerativeModel('gemini-1.5-flash')
        response = model.generate_content(prompt)
        
        generated_message = response.text
        
        return jsonify({
            'success': True,
            'message': generated_message
        })
    
    except Exception as e:
        logging.error(f"Error in /generate-outreach: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5003, debug=True)
