import React from "react";
import { View, Text } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/lib/AuthContext";

/**
 * ProtectedRoute — wraps screens that require authentication.
 *
 * Checks if the user is authenticated and has the correct role.
 * Redirects to login/role selection if not.
 */
export default function ProtectedRoute({ children, requiredRole }) {
  const { isAuthenticated, userRole, isLoadingAuth } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (isLoadingAuth) return;

    if (!isAuthenticated) {
      router.replace("/RoleSelect");
      return;
    }

    if (requiredRole && userRole !== requiredRole) {
      router.replace("/RoleSelect");
    }
  }, [isAuthenticated, userRole, isLoadingAuth]);

  if (isLoadingAuth) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Text className="text-gray-500">جاري التحميل...</Text>
      </View>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (requiredRole && userRole !== requiredRole) {
    return null;
  }

  return <>{children}</>;
}
