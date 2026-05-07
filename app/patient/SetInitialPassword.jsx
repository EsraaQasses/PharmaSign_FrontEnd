import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, TextInput, KeyboardAvoidingView, Platform, Keyboard } from "react-native";
import { useRouter } from "expo-router";
import { Lock, ShieldCheck, Hash, Smile, ChevronLeft, CheckCircle2, AlertCircle, X } from "lucide-react-native";
import MobileShell from "@/components/mobile/MobileShell";
import PageHeader from "@/components/mobile/PageHeader";

const EMOJI_PALETTE = ["😀", "😍", "⭐", "❤️", "🌙", "☀️", "🐱", "🐶", "🍎", "🌸"];

export default function SetInitialPassword() {
  const router = useRouter();
  const [mode, setMode] = useState("text"); // 'text', 'pin', 'emoji'
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Text Password State
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // PIN State
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");

  // Emoji State
  const [emojiSeq, setEmojiSeq] = useState([]);

  const validate = () => {
    setError("");
    setMessage("");

    if (mode === "text") {
      if (!password.trim() || !confirmPassword.trim()) {
        setError("يرجى إدخال كلمة المرور وتأكيدها");
        return false;
      }
      if (password.length < 6) {
        setError("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
        return false;
      }
      if (password !== confirmPassword) {
        setError("كلمتا المرور غير متطابقتين");
        return false;
      }
    } else if (mode === "pin") {
      if (!pin || !confirmPin) {
        setError("يرجى إدخال الرمز الرقمي وتأكيده");
        return false;
      }
      if (pin.length < 4) {
        setError("الرمز يجب أن يكون 4 أرقام على الأقل");
        return false;
      }
      if (pin !== confirmPin) {
        setError("الرموز غير متطابقة");
        return false;
      }
    } else if (mode === "emoji") {
      if (emojiSeq.length < 4) {
        setError("يرجى اختيار 4 سمايلات على الأقل");
        return false;
      }
    }
    return true;
  };

  const handleSave = () => {
    if (validate()) {
      // TODO: Implement backend call to save password/PIN/emoji
      // Endpoint: POST /auth/patient/set-initial-password/
      // Payload: { mode, password/pin/emoji_seq }
      setMessage("سيتم تفعيل حفظ رمز الحماية بعد تحديث الخادم.");
    }
  };

  const handleEmojiPress = (emoji) => {
    if (emojiSeq.length < 8) {
      setEmojiSeq([...emojiSeq, emoji]);
    }
  };

  return (
    <MobileShell className="bg-patient" edges={["top", "left", "right"]}>
      <PageHeader title="حماية الحساب" showBackButton={false} role="patient" />

      <KeyboardAvoidingView 
        className="flex-1 bg-background rounded-t-[2.5rem] -mt-4 overflow-hidden"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 32, paddingBottom: 60 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="items-center mb-8">
            <View className="w-16 h-16 bg-patient/10 rounded-2xl items-center justify-center mb-6">
              <ShieldCheck size={32} color="#022451" />
            </View>
            <Text className="text-2xl font-extrabold text-gray-900 mb-2 text-right w-full">
              إعداد رمز حماية الحساب
            </Text>
            <Text className="text-sm text-gray-500 text-right leading-relaxed">
              بعد تسجيل الدخول عبر QR، يمكنك لاحقاً إنشاء رمز خاص لحماية حسابك وخصوصيتك.
            </Text>
          </View>

          {/* Mode Selector */}
          <View className="flex-row gap-3 mb-8">
            <TouchableOpacity 
              onPress={() => { setMode("emoji"); setError(""); setMessage(""); }}
              className={`flex-1 py-4 rounded-2xl border items-center justify-center gap-2 ${
                mode === "emoji" ? "bg-patient border-patient shadow-md shadow-patient/20" : "bg-white border-gray-100"
              }`}
            >
              <Smile size={20} color={mode === "emoji" ? "#FFFFFF" : "#9CA3AF"} />
              <Text className={`text-[10px] font-bold ${mode === "emoji" ? "text-white" : "text-gray-400"}`}>سمايلات</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => { setMode("pin"); setError(""); setMessage(""); }}
              className={`flex-1 py-4 rounded-2xl border items-center justify-center gap-2 ${
                mode === "pin" ? "bg-patient border-patient shadow-md shadow-patient/20" : "bg-white border-gray-100"
              }`}
            >
              <Hash size={20} color={mode === "pin" ? "#FFFFFF" : "#9CA3AF"} />
              <Text className={`text-[10px] font-bold ${mode === "pin" ? "text-white" : "text-gray-400"}`}>رمز رقمي</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => { setMode("text"); setError(""); setMessage(""); }}
              className={`flex-1 py-4 rounded-2xl border items-center justify-center gap-2 ${
                mode === "text" ? "bg-patient border-patient shadow-md shadow-patient/20" : "bg-white border-gray-100"
              }`}
            >
              <Lock size={20} color={mode === "text" ? "#FFFFFF" : "#9CA3AF"} />
              <Text className={`text-[10px] font-bold ${mode === "text" ? "text-white" : "text-gray-400"}`}>كلمة مرور</Text>
            </TouchableOpacity>
          </View>

          {error ? (
            <View className="bg-red-50 border border-red-100 rounded-2xl p-4 mb-6 flex-row items-center justify-end gap-3">
              <Text className="text-red-600 font-bold flex-1 text-right text-xs">{error}</Text>
              <AlertCircle size={18} color="#DC2626" />
            </View>
          ) : null}

          {message ? (
            <View className="bg-amber-50 border border-amber-100 rounded-2xl p-4 mb-6 flex-row items-center justify-end gap-3">
              <Text className="text-amber-700 font-bold flex-1 text-right text-xs">{message}</Text>
              <CheckCircle2 size={18} color="#D97706" />
            </View>
          ) : null}

          {/* Form Content */}
          <View className="bg-white rounded-3xl p-6 border border-gray-50 shadow-sm">
            {mode === "text" && (
              <View className="gap-4">
                <View>
                  <Text className="text-xs font-bold text-gray-700 mb-2 text-right">كلمة المرور الجديدة</Text>
                  <View className="bg-gray-50 rounded-2xl border border-gray-100 px-4">
                    <TextInput
                      placeholder="أدخل كلمة المرور"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry
                      textAlign="right"
                      className="py-3 font-bold text-gray-900"
                    />
                  </View>
                </View>
                <View>
                  <Text className="text-xs font-bold text-gray-700 mb-2 text-right">تأكيد كلمة المرور</Text>
                  <View className="bg-gray-50 rounded-2xl border border-gray-100 px-4">
                    <TextInput
                      placeholder="أعد إدخال كلمة المرور"
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      secureTextEntry
                      textAlign="right"
                      className="py-3 font-bold text-gray-900"
                    />
                  </View>
                </View>
              </View>
            )}

            {mode === "pin" && (
              <View className="gap-4">
                <View>
                  <Text className="text-xs font-bold text-gray-700 mb-2 text-right">الرمز الرقمي الجديد</Text>
                  <View className="bg-gray-50 rounded-2xl border border-gray-100 px-4">
                    <TextInput
                      placeholder="XXXX"
                      value={pin}
                      onChangeText={setPin}
                      keyboardType="number-pad"
                      maxLength={8}
                      textAlign="center"
                      secureTextEntry
                      className="py-3 font-bold text-gray-900 text-lg tracking-widest"
                    />
                  </View>
                </View>
                <View>
                  <Text className="text-xs font-bold text-gray-700 mb-2 text-right">تأكيد الرمز</Text>
                  <View className="bg-gray-50 rounded-2xl border border-gray-100 px-4">
                    <TextInput
                      placeholder="XXXX"
                      value={confirmPin}
                      onChangeText={setConfirmPin}
                      keyboardType="number-pad"
                      maxLength={8}
                      textAlign="center"
                      secureTextEntry
                      className="py-3 font-bold text-gray-900 text-lg tracking-widest"
                    />
                  </View>
                </View>
              </View>
            )}

            {mode === "emoji" && (
              <View className="items-center">
                <Text className="text-xs font-bold text-gray-700 mb-4 text-right w-full">اختر تسلسل السمايلات الخاص بك</Text>
                
                {/* Sequence Display */}
                <View className="w-full h-16 bg-gray-50 rounded-2xl border border-gray-100 flex-row items-center justify-center gap-2 mb-6">
                  {emojiSeq.length === 0 ? (
                    <Text className="text-gray-300 font-bold">التسلسل المختار</Text>
                  ) : (
                    emojiSeq.map((e, i) => (
                      <View key={i} className="w-10 h-10 bg-white rounded-lg items-center justify-center shadow-sm">
                        <Text className="text-xl">{e}</Text>
                      </View>
                    ))
                  )}
                  {emojiSeq.length > 0 && (
                    <TouchableOpacity 
                      onPress={() => setEmojiSeq([])}
                      className="absolute left-3 w-8 h-8 bg-red-50 rounded-full items-center justify-center"
                    >
                      <X size={14} color="#DC2626" />
                    </TouchableOpacity>
                  )}
                </View>

                {/* Emoji Grid */}
                <View className="flex-row flex-wrap justify-center gap-3">
                  {EMOJI_PALETTE.map((e, i) => (
                    <TouchableOpacity 
                      key={i}
                      onPress={() => handleEmojiPress(e)}
                      className="w-12 h-12 bg-gray-50 rounded-2xl items-center justify-center border border-gray-100"
                    >
                      <Text className="text-2xl">{e}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
          </View>

          <View className="mt-8 gap-4">
            <TouchableOpacity 
              onPress={handleSave}
              activeOpacity={0.8}
              className="w-full bg-patient py-4 rounded-2xl items-center justify-center shadow-lg shadow-patient/30"
            >
              <Text className="text-white font-extrabold text-base">حفظ رمز الحماية</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => router.replace("/patient/PatientHome")}
              activeOpacity={0.8}
              className="w-full py-4 rounded-2xl border border-gray-200 items-center justify-center"
            >
              <Text className="text-gray-500 font-bold text-base">تخطي حالياً</Text>
            </TouchableOpacity>
          </View>

          {/* Privacy Note */}
          <View className="mt-12 items-center">
            <View className="bg-gray-50 px-5 py-3 rounded-2xl flex-row items-center gap-3 border border-gray-100">
              <Lock size={16} color="#9CA3AF" />
              <Text className="text-[10px] font-bold text-gray-500">لا تشارك رمز الحماية الخاص بك مع أي شخص.</Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </MobileShell>
  );
}
