import MobileShell from "@/components/mobile/MobileShell";
import HeaderBackButton from "@/components/mobile/HeaderBackButton";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  AlertTriangle,
  CheckCircle2,
  Cpu,
  Hand,
  XCircle,
} from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { tokenStorage } from "@/utils/tokenStorage";
import { API_BASE_URL } from "@/api/client";

// ─── Step state constants ────────────────────────────────────────────────────
const STEP = {
  IDLE: "idle",
  GLOSS: "gloss",       // waiting for generate-sign response (gloss phase)
  POSE: "pose",         // gloss ok, pose in progress (shown optimistically)
  SUCCESS: "success",   // both gloss and pose succeeded
  POSE_WARN: "pose_warn", // gloss succeeded but pose failed
  FAILED: "failed",     // gloss failed or network error
};

/**
 * Calls POST /api/pharmacist/prescriptions/{id}/items/{item_id}/generate-sign/
 * with a 60-second timeout.
 */
async function callGenerateSign(prescriptionId, itemId, accessToken) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60_000);

  try {
    const response = await fetch(
      `${API_BASE_URL}/pharmacist/prescriptions/${prescriptionId}/items/${itemId}/generate-sign/`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        signal: controller.signal,
      }
    );
    clearTimeout(timeoutId);
    return response;
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}

