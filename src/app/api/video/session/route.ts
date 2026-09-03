import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const appointmentId = searchParams.get('appointmentId') || 'appt-101';

  let session = db.getVideoSession(appointmentId);
  if (!session) {
    session = db.createOrGetVideoSession(
      appointmentId,
      'doc-1',
      'Dr. Sophia Patel, MD',
      db.getPatientProfile().userId,
      db.getPatientProfile().fullName
    );
  }
  return NextResponse.json({ session });
}

export async function POST(request: Request) {
  try {
    const { appointmentId, action } = await request.json();

    if (action === 'end_call') {
      const session = db.getVideoSession(appointmentId);
      if (session) {
        session.status = 'ended';
      }
      return NextResponse.json({
        success: true,
        message: 'Video consultation ended. Summary and digital prescription generated.',
        prescriptionId: 'rx-2026-001'
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
