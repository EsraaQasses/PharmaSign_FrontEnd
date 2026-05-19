import React from "react";
import { View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { MapPin } from "lucide-react-native";

export default function PatientMap({ region, pharmacies, selectedId, onMarkerPress }) {
  return (
    <MapView
      initialRegion={region}
      className="w-full h-full"
      showsUserLocation
      showsMyLocationButton={false}
    >
      {pharmacies.filter(p => p.lat != null && p.lng != null && !isNaN(p.lat) && !isNaN(p.lng)).map((p) => (
        <Marker
          key={p.id}
          coordinate={{ latitude: p.lat, longitude: p.lng }}
          title={p.name}
          onPress={() => onMarkerPress(p)}
        >
          <View className="items-center">
             <View className={`bg-white p-1 rounded-full shadow-lg border ${selectedId === p.id ? 'border-patient border-2' : 'border-white'}`}>
              <View className={`w-8 h-8 rounded-full items-center justify-center ${p.hasSignService ? 'bg-emerald-500' : 'bg-patient'}`}>
                <MapPin size={16} color="#FFFFFF" strokeWidth={2.5} />
              </View>
            </View>
          </View>
        </Marker>
      ))}
    </MapView>
  );
}
