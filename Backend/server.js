const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

// Import routes
const flaskProxyRouter = require("./routes/flaskProxyRoutes");
const outreachRoutes = require("./routes/outreach");
const jdRoutes = require('./routes/jd');
const usersRoutes = require('./routes/users');
const resumeRoutes = require('./routes/resume');
const talentPoolRoutes = require('./routes/talentPool');
const candidateInteractionsRoutes = require('./routes/candidateInteractions');
const generatedCandidatesRoutes = require('./routes/generatedCandidates');

// CORS configuration
app.use(cors({
  origin: "https://singularity-100x-gen-ai-buildathon.vercel.app/" || "http://localhost:8081",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

// Simple route for health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use("/users", usersRoutes);
app.use('/candidates', flaskProxyRouter);
app.use("/outreach", outreachRoutes);
app.use("/jd", jdRoutes);
app.use("/resume", resumeRoutes);
app.use("/talent-pool", talentPoolRoutes);
app.use("/candidate-interactions", candidateInteractionsRoutes);
app.use("/generated-candidates", generatedCandidatesRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 4100;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
