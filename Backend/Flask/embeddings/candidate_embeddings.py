import json
import numpy as np
import psycopg2
from psycopg2.extras import RealDictCursor
from sentence_transformers import SentenceTransformer
from typing import List, Dict, Optional
import logging
import os
from flask import Blueprint, Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
load_dotenv() 





logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
candidates_bp = Blueprint('candidates_embeddings', __name__)


class PostgresVectorSearch:
    def __init__(self, 
                 db_config: Dict,
                 model_name: str = 'all-MiniLM-L6-v2'):
        
        self.model = SentenceTransformer(model_name)
        self.db_config = db_config
        self.dimension = self.model.get_sentence_embedding_dimension()
        
        self._setup_database()

    def _setup_database(self):
        """Setup PostgreSQL database with pgvector extension and embedding column"""
        try:
            conn = psycopg2.connect(**self.db_config)
            cur = conn.cursor()
            
            # Enable required extensions
            cur.execute("CREATE EXTENSION IF NOT EXISTS vector;")
            cur.execute("CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";")
            
            # Add embedding column to existing candidates table if it doesn't exist
            cur.execute("""
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name = 'candidates' AND column_name = 'embedding';
            """)
            
            if not cur.fetchone():
                logger.info("Adding embedding column to candidates table...")
                cur.execute(f"ALTER TABLE candidates ADD COLUMN embedding vector({self.dimension});")
            
            # Create indexes for vector search and filters
            cur.execute("CREATE INDEX IF NOT EXISTS idx_years_exp ON candidates(years_of_experience);")
            cur.execute("CREATE INDEX IF NOT EXISTS idx_work_pref ON candidates(work_preference);")
            cur.execute("CREATE INDEX IF NOT EXISTS idx_status ON candidates(status);")
            cur.execute("CREATE INDEX IF NOT EXISTS idx_available_from ON candidates(available_from);")
            
            conn.commit()
            cur.close()
            conn.close()
            
            logger.info("Database setup completed successfully")
            
        except Exception as e:
            logger.error(f"Database setup failed: {e}")
            raise

    def _create_vector_index(self):
        """Create vector index after embeddings are generated"""
        try:
            conn = psycopg2.connect(**self.db_config)
            cur = conn.cursor()
            
            # Check if vector index exists
            cur.execute("""
                SELECT EXISTS (
                    SELECT 1 FROM pg_indexes 
                    WHERE indexname = 'candidates_embedding_idx'
                );
            """)
            
            if not cur.fetchone()[0]:
                logger.info("Creating vector index...")
                cur.execute("""
                    CREATE INDEX candidates_embedding_idx 
                    ON candidates USING ivfflat (embedding vector_cosine_ops)
                    WITH (lists = 100);
                """)
                conn.commit()
                logger.info("Vector index created successfully")
            
            cur.close()
            conn.close()
            
        except Exception as e:
            logger.error(f"Vector index creation failed: {e}")

    def generate_embeddings_for_existing_candidates(self, batch_size: int = 50):
        """Generate embeddings for candidates that don't have them yet"""
        try:
            conn = psycopg2.connect(**self.db_config)
            cur = conn.cursor(cursor_factory=RealDictCursor)
            
            # Get candidates without embeddings
            cur.execute("""
                SELECT id, name, email, title, location, years_of_experience,
                       skills, work_preference, education, past_companies, summary
                FROM candidates 
                WHERE embedding IS NULL
                ORDER BY created_at;
            """)
            
            candidates = cur.fetchall()
            
            if not candidates:
                logger.info("All candidates already have embeddings")
                cur.close()
                conn.close()
                return
            
            logger.info(f"Generating embeddings for {len(candidates)} candidates...")
            
            # Process in batches
            for i in range(0, len(candidates), batch_size):
                batch = candidates[i:i+batch_size]
                
                # Generate embeddings for batch
                texts = []
                candidate_ids = []
                
                for candidate in batch:
                    text = self._create_candidate_text(dict(candidate))
                    texts.append(text)
                    candidate_ids.append(candidate['id'])
                
                # Generate embeddings
                embeddings = self.model.encode(texts, normalize_embeddings=True)
                
                # Update database
                update_cur = conn.cursor()
                for candidate_id, embedding in zip(candidate_ids, embeddings):
                    update_cur.execute("""
                        UPDATE candidates 
                        SET embedding = %s, updated_at = NOW()
                        WHERE id = %s;
                    """, (embedding.tolist(), candidate_id))
                
                conn.commit()
                update_cur.close()
                
                logger.info(f"Processed batch {i//batch_size + 1}/{(len(candidates)-1)//batch_size + 1}")
            
            cur.close()
            conn.close()
            
            # Create vector index after generating embeddings
            self._create_vector_index()
            
            logger.info("Embedding generation completed successfully")
            
        except Exception as e:
            logger.error(f"Error generating embeddings: {e}")
            raise

    def _create_candidate_text(self, candidate: Dict) -> str:
        """Create text representation for embedding from your schema"""
        fields = [
            candidate.get('title', ''),
            candidate.get('name', ''),
            candidate.get('location', ''),
            f"{candidate.get('years_of_experience', 0)} years experience",
            ' '.join(candidate.get('skills', []) if candidate.get('skills') else []),
            candidate.get('work_preference', ''),
            candidate.get('education', ''),
            ' '.join(candidate.get('past_companies', []) if candidate.get('past_companies') else []),
            candidate.get('summary', ''),
        ]
        return ' '.join([str(field) for field in fields if field])

    def search(self, query: str, k: int = 5, filters: Optional[Dict] = None) -> List[Dict]:
        """Search candidates with optional filters using your schema"""
        try:
            # Generate query embedding
            query_embedding = self.model.encode([query], normalize_embeddings=True)[0]
            
            # Build SQL query with your actual columns
            # In your search method:
            sql = """
                SELECT 
                    id, name, email, phone, photo, title, location, 
                    years_of_experience, skills, work_preference, education, 
                    past_companies, summary, available_from, linkedin_url, 
                    portfolio_url, status,
                    ROUND(10 + (1 - (embedding <=> %s::vector)) * 90) as similarity_score
                FROM candidates
                WHERE embedding IS NOT NULL
            """
            
            params = [query_embedding.tolist()]
            where_conditions = []
            
            # Add filters based on your schema
            if filters:
                if filters.get('min_experience'):
                    where_conditions.append("years_of_experience >= %s")
                    params.append(filters['min_experience'])
                
                if filters.get('max_experience'):
                    where_conditions.append("years_of_experience <= %s")
                    params.append(filters['max_experience'])
                
                if filters.get('work_preference'):
                    where_conditions.append("LOWER(work_preference) = LOWER(%s)")
                    params.append(filters['work_preference'])
                
                if filters.get('location'):
                    where_conditions.append("LOWER(location) ILIKE LOWER(%s)")
                    params.append(f"%{filters['location']}%")
                
                if filters.get('status'):
                    where_conditions.append("LOWER(status) = LOWER(%s)")
                    params.append(filters['status'])
                
                if filters.get('available_from'):
                    where_conditions.append("available_from <= %s")
                    params.append(filters['available_from'])
                
                if filters.get('min_score'):
                    where_conditions.append("score >= %s")
                    params.append(filters['min_score'])
                
                if filters.get('skills'):
                    # Check if candidate has any of the required skills
                    skill_conditions = []
                    for skill in filters['skills']:
                        skill_conditions.append("LOWER(%s) = ANY(SELECT LOWER(unnest(skills)))")
                        params.append(skill)
                    if skill_conditions:
                        where_conditions.append(f"({' OR '.join(skill_conditions)})")
            
            if where_conditions:
                sql += " AND " + " AND ".join(where_conditions)
            
            sql += " ORDER BY similarity_score DESC LIMIT %s;"
            params.append(k)
            
            # Execute query
            conn = psycopg2.connect(**self.db_config)
            cur = conn.cursor(cursor_factory=RealDictCursor)
            cur.execute(sql, params)
            results = cur.fetchall()
            cur.close()
            conn.close()
            
            # Convert to list of dictionaries and handle UUID serialization
            candidates = []
            for row in results:
                candidate = dict(row)
                # Convert UUID to string for JSON serialization
                if candidate.get('id'):
                    candidate['id'] = str(candidate['id'])
                # Convert date to string
                if candidate.get('available_from'):
                    candidate['available_from'] = candidate['available_from'].isoformat()
                candidates.append(candidate)
            
            return candidates
            
        except Exception as e:
            logger.error(f"Search failed: {e}")
            raise

    def get_stats(self) -> Dict:
        """Get database statistics using your schema"""
        try:
            conn = psycopg2.connect(**self.db_config)
            cur = conn.cursor()
            
            # Total candidates
            cur.execute("SELECT COUNT(*) FROM candidates;")
            total_count = cur.fetchone()[0]
            
            # Candidates with embeddings
            cur.execute("SELECT COUNT(*) FROM candidates WHERE embedding IS NOT NULL;")
            embedded_count = cur.fetchone()[0]
            
            # Status distribution
            cur.execute("""
                SELECT status, COUNT(*) 
                FROM candidates 
                WHERE status IS NOT NULL AND status != ''
                GROUP BY status 
                ORDER BY COUNT(*) DESC;
            """)
            status_stats = cur.fetchall()
            
            # Work preference distribution
            cur.execute("""
                SELECT work_preference, COUNT(*) 
                FROM candidates 
                WHERE work_preference IS NOT NULL AND work_preference != ''
                GROUP BY work_preference 
                ORDER BY COUNT(*) DESC;
            """)
            work_pref_stats = cur.fetchall()
            
            # Experience distribution
            cur.execute("""
                SELECT 
                    CASE 
                        WHEN years_of_experience < 2 THEN '0-1 years'
                        WHEN years_of_experience < 5 THEN '2-4 years'
                        WHEN years_of_experience < 10 THEN '5-9 years'
                        ELSE '10+ years'
                    END as exp_range,
                    COUNT(*)
                FROM candidates 
                WHERE years_of_experience IS NOT NULL
                GROUP BY exp_range
                ORDER BY MIN(years_of_experience);
            """)
            exp_stats = cur.fetchall()
            
            cur.close()
            conn.close()
            
            return {
                'total_candidates': total_count,
                'candidates_with_embeddings': embedded_count,
                'embedding_coverage': f"{(embedded_count/total_count*100):.1f}%" if total_count > 0 else "0%",
                'status_distribution': dict(status_stats),
                'work_preferences': dict(work_pref_stats),
                'experience_distribution': dict(exp_stats)
            }
            
        except Exception as e:
            logger.error(f"Error getting stats: {e}")
            return {'error': str(e)}


# Database configuration
DB_CONFIG = {
    'host': os.getenv('DB_HOST', 'localhost'),
    'database': os.getenv('DB_DB', 'candidates_db'),
    'user': os.getenv('DB_USER', 'postgres'),
    'password': os.getenv('DB_PASSWORD', 'password'),
    'port': os.getenv('DB_PORT', 5432)
}

# Initialize search system
postgres_search = PostgresVectorSearch(DB_CONFIG)

def initialize_system():
    """Initialize the system by generating embeddings for existing candidates"""
    try:
        postgres_search.generate_embeddings_for_existing_candidates()
        return True
    except Exception as e:
        logger.error(f"Initialization failed: {e}")
        return False

# Flask routes
@candidates_bp.route('/search', methods=['POST'])
def search_candidates():
    data = request.get_json()
    if not data or not data.get('query'):
        return jsonify({'error': 'Missing query'}), 400
    
    try:
        # Extract filters based on your schema
        filters = {}
        if data.get('min_experience'):
            filters['min_experience'] = data['min_experience']
        if data.get('max_experience'):
            filters['max_experience'] = data['max_experience']
        if data.get('work_preference'):
            filters['work_preference'] = data['work_preference']
        if data.get('location'):
            filters['location'] = data['location']
        if data.get('status'):
            filters['status'] = data['status']
        if data.get('available_from'):
            filters['available_from'] = data['available_from']
        if data.get('min_score'):
            filters['min_score'] = data['min_score']
        if data.get('skills'):
            filters['skills'] = data['skills']
        
        results = postgres_search.search(
            query=data['query'],
            k=data.get('top_k', 5),
            filters=filters if filters else None
        )
        
        return jsonify({
            'status': 'success',
            'query': data['query'],
            'filters': filters,
            'candidates': results,
            'count': len(results)
        })
        
    except Exception as e:
        logger.error(f"Search failed: {e}")
        return jsonify({'error': str(e)}), 500

@candidates_bp.route('/candidates', methods=['POST'])
def add_candidate():
    """Add a new candidate with automatic embedding generation"""
    data = request.get_json()
    
    # Validate required fields
    if not data.get('name') or not data.get('email'):
        return jsonify({'error': 'Name and email are required'}), 400
    
    try:
        conn = psycopg2.connect(**postgres_search.db_config)
        cur = conn.cursor()
        
        # Insert new candidate
        cur.execute("""
            INSERT INTO candidates (
                name, email, phone, photo, title, location, years_of_experience,
                skills, work_preference, education, past_companies, summary,
                available_from, screening_questions, screening_answers,
                linkedin_url, portfolio_url, status, score
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING id;
        """, (
            data['name'], 
            data['email'], 
            data.get('phone'),
            data.get('photo'),
            data.get('title'), 
            data.get('location'), 
            data.get('years_of_experience', 0),
            data.get('skills', []), 
            data.get('work_preference'),
            data.get('education'), 
            data.get('past_companies', []),
            data.get('summary'), 
            data.get('available_from'),
            data.get('screening_questions', []),
            data.get('screening_answers', []),
            data.get('linkedin_url'), 
            data.get('portfolio_url'),
            data.get('status', 'active'),
            data.get('score')
        ))
        
        candidate_id = cur.fetchone()[0]
        
        # Generate embedding for new candidate
        text = postgres_search._create_candidate_text(data)
        embedding = postgres_search.model.encode([text], normalize_embeddings=True)[0]
        
        cur.execute(
            "UPDATE candidates SET embedding = %s WHERE id = %s",
            (embedding.tolist(), candidate_id)
        )
        
        conn.commit()
        cur.close()
        conn.close()
        
        return jsonify({
            'status': 'success',
            'candidate_id': str(candidate_id),
            'message': 'Candidate added successfully with embedding generated'
        })
        
    except Exception as e:
        logger.error(f"Error adding candidate: {e}")
        return jsonify({'error': str(e)}), 500

@candidates_bp.route('/candidates/<candidate_id>', methods=['PUT'])
def update_candidate(candidate_id):
    """Update an existing candidate and regenerate embedding"""
    data = request.get_json()
    
    try:
        conn = psycopg2.connect(**postgres_search.db_config)
        cur = conn.cursor()
        
        # Build dynamic update query
        update_fields = []
        params = []
        
        for field in ['name', 'email', 'phone', 'photo', 'title', 'location', 
                     'years_of_experience', 'skills', 'work_preference', 'education',
                     'past_companies', 'summary', 'available_from', 'screening_questions',
                     'screening_answers', 'linkedin_url', 'portfolio_url', 'status', 'score']:
            if field in data:
                update_fields.append(f"{field} = %s")
                params.append(data[field])
        
        if not update_fields:
            return jsonify({'error': 'No fields to update'}), 400
        
        # Add updated_at
        update_fields.append("updated_at = NOW()")
        params.append(candidate_id)
        
        # Update candidate
        cur.execute(f"""
            UPDATE candidates 
            SET {', '.join(update_fields)}
            WHERE id = %s
            RETURNING name, title, location, years_of_experience, skills, 
                     work_preference, education, past_companies, summary;
        """, params)
        
        updated_data = cur.fetchone()
        
        if updated_data:
            # Regenerate embedding with updated data
            candidate_dict = {
                'name': updated_data[0],
                'title': updated_data[1],
                'location': updated_data[2],
                'years_of_experience': updated_data[3],
                'skills': updated_data[4],
                'work_preference': updated_data[5],
                'education': updated_data[6],
                'past_companies': updated_data[7],
                'summary': updated_data[8]
            }
            
            text = postgres_search._create_candidate_text(candidate_dict)
            embedding = postgres_search.model.encode([text], normalize_embeddings=True)[0]
            
            cur.execute(
                "UPDATE candidates SET embedding = %s WHERE id = %s",
                (embedding.tolist(), candidate_id)
            )
        
        conn.commit()
        cur.close()
        conn.close()
        
        return jsonify({
            'status': 'success',
            'message': 'Candidate updated successfully with new embedding'
        })
        
    except Exception as e:
        logger.error(f"Error updating candidate: {e}")
        return jsonify({'error': str(e)}), 500

@candidates_bp.route('/generate-embeddings', methods=['POST'])
def generate_embeddings():
    """Manually trigger embedding generation"""
    try:
        postgres_search.generate_embeddings_for_existing_candidates()
        return jsonify({
            'status': 'success',
            'message': 'Embeddings generated successfully'
        })
    except Exception as e:
        logger.error(f"Embedding generation failed: {e}")
        return jsonify({'error': str(e)}), 500

@candidates_bp.route('/stats', methods=['GET'])
def get_stats():
    """Get database statistics"""
    return jsonify(postgres_search.get_stats())

@candidates_bp.route('/health', methods=['GET'])
def health_check():
    stats = postgres_search.get_stats()
    return jsonify({
        'status': 'healthy',
        'total_candidates': stats.get('total_candidates', 0),
        'embedding_coverage': stats.get('embedding_coverage', '0%')
    })

if __name__ == '__main__':
    if initialize_system():
        logger.info("System initialized successfully")
        app.run(debug=True, host='0.0.0.0', port=5001)
    else:
        logger.error("Failed to initialize system")