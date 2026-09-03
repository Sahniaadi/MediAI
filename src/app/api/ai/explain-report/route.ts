import { NextResponse } from 'next/server';
import { explainLabReportBiomarkers } from '@/lib/ai/medicalEngine';

export async function POST(request: Request) {
  try {
    const { title, text } = await request.json();
    const explanation = explainLabReportBiomarkers(title || text || 'Lipid Profile');
    return NextResponse.json({ success: true, explanation });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
