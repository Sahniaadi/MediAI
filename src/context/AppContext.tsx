'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole, PatientProfile, FamilyMember, OrderItem, AppNotification, DoctorProfile, Appointment } from '@/lib/db/types';

interface AppContextType {
  // Navigation & Role
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;

  // Theme & Accessibility
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  contrast: 'normal' | 'high';
  toggleContrast: () => void;
  fontSize: 'sm' | 'md' | 'lg';
  setFontSize: (size: 'sm' | 'md' | 'lg') => void;
  language: string;
  setLanguage: (lang: string) => void;

  // Profile & Family
  patientProfile: PatientProfile | null;
  updateProfile: (updates: Partial<PatientProfile>) => Promise<void>;
  familyMembers: FamilyMember[];
  activeFamilyMember: FamilyMember | null;
  setActiveFamilyMember: (member: FamilyMember) => void;

  // Cart
  cart: OrderItem[];
  addToCart: (item: OrderItem) => void;
  removeFromCart: (medicineId: string) => void;
  updateCartQty: (medicineId: string, delta: number) => void;
  clearCart: () => void;
  cartCount: number;

  // Modals & Drawers
  isEmergencyOpen: boolean;
  setIsEmergencyOpen: (open: boolean) => void;
  isNotificationsOpen: boolean;
  setIsNotificationsOpen: (open: boolean) => void;
  isProfileModalOpen: boolean;
  setIsProfileModalOpen: (open: boolean) => void;
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;

  // Active Telehealth Call
  activeVideoAppt: Appointment | null;
  setActiveVideoAppt: (appt: Appointment | null) => void;

  // Toast Alerts
  toast: { message: string; type: 'success' | 'error' | 'info' } | null;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;

  // Translation lookup helper
  t: (key: string) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const translations: Record<string, Record<string, string>> = {
  English: {
    welcome: 'Hello',
    howCanHelp: 'How can I help you today?',
    askAI: 'Ask AI',
    uploadPrescription: 'Upload Prescription',
    uploadReport: 'Upload Report',
    bookDoctor: 'Book Doctor',
    orderMedicine: 'Order Medicine',
    bookLab: 'Book Lab Test',
    todaysMeds: "Today's Medicines",
    upcomingAppt: 'Upcoming Appointment',
    nextRefill: 'Next Medicine Refill',
    healthSummary: 'Health Summary',
    emergencySOS: 'EMERGENCY SOS',
    home: 'Home',
    aiAssistant: 'AI Assistant',
    appointments: 'Appointments',
    medicines: 'Medicines',
    records: 'Records',
    orders: 'Orders',
    labs: 'Lab Tests',
    profile: 'Profile'
  },
  Spanish: {
    welcome: 'Hola',
    howCanHelp: '¿Cómo puedo ayudarte hoy?',
    askAI: 'Preguntar a IA',
    uploadPrescription: 'Subir Receta',
    uploadReport: 'Subir Informe',
    bookDoctor: 'Citar Médico',
    orderMedicine: 'Pedir Medicamentos',
    bookLab: 'Prueba de Laboratorio',
    todaysMeds: 'Medicamentos de Hoy',
    upcomingAppt: 'Próxima Cita',
    nextRefill: 'Próximo Resurtido',
    healthSummary: 'Resumen de Salud',
    emergencySOS: 'SOS EMERGENCIA',
    home: 'Inicio',
    aiAssistant: 'Asistente IA',
    appointments: 'Citas',
    medicines: 'Medicinas',
    records: 'Historial',
    orders: 'Pedidos',
    labs: 'Laboratorio',
    profile: 'Perfil'
  },
  Hindi: {
    welcome: 'नमस्ते',
    howCanHelp: 'आज मैं आपकी क्या सहायता कर सकता हूँ?',
    askAI: 'एआई से पूछें',
    uploadPrescription: 'पर्चा अपलोड करें',
    uploadReport: 'रिपोर्ट अपलोड करें',
    bookDoctor: 'डॉक्टर बुक करें',
    orderMedicine: 'दवा मंगवाएं',
    bookLab: 'लैब टेस्ट बुक करें',
    todaysMeds: 'आज की दवाइयाँ',
    upcomingAppt: 'आगामी अपॉइंटमेंट',
    nextRefill: 'अगला दवा रीफिल',
    healthSummary: 'स्वास्थ्य सारांश',
    emergencySOS: 'आपातकालीन एसओएस',
    home: 'होम',
    aiAssistant: 'एआई सहायक',
    appointments: 'अपॉइंटमेंट्स',
    medicines: 'दवाइयाँ',
    records: 'रिकॉर्ड्स',
    orders: 'ऑर्डर्स',
    labs: 'लैब टेस्ट',
    profile: 'प्रोफाइल'
  },
  French: {
    welcome: 'Bonjour',
    howCanHelp: "Comment puis-je vous aider aujourd'hui?",
    askAI: 'Demander à l’IA',
    uploadPrescription: 'Télécharger Ordonnance',
    uploadReport: 'Télécharger Rapport',
    bookDoctor: 'Prendre Rendez-vous',
    orderMedicine: 'Commander Médicaments',
    bookLab: 'Test Laboratoire',
    todaysMeds: "Médicaments d'aujourd'hui",
    upcomingAppt: 'Rendez-vous à venir',
    nextRefill: 'Prochain Renouvellement',
    healthSummary: 'Bilan de Santé',
    emergencySOS: 'URGENCE SOS',
    home: 'Accueil',
    aiAssistant: 'Assistant IA',
    appointments: 'Rendez-vous',
    medicines: 'Médicaments',
    records: 'Dossiers',
    orders: 'Commandes',
    labs: 'Analyses',
    profile: 'Profil'
  },
  Arabic: {
    welcome: 'مرحباً',
    howCanHelp: 'كيف يمكنني مساعدتك اليوم؟',
    askAI: 'اسأل الذكاء الاصطناعي',
    uploadPrescription: 'رفع وصفة طبية',
    uploadReport: 'رفع تقرير طبي',
    bookDoctor: 'حجز طبيب',
    orderMedicine: 'طلب دواء',
    bookLab: 'حجز فحص مخبري',
    todaysMeds: 'أدوية اليوم',
    upcomingAppt: 'الموعد القادم',
    nextRefill: 'إعادة التعبئة القادمة',
    healthSummary: 'ملخص الصحة',
    emergencySOS: 'طوارئ SOS',
    home: 'الرئيسية',
    aiAssistant: 'المساعد الذكي',
    appointments: 'المواعيد',
    medicines: 'الأدوية',
    records: 'السجلات',
    orders: 'الطلبات',
    labs: 'المختبر',
    profile: 'الملف الشخصي'
  }
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<UserRole>('patient');
  const [activeTab, setActiveTab] = useState<string>('home');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [contrast, setContrast] = useState<'normal' | 'high'>('normal');
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [language, setLanguage] = useState<string>('English');

  const [patientProfile, setPatientProfile] = useState<PatientProfile | null>(null);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [activeFamilyMember, setActiveFamilyMember] = useState<FamilyMember | null>(null);

  const [cart, setCart] = useState<OrderItem[]>([]);
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeVideoAppt, setActiveVideoAppt] = useState<Appointment | null>(null);

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Load initial profile & family members
  useEffect(() => {
    fetch('/api/auth/profile')
      .then((res) => res.json())
      .then((data) => {
        if (data.profile) {
          setPatientProfile(data.profile);
        }
        if (data.familyMembers) {
          setFamilyMembers(data.familyMembers);
          setActiveFamilyMember(data.familyMembers[0] || null);
        }
      })
      .catch((err) => console.error('Error fetching profile:', err));
  }, []);

