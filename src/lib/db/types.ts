export type UserRole = 'patient' | 'doctor' | 'admin' | 'partner';

export interface User {
  id: string;
  email: string;
  phone: string;
  passwordHash?: string;
  role: UserRole;
  fullName: string;
  avatar?: string;
  createdAt: string;
  status: 'active' | 'suspended' | 'pending';
}

export interface PatientProfile {
  id: string;
  userId: string;
  fullName: string;
  dob: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  bloodGroup: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  height: number; // in cm
  weight: number; // in kg
  bmi: number;
  phone: string;
  email: string;
  address: string;
  emergencyContactName: string;
  emergencyContactRelation: string;
  emergencyContactPhone: string;
  allergies: string[];
  medicalConditions: string[];
  currentMedicines: string[];
  familyHistory?: string;
  preferredLanguage: string;
  insuranceProvider?: string;
  insurancePolicyNumber?: string;
  biometricEnabled: boolean;
}

export interface FamilyMember {
  id: string;
  primaryUserId: string;
  name: string;
  relation: 'Self' | 'Spouse' | 'Child' | 'Parent' | 'Other';
  dob: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  bloodGroup: string;
  allergies: string[];
  conditions: string[];
  avatar?: string;
}

export interface DoctorProfile {
  id: string;
  userId: string;
  name: string;
  specialization: string;
  qualification: string;
  experienceYears: number;
  registrationNumber: string;
  licenseProofUrl?: string;
  verificationStatus: 'verified' | 'pending' | 'rejected';
  inPersonFee: number;
  videoFee: number;
  availableDays: string[];
  availableTimeSlots: string[];
  bio: string;
  rating: number;
  reviewCount: number;
  clinicName: string;
  clinicAddress: string;
  image: string;
  languages: string[];
}

export interface PharmacyProfile {
  id: string;
  userId: string;
  pharmacyName: string;
  licenseNumber: string;
  address: string;
  contactPhone: string;
  isVerified: boolean;
  operatingHours: string;
}

export interface LabProfile {
  id: string;
  userId: string;
  labName: string;
  accreditation: string;
  address: string;
  contactPhone: string;
  isVerified: boolean;
  homeCollectionAvailable: boolean;
}

export type RecordCategory = 
  | 'prescription'
  | 'lab_report'
  | 'blood_report'
  | 'imaging'
  | 'vaccination'
  | 'discharge_summary'
  | 'consultation_history';

export interface MedicalRecord {
  id: string;
  patientId: string;
  title: string;
  category: RecordCategory;
  fileUrl: string;
  fileSize: string;
  mimeType: string;
  doctorName?: string;
  date: string;
  tags: string[];
  aiExplanation?: string;
  sharedToken?: string;
  sharedExpiresAt?: string;
}

export interface Prescription {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  doctorRegNumber: string;
  clinicName: string;
  date: string;
  followUpDate?: string;
  notes?: string;
  digitalSignature: string;
  status: 'active' | 'completed' | 'cancelled';
  medicines: PrescriptionMedicine[];
}

export interface PrescriptionMedicine {
  id: string;
  prescriptionId?: string;
  medicineName: string;
  dosage: string; // e.g. "500mg" or "1 tablet"
  frequency: string; // e.g. "1-0-1" or "Twice daily"
  duration: string; // e.g. "5 days"
  foodInstruction: 'before_food' | 'after_food' | 'with_food' | 'anytime';
  quantityPrescribed: number;
}

export interface Medicine {
  id: string;
  name: string;
  genericName: string;
  brandName: string;
  category: string;
  form: 'tablet' | 'capsule' | 'syrup' | 'injection' | 'cream' | 'inhaler';
  strength: string;
  manufacturer: string;
  price: number;
  packSize: string;
  requiresPrescription: boolean;
  inStock: boolean;
  stockQuantity: number;
  composition: string;
  uses: string;
  sideEffects: string;
  genericAlternativeAvailable: boolean;
  genericAlternativeName?: string;
  genericAlternativePrice?: number;
  image?: string;
}

export interface MedicineReminder {
  id: string;
  patientId: string;
  medicineId?: string;
  medicineName: string;
  dosage: string;
  frequency: string;
  scheduleTimes: string[]; // e.g. ["08:00", "20:00"]
  foodInstruction: 'before_food' | 'after_food' | 'with_food' | 'anytime';
  remainingQuantity: number;
  totalQuantity: number;
  startDate: string;
  endDate: string;
  refillDate: string;
  active: boolean;
  snoozeMinutes?: number;
  lastTakenTime?: string;
}

