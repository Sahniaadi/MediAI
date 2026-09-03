import {
  User,
  PatientProfile,
  FamilyMember,
  DoctorProfile,
  PharmacyProfile,
  LabProfile,
  Medicine,
  Prescription,
  MedicineReminder,
  MedicineAdherenceLog,
  Appointment,
  LabTest,
  LabBooking,
  Order,
  MedicalRecord,
  Hospital,
  Pharmacy,
  Lab,
  Coupon,
  Referral,
  AppNotification,
  AuditLog
} from './types';

export const initialUsers: User[] = [
  {
    id: 'user-patient-1',
    email: 'aditya@example.com',
    phone: '+1 (555) 234-5678',
    role: 'patient',
    fullName: 'Aditya Sharma',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-01-10T10:00:00Z',
    status: 'active'
  },
  {
    id: 'user-doctor-1',
    email: 'dr.sophia@mediai.org',
    phone: '+1 (555) 345-6789',
    role: 'doctor',
    fullName: 'Dr. Sophia Patel, MD, FACC',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80',
    createdAt: '2025-11-15T08:30:00Z',
    status: 'active'
  },
  {
    id: 'user-partner-1',
    email: 'carepharmacy@mediai.org',
    phone: '+1 (555) 987-6543',
    role: 'partner',
    fullName: 'CarePlus Pharmacy & Diagnostics',
    avatar: 'https://images.unsplash.com/photo-1586015555751-63c2c5890fa2?w=150&auto=format&fit=crop&q=80',
    createdAt: '2025-12-01T09:00:00Z',
    status: 'active'
  },
  {
    id: 'user-admin-1',
    email: 'admin@mediai.org',
    phone: '+1 (555) 000-1122',
    role: 'admin',
    fullName: 'Chief Medical Administrator',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    createdAt: '2025-01-01T00:00:00Z',
    status: 'active'
  }
];

export const initialPatientProfile: PatientProfile = {
  id: 'profile-patient-1',
  userId: 'user-patient-1',
  fullName: 'Aditya Sharma',
  dob: '1998-05-14',
  age: 28,
  gender: 'Male',
  bloodGroup: 'B+',
  height: 178,
  weight: 72,
  bmi: 22.7,
  phone: '+1 (555) 234-5678',
  email: 'aditya@example.com',
  address: '742 Evergreen Terrace, Suite 4B, Springfield',
  emergencyContactName: 'Rajesh Sharma',
  emergencyContactRelation: 'Father',
  emergencyContactPhone: '+1 (555) 987-1100',
  allergies: ['Penicillin', 'Dust Mites'],
  medicalConditions: ['Mild Asthma', 'Seasonal Rhinitis'],
  currentMedicines: ['Metformin 500mg', 'Atorvastatin 20mg', 'Montelukast 10mg'],
  familyHistory: 'Paternal history of Hypertension and Type 2 Diabetes',
  preferredLanguage: 'English',
  insuranceProvider: 'Blue Cross Shield Health',
  insurancePolicyNumber: 'BCS-99482710-A',
  biometricEnabled: true
};

export const initialFamilyMembers: FamilyMember[] = [
  {
    id: 'fam-1',
    primaryUserId: 'user-patient-1',
    name: 'Aditya Sharma',
    relation: 'Self',
    dob: '1998-05-14',
    age: 28,
    gender: 'Male',
    bloodGroup: 'B+',
    allergies: ['Penicillin'],
    conditions: ['Mild Asthma']
  },
  {
    id: 'fam-2',
    primaryUserId: 'user-patient-1',
    name: 'Rajesh Sharma',
    relation: 'Parent',
    dob: '1965-08-20',
    age: 61,
    gender: 'Male',
    bloodGroup: 'O+',
    allergies: ['Sulfa drugs'],
    conditions: ['Hypertension', 'Type 2 Diabetes']
  },
  {
    id: 'fam-3',
    primaryUserId: 'user-patient-1',
    name: 'Sunita Sharma',
    relation: 'Parent',
    dob: '1968-12-10',
    age: 58,
    gender: 'Female',
    bloodGroup: 'B+',
    allergies: ['None'],
    conditions: ['Osteoarthritis']
  },
  {
    id: 'fam-4',
    primaryUserId: 'user-patient-1',
    name: 'Aarav Sharma',
    relation: 'Child',
    dob: '2021-04-02',
    age: 5,
    gender: 'Male',
    bloodGroup: 'B+',
    allergies: ['Peanuts'],
    conditions: ['None']
  }
];

