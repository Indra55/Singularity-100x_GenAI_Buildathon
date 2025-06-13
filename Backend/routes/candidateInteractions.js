const express = require('express');
const router = express.Router();
const pool = require('../config/dbConfig');

// Record a candidate interaction (swipe left/right or view)
router.post('/', async (req, res) => {
  const { user_id, candidate_id, interaction_type } = req.body;
  
  try {
    // Validate interaction type
    if (!['VIEW', 'SWIPE_LEFT', 'SWIPE_RIGHT'].includes(interaction_type)) {
      return res.status(400).json({ error: 'Invalid interaction type' });
    }

    const query = `
      INSERT INTO candidate_interactions (user_id, candidate_id, interaction_type)
      VALUES ($1, $2, $3)
      ON CONFLICT (user_id, candidate_id, interaction_type) 
      DO UPDATE SET created_at = CURRENT_TIMESTAMP
      RETURNING *;
    `;

    const result = await pool.query(query, [user_id, candidate_id, interaction_type]);
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error recording candidate interaction:', error);
    res.status(500).json({ error: 'Failed to record interaction' });
  }
});

// Get all interactions for a user
router.get('/user/:userId', async (req, res) => {
  const { userId } = req.params;
  
  try {
    const query = `
      SELECT * FROM candidate_interactions 
      WHERE user_id = $1 
      ORDER BY created_at DESC;
    `;

    const result = await pool.query(query, [userId]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching user interactions:', error);
    res.status(500).json({ error: 'Failed to fetch interactions' });
  }
});

// Get interaction count for a candidate
router.get('/candidate/:candidateId', async (req, res) => {
  const { candidateId } = req.params;
  
  try {
    const query = `
      SELECT interaction_type, COUNT(*) as count
      FROM candidate_interactions 
      WHERE candidate_id = $1 
      GROUP BY interaction_type;
    `;

    const result = await pool.query(query, [candidateId]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching candidate interactions:', error);
    res.status(500).json({ error: 'Failed to fetch interactions' });
  }
});

module.exports = router; 