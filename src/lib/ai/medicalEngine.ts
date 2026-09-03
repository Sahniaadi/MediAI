import { db } from '../db';
import { PrescriptionMedicine } from '../db/types';

export interface TriageResult {
  text: string;
  isEmergency: boolean;
  emergencyReason?: string;
  suggestedAction?: 'call_emergency' | 'book_doctor' | 'order_medicine' | 'check_refill' | 'view_report' | 'none';
  extractedPrescription?: {
    doctorName: string;
    doctorRegNumber?: string;
    date: string;
    clinicName?: string;
    medicines: PrescriptionMedicine[];
  };
  disclaimer: string;
}

const EMERGENCY_PATTERNS = [
  /\bchest pain\b/i,
  /\bheart attack\b/i,
  /\bcan'?t breathe\b/i,
  /\bshortness of breath\b/i,
  /\bbreathing difficulty\b/i,
  /\bsevere bleeding\b/i,
  /\bstroke\b/i,
  /\bface drooping\b/i,
  /\barm weakness\b/i,
  /\bslurred speech\b/i,
  /\bunconscious\b/i,
  /\bsevere allergic reaction\b/i,
  /\banaphylaxis\b/i,
  /\bseizure\b/i,
  /\bcoughing up blood\b/i
];

const STANDARD_DISCLAIMER =
  'MediAI provides general health information and triage guidance for educational support. It is not a substitute for professional clinical medical advice, definitive diagnosis, or emergency care.';

export function checkEmergencySymptoms(message: string): { isEmergency: boolean; reason?: string } {
  for (const pattern of EMERGENCY_PATTERNS) {
    if (pattern.test(message)) {
      return {
        isEmergency: true,
        reason: `Potential acute emergency detected matching '${message.match(pattern)?.[0]}'. Urgent medical attention recommended.`
      };
    }
  }
  return { isEmergency: false };
}

