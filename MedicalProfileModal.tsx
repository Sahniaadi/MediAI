'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import {
    User,
    Heart,
    AlertCircle,
    Shield,
    MapPin,
    Phone,
    Mail,
    Activity,
    Save,
    Trash2,
    FileDown
} from 'lucide-react';

export const MedicalProfileModal: React.FC = () => {
    const { isProfileModalOpen, setIsProfileModalOpen, patientProfile, updateProfile, showToast } = useApp();

    const [formData, setFormData] = useState({
        fullName: '',
        dob: '',
        age: 28,
        gender: 'Male' as 'Male' | 'Female' | 'Other',
        bloodGroup: 'B+' as any,
        height: 178,
        weight: 72,
        bmi: 22.7,
        phone: '',
        email: '',
        address: '',
        emergencyContactName: '',
        emergencyContactRelation: '',
        emergencyContactPhone: '',
        allergies: '',
        medicalConditions: '',
        currentMedicines: '',
        familyHistory: '',
        preferredLanguage: 'English',
        insuranceProvider: '',
        insurancePolicyNumber: ''
    });

    useEffect(() => {
        if (patientProfile) {
            setFormData({
                fullName: patientProfile.fullName || '',
                dob: patientProfile.dob || '',
                age: patientProfile.age || 28,
                gender: patientProfile.gender || 'Male',
                bloodGroup: patientProfile.bloodGroup || 'B+',
                height: patientProfile.height || 178,
                weight: patientProfile.weight || 72,
                bmi: patientProfile.bmi || 22.7,
                phone: patientProfile.phone || '',
                email: patientProfile.email || '',
                address: patientProfile.address || '',
                emergencyContactName: patientProfile.emergencyContactName || '',
                emergencyContactRelation: patientProfile.emergencyContactRelation || '',
                emergencyContactPhone: patientProfile.emergencyContactPhone || '',
                allergies: patientProfile.allergies ? patientProfile.allergies.join(', ') : '',
                medicalConditions: patientProfile.medicalConditions ? patientProfile.medicalConditions.join(', ') : '',
                currentMedicines: patientProfile.currentMedicines ? patientProfile.currentMedicines.join(', ') : '',
                familyHistory: patientProfile.familyHistory || '',
                preferredLanguage: patientProfile.preferredLanguage || 'English',
                insuranceProvider: patientProfile.insuranceProvider || '',
                insurancePolicyNumber: patientProfile.insurancePolicyNumber || ''
            });
        }
    }, [patientProfile]);

    if (!isProfileModalOpen) return null;

    // Auto-calculate BMI
    const handleHeightWeightChange = (height: number, weight: number) => {
        const hInMeters = height / 100;
        const bmiVal = hInMeters > 0 ? Number((weight / (hInMeters * hInMeters)).toFixed(1)) : 22.5;
        setFormData((prev) => ({ ...prev, height, weight, bmi: bmiVal }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await updateProfile({
            fullName: formData.fullName,
            dob: formData.dob,
            age: Number(formData.age),
            gender: formData.gender,
            bloodGroup: formData.bloodGroup,
            height: Number(formData.height),
            weight: Number(formData.weight),
            bmi: Number(formData.bmi),
            phone: formData.phone,
            email: formData.email,
            address: formData.address,
            emergencyContactName: formData.emergencyContactName,
            emergencyContactRelation: formData.emergencyContactRelation,
            emergencyContactPhone: formData.emergencyContactPhone,
            allergies: formData.allergies.split(',').map((s) => s.trim()).filter(Boolean),
            medicalConditions: formData.medicalConditions.split(',').map((s) => s.trim()).filter(Boolean),
            currentMedicines: formData.currentMedicines.split(',').map((s) => s.trim()).filter(Boolean),
            familyHistory: formData.familyHistory,
            preferredLanguage: formData.preferredLanguage,
            insuranceProvider: formData.insuranceProvider,
            insurancePolicyNumber: formData.insurancePolicyNumber
        });
        setIsProfileModalOpen(false);
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
        a.download = `mediai-medical-profile-${Date.now()}.json`;
        a.click();
        showToast('Medical record data exported successfully', 'success');
    };

    return (
        <div className="modal-overlay" style={{ zIndex: 1050 }} onClick={() => setIsProfileModalOpen(false)}>
            <div
                className="modal-content"
                onClick={(e) => e.stopPropagation()}
                style={{ maxWidth: '640px', maxHeight: '88vh' }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <div>
                        <h3 style={{ fontSize: 'var(--font-xl)', fontWeight: 800, color: 'var(--text-main)' }}>
                            Patient Medical Profile
                        </h3>
                        <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>
                            Comprehensive health metrics & emergency directives
                        </p>
                    </div>
                    <button onClick={() => setIsProfileModalOpen(false)} style={{ fontSize: '18px', color: 'var(--text-muted)' }}>
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {/* Personal Info Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.8rem' }}>
                        <div>
                            <label style={{ fontSize: 'var(--font-xs)', fontWeight: 600, display: 'block', marginBottom: '0.2rem' }}>
                                Full Name
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.fullName}
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                className="input-control"
                            />
                        </div>

                        <div>
                            <label style={{ fontSize: 'var(--font-xs)', fontWeight: 600, display: 'block', marginBottom: '0.2rem' }}>
                                Date of Birth
                            </label>
                            <input
                                type="date"
                                required
                                value={formData.dob}
                                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                                className="input-control"
                            />
                        </div>

                        <div>
                            <label style={{ fontSize: 'var(--font-xs)', fontWeight: 600, display: 'block', marginBottom: '0.2rem' }}>
                                Gender
                            </label>
                            <select
                                value={formData.gender}
                                onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                                className="input-control"
                            >
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div>
                            <label style={{ fontSize: 'var(--font-xs)', fontWeight: 600, display: 'block', marginBottom: '0.2rem' }}>
                                Blood Group
                            </label>
                            <select
                                value={formData.bloodGroup}
                                onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value as any })}
                                className="input-control"
                            >
                                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                                    <option key={bg} value={bg}>
                                        {bg}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Biometrics: Height, Weight, BMI */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.8rem' }}>
                        <div>
                            <label style={{ fontSize: 'var(--font-xs)', fontWeight: 600, display: 'block', marginBottom: '0.2rem' }}>
                                Height (cm)
                            </label>
                            <input
                                type="number"
                                value={formData.height}
                                onChange={(e) => handleHeightWeightChange(Number(e.target.value), formData.weight)}
                                className="input-control"
                            />
                        </div>

                        <div>
                            <label style={{ fontSize: 'var(--font-xs)', fontWeight: 600, display: 'block', marginBottom: '0.2rem' }}>
                                Weight (kg)
                            </label>
                            <input
                                type="number"
                                value={formData.weight}
                                onChange={(e) => handleHeightWeightChange(formData.height, Number(e.target.value))}
                                className="input-control"
                            />
                        </div>

                        <div>
                            <label style={{ fontSize: 'var(--font-xs)', fontWeight: 600, display: 'block', marginBottom: '0.2rem' }}>
                                BMI Calculated
                            </label>
                            <div
                                style={{
                                    padding: '0.75rem',
                                    background: 'var(--surface-hover)',
                                    borderRadius: 'var(--radius-sm)',
                                    fontWeight: 700,
                                    color: 'var(--primary)',
                                    textAlign: 'center',
                                    fontSize: 'var(--font-sm)'
                                }}
                            >
                                {formData.bmi} (Normal)
                            </div>
                        </div>
                    </div>

                    {/* Emergency Directives */}
                    <div style={{ padding: '0.8rem', background: 'var(--emergency-light)', borderRadius: 'var(--radius-sm)' }}>
                        <h4 style={{ fontSize: 'var(--font-xs)', fontWeight: 800, color: 'var(--emergency-red)', marginBottom: '0.6rem' }}>
                            EMERGENCY DIRECTIVE CONTACT
                        </h4>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.6rem' }}>
                            <div>
                                <input
                                    type="text"
                                    placeholder="Contact Name (e.g. Rajesh Sharma)"
                                    value={formData.emergencyContactName}
                                    onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
                                    className="input-control"
                                    style={{ background: 'white' }}
                                />
                            </div>
                            <div>
                                <input
                                    type="text"
                                    placeholder="Relation (Father / Spouse)"
                                    value={formData.emergencyContactRelation}
                                    onChange={(e) => setFormData({ ...formData, emergencyContactRelation: e.target.value })}
                                    className="input-control"
                                    style={{ background: 'white' }}
                                />
                            </div>
                            <div>
                                <input
                                    type="text"
                                    placeholder="Emergency Phone Number"
                                    value={formData.emergencyContactPhone}
                                    onChange={(e) => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
                                    className="input-control"
                                    style={{ background: 'white' }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Allergies & Chronic Conditions */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                        <div>
                            <label style={{ fontSize: 'var(--font-xs)', fontWeight: 600, display: 'block', marginBottom: '0.2rem' }}>
                                Known Allergies (Comma separated)
                            </label>
                            <input
                                type="text"
                                placeholder="Penicillin, Dust Mites, Peanuts"
                                value={formData.allergies}
                                onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                                className="input-control"
                            />
                        </div>
                        <div>
                            <label style={{ fontSize: 'var(--font-xs)', fontWeight: 600, display: 'block', marginBottom: '0.2rem' }}>
                                Existing Conditions
                            </label>
                            <input
                                type="text"
                                placeholder="Mild Asthma, Hypertension"
                                value={formData.medicalConditions}
                                onChange={(e) => setFormData({ ...formData, medicalConditions: e.target.value })}
                                className="input-control"
                            />
                        </div>
                    </div>

                    {/* Insurance */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                        <div>
                            <label style={{ fontSize: 'var(--font-xs)', fontWeight: 600, display: 'block', marginBottom: '0.2rem' }}>
                                Insurance Provider
                            </label>
                            <input
                                type="text"
                                placeholder="Blue Cross Shield"
                                value={formData.insuranceProvider}
                                onChange={(e) => setFormData({ ...formData, insuranceProvider: e.target.value })}
                                className="input-control"
                            />
                        </div>
                        <div>
                            <label style={{ fontSize: 'var(--font-xs)', fontWeight: 600, display: 'block', marginBottom: '0.2rem' }}>
                                Policy Number
                            </label>
                            <input
                                type="text"
                                placeholder="BCS-99482710-A"
                                value={formData.insurancePolicyNumber}
                                onChange={(e) => setFormData({ ...formData, insurancePolicyNumber: e.target.value })}
                                className="input-control"
                            />
                        </div>
                    </div>

                    {/* Actions: Save, Export, Cancel */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.8rem' }}>
                        <button
                            type="button"
                            onClick={handleExportData}
                            className="btn btn-secondary btn-sm"
                            style={{ gap: '0.3rem' }}
                        >
                            <FileDown size={14} />
                            <span>Export Health Data (JSON)</span>
                        </button>

                        <div style={{ display: 'flex', gap: '0.6rem' }}>
                            <button
                                type="button"
                                onClick={() => setIsProfileModalOpen(false)}
                                className="btn btn-secondary"
                            >
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-primary">
                                <Save size={16} />
                                <span>Save Profile</span>
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};