export const initialDoctors: DoctorProfile[] = [
  {
    id: 'doc-1',
    userId: 'user-doctor-1',
    name: 'Dr. Sophia Patel',
    specialization: 'Cardiologist',
    qualification: 'MD (Cardiology), FACC, Harvard Med',
    experienceYears: 14,
    registrationNumber: 'MED-NY-84920',
    licenseProofUrl: '/licenses/doc-sophia-license.pdf',
    verificationStatus: 'verified',
    inPersonFee: 90,
    videoFee: 65,
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    availableTimeSlots: ['09:00 AM', '10:30 AM', '02:00 PM', '03:30 PM', '05:00 PM'],
    bio: 'Renowned clinical cardiologist specializing in preventive cardiology, lipid management, and non-invasive cardiovascular evaluations with over 14 years of practice.',
    rating: 4.9,
    reviewCount: 142,
    clinicName: 'Metropolitan Heart & Vascular Institute',
    clinicAddress: '450 Lexington Ave, Suite 800, New York, NY',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80',
    languages: ['English', 'Spanish', 'Hindi']
  },
  {
    id: 'doc-2',
    userId: 'user-doc-2',
    name: 'Dr. Marcus Vance',
    specialization: 'General Physician',
    qualification: 'MBBS, MD (Internal Medicine)',
    experienceYears: 12,
    registrationNumber: 'MED-IL-33821',
    licenseProofUrl: '/licenses/doc-marcus-license.pdf',
    verificationStatus: 'verified',
    inPersonFee: 60,
    videoFee: 40,
    availableDays: ['Monday', 'Wednesday', 'Friday', 'Saturday'],
    availableTimeSlots: ['08:30 AM', '11:00 AM', '01:30 PM', '04:00 PM'],
    bio: 'Compassionate primary care specialist focused on chronic disease prevention, metabolic health, and whole-patient wellness.',
    rating: 4.8,
    reviewCount: 98,
    clinicName: 'Springfield Family Wellness Clinic',
    clinicAddress: '120 Elm Street, Springfield, IL',
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop&q=80',
    languages: ['English']
  },
  {
    id: 'doc-3',
    userId: 'user-doc-3',
    name: 'Dr. Elena Rostova',
    specialization: 'Dermatologist',
    qualification: 'MD, FAAD, Board Certified Dermatologist',
    experienceYears: 10,
    registrationNumber: 'MED-CA-91823',
    licenseProofUrl: '/licenses/doc-elena-license.pdf',
    verificationStatus: 'verified',
    inPersonFee: 85,
    videoFee: 55,
    availableDays: ['Tuesday', 'Thursday', 'Saturday'],
    availableTimeSlots: ['10:00 AM', '11:30 AM', '02:30 PM', '04:30 PM'],
    bio: 'Expert in clinical dermatology, pediatric skin conditions, acne management, and dermoscopic mole screenings.',
    rating: 4.9,
    reviewCount: 176,
    clinicName: 'ClearSkin Advanced Dermatology',
    clinicAddress: '8800 Wilshire Blvd, Beverly Hills, CA',
    image: 'https://images.unsplash.com/photo-1594824813576-ff602b415a77?w=400&auto=format&fit=crop&q=80',
    languages: ['English', 'French', 'Russian']
  },
  {
    id: 'doc-4',
    userId: 'user-doc-4',
    name: 'Dr. David Kim',
    specialization: 'Neurologist',
    qualification: 'MD, PhD (Neuroscience), Johns Hopkins',
    experienceYears: 16,
    registrationNumber: 'MED-MD-11928',
    licenseProofUrl: '/licenses/doc-david-license.pdf',
    verificationStatus: 'verified',
    inPersonFee: 120,
    videoFee: 85,
    availableDays: ['Monday', 'Tuesday', 'Thursday'],
    availableTimeSlots: ['09:30 AM', '11:00 AM', '03:00 PM'],
    bio: 'Specialist in migraine headache management, neuropathies, sleep neurology, and cognitive disorders.',
    rating: 4.9,
    reviewCount: 84,
    clinicName: 'Kim Neurosciences & Headache Center',
    clinicAddress: '600 N Wolfe St, Baltimore, MD',
    image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&auto=format&fit=crop&q=80',
    languages: ['English', 'Korean']
  },
  {
    id: 'doc-5',
    userId: 'user-doc-5',
    name: 'Dr. Anita Roy',
    specialization: 'Pediatrician',
    qualification: 'MD (Pediatrics), FAAP',
    experienceYears: 11,
    registrationNumber: 'MED-TX-77123',
    licenseProofUrl: '/licenses/doc-anita-license.pdf',
    verificationStatus: 'verified',
    inPersonFee: 70,
    videoFee: 50,
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Friday', 'Saturday'],
    availableTimeSlots: ['08:00 AM', '10:00 AM', '01:00 PM', '03:30 PM'],
    bio: 'Dedicated pediatrician providing gentle newborn examinations, developmental milestone tracking, and childhood vaccination programs.',
    rating: 5.0,
    reviewCount: 215,
    clinicName: 'Little Smiles Pediatric Clinic',
    clinicAddress: '3100 Medical Center Dr, Houston, TX',
    image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&auto=format&fit=crop&q=80',
    languages: ['English', 'Hindi', 'Bengali']
  },
  {
    id: 'doc-6',
    userId: 'user-doc-6',
    name: 'Dr. James Anderson',
    specialization: 'Orthopedic',
    qualification: 'MS (Ortho), Fellowship in Sports Medicine',
    experienceYears: 15,
    registrationNumber: 'MED-FL-44910',
    licenseProofUrl: '/licenses/doc-james-license.pdf',
    verificationStatus: 'verified',
    inPersonFee: 95,
    videoFee: 70,
    availableDays: ['Tuesday', 'Wednesday', 'Friday'],
    availableTimeSlots: ['09:00 AM', '11:00 AM', '02:00 PM', '04:00 PM'],
    bio: 'Orthopedic surgeon and sports medicine specialist treating joint pain, ligament reconstruction, and fracture rehabilitation.',
    rating: 4.8,
    reviewCount: 112,
    clinicName: 'Apex Orthopedic & Sports Clinic',
    clinicAddress: '1500 Biscayne Blvd, Miami, FL',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&auto=format&fit=crop&q=80',
    languages: ['English', 'Spanish']
  },
  {
    id: 'doc-7',
    userId: 'user-doc-7',
    name: 'Dr. Sarah Jenkins',
    specialization: 'Gynecologist',
    qualification: 'MD, FACOG, Obstetrician & Gynecologist',
    experienceYears: 13,
    registrationNumber: 'MED-WA-60291',
    licenseProofUrl: '/licenses/doc-sarah-license.pdf',
    verificationStatus: 'verified',
    inPersonFee: 95,
    videoFee: 65,
    availableDays: ['Monday', 'Thursday', 'Friday'],
    availableTimeSlots: ['09:30 AM', '11:30 AM', '02:30 PM'],
    bio: 'Holistic women’s reproductive health expert, prenatal guidance, PCOS management, and hormonal wellness.',
    rating: 4.9,
    reviewCount: 189,
    clinicName: 'Evergreen Women’s Health Center',
    clinicAddress: '1201 3rd Ave, Seattle, WA',
    image: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=400&auto=format&fit=crop&q=80',
    languages: ['English']
  },
  {
    id: 'doc-8',
    userId: 'user-doc-8',
    name: 'Dr. Rajiv Menon',
    specialization: 'Psychiatrist',
    qualification: 'MD (Psychiatry), ABPN Board Certified',
    experienceYears: 17,
    registrationNumber: 'MED-MA-55190',
    licenseProofUrl: '/licenses/doc-rajiv-license.pdf',
    verificationStatus: 'verified',
    inPersonFee: 110,
    videoFee: 80,
    availableDays: ['Tuesday', 'Wednesday', 'Thursday', 'Saturday'],
    availableTimeSlots: ['10:00 AM', '01:00 PM', '03:00 PM', '05:00 PM'],
    bio: 'Dedicated mental health physician offering evidence-based psychiatric evaluations, anxiety & mood disorder therapies, and stress management.',
    rating: 4.9,
    reviewCount: 140,
    clinicName: 'MindWell Behavioral Health Clinic',
    clinicAddress: '75 Cambridge Pkwy, Boston, MA',
    image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&auto=format&fit=crop&q=80',
    languages: ['English', 'Malayalam', 'Hindi']
  },
  {
    id: 'doc-9',
    userId: 'user-doc-9',
    name: 'Dr. Rachel Gomez',
    specialization: 'Nutritionist',
    qualification: 'RD, MS (Clinical Nutrition), CNSC',
    experienceYears: 9,
    registrationNumber: 'NUT-IL-88210',
    licenseProofUrl: '/licenses/doc-rachel-license.pdf',
    verificationStatus: 'verified',
    inPersonFee: 55,
    videoFee: 35,
    availableDays: ['Monday', 'Wednesday', 'Friday'],
    availableTimeSlots: ['09:00 AM', '11:00 AM', '01:00 PM', '04:00 PM'],
    bio: 'Clinical nutritionist specializing in therapeutic diabetic diets, cardiac meal plans, gut health, and weight management.',
    rating: 4.8,
    reviewCount: 92,
    clinicName: 'Vitality Clinical Nutrition Studio',
    clinicAddress: '200 E Randolph St, Chicago, IL',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    languages: ['English', 'Spanish']
  },
  {
    id: 'doc-10',
    userId: 'user-doc-10',
    name: 'Dr. Tariq Al-Mansoor',
    specialization: 'ENT',
    qualification: 'MS (Otolaryngology), FRCS',
    experienceYears: 14,
    registrationNumber: 'MED-NY-77291',
    licenseProofUrl: '/licenses/doc-tariq-license.pdf',
    verificationStatus: 'pending',
    inPersonFee: 80,
    videoFee: 55,
    availableDays: ['Monday', 'Thursday', 'Saturday'],
    availableTimeSlots: ['10:00 AM', '12:00 PM', '03:00 PM'],
    bio: 'ENT surgeon with special focus on chronic sinusitis, allergic rhinitis, tonsil disorders, and balance/hearing evaluations.',
    rating: 4.7,
    reviewCount: 65,
    clinicName: 'Metro Ear Nose Throat Specialists',
    clinicAddress: '550 5th Ave, New York, NY',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    languages: ['English', 'Arabic']
  }
];

