const Student = require('../models/Student');
const Tutor = require('../models/Tutor');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
require('dotenv').config();

// Generate a 6-digit numeric OTP string
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Configure Nodemailer transporter for Gmail SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Send OTP to user's registered college email if registerNumber exists
exports.sendOtp = async (req, res) => {
  try {
    const { registerNumber } = req.body;
    if (!registerNumber) return res.status(400).json({ message: 'Register number is required' });

    // Find user by registerNumber in Student or Tutor collections
    let user = await Student.findOne({ registerNumber });
    let role = 'student';
    if (!user) {
      user = await Tutor.findOne({ registerNumber });
      role = 'tutor';
    }

    if (!user) return res.status(404).json({ message: 'User not found' });

    // Generate OTP and expiry (10 minutes)
    const otp = generateOTP();
    const expiry = new Date(Date.now() + 10 * 60 * 1000);

    // Save OTP and expiry to user document
    user.otp = otp;
    user.otpExpiry = expiry;
    await user.save();

    // Compose mail options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Your OTP for Activity Points App',
      text: `Your OTP is: ${otp}. It is valid for 10 minutes.`
    };

    // Send email
    transporter.sendMail(mailOptions, (err) => {
      if (err) {
        console.error('Error sending OTP email:', err);
        return res.status(500).json({ message: 'Failed to send OTP', error: err });
      }
      return res.status(200).json({ message: 'OTP sent successfully to your college email' });
    });

  } catch (err) {
    console.error('sendOtp error:', err);
    res.status(500).json({ message: 'Server error while sending OTP' });
  }
};

// Verify OTP, set password, batch, and branch (all required)
exports.verifyOtpAndSetPassword = async (req, res) => {
  try {
    const { registerNumber, otp, password, batch, branch } = req.body;
    if (!registerNumber || !otp || !password || !batch || !branch)
      return res.status(400).json({ message: 'All fields are required' });

    // Find user
    let user = await Student.findOne({ registerNumber });
    let role = 'student';
    if (!user) {
      user = await Tutor.findOne({ registerNumber });
      role = 'tutor';
    }

    if (!user) return res.status(404).json({ message: 'User not found' });

    // Verify OTP and expiry
    if (user.otp !== otp || user.otpExpiry < new Date())
      return res.status(400).json({ message: 'Invalid or expired OTP' });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user fields
    user.password = hashedPassword;
    user.batch = batch;
    user.branch = branch;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    return res.status(200).json({ message: 'Password and profile set successfully. You can now login.' });
  } catch (err) {
    console.error('verifyOtpAndSetPassword error:', err);
    res.status(500).json({ message: 'Server error during OTP verification' });
  }
};

// Login with registerNumber and password
exports.login = async (req, res) => {
  try {
    const { registerNumber, password } = req.body;
    if (!registerNumber || !password)
      return res.status(400).json({ message: 'All fields required' });

    // Find user
    let user = await Student.findOne({ registerNumber });
    let role = 'student';
    if (!user) {
      user = await Tutor.findOne({ registerNumber });
      role = 'tutor';
    }

    if (!user || !user.password) return res.status(401).json({ message: 'Invalid credentials' });

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, registerNumber: user.registerNumber, role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' } // token expiry optional
    );

    // Respond with user details including batch and branch
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        name: user.name,
        registerNumber: user.registerNumber,
        email: user.email,
        role,
        batch: user.batch || null,
        branch: user.branch || null
      }
    });

  } catch (err) {
    console.error('login error:', err);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// Get logged-in user profile
exports.getProfile = async (req, res) => {
  try {
    const { role, id } = req.user;
    let user;
    if (role === 'tutor') {
      user = await Tutor.findById(id).select('-password -otp -otpExpiry');
    } else {
      user = await Student.findById(id).select('-password -otp -otpExpiry');
    }
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ user });
  } catch (err) {
    console.error('getProfile error:', err);
    res.status(500).json({ message: 'Error fetching user', error: err });
  }
};
