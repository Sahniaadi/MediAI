import {
  initialUsers,
  initialPatientProfile,
  initialFamilyMembers,
  initialDoctors,
  initialMedicines,
  initialPrescriptions,
  initialMedicineReminders,
  initialAdherenceLogs,
  initialAppointments,
  initialLabTests,
  initialLabBookings,
  initialOrders,
  initialMedicalRecords,
  initialHospitals,
  initialPharmacies,
  initialLabs,
  initialCoupons,
  initialReferrals,
  initialNotifications,
  initialAuditLogs
} from './seedData';
import {
  User,
  PatientProfile,
  FamilyMember,
  DoctorProfile,
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
  AuditLog,
  VideoSession,
  AIChatMessage
} from './types';

// Global in-memory storage singleton (persists across API invocations in dev server process)
declare global {
  var __MEDAI_DB__: {
    users: User[];
    patientProfile: PatientProfile;
    familyMembers: FamilyMember[];
    doctors: DoctorProfile[];
    medicines: Medicine[];
    prescriptions: Prescription[];
    reminders: MedicineReminder[];
    adherenceLogs: MedicineAdherenceLog[];
    appointments: Appointment[];
    videoSessions: Record<string, VideoSession>;
    labTests: LabTest[];
    labBookings: LabBooking[];
    orders: Order[];
    records: MedicalRecord[];
    hospitals: Hospital[];
    pharmacies: Pharmacy[];
    labs: Lab[];
    coupons: Coupon[];
    referral: Referral;
    notifications: AppNotification[];
    auditLogs: AuditLog[];
    chatHistory: AIChatMessage[];
  } | undefined;
}

function getDatabase() {
  if (!global.__MEDAI_DB__) {
    global.__MEDAI_DB__ = {
      users: [...initialUsers],
      patientProfile: { ...initialPatientProfile },
      familyMembers: [...initialFamilyMembers],
      doctors: [...initialDoctors],
      medicines: [...initialMedicines],
      prescriptions: [...initialPrescriptions],
      reminders: [...initialMedicineReminders],
      adherenceLogs: [...initialAdherenceLogs],
      appointments: [...initialAppointments],
      videoSessions: {},
      labTests: [...initialLabTests],
      labBookings: [...initialLabBookings],
      orders: [...initialOrders],
      records: [...initialMedicalRecords],
      hospitals: [...initialHospitals],
      pharmacies: [...initialPharmacies],
      labs: [...initialLabs],
      coupons: [...initialCoupons],
      referral: { ...initialReferrals },
      notifications: [...initialNotifications],
      auditLogs: [...initialAuditLogs],
      chatHistory: [
        {
          id: 'chat-1',
          patientId: 'user-patient-1',
          sessionId: 'session-default',
          sender: 'ai',
          text: "Hello Aditya! I'm MediAI, your personal medical assistant. I can help analyze your symptoms, extract details from prescriptions, guide you on medicine timing, or answer health questions. How are you feeling today?",
          timestamp: new Date().toISOString()
        }
      ]
    };
  }
  return global.__MEDAI_DB__;
}

