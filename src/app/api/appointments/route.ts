import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { Appointment } from '@/lib/db/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const doctorId = searchParams.get('doctorId');

  let list = db.getAppointments();
  if (doctorId) {
    list = list.filter((a) => a.doctorId === doctorId);
  }
  const doctors = db.getDoctors();
  return NextResponse.json({ appointments: list, doctors });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, appointmentData, appointmentId, newStatus, newDate, newSlot } = body;

    // Book Appointment
    if (action === 'book') {
      const newAppt: Appointment = {
        id: `appt-${Date.now()}`,
        patientId: db.getPatientProfile().userId,
        patientName: db.getPatientProfile().fullName,
        status: 'confirmed',
        paymentStatus: 'paid',
        videoSessionId: appointmentData.type === 'video' ? `vid-room-${Date.now()}` : undefined,
        ...appointmentData
      };
      const created = db.createAppointment(newAppt);
      return NextResponse.json({ success: true, appointment: created });
    }

    // Reschedule
    if (action === 'reschedule') {
      const updated = db.updateAppointment(appointmentId, {
        date: newDate,
        timeSlot: newSlot,
        status: 'rescheduled'
      });
      return NextResponse.json({ success: true, appointment: updated });
    }

    // Cancel
    if (action === 'cancel') {
      const updated = db.updateAppointment(appointmentId, {
        status: 'cancelled',
        paymentStatus: 'refunded'
      });
      return NextResponse.json({
        success: true,
        appointment: updated,
        message: 'Appointment cancelled. 100% refund initiated to original payment source.'
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
