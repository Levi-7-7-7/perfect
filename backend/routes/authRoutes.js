const express = require('express');
const router = express.Router();
const { sendOtp, verifyOtpAndSetPassword, login, getProfile } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtpAndSetPassword);
router.post('/login', login);
router.get('/me', authMiddleware, getProfile);

module.exports = router;
