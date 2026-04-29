import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { MapPin } from "lucide-react-native";

export default function PatientMap({ pharmacies, selectedId, onMarkerPress }) {
  return (
    <>
      <Image
        source={{
          uri: "https://images.unsplash.com/photo-1548345680-f5475ee5df84?q=80&w=1200&auto=format&fit=crop",
        }}
        className="w-full h-full"
        resizeMode="cover"
      />
      <View className="absolute inset-0 bg-black/5" />
      {pharmacies.map((p, idx) => (
        <TouchableOpacity 
          key={p.id}
          onPress={() => onMarkerPress(p)}
          className="absolute items-center"
          style={{ 
            top: `${20 + (idx * 15) + (Math.sin(idx) * 10)}%`, 
            right: `${15 + (idx * 18) % 60}%` 
          }}
        >
          <View className={`bg-white p-1 rounded-full shadow-2xl border ${selectedId === p.id ? 'border-patient border-2' : 'border-gray-100'}`}>
            <View className={`w-10 h-10 rounded-full items-center justify-center ${p.hasSignService ? 'bg-emerald-500' : 'bg-patient'}`}>
              <MapPin size={20} color="#FFFFFF" strokeWidth={2.5} />
            </View>
          </View>
          <View className="bg-white/95 px-3 py-1 rounded-lg border border-white shadow-xl mt-1.5">
             <Text className="text-[9px] font-extrabold text-gray-900">{p.name}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </>
  );
}
