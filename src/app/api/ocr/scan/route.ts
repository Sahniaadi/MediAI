import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { imageName } = await request.json();

    // Simulated OCR extraction with confidence scoring
    const extractedData = {
      doctorName: 'Dr. Sophia Patel, MD, FACC',
      doctorRegNumber: 'MED-NY-84920',
      clinicName: 'Metropolitan Heart & Vascular Institute',
      patientName: 'Aditya Sharma',
      prescriptionDate: new Date().toISOString().split('T')[0],
      followUpDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      ocrConfidence: 0.96,
      notes: 'Take medicines regularly after food. Low sodium diet recommended.',
      medicines: [
        {
          id: `scan-med-${Date.now()}-1`,
          medicineName: 'Atorvastatin 20mg',
          dosage: '1 tablet (20mg)',
          frequency: '0-0-1 (Bedtime)',
          duration: '30 days',
          foodInstruction: 'after_food' as const,
          quantityPrescribed: 30
        },
        {
          id: `scan-med-${Date.now()}-2`,
          medicineName: 'Metformin HCl 500mg',
          dosage: '1 tablet (500mg)',
          frequency: '1-0-1 (Morning & Night)',
          duration: '30 days',
          foodInstruction: 'after_food' as const,
          quantityPrescribed: 60
        },
        {
          id: `scan-med-${Date.now()}-3`,
          medicineName: 'Pantoprazole 40mg',
          dosage: '1 tablet (40mg)',
          frequency: '1-0-0 (Morning)',
          duration: '15 days',
          foodInstruction: 'before_food' as const,
          quantityPrescribed: 15
        }
      ]
    };

    db.logAudit({
      userId: db.getPatientProfile().userId,
      userRole: 'patient',
      action: 'PRESCRIPTION_SCANNED',
      resource: imageName || 'prescription-upload',
      details: 'OCR engine extracted 3 medicines with 96% confidence'
    });

    return NextResponse.json({
      success: true,
      extractedData
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
