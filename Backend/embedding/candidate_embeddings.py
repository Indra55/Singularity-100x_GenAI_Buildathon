import json
import faiss
import numpy as np
from sentence_transformers import SentenceTransformer, CrossEncoder
from typing import List, Dict, Set, Optional, Tuple
import os
import re
from dataclasses import dataclass, asdict
from enum import Enum
import logging
from pathlib import Path
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class WorkPreference(Enum):
    REMOTE = "remote"
    ONSITE = "onsite"
    HYBRID = "hybrid"

@dataclass
class SearchConfig:
    """Configuration for search parameters"""
    similarity_weight: float = 0.4
    rerank_weight: float = 0.6
    experience_bonus: float = 1.0
    skill_match_bonus: float = 0.5
    location_bonus: float = 0.3
    work_pref_bonus: float = 0.4
    education_bonus: float = 0.2

class CandidateEmbeddings:
    def __init__(self, 
                 model_name: str = 'all-MiniLM-L6-v2',
                 reranker_name: str = 'cross-encoder/ms-marco-MiniLM-L-12-v2',
                 config: Optional[SearchConfig] = None):
        self.model = SentenceTransformer(model_name)
        self.reranker = CrossEncoder(reranker_name)
        self.dimension = self.model.get_sentence_embedding_dimension()
        self.index = faiss.IndexFlatIP(self.dimension)
        self.candidates: List[Dict] = []
        self.embeddings = None
        self.config = config or SearchConfig()
        
        # Skill synonyms for better matching
        self.skill_synonyms = {
            'javascript': ['js', 'node.js', 'nodejs'],
            'python': ['py'],
            'machine learning': ['ml', 'ai', 'artificial intelligence'],
            'langchain': ['lang-chain', 'lang chain'],
            'react': ['reactjs', 'react.js'],
            'angular': ['angularjs'],
            'vue': ['vuejs', 'vue.js'],
        }

    def load_candidates(self, json_path: str):
        """Load candidates with validation"""
        try:
            with open(json_path, 'r', encoding='utf-8') as f:
                self.candidates = json.load(f)
            logger.info(f"Loaded {len(self.candidates)} candidates")
            self._validate_candidates()
        except Exception as e:
            logger.error(f"Error loading candidates: {e}")
            raise

    def _validate_candidates(self):
        """Validate and clean candidate data"""
        required_fields = ['name', 'title']
        for i, candidate in enumerate(self.candidates):
            # Check required fields
            for field in required_fields:
                if field not in candidate or not candidate[field]:
                    logger.warning(f"Candidate {i} missing required field: {field}")
            
            # Normalize numeric fields
            if 'yearsOfExperience' in candidate:
                try:
                    candidate['yearsOfExperience'] = int(candidate['yearsOfExperience'])
                except (ValueError, TypeError):
                    candidate['yearsOfExperience'] = 0
            
            # Normalize skills to lowercase
            if 'skills' in candidate and candidate['skills']:
                candidate['skills'] = [skill.lower().strip() for skill in candidate['skills']]

    def create_candidate_text(self, candidate: Dict) -> str:
        """Enhanced text representation with weighted fields"""
        # Core fields with higher weight
        core_text = f"{candidate.get('title', '')} {candidate.get('name', '')}"
        
        # Skills with synonyms
        skills = candidate.get('skills', [])
        expanded_skills = []
        for skill in skills:
            expanded_skills.append(skill)
            if skill.lower() in self.skill_synonyms:
                expanded_skills.extend(self.skill_synonyms[skill.lower()])
        
        fields = [
            core_text,  # Higher weight for title/name
            core_text,  # Duplicate for emphasis
            candidate.get('location', ''),
            f"{candidate.get('yearsOfExperience', 0)} years experience",
            ' '.join(expanded_skills),
            candidate.get('workPreference', ''),
            candidate.get('education', ''),
            ' '.join(str(x) for x in candidate.get('pastCompanies', [])),
            candidate.get('summary', ''),
        ]
        return ' '.join([str(field) for field in fields if field])

    def generate_embeddings(self, batch_size: int = 32):
        """Generate embeddings with batching for efficiency"""
        if not self.candidates:
            raise ValueError("No candidates loaded")
        
        texts = [self.create_candidate_text(c) for c in self.candidates]
        logger.info(f"Generating embeddings for {len(texts)} candidates...")
        
        # Process in batches for memory efficiency
        all_embeddings = []
        for i in range(0, len(texts), batch_size):
            batch = texts[i:i + batch_size]
            batch_embeddings = self.model.encode(batch, normalize_embeddings=True, show_progress_bar=False)
            all_embeddings.append(batch_embeddings)
        
        self.embeddings = np.vstack(all_embeddings)
        self.index.add(self.embeddings.astype('float32'))
        logger.info("Embeddings generated and index built")
        return self.embeddings

    def save_index(self, path: str):
        """Save the FAISS index to disk"""
        if self.index is None:
            raise ValueError("No index to save. Generate embeddings first.")
        faiss.write_index(self.index, path)
        logger.info(f"Index saved to {path}")

    def load_index(self, path: str):
        """Load the FAISS index from disk"""
        if not os.path.exists(path):
            raise FileNotFoundError(f"Index file not found: {path}")
        self.index = faiss.read_index(path)
        logger.info(f"Index loaded from {path}")

    def extract_query_requirements(self, query: str) -> Dict:
        """Extract structured requirements from query"""
        requirements = {
            'years_exp': None,
            'skills': [],
            'work_preference': None,
            'location': None,
            'seniority': None,
            'sector': None
        }
        
        query_lower = query.lower()
        
        # Extract years of experience
        exp_patterns = [
            r'(\d+)\+?\s*years?\s*(?:of\s*)?(?:experience|exp)',
            r'(\d+)\+?\s*yrs?',
            r'with\s*(\d+)\+?\s*years?'
        ]
        for pattern in exp_patterns:
            match = re.search(pattern, query_lower)
            if match:
                requirements['years_exp'] = int(match.group(1))
                break
        
        # Extract work preference
        for pref in WorkPreference:
            if pref.value in query_lower:
                requirements['work_preference'] = pref.value
                break
        
        # Extract seniority level
        seniority_keywords = ['senior', 'lead', 'principal', 'staff', 'junior', 'entry']
        for keyword in seniority_keywords:
            if keyword in query_lower:
                requirements['seniority'] = keyword
                break
        
        # Extract technical skills (basic approach)
        common_skills = ['python', 'javascript', 'react', 'langchain', 'tensorflow', 'pytorch', 
                        'aws', 'docker', 'kubernetes', 'sql', 'nosql', 'machine learning', 'ai']
        for skill in common_skills:
            if skill in query_lower:
                requirements['skills'].append(skill)
        
        # Extract sector/industry information
        common_sectors = ['healthcare', 'finance', 'tech', 'education', 'retail', 'manufacturing', 
                         'government', 'nonprofit', 'media', 'entertainment', 'energy', 'transportation',
                         'consulting', 'legal', 'hospitality', 'construction', 'agriculture', 'pharmaceutical']
        for sector in common_sectors:
            if sector in query_lower:
                requirements['sector'] = sector
                break
        
        return requirements

    def calculate_enhanced_score(self, similarity_score: float, rerank_score: float, 
                               query: str, candidate: Dict) -> Tuple[int, Dict]:
        """Enhanced scoring with detailed breakdown"""
        requirements = self.extract_query_requirements(query)
        
        # Normalize scores to 0-1 range
        sim_norm = (similarity_score + 1) / 2
        rerank_norm = (rerank_score + 1) / 2
        
        # Base score from similarity and reranking
        base_score = (sim_norm * self.config.similarity_weight + 
                     rerank_norm * self.config.rerank_weight)
        
        # Detailed scoring breakdown
        breakdown = {
            'base_score': round(base_score, 3),
            'experience_bonus': 0,
            'skill_bonus': 0,
            'work_pref_bonus': 0,
            'seniority_bonus': 0,
            'sector_bonus': 0,
            'total_bonus': 0
        }
        
        # Experience matching
        if requirements['years_exp']:
            candidate_exp = candidate.get('yearsOfExperience', 0)
            if candidate_exp >= requirements['years_exp']:
                exp_bonus = min(0.2, (candidate_exp - requirements['years_exp']) * 0.05 + 0.1)
                breakdown['experience_bonus'] = round(exp_bonus, 3)
        
        # Skill matching with fuzzy matching
        if requirements['skills']:
            candidate_skills = set(skill.lower() for skill in candidate.get('skills', []))
            matched_skills = 0
            for req_skill in requirements['skills']:
                if req_skill in candidate_skills:
                    matched_skills += 1
                else:
                    # Check synonyms
                    if req_skill in self.skill_synonyms:
                        for synonym in self.skill_synonyms[req_skill]:
                            if synonym in candidate_skills:
                                matched_skills += 0.8  # Partial credit for synonyms
                                break
            
            skill_bonus = min(0.3, matched_skills * 0.1)
            breakdown['skill_bonus'] = round(skill_bonus, 3)
        
        # Work preference matching
        if (requirements['work_preference'] and 
            candidate.get('workPreference', '').lower() == requirements['work_preference']):
            breakdown['work_pref_bonus'] = 0.15
        
        # Seniority matching
        if requirements['seniority']:
            candidate_title = candidate.get('title', '').lower()
            if requirements['seniority'] in candidate_title:
                breakdown['seniority_bonus'] = 0.1
        
        # Sector matching
        if requirements['sector'] and candidate.get('sector', '').lower() == requirements['sector']:
            breakdown['sector_bonus'] = 0.2
        else:
            breakdown['sector_bonus'] = 0
        
        # Calculate total bonus
        breakdown['total_bonus'] = round(sum([
            breakdown['experience_bonus'],
            breakdown['skill_bonus'],
            breakdown['work_pref_bonus'],
            breakdown['seniority_bonus'],
            breakdown['sector_bonus']
        ]), 3)
        
        # Final score (0-1 range, then scale to 1-10)
        final_score_normalized = base_score + breakdown['total_bonus']
        final_score = max(1, min(10, int(round(final_score_normalized * 10))))
        
        return final_score, breakdown

    def search(self, query: str, k: int = 5, rerank: bool = True) -> List[Dict]:
        """Enhanced search with detailed scoring"""
        if self.embeddings is None:
            raise ValueError("Embeddings not generated. Call generate_embeddings() first.")
        
        query_embedding = self.model.encode([query], normalize_embeddings=True)
        scores, indices = self.index.search(query_embedding.astype('float32'), k * 2)  # Get more for reranking

        results = []
        for idx, score in zip(indices[0], scores[0]):
            if idx < len(self.candidates):
                result = self.candidates[idx].copy()
                result['similarity_score'] = float(score)
                results.append(result)

        if rerank and results:
            pairs = [[query, self.create_candidate_text(r)] for r in results]
            rerank_scores = self.reranker.predict(pairs)
            
            for i, r in enumerate(results):
                r['rerank_score'] = float(rerank_scores[i])
                score, breakdown = self.calculate_enhanced_score(
                    r['similarity_score'], 
                    r['rerank_score'],
                    query,
                    r
                )
                r['match_score'] = score
                r['score_breakdown'] = breakdown
            
            results.sort(key=lambda x: x['match_score'], reverse=True)

        return results[:k]

    def get_match_explanation(self, query: str, candidate: Dict) -> Dict:
        """Get structured match explanation"""
        requirements = self.extract_query_requirements(query)
        explanation = {
            'candidate_name': candidate.get('name', 'Unknown'),
            'checks': []
        }
        
        # Experience check
        if requirements['years_exp']:
            candidate_exp = candidate.get('yearsOfExperience', 0)
            explanation['checks'].append({
                'type': 'experience',
                'required': f"{requirements['years_exp']}+ years",
                'candidate_has': f"{candidate_exp} years",
                'status': 'pass' if candidate_exp >= requirements['years_exp'] else 'fail'
            })
        
        # Skills check
        if requirements['skills']:
            candidate_skills = set(skill.lower() for skill in candidate.get('skills', []))
            matched = []
            missing = []
            
            for skill in requirements['skills']:
                if skill in candidate_skills:
                    matched.append(skill)
                else:
                    missing.append(skill)
            
            explanation['checks'].append({
                'type': 'skills',
                'matched': matched,
                'missing': missing,
                'status': 'pass' if matched else 'fail'
            })
        
        # Work preference
        if requirements['work_preference']:
            candidate_pref = candidate.get('workPreference', '').lower()
            explanation['checks'].append({
                'type': 'work_preference',
                'required': requirements['work_preference'],
                'candidate_has': candidate_pref,
                'status': 'pass' if candidate_pref == requirements['work_preference'] else 'partial'
            })
        
        return explanation

    def search_candidates_json(self, query: str, k: int = 5, include_explanations: bool = False) -> Dict:
        """Search candidates and return JSON response for frontend"""
        try:
            results = self.search(query, k=k)
            
            response = {
                'status': 'success',
                'query': query,
                'total_results': len(results),
                'candidates': []
            }
            
            for result in results:
                candidate_data = {
                    'id': result.get('id'),
                    'name': result.get('name', 'Unknown'),
                    'title': result.get('title', 'No Title'),
                    'location': result.get('location', 'Not specified'),
                    'years_of_experience': result.get('yearsOfExperience', 0),
                    'skills': result.get('skills', []),
                    'work_preference': result.get('workPreference', 'Not specified'),
                    'education': result.get('education', 'Not specified'),
                    'past_companies': result.get('pastCompanies', []),
                    'summary': result.get('summary', ''),
                    'match_score': result.get('match_score', 0),
                    'similarity_score': round(result.get('similarity_score', 0), 3),
                    'rerank_score': round(result.get('rerank_score', 0), 3),
                    'score_breakdown': result.get('score_breakdown', {})
                }
                
                if include_explanations:
                    candidate_data['match_explanation'] = self.get_match_explanation(query, result)
                
                response['candidates'].append(candidate_data)
            
            return response
            
        except Exception as e:
            return {
                'status': 'error',
                'message': str(e),
                'query': query,
                'candidates': []
            }

    def batch_search_json(self, queries: List[str], k: int = 3, include_explanations: bool = False) -> Dict:
        """Batch search and return JSON response"""
        try:
            results = {}
            
            for query in queries:
                results[query] = self.search_candidates_json(
                    query, 
                    k=k, 
                    include_explanations=include_explanations
                )
            
            return {
                'status': 'success',
                'batch_results': results,
                'total_queries': len(queries)
            }
            
        except Exception as e:
            return {
                'status': 'error',
                'message': str(e),
                'batch_results': {}
            }