export default function GeneratingSign() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { prescription_id, item_id } = params;

  const [step, setStep] = useState(STEP.IDLE);
  const [signResult, setSignResult] = useState(null); // full API response data
  const [errorMessage, setErrorMessage] = useState("");
  const didRun = useRef(false);

  // ─── Run generate-sign once on mount ───────────────────────────────────────
  useEffect(() => {
    if (didRun.current) return;
    didRun.current = true;
    runGenerateSign();
  }, []);

  const runGenerateSign = async () => {
    // Guard: need both IDs to call the backend
    if (!prescription_id || !item_id) {
      setErrorMessage("بيانات الجلسة مفقودة. يرجى البدء من جديد.");
      setStep(STEP.FAILED);
      return;
    }

    setStep(STEP.GLOSS);

    try {
      const { access } = await tokenStorage.getTokens();

      const response = await callGenerateSign(prescription_id, item_id, access);

      // ── Parse body ────────────────────────────────────────────────────────
      let data = {};
      try {
        data = await response.json();
      } catch (_) {
        // empty body — treat as unknown error
      }

      // ── HTTP 502 → pose_generation_failed ─────────────────────────────────
      if (response.status === 502) {
        const errCode = data?.error_code || data?.code || "";
        if (errCode === "pose_generation_failed") {
          // Gloss succeeded (supporting_text present) but pose failed
          setSignResult(data);
          setStep(STEP.POSE_WARN);
          return;
        }
        // Generic 502 — treat as full failure
        setErrorMessage(data?.detail || data?.error || "حدث خطأ في الاتصال بخادم الإشارة (502).");
        setStep(STEP.FAILED);
        return;
      }

      // ── Non-OK (other 4xx/5xx) ─────────────────────────────────────────────
      if (!response.ok) {
        setErrorMessage(data?.detail || data?.error || "فشل توليد الإشارة. يرجى المحاولة مجدداً.");
        setStep(STEP.FAILED);
        return;
      }

      // ── Success ────────────────────────────────────────────────────────────
      // Safely extract fields — all new pose fields are treated as nullable
      const {
        output_type,
        sign_status,
        supporting_text,
        // New nullable pose fields — accept but do NOT render pose_file_path
        pose_file_path: _posePath,   // server-side path only — ignored in UI
        pose_shape: _poseShape,
        ai_metadata: _aiMeta,
        pose_generated_at: _poseAt,
      } = data ?? {};

      setSignResult(data);

      // Detect gloss_and_pose output type
      const isGlossAndPose = output_type === "gloss_and_pose";

      if (sign_status === "failed") {
        // Gloss failed (backend explicitly says failed, possibly with supporting_text)
        if (supporting_text) {
          // Partial: have supporting_text but sign_status is failed → pose warn
          setStep(STEP.POSE_WARN);
        } else {
          setErrorMessage("فشل توليد الإشارة من الخادم.");
          setStep(STEP.FAILED);
        }
        return;
      }

      if (sign_status === "completed") {
        if (isGlossAndPose) {
          // Show pose step visually then resolve to SUCCESS
          setStep(STEP.POSE);
          setTimeout(() => setStep(STEP.SUCCESS), 1200);
        } else {
          setStep(STEP.SUCCESS);
        }
        return;
      }

      // Any other status — treat as success (processing / unknown)
      setStep(STEP.SUCCESS);

    } catch (err) {
      if (err?.name === "AbortError") {
        setErrorMessage("انتهت مهلة الاتصال (60 ثانية). يرجى التحقق من الاتصال والمحاولة مجدداً.");
      } else {
        setErrorMessage("تعذر الاتصال بالخادم. تأكد من الاتصال بالإنترنت.");
      }
      setStep(STEP.FAILED);
    }
  };

  // ─── Navigate back to NewPrescription after success/warn ──────────────────
  const handleContinue = () => {
    router.replace({
      pathname: "/pharmacist/NewPrescription",
      params: {
        ...params,
        keepDraft: "true",
      },
    });
  };

  // ─── Navigate back to VerifyText ──────────────────────────────────────────
  const handleBack = () => {
    router.replace({
      pathname: "/pharmacist/VerifyText",
      params: { ...params },
    });
  };

  // ──────────────────────────────────────────────────────────────────────────
  // Derived UI state helpers
  // ──────────────────────────────────────────────────────────────────────────
  const isLoading = step === STEP.IDLE || step === STEP.GLOSS || step === STEP.POSE;
  const isSuccess = step === STEP.SUCCESS;
  const isPoseWarn = step === STEP.POSE_WARN;
  const isFailed = step === STEP.FAILED;

  const glossDone = step === STEP.POSE || step === STEP.SUCCESS || step === STEP.POSE_WARN;
  const poseDone  = step === STEP.SUCCESS;
  const poseFail  = step === STEP.POSE_WARN;
  const poseInProgress = step === STEP.POSE;

  const supportingText = signResult?.supporting_text ?? null;

  // ──────────────────────────────────────────────────────────────────────────
  // Render
  // ──────────────────────────────────────────────────────────────────────────
  return (
    <MobileShell className="bg-pharmacist" edges={["top", "bottom", "left", "right"]}>
      {/* Rounded header overlay */}
      <View className="absolute top-0 left-0 right-0 h-1/4 bg-pharmacist rounded-b-[4rem] shadow-2xl shadow-pharmacist/40" />

      {/* Back button — only shown on terminal states */}
      {(isFailed || isPoseWarn) && (
        <HeaderBackButton
          onPress={handleBack}
          color="#05997F"
          floating
        />
      )}

      <View className="flex-1 items-center justify-center p-8">

        {/* ── Central icon / indicator ── */}
        <View className={`w-32 h-32 rounded-full items-center justify-center mb-10 border ${
          isSuccess  ? "bg-emerald-500/20 border-emerald-400/30" :
          isPoseWarn ? "bg-amber-400/20 border-amber-400/30" :
          isFailed   ? "bg-red-500/20 border-red-400/30" :
          "bg-white/20 border-white/20"
        }`}>
          <View className="absolute inset-0 items-center justify-center">
            {isLoading && <ActivityIndicator size="large" color="#FFFFFF" />}
          </View>

          {isLoading  && <Hand         size={48} color="#FFFFFF"  strokeWidth={2.5} />}
          {isSuccess  && <CheckCircle2 size={48} color="#6EE7B7"  strokeWidth={2.5} />}
          {isPoseWarn && <AlertTriangle size={48} color="#FCD34D"  strokeWidth={2.5} />}
          {isFailed   && <XCircle      size={48} color="#FCA5A5"  strokeWidth={2.5} />}
        </View>

        {/* ── Title ── */}
        <Text className="text-3xl font-extrabold text-white text-center mb-2">
          {isLoading  && "جاري إنشاء الإشارة"}
          {isSuccess  && "تم إنشاء الإشارة بنجاح"}
          {isPoseWarn && "تم إنشاء النص بجزئية"}
          {isFailed   && "فشل توليد الإشارة"}
        </Text>

        {/* ── Subtitle ── */}
        <Text className="text-base text-white/70 text-center mb-10 font-medium">
          {isLoading  && "نعمل الآن على تحويل النص إلى رسومات متحركة بلغة الإشارة الوصفية..."}
          {isSuccess  && "تم توليد إشارة لغة الصم بنجاح وهي جاهزة للمريض."}
          {isPoseWarn && "تم توليد الإشارة النصية ولكن فشل توليد الحركة"}
          {isFailed   && (errorMessage || "حدث خطأ أثناء توليد الإشارة.")}
        </Text>

        {/* ── Step tracker card ── */}
        <View className="w-full bg-white/10 rounded-3xl p-6 border border-white/10 mb-6">

          {/* Step 1: Gloss / Grammar */}
          <View className="flex-row items-center gap-4 justify-end mb-5">
            <Text className="text-sm font-bold text-white">تحليل القواعد النحوية للغة الإشارة</Text>
            <View className={`w-8 h-8 rounded-full items-center justify-center ${
              glossDone || isPoseWarn || isFailed
                ? (isFailed && !glossDone ? "bg-red-500/40" : "bg-emerald-500")
                : "bg-white/20"
            }`}>
              {isLoading && !glossDone
                ? <ActivityIndicator size="small" color="#FFFFFF" />
                : isFailed && !glossDone
                ? <XCircle size={16} color="#FFFFFF" />
                : <CheckCircle2 size={16} color="#FFFFFF" />
              }
            </View>
          </View>

          {/* Step 2: Pose / Movement */}
          <View className="flex-row items-center gap-4 justify-end mb-5">
            <Text className={`text-sm font-bold ${poseFail ? "text-amber-300" : "text-white"}`}>
              توليد حركات اليدين والوجه
            </Text>
            <View className={`w-8 h-8 rounded-full items-center justify-center ${
              poseDone     ? "bg-emerald-500" :
              poseFail     ? "bg-amber-400/60" :
              poseInProgress ? "bg-white/20" :
              isFailed     ? "bg-red-500/20" :
              "bg-white/20"
            }`}>
              {poseDone       && <CheckCircle2    size={16} color="#FFFFFF" />}
              {poseFail       && <AlertTriangle   size={16} color="#FCD34D" />}
              {poseInProgress && <ActivityIndicator size="small" color="#FFFFFF" />}
              {(isLoading && !poseInProgress && !poseDone && !poseFail) && null}
              {isFailed       && <XCircle size={16} color="#FCA5A5" />}
            </View>
          </View>

          {/* Step 3: Final merge */}
          <View className="flex-row items-center gap-4 justify-end">
            <Text className={`text-sm font-bold ${isSuccess ? "text-white" : "text-white/40"}`}>
              دمج الفيديو النهائي
            </Text>
            <View className={`w-8 h-8 rounded-full items-center justify-center ${
              isSuccess ? "bg-emerald-500" : "bg-white/10"
            }`}>
              {isSuccess && <CheckCircle2 size={16} color="#FFFFFF" />}
            </View>
          </View>
        </View>

        {/* ── Pose warning: show supporting_text if available ── */}
        {isPoseWarn && supportingText && (
          <View className="w-full bg-amber-400/10 border border-amber-400/30 rounded-2xl p-5 mb-6">
            <View className="flex-row items-center gap-2 justify-end mb-2">
              <Text className="text-sm font-extrabold text-amber-300">النص التوضيحي للإشارة</Text>
              <AlertTriangle size={16} color="#FCD34D" />
            </View>
            <Text className="text-sm text-white/80 text-right leading-relaxed font-medium">
              {supportingText}
            </Text>
          </View>
        )}

        {/* ── Success: show supporting_text if available ── */}
        {isSuccess && supportingText && (
          <View className="w-full bg-emerald-400/10 border border-emerald-400/20 rounded-2xl p-5 mb-6">
            <View className="flex-row items-center gap-2 justify-end mb-2">
              <Text className="text-sm font-extrabold text-emerald-300">النص التوضيحي للإشارة</Text>
              <CheckCircle2 size={16} color="#6EE7B7" />
            </View>
            <Text className="text-sm text-white/80 text-right leading-relaxed font-medium">
              {supportingText}
            </Text>
          </View>
        )}

        {/* ── Action buttons for terminal states ── */}
        {isSuccess && (
          <TouchableOpacity
            onPress={handleContinue}
            activeOpacity={0.85}
            className="w-full bg-white/20 border border-white/20 rounded-2xl h-14 items-center justify-center mb-4"
          >
            <Text className="text-white font-extrabold text-lg">متابعة إضافة الأدوية</Text>
          </TouchableOpacity>
        )}

        {isPoseWarn && (
          <View className="w-full gap-3">
            <TouchableOpacity
              onPress={handleContinue}
              activeOpacity={0.85}
              className="w-full bg-amber-400/20 border border-amber-400/30 rounded-2xl h-14 items-center justify-center"
            >
              <Text className="text-amber-200 font-extrabold text-lg">متابعة رغم ذلك</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleBack}
              activeOpacity={0.85}
              className="w-full bg-white/10 border border-white/10 rounded-2xl h-14 items-center justify-center"
            >
              <Text className="text-white/70 font-bold text-base">العودة لمراجعة النص</Text>
            </TouchableOpacity>
          </View>
        )}

        {isFailed && (
          <View className="w-full gap-3">
            <TouchableOpacity
              onPress={runGenerateSign}
              activeOpacity={0.85}
              className="w-full bg-white/20 border border-white/20 rounded-2xl h-14 items-center justify-center"
            >
              <Text className="text-white font-extrabold text-lg">إعادة المحاولة</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleBack}
              activeOpacity={0.85}
              className="w-full bg-white/10 border border-white/10 rounded-2xl h-14 items-center justify-center"
            >
              <Text className="text-white/70 font-bold text-base">العودة لمراجعة النص</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ── Engine badge ── */}
        <View className="mt-8 flex-row items-center gap-2 bg-black/20 px-6 py-3 rounded-2xl">
          <Cpu size={18} color="#FFFFFF" opacity={0.5} />
          <Text className="text-[10px] text-white/50 font-bold uppercase tracking-widest">
            AI Engine • Sigma-V2 Processing
          </Text>
        </View>

      </View>
    </MobileShell>
  );
}
