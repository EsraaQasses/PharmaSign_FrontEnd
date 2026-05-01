import MobileShell from "@/components/mobile/MobileShell";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ArrowLeft,
  Camera,
  CheckCircle,
  ChevronDown,
  Hand,
  Image as ImageIcon,
  Plus,
  Trash2,
  Upload,
  X,
} from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import HeaderBackButton from "@/components/mobile/HeaderBackButton";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

/*
  Temporary front-end draft.
  It keeps medicines while moving between:
  NewPrescription -> RecordAudio -> VerifyText -> GeneratingSign -> NewPrescription
*/
const prescriptionDraft = {
  medications: [],
};

const mockCompletedMedicines = [
  {
    name: "أوميبرازول 20mg",
    dosage: "حبة واحدة قبل الإفطار",
    duration: "14 يوم",
  },
  {
    name: "باراسيتامول 500mg",
    dosage: "حبة عند اللزوم",
    duration: "3 أيام",
  },
  {
    name: "فيتامين C",
    dosage: "حبة واحدة يومياً",
    duration: "7 أيام",
  },
];

const DOCTOR_SPECIALTIES = [
  "طب عام",
  "باطنة",
  "أطفال",
  "نسائية وتوليد",
  "قلبية",
  "صدرية",
  "هضمية",
  "عصبية",
  "جلدية",
  "عظمية",
  "أذنية",
  "عينية",
  "بولية",
  "نفسية",
  "غدد وسكري",
  "كلية",
  "أسنان",
  "جراحة عامة",
  "إسعاف",
  "أخرى",
];

