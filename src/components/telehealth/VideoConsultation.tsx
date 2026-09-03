'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  PhoneOff,
  MessageSquare,
  Shield,
  Send,
  Sparkles,
  Wifi,
  Radio,
  FileText,
  UserCheck
} from 'lucide-react';
import { playChimeSound } from '@/lib/utils/audio';

export const VideoConsultation: React.FC = () => {
  const { activeVideoAppt, setActiveTab, showToast } = useApp();

  const [callState, setCallState] = useState<'waiting' | 'in_call' | 'ended'>('waiting');
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isAudioOnly, setIsAudioOnly] = useState(false);
  const [isRecordingConsent, setIsRecordingConsent] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // In-call chat messages
  const [chatMessages, setChatMessages] = useState<Array<{ sender: string; text: string; time: string }>>([
    { sender: 'Dr. Sophia Patel', text: 'Hello Aditya! Reviewing your latest lipid profile numbers now.', time: '02:01 PM' }
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [callDuration, setCallDuration] = useState(0);

  const localVideoRef = useRef<HTMLVideoElement>(null);

  // Auto admit from waiting room after 3 seconds demo
  useEffect(() => {
    if (callState === 'waiting') {
      const timer = setTimeout(() => {
        setCallState('in_call');
        playChimeSound('dose_taken');
        showToast('Dr. Sophia Patel has admitted you to the consultation.', 'success');
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [callState]);

  // Timer progression during call
  useEffect(() => {
    if (callState === 'in_call') {
      const interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [callState]);

  // Request browser webcam (with fallback)
  useEffect(() => {
    if (callState === 'in_call' && isCameraOn && !isAudioOnly) {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices
          .getUserMedia({ video: true, audio: true })
          .then((stream) => {
            if (localVideoRef.current) {
              localVideoRef.current.srcObject = stream;
            }
          })
          .catch(() => {
            // Camera permission blocked or running in VM without physical camera - realistic simulated stream
          });
      }
    }
  }, [callState, isCameraOn, isAudioOnly]);

  const handleEndCall = () => {
    setCallState('ended');
    playChimeSound('notification');
    showToast('Video consultation ended. Post-consultation e-prescription generated.', 'info');
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;
    setChatMessages((prev) => [
      ...prev,
      { sender: 'You', text: inputMsg, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ]);
    setInputMsg('');
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{ maxWidth: '980px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Top Telehealth Status Bar */}
      <div
        style={{
          padding: '0.75rem 1.25rem',
          background: 'var(--surface-card)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.8rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'var(--primary-light)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Video size={18} />
          </div>
          <div>
            <h3 style={{ fontSize: 'var(--font-sm)', fontWeight: 800 }}>
              Telehealth HD Consultation • {activeVideoAppt?.doctorName || 'Dr. Sophia Patel, MD, FACC'}
            </h3>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Cardiovascular & Lipid Review • End-to-End Encrypted Session
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: 'var(--font-xs)', color: '#10b981', fontWeight: 700 }}>
            <Wifi size={14} />
            <span>HD Connection (32 ms)</span>
          </div>

          <div
            style={{
              padding: '0.3rem 0.65rem',
              borderRadius: 'var(--radius-full)',
              background: 'var(--surface-hover)',
              fontSize: 'var(--font-xs)',
              fontWeight: 800,
              fontVariantNumeric: 'tabular-nums'
            }}
          >
            {formatDuration(callDuration)}
          </div>
        </div>
      </div>

      {/* CALL STATES */}
      {callState === 'waiting' && (
        <div
          className="med-card"
          style={{
            padding: '4rem 2rem',
            textAlign: 'center',
            background: 'var(--surface-card)'
          }}
        >
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              background: 'var(--primary-light)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem auto'
            }}
          >
            <Radio size={36} className="anim-heartbeat" />
          </div>

          <h3 style={{ fontSize: 'var(--font-xl)', fontWeight: 800, marginBottom: '0.4rem' }}>
            Waiting Room: Dr. Sophia Patel
          </h3>
          <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-muted)', maxWidth: '440px', margin: '0 auto 1.5rem auto' }}>
            The physician has been notified and will admit you into the private consultation room momentarily.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.8rem', fontSize: 'var(--font-xs)' }}>
            <span className="badge badge-primary">Encrypted WebRTC</span>
            <span className="badge badge-success">Audio/Video Tested OK</span>
          </div>
        </div>
      )}

      {callState === 'in_call' && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isChatOpen ? '1fr 300px' : '1fr',
            gap: '1rem',
            minHeight: '480px'
          }}
        >
          {/* Main Video Viewport */}
          <div
            style={{
              position: 'relative',
              borderRadius: 'var(--radius-lg)',
              background: '#090d16',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-lg)',
              minHeight: '420px'
            }}
          >
            {/* Doctor's Primary Video Feed */}
            <div
              style={{
                width: '100%',
                height: '100%',
                backgroundImage:
                  'radial-gradient(circle at center, rgba(13, 148, 136, 0.2) 0%, rgba(15, 23, 42, 0.95) 100%), url(https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&auto=format&fit=crop&q=80)',
                backgroundSize: 'cover',
                backgroundPosition: 'center 20%',
                display: 'flex',
                alignItems: 'flex-end',
                padding: '1.25rem'
              }}
            >
              <div
                style={{
                  background: 'rgba(15, 23, 42, 0.75)',
                  backdropFilter: 'blur(10px)',
                  padding: '0.4rem 0.8rem',
                  borderRadius: 'var(--radius-full)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: 'var(--font-xs)',
                  fontWeight: 600
                }}
              >
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
                <span>Dr. Sophia Patel, MD (Cardiology)</span>
              </div>
            </div>

            {/* Patient Self-Preview (PIP Box) */}
            <div
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                width: '150px',
                height: '105px',
                borderRadius: 'var(--radius-sm)',
                overflow: 'hidden',
                background: '#1e293b',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {isCameraOn && !isAudioOnly ? (
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <div style={{ color: 'white', fontSize: '11px', textAlign: 'center' }}>
                  Camera Off
                </div>
              )}
              <div
                style={{
                  position: 'absolute',
                  bottom: '4px',
                  left: '6px',
                  fontSize: '9px',
                  color: 'white',
                  background: 'rgba(0,0,0,0.6)',
                  padding: '1px 4px',
                  borderRadius: '3px'
                }}
              >
                You
              </div>
            </div>

            {/* Call Control Overlay Toolbar */}
            <div
              style={{
                position: 'absolute',
                bottom: '1.5rem',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'rgba(15, 23, 42, 0.85)',
                backdropFilter: 'blur(16px)',
                padding: '0.6rem 1.2rem',
                borderRadius: 'var(--radius-full)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.8rem',
                border: '1px solid rgba(255, 255, 255, 0.15)'
              }}
            >
              {/* Mic Toggle */}
              <button
                onClick={() => setIsMicOn(!isMicOn)}
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  background: isMicOn ? 'rgba(255, 255, 255, 0.15)' : 'var(--emergency-red)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                title={isMicOn ? 'Mute Mic' : 'Unmute Mic'}
              >
                {isMicOn ? <Mic size={18} /> : <MicOff size={18} />}
              </button>

              {/* Camera Toggle */}
              <button
                onClick={() => setIsCameraOn(!isCameraOn)}
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  background: isCameraOn ? 'rgba(255, 255, 255, 0.15)' : 'var(--emergency-red)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                title={isCameraOn ? 'Turn Camera Off' : 'Turn Camera On'}
              >
                {isCameraOn ? <Video size={18} /> : <VideoOff size={18} />}
              </button>

              {/* Chat Toggle */}
              <button
                onClick={() => setIsChatOpen(!isChatOpen)}
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  background: isChatOpen ? 'var(--primary)' : 'rgba(255, 255, 255, 0.15)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                title="In-call Chat"
              >
                <MessageSquare size={18} />
              </button>

              {/* End Call Button */}
              <button
                onClick={handleEndCall}
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  background: 'var(--emergency-red)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                title="End Consultation"
              >
                <PhoneOff size={20} />
              </button>
            </div>
          </div>

          {/* In-Call Live Chat Drawer */}
          {isChatOpen && (
            <div
              className="med-card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                padding: '0.8rem'
              }}
            >
              <div style={{ paddingBottom: '0.6rem', borderBottom: '1px solid var(--border-subtle)', fontWeight: 700, fontSize: 'var(--font-sm)' }}>
                In-Call Notes & Chat
              </div>

              <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.6rem', margin: '0.6rem 0' }}>
                {chatMessages.map((msg, idx) => (
                  <div key={idx} style={{ fontSize: 'var(--font-xs)' }}>
                    <div style={{ fontWeight: 700, color: msg.sender === 'You' ? 'var(--primary)' : '#0284c7' }}>
                      {msg.sender} <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{msg.time}</span>
                    </div>
                    <div style={{ background: 'var(--surface-hover)', padding: '0.4rem 0.6rem', borderRadius: 'var(--radius-xs)', marginTop: '2px' }}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '0.3rem' }}>
                <input
                  type="text"
                  placeholder="Type message..."
                  value={inputMsg}
                  onChange={(e) => setInputMsg(e.target.value)}
                  className="input-control"
                  style={{ padding: '0.4rem 0.6rem', fontSize: 'var(--font-xs)' }}
                />
                <button type="submit" className="btn btn-primary btn-sm">
                  <Send size={13} />
                </button>
              </form>
            </div>
          )}
        </div>
      )}

      {callState === 'ended' && (
        <div
          className="med-card"
          style={{
            padding: '3rem 2rem',
            textAlign: 'center',
            background: 'var(--surface-card)'
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'var(--success-light)',
              color: 'var(--success)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem auto'
            }}
          >
            <UserCheck size={36} />
          </div>

          <h3 style={{ fontSize: 'var(--font-xl)', fontWeight: 800, marginBottom: '0.4rem' }}>
            Consultation Complete
          </h3>
          <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)', maxWidth: '480px', margin: '0 auto 1.5rem auto' }}>
            Dr. Sophia Patel has signed your digital e-prescription. It has been automatically added to your <strong>My Prescriptions</strong> and <strong>Medicines</strong> schedules.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button onClick={() => setActiveTab('medicines')} className="btn btn-primary" style={{ gap: '0.4rem' }}>
              <FileText size={16} />
              <span>View E-Prescription & Medicine Schedule</span>
            </button>
            <button onClick={() => setActiveTab('orders')} className="btn btn-secondary">
              Order Prescribed Medications
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
