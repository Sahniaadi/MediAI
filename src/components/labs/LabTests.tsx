'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import {
  TestTube2,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  Sparkles,
  Search,
  FileText,
  AlertCircle,
  Home,
  Building2,
  Download,
  Info
} from 'lucide-react';
import { LabTest, LabBooking } from '@/lib/db/types';
import { playChimeSound } from '@/lib/utils/audio';

export const LabTests: React.FC = () => {
  const { patientProfile, showToast } = useApp();

  const [tests, setTests] = useState<LabTest[]>([]);
  const [bookings, setBookings] = useState<LabBooking[]>([]);
  const [activeTab, setActiveTab] = useState<'catalog' | 'my_bookings' | 'ai_explainer'>('catalog');
  const [searchTest, setSearchTest] = useState('');

  // Booking modal
  const [bookingTest, setBookingTest] = useState<LabTest | null>(null);
  const [bookingMode, setBookingMode] = useState<'home_collection' | 'lab_visit'>('home_collection');
  const [bookingDate, setBookingDate] = useState('2026-09-10');
  const [bookingSlot, setBookingSlot] = useState('07:30 AM');

  // AI Explainer State
  const [explainedText, setExplainedText] = useState<string | null>(null);
  const [isExplaining, setIsExplaining] = useState(false);

  const loadLabData = async () => {
    try {
      const res = await fetch('/api/labs');
      const data = await res.json();
      if (data.tests) setTests(data.tests);
      if (data.bookings) setBookings(data.bookings);
    } catch (e) {
      console.error('Error fetching labs:', e);
    }
  };

  useEffect(() => {
    loadLabData();
  }, []);

  const handleConfirmBooking = async () => {
    if (!bookingTest) return;

    try {
      const res = await fetch('/api/labs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'book_test',
          testIds: [bookingTest.id],
          bookingDate,
          timeSlot: bookingSlot,
          mode: bookingMode,
          address: patientProfile?.address || '742 Evergreen Terrace, Springfield'
        })
      });
      const data = await res.json();
      if (data.success) {
        playChimeSound('dose_taken');
        setBookingTest(null);
        setActiveTab('my_bookings');
        showToast(`Diagnostic test booked! Sample collection scheduled for ${bookingDate}.`, 'success');
        loadLabData();
      }
    } catch (e) {
      showToast('Error booking test', 'error');
    }
  };

  const handleExplainWithAI = async (testName: string) => {
    setIsExplaining(true);
    setActiveTab('ai_explainer');
    try {
      const res = await fetch('/api/ai/explain-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: testName })
      });
      const data = await res.json();
      if (data.explanation) {
        setExplainedText(data.explanation);
        playChimeSound('notification');
      }
    } catch (e) {
      showToast('Error generating AI explanation', 'error');
    } finally {
      setIsExplaining(false);
    }
  };

  const filteredTests = tests.filter(
    (t) =>
      t.name.toLowerCase().includes(searchTest.toLowerCase()) ||
      t.category.toLowerCase().includes(searchTest.toLowerCase()) ||
      t.parametersIncluded.some((p) => p.toLowerCase().includes(searchTest.toLowerCase()))
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Header & Tabs */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.8rem' }}>
        <div>
          <h2 style={{ fontSize: 'var(--font-2xl)', fontWeight: 800, color: 'var(--text-main)' }}>
            Lab Tests & Diagnostics
          </h2>
          <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-muted)' }}>
            Certified diagnostic tests with free home sample collection and AI biomarker interpretation.
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            gap: '0.4rem',
            background: 'var(--surface-card)',
            padding: '0.35rem',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-subtle)'
          }}
        >
          <button
            onClick={() => setActiveTab('catalog')}
            style={{
              padding: '0.45rem 0.9rem',
              borderRadius: 'var(--radius-xs)',
              fontSize: 'var(--font-xs)',
              fontWeight: 700,
              background: activeTab === 'catalog' ? 'var(--primary-light)' : 'transparent',
              color: activeTab === 'catalog' ? 'var(--primary)' : 'var(--text-secondary)'
            }}
          >
            Test Packages
          </button>

          <button
            onClick={() => setActiveTab('my_bookings')}
            style={{
              padding: '0.45rem 0.9rem',
              borderRadius: 'var(--radius-xs)',
              fontSize: 'var(--font-xs)',
              fontWeight: 700,
              background: activeTab === 'my_bookings' ? 'var(--primary-light)' : 'transparent',
              color: activeTab === 'my_bookings' ? 'var(--primary)' : 'var(--text-secondary)'
            }}
          >
            Track Bookings ({bookings.length})
          </button>

          <button
            onClick={() => {
              if (!explainedText) handleExplainWithAI('Lipid Profile');
              else setActiveTab('ai_explainer');
            }}
            style={{
              padding: '0.45rem 0.9rem',
              borderRadius: 'var(--radius-xs)',
              fontSize: 'var(--font-xs)',
              fontWeight: 700,
              background: activeTab === 'ai_explainer' ? 'var(--primary-light)' : 'transparent',
              color: activeTab === 'ai_explainer' ? 'var(--primary)' : 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem'
            }}
          >
            <Sparkles size={13} />
            <span>AI Report Explainer</span>
          </button>
        </div>
      </div>

      {/* TAB 1: TEST CATALOG */}
      {activeTab === 'catalog' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Search Box */}
          <div style={{ position: 'relative', maxWidth: '440px' }}>
            <Search size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search tests: Lipid, Blood Sugar, CBC, Thyroid, MRI..."
              value={searchTest}
              onChange={(e) => setSearchTest(e.target.value)}
              className="input-control"
              style={{ paddingLeft: '2.4rem' }}
            />
          </div>

          {/* Test Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
            {filteredTests.map((test) => (
              <div
                key={test.id}
                className="med-card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '1rem'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <span className="badge badge-primary">{test.category}</span>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>
                      Code: {test.code}
                    </span>
                  </div>

                  <h3 style={{ fontSize: 'var(--font-md)', fontWeight: 800, marginTop: '0.5rem', color: 'var(--text-main)' }}>
                    {test.name}
                  </h3>

                  <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-secondary)', margin: '0.4rem 0', lineHeight: 1.4 }}>
                    {test.description}
                  </p>

                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', gap: '0.6rem', flexWrap: 'wrap', margin: '0.5rem 0' }}>
                    <span>🔬 {test.sampleType}</span>
                    <span>⏱️ Report in {test.turnaroundHours} hrs</span>
                    {test.fastingRequired && (
                      <span style={{ color: 'var(--warning)', fontWeight: 700 }}>⚠️ Fasting Required (8-10h)</span>
                    )}
                  </div>

                  {/* Included Parameters */}
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)', background: 'var(--surface-hover)', padding: '0.5rem', borderRadius: 'var(--radius-xs)' }}>
                    <strong>Parameters:</strong> {test.parametersIncluded.join(', ')}
                  </div>
                </div>

                {/* Pricing & Booking Action */}
                <div
                  style={{
                    borderTop: '1px solid var(--border-subtle)',
                    paddingTop: '0.8rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
                    <span style={{ fontSize: 'var(--font-lg)', fontWeight: 800, color: 'var(--primary)' }}>
                      ${(test.discountPrice || test.price).toFixed(2)}
                    </span>
                    {test.discountPrice && (
                      <span style={{ fontSize: 'var(--font-xs)', textDecoration: 'line-through', color: 'var(--text-muted)' }}>
                        ${test.price.toFixed(2)}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => setBookingTest(test)}
                    className="btn btn-primary btn-sm"
                    style={{ gap: '0.35rem' }}
                  >
                    <Calendar size={14} />
                    <span>Book Test</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: MY BOOKINGS & TRACKING */}
      {activeTab === 'my_bookings' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {bookings.map((booking) => (
            <div key={booking.id} className="med-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className="badge badge-success" style={{ textTransform: 'capitalize' }}>
                      {booking.status.replace('_', ' ')}
                    </span>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      Booking ID: #{booking.id}
                    </span>
                  </div>

                  <h3 style={{ fontSize: 'var(--font-md)', fontWeight: 800, marginTop: '0.4rem' }}>
                    {booking.testNames.join(', ')}
                  </h3>

                  <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-secondary)', margin: '0.2rem 0' }}>
                    Scheduled: {booking.bookingDate} at {booking.timeSlot} • {booking.mode === 'home_collection' ? 'Home Sample Pickup' : 'Diagnostic Lab Visit'}
                  </div>

                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    Address: {booking.address}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <button
                    onClick={() => handleExplainWithAI(booking.testNames[0])}
                    className="btn btn-primary btn-sm"
                    style={{ gap: '0.35rem' }}
                  >
                    <Sparkles size={14} />
                    <span>Explain Report with AI</span>
                  </button>
                </div>
              </div>

              {/* Lab Stepper Status */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '0.4rem',
                  textAlign: 'center',
                  marginTop: '1.25rem'
                }}
              >
                {[
                  { id: 'booked', label: 'Slot Booked' },
                  { id: 'sample_collected', label: 'Sample Collected' },
                  { id: 'processing', label: 'In Lab Testing' },
                  { id: 'report_ready', label: 'Report Ready' }
                ].map((st, i) => (
                  <div key={st.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem' }}>
                    <div
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        background: '#10b981',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '11px',
                        fontWeight: 700
                      }}
                    >
                      ✓
                    </div>
                    <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-main)' }}>
                      {st.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: AI REPORT EXPLAINER */}
      {activeTab === 'ai_explainer' && (
        <div className="med-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'var(--primary-light)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Sparkles size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: 'var(--font-lg)', fontWeight: 800 }}>
                AI Clinical Report Explainer
              </h3>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                Demystifying biological biomarkers into plain, empathetic, non-diagnostic patient insights.
              </p>
            </div>
          </div>

          {isExplaining ? (
            <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
              <Sparkles size={32} className="anim-heartbeat" style={{ margin: '0 auto 0.8rem auto', color: 'var(--primary)' }} />
              <p>MediAI is analyzing blood biomarkers and clinical reference intervals...</p>
            </div>
          ) : (
            <div
              style={{
                padding: '1.25rem',
                background: 'var(--surface-hover)',
                borderRadius: 'var(--radius-sm)',
                lineHeight: 1.7,
                fontSize: 'var(--font-sm)',
                whiteSpace: 'pre-line',
                border: '1px solid var(--border-subtle)'
              }}
            >
              {explainedText}
            </div>
          )}
        </div>
      )}

      {/* BOOKING MODAL */}
      {bookingTest && (
        <div className="modal-overlay" onClick={() => setBookingTest(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
            <h3 style={{ fontSize: 'var(--font-lg)', fontWeight: 800, marginBottom: '0.3rem' }}>
              Book {bookingTest.name}
            </h3>
            <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              Turnaround: {bookingTest.turnaroundHours} hours • Sample: {bookingTest.sampleType}
            </p>

            {/* Mode: Home Collection vs Diagnostic Center */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontSize: 'var(--font-xs)', fontWeight: 700, display: 'block', marginBottom: '0.4rem' }}>
                Sample Collection Mode
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                <button
                  type="button"
                  onClick={() => setBookingMode('home_collection')}
                  style={{
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    background: bookingMode === 'home_collection' ? 'var(--primary-light)' : 'var(--surface-hover)',
                    border: bookingMode === 'home_collection' ? '1.5px solid var(--primary)' : '1px solid var(--border-subtle)',
                    textAlign: 'left'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, fontSize: 'var(--font-sm)' }}>
                    <Home size={15} color="var(--primary)" />
                    <span>Home Sample Pickup</span>
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                    Phlebotomist arrives at home
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setBookingMode('lab_visit')}
                  style={{
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    background: bookingMode === 'lab_visit' ? 'var(--primary-light)' : 'var(--surface-hover)',
                    border: bookingMode === 'lab_visit' ? '1.5px solid var(--primary)' : '1px solid var(--border-subtle)',
                    textAlign: 'left'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, fontSize: 'var(--font-sm)' }}>
                    <Building2 size={15} color="var(--primary)" />
                    <span>Visit Lab Center</span>
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                    Quest Diagnostics Regional
                  </div>
                </button>
              </div>
            </div>

            {/* Date & Slot */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem', marginBottom: '1.25rem' }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>
                  Collection Date
                </label>
                <input
                  type="date"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="input-control"
                />
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>
                  Time Slot
                </label>
                <select
                  value={bookingSlot}
                  onChange={(e) => setBookingSlot(e.target.value)}
                  className="input-control"
                >
                  <option value="07:00 AM">07:00 AM (Fasting Ideal)</option>
                  <option value="08:00 AM">08:00 AM</option>
                  <option value="09:30 AM">09:30 AM</option>
                  <option value="11:00 AM">11:00 AM</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.6rem' }}>
              <button onClick={() => setBookingTest(null)} className="btn btn-secondary">
                Cancel
              </button>
              <button onClick={handleConfirmBooking} className="btn btn-primary">
                Confirm Booking (${(bookingTest.discountPrice || bookingTest.price).toFixed(2)})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
