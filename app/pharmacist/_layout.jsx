import { Stack } from "expo-router";

/**
 * Pharmacist section layout.
 * All pharmacist screens are rendered within this Stack navigator.
 */
export default function PharmacistLayout() {
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
