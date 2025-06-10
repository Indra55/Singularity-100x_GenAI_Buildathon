const fs = require("fs");
const { Pool } = require("pg");

console.log("Starting migration script...");

const pool = new Pool({
  user: "hitanshu",
  host: "localhost",
  database: "x100",
  password: "hitanshu2005",
  port: 5432,
});

const slugify = (name) =>
  name
    ? name.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "")
    : "unknown";

(async () => {
  try {
    console.log("Reading candidates.json...");
    const data = fs.readFileSync("candidates.json", "utf8");
    console.log("File read successfully.");

    const candidates = JSON.parse(data);

    if (!Array.isArray(candidates)) {
      throw new Error("JSON data is not an array of candidates");
    }

    for (const candidate of candidates) {
      if (!candidate.name) {
        console.warn("Skipping candidate with missing name:", candidate);
        continue;
      }

      candidate.screening_questions = [candidate.screeningQuestion || ""];
      candidate.screening_answers = [null];

      const nameSlug = slugify(candidate.name);

      candidate.linkedin_url = `https://linkedin.com/in/${nameSlug}`;
      candidate.portfolio_url = `https://github.com/${nameSlug}`;

      const query = `
        INSERT INTO candidates (
          name, email, phone, photo, title, location,
          years_of_experience, skills, work_preference, education,
          past_companies, summary, available_from,
          screening_questions, screening_answers, linkedin_url,
          portfolio_url, status, score, resume
        ) VALUES (
          $1, $2, $3, $4, $5, $6,
          $7, $8, $9, $10,
          $11, $12, $13,
          $14, $15, $16,
          $17, $18, $19, $20
        );
      `;

      const values = [
        candidate.name,
        candidate.email || `${nameSlug}@example.com`,
        candidate.phone || null,
        candidate.photo || null,
        candidate.title || null,
        candidate.location || null,
        candidate.yearsOfExperience || null,
        candidate.skills || [],
        candidate.workPreference || null,
        candidate.education || null,
        candidate.pastCompanies || [],
        candidate.summary || null,
        candidate.availableFrom || null,
        candidate.screening_questions,
        candidate.screening_answers,
        candidate.linkedin_url,
        candidate.portfolio_url,
        candidate.status || null,
        candidate.score || null,
        candidate.resume || null,
      ];

      console.log(`Inserting candidate: ${candidate.name}`);
      try {
        await pool.query(query, values);
        console.log(`Inserted candidate: ${candidate.name} successfully`);
      } catch (insertErr) {
        console.error(`Error inserting candidate ${candidate.name}:`, insertErr);
      }
    }
  } catch (err) {
    console.error("Error in script:", err);
  } finally {
    await pool.end();
    console.log("Database connection closed.");
  }
})();
