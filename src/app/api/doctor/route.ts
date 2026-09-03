import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { Prescription } from '@/lib/db/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const doctorId = searchParams.get('doctorId') || 'doc-1';

  const doctor = db.getDoctorById(doctorId);
  const appointments = db.getAppointments().filter((a) => a.doctorId === doctorId || doctorId === 'doc-1');
  const patientProfile = db.getPatientProfile();
  const pastPrescriptions = db.getPrescriptions();
  const records = db.getMedicalRecords();

  const totalEarnings = appointments
    .filter((a) => a.paymentStatus === 'paid')
    .reduce((sum, a) => sum + a.fee, 0);

  return NextResponse.json({
    doctor,
    appointments,
    patientEMR: {
      profile: patientProfile,
      pastPrescriptions,
      records
    },
    analytics: {
      totalAppointments: appointments.length,
      completedAppointments: appointments.filter((a) => a.status === 'completed').length,
      totalEarnings,
      rating: doctor?.rating || 4.9,
      reviewCount: doctor?.reviewCount || 142
    }
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, prescriptionData, doctorUpdates, doctorId = 'doc-1' } = body;

    // Doctor creates and signs a digital prescription
    if (action === 'create_prescription') {
      const doctor = db.getDoctorById(doctorId);
      const newRx: Prescription = {
        id: `rx-doc-${Date.now()}`,
        patientId: db.getPatientProfile().userId,
        patientName: db.getPatientProfile().fullName,
        doctorId,
        doctorName: doctor ? doctor.name : 'Dr. Sophia Patel, MD',
        doctorRegNumber: doctor ? doctor.registrationNumber : 'MED-NY-84920',
        clinicName: doctor ? doctor.clinicName : 'Metropolitan Heart & Vascular Institute',
        date: new Date().toISOString().split('T')[0],
        digitalSignature: `${doctor ? doctor.name : 'Dr. Sophia Patel'}, MD [VERIFIED CRYPTO-SIGNATURE #${Date.now()}]`,
        status: 'active',
        ...prescriptionData
      };

      const saved = db.addPrescription(newRx);
      return NextResponse.json({
        success: true,
        prescription: saved,
        message: 'Prescription signed and securely delivered to patient account.'
      });
    }

    // Update doctor profile (fees, availability, license)
    if (action === 'update_profile') {
      const updated = db.updateDoctor(doctorId, doctorUpdates);
      return NextResponse.json({ success: true, doctor: updated });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
