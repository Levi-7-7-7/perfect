import React, { useState } from 'react';

const API_BASE = 'https://poly-activity-points.onrender.com/api'; // Change if running locally

function App() {
  const [step, setStep] = useState('enterRegisterNumber'); // steps: enterRegisterNumber, verifyOtp, login, profile
  const [registerNumber, setRegisterNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [batch, setBatch] = useState('');
  const [branch, setBranch] = useState('');
  const [token, setToken] = useState('');
  const [profile, setProfile] = useState(null);
  const [message, setMessage] = useState('');

  const submitRegisterNumber = async () => {
    setMessage('');
    if (!registerNumber.trim()) {
      setMessage('Please enter your register number.');
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ registerNumber }),
      });
      const data = await res.json();
      if (res.ok) {
        setStep('verifyOtp');
        setMessage('OTP sent to your college email.');
      } else {
        setMessage(data.message || 'Error sending OTP.');
      }
    } catch {
      setMessage('Network error sending OTP.');
    }
  };

  const submitVerifyOtp = async () => {
    setMessage('');
    if (!otp.trim() || !password.trim() || !batch.trim() || !branch.trim()) {
      setMessage('Please fill in all fields.');
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ registerNumber, otp, password, batch, branch }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Password set successfully. Please login now.');
        setStep('login');
        // Clear OTP and related inputs (optional)
        setOtp('');
        setBatch('');
        setBranch('');
        setPassword('');
      } else {
        setMessage(data.message || 'Error verifying OTP.');
      }
    } catch {
      setMessage('Network error verifying OTP.');
    }
  };

  const submitLogin = async () => {
    setMessage('');
    if (!registerNumber.trim() || !password.trim()) {
      setMessage('Please enter register number and password.');
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ registerNumber, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setToken(data.token);
        setProfile(data.user);
        setMessage(`Welcome, ${data.user.name}!`);
        setStep('profile');
      } else {
        setMessage(data.message || 'Login failed.');
      }
    } catch {
      setMessage('Network error during login.');
    }
  };

  const logout = () => {
    setStep('enterRegisterNumber');
    setRegisterNumber('');
    setOtp('');
    setPassword('');
    setBatch('');
    setBranch('');
    setToken('');
    setProfile(null);
    setMessage('');
  };

  return (
    <div style={{ maxWidth: 400, margin: '2rem auto', fontFamily: 'Arial, sans-serif' }}>
      <h2>Activity Points System - Test Frontend</h2>
      {message && <p style={{ color: 'blue' }}>{message}</p>}

      {step === 'enterRegisterNumber' && (
        <>
          <h3>Enter Register Number to Get OTP</h3>
          <input
            type="text"
            placeholder="Register Number"
            value={registerNumber}
            onChange={e => setRegisterNumber(e.target.value)}
            style={{ width: '100%', marginBottom: 10 }}
          />
          <button onClick={submitRegisterNumber} style={{ width: '100%' }}>
            Send OTP
          </button>
        </>
      )}

      {step === 'verifyOtp' && (
        <>
          <h3>Verify OTP & Set Password, Batch & Branch</h3>
          <input
            type="text"
            placeholder="OTP"
            value={otp}
            onChange={e => setOtp(e.target.value)}
            style={{ width: '100%', marginBottom: 10 }}
          />
          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{ width: '100%', marginBottom: 10 }}
          />
          <input
            type="text"
            placeholder="Batch (e.g. 2023-2026)"
            value={batch}
            onChange={e => setBatch(e.target.value)}
            style={{ width: '100%', marginBottom: 10 }}
          />
          <input
            type="text"
            placeholder="Branch (e.g. Computer Engineering)"
            value={branch}
            onChange={e => setBranch(e.target.value)}
            style={{ width: '100%', marginBottom: 10 }}
          />
          <button onClick={submitVerifyOtp} style={{ width: '100%', marginBottom: 5 }}>
            Verify & Set Password
          </button>
          <button onClick={() => setStep('enterRegisterNumber')} style={{ width: '100%' }}>
            Back
          </button>
        </>
      )}

      {step === 'login' && (
        <>
          <h3>Login</h3>
          <input
            type="text"
            placeholder="Register Number"
            value={registerNumber}
            onChange={e => setRegisterNumber(e.target.value)}
            style={{ width: '100%', marginBottom: 10 }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{ width: '100%', marginBottom: 10 }}
          />
          <button onClick={submitLogin} style={{ width: '100%', marginBottom: 5 }}>
            Login
          </button>
          <button onClick={() => setStep('enterRegisterNumber')} style={{ width: '100%' }}>
            Back
          </button>
        </>
      )}

      {step === 'profile' && profile && (
        <>
          <h3>User Profile</h3>
          <p><strong>Name:</strong> {profile.name}</p>
          <p><strong>Register Number:</strong> {profile.registerNumber}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Role:</strong> {profile.role}</p>
          <p><strong>Batch:</strong> {profile.batch || 'Not set'}</p>
          <p><strong>Branch:</strong> {profile.branch || 'Not set'}</p>
          <button onClick={logout} style={{ width: '100%' }}>
            Logout
          </button>
        </>
      )}
    </div>
  );
}

export default App;
