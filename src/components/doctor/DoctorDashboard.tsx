'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Stethoscope,
  Calendar,
  Clock,
  Video,
  FileText,
  User,
  CheckCircle2,
  XCircle,
  TrendingUp,
  DollarSign,
  Star,
  Plus,
  Trash2,
  ShieldCheck,
  Award,
  Sparkles
} from 'lucide-react';
import { DoctorProfile, Appointment, PrescriptionMedicine, PatientProfile, MedicalRecord, Prescription } from '@/lib/db/types';
import { playChimeSound } from '@/lib/utils/audio';

export const DoctorDashboard: React.FC = () => {
  const { setActiveVideoAppt, setActiveTab, showToast } = useApp();

  const [doctor, setDoctor] = useState<DoctorProfile | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patientEMR, setPatientEMR] = useState<{ profile: PatientProfile; pastPrescriptions: Prescription[]; records: MedicalRecord[] } | null>(null);
  const [analytics, setAnalytics] = useState<{ totalAppointments: number; completedAppointments: number; totalEarnings: number; rating: number; reviewCount: number } | null>(null);

  const [activeDoctorTab, setActiveDoctorTab] = useState<'queue' | 'rx_pad' | 'emr' | 'settings'>('queue');

  // Digital Prescription Pad State
  const [rxNotes, setRxNotes] = useState('Maintain dietary salt restriction, 30 min brisk walk, monitor blood pressure.');
  const [rxFollowUp, setRxFollowUp] = useState('2026-10-02');
  const [prescribedMeds, setPrescribedMeds] = useState<PrescriptionMedicine[]>([
    {
      id: 'doc-rx-1',
      medicineName: 'Atorvastatin 20mg',
      dosage: '1 tablet (20mg)',
      frequency: '0-0-1 (Bedtime)',
      duration: '30 days',
      foodInstruction: 'after_food',
      quantityPrescribed: 30
    },
    {
      id: 'doc-rx-2',
      medicineName: 'Metformin HCl 500mg',
      dosage: '1 tablet (500mg)',
      frequency: '1-0-1 (Morning & Night)',
      duration: '30 days',
      foodInstruction: 'after_food',
      quantityPrescribed: 60
    }
  ]);

  // Fee settings
  const [videoFee, setVideoFee] = useState(65);
  const [inPersonFee, setInPersonFee] = useState(90);

  const loadDoctorPortalData = async () => {
    try {
      const res = await fetch('/api/doctor?doctorId=doc-1');
      const data = await res.json();
      if (data.doctor) {
        setDoctor(data.doctor);
        setVideoFee(data.doctor.videoFee);
        setInPersonFee(data.doctor.inPersonFee);
      }
      if (data.appointments) setAppointments(data.appointments);
      if (data.patientEMR) setPatientEMR(data.patientEMR);
      if (data.analytics) setAnalytics(data.analytics);
    } catch (e) {
      console.error('Error fetching doctor portal:', e);
    }
  };

  useEffect(() => {
    loadDoctorPortalData();
  }, []);

  const handleAddMedToRx = () => {
    setPrescribedMeds((prev) => [
      ...prev,
      {
        id: `doc-med-${Date.now()}`,
        medicineName: 'Pantoprazole 40mg',
        dosage: '1 tablet (40mg)',
        frequency: '1-0-0 (Morning)',
        duration: '15 days',
        foodInstruction: 'before_food',
        quantityPrescribed: 15
      }
    ]);
  };

  const handleRemoveMedFromRx = (id: string) => {
    setPrescribedMeds((prev) => prev.filter((m) => m.id !== id));
  };

  const handleSignAndSendPrescription = async () => {
    try {
      const res = await fetch('/api/doctor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_prescription',
          doctorId: 'doc-1',
          prescriptionData: {
            notes: rxNotes,
            followUpDate: rxFollowUp,
            medicines: prescribedMeds
          }
        })
      });
      const data = await res.json();
      if (data.success) {
        playChimeSound('dose_taken');
        showToast('Prescription signed with verified digital seal & sent to patient!', 'success');
        setActiveDoctorTab('queue');
        loadDoctorPortalData();
      }
    } catch (e) {
      showToast('Error issuing digital prescription', 'error');
    }
  };

  const handleUpdateFees = async () => {
    try {
      const res = await fetch('/api/doctor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_profile',
          doctorId: 'doc-1',
          doctorUpdates: { videoFee, inPersonFee }
        })
      });
      const data = await res.json();
      if (data.success) {
        showToast('Consultation fee rates updated', 'success');
      }
    } catch (e) {
      showToast('Error updating fees', 'error');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Doctor Header & Analytics KPI Cards */}
      <div
        style={{
          padding: '1.25rem',
          borderRadius: 'var(--radius-lg)',
          background: 'linear-gradient(135deg, rgba(13, 148, 136, 0.12) 0%, rgba(2, 132, 199, 0.08) 100%)',
          border: '1px solid rgba(13, 148, 136, 0.25)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', flexWrap: 'wrap' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: 'var(--radius-md)',
              backgroundImage: `url(${doctor?.image || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80'})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              boxShadow: 'var(--shadow-sm)'
            }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h2 style={{ fontSize: 'var(--font-xl)', fontWeight: 800 }}>
                {doctor?.name || 'Dr. Sophia Patel, MD, FACC'}
              </h2>
              <span className="badge badge-success">
                <ShieldCheck size={12} />
                <span>Verified License #{doctor?.registrationNumber || 'MED-NY-84920'}</span>
              </span>
            </div>
            <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-secondary)' }}>
              {doctor?.specialization || 'Cardiologist'} • {doctor?.clinicName}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ padding: '0.5rem 0.8rem', background: 'var(--surface-card)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Today Queue</div>
            <div style={{ fontSize: 'var(--font-md)', fontWeight: 800, color: 'var(--primary)' }}>
              {appointments.length} Consults
            </div>
          </div>

          <div style={{ padding: '0.5rem 0.8rem', background: 'var(--surface-card)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Gross Earnings</div>
            <div style={{ fontSize: 'var(--font-md)', fontWeight: 800, color: '#10b981' }}>
              ${analytics?.totalEarnings || 420.00}
            </div>
          </div>

          <div style={{ padding: '0.5rem 0.8rem', background: 'var(--surface-card)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Rating Score</div>
            <div style={{ fontSize: 'var(--font-md)', fontWeight: 800, color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '0.2rem', justifyContent: 'center' }}>
              <Star size={14} fill="#f59e0b" />
              <span>4.9 / 5.0</span>
            </div>
          </div>
        </div>
      </div>

      {/* Doctor Tabs Switcher - Scrollable on Mobile */}
      <div
        style={{
          display: 'flex',
          gap: '0.4rem',
          background: 'var(--surface-card)',
          padding: '0.35rem',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border-subtle)',
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch' as any
        }}
      >
        {[
          { id: 'queue', label: "Patient Appointment Queue" },
          { id: 'rx_pad', label: "Digital Prescription Pad (e-Rx)" },
          { id: 'emr', label: "Patient EMR & Medical History" },
          { id: 'settings', label: "Consultation Fees & Availability" }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveDoctorTab(tab.id as any)}
            style={{
              padding: '0.45rem 0.9rem',
              borderRadius: 'var(--radius-xs)',
              fontSize: 'var(--font-xs)',
              fontWeight: 700,
              background: activeDoctorTab === tab.id ? 'var(--primary-light)' : 'transparent',
              color: activeDoctorTab === tab.id ? 'var(--primary)' : 'var(--text-secondary)',
              whiteSpace: 'nowrap',
              flexShrink: 0
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: PATIENT APPOINTMENT QUEUE */}
      {activeDoctorTab === 'queue' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ fontSize: 'var(--font-md)', fontWeight: 800 }}>
            Scheduled Patients Queue ({appointments.length})
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            {appointments.map((appt) => (
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
                    <span style={{ fontWeight: 800, fontSize: 'var(--font-md)' }}>{appt.patientName}</span>
                    <span className="badge badge-primary">{appt.type === 'video' ? 'Video Consult' : 'In-Clinic'}</span>
                    <span className="badge badge-success">${appt.fee} Paid</span>
                  </div>

                  <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-secondary)', margin: '0.2rem 0' }}>
                    Scheduled: {appt.date} at {appt.timeSlot} • Reason: &quot;{appt.chiefComplaint}&quot;
                  </div>

                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    Patient Vitals: B+ • Known Penicillin Allergy • Mild Asthma
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {appt.type === 'video' && (
                    <button
                      onClick={() => {
                        setActiveVideoAppt(appt);
                        setActiveTab('telehealth');
                      }}
                      className="btn btn-primary btn-sm"
                      style={{ gap: '0.35rem' }}
                    >
                      <Video size={14} />
                      <span>Start Video Call</span>
                    </button>
                  )}

                  <button
                    onClick={() => setActiveDoctorTab('rx_pad')}
                    className="btn btn-secondary btn-sm"
                    style={{ gap: '0.35rem' }}
                  >
                    <FileText size={14} />
                    <span>Create Prescription</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: DIGITAL PRESCRIPTION PAD */}
      {activeDoctorTab === 'rx_pad' && (
        <div className="med-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.8rem' }}>
            <div>
              <h3 style={{ fontSize: 'var(--font-lg)', fontWeight: 800, color: 'var(--primary)' }}>
                Official Electronic Prescription Pad (e-Rx)
              </h3>
              <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>
                Patient: <strong>Aditya Sharma</strong> (28y / Male / Blood Group: B+)
              </p>
            </div>
            <div style={{ textAlign: 'right', fontSize: '11px', color: 'var(--text-muted)' }}>
              <div>Clinic: Metropolitan Heart & Vascular</div>
              <div>License: MED-NY-84920</div>
            </div>
          </div>

          {/* Allergy Warning Alert */}
          <div
            style={{
              padding: '0.6rem 0.9rem',
              background: 'var(--emergency-light)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--emergency-red)',
              fontSize: 'var(--font-xs)',
              color: 'var(--emergency-red)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontWeight: 700
            }}
          >
            <span>⚠️ CLINICAL SAFETY WARNING: Patient has recorded allergy to PENICILLIN. Do not prescribe beta-lactam antibiotics.</span>
          </div>

          {/* Prescribed Medications Editor */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
              <h4 style={{ fontSize: 'var(--font-sm)', fontWeight: 800 }}>
                Prescribed Drug Regimen
              </h4>
              <button onClick={handleAddMedToRx} className="btn btn-secondary btn-sm" style={{ gap: '0.3rem' }}>
                <Plus size={14} />
                <span>Add Medicine</span>
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {prescribedMeds.map((med, idx) => (
                <div
                  key={med.id || idx}
                  style={{
                    padding: '0.75rem',
                    background: 'var(--surface-hover)',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-subtle)',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr)) 30px',
                    gap: '0.5rem',
                    alignItems: 'center'
                  }}
                >
                  <input
                    type="text"
                    value={med.medicineName}
                    onChange={(e) => {
                      const v = e.target.value;
                      setPrescribedMeds((prev) => prev.map((m, i) => (i === idx ? { ...m, medicineName: v } : m)));
                    }}
                    className="input-control"
                    style={{ padding: '0.4rem 0.6rem', fontSize: 'var(--font-xs)' }}
                  />
                  <input
                    type="text"
                    value={med.dosage}
                    onChange={(e) => {
                      const v = e.target.value;
                      setPrescribedMeds((prev) => prev.map((m, i) => (i === idx ? { ...m, dosage: v } : m)));
                    }}
                    className="input-control"
                    style={{ padding: '0.4rem 0.6rem', fontSize: 'var(--font-xs)' }}
                  />
                  <input
                    type="text"
                    value={med.frequency}
                    onChange={(e) => {
                      const v = e.target.value;
                      setPrescribedMeds((prev) => prev.map((m, i) => (i === idx ? { ...m, frequency: v } : m)));
                    }}
                    className="input-control"
                    style={{ padding: '0.4rem 0.6rem', fontSize: 'var(--font-xs)' }}
                  />
                  <select
                    value={med.foodInstruction}
                    onChange={(e) => {
                      const v = e.target.value as any;
                      setPrescribedMeds((prev) => prev.map((m, i) => (i === idx ? { ...m, foodInstruction: v } : m)));
                    }}
                    className="input-control"
                    style={{ padding: '0.4rem 0.6rem', fontSize: 'var(--font-xs)' }}
                  >
                    <option value="after_food">After Food</option>
                    <option value="before_food">Before Food</option>
                  </select>
                  <input
                    type="text"
                    value={med.duration}
                    onChange={(e) => {
                      const v = e.target.value;
                      setPrescribedMeds((prev) => prev.map((m, i) => (i === idx ? { ...m, duration: v } : m)));
                    }}
                    className="input-control"
                    style={{ padding: '0.4rem 0.6rem', fontSize: 'var(--font-xs)' }}
                  />
                  <button onClick={() => handleRemoveMedFromRx(med.id || '')} style={{ color: 'var(--emergency-red)' }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Clinical Advice & Follow-Up Date */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.8rem' }}>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>
                Physician Advice & Lifestyle Notes
              </label>
              <textarea
                rows={2}
                value={rxNotes}
                onChange={(e) => setRxNotes(e.target.value)}
                className="input-control"
              />
            </div>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>
                Follow-up Date
              </label>
              <input
                type="date"
                value={rxFollowUp}
                onChange={(e) => setRxFollowUp(e.target.value)}
                className="input-control"
              />
            </div>
          </div>

          {/* Digital Signature Footer */}
          <div
            style={{
              padding: '0.85rem',
              background: 'var(--surface-hover)',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div>
              <div style={{ fontWeight: 800, fontSize: 'var(--font-sm)', color: 'var(--primary)' }}>
                Digital Cryptographic Stamp: Dr. Sophia Patel, MD
              </div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                NPI #1982001928 • Verified State Medical Board of New York
              </div>
            </div>

            <button onClick={handleSignAndSendPrescription} className="btn btn-primary" style={{ gap: '0.4rem' }}>
              <ShieldCheck size={16} />
              <span>Digitally Sign & Push to Patient</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: PATIENT EMR REVIEW */}
      {activeDoctorTab === 'emr' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="med-card">
            <h4 style={{ fontSize: 'var(--font-sm)', fontWeight: 800, marginBottom: '0.8rem' }}>
              Patient Demographics & Medical History
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.8rem', fontSize: 'var(--font-xs)' }}>
              <div><strong>Patient:</strong> {patientEMR?.profile.fullName} (Age: {patientEMR?.profile.age})</div>
              <div><strong>Blood Group:</strong> {patientEMR?.profile.bloodGroup}</div>
              <div><strong>BMI:</strong> {patientEMR?.profile.bmi}</div>
              <div><strong>Allergies:</strong> {patientEMR?.profile.allergies.join(', ')}</div>
              <div><strong>Chronic Conditions:</strong> {patientEMR?.profile.medicalConditions.join(', ')}</div>
              <div><strong>Insurance:</strong> {patientEMR?.profile.insuranceProvider}</div>
            </div>
          </div>

          <div className="med-card">
            <h4 style={{ fontSize: 'var(--font-sm)', fontWeight: 800, marginBottom: '0.8rem' }}>
              Attached Diagnostic Records & Imaging
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {patientEMR?.records.map((r) => (
                <div key={r.id} style={{ padding: '0.6rem', background: 'var(--surface-hover)', borderRadius: 'var(--radius-xs)', fontSize: 'var(--font-xs)' }}>
                  <strong>{r.title}</strong> ({r.date}) • {r.aiExplanation}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: FEES & AVAILABILITY */}
      {activeDoctorTab === 'settings' && (
        <div className="med-card" style={{ maxWidth: '520px' }}>
          <h4 style={{ fontSize: 'var(--font-md)', fontWeight: 800, marginBottom: '1rem' }}>
            Consultation Fee Rates
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: 'var(--font-xs)', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>
                Video Consultation Fee ($)
              </label>
              <input
                type="number"
                value={videoFee}
                onChange={(e) => setVideoFee(Number(e.target.value))}
                className="input-control"
              />
            </div>

            <div>
              <label style={{ fontSize: 'var(--font-xs)', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>
                In-Clinic Consultation Fee ($)
              </label>
              <input
                type="number"
                value={inPersonFee}
                onChange={(e) => setInPersonFee(Number(e.target.value))}
                className="input-control"
              />
            </div>

            <button onClick={handleUpdateFees} className="btn btn-primary">
              Save Fee Structure
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
