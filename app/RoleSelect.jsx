import LogoCard from "@/components/mobile/LogoCard";
import { useRouter } from "expo-router";
import { Pill, User, Shield, X, FileText } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Text, TouchableOpacity, View, Modal, ScrollView } from "react-native";

const roles = [
  {
    id: "patient",
    title: "مريض",
    description: "أريد مشاهدة تعليمات أدويتي بلغة الإشارة",
    Icon: User,
    bgColor: "#022451",
    path: "/patient/PatientLogin",
  },
  {
    id: "pharmacist",
    title: "صيدلي",
    description: "أريد تجهيز الوصفات الطبية وإرسالها للمرضى",
    Icon: Pill,
    bgColor: "#05997F",
    path: "/pharmacist/PharmacistLogin",
  },
];

export default function RoleSelect() {
  const router = useRouter();
  const [activeLegalModal, setActiveLegalModal] = useState(null);

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
          className="mb-6"
        >
          <LogoCard size={60} borderRadius={24} padding={12} />
        </Animated.View>

        {/* Title */}
        <Animated.View style={{ opacity: titleOpacity }}>
          <Text className="text-2xl font-extrabold text-gray-800 mb-1 text-center">
            من أنت؟
          </Text>
          <Text className="text-gray-500 text-sm mb-10 text-center font-medium">
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
        <Text className="text-xs text-gray-400 text-center font-medium">
          بالمتابعة أنت توافق على{" "}
          <TouchableOpacity 
            onPress={() => setActiveLegalModal("privacy")}
            activeOpacity={0.7}
            style={{ marginBottom: -3 }}
          >
            <Text className="text-primary underline font-bold">سياسة الخصوصية</Text>
          </TouchableOpacity>{" "}
          و{" "}
          <TouchableOpacity 
            onPress={() => setActiveLegalModal("terms")}
            activeOpacity={0.7}
            style={{ marginBottom: -3 }}
          >
            <Text className="text-primary underline font-bold">شروط الاستخدام</Text>
          </TouchableOpacity>
        </Text>
      </View>

      {/* Legal Modal */}
      <Modal
        visible={!!activeLegalModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setActiveLegalModal(null)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-[2.5rem] h-[80%] shadow-2xl">
            {/* Header */}
            <View className="px-6 pt-8 pb-4 flex-row items-center justify-between border-b border-gray-50">
              <TouchableOpacity 
                onPress={() => setActiveLegalModal(null)}
                className="w-10 h-10 items-center justify-center bg-gray-50 rounded-full"
              >
                <X size={20} color="#9CA3AF" />
              </TouchableOpacity>
              <Text className="text-lg font-extrabold text-gray-900">
                {activeLegalModal === "privacy" ? "سياسة الخصوصية" : "شروط الاستخدام"}
              </Text>
              <View className="w-10" />
            </View>

            <ScrollView 
              className="flex-1 px-6 pt-6"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 40 }}
            >
              {activeLegalModal === "privacy" ? (
                <View>
                  <Text className="text-base text-gray-600 font-bold leading-7 text-right mb-8">
                    نحن في PharmaSign نلتزم بحماية خصوصيتك وبياناتك الطبية بما يتوافق مع معايير الأمان المعتمدة.
                  </Text>

                  {[
                    { title: "جمع البيانات", content: "نجمع البيانات الأساسية اللازمة لتقديم الخدمة فقط، وتشمل الاسم ورقم الجوال والمعلومات الطبية المرتبطة بالوصفات المصروفة." },
                    { title: "استخدام البيانات", content: "تُستخدم البيانات لتمكين الصيدلي من صرف الوصفة، وتمكين المريض من عرض تعليمات الدواء بطريقة واضحة ومدعومة بلغة الإشارة." },
                    { title: "حماية البيانات", content: "يتم التعامل مع البيانات بسرية، ولا يتم إتاحتها إلا للأطراف المصرح لها ضمن نطاق تقديم الخدمة." },
                    { title: "مشاركة البيانات", content: "لا تتم مشاركة بياناتك مع أي جهة غير مصرح لها، ولا تُستخدم البيانات لأغراض تجارية خارج نطاق خدمة PharmaSign." }
                  ].map((section, idx) => (
                    <View key={idx} className="mb-6 items-end">
                      <View className="flex-row items-center gap-2 mb-2">
                        <Text className="text-lg font-extrabold text-gray-900 text-right">{section.title}</Text>
                        <View className="w-2 h-6 bg-primary rounded-full" />
                      </View>
                      <Text className="text-sm text-gray-500 font-medium leading-6 text-right">
                        {section.content}
                      </Text>
                    </View>
                  ))}
                </View>
              ) : (
                <View>
                  <Text className="text-base text-gray-600 font-bold leading-7 text-right mb-8">
                    باستخدامك لتطبيق PharmaSign، فإنك توافق على الالتزام بشروط الاستخدام التالية.
                  </Text>

                  {[
                    { title: "استخدام الخدمة", content: "يُستخدم التطبيق لعرض وإدارة الوصفات الطبية وتقديم تعليمات الدواء بطريقة مبسطة ومدعومة بلغة الإشارة." },
                    { title: "مسؤولية المستخدم", content: "يلتزم المستخدم بإدخال بيانات صحيحة وعدم إساءة استخدام التطبيق أو محاولة الوصول إلى بيانات لا يملك صلاحية الوصول إليها." },
                    { title: "دور الصيدلي", content: "يقوم الصيدلي بإدخال معلومات الوصفة والتعليمات الدوائية بدقة وفقاً للوصفة الطبية المعتمدة." },
                    { title: "حدود الخدمة", content: "لا يُعتبر التطبيق بديلاً عن الاستشارة الطبية المباشرة، ويجب الرجوع إلى الطبيب أو الصيدلي عند وجود أي استفسار متعلق بالدواء." },
                    { title: "القبول", content: "استمرار استخدام التطبيق يعني موافقتك على هذه الشروط." }
                  ].map((section, idx) => (
                    <View key={idx} className="mb-6 items-end">
                      <View className="flex-row items-center gap-2 mb-2">
                        <Text className="text-lg font-extrabold text-gray-900 text-right">{section.title}</Text>
                        <View className="w-2 h-6 bg-secondary rounded-full" />
                      </View>
                      <Text className="text-sm text-gray-500 font-medium leading-6 text-right">
                        {section.content}
                      </Text>
                    </View>
                  ))}
                </View>
              )}

              <TouchableOpacity
                onPress={() => setActiveLegalModal(null)}
                className="mt-6 bg-gray-900 py-4 rounded-2xl items-center"
                activeOpacity={0.8}
              >
                <Text className="text-white font-extrabold text-base">إغلاق</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}