export const initialMedicines: Medicine[] = [
  {
    id: 'med-1',
    name: 'Paracetamol 500mg',
    genericName: 'Acetaminophen 500mg',
    brandName: 'Crocin / Tylenol Extra',
    category: 'Pain Relief & Fever',
    form: 'tablet',
    strength: '500mg',
    manufacturer: 'GSK Healthcare Ltd',
    price: 3.50,
    packSize: '15 tablets strip',
    requiresPrescription: false,
    inStock: true,
    stockQuantity: 140,
    composition: 'Paracetamol IP 500mg',
    uses: 'Relief of mild to moderate pain, headache, toothache, and fever reduction',
    sideEffects: 'Generally safe at recommended doses; avoid excess alcohol intake',
    genericAlternativeAvailable: true,
    genericAlternativeName: 'Generic Acetaminophen 500mg',
    genericAlternativePrice: 1.80,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'med-2',
    name: 'Metformin HCl 500mg',
    genericName: 'Metformin Hydrochloride 500mg',
    brandName: 'Glucophage / Glycomet',
    category: 'Diabetes Care',
    form: 'tablet',
    strength: '500mg',
    manufacturer: 'Merck Healthcare',
    price: 5.20,
    packSize: '30 tablets bottle',
    requiresPrescription: true,
    inStock: true,
    stockQuantity: 95,
    composition: 'Metformin Hydrochloride 500mg sustained release',
    uses: 'Blood glucose management in Type 2 Diabetes Mellitus',
    sideEffects: 'Mild stomach upset initially; take with or after meals',
    genericAlternativeAvailable: true,
    genericAlternativeName: 'Generic Metformin 500mg SR',
    genericAlternativePrice: 2.90,
    image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'med-3',
    name: 'Atorvastatin 20mg',
    genericName: 'Atorvastatin Calcium 20mg',
    brandName: 'Lipitor / Atorva',
    category: 'Cardiac & Cholesterol',
    form: 'tablet',
    strength: '20mg',
    manufacturer: 'Pfizer Labs',
    price: 8.40,
    packSize: '15 tablets strip',
    requiresPrescription: true,
    inStock: true,
    stockQuantity: 60,
    composition: 'Atorvastatin Calcium equivalent to Atorvastatin 20mg',
    uses: 'Lowers LDL bad cholesterol and triglycerides, reduces cardiovascular risk',
    sideEffects: 'Rare muscle ache; take at bedtime regularly',
    genericAlternativeAvailable: true,
    genericAlternativeName: 'Generic Atorvastatin 20mg',
    genericAlternativePrice: 4.10,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'med-4',
    name: 'Amoxicillin 500mg',
    genericName: 'Amoxicillin Trihydrate 500mg',
    brandName: 'Mox 500 / Amoxil',
    category: 'Antibiotics',
    form: 'capsule',
    strength: '500mg',
    manufacturer: 'Sun Pharmaceuticals',
    price: 6.90,
    packSize: '10 capsules strip',
    requiresPrescription: true,
    inStock: true,
    stockQuantity: 80,
    composition: 'Amoxicillin Trihydrate equivalent to Amoxicillin 500mg',
    uses: 'Bacterial infections of the respiratory tract, ear, nose, throat, and skin',
    sideEffects: 'Do not use if penicillin allergic. Complete the prescribed course.',
    genericAlternativeAvailable: true,
    genericAlternativeName: 'Generic Amoxicillin 500mg',
    genericAlternativePrice: 3.50,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'med-5',
    name: 'Montelukast 10mg',
    genericName: 'Montelukast Sodium 10mg',
    brandName: 'Singulair / Montair',
    category: 'Respiratory & Allergy',
    form: 'tablet',
    strength: '10mg',
    manufacturer: 'Cipla Therapeutics',
    price: 7.10,
    packSize: '15 tablets strip',
    requiresPrescription: true,
    inStock: true,
    stockQuantity: 50,
    composition: 'Montelukast Sodium 10mg',
    uses: 'Asthma maintenance therapy and relief of seasonal allergic rhinitis symptoms',
    sideEffects: 'Take once daily at evening or night; mild headache occasionally',
    genericAlternativeAvailable: true,
    genericAlternativeName: 'Generic Montelukast 10mg',
    genericAlternativePrice: 3.80,
    image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'med-6',
    name: 'Pantoprazole 40mg',
    genericName: 'Pantoprazole Sodium 40mg',
    brandName: 'Pantocid / Protonix',
    category: 'Gastrointestinal & Antacid',
    form: 'tablet',
    strength: '40mg',
    manufacturer: 'Alkem Laboratories',
    price: 4.80,
    packSize: '15 gastro-resistant tablets',
    requiresPrescription: false,
    inStock: true,
    stockQuantity: 120,
    composition: 'Pantoprazole Sodium Sesquihydrate 40mg',
    uses: 'Gastroesophageal reflux disease (GERD), heartburn, and stomach acid reduction',
    sideEffects: 'Take 30 minutes before breakfast on an empty stomach',
    genericAlternativeAvailable: true,
    genericAlternativeName: 'Generic Pantoprazole 40mg',
    genericAlternativePrice: 2.20,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'med-7',
    name: 'Cetirizine 10mg',
    genericName: 'Cetirizine Hydrochloride 10mg',
    brandName: 'Zyrtec / Cetzine',
    category: 'Respiratory & Allergy',
    form: 'tablet',
    strength: '10mg',
    manufacturer: 'Dr. Reddy’s Laboratories',
    price: 3.20,
    packSize: '10 tablets strip',
    requiresPrescription: false,
    inStock: true,
    stockQuantity: 130,
    composition: 'Cetirizine Hydrochloride 10mg',
    uses: 'Relief of sneezing, runny nose, allergic skin rashes, and watery eyes',
    sideEffects: 'May cause mild drowsiness; best taken at bedtime',
    genericAlternativeAvailable: true,
    genericAlternativeName: 'Generic Cetirizine 10mg',
    genericAlternativePrice: 1.50,
    image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'med-8',
    name: 'Salbutamol Inhaler 100mcg',
    genericName: 'Albuterol / Salbutamol 100mcg',
    brandName: 'Ventolin / Asthalin',
    category: 'Respiratory & Allergy',
    form: 'inhaler',
    strength: '100mcg/puff',
    manufacturer: 'GSK Resp Care',
    price: 9.50,
    packSize: '200 metered actuations',
    requiresPrescription: true,
    inStock: true,
    stockQuantity: 40,
    composition: 'Salbutamol Sulphate 100 mcg per actuation',
    uses: 'Quick relief of bronchospasm in acute asthma exacerbations',
    sideEffects: 'Mild tremor or increased heart rate for a few minutes after inhalation',
    genericAlternativeAvailable: false,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'med-9',
    name: 'Vitamin D3 60,000 IU',
    genericName: 'Cholecalciferol 60000 IU',
    brandName: 'Calcirol / D-Rise',
    category: 'Vitamins & Supplements',
    form: 'capsule',
    strength: '60000 IU',
    manufacturer: 'Cadila Healthcare',
    price: 6.00,
    packSize: '4 softgel capsules',
    requiresPrescription: false,
    inStock: true,
    stockQuantity: 90,
    composition: 'Cholecalciferol 60,000 International Units',
    uses: 'Correction of Vitamin D deficiency, bone health, and immune support',
    sideEffects: 'Take once weekly after a fatty meal as advised by physician',
    genericAlternativeAvailable: true,
    genericAlternativeName: 'Generic Cholecalciferol 60k',
    genericAlternativePrice: 3.20,
    image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'med-10',
    name: 'Losartan Potassium 50mg',
    genericName: 'Losartan Potassium 50mg',
    brandName: 'Cozaar / Repace',
    category: 'Cardiac & Cholesterol',
    form: 'tablet',
    strength: '50mg',
    manufacturer: 'Sun Pharmaceuticals',
    price: 5.80,
    packSize: '15 tablets strip',
    requiresPrescription: true,
    inStock: true,
    stockQuantity: 75,
    composition: 'Losartan Potassium 50mg',
    uses: 'Blood pressure regulation and kidney protection in hypertensive patients',
    sideEffects: 'Occasional dizziness upon standing quickly; stay well hydrated',
    genericAlternativeAvailable: true,
    genericAlternativeName: 'Generic Losartan 50mg',
    genericAlternativePrice: 2.80,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=80'
  }
];

