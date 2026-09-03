'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Bot,
  Camera,
  FileText,
  Calendar,
  Pill,
  TestTube2,
  CheckCircle2,
  Clock,
  Video,
  ChevronRight,
  TrendingUp,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Wallet,
  ShieldCheck,
  Volume2
} from 'lucide-react';
import { MedicineReminder, Appointment, Prescription, LabBooking } from '@/lib/db/types';
import { playChimeSound } from '@/lib/utils/audio';

export const PatientHome: React.FC = () => {
  const {
    patientProfile,
    activeFamilyMember,
    setActiveTab,
    setIsEmergencyOpen,
    addToCart,
    showToast,
    t
  } = useApp();

  const [reminders, setReminders] = useState<MedicineReminder[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [labBookings, setLabBookings] = useState<LabBooking[]>([]);
  const [adherenceRate, setAdherenceRate] = useState(94);
  const [loading, setLoading] = useState(true);

  // Fetch live dashboard state
  const loadDashboardData = async () => {
    try {
      const [remRes, apptRes, rxRes, labRes] = await Promise.all([
        fetch('/api/medicines/reminders').then((r) => r.json()),
        fetch('/api/appointments').then((r) => r.json()),
        fetch('/api/records?category=prescription').then((r) => r.json()),
        fetch('/api/labs').then((r) => r.json())
      ]);

      if (remRes.reminders) {
        setReminders(remRes.reminders);
        setAdherenceRate(remRes.adherenceRate || 94);
      }
      if (apptRes.appointments) {
        setAppointments(apptRes.appointments);
      }
      if (labRes.bookings) {
        setLabBookings(labRes.bookings);
      }
    } catch (e) {
      console.error('Error fetching patient dashboard data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleTakeDose = async (reminderId: string, medicineName: string) => {
    try {
      const res = await fetch('/api/medicines/reminders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'log_dose', reminderId, status: 'taken' })
      });
      const data = await res.json();
      if (data.success) {
        playChimeSound('dose_taken');
        showToast(`Dose marked as taken for ${medicineName}! Adherence: ${data.adherenceRate}%`, 'success');
        loadDashboardData();
      }
    } catch (e) {
      showToast('Error marking dose', 'error');
    }
  };

  const upcomingAppt = appointments.find((a) => a.status === 'confirmed');
  const refillNeededMed = reminders.find((r) => r.remainingQuantity <= 10) || reminders[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Greeting Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          flexWrap: 'wrap',
          gap: '0.5rem'
        }}
      >
        <div>
          <h1 style={{ fontSize: 'var(--font-2xl)', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
            Hello, {activeFamilyMember?.name || patientProfile?.fullName || 'Aditya'} 👋
          </h1>
          <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-muted)' }}>
            Welcome back to your comprehensive AI medical center.
          </p>
        </div>

        {/* Adherence Score Badge */}
        <div
          className="med-card"
          style={{
            padding: '0.45rem 0.9rem',
            borderRadius: 'var(--radius-full)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'var(--surface-card)',
            boxShadow: 'var(--shadow-xs)'
          }}
        >
          <TrendingUp size={16} color="var(--primary)" />
          <span style={{ fontSize: 'var(--font-xs)', fontWeight: 600, color: 'var(--text-secondary)' }}>
            Medication Adherence:
          </span>
          <span style={{ fontSize: 'var(--font-sm)', fontWeight: 800, color: 'var(--primary)' }}>
            {adherenceRate}%
          </span>
        </div>
      </div>

      {/* Main AI Hero Action Card */}
      <div
        className="med-card med-card-glass"
        style={{
          background: 'linear-gradient(135deg, rgba(13, 148, 136, 0.12) 0%, rgba(2, 132, 199, 0.1) 100%)',
          border: '1px solid rgba(13, 148, 136, 0.3)',
          padding: '1.5rem',
          borderRadius: 'var(--radius-lg)',
          position: 'relative'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
          <Sparkles size={18} color="var(--primary)" />
          <span style={{ fontSize: 'var(--font-xs)', fontWeight: 700, textTransform: 'uppercase', color: 'var(--primary)', letterSpacing: '0.05em' }}>
            MediAI Smart Health Copilot
          </span>
        </div>

        <h2 style={{ fontSize: 'var(--font-xl)', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.6rem' }}>
          &quot;{t('howCanHelp')}&quot;
        </h2>
        <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)', maxWidth: '650px', marginBottom: '1.25rem' }}>
          Ask clinical questions, scan prescription images, triage health symptoms, or order medicines directly.
        </p>

        {/* 6 Quick Action Buttons */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '0.75rem'
          }}
        >
          {[
            { id: 'ai', label: t('askAI'), icon: Bot, color: '#0d9488' },
            { id: 'scanner', label: t('uploadPrescription'), icon: Camera, color: '#0284c7' },
            { id: 'records', label: t('uploadReport'), icon: FileText, color: '#8b5cf6' },
            { id: 'appointments', label: t('bookDoctor'), icon: Calendar, color: '#10b981' },
            { id: 'orders', label: t('orderMedicine'), icon: Pill, color: '#f59e0b' },
            { id: 'labs', label: t('bookLab'), icon: TestTube2, color: '#ec4899' }
          ].map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.id}
                onClick={() => setActiveTab(action.id)}
                className="med-card-interactive"
                style={{
                  background: 'var(--surface-card)',
                  border: '1px solid var(--border-subtle)',
                  padding: '0.9rem 0.8rem',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.45rem',
                  boxShadow: 'var(--shadow-xs)'
                }}
              >
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    background: `${action.color}15`,
                    color: action.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Icon size={20} />
                </div>
                <span style={{ fontSize: 'var(--font-xs)', fontWeight: 700, color: 'var(--text-main)', textAlign: 'center' }}>
                  {action.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid: Live Dashboard Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.25rem'
        }}
      >
        {/* CARD 1: Today's Medicines */}
        <div className="med-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
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
                <Pill size={18} />
              </div>
              <h3 style={{ fontSize: 'var(--font-md)', fontWeight: 700 }}>{t('todaysMeds')}</h3>
            </div>
            <button
              onClick={() => setActiveTab('medicines')}
              style={{ fontSize: 'var(--font-xs)', fontWeight: 700, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}
            >
              <span>View All</span>
              <ChevronRight size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {reminders.slice(0, 3).map((rem) => (
              <div
                key={rem.id}
                style={{
                  padding: '0.75rem 0.9rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--surface-hover)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: 'var(--font-sm)', color: 'var(--text-main)' }}>
                    {rem.medicineName}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    {rem.dosage} • {rem.scheduleTimes.join(', ')} • {rem.foodInstruction.replace('_', ' ')}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: 600, marginTop: '2px' }}>
                    Remaining: {rem.remainingQuantity} doses
                  </div>
                </div>

                <button
                  onClick={() => handleTakeDose(rem.id, rem.medicineName)}
                  className="btn btn-primary btn-sm"
                  style={{ gap: '0.3rem' }}
                >
                  <CheckCircle2 size={13} />
                  <span>Take</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* CARD 2: Upcoming Appointment */}
        <div className="med-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'var(--secondary-light)',
                  color: 'var(--secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Calendar size={18} />
              </div>
              <h3 style={{ fontSize: 'var(--font-md)', fontWeight: 700 }}>{t('upcomingAppt')}</h3>
            </div>
            <button
              onClick={() => setActiveTab('appointments')}
              style={{ fontSize: 'var(--font-xs)', fontWeight: 700, color: 'var(--secondary)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}
            >
              <span>Manage</span>
              <ChevronRight size={14} />
            </button>
          </div>

          {upcomingAppt ? (
            <div
              style={{
                padding: '1rem',
                borderRadius: 'var(--radius-sm)',
                background: 'linear-gradient(135deg, var(--surface-hover) 0%, var(--surface-card) 100%)',
                border: '1px solid var(--border-subtle)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <div>
                  <h4 style={{ fontWeight: 700, fontSize: 'var(--font-md)' }}>{upcomingAppt.doctorName}</h4>
                  <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>
                    {upcomingAppt.specialization}
                  </p>
                </div>
                <span className="badge badge-primary">
                  {upcomingAppt.type === 'video' ? 'Video Consult' : 'In-Clinic'}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: 'var(--font-xs)', color: 'var(--text-secondary)', marginBottom: '0.85rem' }}>
                <Clock size={13} color="var(--primary)" />
                <span style={{ fontWeight: 600 }}>{upcomingAppt.date} at {upcomingAppt.timeSlot}</span>
              </div>

              <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                Reason: &quot;{upcomingAppt.chiefComplaint}&quot;
              </p>

              {upcomingAppt.type === 'video' ? (
                <button
                  onClick={() => setActiveTab('telehealth')}
                  className="btn btn-primary"
                  style={{ width: '100%', gap: '0.4rem' }}
                >
                  <Video size={16} />
                  <span>Join Telehealth Video Call</span>
                </button>
              ) : (
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center', fontWeight: 600 }}>
                  Clinic: {upcomingAppt.clinicAddress || '120 Elm Street, Springfield'}
                </div>
              )}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '1.5rem 0', color: 'var(--text-muted)' }}>
              No upcoming appointments.
            </div>
          )}
        </div>

        {/* CARD 3: Next Medicine Refill */}
        <div className="med-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'var(--warning-light)',
                  color: 'var(--warning)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Clock size={18} />
              </div>
              <h3 style={{ fontSize: 'var(--font-md)', fontWeight: 700 }}>{t('nextRefill')}</h3>
            </div>
            <span className="badge badge-warning">Action Needed</span>
          </div>

          {refillNeededMed && (
            <div
              style={{
                padding: '0.9rem',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--surface-hover)',
                border: '1px solid var(--border-subtle)'
              }}
            >
              <div style={{ fontWeight: 700, fontSize: 'var(--font-sm)', color: 'var(--text-main)', marginBottom: '0.2rem' }}>
                {refillNeededMed.medicineName}
              </div>
              <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '0.8rem' }}>
                Only <strong>{refillNeededMed.remainingQuantity} doses</strong> remaining. At current dosage, your supply will finish around <strong>{refillNeededMed.refillDate}</strong>.
              </p>

              <button
                onClick={() => {
                  addToCart({
                    id: `item-${Date.now()}`,
                    medicineId: refillNeededMed.medicineId || 'med-3',
                    medicineName: `${refillNeededMed.medicineName} (Refill Pack)`,
                    quantity: 1,
                    unitPrice: 8.40,
                    totalAmount: 8.40,
                    requiresPrescription: true
                  });
                  setActiveTab('orders');
                }}
                className="btn btn-primary btn-sm"
                style={{ width: '100%', gap: '0.4rem' }}
              >
                <Pill size={14} />
                <span>1-Tap Reorder Refill ($8.40)</span>
              </button>
            </div>
          )}
        </div>

        {/* CARD 4: Health Summary & Vitals */}
        <div className="med-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'var(--success-light)',
                color: 'var(--success)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <ShieldCheck size={18} />
            </div>
            <h3 style={{ fontSize: 'var(--font-md)', fontWeight: 700 }}>{t('healthSummary')}</h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem', marginBottom: '0.8rem' }}>
            <div style={{ padding: '0.6rem', background: 'var(--surface-hover)', borderRadius: 'var(--radius-xs)' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Active Medicines</div>
              <div style={{ fontSize: 'var(--font-lg)', fontWeight: 800, color: 'var(--primary)' }}>3 Rx</div>
            </div>
            <div style={{ padding: '0.6rem', background: 'var(--surface-hover)', borderRadius: 'var(--radius-xs)' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Blood Group</div>
              <div style={{ fontSize: 'var(--font-lg)', fontWeight: 800, color: 'var(--text-main)' }}>
                {patientProfile?.bloodGroup || 'B+'}
              </div>
            </div>
            <div style={{ padding: '0.6rem', background: 'var(--surface-hover)', borderRadius: 'var(--radius-xs)' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>BMI Score</div>
              <div style={{ fontSize: 'var(--font-lg)', fontWeight: 800, color: '#10b981' }}>
                {patientProfile?.bmi || 22.7}
              </div>
            </div>
            <div style={{ padding: '0.6rem', background: 'var(--surface-hover)', borderRadius: 'var(--radius-xs)' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>MediWallet Credits</div>
              <div style={{ fontSize: 'var(--font-lg)', fontWeight: 800, color: 'var(--secondary)' }}>
                $45.00
              </div>
            </div>
          </div>

          <p style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
            *Preventive Note: Seasonal pollen indices are elevated this week in Springfield. Keep Montelukast handy.*
          </p>
        </div>
      </div>
    </div>
  );
};
