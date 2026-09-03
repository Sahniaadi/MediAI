'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Pill,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RotateCcw,
  Calendar,
  Sparkles,
  Plus,
  Volume2,
  Bell,
  ArrowRight,
  TrendingUp,
  ShoppingBag
} from 'lucide-react';
import { MedicineReminder, MedicineAdherenceLog } from '@/lib/db/types';
import { playChimeSound } from '@/lib/utils/audio';

export const MedicineManagement: React.FC = () => {
  const { patientProfile, addToCart, setActiveTab, showToast } = useApp();

  const [reminders, setReminders] = useState<MedicineReminder[]>([]);
  const [logs, setLogs] = useState<MedicineAdherenceLog[]>([]);
  const [adherenceRate, setAdherenceRate] = useState(94);
  const [activeView, setActiveView] = useState<'reminders' | 'adherence' | 'refills'>('reminders');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New reminder form
  const [newMedName, setNewMedName] = useState('');
  const [newDosage, setNewDosage] = useState('1 tablet');
  const [newTimes, setNewTimes] = useState('08:30 AM, 08:30 PM');
  const [newFood, setNewFood] = useState<'after_food' | 'before_food'>('after_food');
  const [newQuantity, setNewQuantity] = useState(30);

  const loadMedicineData = async () => {
    try {
      const res = await fetch('/api/medicines/reminders');
      const data = await res.json();
      if (data.reminders) setReminders(data.reminders);
      if (data.adherenceLogs) setLogs(data.adherenceLogs);
      if (data.adherenceRate !== undefined) setAdherenceRate(data.adherenceRate);
    } catch (e) {
      console.error('Error fetching reminders:', e);
    }
  };

  useEffect(() => {
    loadMedicineData();
  }, []);

  const handleTakeDose = async (reminderId: string, medName: string) => {
    try {
      const res = await fetch('/api/medicines/reminders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'log_dose', reminderId, status: 'taken' })
      });
      const data = await res.json();
      if (data.success) {
        playChimeSound('dose_taken');
        showToast(`Logged dose for ${medName}. Streak updated!`, 'success');
        loadMedicineData();
      }
    } catch (e) {
      showToast('Error logging dose', 'error');
    }
  };

  const handleSnooze = async (reminderId: string) => {
    try {
      await fetch('/api/medicines/reminders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'snooze', reminderId })
      });
      playChimeSound('notification');
      showToast('Reminder snoozed for 15 minutes', 'info');
      loadMedicineData();
    } catch (e) {
      showToast('Error snoozing reminder', 'error');
    }
  };

  const handleAddCustomReminder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMedName) return;

    // Check allergy warning first
    if (
      patientProfile?.allergies.some((a) => a.toLowerCase().includes('penicillin')) &&
      newMedName.toLowerCase().includes('amox')
    ) {
      alert('SAFETY INTERACTION WARNING: You have a documented Penicillin allergy. Cannot add Penicillin-class antibiotics without doctor approval.');
      return;
    }

    try {
      const res = await fetch('/api/medicines/reminders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add_reminder',
          reminderData: {
            medicineName: newMedName,
            dosage: newDosage,
            frequency: 'Twice daily',
            scheduleTimes: newTimes.split(',').map((s) => s.trim()),
            foodInstruction: newFood,
            remainingQuantity: Number(newQuantity),
            totalQuantity: Number(newQuantity),
            startDate: new Date().toISOString().split('T')[0],
            endDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
            refillDate: new Date(Date.now() + 25 * 86400000).toISOString().split('T')[0],
            active: true
          }
        })
      });
      const data = await res.json();
      if (data.success) {
        setIsAddModalOpen(false);
        setNewMedName('');
        showToast('Medication reminder created successfully', 'success');
        loadMedicineData();
      }
    } catch (e) {
      showToast('Error creating reminder', 'error');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Header & Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.8rem' }}>
        <div>
          <h2 style={{ fontSize: 'var(--font-2xl)', fontWeight: 800, color: 'var(--text-main)' }}>
            My Medicines & Adherence
          </h2>
          <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-muted)' }}>
            Track active schedules, dose adherence streaks, and automated refill depletion forecasts.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="btn btn-primary"
            style={{ gap: '0.4rem' }}
          >
            <Plus size={16} />
            <span>Add Medication</span>
          </button>
        </div>
      </div>

      {/* View Switcher Tabs & Adherence Score Banner */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          padding: '0.75rem 1rem',
          background: 'var(--surface-card)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)'
        }}
      >
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          {(
            [
              { id: 'reminders', label: 'Active Medicines' },
              { id: 'refills', label: 'Refill Forecasts' },
              { id: 'adherence', label: 'Adherence Streak' }
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id)}
              style={{
                padding: '0.45rem 0.9rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: 'var(--font-xs)',
                fontWeight: 700,
                background: activeView === tab.id ? 'var(--primary-light)' : 'transparent',
                color: activeView === tab.id ? 'var(--primary)' : 'var(--text-secondary)'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Adherence Rate */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <TrendingUp size={18} color="var(--primary)" />
          <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>7-Day Compliance:</span>
          <span style={{ fontSize: 'var(--font-md)', fontWeight: 800, color: 'var(--primary)' }}>
            {adherenceRate}%
          </span>
        </div>
      </div>

      {/* VIEW 1: ACTIVE REMINDERS */}
      {activeView === 'reminders' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
          {reminders.map((rem) => {
            const hasGeneric = rem.medicineName.includes('Atorvastatin') || rem.medicineName.includes('Metformin');
            const isLow = rem.remainingQuantity <= 8;

            return (
              <div
                key={rem.id}
                className="med-card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '1rem'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                    <div>
                      <h3 style={{ fontSize: 'var(--font-md)', fontWeight: 800, color: 'var(--text-main)' }}>
                        {rem.medicineName}
                      </h3>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        {rem.dosage} • {rem.frequency}
                      </div>
                    </div>
                    <span className={`badge ${isLow ? 'badge-danger' : 'badge-primary'}`}>
                      {rem.remainingQuantity} pills left
                    </span>
                  </div>

                  {/* Generic Alternative Badge */}
                  {hasGeneric && (
                    <div
                      style={{
                        margin: '0.5rem 0',
                        padding: '0.35rem 0.6rem',
                        borderRadius: 'var(--radius-xs)',
                        background: 'var(--success-light)',
                        color: '#065f46',
                        fontSize: '11px',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem'
                      }}
                    >
                      <Sparkles size={13} />
                      <span>Generic alternative available (Save up to 55%)</span>
                    </div>
                  )}

                  {/* Dose Schedule Times */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.6rem' }}>
                    <Clock size={14} color="var(--primary)" />
                    <span style={{ fontSize: 'var(--font-xs)', fontWeight: 600 }}>
                      Times: {rem.scheduleTimes.join(' & ')}
                    </span>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      ({rem.foodInstruction.replace('_', ' ')})
                    </span>
                  </div>

                  {/* Refill Date Preview */}
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                    Estimated refill date: <strong style={{ color: 'var(--text-secondary)' }}>{rem.refillDate}</strong>
                  </div>
                </div>

                {/* Actions: Take Now, Snooze */}
                <div style={{ display: 'flex', gap: '0.5rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.8rem' }}>
                  <button
                    onClick={() => handleTakeDose(rem.id, rem.medicineName)}
                    className="btn btn-primary"
                    style={{ flex: 1, gap: '0.4rem' }}
                  >
                    <CheckCircle2 size={16} />
                    <span>Take Dose</span>
                  </button>

                  <button
                    onClick={() => handleSnooze(rem.id)}
                    className="btn btn-secondary"
                    style={{ gap: '0.3rem' }}
                    title="Snooze 15 minutes"
                  >
                    <RotateCcw size={14} />
                    <span>Snooze</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW 2: REFILL FORECAST SYSTEM */}
      {activeView === 'refills' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div
            style={{
              padding: '1rem',
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(13, 148, 136, 0.08) 100%)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(245, 158, 11, 0.3)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <Clock size={18} color="var(--warning)" />
              <h4 style={{ fontWeight: 800, fontSize: 'var(--font-md)' }}>
                Predictive Next-Month Refill Engine
              </h4>
            </div>
            <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              MediAI analyzes your daily dosage intake rate and remaining pill quantities. Refill reminders are automatically scheduled 3 to 5 days before complete exhaustion so you never run out of critical prescription medicines.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {reminders.map((rem) => {
              const pillsLeft = rem.remainingQuantity;
              const daysLeft = Math.ceil(pillsLeft / 2);

              return (
                <div
                  key={rem.id}
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
                    <div style={{ fontWeight: 800, fontSize: 'var(--font-md)' }}>
                      {rem.medicineName}
                    </div>
                    <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-secondary)', margin: '0.2rem 0' }}>
                      Your medicine may finish around <strong>{rem.refillDate}</strong> ({daysLeft} days remaining).
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: 600 }}>
                      Refill reminder scheduled for: {rem.refillDate}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => {
                        const newD = prompt('Enter new reminder date (YYYY-MM-DD):', rem.refillDate);
                        if (newD) {
                          fetch('/api/medicines/reminders', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ action: 'reschedule_refill', reminderId: rem.id, newRefillDate: newD })
                          }).then(() => {
                            showToast('Refill reminder updated', 'success');
                            loadMedicineData();
                          });
                        }
                      }}
                      className="btn btn-secondary btn-sm"
                    >
                      Change Date
                    </button>

                    <button
                      onClick={() => {
                        addToCart({
                          id: `item-refill-${Date.now()}`,
                          medicineId: rem.medicineId || 'med-3',
                          medicineName: `${rem.medicineName} (Refill Pack)`,
                          quantity: 1,
                          unitPrice: 8.40,
                          totalAmount: 8.40,
                          requiresPrescription: true
                        });
                        setActiveTab('orders');
                      }}
                      className="btn btn-primary btn-sm"
                      style={{ gap: '0.4rem' }}
                    >
                      <ShoppingBag size={14} />
                      <span>Prepare Refill Cart</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 3: ADHERENCE STREAK CALENDAR & LOGS */}
      {activeView === 'adherence' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Adherence Streak Grid */}
          <div className="med-card">
            <h4 style={{ fontSize: 'var(--font-sm)', fontWeight: 800, color: 'var(--primary)', marginBottom: '0.8rem' }}>
              MEDICATION LOG STREAK (LAST 7 DAYS)
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem', textAlign: 'center' }}>
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => (
                <div
                  key={day}
                  style={{
                    padding: '0.75rem 0.5rem',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--surface-hover)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.4rem'
                  }}
                >
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{day}</span>
                  <div
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: '#10b981',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '11px'
                    }}
                  >
                    ✓
                  </div>
                  <span style={{ fontSize: '10px', fontWeight: 700, color: '#10b981' }}>100%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Adherence Log List */}
          <div className="med-card">
            <h4 style={{ fontSize: 'var(--font-sm)', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.8rem' }}>
              Recent Dose Intake Log
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {logs.map((log) => (
                <div
                  key={log.id}
                  style={{
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-xs)',
                    background: 'var(--surface-hover)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: 'var(--font-xs)'
                  }}
                >
                  <div>
                    <span style={{ fontWeight: 700 }}>{log.medicineName}</span>
                    <span style={{ color: 'var(--text-muted)', marginLeft: '0.5rem' }}>
                      Scheduled: {log.scheduledTime}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className="badge badge-success">Taken</span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '10px' }}>
                      {new Date(log.takenAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add Medication Modal */}
      {isAddModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAddModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px' }}>
            <h3 style={{ fontSize: 'var(--font-lg)', fontWeight: 800, marginBottom: '1rem' }}>
              Add Medicine Reminder
            </h3>

            <form onSubmit={handleAddCustomReminder} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>
                  Medicine Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Losartan Potassium 50mg"
                  value={newMedName}
                  onChange={(e) => setNewMedName(e.target.value)}
                  className="input-control"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>
                    Dosage
                  </label>
                  <input
                    type="text"
                    value={newDosage}
                    onChange={(e) => setNewDosage(e.target.value)}
                    className="input-control"
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>
                    Total Pills
                  </label>
                  <input
                    type="number"
                    value={newQuantity}
                    onChange={(e) => setNewQuantity(Number(e.target.value))}
                    className="input-control"
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>
                  Schedule Times (comma separated)
                </label>
                <input
                  type="text"
                  value={newTimes}
                  onChange={(e) => setNewTimes(e.target.value)}
                  className="input-control"
                />
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>
                  Food Instructions
                </label>
                <select
                  value={newFood}
                  onChange={(e) => setNewFood(e.target.value as any)}
                  className="input-control"
                >
                  <option value="after_food">After Food</option>
                  <option value="before_food">Before Food</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.6rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Reminder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
