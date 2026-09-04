'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Search,
  Calendar,
  Clock,
  Video,
  MapPin,
  Star,
  CheckCircle2,
  ChevronRight,
  Filter,
  ShieldCheck,
  RotateCcw,
  XCircle,
  Sparkles
} from 'lucide-react';
import { DoctorProfile, Appointment } from '@/lib/db/types';
import { playChimeSound } from '@/lib/utils/audio';

export const DoctorBooking: React.FC = () => {
  const { setActiveTab, setActiveVideoAppt, showToast } = useApp();

  const [doctors, setDoctors] = useState<DoctorProfile[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [searchDoctor, setSearchDoctor] = useState('');
  const [activeSubTab, setActiveSubTab] = useState<'find' | 'my_appointments'>('find');

  // Booking modal state
  const [bookingDoctor, setBookingDoctor] = useState<DoctorProfile | null>(null);
  const [selectedDate, setSelectedDate] = useState('2026-09-08');
  const [selectedSlot, setSelectedSlot] = useState('10:30 AM');
  const [consultType, setConsultType] = useState<'video' | 'in_clinic'>('video');
  const [chiefComplaint, setChiefComplaint] = useState('');

  const specialties = [
    'All',
    'Cardiologist',
    'General Physician',
    'Dermatologist',
    'Neurologist',
    'Pediatrician',
    'Orthopedic',
    'Gynecologist',
    'Psychiatrist',
    'Nutritionist',
    'ENT'
  ];

  const loadDoctorData = async () => {
    try {
      const res = await fetch('/api/appointments');
      const data = await res.json();
      if (data.doctors) setDoctors(data.doctors);
      if (data.appointments) setAppointments(data.appointments);
    } catch (e) {
      console.error('Error fetching doctors:', e);
    }
  };

  useEffect(() => {
    loadDoctorData();
  }, []);

  const filteredDoctors = doctors.filter((doc) => {
    const matchesSpec = selectedSpecialty === 'All' || doc.specialization.toLowerCase() === selectedSpecialty.toLowerCase();
    const matchesQuery =
      doc.name.toLowerCase().includes(searchDoctor.toLowerCase()) ||
      doc.specialization.toLowerCase().includes(searchDoctor.toLowerCase()) ||
      doc.clinicName.toLowerCase().includes(searchDoctor.toLowerCase());
    return matchesSpec && matchesQuery;
  });

  const handleConfirmBooking = async () => {
    if (!bookingDoctor) return;

    try {
      const fee = consultType === 'video' ? bookingDoctor.videoFee : bookingDoctor.inPersonFee;
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'book',
          appointmentData: {
            doctorId: bookingDoctor.id,
            doctorName: bookingDoctor.name,
            specialization: bookingDoctor.specialization,
            date: selectedDate,
            timeSlot: selectedSlot,
            type: consultType,
            fee,
            chiefComplaint: chiefComplaint || 'General health consultation',
            clinicAddress: bookingDoctor.clinicAddress
          }
        })
      });
      const data = await res.json();
      if (data.success) {
        playChimeSound('dose_taken');
        setBookingDoctor(null);
        setChiefComplaint('');
        setActiveSubTab('my_appointments');
        showToast(`Appointment confirmed with ${bookingDoctor.name}!`, 'success');
        loadDoctorData();
      }
    } catch (e) {
      showToast('Error booking appointment', 'error');
    }
  };

  const handleCancelAppointment = async (appointmentId: string) => {
    if (!confirm('Are you sure you want to cancel this appointment? 100% refund will be processed.')) return;
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'cancel', appointmentId })
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message, 'info');
        loadDoctorData();
      }
    } catch (e) {
      showToast('Error cancelling appointment', 'error');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Header & Sub-tab Switcher */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.8rem' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h2 style={{ fontSize: 'clamp(1.15rem, 4vw, 1.5rem)', fontWeight: 800, color: 'var(--text-main)' }}>
            Doctor Consultations &amp; Telehealth
          </h2>
          <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            Book in-clinic or secure HD video consultations with verified medical specialists.
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
            onClick={() => setActiveSubTab('find')}
            style={{
              padding: '0.45rem 0.9rem',
              borderRadius: 'var(--radius-xs)',
              fontSize: 'var(--font-xs)',
              fontWeight: 700,
              background: activeSubTab === 'find' ? 'var(--primary-light)' : 'transparent',
              color: activeSubTab === 'find' ? 'var(--primary)' : 'var(--text-secondary)'
            }}
          >
            Find Specialist
          </button>

          <button
            onClick={() => setActiveSubTab('my_appointments')}
            style={{
              padding: '0.45rem 0.9rem',
              borderRadius: 'var(--radius-xs)',
              fontSize: 'var(--font-xs)',
              fontWeight: 700,
              background: activeSubTab === 'my_appointments' ? 'var(--primary-light)' : 'transparent',
              color: activeSubTab === 'my_appointments' ? 'var(--primary)' : 'var(--text-secondary)'
            }}
          >
            My Appointments ({appointments.length})
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: FIND & BOOK SPECIALIST */}
      {activeSubTab === 'find' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Search Bar */}
          <div style={{ position: 'relative', width: '100%', maxWidth: '480px' }}>
            <Search size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search doctors by name, clinic, or condition..."
              value={searchDoctor}
              onChange={(e) => setSearchDoctor(e.target.value)}
              className="input-control"
              style={{ paddingLeft: '2.4rem' }}
            />
          </div>

          {/* Specialties Filter Pills */}
          <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.4rem' }}>
            {specialties.map((spec) => (
              <button
                key={spec}
                onClick={() => setSelectedSpecialty(spec)}
                style={{
                  padding: '0.4rem 0.85rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: 'var(--font-xs)',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  background: selectedSpecialty === spec ? 'var(--primary)' : 'var(--surface-card)',
                  color: selectedSpecialty === spec ? 'white' : 'var(--text-secondary)',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                {spec}
              </button>
            ))}
          </div>

          {/* Doctors Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(320px, 100%), 1fr))', gap: '1rem' }}>
            {filteredDoctors.map((doc) => (
              <div
                key={doc.id}
                className="med-card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '1rem'
                }}
              >
                <div>
                  <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'flex-start' }}>
                    <div
                      style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: 'var(--radius-md)',
                        backgroundImage: `url(${doc.image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        flexShrink: 0
                      }}
                    />

                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <h3 style={{ fontSize: 'var(--font-md)', fontWeight: 800, color: 'var(--text-main)' }}>
                          {doc.name}
                        </h3>
                        <span title="Verified Medical License"><ShieldCheck size={16} color="var(--primary)" /></span>
                      </div>

                      <div style={{ fontSize: 'var(--font-xs)', color: 'var(--primary)', fontWeight: 600 }}>
                        {doc.specialization}
                      </div>

                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        {doc.qualification} • {doc.experienceYears} yrs experience
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.3rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#f59e0b', fontSize: '11px', fontWeight: 700 }}>
                          <Star size={13} fill="#f59e0b" />
                          <span>{doc.rating}</span>
                        </div>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>({doc.reviewCount} reviews)</span>
                      </div>
                    </div>
                  </div>

                  <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-secondary)', margin: '0.8rem 0', lineHeight: 1.5 }}>
                    {doc.bio}
                  </p>

                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    📍 {doc.clinicName} • Languages: {doc.languages.join(', ')}
                  </div>
                </div>

                {/* Consultation Fees & Book Action */}
                <div
                  style={{
                    borderTop: '1px solid var(--border-subtle)',
                    paddingTop: '0.8rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '0.75rem'
                  }}
                >
                  <div>
                    <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>Consultation from</div>
                    <div style={{ fontSize: 'var(--font-md)', fontWeight: 800, color: 'var(--primary)' }}>
                      ${doc.videoFee} <span style={{ fontSize: '11px', fontWeight: 500, color: 'var(--text-muted)' }}>(Video) / ${doc.inPersonFee} (Clinic)</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setBookingDoctor(doc)}
                    className="btn btn-primary btn-sm"
                    style={{ gap: '0.35rem' }}
                  >
                    <Calendar size={14} />
                    <span>Book Appointment</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: MY APPOINTMENTS */}
      {activeSubTab === 'my_appointments' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {appointments.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
              <Calendar size={40} style={{ margin: '0 auto 0.8rem auto', opacity: 0.5 }} />
              <p>No appointments booked yet.</p>
              <button onClick={() => setActiveSubTab('find')} className="btn btn-primary btn-sm" style={{ marginTop: '0.8rem' }}>
                Book a Doctor
              </button>
            </div>
          ) : (
            appointments.map((appt) => {
              const isVideo = appt.type === 'video';

              return (
                <div
                  key={appt.id}
                  className="med-card"
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '1rem'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span className="badge badge-primary">{appt.specialization}</span>
                      <span className={`badge ${appt.status === 'confirmed' ? 'badge-success' : 'badge-warning'}`}>
                        {appt.status}
                      </span>
                    </div>

                    <h3 style={{ fontSize: 'var(--font-md)', fontWeight: 800, marginTop: '0.4rem', color: 'var(--text-main)' }}>
                      {appt.doctorName}
                    </h3>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: 'var(--font-xs)', color: 'var(--text-secondary)', margin: '0.2rem 0' }}>
                      <Clock size={13} color="var(--primary)" />
                      <span>{appt.date} at {appt.timeSlot}</span>
                      <span>• {isVideo ? 'Encrypted Video Call' : 'In-Clinic Visit'}</span>
                    </div>

                    <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      Chief Complaint: &quot;{appt.chiefComplaint}&quot;
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {isVideo && appt.status === 'confirmed' && (
                      <button
                        onClick={() => {
                          setActiveVideoAppt(appt);
                          setActiveTab('telehealth');
                        }}
                        className="btn btn-primary btn-sm"
                        style={{ gap: '0.35rem' }}
                      >
                        <Video size={14} />
                        <span>Join Video Room</span>
                      </button>
                    )}

                    {appt.status === 'confirmed' && (
                      <button
                        onClick={() => handleCancelAppointment(appt.id)}
                        className="btn btn-secondary btn-sm"
                        style={{ color: 'var(--emergency-red)' }}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* BOOKING MODAL */}
      {bookingDoctor && (
        <div className="modal-overlay" onClick={() => setBookingDoctor(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
            <h3 style={{ fontSize: 'var(--font-lg)', fontWeight: 800, marginBottom: '0.3rem' }}>
              Book with {bookingDoctor.name}
            </h3>
            <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              {bookingDoctor.specialization} • {bookingDoctor.clinicName}
            </p>

            {/* Mode: In-clinic vs Video */}
            <div style={{ marginBottom: '1.2rem' }}>
              <label style={{ fontSize: 'var(--font-xs)', fontWeight: 700, display: 'block', marginBottom: '0.4rem' }}>
                Consultation Mode
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                <button
                  type="button"
                  onClick={() => setConsultType('video')}
                  style={{
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    background: consultType === 'video' ? 'var(--primary-light)' : 'var(--surface-hover)',
                    border: consultType === 'video' ? '1.5px solid var(--primary)' : '1px solid var(--border-subtle)',
                    textAlign: 'left'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, fontSize: 'var(--font-sm)' }}>
                    <Video size={16} color="var(--primary)" />
                    <span>Video Consultation</span>
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                    ${bookingDoctor.videoFee} • In-App Call
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setConsultType('in_clinic')}
                  style={{
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    background: consultType === 'in_clinic' ? 'var(--primary-light)' : 'var(--surface-hover)',
                    border: consultType === 'in_clinic' ? '1.5px solid var(--primary)' : '1px solid var(--border-subtle)',
                    textAlign: 'left'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, fontSize: 'var(--font-sm)' }}>
                    <MapPin size={16} color="var(--primary)" />
                    <span>In-Clinic Visit</span>
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                    ${bookingDoctor.inPersonFee} • At Doctor Clinic
                  </div>
                </button>
              </div>
            </div>

            {/* Date & Slot Picker */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.8rem', marginBottom: '1.2rem' }} className="booking-date-grid">
              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>
                  Appointment Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="input-control"
                />
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>
                  Available Time Slot
                </label>
                <select
                  value={selectedSlot}
                  onChange={(e) => setSelectedSlot(e.target.value)}
                  className="input-control"
                >
                  {bookingDoctor.availableTimeSlots.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <style jsx global>{`
              @media (min-width: 480px) {
                .booking-date-grid {
                  grid-template-columns: 1fr 1fr !important;
                }
              }
            `}</style>

            {/* Reason / Chief Complaint */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>
                Chief Complaint / Symptoms
              </label>
              <textarea
                rows={2}
                placeholder="Briefly describe your symptoms or reason for visit..."
                value={chiefComplaint}
                onChange={(e) => setChiefComplaint(e.target.value)}
                className="input-control"
              />
            </div>

            {/* Refund policy notice */}
            <div style={{ padding: '0.6rem', background: 'var(--surface-hover)', borderRadius: 'var(--radius-xs)', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '1.2rem' }}>
              🛡️ <strong>100% Free Cancellation Guarantee:</strong> Cancel up to 2 hours before scheduled slot for full automatic refund.
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.6rem', flexWrap: 'wrap' }}>
              <button onClick={() => setBookingDoctor(null)} className="btn btn-secondary">
                Cancel
              </button>
              <button onClick={handleConfirmBooking} className="btn btn-primary" style={{ flex: 1, minWidth: '180px' }}>
                Confirm Booking (${consultType === 'video' ? bookingDoctor.videoFee : bookingDoctor.inPersonFee})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