export const initialPrescriptions: Prescription[] = [
  {
    id: 'rx-2026-001',
    patientId: 'user-patient-1',
    patientName: 'Aditya Sharma',
    doctorId: 'doc-1',
    doctorName: 'Dr. Sophia Patel',
    doctorRegNumber: 'MED-NY-84920',
    clinicName: 'Metropolitan Heart & Vascular Institute',
    date: '2026-08-25',
    followUpDate: '2026-09-25',
    notes: 'Maintain low-sodium dietary habits, 30 mins aerobic walking daily, and monitor lipid panel.',
    digitalSignature: 'Dr. Sophia Patel, MD [VERIFIED CRYPTOGRAPHIC SIGNATURE #84920]',
    status: 'active',
    medicines: [
      {
        id: 'rx-med-1',
        medicineName: 'Atorvastatin 20mg',
        dosage: '1 tablet',
        frequency: '0-0-1',
        duration: '30 days',
        foodInstruction: 'after_food',
        quantityPrescribed: 30
      },
      {
        id: 'rx-med-2',
        medicineName: 'Metformin HCl 500mg',
        dosage: '1 tablet',
        frequency: '1-0-1',
        duration: '30 days',
        foodInstruction: 'after_food',
        quantityPrescribed: 60
      }
    ]
  },
  {
    id: 'rx-2026-002',
    patientId: 'user-patient-1',
    patientName: 'Aditya Sharma',
    doctorId: 'doc-2',
    doctorName: 'Dr. Marcus Vance',
    doctorRegNumber: 'MED-IL-33821',
    clinicName: 'Springfield Family Wellness Clinic',
    date: '2026-08-10',
    followUpDate: '2026-09-10',
    notes: 'Seasonal allergy flare up; avoid pollen exposure in early mornings.',
    digitalSignature: 'Dr. Marcus Vance, MD [VERIFIED SIGNATURE #33821]',
    status: 'active',
    medicines: [
      {
        id: 'rx-med-3',
        medicineName: 'Montelukast 10mg',
        dosage: '1 tablet',
        frequency: '0-0-1',
        duration: '15 days',
        foodInstruction: 'after_food',
        quantityPrescribed: 15
      },
      {
        id: 'rx-med-4',
        medicineName: 'Cetirizine 10mg',
        dosage: '1 tablet',
        frequency: '0-0-1',
        duration: '10 days',
        foodInstruction: 'after_food',
        quantityPrescribed: 10
      }
    ]
  }
];

