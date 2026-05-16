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

      // No access token stored — user has never logged in or already logged out.
      // This is a normal, expected state. Do NOT show any error.
      if (!access) {
        setIsAuthenticated(false);
        setUser(null);
        setUserRole(null);
        setAuthChecked(true);
        return;
      }

      // Attempt to verify the stored token against the backend.
      // fetchClient will internally attempt a token refresh if this returns 401.
      // If refresh also fails, fetchClient clears both tokens and returns status 401.
      const result = await profileApi.getMe();

      if (result.success && result.data) {
        // Token is valid — restore user session.
        const userData = result.data.user || result.data;
        setUser(userData);
        setUserRole(userData?.role || null);
        setIsAuthenticated(true);
      } else if (result.status === 401) {
        // Token is expired/invalid and refresh failed.
        // fetchClient already cleared stored tokens at this point.
        // Explicitly reset auth state so the user can log in again.
        setIsAuthenticated(false);
        setUser(null);
        setUserRole(null);
      } else if (result.status === 0) {
        // Network error — server is unreachable.
        // Do NOT clear tokens; the user may be offline temporarily.
        // Keep isAuthenticated as false (initial state) to prevent accessing protected screens.
        setIsAuthenticated(false);
        setUser(null);
      }
      // All other error statuses (e.g. 500) are treated like network errors:
      // tokens are preserved but session is not restored.
    } catch (error) {
      // Unexpected JS error — guard against crashing the app.
      // Silently reset to unauthenticated state.
      setIsAuthenticated(false);
      setUser(null);
      setUserRole(null);
    } finally {
      // Always mark the auth check as done so the router can decide where to navigate.
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
