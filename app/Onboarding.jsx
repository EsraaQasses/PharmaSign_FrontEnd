import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import {
  Hand,
  Stethoscope,
  Eye,
  Shield,
  ChevronLeft,
} from "lucide-react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const slides = [
  {
    Icon: Hand,
    bgColor: "#0C6B58",
    title: "مرحباً بك في فارماساين",
    description:
      "تطبيق يساعد المرضى الصم وضعاف السمع على فهم تعليمات الأدوية من خلال لغة الإشارة",
  },
  {
    Icon: Stethoscope,
    bgColor: "#3B82F6",
    title: "الصيدلي يجهز وصفتك",
    description:
      "يقوم الصيدلي بتسجيل تعليمات الدواء صوتياً ثم تحويلها إلى لغة الإشارة لتسهيل الفهم",
  },
  {
    Icon: Eye,
    bgColor: "#F59E0B",
    title: "شاهد التعليمات بلغة الإشارة",
    description:
      "يمكنك مشاهدة فيديو لغة الإشارة لكل دواء مع نص مكتوب يوضح طريقة الاستخدام",
  },
  {
    Icon: Shield,
    bgColor: "#8B5CF6",
    title: "آمن وخاص",
    description:
      "بياناتك الطبية محمية ومشفرة بالكامل. لا يمكن لأحد الاطلاع عليها بدون إذنك",
  },
];

export default function Onboarding() {
  const [current, setCurrent] = useState(0);
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  const slide = slides[current];

  const animateTransition = (nextIndex) => {
    // Fade out + slide
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -30,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setCurrent(nextIndex);
      slideAnim.setValue(30);
      // Fade in + slide back
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const handleNext = () => {
    if (current < slides.length - 1) {
      animateTransition(current + 1);
    }
  };

  const handleSkip = () => {
    router.replace("/RoleSelect");
  };

  const handleStart = () => {
    router.replace("/RoleSelect");
  };

  return (
    <View className="flex-1 bg-background">
      {/* Slide Content */}
      <View className="flex-1 items-center justify-center px-8">
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateX: slideAnim }],
            alignItems: "center",
          }}
        >
          {/* Icon */}
          <View
            style={{ backgroundColor: slide.bgColor }}
            className="w-32 h-32 rounded-3xl items-center justify-center mb-8"
          >
            <slide.Icon size={64} color="#FFFFFF" />
          </View>

          {/* Title */}
          <Text className="text-2xl font-extrabold text-gray-800 mb-3 text-center leading-9">
            {slide.title}
          </Text>

          {/* Description */}
          <Text className="text-gray-500 text-sm leading-6 text-center max-w-[280px]">
            {slide.description}
          </Text>
        </Animated.View>
      </View>

      {/* Bottom Controls */}
      <View className="px-6 pb-10">
        {/* Dots */}
        <View className="flex-row items-center justify-center gap-2 mb-6">
          {slides.map((_, i) => (
            <View
              key={i}
              className={`h-2 rounded-full ${
                i === current
                  ? "w-8 bg-primary"
                  : "w-2 bg-gray-300"
              }`}
            />
          ))}
        </View>

        {/* Buttons */}
        {current < slides.length - 1 ? (
          <View className="flex-row items-center gap-3">
            <TouchableOpacity
              onPress={handleSkip}
              className="flex-1 py-3 items-center"
              activeOpacity={0.7}
            >
              <Text className="text-gray-500 text-base font-medium">
                تخطي
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleNext}
              className="flex-1 bg-primary py-3.5 rounded-full items-center flex-row justify-center gap-2"
              activeOpacity={0.8}
            >
              <Text className="text-white text-base font-bold">التالي</Text>
              <ChevronLeft size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            onPress={handleStart}
            className="bg-primary w-full py-4 rounded-full items-center"
            activeOpacity={0.8}
          >
            <Text className="text-white text-base font-bold">ابدأ الآن</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}