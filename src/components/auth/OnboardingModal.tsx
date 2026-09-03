'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Bot,
  Camera,
  Video,
  ShoppingBag,
  ChevronRight,
  Fingerprint,
  Mail,
  Phone,
  Lock,
  ArrowRight,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { playChimeSound } from '@/lib/utils/audio';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose }) => {
  const { showToast } = useApp();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [authMode, setAuthMode] = useState<'onboarding' | 'login' | 'register' | 'otp'>('onboarding');

  const [emailOrPhone, setEmailOrPhone] = useState('aditya@example.com');
  const [password, setPassword] = useState('••••••••');
  const [otpCode, setOtpCode] = useState('');
  const [demoOtp, setDemoOtp] = useState('849201');

  if (!isOpen) return null;

  const slides = [
    {
      icon: Bot,
      title: 'Smart AI Medical Assistant',
      desc: 'Describe your symptoms in natural language or voice. Get non-diagnostic triage guidance, medicine dosage reminders, and instant emergency alerts.',
      tag: '24/7 Clinical AI Support'
    },
    {
      icon: Camera,
      title: 'AI Prescription OCR Scanner',
      desc: 'Snap a photo of handwritten or printed prescriptions. Our computer vision extracts medicine names, dosages, durations, and food instructions instantly.',
      tag: '96% Extraction Accuracy'
    },
    {
      icon: Video,
      title: 'Doctor Appointments & Telehealth',
      desc: 'Consult top board-certified physicians via in-clinic visits or encrypted HD video calls with instant post-call digital prescriptions.',
      tag: '12 Medical Specialties'
    },
    {
      icon: ShoppingBag,
      title: 'Express Pharmacy & Lab Tests',
      desc: 'Order verified genuine medicines with 2-hour express delivery, or book diagnostic blood tests with convenient at-home phlebotomist collection.',
      tag: 'Doorstep Healthcare'
    }
  ];

  const handleNextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      setAuthMode('login');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', email: emailOrPhone, password })
      });
      const data = await res.json();
      if (data.success) {
        playChimeSound('dose_taken');
        showToast(`Welcome back, ${data.user.fullName}!`, 'success');
        onClose();
      }
    } catch (err) {
      showToast('Authentication error', 'error');
    }
  };

  const handleBiometricLogin = async () => {
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'biometric_login' })
      });
      const data = await res.json();
      if (data.success) {
        playChimeSound('dose_taken');
        showToast('Biometric authentication verified (Face ID / Fingerprint)', 'success');
        onClose();
      }
    } catch (err) {
      showToast('Biometric verification failed', 'error');
    }
  };

  const handleSendOTP = async () => {
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'request_otp', phone: emailOrPhone })
      });
      const data = await res.json();
      if (data.demoOtp) {
        setDemoOtp(data.demoOtp);
        setOtpCode(data.demoOtp); // Autofill for convenience
        setAuthMode('otp');
        showToast(`OTP Code sent to ${emailOrPhone}. Demo code: ${data.demoOtp}`, 'info');
      }
    } catch (e) {
      showToast('Error requesting OTP', 'error');
    }
  };

  const handleVerifyOTP = async () => {
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify_otp', code: otpCode })
      });
      const data = await res.json();
      if (data.success) {
        playChimeSound('dose_taken');
        showToast('OTP verified successfully! Logged in.', 'success');
        onClose();
      }
    } catch (e) {
      showToast('Invalid OTP', 'error');
    }
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 1100 }}>
      <div
        className="modal-content"
        style={{
          maxWidth: '480px',
          padding: '2rem',
          borderRadius: 'var(--radius-lg)',
          position: 'relative'
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            fontSize: '18px',
            color: 'var(--text-muted)'
          }}
        >
          ✕
        </button>

        {authMode === 'onboarding' ? (
          <div>
            {/* Slide Header Tag */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
              <span className="badge badge-primary" style={{ padding: '0.35rem 0.85rem' }}>
                <Sparkles size={12} />
                <span>{slides[currentSlide].tag}</span>
              </span>
            </div>

            {/* Slide Graphic/Icon */}
            <div
              style={{
                width: '100px',
                height: '100px',
                borderRadius: '30px',
                background: 'linear-gradient(135deg, var(--primary-light) 0%, rgba(2, 132, 199, 0.15) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem auto',
                color: 'var(--primary)',
                boxShadow: '0 8px 24px var(--primary-glow)'
              }}
            >
              {React.createElement(slides[currentSlide].icon, { size: 52 })}
            </div>

            {/* Title & Description */}
            <h3
              style={{
                fontSize: 'var(--font-xl)',
                fontWeight: 800,
                textAlign: 'center',
                marginBottom: '0.6rem',
                color: 'var(--text-main)'
              }}
            >
              {slides[currentSlide].title}
            </h3>
            <p
              style={{
                fontSize: 'var(--font-sm)',
                color: 'var(--text-secondary)',
                textAlign: 'center',
                lineHeight: 1.6,
                marginBottom: '2rem'
              }}
            >
              {slides[currentSlide].desc}
            </p>

            {/* Slide Dots */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
              {slides.map((_, i) => (
                <div
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  style={{
                    width: currentSlide === i ? '24px' : '8px',
                    height: '8px',
                    borderRadius: '999px',
                    background: currentSlide === i ? 'var(--primary)' : 'var(--border-subtle)',
                    transition: 'all 0.25s ease',
                    cursor: 'pointer'
                  }}
                />
              ))}
            </div>

            {/* Slide Controls */}
            <div style={{ display: 'flex', gap: '0.8rem' }}>
              <button
                onClick={() => setAuthMode('login')}
                className="btn btn-secondary"
                style={{ flex: 1 }}
              >
                Skip to Sign In
              </button>
              <button
                onClick={handleNextSlide}
                className="btn btn-primary"
                style={{ flex: 1 }}
              >
                <span>{currentSlide === slides.length - 1 ? 'Get Started' : 'Next'}</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        ) : authMode === 'otp' ? (
          <div>
            <h3 style={{ fontSize: 'var(--font-xl)', fontWeight: 800, textAlign: 'center', marginBottom: '0.5rem' }}>
              Verify OTP Code
            </h3>
            <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '1.5rem' }}>
              Enter the 6-digit verification code sent to {emailOrPhone}
            </p>

            <div style={{ marginBottom: '1.25rem' }}>
              <input
                type="text"
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                placeholder="849201"
                className="input-control"
                style={{
                  textAlign: 'center',
                  fontSize: '24px',
                  fontWeight: 800,
                  letterSpacing: '0.3em'
                }}
              />
              <div style={{ fontSize: '11px', color: 'var(--primary)', textAlign: 'center', marginTop: '0.4rem', fontWeight: 600 }}>
                Demo OTP Auto-Filled: {demoOtp}
              </div>
            </div>

            <button onClick={handleVerifyOTP} className="btn btn-primary" style={{ width: '100%', marginBottom: '0.8rem' }}>
              Verify & Log In
            </button>
            <button onClick={() => setAuthMode('login')} className="btn btn-secondary" style={{ width: '100%' }}>
              Back to Password Login
            </button>
          </div>
        ) : (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: 'var(--font-xl)', fontWeight: 800 }}>Welcome to MediAI</h3>
              <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                Secure clinical healthcare authentication
              </p>
            </div>

            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={{ fontSize: 'var(--font-xs)', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.3rem' }}>
                  Email or Mobile Number
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    required
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    className="input-control"
                    style={{ paddingLeft: '2.4rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: 'var(--font-xs)', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.3rem' }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-control"
                    style={{ paddingLeft: '2.4rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 'var(--font-xs)' }}>
                <button type="button" onClick={handleSendOTP} style={{ color: 'var(--primary)', fontWeight: 600 }}>
                  Log in via SMS OTP
                </button>
                <a href="#forgot" onClick={(e) => { e.preventDefault(); showToast('Reset instructions sent to registered email.', 'info'); }} style={{ color: 'var(--text-muted)' }}>
                  Forgot password?
                </a>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
                Sign In
              </button>
            </form>

            <div style={{ position: 'relative', margin: '1.25rem 0', textAlign: 'center' }}>
              <div style={{ height: '1px', background: 'var(--border-subtle)', width: '100%' }} />
              <span style={{ position: 'absolute', top: '-9px', left: '50%', transform: 'translateX(-50%)', background: 'var(--surface-card)', padding: '0 0.6rem', fontSize: '11px', color: 'var(--text-muted)' }}>
                OR QUICK ACCESS
              </span>
            </div>

            {/* Biometric One-Tap Login */}
            <button
              onClick={handleBiometricLogin}
              className="btn btn-secondary"
              style={{
                width: '100%',
                border: '1px solid var(--primary)',
                color: 'var(--primary)',
                fontWeight: 700
              }}
            >
              <Fingerprint size={18} />
              <span>Biometric Login (Face ID / Touch ID)</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