export const initialMedicineReminders: MedicineReminder[] = [
  {
    id: 'rem-1',
    patientId: 'user-patient-1',
    medicineId: 'med-2',
    medicineName: 'Metformin HCl 500mg',
    dosage: '1 tablet (500mg)',
    frequency: 'Twice daily (Morning & Night)',
    scheduleTimes: ['08:30 AM', '08:30 PM'],
    foodInstruction: 'after_food',
    remainingQuantity: 14,
    totalQuantity: 60,
    startDate: '2026-08-25',
    endDate: '2026-09-24',
    refillDate: '2026-09-08',
    active: true,
    lastTakenTime: '2026-09-02T08:35:00Z'
  },
  {
    id: 'rem-2',
    patientId: 'user-patient-1',
    medicineId: 'med-3',
    medicineName: 'Atorvastatin 20mg',
    dosage: '1 tablet (20mg)',
    frequency: 'Once daily (Bedtime)',
    scheduleTimes: ['10:00 PM'],
    foodInstruction: 'after_food',
    remainingQuantity: 6,
    totalQuantity: 30,
    startDate: '2026-08-25',
    endDate: '2026-09-24',
    refillDate: '2026-09-08',
    active: true,
    lastTakenTime: '2026-09-01T22:15:00Z'
  },
  {
    id: 'rem-3',
    patientId: 'user-patient-1',
    medicineId: 'med-5',
    medicineName: 'Montelukast 10mg',
    dosage: '1 tablet (10mg)',
    frequency: 'Once daily (Night)',
    scheduleTimes: ['09:00 PM'],
    foodInstruction: 'after_food',
    remainingQuantity: 8,
    totalQuantity: 15,
    startDate: '2026-08-28',
    endDate: '2026-09-12',
    refillDate: '2026-09-09',
    active: true,
    lastTakenTime: '2026-09-01T21:05:00Z'
  }
];

