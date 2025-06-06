const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    // Save user to database
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Error creating user' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        onboardingComplete: user.onboardingComplete,
        companyName: user.companyName,
        industrySector: user.industrySector,
        companySize: user.companySize,
        officeLocations: user.officeLocations,
        keyDepartments: user.keyDepartments,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error logging in' });
  }
};

// Handle company survey submission
exports.submitCompanySurvey = async (req, res) => {
  try {
    const { userId } = req.user; // From auth middleware
    const { 
      companyName, 
      industrySector, 
      companySize, 
      officeLocations, 
      keyDepartments 
    } = req.body;

    // Find and update user
    const user = await User.findByIdAndUpdate(
      userId,
      {
        companyName,
        industrySector,
        companySize,
        officeLocations,
        keyDepartments,
        onboardingComplete: true
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'Company information saved successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        onboardingComplete: user.onboardingComplete,
        companyName: user.companyName,
        industrySector: user.industrySector,
        companySize: user.companySize,
        officeLocations: user.officeLocations,
        keyDepartments: user.keyDepartments,
      },
    });
  } catch (error) {
    console.error('Company survey submission error:', error);
    res.status(500).json({ message: 'Error saving company information' });
  }
};

