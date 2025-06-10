const express = require("express");
const router = express.Router();
const { generateOutreach } = require("../controllers/outreachController");

router.post("/generate-outreach", generateOutreach);

module.exports = router;
