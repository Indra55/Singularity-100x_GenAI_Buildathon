const express = require('express');
const router = express.Router();
const pool = require('../config/dbConfig');

// Store a generated candidate
router.post('/', async (req, res) => {
  const { user_id, candidate_data, source_type } = req.body;
  
  try {
    const query = `
      INSERT INTO generated_candidates (user_id, candidate_data, source_type)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;

    const result = await pool.query(query, [user_id, candidate_data, source_type]);
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error storing generated candidate:', error);
    res.status(500).json({ error: 'Failed to store candidate' });
  }
});

// Get all generated candidates for a user
router.get('/user/:userId', async (req, res) => {
  const { userId } = req.params;
  const { status = 'ACTIVE' } = req.query;
  
  try {
    const query = `
      SELECT * FROM generated_candidates 
      WHERE user_id = $1 AND status = $2
      ORDER BY created_at DESC;
    `;

    const result = await pool.query(query, [userId, status]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching generated candidates:', error);
    res.status(500).json({ error: 'Failed to fetch candidates' });
  }
});

// Update candidate status
router.patch('/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  try {
    const query = `
      UPDATE generated_candidates 
      SET status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *;
    `;

    const result = await pool.query(query, [status, id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Candidate not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating candidate status:', error);
    res.status(500).json({ error: 'Failed to update candidate status' });
  }
});

// Update candidate data
router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const { candidate_data } = req.body;
  
  try {
    const query = `
      UPDATE generated_candidates 
      SET candidate_data = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *;
    `;

    const result = await pool.query(query, [candidate_data, id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Candidate not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating candidate data:', error);
    res.status(500).json({ error: 'Failed to update candidate data' });
  }
});

module.exports = router; 