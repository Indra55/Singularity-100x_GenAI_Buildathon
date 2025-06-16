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

// Enhanced onboarding route with better error handling and logging
router.post('/onboarding/:userId', async (req, res) => {
  const { userId } = req.params;
  const { companyName, sector, companySize, officeLocations, keyDepartments } = req.body;

  console.log('=== ONBOARDING REQUEST ===');
  console.log('User ID:', userId);
  console.log('Request Body:', JSON.stringify(req.body, null, 2));
  console.log('Headers:', JSON.stringify(req.headers, null, 2));

  // Validate required fields
  if (!companyName || !sector || !companySize || !officeLocations || !keyDepartments) {
    console.log('Validation failed - missing required fields');
    return res.status(400).json({ 
      success: false, 
      message: 'All fields are required',
      received: { companyName, sector, companySize, officeLocations, keyDepartments }
    });
  }

  // Validate arrays
  if (!Array.isArray(officeLocations) || !Array.isArray(keyDepartments)) {
    console.log('Validation failed - arrays expected');
    return res.status(400).json({ 
      success: false, 
      message: 'officeLocations and keyDepartments must be arrays' 
    });
  }

  if (officeLocations.length === 0 || keyDepartments.length === 0) {
    console.log('Validation failed - empty arrays');
    return res.status(400).json({ 
      success: false, 
      message: 'At least one office location and one department are required' 
    });
  }

  try {
    // First, check if user exists
    const userCheck = await pool.query('SELECT id FROM users WHERE id = $1', [userId]);
    if (userCheck.rows.length === 0) {
      console.log('User not found:', userId);
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    console.log('Updating user with data...');
    const result = await pool.query(
      `UPDATE users 
       SET company_name = $1, sector = $2, company_size = $3, 
           officelocations = $4::text[], keydepartments = $5::text[], onboarding_complete = $6, updated_at = CURRENT_TIMESTAMP
       WHERE id = $7
       RETURNING id, username, email, company_name, sector, company_size, 
                 officelocations, keydepartments, onboarding_complete, updated_at`,
      [companyName, sector, companySize, officeLocations, keyDepartments, true, userId]
    );
    
    if (result.rows.length === 0) {
      console.log('Update failed - no rows affected');
      return res.status(400).json({ 
        success: false, 
        message: 'Failed to update user' 
      });
    }

    const updatedUser = result.rows[0];
    console.log('Update successful:', JSON.stringify(updatedUser, null, 2));
    
    res.json({ 
      success: true, 
      message: 'Onboarding completed successfully',
      user: {
        ...updatedUser,
        // Parse JSON fields for frontend
        officelocations: typeof updatedUser.officelocations === 'string' 
          ? JSON.parse(updatedUser.officelocations) 
          : updatedUser.officelocations,
        keydepartments: typeof updatedUser.keydepartments === 'string' 
          ? JSON.parse(updatedUser.keydepartments) 
          : updatedUser.keydepartments
      }
    });

  } catch (err) {
    console.error('=== ONBOARDING ERROR ===');
    console.error('Error details:', err);
    console.error('Stack trace:', err.stack);
    
    res.status(500).json({ 
      success: false, 
      message: 'Server error during onboarding',
      error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
  }
});

// Enhanced profile route with better data formatting
router.get("/myprofile", jwtAuth, async (req, res) => {
  try {
    console.log('=== PROFILE REQUEST ===');
    console.log('Fetching profile for user ID:', req.user.id);
    
    const query = `
      SELECT 
        id, email, username, 
        company_name, sector, company_size, 
        officelocations, keydepartments,
        created_at, updated_at, onboarding_complete
      FROM users 
      WHERE id = $1
    `;
    
    const result = await pool.query(query, [req.user.id]);
    
    if (result.rows.length === 0) {
      console.log('User not found in database');
      return res.status(404).json({ message: 'User not found' });
    }

    const userData = result.rows[0];
    console.log('Raw user data from database:', JSON.stringify(userData, null, 2));
    
    // Format the response data and handle JSON parsing
    const responseData = {
      id: userData.id,
      email: userData.email,
      username: userData.username,
      company_name: userData.company_name || '',
      sector: userData.sector || '',
      company_size: userData.company_size || '',
      officelocations: userData.officelocations ? 
        (typeof userData.officelocations === 'string' ? 
          JSON.parse(userData.officelocations) : userData.officelocations) : [],
      keydepartments: userData.keydepartments ? 
        (typeof userData.keydepartments === 'string' ? 
          JSON.parse(userData.keydepartments) : userData.keydepartments) : [],
      created_at: userData.created_at,
      updated_at: userData.updated_at,
      onboarding_complete: userData.onboarding_complete || false,
      hasCompletedOnboarding: userData.onboarding_complete || false
    };

    console.log('Formatted response data:', JSON.stringify(responseData, null, 2));
    res.json({ user: responseData });

  } catch (error) {
    console.error('=== PROFILE FETCH ERROR ===');
    console.error('Error details:', error);
    console.error('Stack trace:', error.stack);
    
    res.status(500).json({  
      message: 'Server error', 
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});
module.exports = router;
