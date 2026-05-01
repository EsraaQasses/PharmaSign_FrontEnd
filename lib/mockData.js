// ==================== MOCK DATA ====================

export const MOCK_PATIENTS = [
  { id: 'p1', name: 'أحمد محمد الشهري', phone: '0551234567', email: 'ahmed@email.com', age: 45, gender: 'ذكر', bloodType: 'A+', allergies: ['بنسلين'], chronicConditions: ['سكري نوع 2', 'ضغط دم'], isPregnant: false, avatar: null, qrCode: 'PAT-001-AHMED' },
  { id: 'p2', name: 'فاطمة عبدالله العلي', phone: '0559876543', email: 'fatima@email.com', age: 32, gender: 'أنثى', bloodType: 'O+', allergies: [], chronicConditions: [], isPregnant: true, avatar: null, qrCode: 'PAT-002-FATIMA' },
  { id: 'p3', name: 'خالد سعد الدوسري', phone: '0553456789', email: 'khaled@email.com', age: 60, gender: 'ذكر', bloodType: 'B-', allergies: ['سلفا', 'أسبرين'], chronicConditions: ['ربو', 'ضغط دم'], isPregnant: false, avatar: null, qrCode: 'PAT-003-KHALED' },
];

export const MOCK_PHARMACIST = {
  id: 'ph1',
  name: 'د. سارة أحمد',
  email: 'sara@pharmacy.com',
  phone: '0551112233',
  pharmacyName: 'صيدلية الشفاء',
  pharmacyAddress: 'شارع الملك فهد، الرياض',
  pharmacyLat: 24.7136,
  pharmacyLng: 46.6753,
  licenseNumber: 'PH-2024-001',
  avatar: null,
};

export const MOCK_PHARMACIES = [
  { id: 'ph1', name: 'صيدلية الشفاء', address: 'شارع الملك فهد، دمشق', distance: '0.5 كم', hasSignService: true, rating: 4.8, lat: 33.5152, lng: 36.2912, phone: '0112345678', openHours: '24 ساعة' },
  { id: 'ph2', name: 'صيدلية النهدي', address: 'حي المزة، دمشق', distance: '1.2 كم', hasSignService: true, rating: 4.5, lat: 33.5042, lng: 36.2572, phone: '0112345679', openHours: '8ص - 12م' },
  { id: 'ph3', name: 'صيدلية الدواء', address: 'ساحة السبع بحرات، دمشق', distance: '2.8 كم', hasSignService: false, rating: 4.2, lat: 33.5202, lng: 36.3002, phone: '0112345680', openHours: '9ص - 11م' },
  { id: 'ph4', name: 'صيدلية الصحة', address: 'مشروع دمر، دمشق', distance: '3.5 كم', hasSignService: true, rating: 4.0, lat: 33.5350, lng: 36.2200, phone: '0112345681', openHours: '10ص - 10م' },
];

export const MOCK_DOCTORS = [
  { id: 'd1', name: 'د. محمد العتيبي', specialty: 'طب عام' },
  { id: 'd2', name: 'د. نورة الفهد', specialty: 'أمراض باطنية' },
  { id: 'd3', name: 'د. عبدالرحمن السعيد', specialty: 'جلدية' },
];

export const MOCK_MEDICATIONS = [
  { id: 'm1', name: 'أموكسيسيلين (Amoxicillin) 500mg', nameEn: 'Amoxicillin', category: 'مضاد حيوي', price: 25, image: null },
  { id: 'm2', name: 'ميتفورمين (Metformin) 850mg', nameEn: 'Metformin', category: 'سكري', price: 18, image: null },
  { id: 'm3', name: 'أملوديبين (Amlodipine) 5mg', nameEn: 'Amlodipine', category: 'ضغط', price: 30, image: null },
  { id: 'm4', name: 'باراسيتامول (Paracetamol) 500mg', nameEn: 'Paracetamol', category: 'مسكن', price: 8, image: null },
  { id: 'm5', name: 'أوميبرازول (Omeprazole) 20mg', nameEn: 'Omeprazole', category: 'معدة', price: 22, image: null },
];

