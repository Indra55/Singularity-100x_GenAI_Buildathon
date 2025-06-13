const express = require("express");
const router = express.Router();
const { generateOutreach, sendOutreachEmails } = require("../controllers/outreachController");


router.post("/generate-outreach", generateOutreach);
router.post("/send-outreach-emails", sendOutreachEmails);

module.exports = router;
