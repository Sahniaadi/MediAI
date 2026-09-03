'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Bell,
  CheckCircle2,
  Calendar,
  Pill,
  ShoppingBag,
  FileText,
  Clock,
  Sparkles
} from 'lucide-react';
import { AppNotification } from '@/lib/db/types';

export const NotificationDrawer: React.FC = () => {
  const { isNotificationsOpen, setIsNotificationsOpen, setActiveTab } = useApp();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  const loadNotifications = async () => {
    try {
      const res = await fetch('/api/auth/profile');
      // For notifications, we can fetch from DB
      const notifsRes = await fetch('/api/medicines/reminders');
      // We can also have an endpoint or load from context
    } catch (e) {}
  };

  const sampleNotifications: AppNotification[] = [
    {
      id: 'notif-1',
      userId: 'user-patient-1',
      title: 'Medicine Dose: Metformin 500mg',
      message: 'Time for your morning dose of Metformin (1 tablet after breakfast).',
      type: 'medicine_dose',
      read: false,
      timestamp: 'Just now',
      actionUrl: '/medicines'
    },
    {
      id: 'notif-2',
      userId: 'user-patient-1',
      title: 'Upcoming Video Telehealth Session',
      message: 'Dr. Sophia Patel, Cardiologist is scheduled for Sept 5 at 02:00 PM.',
      type: 'appointment',
      read: false,
      timestamp: '2 hours ago',
      actionUrl: '/appointments'
    },
    {
      id: 'notif-3',
      userId: 'user-patient-1',
      title: 'Low Medicine Refill Warning',
      message: 'Atorvastatin 20mg has 6 tablets remaining. Scheduled refill reminder set.',
      type: 'refill',
      read: true,
      timestamp: 'Yesterday',
      actionUrl: '/medicines'
    },
    {
      id: 'notif-4',
      userId: 'user-patient-1',
      title: 'Diagnostic Lab Report Available',
      message: 'Comprehensive Lipid Profile report published with AI explanations.',
      type: 'lab_report',
      read: true,
      timestamp: '2 days ago',
      actionUrl: '/labs'
    }
  ];

  if (!isNotificationsOpen) return null;

  return (
    <div className="modal-overlay" style={{ zIndex: 1100 }} onClick={() => setIsNotificationsOpen(false)}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '440px',
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
          padding: '1.25rem'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.6rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Bell size={18} color="var(--primary)" />
            <h3 style={{ fontSize: 'var(--font-md)', fontWeight: 800 }}>Notification Center</h3>
          </div>
          <button onClick={() => setIsNotificationsOpen(false)} style={{ fontSize: '18px', color: 'var(--text-muted)' }}>
            ✕
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', overflowY: 'auto' }}>
          {sampleNotifications.map((n) => (
            <div
              key={n.id}
              onClick={() => {
                setIsNotificationsOpen(false);
                if (n.type === 'medicine_dose') setActiveTab('medicines');
                else if (n.type === 'appointment') setActiveTab('appointments');
                else if (n.type === 'lab_report') setActiveTab('labs');
              }}
              style={{
                padding: '0.75rem',
                borderRadius: 'var(--radius-sm)',
                background: n.read ? 'var(--surface-hover)' : 'var(--primary-light)',
                cursor: 'pointer',
                border: '1px solid var(--border-subtle)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ fontWeight: 700, fontSize: 'var(--font-xs)', color: n.read ? 'var(--text-main)' : 'var(--primary)' }}>
                  {n.title}
                </div>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{n.timestamp}</span>
              </div>
              <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '0.2rem', lineHeight: 1.4 }}>
                {n.message}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
