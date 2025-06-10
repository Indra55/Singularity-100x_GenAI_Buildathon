const db = require("../config/dbConfig")

const {generateOutreachMsg} = require("../services/outreach_llm_services")

async function generateOutreach(req, res){
    const { userId, candidateIds } = req.body

    try{
        const recruiterRes = await db.query(`SELECT * FROM users WHERE id = $1`,[userId])
        const recruiter = recruiterRes.rows[0]

        const candidatesRes = await db.query(
            "SELECT * FROM candidates WHERE id = ANY($1::uuid[])",
            [candidateIds]
          );
        const candidates = candidatesRes.rows

        const messages = await Promise.all(
            candidates.map(async(candidate)=>{
            const message = await generateOutreachMsg(candidate, recruiter);

                return {
                    candidateID: candidate.id,
                    name: candidate.name,
                    message
                }
            })
        )
        res.json(messages)
    }catch(error){
        console.error("Error generating outreach messages:", error)
        res.status(500).json({error: "Failed to generate outreach messages"})
    }
    
}
module.exports = { generateOutreach };
