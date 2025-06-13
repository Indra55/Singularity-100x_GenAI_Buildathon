const db = require("../config/dbConfig");
const { generateOutreachMsg } = require("../services/outreach_llm_services");
const { sendOutreachEmail } = require("../services/emailService");

async function generateOutreach(req, res) {
    const { userId, candidateIds } = req.body;

    try {
        const recruiterRes = await db.query(`SELECT * FROM users WHERE id = $1`, [userId]);
        const recruiter = recruiterRes.rows[0];

        const candidatesRes = await db.query(
            "SELECT * FROM candidates WHERE id = ANY($1::uuid[])",
            [candidateIds]
        );
        const candidates = candidatesRes.rows;

        const messages = await Promise.all(
            candidates.map(async (candidate) => {
                const message = await generateOutreachMsg(candidate, recruiter);
                return {
                    candidateID: candidate.id,
                    name: candidate.name,
                    email: candidate.email,
                    message
                }; 
            })
        );
        res.json(messages);
    } catch (error) {
        console.error("Error generating outreach messages:", error);
        res.status(500).json({ error: "Failed to generate outreach messages" });
    }
}

async function sendOutreachEmails(req, res) {
    let { userId, candidateMessages } = req.body;
    
    // Fallback user ID if not provided
    const FALLBACK_USER_ID = '8014a4e0-7a24-4ca3-bf80-b785ae565764';
    userId = userId || FALLBACK_USER_ID;
    
    console.log('Using userId:', userId);
    console.log('Candidate messages:', JSON.stringify(candidateMessages, null, 2));

    try {
        const recruiterRes = await db.query(`SELECT * FROM users WHERE id = $1`, [userId]);
        const recruiter = recruiterRes.rows[0];
        
        if (!recruiter) {
            console.error(`No recruiter found with ID: ${userId}`);
            throw new Error('Recruiter not found in database');
        }
        
        console.log('Recruiter data:', JSON.stringify({
            id: recruiter.id,
            name: recruiter.name,
            company: recruiter.company_name || recruiter.company
        }, null, 2));
        
        const candidateIds = candidateMessages.map(cm => cm.candidateId);
        const candidatesRes = await db.query(
            "SELECT id, email, name FROM candidates WHERE id = ANY($1::uuid[])",
            [candidateIds]
        );
        
        const candidatesMap = new Map(candidatesRes.rows.map(c => [c.id, c]));

        const results = await Promise.all(
            candidateMessages.map(async ({ candidateId, message }) => {
                const candidate = candidatesMap.get(candidateId);
                if (!candidate) {
                    return {
                        candidateId,
                        success: false,
                        error: 'Candidate not found'
                    };
                }

                try {
                    const emailResult = await sendOutreachEmail({
                        to: candidate.email,
                        subject: `Hi ${candidate.name.split(' ')[0]}, Exciting Opportunity at ${recruiter.company_name || recruiter.company || 'Our Company'}`,
                        html: `<div>${message.replace(/\n/g, '<br>')}</div>`,
                        from: `${recruiter.name} <noreply@hitanshu.tech>`
                    });

                    return {
                        candidateId,
                        email: candidate.email,
                        success: true,
                        message: 'Email sent successfully',
                        data: emailResult
                    };
                } catch (error) {
                    console.error(`Error sending email to ${candidate.email}:`, error);
                    return {
                        candidateId,
                        email: candidate.email,
                        success: false,
                        error: error.message
                    };
                }
            })
        );

        const allSuccessful = results.every(result => result.success);
        
        if (allSuccessful) {
            return res.json({ 
                success: true, 
                message: 'All outreach emails sent successfully',
                results 
            });
        } else {
            return res.status(207).json({
                success: false,
                message: 'Some emails failed to send',
                results
            });
        }
    } catch (error) {
        console.error('Error in sendOutreachEmails:', error);
        return res.status(500).json({ 
            error: 'Failed to send outreach emails',
            details: error.message 
        });
    }
}

module.exports = { 
    generateOutreach,
    sendOutreachEmails
};
