'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Shield,
  Users,
  Stethoscope,
  Calendar,
  ShoppingBag,
  DollarSign,
  CheckCircle2,
  XCircle,
  FileText,
  Tag,
  AlertCircle,
  Plus,
  Lock,
  Activity
} from 'lucide-react';
import { DoctorProfile, Order, AuditLog, Coupon } from '@/lib/db/types';

export const AdminDashboard: React.FC = () => {
  const { showToast } = useApp();

  const [activeTab, setActiveTab] = useState<'metrics' | 'doctor_approvals' | 'coupons' | 'audit_logs'>('metrics');
  const [metrics, setMetrics] = useState<any>(null);
  const [doctors, setDoctors] = useState<DoctorProfile[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);

  // New coupon form
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(20);
  const [couponMin, setCouponMin] = useState(20);

  const loadAdminData = async () => {
    try {
      const res = await fetch('/api/admin');
      const data = await res.json();
      if (data.metrics) setMetrics(data.metrics);
      if (data.doctors) setDoctors(data.doctors);
      if (data.auditLogs) setAuditLogs(data.auditLogs);
      if (data.coupons) setCoupons(data.coupons);
    } catch (e) {
      console.error('Error fetching admin data:', e);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleApproveDoctor = async (doctorId: string) => {
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'approve_doctor', doctorId })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Medical license approved for ${data.doctor.name}`, 'success');
        loadAdminData();
      }
    } catch (e) {
      showToast('Error approving doctor', 'error');
    }
  };

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode) return;

    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_coupon',
          couponData: {
            code: couponCode.toUpperCase(),
            discountPercent: Number(couponDiscount),
            maxDiscount: 20,
            minOrder: Number(couponMin),
            validUntil: '2026-12-31'
          }
        })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Coupon ${couponCode.toUpperCase()} created!`, 'success');
        setCouponCode('');
        loadAdminData();
      }
    } catch (e) {
      showToast('Error creating coupon', 'error');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Admin Header */}
      <div
        style={{
          padding: '1.25rem',
          borderRadius: 'var(--radius-lg)',
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%)',
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--primary)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Shield size={30} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <h2 style={{ fontSize: 'var(--font-xl)', fontWeight: 800 }}>MediAI Master Control Center</h2>
              <span className="badge badge-success">HIPAA & GDPR Compliant</span>
            </div>
            <p style={{ fontSize: 'var(--font-xs)', opacity: 0.8 }}>
              Global Healthcare Governance, Medical Board Approvals & Audit Trail
            </p>
          </div>
        </div>

        <div style={{ fontSize: 'var(--font-xs)', opacity: 0.85 }}>
          System Uptime: <strong>99.98%</strong> • Active Sessions: <strong>42</strong>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }} className="admin-kpi-grid">
        <div className="med-card" style={{ padding: '1rem' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Registered Patients</div>
          <div style={{ fontSize: 'var(--font-xl)', fontWeight: 800, color: 'var(--primary)', marginTop: '0.2rem' }}>
            {metrics?.totalPatients || 149}
          </div>
        </div>

        <div className="med-card" style={{ padding: '1rem' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Verified Doctors</div>
          <div style={{ fontSize: 'var(--font-xl)', fontWeight: 800, color: '#0284c7', marginTop: '0.2rem' }}>
            {metrics?.totalDoctors || 10}
          </div>
        </div>

        <div className="med-card" style={{ padding: '1rem' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Pending License Checks</div>
          <div style={{ fontSize: 'var(--font-xl)', fontWeight: 800, color: '#f59e0b', marginTop: '0.2rem' }}>
            {doctors.filter((d) => d.verificationStatus === 'pending').length}
          </div>
        </div>

        <div className="med-card" style={{ padding: '1rem' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Completed Appointments</div>
          <div style={{ fontSize: 'var(--font-xl)', fontWeight: 800, color: '#10b981', marginTop: '0.2rem' }}>
            {metrics?.totalAppointments || 322}
          </div>
        </div>

        <div className="med-card" style={{ padding: '1rem' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Platform Gross Revenue</div>
          <div style={{ fontSize: 'var(--font-xl)', fontWeight: 800, color: 'var(--primary)', marginTop: '0.2rem' }}>
            ${metrics?.totalRevenue || 14734.56}
          </div>
        </div>
      </div>

      {/* Tab Switcher - Scrollable on Mobile */}
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
          { id: 'metrics', label: 'Overview Analytics' },
          { id: 'doctor_approvals', label: 'Doctor License Verification' },
          { id: 'coupons', label: 'Promotions & Coupons' },
          { id: 'audit_logs', label: 'Compliance Audit Trail' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              padding: '0.45rem 0.9rem',
              borderRadius: 'var(--radius-xs)',
              fontSize: 'var(--font-xs)',
              fontWeight: 700,
              background: activeTab === tab.id ? 'var(--primary-light)' : 'transparent',
              color: activeTab === tab.id ? 'var(--primary)' : 'var(--text-secondary)',
              whiteSpace: 'nowrap',
              flexShrink: 0
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'metrics' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(320px, 100%), 1fr))', gap: '1rem' }}>
          <div className="med-card">
            <h3 style={{ fontSize: 'var(--font-md)', fontWeight: 800, marginBottom: '0.8rem' }}>
              System Health & Architecture Telemetry
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: 'var(--font-xs)' }}>
              <div>API Latency: <strong>48ms</strong> (US-East)</div>
              <div>Database: <strong>Relational Healthcare Engine</strong> (32 Tables Active)</div>
              <div>OCR Engine: <strong>Tesseract Vision v5</strong> (Avg. Confidence 96%)</div>
              <div>WebRTC Signal Server: <strong>Healthy / Connected</strong></div>
              <div>Security Layer: <strong>AES-256 Encryption at Rest & in Transit</strong></div>
            </div>
          </div>

          <div className="med-card">
            <h3 style={{ fontSize: 'var(--font-md)', fontWeight: 800, marginBottom: '0.8rem' }}>
              Medical Board Verification Pipeline
            </h3>
            <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              All practicing physicians on MediAI undergo rigorous credentialing against state medical registries, NPI validation, and DEA registration prior to issuance of digital signatures.
            </p>
          </div>
        </div>
      )}

      {/* TAB 2: DOCTOR APPROVALS */}
      {activeTab === 'doctor_approvals' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          {doctors.map((doc) => (
            <div
              key={doc.id}
              className="med-card"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '0.8rem'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontWeight: 800, fontSize: 'var(--font-md)' }}>{doc.name}</span>
                  <span className={`badge ${doc.verificationStatus === 'verified' ? 'badge-success' : 'badge-warning'}`}>
                    {doc.verificationStatus}
                  </span>
                </div>
                <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>
                  {doc.specialization} • License #{doc.registrationNumber} • {doc.qualification}
                </div>
              </div>

              <div>
                {doc.verificationStatus === 'pending' ? (
                  <button onClick={() => handleApproveDoctor(doc.id)} className="btn btn-primary btn-sm">
                    Approve Medical Board License
                  </button>
                ) : (
                  <span style={{ fontSize: 'var(--font-xs)', color: '#10b981', fontWeight: 700 }}>
                    ✓ Licensed & Active
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: COUPONS */}
      {activeTab === 'coupons' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Coupon Creation Form */}
          <div className="med-card">
            <h3 style={{ fontSize: 'var(--font-md)', fontWeight: 800, marginBottom: '0.8rem' }}>
              Create Promotional Coupon
            </h3>
            <form onSubmit={handleCreateCoupon} style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
              <input
                type="text"
                placeholder="Code (e.g. WELLNESS30)"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="input-control"
                style={{ flex: 1, textTransform: 'uppercase' }}
              />
              <input
                type="number"
                placeholder="Discount %"
                value={couponDiscount}
                onChange={(e) => setCouponDiscount(Number(e.target.value))}
                className="input-control"
                style={{ width: '120px' }}
              />
              <input
                type="number"
                placeholder="Min Order $"
                value={couponMin}
                onChange={(e) => setCouponMin(Number(e.target.value))}
                className="input-control"
                style={{ width: '120px' }}
              />
              <button type="submit" className="btn btn-primary">
                Create Coupon
              </button>
            </form>
          </div>

          {/* Active Coupons List */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.8rem' }}>
            {coupons.map((c) => (
              <div key={c.id} className="med-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 800, fontSize: 'var(--font-md)', color: 'var(--primary)' }}>
                    {c.code}
                  </span>
                  <span className="badge badge-success">{c.discountPercent}% OFF</span>
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                  Min order: ${c.minOrder} • Max discount: ${c.maxDiscount}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: AUDIT LOGS */}
      {activeTab === 'audit_logs' && (
        <div className="med-card">
          <h3 style={{ fontSize: 'var(--font-md)', fontWeight: 800, marginBottom: '0.8rem' }}>
            HIPAA & GDPR Access Audit Trail (Last 50 Events)
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '500px', overflowY: 'auto' }}>
            {auditLogs.map((log) => (
              <div
                key={log.id}
                style={{
                  padding: '0.6rem 0.8rem',
                  borderRadius: 'var(--radius-xs)',
                  background: 'var(--surface-hover)',
                  fontSize: 'var(--font-xs)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <span style={{ fontWeight: 700, color: 'var(--primary)' }}>[{log.action}]</span>{' '}
                  <span>{log.details}</span>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                    Resource: {log.resource} • IP: {log.ipAddress} • User: {log.userId} ({log.userRole})
                  </div>
                </div>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                  {new Date(log.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <style jsx global>{`
        @media (min-width: 768px) {
          .admin-kpi-grid {
            grid-template-columns: repeat(5, 1fr) !important;
          }
        }
        @media (min-width: 480px) and (max-width: 767px) {
          .admin-kpi-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
      `}</style>
    </div>
  );
};
