'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import {
  FileText,
  UploadCloud,
  Share2,
  Trash2,
  Download,
  Eye,
  Calendar,
  Search,
  CheckCircle2,
  Lock,
  Sparkles,
  Clock,
  ArrowRight
} from 'lucide-react';
import { MedicalRecord, RecordCategory } from '@/lib/db/types';
import { playChimeSound } from '@/lib/utils/audio';

export const MedicalRecords: React.FC = () => {
  const { patientProfile, showToast } = useApp();

  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchDoc, setSearchDoc] = useState('');
  const [activeTab, setActiveTab] = useState<'records' | 'timeline'>('records');

  // Sharing PIN / Link state
  const [shareResult, setShareResult] = useState<{ token: string; url: string; expiresAt: string } | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  // New upload form
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<RecordCategory>('lab_report');
  const [newDoctor, setNewDoctor] = useState('Dr. Sophia Patel');
  const [newTags, setNewTags] = useState('Lipid, Cardiology');

  const categories: Array<{ id: string; label: string }> = [
    { id: 'all', label: 'All Records' },
    { id: 'prescription', label: 'Prescriptions' },
    { id: 'lab_report', label: 'Lab Reports' },
    { id: 'imaging', label: 'X-Rays & Imaging' },
    { id: 'vaccination', label: 'Vaccination Records' },
    { id: 'discharge_summary', label: 'Discharge Summaries' }
  ];

  const loadRecords = async () => {
    try {
      const res = await fetch(`/api/records?category=${selectedCategory}`);
      const data = await res.json();
      if (data.records) setRecords(data.records);
    } catch (e) {
      console.error('Error fetching records:', e);
    }
  };

  useEffect(() => {
    loadRecords();
  }, [selectedCategory]);

  const handleGenerateShareLink = async (recordId?: string) => {
    try {
      const res = await fetch('/api/records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'generate_share_link', recordId, hoursValid: 24 })
      });
      const data = await res.json();
      if (data.success) {
        playChimeSound('dose_taken');
        setShareResult({
          token: data.shareToken,
          url: data.shareUrl,
          expiresAt: new Date(data.expiresAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
        showToast(`Secure 24-Hour Clinical Link Generated: PIN ${data.shareToken}`, 'success');
      }
    } catch (e) {
      showToast('Error generating share link', 'error');
    }
  };

  const handleDeleteRecord = async (id: string) => {
    if (!confirm('Are you sure you want to delete this medical record?')) return;
    try {
      await fetch('/api/records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', recordId: id })
      });
      showToast('Record deleted', 'info');
      loadRecords();
    } catch (e) {
      showToast('Error deleting record', 'error');
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    try {
      const res = await fetch('/api/records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'upload',
          recordData: {
            title: newTitle,
            category: newCategory,
            doctorName: newDoctor,
            fileUrl: '/uploads/custom-report.pdf',
            fileSize: '1.4 MB',
            mimeType: 'application/pdf',
            date: new Date().toISOString().split('T')[0],
            tags: newTags.split(',').map((s) => s.trim())
          }
        })
      });
      const data = await res.json();
      if (data.success) {
        setIsUploadOpen(false);
        setNewTitle('');
        showToast('Document uploaded and indexed successfully', 'success');
        loadRecords();
      }
    } catch (e) {
      showToast('Error uploading document', 'error');
    }
  };

  const filteredRecords = records.filter(
    (r) =>
      r.title.toLowerCase().includes(searchDoc.toLowerCase()) ||
      r.tags.some((t) => t.toLowerCase().includes(searchDoc.toLowerCase())) ||
      (r.doctorName && r.doctorName.toLowerCase().includes(searchDoc.toLowerCase()))
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Header & Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.8rem' }}>
        <div>
          <h2 style={{ fontSize: 'var(--font-2xl)', fontWeight: 800, color: 'var(--text-main)' }}>
            My Health Records & Timeline
          </h2>
          <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-muted)' }}>
            Unified EHR repository for prescriptions, imaging, lab results, and secure time-limited doctor sharing.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.6rem' }}>
          <button
            onClick={() => handleGenerateShareLink()}
            className="btn btn-secondary"
            style={{ gap: '0.4rem' }}
          >
            <Share2 size={15} />
            <span>Doctor Share PIN</span>
          </button>

          <button
            onClick={() => setIsUploadOpen(true)}
            className="btn btn-primary"
            style={{ gap: '0.4rem' }}
          >
            <UploadCloud size={16} />
            <span>Upload Document</span>
          </button>
        </div>
      </div>

      {/* Share PIN Banner Alert */}
      {shareResult && (
        <div
          style={{
            padding: '1rem 1.25rem',
            background: 'var(--primary-light)',
            borderRadius: 'var(--radius-md)',
            border: '1.5px solid var(--primary)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.8rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Lock size={20} color="var(--primary)" />
            <div>
              <div style={{ fontWeight: 800, fontSize: 'var(--font-sm)', color: 'var(--primary)' }}>
                Temporary Doctor Access Link Active
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                PIN: <strong>{shareResult.token}</strong> • Link: {shareResult.url} • Valid until {shareResult.expiresAt}
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              navigator.clipboard.writeText(`${shareResult.url} (Access PIN: ${shareResult.token})`);
              showToast('Link & PIN copied to clipboard!', 'success');
            }}
            className="btn btn-primary btn-sm"
          >
            Copy Doctor Link
          </button>
        </div>
      )}

      {/* View Switcher: Document Grid vs Chronological Timeline */}
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
          <button
            onClick={() => setActiveTab('records')}
            style={{
              padding: '0.45rem 0.9rem',
              borderRadius: 'var(--radius-xs)',
              fontSize: 'var(--font-xs)',
              fontWeight: 700,
              background: activeTab === 'records' ? 'var(--primary-light)' : 'transparent',
              color: activeTab === 'records' ? 'var(--primary)' : 'var(--text-secondary)'
            }}
          >
            All Documents
          </button>

          <button
            onClick={() => setActiveTab('timeline')}
            style={{
              padding: '0.45rem 0.9rem',
              borderRadius: 'var(--radius-xs)',
              fontSize: 'var(--font-xs)',
              fontWeight: 700,
              background: activeTab === 'timeline' ? 'var(--primary-light)' : 'transparent',
              color: activeTab === 'timeline' ? 'var(--primary)' : 'var(--text-secondary)'
            }}
          >
            Medical Timeline Journey
          </button>
        </div>

        {/* Search */}
        <div style={{ position: 'relative', width: '260px' }}>
          <Search size={14} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search documents..."
            value={searchDoc}
            onChange={(e) => setSearchDoc(e.target.value)}
            className="input-control"
            style={{ paddingLeft: '2rem', padding: '0.4rem 2rem', fontSize: 'var(--font-xs)' }}
          />
        </div>
      </div>

      {/* VIEW 1: RECORDS REPOSITORY */}
      {activeTab === 'records' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Category Filter Pills */}
          <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.3rem' }}>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                style={{
                  padding: '0.4rem 0.85rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: 'var(--font-xs)',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  background: selectedCategory === cat.id ? 'var(--primary)' : 'var(--surface-card)',
                  color: selectedCategory === cat.id ? 'white' : 'var(--text-secondary)',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Records Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
            {filteredRecords.map((rec) => (
              <div
                key={rec.id}
                className="med-card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '0.8rem'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <span className="badge badge-primary" style={{ textTransform: 'capitalize' }}>
                      {rec.category.replace('_', ' ')}
                    </span>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{rec.fileSize}</span>
                  </div>

                  <h3 style={{ fontSize: 'var(--font-md)', fontWeight: 800, marginTop: '0.5rem', color: 'var(--text-main)' }}>
                    {rec.title}
                  </h3>

                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '0.2rem 0' }}>
                    {rec.doctorName ? `Physician: ${rec.doctorName} • ` : ''}Date: {rec.date}
                  </div>

                  {rec.aiExplanation && (
                    <div
                      style={{
                        padding: '0.5rem 0.7rem',
                        borderRadius: 'var(--radius-xs)',
                        background: 'var(--surface-hover)',
                        fontSize: '11px',
                        color: 'var(--text-secondary)',
                        lineHeight: 1.5,
                        margin: '0.6rem 0'
                      }}
                    >
                      <Sparkles size={12} color="var(--primary)" style={{ display: 'inline', marginRight: '4px' }} />
                      {rec.aiExplanation}
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap', marginTop: '0.4rem' }}>
                    {rec.tags.map((t, idx) => (
                      <span key={idx} style={{ fontSize: '10px', padding: '1px 6px', borderRadius: '4px', background: 'var(--surface-muted)', color: 'var(--text-muted)' }}>
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Actions */}
                <div
                  style={{
                    borderTop: '1px solid var(--border-subtle)',
                    paddingTop: '0.8rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <button
                    onClick={() => {
                      const dummyContent = `MediAI Medical Document Record\nTitle: ${rec.title}\nCategory: ${rec.category}\nDate: ${rec.date}\nDoctor: ${rec.doctorName || 'N/A'}\nAI Insights: ${rec.aiExplanation || 'Stable'}`;
                      const blob = new Blob([dummyContent], { type: 'text/plain' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `${rec.title.replace(/\s+/g, '_')}.txt`;
                      a.click();
                      showToast('Document downloaded', 'success');
                    }}
                    className="btn btn-secondary btn-sm"
                    style={{ gap: '0.3rem' }}
                  >
                    <Download size={13} />
                    <span>Download</span>
                  </button>

                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    <button
                      onClick={() => handleGenerateShareLink(rec.id)}
                      className="btn btn-outline btn-sm"
                      style={{ gap: '0.3rem' }}
                    >
                      <Share2 size={13} />
                      <span>Share PIN</span>
                    </button>

                    <button
                      onClick={() => handleDeleteRecord(rec.id)}
                      style={{ color: 'var(--emergency-red)', padding: '0.3rem' }}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 2: CHRONOLOGICAL HEALTH TIMELINE */}
      {activeTab === 'timeline' && (
        <div className="med-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: 'var(--font-lg)', fontWeight: 800, marginBottom: '1.5rem' }}>
            Comprehensive Care Journey Timeline
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', position: 'relative', paddingLeft: '1.5rem' }}>
            {/* Timeline Vertical Track */}
            <div
              style={{
                position: 'absolute',
                top: '10px',
                bottom: '10px',
                left: '18px',
                width: '2px',
                background: 'var(--border-subtle)'
              }}
            />

            {[
              {
                date: '2026-08-25',
                step: 'Cardiology Consultation',
                desc: 'In-person consult with Dr. Sophia Patel. Evaluated blood pressure (126/82 mmHg) and initiated lipid management.',
                badge: 'Consultation',
                color: '#0d9488'
              },
              {
                date: '2026-08-25',
                step: 'Digital Prescription Issued',
                desc: 'Dr. Sophia prescribed Atorvastatin 20mg (nightly) and Metformin HCl 500mg (twice daily after meals).',
                badge: 'Prescription',
                color: '#0284c7'
              },
              {
                date: '2026-08-28',
                step: 'Home Sample Diagnostic Testing',
                desc: 'Phlebotomist collected fasting blood sample for Comprehensive Lipid Profile at 742 Evergreen Terrace.',
                badge: 'Diagnostic Lab',
                color: '#ec4899'
              },
              {
                date: '2026-08-29',
                step: 'AI Lab Report Analysis Ready',
                desc: 'Total Cholesterol: 208 mg/dL (slightly high), LDL: 126 mg/dL. AI explainer notes stable response to ongoing therapy.',
                badge: 'AI Report Analysis',
                color: '#8b5cf6'
              },
              {
                date: '2026-09-02',
                step: 'Medicine Express Doorstep Order',
                desc: 'Order placed for monthly supply of Metformin, Atorvastatin, and Paracetamol with 2-hour courier delivery.',
                badge: 'Pharmacy Order',
                color: '#f59e0b'
              },
              {
                date: '2026-09-05 (Upcoming)',
                step: 'Follow-Up Telehealth Video Consult',
                desc: 'Scheduled 15-minute video review with Dr. Sophia Patel to assess tolerability and adjust statin dosage.',
                badge: 'Follow-Up',
                color: '#10b981'
              }
            ].map((ev, idx) => (
              <div key={idx} style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                {/* Node Dot */}
                <div
                  style={{
                    position: 'absolute',
                    left: '-26px',
                    top: '2px',
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    background: ev.color,
                    boxShadow: '0 0 0 4px var(--surface-card)'
                  }}
                />

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)' }}>{ev.date}</span>
                  <span className="badge badge-primary" style={{ fontSize: '10px' }}>{ev.badge}</span>
                </div>

                <h4 style={{ fontWeight: 800, fontSize: 'var(--font-sm)', color: 'var(--text-main)' }}>
                  {ev.step}
                </h4>

                <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {ev.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Document Modal */}
      {isUploadOpen && (
        <div className="modal-overlay" onClick={() => setIsUploadOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
            <h3 style={{ fontSize: 'var(--font-lg)', fontWeight: 800, marginBottom: '1rem' }}>
              Upload Medical Document
            </h3>

            <form onSubmit={handleUploadSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>
                  Document Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Annual Blood Sugar & HbA1c Report"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="input-control"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="input-control"
                  >
                    <option value="lab_report">Lab Report</option>
                    <option value="prescription">Prescription</option>
                    <option value="imaging">X-Ray / Imaging</option>
                    <option value="vaccination">Vaccination</option>
                    <option value="discharge_summary">Discharge Summary</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>
                    Doctor / Lab
                  </label>
                  <input
                    type="text"
                    value={newDoctor}
                    onChange={(e) => setNewDoctor(e.target.value)}
                    className="input-control"
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  className="input-control"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.6rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setIsUploadOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Document
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