  // Sync theme & accessibility attributes on HTML root element
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    root.setAttribute('data-contrast', contrast);
    root.setAttribute('data-font-size', fontSize);
  }, [theme, contrast, fontSize]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const toggleContrast = () => {
    setContrast((prev) => (prev === 'normal' ? 'high' : 'normal'));
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((cur) => (cur?.message === message ? null : cur));
    }, 3500);
  };

  const updateProfile = async (updates: Partial<PatientProfile>) => {
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update_profile', profileUpdates: updates })
      });
      const data = await res.json();
      if (data.profile) {
        setPatientProfile(data.profile);
        showToast('Medical profile updated successfully', 'success');
      }
    } catch (e) {
      showToast('Failed to update profile', 'error');
    }
  };

  // Cart operations
  const addToCart = (item: OrderItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.medicineId === item.medicineId);
      if (existing) {
        return prev.map((i) =>
          i.medicineId === item.medicineId
            ? { ...i, quantity: i.quantity + item.quantity, totalAmount: (i.quantity + item.quantity) * i.unitPrice }
            : i
        );
      }
      return [...prev, item];
    });
    showToast(`${item.medicineName} added to cart`, 'success');
  };

  const removeFromCart = (medicineId: string) => {
    setCart((prev) => prev.filter((i) => i.medicineId !== medicineId));
  };

  const updateCartQty = (medicineId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((i) => {
          if (i.medicineId === medicineId) {
            const newQty = i.quantity + delta;
            return newQty > 0
              ? { ...i, quantity: newQty, totalAmount: Number((newQty * i.unitPrice).toFixed(2)) }
              : null;
          }
          return i;
        })
        .filter(Boolean) as OrderItem[]
    );
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const t = (key: string): string => {
    const langDict = translations[language] || translations['English'];
    return langDict[key] || translations['English'][key] || key;
  };

  return (
    <AppContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        activeTab,
        setActiveTab,
        theme,
        toggleTheme,
        contrast,
        toggleContrast,
        fontSize,
        setFontSize,
        language,
        setLanguage,
        patientProfile,
        updateProfile,
        familyMembers,
        activeFamilyMember,
        setActiveFamilyMember,
        cart,
        addToCart,
        removeFromCart,
        updateCartQty,
        clearCart,
        cartCount,
        isEmergencyOpen,
        setIsEmergencyOpen,
        isNotificationsOpen,
        setIsNotificationsOpen,
        isProfileModalOpen,
        setIsProfileModalOpen,
        isSettingsOpen,
        setIsSettingsOpen,
        activeVideoAppt,
        setActiveVideoAppt,
        toast,
        showToast,
        t
      }}
    >
      {children}
      {/* Global Toast Notification */}
      {toast && (
        <div
          style={{
            position: 'fixed',
            top: '1.5rem',
            right: '1.5rem',
            zIndex: 9999,
            padding: '0.85rem 1.4rem',
            borderRadius: 'var(--radius-sm)',
            background:
              toast.type === 'success'
                ? '#10b981'
                : toast.type === 'error'
                ? '#ef4444'
                : '#0284c7',
            color: '#ffffff',
            boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
            fontWeight: 600,
            fontSize: 'var(--font-sm)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            animation: 'fadeIn 0.2s ease-out'
          }}
        >
          <span>{toast.message}</span>
        </div>
      )}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
