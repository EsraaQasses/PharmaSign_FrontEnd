import { useEffect } from "react";
import { useRouter } from "expo-router";
import { View, ActivityIndicator } from "react-native";
import { useAuth } from "@/lib/AuthContext";

/**
 * App entry point.
 * Redirects to the appropriate screen based on auth state.
 */
export default function Index() {
  const router = useRouter();
  const { isAuthenticated, userRole, authChecked } = useAuth();

  useEffect(() => {
    // Wait until the authentication check is complete before deciding where to go.
    if (!authChecked) return;

    if (isAuthenticated && userRole) {
      // Navigate to role-specific home
      if (userRole === "patient") {
        router.replace("/patient/PatientHome");
      } else if (userRole === "pharmacist") {
        router.replace("/pharmacist/PharmacistHome");
      }
    } else if (isAuthenticated === false || (isAuthenticated && !userRole)) {
      // Not authenticated or role unknown — go to splash/onboarding
      router.replace("/Splash");
    }
  }, [authChecked, isAuthenticated, userRole]);

  return (
    <View className="flex-1 items-center justify-center bg-background">
      <ActivityIndicator size="large" color="#0C6B58" />
    </View>
  );
}