export const MOCK_PRESCRIPTIONS = [
  {
    id: 'rx1',
    patientId: 'p1',
    patientName: 'أحمد محمد الشهري',
    pharmacistId: 'ph1',
    pharmacyName: 'صيدلية الشفاء',
    doctorName: 'د. محمد العتيبي',
    doctorSpecialty: 'طب عام',
    date: '2026-04-18',
    status: 'completed',
    medications: [
      { id: 'm1', name: 'أموكسيسيلين (Amoxicillin) 500mg', dosage: 'حبة واحدة 3 مرات يومياً', duration: '7 أيام', instructions: 'تؤخذ بعد الأكل مع كوب ماء كامل', signVideoUrl: null, price: 25 },
      { id: 'm4', name: 'باراسيتامول (Paracetamol) 500mg', dosage: 'حبة واحدة عند الحاجة', duration: 'حسب الحاجة', instructions: 'لا تتجاوز 4 حبات يومياً', signVideoUrl: null, price: 8 },
    ],
    totalPrice: 33,
    notes: 'مراجعة بعد أسبوع',
    signLanguageReady: true,
  },
  {
    id: 'rx2',
    patientId: 'p1',
    patientName: 'أحمد محمد الشهري',
    pharmacistId: 'ph1',
    pharmacyName: 'صيدلية الشفاء',
    doctorName: 'د. نورة الفهد',
    doctorSpecialty: 'أمراض باطنية',
    date: '2026-04-10',
    status: 'viewed',
    medications: [
      { id: 'm2', name: 'ميتفورمين (Metformin) 850mg', dosage: 'حبة واحدة مرتين يومياً', duration: 'مستمر', instructions: 'تؤخذ مع الوجبات الرئيسية', signVideoUrl: null, price: 18 },
      { id: 'm3', name: 'أملوديبين (Amlodipine) 5mg', dosage: 'حبة واحدة يومياً', duration: 'مستمر', instructions: 'تؤخذ صباحاً في نفس الوقت كل يوم', signVideoUrl: null, price: 30 },
    ],
    totalPrice: 48,
    notes: '',
    signLanguageReady: true,
  },
  {
    id: 'rx3',
    patientId: 'p3',
    patientName: 'خالد سعد الدوسري',
    pharmacistId: 'ph1',
    pharmacyName: 'صيدلية الشفاء',
    doctorName: 'د. عبدالرحمن السعيد',
    doctorSpecialty: 'جلدية',
    date: '2026-04-19',
    status: 'pending',
    medications: [
      { id: 'm5', name: 'أوميبرازول (Omeprazole) 20mg', dosage: 'حبة واحدة قبل الإفطار', duration: '14 يوم', instructions: 'تؤخذ على معدة فارغة قبل 30 دقيقة من الأكل', signVideoUrl: null, price: 22 },
    ],
    totalPrice: 22,
    notes: 'تجنب الأطعمة الحارة',
    signLanguageReady: false,
  },
];

export const MOCK_NOTIFICATIONS = [
  { id: 'n1', type: 'prescription', title: 'وصفة جديدة', body: 'تم إضافة وصفة طبية جديدة من صيدلية الشفاء', date: '2026-04-19T10:30:00', read: false },
  { id: 'n2', type: 'reminder', title: 'تذكير بالدواء', body: 'حان موعد تناول ميتفورمين (Metformin) 850mg', date: '2026-04-19T08:00:00', read: false },
  { id: 'n3', type: 'info', title: 'مرحباً بك', body: 'شكراً لانضمامك إلى فارماساين', date: '2026-04-18T14:00:00', read: true },
];

/**
 * Status configuration for prescriptions.
 * bgColor and textColor are separate for RN View + Text styling.
 * className is the combined NativeWind class for convenience.
 */
export const STATUS_MAP = {
  pending: {
    label: "قيد الإعداد",
    bgColor: "bg-amber-100",
    textColor: "text-amber-700",
    className: "bg-amber-100",
  },
  completed: {
    label: "مكتملة",
    bgColor: "bg-emerald-100",
    textColor: "text-emerald-700",
    className: "bg-emerald-100",
  },
  viewed: {
    label: "تمت المشاهدة",
    bgColor: "bg-blue-100",
    textColor: "text-blue-700",
    className: "bg-blue-100",
  },
  draft: {
    label: "مسودة",
    bgColor: "bg-gray-100",
    textColor: "text-gray-600",
    className: "bg-gray-100",
  },
  sent: {
    label: "مرسلة",
    bgColor: "bg-primary-50",
    textColor: "text-primary",
    className: "bg-primary-50",
  },
  cancelled: {
    label: "ملغاة",
    bgColor: "bg-red-100",
    textColor: "text-red-600",
    className: "bg-red-100",
  },
};