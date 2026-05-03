import { fetchClient } from './client';

export const profileApi = {
  // Common
  getMe: async () => {
    return fetchClient('/auth/me/', { requiresAuth: true });
  },

  // Patient
  getPatientProfile: async () => {
    return fetchClient('/patients/me/', { requiresAuth: true });
  },
  updatePatientProfile: async (data) => {
    return fetchClient('/patients/me/', {
      method: 'PATCH',
      body: JSON.stringify(data),
      requiresAuth: true
    });
  },
  getPatientSettings: async () => {
    return fetchClient('/patients/me/settings/', { requiresAuth: true });
  },
  updatePatientSettings: async (data) => {
    return fetchClient('/patients/me/settings/', {
      method: 'PATCH',
      body: JSON.stringify(data),
      requiresAuth: true
    });
  },

  // Pharmacist
  getPharmacistProfile: async () => {
    return fetchClient('/pharmacist/me/', { requiresAuth: true });
  },
  updatePharmacistProfile: async (data) => {
    return fetchClient('/pharmacist/me/', {
      method: 'PATCH',
      body: JSON.stringify(data),
      requiresAuth: true
    });
  },
  getPharmacyData: async () => {
    return fetchClient('/pharmacist/me/pharmacy/', { requiresAuth: true });
  },
  updatePharmacyData: async (data) => {
    return fetchClient('/pharmacist/me/pharmacy/', {
      method: 'PATCH',
      body: JSON.stringify(data),
      requiresAuth: true
    });
  }
};