export const initialAdherenceLogs: MedicineAdherenceLog[] = [
  {
    id: 'adh-1',
    reminderId: 'rem-1',
    patientId: 'user-patient-1',
    medicineName: 'Metformin HCl 500mg',
    scheduledTime: '08:30 AM',
    takenAt: '2026-09-02T08:35:00Z',
    status: 'taken',
    date: '2026-09-02'
  },
  {
    id: 'adh-2',
    reminderId: 'rem-2',
    patientId: 'user-patient-1',
    medicineName: 'Atorvastatin 20mg',
    scheduledTime: '10:00 PM',
    takenAt: '2026-09-01T22:15:00Z',
    status: 'taken',
    date: '2026-09-01'
  },
  {
    id: 'adh-3',
    reminderId: 'rem-1',
    patientId: 'user-patient-1',
    medicineName: 'Metformin HCl 500mg',
    scheduledTime: '08:30 PM',
    takenAt: '2026-09-01T20:45:00Z',
    status: 'taken',
    date: '2026-09-01'
  },
  {
    id: 'adh-4',
    reminderId: 'rem-1',
    patientId: 'user-patient-1',
    medicineName: 'Metformin HCl 500mg',
    scheduledTime: '08:30 AM',
    takenAt: '2026-09-01T08:32:00Z',
    status: 'taken',
    date: '2026-09-01'
  },
  {
    id: 'adh-5',
    reminderId: 'rem-2',
    patientId: 'user-patient-1',
    medicineName: 'Atorvastatin 20mg',
    scheduledTime: '10:00 PM',
    takenAt: '2026-08-31T22:05:00Z',
    status: 'taken',
    date: '2026-08-31'
  }
];

export const initialAppointments: Appointment[] = [
  {
    id: 'appt-101',
    patientId: 'user-patient-1',
    patientName: 'Aditya Sharma',
    doctorId: 'doc-1',
    doctorName: 'Dr. Sophia Patel',
    specialization: 'Cardiologist',
    date: '2026-09-05',
    timeSlot: '02:00 PM',
    type: 'video',
    status: 'confirmed',
    fee: 65,
    paymentStatus: 'paid',
    chiefComplaint: 'Monthly follow-up on lipid profile and Atorvastatin tolerance',
    videoSessionId: 'room-sophia-aditya-101'
  },
  {
    id: 'appt-102',
    patientId: 'user-patient-1',
    patientName: 'Aditya Sharma',
    doctorId: 'doc-2',
    doctorName: 'Dr. Marcus Vance',
    specialization: 'General Physician',
    date: '2026-09-12',
    timeSlot: '11:00 AM',
    type: 'in_clinic',
    status: 'confirmed',
    fee: 60,
    paymentStatus: 'paid',
    chiefComplaint: 'Routine annual general physical examination and blood pressure review',
    clinicAddress: '120 Elm Street, Springfield, IL'
  }
];

export const initialLabTests: LabTest[] = [
  {
    id: 'lab-t-1',
    name: 'Comprehensive Lipid Profile',
    code: 'LP-100',
    category: 'Heart & Cholesterol',
    sampleType: 'Blood (Serum)',
    fastingRequired: true,
    turnaroundHours: 12,
    price: 35.00,
    discountPrice: 28.00,
    description: 'Measures Total Cholesterol, HDL, LDL, VLDL, and Triglycerides to evaluate cardiovascular risk.',
    parametersIncluded: ['Total Cholesterol', 'HDL Good Cholesterol', 'LDL Bad Cholesterol', 'VLDL', 'Triglycerides', 'TC/HDL Ratio']
  },
  {
    id: 'lab-t-2',
    name: 'Complete Blood Count (CBC) with ESR',
    code: 'CBC-200',
    category: 'Routine Screening',
    sampleType: 'Blood (EDTA Whole Blood)',
    fastingRequired: false,
    turnaroundHours: 6,
    price: 25.00,
    discountPrice: 19.00,
    description: 'Comprehensive screening for anemia, systemic infections, platelets, and general hematological health.',
    parametersIncluded: ['Hemoglobin', 'RBC Count', 'WBC Count', 'Platelet Count', 'Hematocrit', 'ESR (1st Hour)']
  },
  {
    id: 'lab-t-3',
    name: 'HbA1c (Glycated Hemoglobin)',
    code: 'HBA-300',
    category: 'Diabetes Care',
    sampleType: 'Blood (Whole Blood)',
    fastingRequired: false,
    turnaroundHours: 8,
    price: 30.00,
    discountPrice: 24.00,
    description: 'Assesses average blood sugar levels over the past 3 months to monitor diabetic glycemic control.',
    parametersIncluded: ['HbA1c %', 'Estimated Average Glucose (eAG)']
  },
  {
    id: 'lab-t-4',
    name: 'Thyroid Profile Total (T3, T4, TSH)',
    code: 'THY-400',
    category: 'Endocrine & Thyroid',
    sampleType: 'Blood (Serum)',
    fastingRequired: true,
    turnaroundHours: 12,
    price: 40.00,
    discountPrice: 32.00,
    description: 'Evaluates thyroid gland activity, metabolism, and screening for hypothyroidism or hyperthyroidism.',
    parametersIncluded: ['Total Triiodothyronine (T3)', 'Total Thyroxine (T4)', 'Thyroid Stimulating Hormone (TSH)']
  },
  {
    id: 'lab-t-5',
    name: 'Executive Full Body Health Package',
    code: 'FBP-900',
    category: 'Preventive Wellness',
    sampleType: 'Blood & Urine',
    fastingRequired: true,
    turnaroundHours: 24,
    price: 110.00,
    discountPrice: 79.00,
    description: 'Master health checkup covering 64 vital biomarkers including Liver, Kidney, Lipid, Thyroid, and Vitamin D.',
    parametersIncluded: ['Lipid Profile', 'Liver Function Test', 'Kidney Function Test', 'CBC', 'HbA1c', 'Vitamin D3 & B12', 'Urine Routine']
  }
];

