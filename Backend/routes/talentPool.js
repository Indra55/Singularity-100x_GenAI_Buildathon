const express = require('express');
const router = express.Router();
const pool = require('../config/dbConfig');
const axios = require('axios');

// Helper function to parse years of experience
const parseYearsOfExperience = (yearsStr) => {
    if (!yearsStr) return null;
    
    // Remove any non-numeric characters except decimal point
    const cleaned = yearsStr.toString().replace(/[^0-9.]/g, '');
    
    // Parse to float and round to nearest integer
    const years = parseFloat(cleaned);
    return isNaN(years) ? null : Math.round(years);
};

// Add a single candidate to talent pool
router.post('/add-candidate', async (req, res) => {
    try {
        const candidate = req.body;
        
        const query = `
            INSERT INTO candidates (
                name,
                email,
                phone,
                title,
                location,
                years_of_experience,
                skills,
                work_preference,
                education,
                past_companies,
                summary,
                linkedin_url,
                portfolio_url,
                status,
                created_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, NOW())
            RETURNING id, name, email
        `;

        const values = [
            candidate.name || null,
            candidate.email || null,
            candidate.phone || null,
            candidate.experience?.currentRole || null,
            candidate.candidate?.location || null,
            parseYearsOfExperience(candidate.experience?.years),
            candidate.skills || [],
            candidate.workPreference || null,
            candidate.education ? `${candidate.education.degree}, ${candidate.education.university}` : null,
            candidate.experience?.previousRoles || [],
            candidate.summary || null,
            candidate.candidate?.linkedin || null,
            candidate.candidate?.portfolio || null,
            'New'
        ];

        const result = await pool.query(query, values);
        
        // Generate embeddings for the new candidate
        try {
            await axios.post('http://localhost:5001/candidates/regenerate-embeddings');
        } catch (embeddingError) {
            console.error('Error generating embeddings:', embeddingError);
            // Don't fail the request if embedding generation fails
        }
        
        res.json({ 
            success: true, 
            message: 'Candidate added to talent pool',
            candidate: result.rows[0]
        });
    } catch (error) {
        console.error('Error adding candidate:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to add candidate',
            error: error.message 
        });
    }
});

// Add multiple candidates to talent pool
router.post('/add-candidates', async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const candidates = req.body;
        const addedCandidates = [];

        for (const candidate of candidates) {
            const query = `
                INSERT INTO candidates (
                    name,
                    email,
                    phone,
                    title,
                    location,
                    years_of_experience,
                    skills,
                    work_preference,
                    education,
                    past_companies,
                    summary,
                    linkedin_url,
                    portfolio_url,
                    status,
                    created_at
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, NOW())
                RETURNING id, name, email
            `;

            const values = [
                candidate.name || null,
                candidate.email || null,
                candidate.phone || null,
                candidate.experience?.currentRole || null,
                candidate.candidate?.location || null,
                parseYearsOfExperience(candidate.experience?.years),
                candidate.skills || [],
                candidate.workPreference || null,
                candidate.education ? `${candidate.education.degree}, ${candidate.education.university}` : null,
                candidate.experience?.previousRoles || [],
                candidate.summary || null,
                candidate.candidate?.linkedin || null,
                candidate.candidate?.portfolio || null,
                'New'
            ];

            const result = await client.query(query, values);
            addedCandidates.push(result.rows[0]);
        }

        await client.query('COMMIT');
        
        // Generate embeddings for all new candidates
        try {
            await axios.post('http://localhost:5001/candidates/regenerate-embeddings');
        } catch (embeddingError) {
            console.error('Error generating embeddings:', embeddingError);
            // Don't fail the request if embedding generation fails
        }
        
        res.json({ 
            success: true, 
            message: `Added ${addedCandidates.length} candidates to talent pool`,
            candidates: addedCandidates
        });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error adding candidates:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to add candidates',
            error: error.message 
        });
    } finally {
        client.release();
    }
});

module.exports = router; 