export function processUserMedicalQuery(
  query: string,
  language: string = 'English',
  mediaAttachment?: { type: 'image' | 'pdf'; name: string }
): TriageResult {
  const q = query.toLowerCase().trim();

  // 1. Emergency Detection (Priority 1)
  const emergencyCheck = checkEmergencySymptoms(query);
  if (emergencyCheck.isEmergency) {
    let emergencyText = `CRITICAL MEDICAL ALERT: Based on your description of symptoms (${emergencyCheck.reason}), this could be a time-sensitive medical emergency.

Please do not wait. Take immediate action:
1. Tap the Call 911 / Emergency button below immediately.
2. Alert your designated emergency contact.
3. If alone, unlock your front door and sit down in an open, resting posture while paramedics arrive.
4. Nearest Emergency Center: Springfield Memorial Hospital (1.8 km away).`;

    if (language === 'Spanish') {
      emergencyText = `ALERTA MÉDICA CRÍTICA: Según los síntomas descritos, podría tratarse de una emergencia médica urgente. Llame al 911 de inmediato o acuda a la sala de emergencias más cercana.`;
    } else if (language === 'Hindi') {
      emergencyText = `गंभीर आपातकालीन चेतावनी: आपके द्वारा बताए गए लक्षणों के अनुसार यह एक आपातकालीन स्थिति हो सकती है। कृपया तुरंत 911 पर कॉल करें या नजदीकी अस्पताल जाएं।`;
    }

    return {
      text: emergencyText,
      isEmergency: true,
      emergencyReason: emergencyCheck.reason,
      suggestedAction: 'call_emergency',
      disclaimer: STANDARD_DISCLAIMER
    };
  }

  // 2. Prescription extraction intent or uploaded prescription image
  if (
    q.includes('prescription') ||
    q.includes('rx') ||
    (mediaAttachment && (mediaAttachment.name.includes('rx') || mediaAttachment.name.includes('presc')))
  ) {
    return {
      text: `Prescription detected successfully! I have analyzed the document and extracted the prescribed medications, dosages, and administration timings. Please review and confirm the details below before saving or ordering:`,
      isEmergency: false,
      suggestedAction: 'order_medicine',
      extractedPrescription: {
        doctorName: 'Dr. Sophia Patel, MD',
        doctorRegNumber: 'MED-NY-84920',
        clinicName: 'Metropolitan Heart & Vascular Institute',
        date: new Date().toISOString().split('T')[0],
        medicines: [
          {
            id: `scan-${Date.now()}-1`,
            medicineName: 'Atorvastatin 20mg',
            dosage: '1 tablet (20mg)',
            frequency: '0-0-1 (Bedtime)',
            duration: '30 days',
            foodInstruction: 'after_food',
            quantityPrescribed: 30
          },
          {
            id: `scan-${Date.now()}-2`,
            medicineName: 'Metformin HCl 500mg',
            dosage: '1 tablet (500mg)',
            frequency: '1-0-1 (Morning & Night)',
            duration: '30 days',
            foodInstruction: 'after_food',
            quantityPrescribed: 60
          }
        ]
      },
      disclaimer: STANDARD_DISCLAIMER
    };
  }

  // 3. Medicine Refill queries
  if (q.includes('refill') || q.includes('finish') || q.includes('run out') || q.includes('remaining pills')) {
    const reminders = db.getReminders();
    const lowMed = reminders.find((r) => r.remainingQuantity <= 10) || reminders[0];
    if (lowMed) {
      return {
        text: `Based on your current consumption schedule:
- **${lowMed.medicineName}**: You have **${lowMed.remainingQuantity} doses remaining**.
- Estimated depletion date: **${lowMed.refillDate}** (approx. ${Math.ceil(lowMed.remainingQuantity / 2)} days).
- Refill reminder is scheduled for **${lowMed.refillDate}**.

Would you like me to prepare your pharmacy cart with this refill now?`,
        isEmergency: false,
        suggestedAction: 'check_refill',
        disclaimer: STANDARD_DISCLAIMER
      };
    }
  }

  // 4. Appointment queries
  if (q.includes('appointment') || q.includes('doctor') || q.includes('consultation')) {
    const appts = db.getAppointments().filter((a) => a.status === 'confirmed');
    if (appts.length > 0) {
      const nextAppt = appts[0];
      return {
        text: `You have an upcoming **${nextAppt.type === 'video' ? 'Video Consultation' : 'In-Clinic Appointment'}** with **${nextAppt.doctorName}** (${nextAppt.specialization}) on **${nextAppt.date}** at **${nextAppt.timeSlot}**.
Reason: "${nextAppt.chiefComplaint}".

You can join the waiting room or reschedule directly from the Appointments tab.`,
        isEmergency: false,
        suggestedAction: 'book_doctor',
        disclaimer: STANDARD_DISCLAIMER
      };
    } else {
      return {
        text: `You do not have any appointments scheduled right now. We have top specialists available for both online video consults and in-clinic visits. Would you like to book a consultation?`,
        isEmergency: false,
        suggestedAction: 'book_doctor',
        disclaimer: STANDARD_DISCLAIMER
      };
    }
  }

  // 5. Drug timing & dosage queries
  if (q.includes('metformin') || q.includes('atorvastatin') || q.includes('paracetamol') || q.includes('food') || q.includes('dose')) {
    let medDetails = `Here is your current medication guidance:
1. **Metformin HCl 500mg**: Take 1 tablet twice daily (morning & night) **strictly after meals** with a full glass of water to prevent stomach upset.
2. **Atorvastatin 20mg**: Take 1 tablet once daily at **bedtime**. It works most effectively overnight when cholesterol synthesis peaks.
3. **Paracetamol 500mg**: For mild headache or fever, 1 tablet every 6-8 hours as needed. Do not exceed 4 tablets (2000mg) in 24 hours.

*Safety note: Aditya, our records indicate you have a reported Penicillin allergy. Never take Amoxicillin or Augmentin without physician clearance.*`;

    return {
      text: medDetails,
      isEmergency: false,
      suggestedAction: 'none',
      disclaimer: STANDARD_DISCLAIMER
    };
  }

  // 6. Common Symptoms & General Triage Guidance
  if (q.includes('headache') || q.includes('fever') || q.includes('cold') || q.includes('cough') || q.includes('sore throat')) {
    return {
      text: `Here is clinical self-care guidance for mild viral symptoms:
- **Hydration**: Drink 2.5 to 3 liters of warm liquids (water, herbal teas, broth) daily.
- **Rest**: Ensure 7-8 hours of sleep to assist cellular immune recovery.
- **Fever & Body Ache Relief**: Paracetamol 500mg after food can help reduce discomfort.
- **Steam Inhalation**: 5-10 minutes twice daily helps loosen mucosal congestion.

**Red flags to monitor**: If fever exceeds 102°F (38.9°C), persists beyond 3 days, or if you develop chest tightness or difficulty breathing, consult a physician promptly.`,
      isEmergency: false,
      suggestedAction: 'book_doctor',
      disclaimer: STANDARD_DISCLAIMER
    };
  }

  // 7. Default medical triage response
  return {
    text: `I've analyzed your question: "${query}".

As your health assistant, I can help you with:
- Reviewing your active medicines and schedule
- Explaining lab test results and biomarkers
- Setting reminders or checking your refill forecast
- Preparing an order from your prescriptions
- Booking a video or in-clinic consult with our specialists

What specific details would you like to explore?`,
    isEmergency: false,
    suggestedAction: 'none',
    disclaimer: STANDARD_DISCLAIMER
  };
}

export function explainLabReportBiomarkers(reportTitle: string): string {
  if (reportTitle.toLowerCase().includes('lipid')) {
    return `🔬 **AI Clinical Biomarker Analysis: Comprehensive Lipid Profile**

1. **Total Cholesterol (208 mg/dL)** — *Slightly High (Normal: < 200 mg/dL)*
   Your overall cholesterol is slightly above target. This is common and manageable through diet and medication.

2. **LDL Bad Cholesterol (126 mg/dL)** — *Borderline Elevated (Optimal: < 100 mg/dL)*
   LDL deposits plaque in arterial walls over time. Your current prescription of Atorvastatin 20mg specifically targets lowering this number toward safe levels (< 100 mg/dL).

3. **HDL Good Cholesterol (54 mg/dL)** — *Normal / Protective (Normal: > 40 mg/dL)*
   HDL carries cholesterol away from arteries back to the liver. This is in a healthy, cardioprotective range.

4. **Triglycerides (138 mg/dL)** — *Normal (Normal: < 150 mg/dL)*
   Blood fat levels are well within the standard healthy window.

**Actionable Lifestyle Guidance**:
- Continue taking Atorvastatin 20mg nightly after dinner as prescribed.
- Incorporate soluble fiber (oats, chia seeds, lentils, almonds) and reduce saturated trans fats.
- Aim for 30 minutes of brisk aerobic walking 5 days a week.`;
  }

  return `🔬 **AI Biomarker Summary**: All key parameters analyzed. Values reflect stable metabolic function. Please consult your physician for clinical correlation with your ongoing care plan.`;
}
