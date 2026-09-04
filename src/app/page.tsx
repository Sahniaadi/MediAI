'use client';

import React, { useState } from 'react';
import { AppProvider, useApp } from '@/context/AppContext';
import { AccessibilityBar } from '@/components/layout/AccessibilityBar';
import { Navbar } from '@/components/layout/Navbar';
import { BottomNav } from '@/components/layout/BottomNav';
import { PatientHome } from '@/components/patient/PatientHome';
import { AIAssistant } from '@/components/ai/AIAssistant';
import { PrescriptionScanner } from '@/components/scanner/PrescriptionScanner';
import { MedicineManagement } from '@/components/medicines/MedicineManagement';
import { MedicineOrdering } from '@/components/pharmacy/MedicineOrdering';
import { DoctorBooking } from '@/components/appointments/DoctorBooking';
import { VideoConsultation } from '@/components/telehealth/VideoConsultation';
import { LabTests } from '@/components/labs/LabTests';
import { MedicalRecords } from '@/components/records/MedicalRecords';
import { EmergencyModal } from '@/components/emergency/EmergencyModal';
import { OnboardingModal } from '@/components/auth/OnboardingModal';
import { MedicalProfileModal } from '@/components/auth/MedicalProfileModal';
import { NotificationDrawer } from '@/components/notifications/NotificationDrawer';
import { SettingsModal } from '@/components/settings/SettingsModal';
import { DoctorDashboard } from '@/components/doctor/DoctorDashboard';
import { PartnerDashboard } from '@/components/partner/PartnerDashboard';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { AlertTriangle, Sparkles } from 'lucide-react';

function AppContent() {
  const { currentRole, activeTab, setIsEmergencyOpen } = useApp();
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  return (
    <div className="app-wrapper">
      {/* 1. Accessibility Control Bar */}
      <AccessibilityBar />

      {/* 2. Main Top Navbar & Role Switcher */}
      <Navbar />

      {/* 3. Main Dashboard Body */}
      <main className="app-main anim-fade-in">
        {/* Role: Doctor Dashboard */}
        {currentRole === 'doctor' && <DoctorDashboard />}

        {/* Role: Pharmacy/Lab Partner Dashboard */}
        {currentRole === 'partner' && <PartnerDashboard />}

        {/* Role: Admin Master Control Center */}
        {currentRole === 'admin' && <AdminDashboard />}

        {/* Role: Patient Portal Views */}
        {currentRole === 'patient' && (
          <>
            {activeTab === 'home' && <PatientHome />}
            {activeTab === 'ai' && <AIAssistant />}
            {activeTab === 'scanner' && <PrescriptionScanner />}
            {activeTab === 'medicines' && <MedicineManagement />}
            {activeTab === 'appointments' && <DoctorBooking />}
            {activeTab === 'telehealth' && <VideoConsultation />}
            {activeTab === 'orders' && <MedicineOrdering />}
            {activeTab === 'labs' && <LabTests />}
            {activeTab === 'records' && <MedicalRecords />}
          </>
        )}
      </main>

      {/* Persistent Floating Emergency SOS Trigger (Reachable from Any Screen) */}
      <button
        onClick={() => setIsEmergencyOpen(true)}
        className="sos-floating-pill"
        title="Trigger Emergency SOS"
      >
        <AlertTriangle size={20} className="anim-heartbeat" />
        <span className="sos-text">EMERGENCY SOS</span>
      </button>

      {/* Floating Onboarding Tour Trigger */}
      <button
        onClick={() => setIsOnboardingOpen(true)}
        style={{
          position: 'fixed',
          bottom: '5.5rem',
          left: '1rem',
          zIndex: 80,
          background: 'var(--surface-glass)',
          backdropFilter: 'blur(12px)',
          border: '1px solid var(--border-subtle)',
          padding: '0.5rem 0.85rem',
          borderRadius: 'var(--radius-full)',
          fontSize: 'var(--font-xs)',
          fontWeight: 700,
          color: 'var(--primary)',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          minHeight: '44px'
        }}
        className="onboarding-guide-btn"
      >
        <Sparkles size={14} />
        <span className="onboarding-text">App Tour & Auth</span>
      </button>

      {/* Global Modals & Drawers */}
      <EmergencyModal />
      <OnboardingModal isOpen={isOnboardingOpen} onClose={() => setIsOnboardingOpen(false)} />
      <MedicalProfileModal />
      <NotificationDrawer />
      <SettingsModal />

      {/* Mobile Responsive Bottom Navigation */}
      <BottomNav />

      <style jsx global>{`
        @media (min-width: 768px) {
          .onboarding-guide-btn {
            bottom: 2rem !important;
            left: 2rem !important;
          }
        }
        @media (max-width: 379px) {
          .onboarding-text {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}

export default function Home() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
