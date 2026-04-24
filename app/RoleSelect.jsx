import React, { useRef, useEffect } from "react";
import { View, Text, TouchableOpacity, Animated } from "react-native";
import { useRouter } from "expo-router";
import { User, Pill, Hand } from "lucide-react-native";

const roles = [
  {
    id: "patient",
    title: "مريض",
    description: "أريد مشاهدة تعليمات أدويتي بلغة الإشارة",
    Icon: User,
    bgColor: "#0C6B58",
    path: "/patient/PatientLogin",
  },
  {
    id: "pharmacist",
    title: "صيدلي",
    description: "أريد تجهيز الوصفات الطبية وإرسالها للمرضى",
    Icon: Pill,
    bgColor: "#3B82F6",
    path: "/pharmacist/PharmacistLogin",
  },
];

export default function RoleSelect() {
  const router = useRouter();

  // Animations
  const iconScale = useRef(new Animated.Value(0)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const card1Opacity = useRef(new Animated.Value(0)).current;
  const card1TransY = useRef(new Animated.Value(20)).current;
  const card2Opacity = useRef(new Animated.Value(0)).current;
  const card2TransY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.spring(iconScale, {
      toValue: 1,
      friction: 4,
      tension: 50,
      useNativeDriver: true,
    }).start();

    Animated.timing(titleOpacity, {
      toValue: 1,
      duration: 400,
      delay: 200,
      useNativeDriver: true,
    }).start();

    // Card 1
    Animated.parallel([
      Animated.timing(card1Opacity, {
        toValue: 1,
        duration: 400,
        delay: 300,
        useNativeDriver: true,
      }),
      Animated.timing(card1TransY, {
        toValue: 0,
        duration: 400,
        delay: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Card 2
    Animated.parallel([
      Animated.timing(card2Opacity, {
        toValue: 1,
        duration: 400,
        delay: 450,
        useNativeDriver: true,
      }),
      Animated.timing(card2TransY, {
        toValue: 0,
        duration: 400,
        delay: 450,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const cardAnims = [
    { opacity: card1Opacity, translateY: card1TransY },
    { opacity: card2Opacity, translateY: card2TransY },
  ];

  return (
    <View className="flex-1 bg-background">
      <View className="flex-1 items-center justify-center px-6 py-12">
        {/* Icon */}
        <Animated.View
          style={{ transform: [{ scale: iconScale }] }}
          className="w-20 h-20 rounded-2xl bg-primary/10 items-center justify-center mb-6"
        >
          <Hand size={40} color="#0C6B58" />
        </Animated.View>

        {/* Title */}
        <Animated.View style={{ opacity: titleOpacity }}>
          <Text className="text-2xl font-extrabold text-gray-800 mb-1 text-center">
            من أنت؟
          </Text>
          <Text className="text-gray-500 text-sm mb-10 text-center">
            اختر نوع حسابك للمتابعة
          </Text>
        </Animated.View>

        {/* Role Cards */}
        <View className="w-full gap-4">
          {roles.map((role, index) => (
            <Animated.View
              key={role.id}
              style={{
                opacity: cardAnims[index].opacity,
                transform: [{ translateY: cardAnims[index].translateY }],
              }}
            >
              <TouchableOpacity
                onPress={() => router.push(role.path)}
                className="flex-row items-center gap-4 p-5 bg-white rounded-2xl border border-gray-100"
                activeOpacity={0.7}
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.05,
                  shadowRadius: 3,
                  elevation: 2,
                }}
              >
                {/* Role Icon */}
                <View
                  style={{ backgroundColor: role.bgColor }}
                  className="w-14 h-14 rounded-xl items-center justify-center"
                >
                  <role.Icon size={28} color="#FFFFFF" />
                </View>

                {/* Role Info */}
                <View className="flex-1">
                  <Text className="text-lg font-bold text-gray-800">
                    {role.title}
                  </Text>
                  <Text className="text-xs text-gray-500 mt-0.5">
                    {role.description}
                  </Text>
                </View>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      </View>

      {/* Footer */}
      <View className="px-6 pb-8 items-center">
        <Text className="text-xs text-gray-400 text-center">
          بالمتابعة أنت توافق على{" "}
          <Text className="text-primary underline">سياسة الخصوصية</Text> و{" "}
          <Text className="text-primary underline">شروط الاستخدام</Text>
        </Text>
      </View>
    </View>
  );
}