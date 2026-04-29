import { Stack } from "expo-router";

/**
 * Patient section layout.
 * All patient screens are rendered within this Stack navigator.
 */
export default function PatientLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "none",
        contentStyle: { backgroundColor: "#F0F4F4" },
      }}
    />
  );
}