# Initialize the candidate search instance
candidate_search = CandidateEmbeddings()

def initialize_search_system():
    """Initialize the search system on startup"""
    try:
        # Try different possible paths for candidates.json
        possible_paths = [
            'candidates.json',
            'data/candidates.json',
            '../data/candidates.json',
            './data/candidates.json'
        ]
        
        candidates_path = None
        for path in possible_paths:
            if os.path.exists(path):
                candidates_path = path
                break
        
        if not candidates_path:
            logger.error("candidates.json not found in any of the expected locations")
            logger.info(f"Searched in: {possible_paths}")
            logger.info("Please ensure candidates.json exists in one of these locations")
            return False
        
        candidate_search.load_candidates(candidates_path)
        candidate_search.generate_embeddings()
        logger.info("Search system initialized successfully")
        return True
    except Exception as e:
        logger.error(f"Setup failed: {e}")
        return False

# Initialize on import
search_initialized = initialize_search_system()

@app.route('/search', methods=['POST'])
def search_candidates():
    if not search_initialized:
        return jsonify({'error': 'Search system not initialized. Please check if candidates.json exists.'}), 500
    
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No JSON data provided'}), 400
    
    query = data.get('query')
    k = data.get('top_k', 5)

    if not query:
        return jsonify({'error': 'Missing query in request'}), 400

    try:
        results = candidate_search.search_candidates_json(query=query, k=k)
        return jsonify(results), 200
    except Exception as e:
        logger.error(f"Search failed: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/sector_ranking', methods=['POST'])
def rank_candidates_by_sector():
    """Rank candidates based on sector and other criteria"""
    if not search_initialized:
        return jsonify({'error': 'Search system not initialized. Please check if candidates.json exists.'}), 500
    
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No JSON data provided'}), 400
    
    sector = data.get('sector')
    if not sector:
        return jsonify({'error': 'Missing sector in request'}), 400
    
    # Additional filters
    min_experience = data.get('min_experience', 0)
    skills = data.get('skills', [])
    k = data.get('top_k', 10)
    
    # Construct a query that includes the sector
    query = f"Looking for candidates in the {sector} sector"
    if min_experience > 0:
        query += f" with {min_experience}+ years of experience"
    if skills:
        query += f" who know {', '.join(skills)}"
    
    try:
        # Use the existing search functionality with the constructed query
        results = candidate_search.search_candidates_json(query=query, k=k, include_explanations=True)
        
        # Add sector match percentage to the results
        for candidate in results['candidates']:
            candidate_sector = candidate.get('sector', '').lower()
            if candidate_sector == sector.lower():
                sector_match = 100
            elif candidate_sector:
                # Partial match if sectors are related
                sector_match = 50
            else:
                sector_match = 0
            
            # Add sector match to the breakdown
            if 'matchScoreBreakdown' not in candidate:
                candidate['matchScoreBreakdown'] = {}
            candidate['matchScoreBreakdown']['sectorMatch'] = sector_match
        
        return jsonify(results), 200
    except Exception as e:
        logger.error(f"Sector ranking failed: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'search_initialized': search_initialized,
        'candidates_loaded': len(candidate_search.candidates) if search_initialized else 0
    }), 200