export default function NewPrescription() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { addedMed, keepDraft } = useLocalSearchParams();

  const processedAddedMedRef = useRef(false);

  const [price, setPrice] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [doctorSpecialty, setDoctorSpecialty] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [customSpecialty, setCustomSpecialty] = useState("");
  const [medicineImageUri, setMedicineImageUri] = useState(null);
  const [showSpecialtyModal, setShowSpecialtyModal] = useState(false);

  const [medications, setMedications] = useState([...prescriptionDraft.medications]);
  const [isAddingAnother, setIsAddingAnother] = useState(
    prescriptionDraft.medications.length === 0
  );

  /*
    First normal open:
    /pharmacist/NewPrescription
    => start empty.

    Return from generation:
    /pharmacist/NewPrescription?addedMed=true&keepDraft=true
    => do not reset.
  */
  useEffect(() => {
    if (addedMed !== "true" && keepDraft !== "true") {
      prescriptionDraft.medications = [];
      setMedications([]);
      setIsAddingAnother(true);
      setPrice("");
      setDoctorName("");
      setDoctorSpecialty("");
      setSelectedSpecialty("");
      setCustomSpecialty("");
      setMedicineImageUri(null);
    }
  }, []);

  /*
    When coming back from GeneratingSign, add exactly one completed medicine.
  */
  useEffect(() => {
    if (addedMed === "true" && !processedAddedMedRef.current) {
      processedAddedMedRef.current = true;

      const nextIndex = prescriptionDraft.medications.length;

      const template =
        mockCompletedMedicines[nextIndex] || {
          name: `دواء رقم ${nextIndex + 1}`,
          dosage: "تم إنشاء فيديو لغة الإشارة",
          duration: "",
        };

      const newMedicine = {
        id: String(Date.now()),
        ...template,
      };

      prescriptionDraft.medications = [
        ...prescriptionDraft.medications,
        newMedicine,
      ];

      setMedications([...prescriptionDraft.medications]);
      setIsAddingAnother(false);

      setPrice("");
      setMedicineImageUri(null);

      router.replace("/pharmacist/NewPrescription?keepDraft=true");
    }
  }, [addedMed, router]);

  const hasCompletedMedicines = medications.length > 0;

  const resetCurrentMedicineForm = () => {
    setPrice("");
    setMedicineImageUri(null);
    setIsAddingAnother(true);
  };

  const handleTakePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("يرجى السماح بالوصول للكاميرا أو الصور لاختيار صورة الدواء");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setMedicineImageUri(result.assets[0].uri);
    }
  };

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("يرجى السماح بالوصول للكاميرا أو الصور لاختيار صورة الدواء");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setMedicineImageUri(result.assets[0].uri);
    }
  };

  const handleRemoveImage = () => {
    setMedicineImageUri(null);
  };

  const handleNext = () => {
    router.push("/pharmacist/RecordAudio");
  };

  const handleSendPrescription = () => {
    alert("تم إرسال الوصفة الطبية بنجاح");

    prescriptionDraft.medications = [];
    setMedications([]);
    setIsAddingAnother(true);
    setPrice("");
    setDoctorName("");
    setDoctorSpecialty("");
    setSelectedSpecialty("");
    setCustomSpecialty("");
    setMedicineImageUri(null);

    router.push("/pharmacist/PharmacistHome");
  };

  const handleCancel = () => {
    if (hasCompletedMedicines && isAddingAnother) {
      setIsAddingAnother(false);
      return;
    }

    prescriptionDraft.medications = [];
    setMedications([]);
    setIsAddingAnother(true);
    setMedicineImageUri(null);

    router.replace("/pharmacist/PharmacistHome");
  };

  const onSpecialtySelect = (spec) => {
    setSelectedSpecialty(spec);
    if (spec === "أخرى") {
      setDoctorSpecialty(customSpecialty);
    } else {
      setDoctorSpecialty(spec);
      setCustomSpecialty("");
    }
    setShowSpecialtyModal(false);
  };

  const onCustomSpecialtyChange = (val) => {
    setCustomSpecialty(val);
    if (selectedSpecialty === "أخرى") {
      setDoctorSpecialty(val);
    }
  };

  return (
    <MobileShell className="bg-pharmacist" edges={["top", "left", "right"]}>
      <KeyboardAvoidingView
        className="flex-1 bg-background"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View className="flex-1">
          {/* Header */}
          <View className="bg-pharmacist pt-4 pb-12 px-6 rounded-b-[4rem] shadow-2xl shadow-pharmacist/30 relative overflow-hidden">
            <View className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32" />

            <View className="mb-8" style={{ position: 'relative', minHeight: 44 }}>
              <View style={{ position: 'absolute', right: 0, top: 0, zIndex: 10 }}>
                <HeaderBackButton fallback="/pharmacist/ScanPatient" color="#05997F" />
              </View>
              <View className="items-center justify-center" style={{ minHeight: 44 }}>
                <Text className="text-white text-xl font-extrabold">
                  إضافة دواء جديد
                </Text>
              </View>
            </View>

            <View>
              <View className="flex-row items-end justify-between mb-3">
                <Text className="text-[10px] text-white/60 font-extrabold uppercase tracking-tighter">
                  20% مكتمل
                </Text>

                <View className="items-end">
                  <Text className="text-[11px] text-white/90 font-extrabold mb-1 uppercase tracking-wider">
                    الخطوة 1 من 3
                  </Text>
                  <Text className="text-2xl font-extrabold text-white">
                    معلومات الدواء
                  </Text>
                </View>
              </View>

              <View className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <View className="w-1/5 h-full bg-white rounded-full shadow-sm" />
              </View>
            </View>
          </View>

          <ScrollView
            className="flex-1"
            contentContainerStyle={{
              paddingHorizontal: 20,
              paddingTop: 24,
              paddingBottom: 110 + insets.bottom,
            }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Camera/Upload Area */}
            <View className="bg-white rounded-3xl p-5 shadow-sm border border-gray-50 mb-5">
              <View className="flex-row items-center gap-2 mb-4 justify-end">
                <Text className="text-sm font-extrabold text-gray-900">
                  صورة الدواء
                </Text>
                <ImageIcon size={18} color="#05997F" />
              </View>

              <View
                className="w-full aspect-video bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl items-center justify-center mb-5 overflow-hidden relative"
              >
                {medicineImageUri ? (
                  <>
                    <Image
                      source={{ uri: medicineImageUri }}
                      className="w-full h-full"
                      resizeMode="cover"
                    />
                    {/* Delete Button Overlay */}
                    <TouchableOpacity
                      onPress={handleRemoveImage}
                      className="absolute top-4 right-4 bg-red-500 w-10 h-10 rounded-full items-center justify-center shadow-lg"
                      activeOpacity={0.8}
                    >
                      <Trash2 size={20} color="#FFFFFF" strokeWidth={2.5} />
                    </TouchableOpacity>

                    <View className="absolute bottom-4 left-4 bg-black/40 px-3 py-1.5 rounded-lg">
                      <Text className="text-[10px] text-white font-bold">تم اختيار الصورة</Text>
                    </View>
                  </>
                ) : (
                  <TouchableOpacity
                    className="items-center justify-center w-full h-full"
                    activeOpacity={0.7}
                    onPress={handleTakePhoto}
                  >
                    <View className="bg-white p-4 rounded-full shadow-sm mb-2">
                      <Camera size={32} color="#9CA3AF" />
                    </View>
                    <Text className="text-xs text-gray-400 font-bold">
                      التقط صورة لعلبة الدواء
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              <View className="flex-row gap-3">
                <TouchableOpacity
                  onPress={handlePickImage}
                  className="flex-1 bg-gray-50 border border-gray-100 py-4 rounded-xl flex-row items-center justify-center gap-2"
                >
                  <Upload size={18} color="#6B7280" />
                  <Text className="text-sm font-bold text-gray-600">
                    رفع ملف
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleTakePhoto}
                  className="flex-1 bg-pharmacist py-4 rounded-xl flex-row items-center justify-center gap-2 shadow-lg shadow-pharmacist/20"
                >
                  <Camera size={18} color="#FFFFFF" strokeWidth={2.5} />
                  <Text className="text-sm font-extrabold text-white">
                    التقاط
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Details Form */}
            <View className="bg-white rounded-3xl p-6 shadow-sm border border-gray-50 mb-5">
              <View className="flex-row items-center justify-between mb-4">
                <TouchableOpacity
                  className="flex-row items-center gap-2 bg-primary/5 px-3 py-1.5 rounded-lg border border-primary/10"
                  onPress={resetCurrentMedicineForm}
                  activeOpacity={0.8}
                >
                  <Plus size={14} color="#05997F" />
                  <Text className="text-xs font-bold text-pharmacist">
                    دواء جديد
                  </Text>
                </TouchableOpacity>

                <Text className="text-sm font-extrabold text-gray-900">
                  الأدوية المضافة ({medications.length})
                </Text>
              </View>

              {medications.length > 0 ? (
                <View className="gap-3 mb-6">
                  {medications.map((med) => (
                    <View
                      key={med.id}
                      className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex-row items-center justify-between"
                    >
                      <View className="w-8 h-8 rounded-full bg-emerald-500 items-center justify-center">
                        <CheckCircle size={16} color="#FFFFFF" />
                      </View>

                      <View className="items-end flex-1 ml-3">
                        <Text className="text-sm font-bold text-gray-900">
                          {med.name}
                        </Text>
                        <Text className="text-[10px] text-gray-400 mt-0.5">
                          {med.dosage}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              ) : (
                <View className="bg-gray-50 p-4 rounded-2xl border border-gray-100 mb-6">
                  <Text className="text-sm font-bold text-gray-500 text-center">
                    لم تتم إضافة أي دواء بعد
                  </Text>
                </View>
              )}

              {hasCompletedMedicines && isAddingAnother && (
                <View className="bg-pharmacist/5 p-4 rounded-2xl border border-pharmacist/20 flex-row items-center justify-between mb-6">
                  <View className="w-8 h-8 rounded-full bg-pharmacist items-center justify-center">
                    <Hand size={16} color="#FFFFFF" />
                  </View>

                  <View className="items-end flex-1 ml-3">
                    <Text className="text-sm font-bold text-pharmacist">
                      جاهز لإضافة دواء جديد
                    </Text>
                    <Text className="text-[10px] text-pharmacist/60 mt-0.5">
                      أدخل بيانات الدواء ثم اضغط الخطوة التالية
                    </Text>
                  </View>
                </View>
              )}

              <View className="h-px bg-gray-100 w-full mb-6" />

              {/* Price */}
              <View className="mb-6">
                <Text className="text-sm font-extrabold text-gray-700 mb-3 text-right">
                  السعر
                </Text>

                <View className="flex-row items-center border border-gray-100 bg-gray-50 rounded-2xl px-4 h-16">
                  <Text className="text-sm font-extrabold text-gray-400 mr-2 ml-1">
                    ر.س
                  </Text>

                  <TextInput
                    className="flex-1 text-base text-gray-900 h-full pl-2 font-bold"
                    placeholder="0.00"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="decimal-pad"
                    textAlign="right"
                    value={price}
                    onChangeText={setPrice}
                  />
                </View>
              </View>

              <View className="h-px bg-gray-100 w-full mb-6" />

              {/* Doctor Details */}
              <View className="mb-6">
                <Text className="text-sm font-extrabold text-gray-700 mb-3 text-right">
                  اسم الطبيب المعالج
                </Text>

                <View className="flex-row items-center border border-gray-100 bg-gray-50 rounded-2xl px-4 h-16">
                  <TextInput
                    className="flex-1 text-base text-gray-900 h-full font-bold"
                    placeholder="اسم الطبيب كما في الوصفة..."
                    placeholderTextColor="#9CA3AF"
                    textAlign="right"
                    value={doctorName}
                    onChangeText={setDoctorName}
                  />
                </View>
              </View>

              <View>
                <Text className="text-sm font-extrabold text-gray-700 mb-3 text-right">
                  تخصص الطبيب
                </Text>

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setShowSpecialtyModal(true)}
                  className="flex-row items-center justify-between border border-gray-100 bg-gray-50 rounded-2xl px-4 h-16"
                >
                  <ChevronDown size={20} color="#9CA3AF" />
                  <Text
                    className={`flex-1 text-base font-bold text-right ${
                      selectedSpecialty ? "text-gray-900" : "text-gray-400"
                    }`}
                  >
                    {selectedSpecialty || "اختر تخصص الطبيب..."}
                  </Text>
                </TouchableOpacity>

                {selectedSpecialty === "أخرى" && (
                  <View className="mt-3 flex-row items-center border border-gray-100 bg-gray-50 rounded-2xl px-4 h-16">
                    <TextInput
                      className="flex-1 text-base text-gray-900 h-full font-bold"
                      placeholder="اكتب تخصص الطبيب..."
                      placeholderTextColor="#9CA3AF"
                      textAlign="right"
                      value={customSpecialty}
                      onChangeText={onCustomSpecialtyChange}
                    />
                  </View>
                )}
              </View>
            </View>
          </ScrollView>

          {/* Fixed Footer */}
          <View
            className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-100 px-6 py-4"
            style={{ paddingBottom: Math.max(insets.bottom, 20) }}
          >
            {hasCompletedMedicines && !isAddingAnother ? (
              <View className="flex-row gap-3">
                <TouchableOpacity
                  className="flex-1 bg-gray-50 border border-gray-200 h-14 rounded-2xl flex-row items-center justify-center gap-2"
                  onPress={resetCurrentMedicineForm}
                  activeOpacity={0.8}
                >
                  <Plus size={20} color="#6B7280" strokeWidth={2.5} />
                  <Text className="font-bold text-gray-600 text-base">
                    إضافة دواء آخر
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="flex-1 bg-pharmacist h-14 rounded-2xl flex-row items-center justify-center gap-2 shadow-xl shadow-pharmacist/20"
                  onPress={handleSendPrescription}
                  activeOpacity={0.8}
                >
                  <CheckCircle size={20} color="#FFFFFF" strokeWidth={2.5} />
                  <Text className="font-extrabold text-white text-base">
                    إنهاء وإرسال الوصفة
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View className="flex-row gap-3">
                <TouchableOpacity
                  className="flex-1 bg-gray-50 border border-gray-100 h-14 rounded-2xl items-center justify-center"
                  onPress={handleCancel}
                  activeOpacity={0.8}
                >
                  <Text className="font-bold text-gray-500 text-base">
                    إلغاء
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="flex-[2] bg-pharmacist h-14 rounded-2xl flex-row items-center justify-center gap-2 shadow-xl shadow-pharmacist/20"
                  onPress={handleNext}
                  activeOpacity={0.8}
                >
                  <Text className="font-extrabold text-white text-lg">
                    الخطوة التالية
                  </Text>
                  <ArrowLeft size={22} color="#FFFFFF" strokeWidth={2.5} />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>

      {/* Specialty Modal */}
      <Modal
        visible={showSpecialtyModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowSpecialtyModal(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setShowSpecialtyModal(false)}
          className="flex-1 bg-black/50 justify-center items-center px-6"
        >
          <View className="bg-white w-full max-h-[70%] rounded-[2.5rem] overflow-hidden shadow-2xl">
            <View className="p-6 border-b border-gray-100 flex-row items-center justify-between">
              <TouchableOpacity
                onPress={() => setShowSpecialtyModal(false)}
                className="bg-gray-100 p-2 rounded-full"
              >
                <X size={20} color="#6B7280" />
              </TouchableOpacity>
              <Text className="text-lg font-extrabold text-gray-900">
                تخصص الطبيب
              </Text>
              <View className="w-8" />
            </View>

            <ScrollView className="flex-1 p-4">
              <View className="gap-2">
                {DOCTOR_SPECIALTIES.map((spec) => (
                  <TouchableOpacity
                    key={spec}
                    onPress={() => onSpecialtySelect(spec)}
                    className={`flex-row items-center justify-between p-4 rounded-2xl ${
                      selectedSpecialty === spec ? "bg-pharmacist/10" : "bg-gray-50"
                    }`}
                  >
                    {selectedSpecialty === spec ? (
                      <CheckCircle size={18} color="#05997F" />
                    ) : (
                      <View className="w-5" />
                    )}
                    <Text
                      className={`text-base font-bold ${
                        selectedSpecialty === spec ? "text-pharmacist" : "text-gray-700"
                      }`}
                    >
                      {spec}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </MobileShell>
  );
}