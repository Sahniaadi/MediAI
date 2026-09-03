import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { processUserMedicalQuery } from '@/lib/ai/medicalEngine';

export async function GET() {
  const history = db.getChatHistory();
  return NextResponse.json({ history });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message, language = 'English', mediaAttachment, action } = body;

    if (action === 'clear') {
      db.clearChatHistory();
      return NextResponse.json({ success: true, history: db.getChatHistory() });
    }

    if (!message && !mediaAttachment) {
      return NextResponse.json({ error: 'Message or attachment required' }, { status: 400 });
    }

    // Save user message
    const userMsg = db.addChatMessage({
      patientId: db.getPatientProfile().userId,
      sessionId: 'session-default',
      sender: 'user',
      text: message || (mediaAttachment ? `[Uploaded file: ${mediaAttachment.name}]` : '')
    });

    // Run AI triage
    const triage = processUserMedicalQuery(message || '', language, mediaAttachment);

    // Save AI response
    const aiMsg = db.addChatMessage({
      patientId: db.getPatientProfile().userId,
      sessionId: 'session-default',
      sender: 'ai',
      text: triage.text,
      type: triage.isEmergency
        ? 'emergency_alert'
        : triage.extractedPrescription
        ? 'prescription_preview'
        : 'text',
      data: {
        isEmergency: triage.isEmergency,
        suggestedAction: triage.suggestedAction,
        extractedPrescription: triage.extractedPrescription,
        disclaimer: triage.disclaimer
      }
    });

    return NextResponse.json({
      success: true,
      userMessage: userMsg,
      aiMessage: aiMsg,
      triage
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
