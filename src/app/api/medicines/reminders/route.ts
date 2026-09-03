import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  const reminders = db.getReminders();
  const adherenceLogs = db.getAdherenceLogs();
  const adherenceRate = db.getAdherenceRate();
  return NextResponse.json({
    reminders,
    adherenceLogs,
    adherenceRate
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, reminderId, status = 'taken', reminderData } = body;

    // Log dose taken or missed
    if (action === 'log_dose') {
      const result = db.logDoseTaken(reminderId, status);
      if (!result) {
        return NextResponse.json({ error: 'Reminder not found' }, { status: 404 });
      }
      return NextResponse.json({
        success: true,
        reminder: result.reminder,
        log: result.log,
        adherenceRate: db.getAdherenceRate()
      });
    }

    // Snooze reminder
    if (action === 'snooze') {
      const updated = db.updateReminder(reminderId, { snoozeMinutes: 15 });
      return NextResponse.json({ success: true, reminder: updated });
    }

    // Add new reminder
    if (action === 'add_reminder') {
      const newRem = {
        id: `rem-${Date.now()}`,
        patientId: db.getPatientProfile().userId,
        ...reminderData
      };
      const reminders = db.getReminders();
      reminders.push(newRem);
      return NextResponse.json({ success: true, reminder: newRem });
    }

    // Update refill date
    if (action === 'reschedule_refill') {
      const { newRefillDate } = body;
      const updated = db.updateReminder(reminderId, { refillDate: newRefillDate });
      return NextResponse.json({ success: true, reminder: updated });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
