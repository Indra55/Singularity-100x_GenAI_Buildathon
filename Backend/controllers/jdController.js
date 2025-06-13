const { generateJD } = require('../services/jd_llm_service');

/**
 * @route   POST /api/jd/generate
 * @desc    Generate a job description based on provided details
 * @access  Private
 */
const generateJobDescription = async (req, res) => {
    try {
        const {
            job_title,
            department,
            company_overview,
            responsibilities,
            required_skills,
            preferred_skills = '',
            work_type,
            location,
            employment_type,
            seniority_level,
            salary_range = '',
            perks = '',
            tone = 'Professional'
        } = req.body;

        // Validate required fields
        if (!job_title || !department || !company_overview || !responsibilities || 
            !required_skills || !work_type || !location || !employment_type || !seniority_level) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields. Please provide all necessary job details.'
            });
        }

        // Prepare the candidate and recruiter objects for the service
        const jobDetails = {
            job_title,
            department,
            company_overview,
            responsibilities,
            required_skills,
            preferred_skills,
            work_type,
            location,
            employment_type,
            seniority_level,
            salary_range,
            perks,
            tone
        };

        // Generate the job description
        const jobDescription = await generateJD(jobDetails, req.user);

        res.status(200).json({
            success: true,
            data: jobDescription
        });

    } catch (error) {
        console.error('Error generating job description:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to generate job description',
            error: error.message
        });
    }
};

module.exports = {
    generateJobDescription
};