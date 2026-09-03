import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { MedicalRecord } from '@/lib/db/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');

  let list = db.getMedicalRecords();
  if (category && category !== 'all') {
    list = list.filter((r) => r.category === category);
  }
  return NextResponse.json({ records: list });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, recordData, recordId, hoursValid = 24 } = body;

    // Upload / Add new record
    if (action === 'upload') {
      const newRec: MedicalRecord = {
        id: `rec-${Date.now()}`,
        patientId: db.getPatientProfile().userId,
        ...recordData
      };
      const created = db.addMedicalRecord(newRec);
      return NextResponse.json({ success: true, record: created });
    }

    // Generate secure time-limited sharing link / PIN
    if (action === 'generate_share_link') {
      const token = Math.random().toString(36).substring(2, 8).toUpperCase();
      const expires = new Date(Date.now() + hoursValid * 60 * 60 * 1000).toISOString();

      db.logAudit({
        userId: db.getPatientProfile().userId,
        userRole: 'patient',
        action: 'DOCTOR_SHARE_LINK_GENERATED',
        resource: recordId || 'all_records',
        details: `Generated access PIN ${token} valid for ${hoursValid} hours`
      });

      return NextResponse.json({
        success: true,
        shareToken: token,
        shareUrl: `https://mediai.health/records/shared/${token}`,
        expiresAt: expires,
        message: `Temporary clinical access link generated. Valid for ${hoursValid} hours.`
      });
    }

    // Delete record
    if (action === 'delete') {
      const deleted = db.deleteMedicalRecord(recordId);
      return NextResponse.json({ success: deleted });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
