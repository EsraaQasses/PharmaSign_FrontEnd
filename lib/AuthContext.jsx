import React, { createContext, useState, useContext, useEffect } from "react";
import { useRouter, useSegments } from "expo-router";
import { MOCK_PATIENTS, MOCK_PHARMACIST } from "@/lib/mockData";

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
  const [authChecked, setAuthChecked] = useState(true);
  const [userRole, setUserRole] = useState(null); // 'patient' | 'pharmacist' | null

  /**
   * Mock login for patient.
   * In production, this would call the auth API.
   */
  const loginAsPatient = async (email, password) => {
    setIsLoadingAuth(true);
    setAuthError(null);
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Mock: accept any credentials for now
      const mockUser = {
        id: MOCK_PATIENTS[0].id,
        name: MOCK_PATIENTS[0].name,
        email: email || MOCK_PATIENTS[0].email,
        phone: MOCK_PATIENTS[0].phone,
        role: "patient",
        ...MOCK_PATIENTS[0],
      };

      setUser(mockUser);
      setUserRole("patient");
      setIsAuthenticated(true);
      setIsLoadingAuth(false);
      return { success: true, user: mockUser };
    } catch (error) {
      setAuthError({ type: "login_failed", message: "فشل تسجيل الدخول" });
      setIsLoadingAuth(false);
      return { success: false, error };
    }
  };

  /**
   * Mock login for pharmacist.
   */
  const loginAsPharmacist = async (email, password) => {
    setIsLoadingAuth(true);
    setAuthError(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      const mockUser = {
        ...MOCK_PHARMACIST,
        email: email || MOCK_PHARMACIST.email,
        role: "pharmacist",
      };

      setUser(mockUser);
      setUserRole("pharmacist");
      setIsAuthenticated(true);
      setIsLoadingAuth(false);
      return { success: true, user: mockUser };
    } catch (error) {
      setAuthError({ type: "login_failed", message: "فشل تسجيل الدخول" });
      setIsLoadingAuth(false);
      return { success: false, error };
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
  const logout = () => {
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