export const initialLabBookings: LabBooking[] = [
  {
    id: 'lb-901',
    patientId: 'user-patient-1',
    patientName: 'Aditya Sharma',
    labTestIds: ['lab-t-1'],
    testNames: ['Comprehensive Lipid Profile'],
    bookingDate: '2026-08-28',
    timeSlot: '07:30 AM',
    mode: 'home_collection',
    address: '742 Evergreen Terrace, Suite 4B, Springfield',
    status: 'report_ready',
    totalAmount: 28.00,
    paymentStatus: 'paid',
    reportRecordId: 'rec-lab-001'
  }
];

export const initialOrders: Order[] = [
  {
    id: 'ord-8812',
    orderNumber: 'MED-ORD-2026-8812',
    patientId: 'user-patient-1',
    customerName: 'Aditya Sharma',
    items: [
      {
        id: 'ord-item-1',
        medicineId: 'med-2',
        medicineName: 'Metformin HCl 500mg (30 tabs)',
        quantity: 2,
        unitPrice: 5.20,
        totalAmount: 10.40,
        requiresPrescription: true
      },
      {
        id: 'ord-item-2',
        medicineId: 'med-3',
        medicineName: 'Atorvastatin 20mg (15 tabs)',
        quantity: 2,
        unitPrice: 8.40,
        totalAmount: 16.80,
        requiresPrescription: true
      },
      {
        id: 'ord-item-3',
        medicineId: 'med-1',
        medicineName: 'Paracetamol 500mg (15 tabs)',
        quantity: 1,
        unitPrice: 3.50,
        totalAmount: 3.50,
        requiresPrescription: false
      }
    ],
    subtotal: 30.70,
    deliveryFee: 0,
    discount: 6.14,
    couponCode: 'HEALTH20',
    total: 24.56,
    prescriptionId: 'rx-2026-001',
    prescriptionVerified: true,
    deliveryMode: 'express',
    address: '742 Evergreen Terrace, Suite 4B, Springfield',
    paymentMethod: 'card',
    paymentStatus: 'paid',
    status: 'out_for_delivery',
    trackingStep: 4,
    estimatedDelivery: 'Today by 04:30 PM',
    createdAt: '2026-09-02T10:15:00Z'
  }
];

export const initialMedicalRecords: MedicalRecord[] = [
  {
    id: 'rec-lab-001',
    patientId: 'user-patient-1',
    title: 'Comprehensive Lipid Panel Report',
    category: 'lab_report',
    fileUrl: '/reports/lipid-panel-aug2026.pdf',
    fileSize: '1.2 MB',
    mimeType: 'application/pdf',
    doctorName: 'Dr. Sophia Patel (Referred)',
    date: '2026-08-28',
    tags: ['Lipid', 'Cholesterol', 'Fasting', 'Cardiology'],
    aiExplanation: 'Your Total Cholesterol is 208 mg/dL (slightly elevated, ideal < 200). LDL bad cholesterol is 126 mg/dL (borderline high). Triglycerides are optimal at 138 mg/dL. Dr. Sophia has prescribed Atorvastatin 20mg to help bring LDL below 100 mg/dL.'
  },
  {
    id: 'rec-rx-001',
    patientId: 'user-patient-1',
    title: 'Cardiology Prescription - Dr. Sophia Patel',
    category: 'prescription',
    fileUrl: '/prescriptions/rx-dr-patel-aug2026.png',
    fileSize: '840 KB',
    mimeType: 'image/png',
    doctorName: 'Dr. Sophia Patel',
    date: '2026-08-25',
    tags: ['Rx', 'Cardiology', 'Atorvastatin', 'Metformin'],
    aiExplanation: 'Digital e-prescription containing Atorvastatin 20mg (1 tab bedtime) and Metformin HCl 500mg (1 tab twice daily after meals). Follow-up scheduled for 25 Sept.'
  },
  {
    id: 'rec-xray-001',
    patientId: 'user-patient-1',
    title: 'Chest X-Ray PA View (Routine Asthma Check)',
    category: 'imaging',
    fileUrl: '/imaging/chest-xray-june2026.jpg',
    fileSize: '2.8 MB',
    mimeType: 'image/jpeg',
    doctorName: 'Springfield Diagnostic Imaging',
    date: '2026-06-15',
    tags: ['X-Ray', 'Lungs', 'Asthma', 'Clear'],
    aiExplanation: 'Bilateral lung fields clear. No consolidation, effusion, or active focal lesions detected. Normal cardiothoracic ratio.'
  }
];

