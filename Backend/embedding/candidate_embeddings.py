import json
import faiss
import numpy as np
from sentence_transformers import SentenceTransformer, CrossEncoder
from typing import List, Dict, Set, Optional, Tuple
import os
import re
from dataclasses import dataclass
from enum import Enum
import logging
from pathlib import Path

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
                 model_name: str = 'all-MiniLM-L6-v2',  # Faster, still good quality
                 reranker_name: str = 'cross-encoder/ms-marco-MiniLM-L-12-v2',  # Better reranker
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
            'seniority': None
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
            'base_score': base_score,
            'experience_bonus': 0,
            'skill_bonus': 0,
            'work_pref_bonus': 0,
            'seniority_bonus': 0,
            'total_bonus': 0
        }
        
        # Experience matching
        if requirements['years_exp']:
            candidate_exp = candidate.get('yearsOfExperience', 0)
            if candidate_exp >= requirements['years_exp']:
                exp_bonus = min(0.2, (candidate_exp - requirements['years_exp']) * 0.05 + 0.1)
                breakdown['experience_bonus'] = exp_bonus
        
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
            breakdown['skill_bonus'] = skill_bonus
        
        # Work preference matching
        if (requirements['work_preference'] and 
            candidate.get('workPreference', '').lower() == requirements['work_preference']):
            breakdown['work_pref_bonus'] = 0.15
        
        # Seniority matching
        if requirements['seniority']:
            candidate_title = candidate.get('title', '').lower()
            if requirements['seniority'] in candidate_title:
                breakdown['seniority_bonus'] = 0.1
        
        # Calculate total bonus
        breakdown['total_bonus'] = sum([
            breakdown['experience_bonus'],
            breakdown['skill_bonus'],
            breakdown['work_pref_bonus'],
            breakdown['seniority_bonus']
        ])
        
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

    def explain_match(self, query: str, candidate: Dict, detailed: bool = True) -> str:
        """Explain why a candidate matches the query"""
        explanation = []
        
        requirements = self.extract_query_requirements(query)
        
        explanation.append(f"Match explanation for {candidate.get('name', 'Unknown')}:")
        
        # Experience check
        if requirements['years_exp']:
            candidate_exp = candidate.get('yearsOfExperience', 0)
            if candidate_exp >= requirements['years_exp']:
                explanation.append(f"✓ Experience: {candidate_exp} years (required: {requirements['years_exp']}+)")
            else:
                explanation.append(f"✗ Experience: {candidate_exp} years (required: {requirements['years_exp']}+)")
        
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
            
            if matched:
                explanation.append(f"✓ Skills matched: {', '.join(matched)}")
            if missing:
                explanation.append(f"✗ Skills missing: {', '.join(missing)}")
        
        # Work preference
        if requirements['work_preference']:
            candidate_pref = candidate.get('workPreference', '').lower()
            if candidate_pref == requirements['work_preference']:
                explanation.append(f"✓ Work preference: {candidate_pref}")
            else:
                explanation.append(f"○ Work preference: {candidate_pref} (looking for: {requirements['work_preference']})")
        
        return '\n'.join(explanation)

    def evaluate_candidates(self, query: str, k: int = 5, explain: bool = False) -> List[Dict]:
        """Enhanced candidate evaluation with explanations"""
        print(f"\nEvaluating candidates for query: '{query}'")
        print("=" * 80)
        
        results = self.search(query, k=k)
        
        for i, result in enumerate(results, 1):
            print(f"\n{i}. {result.get('name', 'Unknown')} - {result.get('title', 'No Title')}")
            print(f"   🎯 Match Score: {result['match_score']}/10")
            print(f"   📍 Location: {result.get('location', 'Not specified')}")
            print(f"   📅 Experience: {result.get('yearsOfExperience', 'Not specified')} years")
            print(f"   🛠️  Skills: {', '.join(result.get('skills', []))}")
            print(f"   🏠 Work Preference: {result.get('workPreference', 'Not specified')}")
            
            if 'score_breakdown' in result:
                breakdown = result['score_breakdown']
                print(f"   📊 Score Breakdown:")
                print(f"      Base: {breakdown['base_score']:.2f}")
                print(f"      Bonuses: +{breakdown['total_bonus']:.2f}")
            
            if explain:
                print(f"\n   {self.explain_match(query, result)}")
            
        return results

    def batch_evaluate(self, queries: List[str], k: int = 3, save_results: bool = False):
        """Evaluate multiple queries efficiently"""
        all_results = {}
        
        for i, query in enumerate(queries, 1):
            print(f"\n{'='*100}")
            print(f"QUERY {i}/{len(queries)}: {query}")
            print(f"{'='*100}")
            
            results = self.evaluate_candidates(query, k=k)
            all_results[query] = results
        
        if save_results:
            output_path = Path('results') / 'evaluation_results.json'
            output_path.parent.mkdir(exist_ok=True)
            
            # Convert results to JSON-serializable format
            json_results = {}
            for query, results in all_results.items():
                json_results[query] = []
                for result in results:
                    clean_result = {k: v for k, v in result.items() 
                                  if k not in ['score_breakdown']}  # Remove non-serializable data
                    json_results[query].append(clean_result)
            
            with open(output_path, 'w') as f:
                json.dump(json_results, f, indent=2)
            
            print(f"\nResults saved to {output_path}")
        
        return all_results

def main():
    # Initialize with custom config
    config = SearchConfig(
        similarity_weight=0.3,
        rerank_weight=0.7,  # Give more weight to reranking
        experience_bonus=1.2,
        skill_match_bonus=0.8
    )
    
    embedder = CandidateEmbeddings(config=config)
    
    # Load candidates
    candidates_path = Path('data') / 'candidates.json'
    embedder.load_candidates(str(candidates_path))
    embedder.generate_embeddings()

    # Save index
    index_path = Path('src') / 'embeddings' / 'candidates.index'
    index_path.parent.mkdir(parents=True, exist_ok=True)
    embedder.save_index(str(index_path))

    # Single query evaluation with explanation
    query = "Looking for senior AI engineer with 5+ years experience in LangChain"
    print("="*100)
    print("SINGLE QUERY EVALUATION WITH EXPLANATIONS")
    print("="*100)
    embedder.evaluate_candidates(query, k=3, explain=True)

    # Multiple queries evaluation
    queries = [
        "Looking for senior AI engineer with 5+ years experience in LangChain",
        "Need a remote Python expert with RAG experience",
        "Seeking ML engineer with 3+ years at top AI companies",
        "Junior React developer for frontend position",
        "Lead data scientist with AWS experience"
    ]
    
    print(f"\n{'='*100}")
    print("BATCH EVALUATION")
    print(f"{'='*100}")
    embedder.batch_evaluate(queries, k=3, save_results=True)

if __name__ == "__main__":
    main()