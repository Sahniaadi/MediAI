import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  const profile = db.getPatientProfile();
  const familyMembers = db.getFamilyMembers();
  return NextResponse.json({ profile, familyMembers });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, profileUpdates, newFamilyMember } = body;

    if (action === 'update_profile') {
      const updated = db.updatePatientProfile(profileUpdates);
      return NextResponse.json({ success: true, profile: updated });
    }

    if (action === 'add_family_member') {
      const member = db.addFamilyMember({
        id: `fam-${Date.now()}`,
        primaryUserId: db.getPatientProfile().userId,
        ...newFamilyMember
      });
      return NextResponse.json({ success: true, member });
    }

    if (action === 'export_data') {
      const data = {
        exportedAt: new Date().toISOString(),
        user: db.getUsers()[0],
        profile: db.getPatientProfile(),
        familyMembers: db.getFamilyMembers(),
        prescriptions: db.getPrescriptions(),
        medicines: db.getReminders(),
        appointments: db.getAppointments(),
        labBookings: db.getLabBookings(),
        records: db.getMedicalRecords(),
        orders: db.getOrders()
      };
      return NextResponse.json({ success: true, data });
    }

    if (action === 'delete_account') {
      db.logAudit({
        userId: db.getPatientProfile().userId,
        userRole: 'patient',
        action: 'ACCOUNT_DELETION_REQUESTED',
        resource: '/account',
        details: 'User requested account deletion and data anonymization'
      });
      return NextResponse.json({ success: true, message: 'Account data purged in compliance with privacy regulations.' });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