export const db = {
  // --- USERS & AUTH ---
  getUsers: () => getDatabase().users,
  getUserById: (id: string) => getDatabase().users.find((u) => u.id === id),
  getUserByEmail: (email: string) => getDatabase().users.find((u) => u.email.toLowerCase() === email.toLowerCase()),
  createUser: (user: User) => {
    getDatabase().users.push(user);
    db.logAudit({
      userId: user.id,
      userRole: user.role,
      action: 'USER_REGISTERED',
      resource: '/auth/register',
      details: `New account created: ${user.fullName} (${user.role})`
    });
    return user;
  },

  // --- PATIENT PROFILE ---
  getPatientProfile: () => getDatabase().patientProfile,
  updatePatientProfile: (profile: Partial<PatientProfile>) => {
    getDatabase().patientProfile = { ...getDatabase().patientProfile, ...profile };
    // Recalculate BMI if height or weight changed
    if (profile.height || profile.weight) {
      const h = (getDatabase().patientProfile.height || 170) / 100;
      const w = getDatabase().patientProfile.weight || 70;
      getDatabase().patientProfile.bmi = Number((w / (h * h)).toFixed(1));
    }
    db.logAudit({
      userId: getDatabase().patientProfile.userId,
      userRole: 'patient',
      action: 'PROFILE_UPDATED',
      resource: '/profile',
      details: 'Patient health profile updated'
    });
    return getDatabase().patientProfile;
  },

  // --- FAMILY MEMBERS ---
  getFamilyMembers: () => getDatabase().familyMembers,
  addFamilyMember: (member: FamilyMember) => {
    getDatabase().familyMembers.push(member);
    return member;
  },

  // --- DOCTORS ---
  getDoctors: () => getDatabase().doctors,
  getDoctorById: (id: string) => getDatabase().doctors.find((d) => d.id === id),
  updateDoctor: (id: string, updates: Partial<DoctorProfile>) => {
    const idx = getDatabase().doctors.findIndex((d) => d.id === id);
    if (idx !== -1) {
      getDatabase().doctors[idx] = { ...getDatabase().doctors[idx], ...updates };
      return getDatabase().doctors[idx];
    }
    return null;
  },
  approveDoctorLicense: (doctorId: string) => {
    return db.updateDoctor(doctorId, { verificationStatus: 'verified' });
  },

  // --- MEDICINES ---
  getMedicines: () => getDatabase().medicines,
  getMedicineById: (id: string) => getDatabase().medicines.find((m) => m.id === id),
  searchMedicines: (query: string) => {
    const q = query.toLowerCase().trim();
    return getDatabase().medicines.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.genericName.toLowerCase().includes(q) ||
        m.category.toLowerCase().includes(q) ||
        m.uses.toLowerCase().includes(q)
    );
  },

  // --- PRESCRIPTIONS ---
  getPrescriptions: () => getDatabase().prescriptions,
  getPrescriptionById: (id: string) => getDatabase().prescriptions.find((p) => p.id === id),
  addPrescription: (rx: Prescription) => {
    getDatabase().prescriptions.unshift(rx);
    // Automatically add medicine reminders from prescription
    rx.medicines.forEach((m, i) => {
      const remaining = m.quantityPrescribed || 30;
      const today = new Date();
      const refill = new Date();
      refill.setDate(today.getDate() + 25);

      const reminder: MedicineReminder = {
        id: `rem-rx-${Date.now()}-${i}`,
        patientId: rx.patientId,
        medicineName: m.medicineName,
        dosage: m.dosage,
        frequency: m.frequency,
        scheduleTimes: m.frequency === '1-0-1' ? ['08:30 AM', '08:30 PM'] : ['10:00 PM'],
        foodInstruction: m.foodInstruction,
        remainingQuantity: remaining,
        totalQuantity: remaining,
        startDate: rx.date,
        endDate: rx.followUpDate || '2026-10-30',
        refillDate: refill.toISOString().split('T')[0],
        active: true
      };
      getDatabase().reminders.push(reminder);
    });

    // Add notification
    db.addNotification({
      userId: rx.patientId,
      title: `New Prescription Received from ${rx.doctorName}`,
      message: `Prescription issued with ${rx.medicines.length} medications. Reminders have been scheduled.`,
      type: 'prescription',
      read: false,
      timestamp: new Date().toISOString(),
      actionUrl: '/medicines'
    });

    db.logAudit({
      userId: rx.doctorId,
      userRole: 'doctor',
      action: 'PRESCRIPTION_CREATED',
      resource: rx.id,
      details: `Dr. ${rx.doctorName} prescribed ${rx.medicines.length} medications for ${rx.patientName}`
    });

    return rx;
  },

  // --- MEDICINE REMINDERS & ADHERENCE ---
  getReminders: () => getDatabase().reminders,
  updateReminder: (id: string, updates: Partial<MedicineReminder>) => {
    const idx = getDatabase().reminders.findIndex((r) => r.id === id);
    if (idx !== -1) {
      getDatabase().reminders[idx] = { ...getDatabase().reminders[idx], ...updates };
      return getDatabase().reminders[idx];
    }
    return null;
  },
  logDoseTaken: (reminderId: string, status: 'taken' | 'missed' | 'snoozed' = 'taken') => {
    const reminder = getDatabase().reminders.find((r) => r.id === reminderId);
    if (reminder) {
      if (status === 'taken' && reminder.remainingQuantity > 0) {
        reminder.remainingQuantity -= 1;
        reminder.lastTakenTime = new Date().toISOString();
      }
      const log: MedicineAdherenceLog = {
        id: `adh-${Date.now()}`,
        reminderId,
        patientId: reminder.patientId,
        medicineName: reminder.medicineName,
        scheduledTime: reminder.scheduleTimes[0] || '08:30 AM',
        takenAt: new Date().toISOString(),
        status,
        date: new Date().toISOString().split('T')[0]
      };
      getDatabase().adherenceLogs.unshift(log);
      return { reminder, log };
    }
    return null;
  },
  getAdherenceLogs: () => getDatabase().adherenceLogs,
  getAdherenceRate: () => {
    const logs = getDatabase().adherenceLogs;
    if (!logs.length) return 94;
    const taken = logs.filter((l) => l.status === 'taken').length;
    return Math.round((taken / logs.length) * 100);
  },

  // --- APPOINTMENTS ---
  getAppointments: () => getDatabase().appointments,
  getAppointmentById: (id: string) => getDatabase().appointments.find((a) => a.id === id),
  createAppointment: (appt: Appointment) => {
    getDatabase().appointments.unshift(appt);
    db.addNotification({
      userId: appt.patientId,
      title: `Appointment Confirmed with ${appt.doctorName}`,
      message: `Your ${appt.type === 'video' ? 'Video Consultation' : 'In-Clinic Appointment'} is confirmed for ${appt.date} at ${appt.timeSlot}.`,
      type: 'appointment',
      read: false,
      timestamp: new Date().toISOString(),
      actionUrl: '/appointments'
    });
    db.logAudit({
      userId: appt.patientId,
      userRole: 'patient',
      action: 'APPOINTMENT_BOOKED',
      resource: appt.id,
      details: `${appt.type} consultation booked with ${appt.doctorName}`
    });
    return appt;
  },
  updateAppointment: (id: string, updates: Partial<Appointment>) => {
    const idx = getDatabase().appointments.findIndex((a) => a.id === id);
    if (idx !== -1) {
      getDatabase().appointments[idx] = { ...getDatabase().appointments[idx], ...updates };
      return getDatabase().appointments[idx];
    }
    return null;
  },

  // --- VIDEO SESSIONS ---
  getVideoSession: (appointmentId: string) => {
    return getDatabase().videoSessions[appointmentId];
  },
  createOrGetVideoSession: (appointmentId: string, doctorId: string, doctorName: string, patientId: string, patientName: string) => {
    const dbInst = getDatabase();
    if (!dbInst.videoSessions[appointmentId]) {
      dbInst.videoSessions[appointmentId] = {
        id: `vid-${appointmentId}`,
        appointmentId,
        doctorId,
        doctorName,
        patientId,
        patientName,
        status: 'in_call',
        recordingConsent: true,
        durationSeconds: 0,
        networkQuality: 'excellent',
        createdAt: new Date().toISOString()
      };
    }
    return dbInst.videoSessions[appointmentId];
  },

  // --- LAB TESTS & BOOKINGS ---
  getLabTests: () => getDatabase().labTests,
  getLabBookings: () => getDatabase().labBookings,
  createLabBooking: (booking: LabBooking) => {
    getDatabase().labBookings.unshift(booking);
    db.addNotification({
      userId: booking.patientId,
      title: 'Lab Test Booking Confirmed',
      message: `Your booking for ${booking.testNames.join(', ')} has been scheduled for ${booking.bookingDate} (${booking.mode === 'home_collection' ? 'Home Collection' : 'Lab Visit'}).`,
      type: 'lab_report',
      read: false,
      timestamp: new Date().toISOString(),
      actionUrl: '/labs'
    });
    return booking;
  },

  // --- ORDERS ---
  getOrders: () => getDatabase().orders,
  getOrderById: (id: string) => getDatabase().orders.find((o) => o.id === id),
  createOrder: (order: Order) => {
    getDatabase().orders.unshift(order);
    db.addNotification({
      userId: order.patientId,
      title: `Order Placed Successfully (#${order.orderNumber})`,
      message: `Your medicine order for $${order.total.toFixed(2)} has been placed. Estimated delivery: ${order.estimatedDelivery}.`,
      type: 'order',
      read: false,
      timestamp: new Date().toISOString(),
      actionUrl: '/orders'
    });
    db.logAudit({
      userId: order.patientId,
      userRole: 'patient',
      action: 'ORDER_PLACED',
      resource: order.id,
      details: `Order #${order.orderNumber} placed for total $${order.total}`
    });
    return order;
  },
  updateOrderStatus: (id: string, status: Order['status'], trackingStep: number) => {
    const order = getDatabase().orders.find((o) => o.id === id);
    if (order) {
      order.status = status;
      order.trackingStep = trackingStep;
      return order;
    }
    return null;
  },

  // --- MEDICAL RECORDS ---
  getMedicalRecords: () => getDatabase().records,
  addMedicalRecord: (record: MedicalRecord) => {
    getDatabase().records.unshift(record);
    db.logAudit({
      userId: record.patientId,
      userRole: 'patient',
      action: 'RECORD_UPLOADED',
      resource: record.id,
      details: `Uploaded ${record.title} (${record.category})`
    });
    return record;
  },
  deleteMedicalRecord: (id: string) => {
    const idx = getDatabase().records.findIndex((r) => r.id === id);
    if (idx !== -1) {
      getDatabase().records.splice(idx, 1);
      return true;
    }
    return false;
  },

  // --- NEARBY HOSPITALS, PHARMACIES & LABS ---
  getHospitals: () => getDatabase().hospitals,
  getPharmacies: () => getDatabase().pharmacies,
  getLabs: () => getDatabase().labs,

  // --- COUPONS & REFERRALS ---
  getCoupons: () => getDatabase().coupons,
  validateCoupon: (code: string, subtotal: number) => {
    const coupon = getDatabase().coupons.find(
      (c) => c.code.toUpperCase() === code.toUpperCase() && c.isActive
    );
    if (!coupon) return { valid: false, message: 'Invalid or expired promo coupon code' };
    if (subtotal < coupon.minOrder) {
      return { valid: false, message: `Minimum order value for this coupon is $${coupon.minOrder}` };
    }
    const discount = Math.min((subtotal * coupon.discountPercent) / 100, coupon.maxDiscount);
    return { valid: true, coupon, discount: Number(discount.toFixed(2)) };
  },
  getReferral: () => getDatabase().referral,

  // --- NOTIFICATIONS ---
  getNotifications: () => getDatabase().notifications,
  addNotification: (notif: Omit<AppNotification, 'id'>) => {
    const full: AppNotification = { id: `notif-${Date.now()}`, ...notif };
    getDatabase().notifications.unshift(full);
    return full;
  },
  markNotificationRead: (id: string) => {
    const n = getDatabase().notifications.find((notif) => notif.id === id);
    if (n) n.read = true;
    return n;
  },
  markAllNotificationsRead: () => {
    getDatabase().notifications.forEach((n) => (n.read = true));
    return true;
  },

  // --- AUDIT LOGS ---
  getAuditLogs: () => getDatabase().auditLogs,
  logAudit: (entry: Omit<AuditLog, 'id' | 'timestamp' | 'ipAddress'>) => {
    const full: AuditLog = {
      id: `audit-${Date.now()}`,
      ipAddress: '127.0.0.1',
      timestamp: new Date().toISOString(),
      ...entry
    };
    getDatabase().auditLogs.unshift(full);
    return full;
  },

  // --- AI CHAT HISTORY ---
  getChatHistory: (sessionId = 'session-default') => {
    return getDatabase().chatHistory.filter((c) => c.sessionId === sessionId);
  },
  addChatMessage: (msg: Omit<AIChatMessage, 'id' | 'timestamp'>) => {
    const full: AIChatMessage = {
      id: `msg-${Date.now()}`,
      timestamp: new Date().toISOString(),
      ...msg
    };
    getDatabase().chatHistory.push(full);
    return full;
  },
  clearChatHistory: () => {
    getDatabase().chatHistory = [
      {
        id: `chat-${Date.now()}`,
        patientId: 'user-patient-1',
        sessionId: 'session-default',
        sender: 'ai',
        text: "Hello Aditya! Chat history has been reset. How can I assist you with your health today?",
        timestamp: new Date().toISOString()
      }
    ];
  }
};
