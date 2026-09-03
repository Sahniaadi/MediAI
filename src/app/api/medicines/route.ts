import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');
  const category = searchParams.get('category');

  let list = db.getMedicines();
  if (q) {
    list = db.searchMedicines(q);
  }
  if (category && category !== 'All') {
    list = list.filter((m) => m.category.toLowerCase().includes(category.toLowerCase()));
  }

  return NextResponse.json({ medicines: list });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, medicine } = body;

    if (action === 'check_interactions') {
      const patientAllergies = db.getPatientProfile().allergies;
      const warnings: string[] = [];

      // Check against penicillin
      if (
        patientAllergies.some((a) => a.toLowerCase().includes('penicillin')) &&
        (medicine.name.toLowerCase().includes('amoxicillin') ||
          medicine.name.toLowerCase().includes('ampicillin') ||
          medicine.name.toLowerCase().includes('penicillin'))
      ) {
        warnings.push(
          `ALLERGY WARNING: Patient has a recorded Penicillin allergy. ${medicine.name} contains beta-lactam compounds and may provoke severe allergic reaction.`
        );
      }

      return NextResponse.json({
        hasWarning: warnings.length > 0,
        warnings
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
