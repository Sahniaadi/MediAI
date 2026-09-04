'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  AlertTriangle,
  PhoneCall,
  MapPin,
  Share2,
  Navigation,
  Activity,
  Heart,
  ShieldAlert,
  Clock,
  ExternalLink,
  ChevronRight,
  BookOpen
} from 'lucide-react';
import { playChimeSound } from '@/lib/utils/audio';

export const EmergencyModal: React.FC = () => {
  const { isEmergencyOpen, setIsEmergencyOpen, patientProfile, showToast } = useApp();
  const [activeGuide, setActiveGuide] = useState<string | null>(null);

  if (!isEmergencyOpen) return null;

  const handleSOSCall = (number: string) => {
    playChimeSound('emergency');
    window.location.href = `tel:${number}`;
  };

  const handleShareLocation = () => {
    const coords = '39.7817, -89.6501';
    const text = `EMERGENCY ALERT: I need urgent medical assistance. My current location is: https://maps.google.com/?q=${coords} (Patient: ${patientProfile?.fullName || 'Aditya Sharma'})`;
    navigator.clipboard.writeText(text);
    showToast('Emergency SOS location copied to clipboard. Ready to send via SMS/WhatsApp!', 'success');
  };

  const firstAidGuides = [
    {
      id: 'cpr',
      title: 'Adult CPR (Hands-Only)',
      steps: [
        'Check for responsiveness: Tap shoulders firmly and shout "Are you okay?".',
        'Call 911 immediately or instruct someone else to call.',
        'Position hands: Place heel of one hand in center of chest, interlock fingers of second hand.',
        'Push hard and fast: 100 to 120 compressions per minute (to the beat of "Stayin Alive"), at least 2 inches deep.',
        'Do not stop until paramedics arrive or an automated external defibrillator (AED) is ready.'
      ]
    },
    {
      id: 'choking',
      title: 'Choking (Heimlich Maneuver)',
      steps: [
        'Recognize the universal choking sign (hands clutched to throat, unable to speak or cough).',
        'Stand behind the person with one leg forward for balance.',
        'Make a fist with one hand and place thumb side just above the navel.',
        'Grasp your fist with your other hand and give quick, upward abdominal thrusts.',
        'Repeat until airway obstruction is cleared or person becomes unresponsive.'
      ]
    },
    {
      id: 'stroke',
      title: 'Stroke Warning Signs (FAST Test)',
      steps: [
        'F - FACE: Ask the person to smile. Does one side of the face droop?',
        'A - ARMS: Ask the person to raise both arms. Does one arm drift downward?',
        'S - SPEECH: Ask the person to repeat a simple phrase. Is speech slurred or strange?',
        'T - TIME: If you see ANY of these signs, call 911 immediately. Every minute matters for brain tissue!'
      ]
    },
    {
      id: 'heart_attack',
      title: 'Suspected Heart Attack',
      steps: [
        'Symptoms: Crushing chest pain/pressure radiating to jaw, left arm, cold sweats, nausea.',
        'Call 911 immediately. Do not attempt to drive to the hospital yourself.',
        'Keep patient seated in a calm, semi-reclined resting position.',
        'Loosen tight clothing around neck and waist.',
        'If not allergic and instructed by emergency dispatch, chew 1 adult aspirin (325mg) or 2 baby aspirins.'
      ]
    },
    {
      id: 'bleeding',
      title: 'Severe Bleeding Control',
      steps: [
        'Apply firm, continuous direct pressure with a clean cloth or sterile gauze.',
        'Do not remove soaked dressings; add more cloth on top.',
        'Keep pressure maintained continuously without lifting to check.',
        'Elevate injured limb above heart level if no fracture is suspected.'
      ]
    }
  ];

  return (
    <div
      className="modal-overlay"
      style={{
        background: 'rgba(15, 23, 42, 0.85)',
        zIndex: 1000
      }}
      onClick={() => setIsEmergencyOpen(false)}
    >
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: 'min(680px, 95vw)',
          border: '2px solid var(--emergency-red)',
          padding: '1.25rem',
          background: 'var(--surface-card)'
        }}
      >
        {/* Header Alert */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingBottom: '1rem',
            borderBottom: '1px solid var(--border-subtle)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: 'var(--emergency-light)',
                color: 'var(--emergency-red)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <ShieldAlert size={26} className="anim-heartbeat" />
            </div>
            <div>
              <h2 style={{ fontSize: 'var(--font-xl)', fontWeight: 800, color: 'var(--emergency-red)' }}>
                EMERGENCY SOS
              </h2>
              <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>
                Immediate clinical assistance & urgent emergency response
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsEmergencyOpen(false)}
            style={{
              fontSize: '20px',
              padding: '0.4rem',
              color: 'var(--text-muted)'
            }}
          >
            ✕
          </button>
        </div>

        {/* Big Action Emergency Buttons */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(200px, 100%), 1fr))',
            gap: '0.85rem',
            margin: '1rem 0'
          }}
        >
          {/* 911 Direct Call */}
          <button
            onClick={() => handleSOSCall('911')}
            className="btn btn-danger"
            style={{
              padding: '1.2rem 1rem',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.4rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: 'var(--font-lg)', fontWeight: 800 }}>
              <PhoneCall size={24} />
              <span>Call 911 / 112</span>
            </div>
            <span style={{ fontSize: '11px', opacity: 0.9 }}>Connect with local ambulance & paramedics</span>
          </button>

          {/* Emergency Contact */}
          <button
            onClick={() => handleSOSCall(patientProfile?.emergencyContactPhone || '+15559871100')}
            className="btn btn-secondary"
            style={{
              padding: '1.2rem 1rem',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.4rem',
              border: '2px solid var(--emergency-red)',
              color: 'var(--emergency-red)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: 'var(--font-md)', fontWeight: 700 }}>
              <Heart size={20} />
              <span>Call Emergency Contact</span>
            </div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              {patientProfile?.emergencyContactName || 'Rajesh Sharma'} ({patientProfile?.emergencyContactRelation || 'Father'})
            </span>
          </button>
        </div>

        {/* Share GPS Location */}
        <div
          style={{
            background: 'var(--surface-hover)',
            padding: '1rem',
            borderRadius: 'var(--radius-sm)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.25rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <MapPin size={20} color="var(--primary)" />
            <div>
              <div style={{ fontWeight: 700, fontSize: 'var(--font-sm)' }}>Your Live GPS Coordinates</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                39.7817° N, 89.6501° W • 742 Evergreen Terrace, Springfield
              </div>
            </div>
          </div>
          <button
            onClick={handleShareLocation}
            className="btn btn-outline btn-sm"
            style={{ gap: '0.35rem' }}
          >
            <Share2 size={14} />
            <span>Share SOS Link</span>
          </button>
        </div>

        {/* Nearest Hospital Card */}
        <div
          style={{
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-sm)',
            padding: '1rem',
            marginBottom: '1.25rem',
            background: 'var(--surface-card)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span className="badge badge-danger">24/7 Level 1 Trauma ER</span>
                <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--primary)' }}>1.8 km (4 mins drive)</span>
              </div>
              <h4 style={{ fontWeight: 700, fontSize: 'var(--font-md)', marginTop: '0.3rem' }}>
                Springfield Memorial University Hospital
              </h4>
              <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>
                100 Medical Center Parkway, Springfield
              </p>
            </div>
            <a
              href="https://maps.google.com"
              target="_blank"
              rel="noreferrer"
              className="btn btn-secondary btn-sm"
              style={{ gap: '0.3rem' }}
            >
              <Navigation size={13} />
              <span>Get Directions</span>
            </a>
          </div>
        </div>

        {/* First Aid Quick Guides */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.6rem' }}>
            <BookOpen size={16} color="var(--primary)" />
            <h4 style={{ fontSize: 'var(--font-sm)', fontWeight: 700 }}>First-Aid Immediate Quick Guides</h4>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {firstAidGuides.map((guide) => (
              <div
                key={guide.id}
                style={{
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-xs)',
                  overflow: 'hidden'
                }}
              >
                <div
                  onClick={() => setActiveGuide(activeGuide === guide.id ? null : guide.id)}
                  style={{
                    padding: '0.6rem 0.8rem',
                    background: activeGuide === guide.id ? 'var(--surface-hover)' : 'var(--surface-card)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: 'var(--font-sm)'
                  }}
                >
                  <span>{guide.title}</span>
                  <ChevronRight
                    size={15}
                    style={{
                      transform: activeGuide === guide.id ? 'rotate(90deg)' : 'none',
                      transition: 'transform 0.2s'
                    }}
                  />
                </div>

                {activeGuide === guide.id && (
                  <div style={{ padding: '0.8rem', background: 'var(--surface-muted)', fontSize: 'var(--font-xs)', lineHeight: 1.6 }}>
                    <ol style={{ paddingLeft: '1.2rem' }}>
                      {guide.steps.map((step, idx) => (
                        <li key={idx} style={{ marginBottom: '0.4rem' }}>
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
