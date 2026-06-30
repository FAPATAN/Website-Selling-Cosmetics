import API_URL from '../config';
import React, { useState, useEffect, useRef } from 'react';
import { Mail, ArrowLeft, Loader2, CheckCircle, Lock, KeyRound } from 'lucide-react';

const API = `${API_URL}/api`;

const styles = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: linear-gradient(135deg, #a8c0ff 0%, #ec4899 50%, #fbbf24 100%);
    min-height: 100vh;
  }

  .app-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
  }

  .auth-card {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    border-radius: 35px;
    box-shadow: 0 30px 80px rgba(0,0,0,0.35), 0 0 1px rgba(255,255,255,0.5) inset;
    width: 100%;
    max-width: 500px;
    overflow: visible;
    border: 1px solid rgba(255,255,255,0.3);
  }

 
  .decorative-shape {
    position: absolute;
    border: 3px solid rgba(255, 255, 255, 0.5);
    border-radius: 30px;
    pointer-events: none;
  }

  .shape-1 {
    width: 150px;
    height: 280px;
    top: -40px;
    left: -20px;
    transform: rotate(-25deg);
    animation: float1 4s ease-in-out infinite;
  }

  .shape-2 {
    width: 200px;
    height: 250px;
    bottom: -30px;
    right: -50px;
    transform: rotate(20deg);
    animation: float2 5s ease-in-out infinite;
  }

  @keyframes float1 {
    0%, 100% { transform: rotate(-15deg) translateY(0); }
    50% { transform: rotate(-15deg) translateY(-10px); }
  }

  @keyframes float2 {
    0%, 100% { transform: rotate(15deg) translateY(0); }
    50% { transform: rotate(15deg) translateY(10px); }
  }

  .card-content {
    padding: 40px;
  }

  .description {
    text-align: center;
    margin-bottom: 24px;
    font-size: 15px;
    color: #6b7280;
    line-height: 1.6;
  }

  .input-wrapper {
    margin-bottom: 20px;
  }

  .input-label {
    display: block;
    margin-bottom: 8px;
    font-size: 14px;
    font-weight: 600;
    color: #374151;
  }

  .input-container {
    position: relative;
  }

  .input-icon {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    color: #FF8FAB;
    z-index: 1;
  }

  .input-field {
    width: 100%;
    padding: 14px 16px 14px 44px;
    border: 2px solid #e5e7eb;
    border-radius: 25px;
    font-size: 15px;
    transition: all 0.3s;
    outline: none;
    background: rgba(255,255,255,0.9);
  }

  .input-field:focus {
    border-color: #FF8FAB;
    box-shadow: 0 0 0 4px #FFE5EC;
    background: white;
    transform: translateY(-2px);
  }

  .otp-container {
    display: flex;
    gap: 12px;
    justify-content: center;
    margin: 24px 0;
  }

  .otp-input {
    width: 60px;
    height: 60px;
    text-align: center;
    font-size: 24px;
    font-weight: bold;
    border: 2px solid #e5e7eb;
    border-radius: 12px;
    transition: all 0.3s;
    outline: none;
    background: #f9fafb;
  }

  .otp-input:focus {
    border-color: #FCDEE2;
    background: white;
    box-shadow: 0 0 0 3px rgba(102,126,234,0.1);
  }

  .btn-primary {
    width: 100%;
    padding: 14px;
    background: linear-gradient(90deg, #FFC6CF 40%, #D9B0CD 100%);
    color: white;
    border: none;
    border-radius: 25px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: all 0.3s;
    margin-top: 8px;
  }

  .btn-primary:hover:not(:disabled) {
    transform: translateY(-3px);
    box-shadow: 0 15px 30px #F9ACC0;
  }

  .btn-primary:active:not(:disabled) {
    transform: translateY(-1px);
  }

  .btn-primary:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .btn-secondary {
    width: 100%;
    padding: 12px;
    background: transparent;
    color: #FB6F92;
    border: 2px solid #e5e7eb;
    border-radius: 25px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: all 0.3s;
    margin-top: 12px;
  }

  .btn-secondary:hover {
    border-color: #FF8FAB;
  }

  .alert-message {
    padding: 14px 16px;
    border-radius: 12px;
    font-size: 14px;
    margin-bottom: 16px;
    border-left: 4px solid;
    animation: slideIn 0.3s ease-out;
  }

  .alert-message.error {
    background: #fef2f2;
    color: #991b1b;
    border-left-color: #dc2626;
  }

  .alert-message.success {
    background: #f0fdf4;
    color: #166534;
    border-left-color: #22c55e;
  }

  .success-container {
    padding: 60px 40px;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 24px;
    animation: slideIn 0.5s ease-out;
  }

  .success-icon {
    color: #22c55e;
    animation: slideIn 0.6s ease-out;
  }

  .success-title {
    font-size: 28px;
    font-weight: bold;
    color: #1f2937;
  }

  .success-text {
    font-size: 16px;
    color: #6b7280;
    line-height: 1.6;
  }

  .spinning {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  .timer-text {
    text-align: center;
    font-size: 14px;
    color: #6b7280;
    margin-top: 16px;
  }

  .resend-btn {
    color: #FF9292;
    font-weight: 600;
    cursor: pointer;
    text-decoration: underline;
    background: none;
    border: none;
    padding: 0;
    font-size: 14px;
  }

  .resend-btn:hover:not(:disabled) {
    color: #764ba2;
  }

  .resend-btn:disabled {
    color: #9ca3af;
    cursor: not-allowed;
    text-decoration: none;
  }

  .info-box {
    border: 1px solid #FB6F92;
    border-radius: 12px;
    padding: 12px 16px;
    margin-top: 16px;
    font-size: 13px;
    color: #FF9292;
    text-align: center;
  }
`;

export default function ForgotPasswordSystem() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [timer, setTimer] = useState(0);
  const [resetToken, setResetToken] = useState('');
  
  const otpRefs = useRef([]);

  const apiBase = API;

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleSendOTP = async () => {
    setError('');
    setSuccess('');

    if (!email) {
      setError('??????????????');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('?????????????????????');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/check-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '??????????????');
      }

      setResetToken(data.token);
      setSuccess('??????? OTP ???????????????????? ?????????????????');
      setStep(2);
      setTimer(300);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOTP = async () => {
    setError('');

    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      setError('????????????? OTP ?????? 6 ????');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${apiBase}/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: otpCode, token: resetToken })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '???? OTP ??????????');
      }

      setSuccess('?????? OTP ??????');
      setStep(3);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (timer > 0) return;
    
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/check-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, token: resetToken })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '??????????????');
      }

      setSuccess('??????? OTP ???????? ?????????????????');
      setTimer(300);
      setOtp(['', '', '', '', '', '']);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setError('');

    if (!newPassword || !confirmPassword) {
      setError('???????????????????????');
      return;
    }

    if (newPassword.length < 6) {
      setError('??????????????????????? 6 ????????');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('?????????????????');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${apiBase}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword, token: resetToken })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '??????????????');
      }

      setSuccess('?????????????????????');
      setStep(4);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    window.location.href = '/';
  };

  const renderEmailStep = () => (
    <div>
      <div className="description">
        ??????????????????????????? ???????????? OTP ??????????????????????
      </div>

      {error && <div className="alert-message error">{error}</div>}
      {success && <div className="alert-message success">{success}</div>}

      <div className="input-wrapper">
        <label className="input-label">?????</label>
        <div className="input-container">
          <Mail className="input-icon" size={20} />
          <input
            type="email"
            className="input-field"
            placeholder="example@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendOTP()}
            disabled={loading}
          />
        </div>
      </div>

      <button className="btn-primary" onClick={handleSendOTP} disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="spinning" size={20} />
            ????????...
          </>
        ) : (
          <>
            <Mail size={20} />
            ??????? OTP
          </>
        )}
      </button>

      <button className="btn-secondary" onClick={handleBackToLogin}>
        <ArrowLeft size={20} />
        ?????????????????????
      </button>

      <div className="info-box">
        ?? ??????????????? OTP 6 ???????????? (?????????? 1-2 ????)
      </div>
    </div>
  );

  const renderOtpStep = () => (
    <div>
      <div className="description">
        ????????????? OTP 6 ?????????<br />
        <strong>{email}</strong>
      </div>

      {error && <div className="alert-message error">{error}</div>}
      {success && <div className="alert-message success">{success}</div>}

      <div className="otp-container">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => (otpRefs.current[index] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            className="otp-input"
            value={digit}
            onChange={(e) => handleOtpChange(index, e.target.value)}
            onKeyDown={(e) => handleOtpKeyDown(index, e)}
            disabled={loading}
          />
        ))}
      </div>

      <button className="btn-primary" onClick={handleVerifyOTP} disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="spinning" size={20} />
            ????????????...
          </>
        ) : (
          <>
            <CheckCircle size={20} />
            ?????? OTP
          </>
        )}
      </button>

      <div className="timer-text">
        {timer > 0 ? (
          <>???????????????? {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, '0')}</>
        ) : (
          <>
            ??????????????{' '}
            <button
              className="resend-btn"
              onClick={handleResendOTP}
              disabled={loading}
            >
              ???????????
            </button>
          </>
        )}
      </div>

      <button 
        className="btn-secondary" 
        onClick={() => {
          setStep(1);
          setOtp(['', '', '', '', '', '']);
          setError('');
        }}
      >
        <ArrowLeft size={20} />
        ????????????
      </button>

      <div className="info-box">
        ?? ??????????? Inbox ??? Spam folder
      </div>
    </div>
  );

  const renderPasswordStep = () => (
    <div>
      <div className="description">
        ?????????????????????????????????
      </div>

      {error && <div className="alert-message error">{error}</div>}

      <div className="input-wrapper">
        <label className="input-label">????????????</label>
        <div className="input-container">
          <Lock className="input-icon" size={20} />
          <input
            type="password"
            className="input-field"
            placeholder="????????? 6 ????????"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            disabled={loading}
          />
        </div>
      </div>

      <div className="input-wrapper">
        <label className="input-label">??????????????????</label>
        <div className="input-container">
          <KeyRound className="input-icon" size={20} />
          <input
            type="password"
            className="input-field"
            placeholder="????????????????????"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleResetPassword()}
            disabled={loading}
          />
        </div>
      </div>

      <button className="btn-primary" onClick={handleResetPassword} disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="spinning" size={20} />
            ???????????...
          </>
        ) : (
          <>
            <CheckCircle size={20} />
            ??????????????????
          </>
        )}
      </button>

      <div className="info-box">
        ?? ?????????????????????????????????
      </div>
    </div>
  );

  const renderSuccessStep = () => (
    <div className="success-container">
      <CheckCircle className="success-icon" size={80} />
      <h2 className="success-title">?????????????????????!</h2>
      <p className="success-text">
        ???????????????????????????????????????????
      </p>
      <button className="btn-primary" onClick={handleBackToLogin}>
        ?????????????????
      </button>
    </div>
  );

  return (
    <>
      <style>{styles}</style>
      <div className="app-container">
        <div className="auth-card">
          <div className="video-header">
          </div>

          <div className="card-content">
            {step === 1 && renderEmailStep()}
            {step === 2 && renderOtpStep()}
            {step === 3 && renderPasswordStep()}
            {step === 4 && renderSuccessStep()}
          </div>
        </div>
      </div>
    </>
  );
}
