import React, { createContext, useState, useContext, useEffect } from "react";
import { useRouter, useSegments } from "expo-router";
import { MOCK_PATIENTS, MOCK_PHARMACIST } from "@/lib/mockData";
import { authApi } from "@/api/authApi";
import { profileApi } from "@/api/profileApi";
import { tokenStorage } from "@/utils/tokenStorage";
const AuthContext = createContext();

/**
 * Mock AuthProvider for development.
 *
 * Simulates authentication without a real backend.
 * Provides user/role state and login/logout functions.
 *
 * TODO: Replace mock logic with real @base44/sdk or backend API calls.
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [userRole, setUserRole] = useState(null); // 'patient' | 'pharmacist' | null

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const { access } = await tokenStorage.getTokens();
      if (!access) {
        setAuthChecked(true);
        return;
      }

      // Fetch user profile to verify token and get fresh data
      const result = await profileApi.getMe();
      
      if (result.success) {
        setUser(result.data.user);
        setUserRole(result.data.user.role);
        setIsAuthenticated(true);
      } else if (result.status === 401) {
        // Token is invalid/expired - logout
        await logout();
      }
      // Note: If result.status === 0 (network error), we keep current state (usually null user) 
      // but don't clear tokens to allow offline/later retry.
    } catch (error) {
      console.error("Auth check failed:", error);
    } finally {
      setAuthChecked(true);
    }
  };

  /**
   * Mock login for patient.
   * In production, this would call the auth API.
   */
  const loginAsPatient = async (phone, password) => {
    setIsLoadingAuth(true);
    setAuthError(null);
    try {
      const result = await authApi.login(phone, password);
      setIsLoadingAuth(false);

      if (result.success) {
        if (result.data?.user?.role !== "patient") {
           return { success: false, error: "هذا الحساب ليس لمريض", status: 400 };
        }
        await tokenStorage.saveTokens(result.data.access, result.data.refresh);
        setUser(result.data.user);
        setUserRole("patient");
        setIsAuthenticated(true);
        return { success: true, user: result.data.user };
      } else {
        return { success: false, ...result };
      }
    } catch (error) {
      setIsLoadingAuth(false);
      return { success: false, message: "فشل الاتصال بالخادم", status: 0 };
    }
  };

  /**
   * Mock login for pharmacist.
   */
  const loginAsPharmacist = async (phone, password) => {
    setIsLoadingAuth(true);
    setAuthError(null);
    try {
      const result = await authApi.login(phone, password);
      setIsLoadingAuth(false);

      if (result.success) {
        if (result.data?.user?.role !== "pharmacist") {
           return { success: false, error: "هذا الحساب ليس لصيدلي", status: 400 };
        }
        await tokenStorage.saveTokens(result.data.access, result.data.refresh);
        setUser(result.data.user);
        setUserRole("pharmacist");
        setIsAuthenticated(true);
        return { success: true, user: result.data.user };
      } else {
        return { success: false, ...result };
      }
    } catch (error) {
      setIsLoadingAuth(false);
      return { success: false, message: "فشل الاتصال بالخادم", status: 0 };
    }
  };

  /**
   * Mock registration for patient.
   */
  const registerPatient = async (userData) => {
    setIsLoadingAuth(true);
    setAuthError(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockUser = {
        id: `p_${Date.now()}`,
        role: "patient",
        ...userData,
      };

      setUser(mockUser);
      setUserRole("patient");
      setIsAuthenticated(true);
      setIsLoadingAuth(false);
      return { success: true, user: mockUser };
    } catch (error) {
      setAuthError({ type: "register_failed", message: "فشل التسجيل" });
      setIsLoadingAuth(false);
      return { success: false, error };
    }
  };

  /**
   * Mock registration for pharmacist.
   */
  const registerPharmacist = async (userData) => {
    setIsLoadingAuth(true);
    setAuthError(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockUser = {
        id: `ph_${Date.now()}`,
        role: "pharmacist",
        ...userData,
      };

      setUser(mockUser);
      setUserRole("pharmacist");
      setIsAuthenticated(true);
      setIsLoadingAuth(false);
      return { success: true, user: mockUser };
    } catch (error) {
      setAuthError({ type: "register_failed", message: "فشل التسجيل" });
      setIsLoadingAuth(false);
      return { success: false, error };
    }
  };

  /**
   * Logout — clears user state.
   * In production, would also clear tokens from SecureStore.
   */
  const logout = async () => {
    await tokenStorage.clearTokens();
    setUser(null);
    setIsAuthenticated(false);
    setUserRole(null);
    setAuthError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoadingAuth,
        authError,
        authChecked,
        userRole,
        loginAsPatient,
        loginAsPharmacist,
        registerPatient,
        registerPharmacist,
        logout,
        setAuthError,
        setUser, // Added to allow screens to update profile state
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
