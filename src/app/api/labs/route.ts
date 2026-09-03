import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { LabBooking } from '@/lib/db/types';

export async function GET() {
  const tests = db.getLabTests();
  const bookings = db.getLabBookings();
  return NextResponse.json({ tests, bookings });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, testIds, bookingDate, timeSlot, mode, address } = body;

    if (action === 'book_test') {
      const allTests = db.getLabTests();
      const selected = allTests.filter((t) => testIds.includes(t.id));
      const totalAmount = selected.reduce((sum, t) => sum + (t.discountPrice || t.price), 0);

      const booking: LabBooking = {
        id: `lb-${Date.now()}`,
        patientId: db.getPatientProfile().userId,
        patientName: db.getPatientProfile().fullName,
        labTestIds: testIds,
        testNames: selected.map((t) => t.name),
        bookingDate,
        timeSlot,
        mode: mode || 'home_collection',
        address: address || db.getPatientProfile().address,
        status: 'booked',
        totalAmount,
        paymentStatus: 'paid'
      };

      const created = db.createLabBooking(booking);
      return NextResponse.json({ success: true, booking: created });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