export interface MedicineAdherenceLog {
  id: string;
  reminderId: string;
  patientId: string;
  medicineName: string;
  scheduledTime: string;
  takenAt: string;
  status: 'taken' | 'missed' | 'snoozed';
  date: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  specialization: string;
  date: string;
  timeSlot: string;
  type: 'in_clinic' | 'video';
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'rescheduled';
  fee: number;
  paymentStatus: 'paid' | 'pending' | 'refunded';
  chiefComplaint: string;
  clinicAddress?: string;
  videoSessionId?: string;
  notes?: string;
  doctorReviewId?: string;
}

export interface VideoSession {
  id: string;
  appointmentId: string;
  doctorId: string;
  doctorName: string;
  patientId: string;
  patientName: string;
  status: 'waiting' | 'in_call' | 'ended';
  recordingConsent: boolean;
  durationSeconds: number;
  networkQuality: 'excellent' | 'good' | 'fair' | 'poor';
  createdAt: string;
}

export interface LabTest {
  id: string;
  name: string;
  code: string;
  category: string;
  sampleType: string;
  fastingRequired: boolean;
  turnaroundHours: number;
  price: number;
  discountPrice?: number;
  description: string;
  parametersIncluded: string[];
}

export interface LabBooking {
  id: string;
  patientId: string;
  patientName: string;
  labTestIds: string[];
  testNames: string[];
  bookingDate: string;
  timeSlot: string;
  mode: 'home_collection' | 'lab_visit';
  address: string;
  status: 'booked' | 'sample_collected' | 'processing' | 'report_ready';
  totalAmount: number;
  paymentStatus: 'paid' | 'pending';
  reportRecordId?: string;
}

export interface OrderItem {
  id: string;
  medicineId: string;
  medicineName: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  requiresPrescription: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  patientId: string;
  customerName: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  couponCode?: string;
  total: number;
  prescriptionId?: string;
  prescriptionVerified: boolean;
  deliveryMode: 'standard' | 'express';
  address: string;
  paymentMethod: 'card' | 'upi' | 'wallet' | 'cod';
  paymentStatus: 'paid' | 'pending';
  status: 'placed' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';
  trackingStep: number; // 1 to 5
  estimatedDelivery: string;
  createdAt: string;
}

export interface Payment {
  id: string;
  referenceId: string;
  type: 'order' | 'appointment' | 'subscription' | 'lab';
  amount: number;
  currency: string;
  method: string;
  status: 'successful' | 'failed' | 'refunded';
  transactionRef: string;
  date: string;
}

export interface Subscription {
  id: string;
  userId: string;
  plan: 'free' | 'mediplus_gold';
  status: 'active' | 'cancelled';
  price: number;
  startDate: string;
  renewalDate: string;
  autoRenew: boolean;
}

export interface Address {
  id: string;
  userId: string;
  label: 'Home' | 'Work' | 'Other';
  street: string;
  city: string;
  state: string;
  postalCode: string;
  isDefault: boolean;
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'medicine_dose' | 'appointment' | 'refill' | 'video_call' | 'order' | 'lab_report' | 'system' | 'prescription';
  read: boolean;
  timestamp: string;
  actionUrl?: string;
}

export interface Hospital {
  id: string;
  name: string;
  address: string;
  phone: string;
  emergencyNumber: string;
  hasER24x7: boolean;
  distanceKm: number;
  latitude: number;
  longitude: number;
  rating: number;
  specialties: string[];
}

export interface Pharmacy {
  id: string;
  name: string;
  address: string;
  phone: string;
  is24x7: boolean;
  distanceKm: number;
  rating: number;
}

export interface Lab {
  id: string;
  name: string;
  address: string;
  phone: string;
  distanceKm: number;
  rating: number;
  homeCollection: boolean;
}

export interface Review {
  id: string;
  targetType: 'doctor' | 'medicine' | 'lab';
  targetId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Complaint {
  id: string;
  userId: string;
  userName: string;
  subject: string;
  description: string;
  category: string;
  status: 'open' | 'investigating' | 'resolved';
  resolutionNotes?: string;
  createdAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountPercent: number;
  maxDiscount: number;
  minOrder: number;
  validUntil: string;
  isActive: boolean;
}

export interface Referral {
  id: string;
  userId: string;
  referralCode: string;
  totalReferrals: number;
  walletEarned: number;
  walletBalance: number;
}

export interface AIChatMessage {
  id: string;
  patientId: string;
  sessionId: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  type?: 'text' | 'prescription_preview' | 'emergency_alert' | 'lab_explainer';
  data?: any;
}

export interface HealthReportSummary {
  id: string;
  patientId: string;
  reportDate: string;
  activeMedicinesCount: number;
  nextAppointmentDate?: string;
  lastReportDate?: string;
  nextRefillDate?: string;
  adherencePercentage: number;
  bloodPressure?: string;
  heartRate?: number;
  bmi: number;
}

export interface AuditLog {
  id: string;
  userId: string;
  userRole: string;
  action: string;
  resource: string;
  ipAddress: string;
  timestamp: string;
  details: string;
}
