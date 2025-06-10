const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  onboardingComplete: {
    type: Boolean,
    default: false
  },
  companyName: {
    type: String,
    trim: true
  },
  industrySector: {
    type: String,
    trim: true
  },
  companySize: {
    type: Number
  },
  officeLocations: [{
    type: String,
    trim: true
  }],
  keyDepartments: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true,
});

module.exports = mongoose.model('User', userSchema);
