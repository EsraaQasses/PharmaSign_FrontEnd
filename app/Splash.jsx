import React, { useEffect, useRef } from "react";
import { View, Text, Animated } from "react-native";
import { useRouter } from "expo-router";
import { Hand } from "lucide-react-native";

export default function Splash() {
  const router = useRouter();
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const dotsOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animate icon
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 4,
      tension: 50,
      useNativeDriver: true,
    }).start();

    // Animate title
    Animated.timing(titleOpacity, {
      toValue: 1,
      duration: 500,
      delay: 500,
      useNativeDriver: true,
    }).start();

    // Animate subtitle
    Animated.timing(subtitleOpacity, {
      toValue: 1,
      duration: 500,
      delay: 800,
      useNativeDriver: true,
    }).start();

    // Animate tagline
    Animated.timing(taglineOpacity, {
      toValue: 1,
      duration: 500,
      delay: 1200,
      useNativeDriver: true,
    }).start();

    // Animate dots
    Animated.timing(dotsOpacity, {
      toValue: 1,
      duration: 500,
      delay: 1500,
      useNativeDriver: true,
    }).start();

    // Navigate to onboarding
    const timer = setTimeout(() => router.replace("/Onboarding"), 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View className="flex-1 bg-primary items-center justify-center">
      {/* Background circles */}
      <View className="absolute top-20 -right-20 w-64 h-64 rounded-full bg-white/5" />
      <View className="absolute bottom-32 -left-16 w-48 h-48 rounded-full bg-white/5" />

      {/* Icon */}
      <Animated.View
        style={{ transform: [{ scale: scaleAnim }] }}
        className="w-28 h-28 rounded-3xl bg-white/20 items-center justify-center mb-6"
      >
        <Hand size={56} color="#FFFFFF" />
      </Animated.View>

      {/* Title */}
      <Animated.View style={{ opacity: titleOpacity }}>
        <Text className="text-4xl font-extrabold text-white text-center">
          فارما<Text className="text-amber-300">ساين</Text>
        </Text>
      </Animated.View>

      {/* Subtitle */}
      <Animated.View style={{ opacity: subtitleOpacity }}>
        <Text className="text-white/70 text-sm font-medium mt-2 text-center">
          PharmaSign
        </Text>
      </Animated.View>

      {/* Tagline */}
      <Animated.View style={{ opacity: taglineOpacity }}>
        <Text className="text-white/50 text-xs mt-8 text-center">
          الدواء بلغة الإشارة
        </Text>
      </Animated.View>

      {/* Loading dots */}
      <Animated.View
        style={{ opacity: dotsOpacity }}
        className="absolute bottom-12 flex-row gap-1.5"
      >
        {[0, 1, 2].map((i) => (
          <View
            key={i}
            className="w-2 h-2 rounded-full bg-white/40"
          />
        ))}
      </Animated.View>
    </View>
  );
}