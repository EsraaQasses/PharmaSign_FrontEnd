import React, { useEffect, useRef } from "react";
import { View, Text, Animated } from "react-native";
import { useRouter } from "expo-router";
import { Hand } from "lucide-react-native";
import MobileShell from "@/components/mobile/MobileShell";
import LogoCard from "@/components/mobile/LogoCard";

export default function Splash() {
  const router = useRouter();
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const dotsOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // ... logic remains same
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 4,
      tension: 50,
      useNativeDriver: true,
    }).start();

    Animated.timing(titleOpacity, {
      toValue: 1,
      duration: 500,
      delay: 500,
      useNativeDriver: true,
    }).start();

    Animated.timing(subtitleOpacity, {
      toValue: 1,
      duration: 500,
      delay: 800,
      useNativeDriver: true,
    }).start();

    Animated.timing(taglineOpacity, {
      toValue: 1,
      duration: 500,
      delay: 1200,
      useNativeDriver: true,
    }).start();

    Animated.timing(dotsOpacity, {
      toValue: 1,
      duration: 500,
      delay: 1500,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => router.replace("/Onboarding"), 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <MobileShell className="bg-primary" edges={["top", "bottom", "left", "right"]}>
      <View className="flex-1 items-center justify-center">
        {/* Background circles */}
        <View className="absolute top-20 -right-20 w-64 h-64 rounded-full bg-white/5" />
        <View className="absolute bottom-32 -left-16 w-48 h-48 rounded-full bg-white/5" />

        {/* Icon */}
        <Animated.View
          style={{ transform: [{ scale: scaleAnim }], opacity: titleOpacity }}
          className="items-center justify-center mb-2"
        >
          <LogoCard size={170} borderRadius={40} padding={20} />
        </Animated.View>

        {/* Tagline */}
        <Animated.View style={{ opacity: taglineOpacity }}>
          <Text className="text-white/50 text-xs mt-8 text-center font-bold">
            الدواء بلغة الإشارة
          </Text>
        </Animated.View>

        {/* Loading dots */}
        <Animated.View
          style={{ opacity: dotsOpacity }}
          className="absolute bottom-8 flex-row gap-1.5"
        >
          {[0, 1, 2].map((i) => (
            <View
              key={i}
              className="w-2 h-2 rounded-full bg-white/40"
            />
          ))}
        </Animated.View>
      </View>
    </MobileShell>
  );
}