/**
 * Centralized API configuration and base client.
 * 
 * For web testing:
 * export const API_BASE_URL = "http://127.0.0.1:8000/api";
 * 
 * For Android Emulator testing, you may need to use:
 * export const API_BASE_URL = "http://10.0.2.2:8000/api";
 * 
 * For physical devices testing, use your laptop's LAN IP:
 * export const API_BASE_URL = "http://192.168.1.X:8000/api";
 */

export const API_BASE_URL = "http://127.0.0.1:8000/api";

import { tokenStorage } from '@/utils/tokenStorage';

/**
 * Standardizes API error responses and translates common messages to Arabic.
 */
const handleApiError = async (response) => {
  let errorData = {};
  try {
    errorData = await response.json();
  } catch (e) {
    errorData = { detail: "حدث خطأ غير متوقع في الاتصال بالخادم." };
  }

  let message = errorData.detail || errorData.error || "حدث خطأ في الاتصال";

  // Translate common backend messages
  if (message === "Invalid OTP.") message = "رمز التحقق غير صحيح.";
  if (message === "Invalid credentials.") message = "رقم الجوال أو كلمة المرور غير صحيحة.";
  if (Array.isArray(message) && message.includes("Invalid credentials.")) {
    message = "رقم الجوال أو كلمة المرور غير صحيحة.";
  }

  return {
    success: false,
    status: response.status,
    approval_status: errorData.approval_status || null,
    message: message,
    rejection_reason: errorData.rejection_reason || null,
    data: errorData
  };
};

/**
 * Base fetch wrapper.
 */
export const fetchClient = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (options.requiresAuth) {
    const { access } = await tokenStorage.getTokens();
    if (access) {
      headers['Authorization'] = `Bearer ${access}`;
    }
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      return handleApiError(response);
    }

    if (response.status === 204) {
      return { success: true, status: 204 };
    }

    const data = await response.json();
    return {
      success: true,
      status: response.status,
      data,
    };
  } catch (error) {
    return {
      success: false,
      status: 0,
      approval_status: null,
      message: "تعذر الاتصال بالخادم. تأكد أن السيرفر يعمل.",
      rejection_reason: null,
      data: null
    };
  }
};