export const initialHospitals: Hospital[] = [
  {
    id: 'hosp-1',
    name: 'Springfield Memorial University Hospital',
    address: '100 Medical Center Parkway, Springfield',
    phone: '+1 (555) 911-2000',
    emergencyNumber: '911',
    hasER24x7: true,
    distanceKm: 1.8,
    latitude: 39.7817,
    longitude: -89.6501,
    rating: 4.8,
    specialties: ['Level 1 Trauma ER', 'Cardiology', 'Neurology', 'Pediatrics']
  },
  {
    id: 'hosp-2',
    name: 'St. Jude Heart & Emergency Institute',
    address: '425 North Grand Ave, Springfield',
    phone: '+1 (555) 789-3300',
    emergencyNumber: '+1 (555) 789-9999',
    hasER24x7: true,
    distanceKm: 3.4,
    latitude: 39.7990,
    longitude: -89.6430,
    rating: 4.9,
    specialties: ['Cardiac Emergency', 'Catheterization Lab', 'ICU']
  },
  {
    id: 'hosp-3',
    name: 'Lincoln General Community Hospital',
    address: '800 South 6th Street, Springfield',
    phone: '+1 (555) 544-6000',
    emergencyNumber: '+1 (555) 544-9111',
    hasER24x7: true,
    distanceKm: 4.2,
    latitude: 39.7710,
    longitude: -89.6480,
    rating: 4.6,
    specialties: ['24/7 Urgent Care', 'Orthopedic Surgery', 'Burn Unit']
  }
];

export const initialPharmacies: Pharmacy[] = [
  {
    id: 'pharm-1',
    name: 'CarePlus 24/7 Pharmacy & Delivery',
    address: '220 South Grand Ave, Springfield',
    phone: '+1 (555) 987-6543',
    is24x7: true,
    distanceKm: 0.9,
    rating: 4.9
  },
  {
    id: 'pharm-2',
    name: 'Walgreens Health & Wellness',
    address: '500 South 6th St, Springfield',
    phone: '+1 (555) 523-1100',
    is24x7: true,
    distanceKm: 1.5,
    rating: 4.7
  }
];

export const initialLabs: Lab[] = [
  {
    id: 'lab-inst-1',
    name: 'Quest Diagnostics Regional Clinical Lab',
    address: '320 East Adams St, Springfield',
    phone: '+1 (555) 432-8000',
    distanceKm: 1.2,
    rating: 4.8,
    homeCollection: true
  },
  {
    id: 'lab-inst-2',
    name: 'LabCorp Medical Center Lab',
    address: '701 North 1st St, Springfield',
    phone: '+1 (555) 544-7100',
    distanceKm: 2.1,
    rating: 4.7,
    homeCollection: true
  }
];

export const initialCoupons: Coupon[] = [
  {
    id: 'coup-1',
    code: 'HEALTH20',
    discountPercent: 20,
    maxDiscount: 15,
    minOrder: 20,
    validUntil: '2026-12-31',
    isActive: true
  },
  {
    id: 'coup-2',
    code: 'MEDIFIRST',
    discountPercent: 25,
    maxDiscount: 20,
    minOrder: 25,
    validUntil: '2026-12-31',
    isActive: true
  },
  {
    id: 'coup-3',
    code: 'CARE10',
    discountPercent: 10,
    maxDiscount: 10,
    minOrder: 15,
    validUntil: '2026-12-31',
    isActive: true
  }
];

export const initialReferrals: Referral = {
  id: 'ref-1',
  userId: 'user-patient-1',
  referralCode: 'CARE-ADITYA-2026',
  totalReferrals: 3,
  walletEarned: 30.00,
  walletBalance: 45.00
};

export const initialNotifications: AppNotification[] = [
  {
    id: 'notif-1',
    userId: 'user-patient-1',
    title: 'Medicine Dose Reminder: Metformin HCl 500mg',
    message: 'Time for your morning dose of Metformin (1 tablet after breakfast).',
    type: 'medicine_dose',
    read: false,
    timestamp: '2026-09-02T08:30:00Z',
    actionUrl: '/medicines'
  },
  {
    id: 'notif-2',
    userId: 'user-patient-1',
    title: 'Upcoming Video Consultation',
    message: 'Dr. Sophia Patel, Cardiologist is scheduled for Sept 5 at 02:00 PM.',
    type: 'appointment',
    read: false,
    timestamp: '2026-09-01T14:00:00Z',
    actionUrl: '/appointments'
  },
  {
    id: 'notif-3',
    userId: 'user-patient-1',
    title: 'Medicine Refill Forecast: Atorvastatin 20mg',
    message: 'Only 6 tablets remaining. Scheduled refill reminder set for September 8.',
    type: 'refill',
    read: true,
    timestamp: '2026-08-30T10:00:00Z',
    actionUrl: '/medicines'
  },
  {
    id: 'notif-4',
    userId: 'user-patient-1',
    title: 'Lab Report Ready: Lipid Profile',
    message: 'Your Comprehensive Lipid Profile report is ready with AI explanations.',
    type: 'lab_report',
    read: true,
    timestamp: '2026-08-29T18:00:00Z',
    actionUrl: '/records'
  }
];

export const initialAuditLogs: AuditLog[] = [
  {
    id: 'audit-1',
    userId: 'user-patient-1',
    userRole: 'patient',
    action: 'LOGIN',
    resource: '/auth/login',
    ipAddress: '192.168.1.45',
    timestamp: '2026-09-02T10:00:15Z',
    details: 'Successful biometric authentication from trusted device'
  },
  {
    id: 'audit-2',
    userId: 'user-doctor-1',
    userRole: 'doctor',
    action: 'PRESCRIPTION_SIGNED',
    resource: 'rx-2026-001',
    ipAddress: '172.16.0.12',
    timestamp: '2026-08-25T11:42:00Z',
    details: 'Digital signature applied to e-prescription for patient Aditya Sharma'
  },
  {
    id: 'audit-3',
    userId: 'user-patient-1',
    userRole: 'patient',
    action: 'RECORD_SHARED',
    resource: 'rec-lab-001',
    ipAddress: '192.168.1.45',
    timestamp: '2026-08-28T09:15:22Z',
    details: 'Temporary 24h access link generated for consulting physician'
  }
];
