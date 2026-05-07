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
import { prescriptionApi } from "@/api/prescriptionApi";
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
  doctorName: "",
  doctorSpecialty: "",
  medications: [],
};

const DOCTOR_SPECIALTIES = [
  "طبيب عام",
  "قلبية",
  "عصبية",
  "أطفال",
  "نسائية",
  "عظمية",
  "باطنية",
  "أسنان",
  "أخرى",
];

export default function NewPrescription() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const { 
    addedMed, 
    keepDraft, 
    session_id, 
    patient_id, 
    patient_name,
    prescription_id,
    item_id,
    verifiedText, 
    medName, 
    medDosage,
    medDuration,
    medFrequency,
    medPrice
  } = params;

  const [currentPrescriptionId, setCurrentPrescriptionId] = useState(prescription_id || null);
  const [currentItemId, setCurrentItemId] = useState(item_id || null);

  const processedAddedMedRef = useRef(false);

  const [price, setPrice] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [doctorSpecialty, setDoctorSpecialty] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [customSpecialty, setCustomSpecialty] = useState("");
  const [medicineImageUri, setMedicineImageUri] = useState(null);
  const [medicineName, setMedicineName] = useState("");
  const [showSpecialtyModal, setShowSpecialtyModal] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const scrollRef = useRef(null);

  const [medications, setMedications] = useState([...prescriptionDraft.medications]);
  const [isAddingAnother, setIsAddingAnother] = useState(
    prescriptionDraft.medications.length === 0
  );

  /*
    First normal open:
    /pharmacist/NewPrescription
    => start empty.

    Return from generation:
    /pharmacist/NewPrescription?verifiedText=...&keepDraft=true
    => do not reset.
  */
  useEffect(() => {
    if (keepDraft !== "true") {
      prescriptionDraft.medications = [];
      prescriptionDraft.doctorName = "";
      prescriptionDraft.doctorSpecialty = "";
      setMedications([]);
      setMedicineImageUri(null);
      setMedicineName("");
      setPrice("");
      setValidationErrors({});
      setCurrentPrescriptionId(null);
      setCurrentItemId(null);
    } else {
      // Restore doctor info from draft if it exists
      if (prescriptionDraft.doctorName) setDoctorName(prescriptionDraft.doctorName);
      if (prescriptionDraft.doctorSpecialty) {
        setDoctorSpecialty(prescriptionDraft.doctorSpecialty);
        if (DOCTOR_SPECIALTIES.includes(prescriptionDraft.doctorSpecialty)) {
          setSelectedSpecialty(prescriptionDraft.doctorSpecialty);
        } else {
          setSelectedSpecialty("أخرى");
          setCustomSpecialty(prescriptionDraft.doctorSpecialty);
        }
      }
      if (prescription_id) setCurrentPrescriptionId(prescription_id);
      if (item_id) setCurrentItemId(item_id);
      if (medName) setMedicineName(medName);
      if (medPrice) setPrice(medPrice);
    }
  }, [keepDraft, prescription_id, item_id, medName, medPrice]);

  // Eager creation of draft prescription on mount
  useEffect(() => {
    const createDraftIfNeeded = async () => {
      if (!currentPrescriptionId && session_id && patient_id && keepDraft !== "true") {
        try {
          const res = await prescriptionApi.createPrescription({
            session_id: parseInt(session_id),
            patient_id: parseInt(patient_id),
            doctor_name: "جاري الإدخال...",
            diagnosis: "Draft",
            notes: ""
          });
          if (res.success) {
            setCurrentPrescriptionId(res.data.id);
            console.log("Draft prescription created:", res.data.id);
          }
        } catch (err) {
          console.error("Failed to auto-create prescription:", err);
        }
      }
    };
    createDraftIfNeeded();
  }, [session_id, patient_id, keepDraft]);

  // Real-time clearing of validation errors
  useEffect(() => {
    if (medicineImageUri && validationErrors.image) {
      setValidationErrors(prev => ({ ...prev, image: null }));
    }
  }, [medicineImageUri]);

  useEffect(() => {
    if (doctorName && doctorName.trim() !== "" && validationErrors.doctorName) {
      setValidationErrors(prev => ({ ...prev, doctorName: null }));
    }
  }, [doctorName]);

  useEffect(() => {
    if (selectedSpecialty && selectedSpecialty !== "" && validationErrors.specialty) {
      setValidationErrors(prev => ({ ...prev, specialty: null }));
    }
  }, [selectedSpecialty]);

  /*
    When coming back from GeneratingSign, add the medicine with its verified instructions.
  */
  useEffect(() => {
    if (verifiedText && !processedAddedMedRef.current) {
      processedAddedMedRef.current = true;

      const newMedicine = {
        id: String(Date.now()),
        name: medName || medicineName || "دواء",
        dosage: medDosage || "",
        duration: medDuration || "",
        instructions: verifiedText,
      };

      prescriptionDraft.medications = [
        ...prescriptionDraft.medications,
        newMedicine,
      ];

      setMedications([...prescriptionDraft.medications]);
      setIsAddingAnother(false);

      setMedicineImageUri(null);
      setMedicineName("");

      router.replace({
        pathname: "/pharmacist/NewPrescription",
        params: { 
          keepDraft: "true",
          session_id,
          patient_id,
          prescription_id: currentPrescriptionId
        }
      });
    }
  }, [verifiedText]);

  const hasCompletedMedicines = medications.length > 0;

  const resetCurrentMedicineForm = () => {
    setPrice("");
    setMedicineImageUri(null);
    setMedicineName("");
    setValidationErrors({});
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

  const handleNext = async () => {
    const errors = {};
    if (!medicineName || medicineName.trim() === "") {
      errors.medicineName = "يرجى إدخال اسم الدواء.";
    }
    
    // Doctor info is required once
    if (!doctorName || doctorName.trim() === "") errors.doctorName = "يرجى إدخال اسم الطبيب";
    if (!selectedSpecialty || selectedSpecialty === "") errors.specialty = "يرجى إدخال اختصاص الطبيب";
    if (!medicineImageUri) errors.image = "يرجى التقاط أو اختيار صورة للدواء";

    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) {
      scrollRef.current?.scrollTo({ y: 0, animated: true });
      return;
    }

    if (!currentPrescriptionId) {
      Alert.alert("خطأ", "لم يتم إنشاء رقم الوصفة بعد. يرجى المحاولة مرة أخرى.");
      return;
    }

    setIsSending(true);

    try {
      // Step: Persist doctor info if not already set or changed
      const finalSpecialty = selectedSpecialty === "أخرى" ? customSpecialty : selectedSpecialty;
      
      // Update prescription header if it's the first item or doctor info changed
      await prescriptionApi.updatePrescription(currentPrescriptionId, {
        doctor_name: doctorName.trim(),
        doctor_specialty: finalSpecialty.trim(),
      });

      // Step: Create/Update item on backend before proceeding to audio
      const itemPayload = {
        medicine_name: medicineName.trim(),
        dosage: "", // To be populated by audio
        frequency: "",
        duration: "غير محدد",
        instructions_text: "" 
      };

      let itemId = currentItemId;

      if (!itemId) {
        console.log("Creating medication item for prescription:", currentPrescriptionId);
        const itemRes = await prescriptionApi.addItemToPrescription(currentPrescriptionId, itemPayload);
        
        if (!itemRes.success) {
          throw new Error(itemRes.message || "فشل إضافة الدواء في هذه الخطوة");
        }
        itemId = itemRes.data.id;
        setCurrentItemId(itemId);
      } else {
        console.log("Reusing existing medication item:", itemId);
        // Optional: update item fields if needed, but not required by backend yet for this flow
      }

      // Preserve doctor info in draft for local UI state
      prescriptionDraft.doctorName = doctorName.trim();
      prescriptionDraft.doctorSpecialty = finalSpecialty;

      router.push({
        pathname: "/pharmacist/RecordAudio",
        params: {
          session_id,
          patient_id,
          patient_name: patient_name || "مريض",
          prescription_id: currentPrescriptionId,
          item_id: itemId,
          doctor_name: prescriptionDraft.doctorName,
          doctor_specialty: prescriptionDraft.doctorSpecialty,
          medName: medicineName,
          medPrice: price,
          medDosage: medDosage || "", 
          medDuration: medDuration || "غير محدد",
          medFrequency: medFrequency || ""
        }
      });
    } catch (err) {
      Alert.alert("خطأ", err.message || "فشل الاتصال بالخادم");
    } finally {
      setIsSending(false);
    }
  };

  const handleSendPrescription = async () => {
    if (!currentPrescriptionId) {
      Alert.alert("خطأ", "رقم الوصفة غير موجود.");
      return;
    }

    setIsSending(true);
    console.log("SUBMIT CLICKED for Prescription:", currentPrescriptionId);
    
    try {
      // We only need to call Submit now, items were created in handleNext
      const submitRes = await prescriptionApi.submitPrescription(currentPrescriptionId);
      
      if (!submitRes.success) {
        const backendError = submitRes.data?.detail || submitRes.data?.rejection_reason || submitRes.message;
        throw new Error(backendError || "فشل إرسال الوصفة الطبية النهائية");
      }

      // Success!
      // No alert here, we redirect to success screen
      
      const finalPrescriptionId = currentPrescriptionId;
      const finalPatientName = patient_name || "مريض";
      const finalMedicationCount = medications.length;

      // Clear local state
      prescriptionDraft.medications = [];
      setMedications([]);
      setIsAddingAnother(true);
      setMedicineName("");
      setValidationErrors({});
      setCurrentPrescriptionId(null);

      router.replace({
        pathname: "/pharmacist/PrescriptionSuccess",
        params: {
          prescription_id: finalPrescriptionId,
          patient_name: finalPatientName,
          medication_count: finalMedicationCount,
          doctor_name: doctorName
        }
      });

    } catch (err) {
      console.error("Prescription Submission Error:", err);
      Alert.alert("خطأ", err.message || "تعذر إرسال الوصفة. حاول مرة أخرى.");
    } finally {
      setIsSending(false);
    }
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
    setMedicineName("");
    setValidationErrors({});

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
            ref={scrollRef}
            className="flex-1"
            contentContainerStyle={{
              paddingHorizontal: 20,
              paddingTop: 24,
              paddingBottom: 110 + insets.bottom,
            }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Doctor Details (Prescription Level) */}
            <View className="bg-white rounded-3xl p-6 shadow-sm border border-gray-50 mb-5">
              <View className="flex-row items-center gap-2 mb-4 justify-end">
                <Text className="text-sm font-extrabold text-gray-900">
                  بيانات الطبيب المعالج
                </Text>
                <Plus size={18} color="#05997F" />
              </View>

              <View className="mb-4">
                <Text className="text-[10px] font-extrabold text-gray-400 mb-2 text-right uppercase tracking-wider">اسم الطبيب</Text>
                <View className={`flex-row items-center border bg-gray-50 rounded-2xl px-4 h-14 ${
                  validationErrors.doctorName ? "border-red-500 bg-red-50/10" : "border-gray-100"
                }`}>
                  <TextInput
                    className="flex-1 text-sm text-gray-900 h-full font-bold"
                    placeholder="اسم الطبيب كما في الوصفة..."
                    placeholderTextColor="#9CA3AF"
                    textAlign="right"
                    value={doctorName}
                    onChangeText={setDoctorName}
                    editable={medications.length === 0}
                  />
                </View>
                {validationErrors.doctorName && (
                  <Text className="text-red-500 text-[10px] font-bold text-right mt-1">
                    {validationErrors.doctorName}
                  </Text>
                )}
              </View>

              <View>
                <Text className="text-[10px] font-extrabold text-gray-400 mb-2 text-right uppercase tracking-wider">تخصص الطبيب</Text>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => medications.length === 0 && setShowSpecialtyModal(true)}
                  className={`flex-row items-center justify-between border bg-gray-50 rounded-2xl px-4 h-14 ${
                    validationErrors.specialty ? "border-red-500 bg-red-50/10" : "border-gray-100"
                  }`}
                >
                  <ChevronDown size={18} color="#9CA3AF" />
                  <Text
                    className={`flex-1 text-sm font-bold text-right ${
                      selectedSpecialty ? "text-gray-900" : "text-gray-400"
                    }`}
                  >
                    {selectedSpecialty || "اختر تخصص الطبيب..."}
                  </Text>
                </TouchableOpacity>
                {validationErrors.specialty && (
                  <Text className="text-red-500 text-[10px] font-bold text-right mt-1">
                    {validationErrors.specialty}
                  </Text>
                )}

                {selectedSpecialty === "أخرى" && (
                  <View className="mt-3 flex-row items-center border border-gray-100 bg-gray-50 rounded-2xl px-4 h-14">
                    <TextInput
                      className="flex-1 text-sm text-gray-900 h-full font-bold"
                      placeholder="اكتب تخصص الطبيب..."
                      placeholderTextColor="#9CA3AF"
                      textAlign="right"
                      value={customSpecialty}
                      onChangeText={setCustomSpecialty}
                      editable={medications.length === 0}
                    />
                  </View>
                )}
              </View>
            </View>

            {/* Camera/Upload Area */}
            <View className="bg-white rounded-3xl p-5 shadow-sm border border-gray-50 mb-5">
              <View className="flex-row items-center gap-2 mb-4 justify-end">
                <Text className="text-sm font-extrabold text-gray-900">
                  صورة الدواء
                </Text>
                <ImageIcon size={18} color="#05997F" />
              </View>

              <View
                className={`w-full aspect-video bg-gray-50 border-2 border-dashed rounded-2xl items-center justify-center mb-5 overflow-hidden relative ${
                  validationErrors.image ? "border-red-500 bg-red-50/10" : "border-gray-200"
                }`}
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

              {validationErrors.image && (
                <Text className="text-red-500 text-xs font-bold text-right mb-4 -mt-3">
                  {validationErrors.image}
                </Text>
              )}

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

              {/* Medicine Name Field */}
              <View className="mt-5 border-t border-gray-100 pt-5">
                <Text className="text-sm font-extrabold text-gray-700 mb-3 text-right">
                  اسم الدواء (مطلوب)
                </Text>
                <View className="flex-row items-center border border-gray-100 bg-gray-50 rounded-2xl px-4 h-16">
                  <TextInput
                    className="flex-1 text-base text-gray-900 h-full font-bold"
                    placeholder="اكتب اسم الدواء..."
                    placeholderTextColor="#9CA3AF"
                    textAlign="right"
                    value={medicineName}
                    onChangeText={setMedicineName}
                  />
                </View>
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
                  السعر (اختياري)
                </Text>

                <View className="flex-row items-center border border-gray-100 bg-gray-50 rounded-2xl px-4 h-16">
                  <TextInput
                    className="flex-1 text-base text-gray-900 h-full pl-2 font-bold"
                    placeholder="مثال: 20"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="numeric"
                    textAlign="right"
                    value={price}
                    onChangeText={setPrice}
                  />
                </View>
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
                  className={`flex-1 ${isSending ? 'bg-pharmacist/70' : 'bg-pharmacist'} h-14 rounded-2xl flex-row items-center justify-center gap-2 shadow-xl shadow-pharmacist/20`}
                  onPress={handleSendPrescription}
                  activeOpacity={0.8}
                  disabled={isSending}
                >
                  {isSending ? (
                    <Text className="font-extrabold text-white text-base">جاري الإرسال...</Text>
                  ) : (
                    <>
                      <CheckCircle size={20} color="#FFFFFF" strokeWidth={2.5} />
                      <Text className="font-extrabold text-white text-base">إنهاء وإرسال الوصفة</Text>
                    </>
                  )}
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
        animationType="slide"
        onRequestClose={() => setShowSpecialtyModal(false)}
      >
        <View className="flex-1 justify-end bg-black/40">
          <TouchableOpacity
            className="flex-1"
            activeOpacity={1}
            onPress={() => setShowSpecialtyModal(false)}
          />
          <View className="bg-white rounded-t-[3rem] shadow-2xl max-h-[75%]">
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
              <View className="w-10" />
            </View>

            <ScrollView 
              className="px-6 pt-4" 
              contentContainerStyle={{ paddingBottom: 40 }}
              showsVerticalScrollIndicator={false}
            >
              <View className="gap-3">
                {DOCTOR_SPECIALTIES.map((spec) => (
                  <TouchableOpacity
                    key={spec}
                    onPress={() => onSpecialtySelect(spec)}
                    className={`flex-row items-center justify-between p-5 rounded-2xl ${
                      selectedSpecialty === spec ? "bg-pharmacist/10 border border-pharmacist/20" : "bg-gray-50 border border-gray-100"
                    }`}
                    activeOpacity={0.7}
                  >
                    {selectedSpecialty === spec ? (
                      <CheckCircle size={22} color="#05997F" strokeWidth={2.5} />
                    ) : (
                      <View className="w-6" />
                    )}
                    <Text
                      className={`text-base font-extrabold ${
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
        </View>
      </Modal>
    </MobileShell>
  );
}