def main():
    """Main function for standalone execution"""
    if not search_initialized:
        logger.error("Cannot run main() - search system not initialized")
        return
    
    # Initialize with custom config
    config = SearchConfig(
        similarity_weight=0.3,
        rerank_weight=0.7,
        experience_bonus=1.2,
        skill_match_bonus=0.8
    )
    
    embedder = CandidateEmbeddings(config=config)
    
    # Load candidates
    candidates_path = Path('data') / 'candidates.json'
    if not candidates_path.exists():
        candidates_path = Path('candidates.json')
    
    if not candidates_path.exists():
        logger.error("candidates.json not found")
        return
    
    embedder.load_candidates(str(candidates_path))
    embedder.generate_embeddings()

    # Save index
    index_path = Path('src') / 'embeddings' / 'candidates.index'
    index_path.parent.mkdir(parents=True, exist_ok=True)
    embedder.save_index(str(index_path))

    # Single query JSON response
    query = "Looking for senior AI engineer with 5+ years experience in LangChain"
    json_result = embedder.search_candidates_json(query, k=3, include_explanations=True)
    
    print("SINGLE QUERY JSON RESPONSE:")
    print(json.dumps(json_result, indent=2))

    # Multiple queries JSON response
    queries = [
        "Looking for senior AI engineer with 5+ years experience in LangChain",
        "Need a remote Python expert with RAG experience",
        "Seeking ML engineer with 3+ years at top AI companies"
    ]
    
    batch_result = embedder.batch_search_json(queries, k=2, include_explanations=True)
    
    print("\nBATCH QUERY JSON RESPONSE:")
    print(json.dumps(batch_result, indent=2))
    
    # Save results to file for frontend consumption
    output_path = Path('results') / 'api_results.json'
    output_path.parent.mkdir(exist_ok=True)
    
    with open(output_path, 'w') as f:
        json.dump({
            'single_query_result': json_result,
            'batch_query_result': batch_result
        }, f, indent=2)
    
    print(f"\nResults saved to {output_path}")

if __name__ == '__main__':
    if len(os.sys.argv) > 1 and os.sys.argv[1] == 'main':
        main()
    else:
        app.run(debug=True, host='0.0.0.0', port=5001)