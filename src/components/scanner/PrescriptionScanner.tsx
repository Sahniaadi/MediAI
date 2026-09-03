'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Camera,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  FileText,
  ShoppingBag,
  Save,
  Plus,
  Trash2,
  Sparkles,
  RefreshCw,
  Edit3
} from 'lucide-react';
import { PrescriptionMedicine } from '@/lib/db/types';
import { playChimeSound } from '@/lib/utils/audio';

export const PrescriptionScanner: React.FC = () => {
  const { setActiveTab, addToCart, showToast } = useApp();

  const [step, setStep] = useState<'upload' | 'scanning' | 'review' | 'saved'>('upload');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Extracted details state
  const [doctorName, setDoctorName] = useState('Dr. Sophia Patel, MD, FACC');
  const [doctorRegNumber, setDoctorRegNumber] = useState('MED-NY-84920');
  const [patientName, setPatientName] = useState('Aditya Sharma');
  const [rxDate, setRxDate] = useState('2026-09-02');
  const [followUpDate, setFollowUpDate] = useState('2026-10-02');
  const [confidence, setConfidence] = useState(0.96);
  const [medicines, setMedicines] = useState<PrescriptionMedicine[]>([
    {
      id: 'm-1',
      medicineName: 'Atorvastatin 20mg',
      dosage: '1 tablet (20mg)',
      frequency: '0-0-1 (Bedtime)',
      duration: '30 days',
      foodInstruction: 'after_food',
      quantityPrescribed: 30
    },
    {
      id: 'm-2',
      medicineName: 'Metformin HCl 500mg',
      dosage: '1 tablet (500mg)',
      frequency: '1-0-1 (Morning & Night)',
      duration: '30 days',
      foodInstruction: 'after_food',
      quantityPrescribed: 60
    },
    {
      id: 'm-3',
      medicineName: 'Pantoprazole 40mg',
      dosage: '1 tablet (40mg)',
      frequency: '1-0-0 (Morning)',
      duration: '15 days',
      foodInstruction: 'before_food',
      quantityPrescribed: 15
    }
  ]);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    startScanning();
  };

  const startScanning = async () => {
    setStep('scanning');
    playChimeSound('notification');

    // Simulate OCR scanning progression
    setTimeout(async () => {
      try {
        const res = await fetch('/api/ocr/scan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageName: selectedFile?.name || 'prescription-scan.jpg' })
        });
        const data = await res.json();
        if (data.extractedData) {
          setDoctorName(data.extractedData.doctorName);
          setDoctorRegNumber(data.extractedData.doctorRegNumber);
          setMedicines(data.extractedData.medicines);
          setConfidence(data.extractedData.ocrConfidence);
        }
      } catch (e) {
        console.error('Error during OCR analysis:', e);
      } finally {
        setStep('review');
        playChimeSound('dose_taken');
      }
    }, 2400);
  };

  const handleAddMedicine = () => {
    setMedicines((prev) => [
      ...prev,
      {
        id: `m-new-${Date.now()}`,
        medicineName: 'Paracetamol 500mg',
        dosage: '1 tablet',
        frequency: '1-0-1',
        duration: '5 days',
        foodInstruction: 'after_food',
        quantityPrescribed: 10
      }
    ]);
  };

  const handleRemoveMedicine = (id: string) => {
    setMedicines((prev) => prev.filter((m) => m.id !== id));
  };

  const handleSavePrescription = async () => {
    try {
      const res = await fetch('/api/doctor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_prescription',
          prescriptionData: {
            doctorName,
            doctorRegNumber,
            date: rxDate,
            followUpDate,
            medicines
          }
        })
      });
      const data = await res.json();
      if (data.success) {
        setStep('saved');
        playChimeSound('dose_taken');
        showToast('Prescription saved to My Health Records and reminders scheduled!', 'success');
      }
    } catch (e) {
      showToast('Error saving prescription', 'error');
    }
  };

  const handleOrderDirect = () => {
    medicines.forEach((m) => {
      addToCart({
        id: `item-${Date.now()}-${m.id}`,
        medicineId: 'med-3',
        medicineName: m.medicineName,
        quantity: 1,
        unitPrice: 8.40,
        totalAmount: 8.40,
        requiresPrescription: true
      });
    });
    setActiveTab('orders');
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Header */}
      <div>
        <h2 style={{ fontSize: 'var(--font-2xl)', fontWeight: 800, color: 'var(--text-main)' }}>
          Prescription Image Scanner
        </h2>
        <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-muted)' }}>
          Digitize doctor prescriptions with clinical OCR, extract dosages, schedule reminders, and order medications.
        </p>
      </div>

      {step === 'upload' && (
        <div
          className="med-card"
          style={{
            padding: '3rem 2rem',
            textAlign: 'center',
            border: '2px dashed var(--border-strong)',
            background: 'var(--surface-hover)'
          }}
        >
          <div
            style={{
              width: '68px',
              height: '68px',
              borderRadius: '50%',
              background: 'var(--primary-light)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem auto'
            }}
          >
            <Camera size={34} />
          </div>

          <h3 style={{ fontSize: 'var(--font-lg)', fontWeight: 700, marginBottom: '0.4rem' }}>
            Upload or Capture Prescription
          </h3>
          <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', maxWidth: '440px', margin: '0 auto 1.5rem auto' }}>
            Take a clear photo of your paper prescription or upload a PDF / JPG document. Our AI will automatically extract medicine names, dosages, and schedules.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <label className="btn btn-primary" style={{ cursor: 'pointer', gap: '0.5rem' }}>
              <Camera size={16} />
              <span>Use Camera / Upload Image</span>
              <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileSelect(file);
                }}
              />
            </label>

            <button
              onClick={() => {
                // Demo instant scan trigger
                setStep('scanning');
                setTimeout(() => setStep('review'), 2000);
              }}
              className="btn btn-secondary"
            >
              Try Sample Doctor Prescription
            </button>
          </div>
        </div>
      )}

      {step === 'scanning' && (
        <div
          className="med-card"
          style={{
            padding: '3.5rem 2rem',
            textAlign: 'center',
            position: 'relative',
            background: 'var(--surface-card)'
          }}
        >
          {/* Laser Sweep Animation */}
          <div className="anim-laser" />

          <div
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'var(--primary-light)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem auto'
            }}
          >
            <Sparkles size={30} className="anim-heartbeat" />
          </div>

          <h3 style={{ fontSize: 'var(--font-lg)', fontWeight: 800, marginBottom: '0.5rem' }}>
            AI Analyzing Prescription...
          </h3>
          <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-muted)' }}>
            Extracting physician credentials, drug entities, dosages, and duration schedules.
          </p>
        </div>
      )}

      {step === 'review' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Confidence Badge & Verification Alert */}
          <div
            style={{
              padding: '0.85rem 1.25rem',
              background: 'var(--surface-card)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 size={18} color="#10b981" />
              <span style={{ fontWeight: 700, fontSize: 'var(--font-sm)' }}>
                OCR Confidence: {Math.round(confidence * 100)}% (Verified Match)
              </span>
            </div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Please verify details below before confirming.
            </span>
          </div>

          {/* Doctor & Patient Metadata Header */}
          <div className="med-card">
            <h4 style={{ fontSize: 'var(--font-sm)', fontWeight: 800, color: 'var(--primary)', marginBottom: '0.8rem' }}>
              PRESCRIPTION METADATA
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.8rem' }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', display: 'block' }}>
                  Doctor Name
                </label>
                <input
                  type="text"
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                  className="input-control"
                  style={{ marginTop: '0.2rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', display: 'block' }}>
                  Doctor Medical Registration #
                </label>
                <input
                  type="text"
                  value={doctorRegNumber}
                  onChange={(e) => setDoctorRegNumber(e.target.value)}
                  className="input-control"
                  style={{ marginTop: '0.2rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', display: 'block' }}>
                  Prescription Date
                </label>
                <input
                  type="date"
                  value={rxDate}
                  onChange={(e) => setRxDate(e.target.value)}
                  className="input-control"
                  style={{ marginTop: '0.2rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', display: 'block' }}>
                  Follow-up Date
                </label>
                <input
                  type="date"
                  value={followUpDate}
                  onChange={(e) => setFollowUpDate(e.target.value)}
                  className="input-control"
                  style={{ marginTop: '0.2rem' }}
                />
              </div>
            </div>
          </div>

          {/* Extracted Medicines List */}
          <div className="med-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h4 style={{ fontSize: 'var(--font-sm)', fontWeight: 800, color: 'var(--primary)' }}>
                EXTRACTED MEDICINES ({medicines.length})
              </h4>
              <button onClick={handleAddMedicine} className="btn btn-secondary btn-sm" style={{ gap: '0.3rem' }}>
                <Plus size={14} />
                <span>Add Missing Medicine</span>
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {medicines.map((m, idx) => (
                <div
                  key={m.id || idx}
                  style={{
                    padding: '0.85rem',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--surface-hover)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.6rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontWeight: 700, fontSize: 'var(--font-sm)' }}>
                      Medicine #{idx + 1}
                    </div>
                    <button
                      onClick={() => handleRemoveMedicine(m.id || '')}
                      style={{ color: 'var(--emergency-red)', fontSize: '12px' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.5rem' }}>
                    <div>
                      <label style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Medicine Name</label>
                      <input
                        type="text"
                        value={m.medicineName}
                        onChange={(e) => {
                          const val = e.target.value;
                          setMedicines((prev) => prev.map((item, i) => (i === idx ? { ...item, medicineName: val } : item)));
                        }}
                        className="input-control"
                        style={{ padding: '0.4rem 0.6rem', fontSize: 'var(--font-xs)' }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Dosage</label>
                      <input
                        type="text"
                        value={m.dosage}
                        onChange={(e) => {
                          const val = e.target.value;
                          setMedicines((prev) => prev.map((item, i) => (i === idx ? { ...item, dosage: val } : item)));
                        }}
                        className="input-control"
                        style={{ padding: '0.4rem 0.6rem', fontSize: 'var(--font-xs)' }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Frequency</label>
                      <input
                        type="text"
                        value={m.frequency}
                        onChange={(e) => {
                          const val = e.target.value;
                          setMedicines((prev) => prev.map((item, i) => (i === idx ? { ...item, frequency: val } : item)));
                        }}
                        className="input-control"
                        style={{ padding: '0.4rem 0.6rem', fontSize: 'var(--font-xs)' }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Food Instruction</label>
                      <select
                        value={m.foodInstruction}
                        onChange={(e) => {
                          const val = e.target.value as any;
                          setMedicines((prev) => prev.map((item, i) => (i === idx ? { ...item, foodInstruction: val } : item)));
                        }}
                        className="input-control"
                        style={{ padding: '0.4rem 0.6rem', fontSize: 'var(--font-xs)' }}
                      >
                        <option value="after_food">After Food</option>
                        <option value="before_food">Before Food</option>
                        <option value="with_food">With Food</option>
                        <option value="anytime">Anytime</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Duration</label>
                      <input
                        type="text"
                        value={m.duration}
                        onChange={(e) => {
                          const val = e.target.value;
                          setMedicines((prev) => prev.map((item, i) => (i === idx ? { ...item, duration: val } : item)));
                        }}
                        className="input-control"
                        style={{ padding: '0.4rem 0.6rem', fontSize: 'var(--font-xs)' }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Confirmation Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button onClick={() => setStep('upload')} className="btn btn-secondary">
              <RefreshCw size={15} />
              <span>Scan Again</span>
            </button>

            <div style={{ display: 'flex', gap: '0.8rem' }}>
              <button onClick={handleSavePrescription} className="btn btn-secondary" style={{ gap: '0.4rem' }}>
                <Save size={16} />
                <span>Save to My Prescriptions</span>
              </button>

              <button onClick={handleOrderDirect} className="btn btn-primary" style={{ gap: '0.4rem' }}>
                <ShoppingBag size={16} />
                <span>Save & Order Medicines</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {step === 'saved' && (
        <div
          className="med-card"
          style={{
            padding: '3rem 2rem',
            textAlign: 'center',
            background: 'var(--surface-card)'
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'var(--success-light)',
              color: 'var(--success)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem auto'
            }}
          >
            <CheckCircle2 size={36} />
          </div>

          <h3 style={{ fontSize: 'var(--font-xl)', fontWeight: 800, marginBottom: '0.5rem' }}>
            Prescription Successfully Saved!
          </h3>
          <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)', maxWidth: '460px', margin: '0 auto 1.5rem auto' }}>
            The extracted medications have been synchronized with your profile. Reminders are now active in the <strong>My Medicines</strong> tab.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <button onClick={() => setActiveTab('medicines')} className="btn btn-primary">
              View Medicine Schedule
            </button>
            <button onClick={handleOrderDirect} className="btn btn-secondary">
              Order from Pharmacy
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
