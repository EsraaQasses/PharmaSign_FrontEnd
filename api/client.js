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

export const API_BASE_URL = "https://pharmasign-admin.tech/api";

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
  
  const isFormData = options.body instanceof FormData;
  
  const headers = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...options.headers,
  };

  if (options.requiresAuth) {
    const { access } = await tokenStorage.getTokens();
    if (access) {
      headers['Authorization'] = `Bearer ${access}`;
    }
  }

  try {
    let response = await fetch(url, {
      ...options,
      headers,
    });

    // Handle 401 Unauthorized (Expired Token)
    if (response.status === 401 && options.requiresAuth) {
      const { refresh } = await tokenStorage.getTokens();
      
      if (refresh) {
        // Attempt to refresh the access token
        const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh }),
        });

        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json();
          const newAccess = refreshData.access;
          
          if (newAccess) {
            // Save the new access token
            await tokenStorage.saveTokens(newAccess, refresh);
            
            // Retry the original request with the new token
            headers['Authorization'] = `Bearer ${newAccess}`;
            response = await fetch(url, {
              ...options,
              headers,
            });
            
            if (response.ok) {
              const data = await response.json();
              return { success: true, status: response.status, data };
            }
          }
        }
      }
      
      // If refresh failed or no refresh token, clear and fail
      await tokenStorage.clearTokens();
      return handleApiError(response);
    }

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
