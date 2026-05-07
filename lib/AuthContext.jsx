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

      if (result.success && result.data) {
        const { access, refresh, user: userData } = result.data;
        
        if (userData?.role !== "patient") {
           setIsLoadingAuth(false);
           return { success: false, error: "هذا الحساب ليس لمريض", status: 400 };
        }

        await tokenStorage.saveTokens(access, refresh);
        setUser(userData);
        setUserRole("patient");
        setIsAuthenticated(true);
        setIsLoadingAuth(false);
        return { success: true, user: userData };
      } else {
        setIsLoadingAuth(false);
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

      if (result.success && result.data) {
        const { access, refresh, user: userData } = result.data;

        if (userData?.role !== "pharmacist") {
           setIsLoadingAuth(false);
           return { success: false, error: "هذا الحساب ليس لصيدلي", status: 400 };
        }

        await tokenStorage.saveTokens(access, refresh);
        setUser(userData);
        setUserRole("pharmacist");
        setIsAuthenticated(true);
        setIsLoadingAuth(false);
        return { success: true, user: userData };
      } else {
        setIsLoadingAuth(false);
        return { success: false, ...result };
      }
    } catch (error) {
      setIsLoadingAuth(false);
      return { success: false, message: "فشل الاتصال بالخادم", status: 0 };
    }
  };

  /**
   * Patient QR Login.
   */
  const loginByQR = async (qrToken) => {
    setIsLoadingAuth(true);
    setAuthError(null);
    try {
      const result = await authApi.loginByQR(qrToken);
      setIsLoadingAuth(false);

      if (result.success && result.data) {
        const { access, refresh, user: userData } = result.data;
        
        await tokenStorage.saveTokens(access, refresh);
        setUser(userData);
        setUserRole("patient");
        setIsAuthenticated(true);
        setIsLoadingAuth(false);
        return { success: true, user: userData };
      } else {
        setIsLoadingAuth(false);
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
      const result = await authApi.registerPatient(userData);
      setIsLoadingAuth(false);

      if (result.success && result.data) {
        const { access, refresh, user: userDataResponse } = result.data;
        
        // Only auto-login if tokens are returned (usually after registration if approved immediately,
        // or if the backend design allows it).
        if (access && refresh) {
          await tokenStorage.saveTokens(access, refresh);
          setUser(userDataResponse);
          setUserRole("patient");
          setIsAuthenticated(true);
        }
        
        return { success: true, data: result.data };
      } else {
        return { success: false, ...result };
      }
    } catch (error) {
      console.error("Patient Registration Error:", error);
      setIsLoadingAuth(false);
      return { success: false, message: "فشل الاتصال بالخادم", status: 0 };
    }
  };

  /**
   * Mock registration for pharmacist.
   */
  const registerPharmacist = async (userData) => {
    setIsLoadingAuth(true);
    setAuthError(null);
    try {
      const result = await authApi.registerPharmacist(userData);
      setIsLoadingAuth(false);

      if (result.success && result.data) {
        const { access, refresh, user: userDataResponse } = result.data;

        // Note: For pharmacists, they usually require admin approval (approval_status: pending)
        // so we likely won't get tokens here.
        if (access && refresh) {
          await tokenStorage.saveTokens(access, refresh);
          setUser(userDataResponse);
          setUserRole("pharmacist");
          setIsAuthenticated(true);
        }

        return { success: true, data: result.data };
      } else {
        return { success: false, ...result };
      }
    } catch (error) {
      console.error("Pharmacist Registration Error:", error);
      setIsLoadingAuth(false);
      return { success: false, message: "فشل الاتصال بالخادم", status: 0 };
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
        loginByQR,
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
