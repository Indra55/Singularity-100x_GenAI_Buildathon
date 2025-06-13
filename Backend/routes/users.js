const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const pool = require("../config/dbConfig");
const { generateToken } = require("../config/jwtConfig");
const { jwtAuth } = require("../middleware/jwtAuth");

// Login route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = generateToken(user);
    
    // Return user data (excluding password) and token
    const { password: _, ...userWithoutPassword } = user;
    res.json({
      user: userWithoutPassword,
      token
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Protected route example
router.get("/profile", jwtAuth, async (req, res) => {
  try {
    const result = await pool.query('SELECT id, username, email, onboarding_complete FROM users WHERE id = $1', [req.user.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ user: result.rows[0] });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Logout is handled client-side by removing the token

router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ message: "Please enter all fields" });
  }
  if (password.length < 7) {
    return res.status(400).json({ message: "Password must be at least 8 characters" });
  }

  try {
    const existingUser = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);
    if (existingUser.rows.length > 0) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const result = await pool.query(
      `INSERT INTO users (username, email, password, onboarding_complete) VALUES ($1, $2, $3, $4) RETURNING id, email, username, onboarding_complete`,
      [username, email, hashedPassword, false] // Add onboarding_complete = false
    );

    res.status(201).json({
      message: "User registered successfully",
      user: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res.status(401).json({ message: info.message });
    }

    req.logIn(user, (err) => {
      if (err) return next(err);
      return res.json({
        message: "Logged in successfully",
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          onboarding_complete: user.onboarding_complete || false, // Add this line
        },
      });
    });
  })(req, res, next);
});

router.get("/myprofile", jwtAuth, async (req, res) => {
  try {
    console.log('Fetching profile for user ID:', req.user.id);
    
    // Explicitly select all fields we need
    const query = `
      SELECT 
        id, email, username, 
        company_name, sector, company_size, 
        officelocations, keydepartments,
        created_at, updated_at, onboarding_complete
      FROM users 
      WHERE id = $1
    `;
    
    console.log('Executing query:', query);
    const result = await pool.query(query, [req.user.id]);
    
    if (result.rows.length === 0) {
      console.log('User not found in database');
      return res.status(404).json({ message: 'User not found' });
    }

    const userData = result.rows[0];
    console.log('User data from database:', JSON.stringify(userData, null, 2));
    
    // Format the response data
    const responseData = {
      id: userData.id,
      email: userData.email,
      username: userData.username,
      company_name: userData.company_name || '',
      sector: userData.sector || '',
      company_size: userData.company_size || '',
      officelocations: userData.officelocations || [],
      keydepartments: userData.keydepartments || [],
      created_at: userData.created_at,
      updated_at: userData.updated_at,
      onboarding_complete: userData.onboarding_complete || false
    };

    console.log('Sending response:', JSON.stringify(responseData, null, 2));
    console.log('COMPLETE RESPONSE:', responseData);
    res.json({ user: responseData });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


router.post('/onboarding/:userId', async (req, res) => {
  const { userId } = req.params;
  const { companyName, sector, companySize, officeLocations, keyDepartments } = req.body;

  try {
    const result = await pool.query(
      `UPDATE users 
       SET company_name = $1, sector = $2, company_size = $3, 
           officelocations = $4, keydepartments = $5, onboarding_complete = $6
       WHERE id = $7
       RETURNING *`,
      [companyName, sector, companySize, officeLocations, keyDepartments, true, userId]
    );
    
    res.json({ success: true, user: result.rows[0] });
  } catch (err) {
    console.error('Error saving onboarding data:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});


module.exports = router;
