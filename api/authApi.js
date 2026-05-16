import { fetchClient } from './client';

export const authApi = {
  // Patient OTP
  requestPatientOTP: async (phone_number) => {
    return fetchClient('/auth/patient/register/request-otp/', {
      method: 'POST',
      body: JSON.stringify({ phone_number }),
    });
  },

  // Pharmacist OTP
  requestPharmacistOTP: async (phone_number) => {
    return fetchClient('/auth/pharmacist/register/request-otp/', {
      method: 'POST',
      body: JSON.stringify({ phone_number }),
    });
  },

  // Patient Registration
  registerPatient: async (payload) => {
    // payload: { full_name, phone_number, password, otp }
    return fetchClient('/auth/patient/register/', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  // Pharmacist Registration
  registerPharmacist: async (payload) => {
    // payload: { full_name, phone_number, password, license_number, pharmacy_id, otp }
    return fetchClient('/auth/pharmacist/register/', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  // Login (used by both roles)
  login: async (phone_number, password) => {
    return fetchClient('/auth/login/', {
      method: 'POST',
      body: JSON.stringify({ phone_number, password }),
    });
  },

  // Patient QR Login
  loginByQR: async (qr_token) => {
    return fetchClient('/auth/patient/qr-login/', {
      method: 'POST',
      body: JSON.stringify({ qr_token }),
    });
  },
};
