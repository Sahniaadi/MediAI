'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  SlidersHorizontal,
  Sparkles,
  Wallet,
  Share2,
  Trash2,
  Download,
  Shield,
  CheckCircle2,
  Copy
} from 'lucide-react';
import { playChimeSound } from '@/lib/utils/audio';

export const SettingsModal: React.FC = () => {
  const { isSettingsOpen, setIsSettingsOpen, showToast } = useApp();

  const [activePlan, setActivePlan] = useState<'free' | 'gold'>('gold');
  const [walletBalance, setWalletBalance] = useState(45.00);
  const referralCode = 'CARE-ADITYA-2026';

  if (!isSettingsOpen) return null;

  const handleCopyReferral = () => {
    navigator.clipboard.writeText(`Join MediAI with my referral code ${referralCode} and get $10 credit: https://mediai.health/join/${referralCode}`);
    showToast('Referral code copied to clipboard!', 'success');
  };

  const handleExportData = async () => {
    const res = await fetch('/api/auth/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'export_data' })
    });
    const data = await res.json();
    const blob = new Blob([JSON.stringify(data.data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mediai-complete-export-${Date.now()}.json`;
    a.click();
    showToast('Medical record data exported successfully', 'success');
  };

  const handleDeleteAccount = async () => {
    if (confirm('WARNING: Are you sure you want to permanently delete your medical account and purge all health records? This action cannot be undone.')) {
      try {
        await fetch('/api/auth/profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'delete_account' })
        });
        showToast('Account scheduled for permanent erasure', 'info');
        setIsSettingsOpen(false);
      } catch (e) {
        showToast('Error deleting account', 'error');
      }
    }
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 1100 }} onClick={() => setIsSettingsOpen(false)}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '560px', maxHeight: '88vh', overflowY: 'auto' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.6rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <SlidersHorizontal size={20} color="var(--primary)" />
            <h3 style={{ fontSize: 'var(--font-lg)', fontWeight: 800 }}>Account, MediPlus & Wallet</h3>
          </div>
          <button onClick={() => setIsSettingsOpen(false)} style={{ fontSize: '18px', color: 'var(--text-muted)' }}>
            ✕
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* MediPlus Membership Plan Selector */}
          <div className="med-card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Sparkles size={18} color="#f59e0b" />
                <h4 style={{ fontSize: 'var(--font-md)', fontWeight: 800 }}>MediPlus VIP Membership</h4>
              </div>
              <span className="badge badge-warning">Active Plan</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem', margin: '0.8rem 0' }}>
              <div
                onClick={() => {
                  setActivePlan('free');
                  showToast('Switched to Standard Free Plan', 'info');
                }}
                style={{
                  padding: '0.8rem',
                  borderRadius: 'var(--radius-sm)',
                  border: activePlan === 'free' ? '2px solid var(--primary)' : '1px solid var(--border-subtle)',
                  background: activePlan === 'free' ? 'var(--primary-light)' : 'var(--surface-hover)',
                  cursor: 'pointer'
                }}
              >
                <div style={{ fontWeight: 800, fontSize: 'var(--font-sm)' }}>Standard Free</div>
                <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>$0 / month</div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                  Standard triage, pay-per-consult
                </div>
              </div>

              <div
                onClick={() => {
                  setActivePlan('gold');
                  showToast('MediPlus VIP Membership active!', 'success');
                }}
                style={{
                  padding: '0.8rem',
                  borderRadius: 'var(--radius-sm)',
                  border: activePlan === 'gold' ? '2px solid #f59e0b' : '1px solid var(--border-subtle)',
                  background: activePlan === 'gold' ? 'var(--warning-light)' : 'var(--surface-hover)',
                  cursor: 'pointer'
                }}
              >
                <div style={{ fontWeight: 800, fontSize: 'var(--font-sm)', color: '#b45309' }}>MediPlus VIP</div>
                <div style={{ fontSize: 'var(--font-xs)', fontWeight: 700 }}>$9.99 / month</div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                  Unlimited AI chat, 15% off medicines & lab tests, free telehealth
                </div>
              </div>
            </div>
          </div>

          {/* MediWallet & Referral System */}
          <div className="med-card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Wallet size={18} color="var(--primary)" />
                <h4 style={{ fontSize: 'var(--font-md)', fontWeight: 800 }}>MediWallet Credits</h4>
              </div>
              <span style={{ fontSize: 'var(--font-lg)', fontWeight: 800, color: 'var(--primary)' }}>
                ${walletBalance.toFixed(2)}
              </span>
            </div>

            <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-secondary)', marginBottom: '0.8rem' }}>
              Share your referral code. When a friend signs up, you both receive <strong>$10.00</strong> instant credit applied directly to pharmacy orders and doctor consults.
            </p>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                readOnly
                value={referralCode}
                className="input-control"
                style={{ fontWeight: 800, color: 'var(--primary)', letterSpacing: '0.05em' }}
              />
              <button onClick={handleCopyReferral} className="btn btn-primary" style={{ flexShrink: 0, gap: '0.3rem' }}>
                <Copy size={14} />
                <span>Copy</span>
              </button>
            </div>
          </div>

          {/* Data Privacy, Export & Account Deletion */}
          <div className="med-card" style={{ padding: '1.25rem' }}>
            <h4 style={{ fontSize: 'var(--font-sm)', fontWeight: 800, marginBottom: '0.5rem' }}>
              Data Privacy & HIPAA / GDPR Rights
            </h4>
            <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '0.8rem' }}>
              You retain full ownership of your protected health information (PHI). You can export your comprehensive health records archive at any time or request account erasure.
            </p>

            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
              <button onClick={handleExportData} className="btn btn-secondary btn-sm" style={{ gap: '0.3rem' }}>
                <Download size={13} />
                <span>Export Complete Health Records (JSON)</span>
              </button>

              <button
                onClick={handleDeleteAccount}
                className="btn btn-secondary btn-sm"
                style={{ color: 'var(--emergency-red)', gap: '0.3rem' }}
              >
                <Trash2 size={13} />
                <span>Delete Account & Purge Data</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
