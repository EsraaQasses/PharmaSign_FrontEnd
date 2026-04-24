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
        animation: "slide_from_right",
        contentStyle: { backgroundColor: "#F8FAFB" },
      }}
    />
  );
}
