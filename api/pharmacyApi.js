import { fetchClient } from './client';

export const pharmacyApi = {
  /**
   * Fetch public contracted pharmacies for pharmacist registration.
   * Endpoint: GET /api/auth/contracted-pharmacies/
   * Auth: Public (AllowAny)
   */
  getContractedPharmacies: async () => {
    return fetchClient('/auth/contracted-pharmacies/');
  },

  /**
   * Fetch patient's view of contracted pharmacies (for map/list).
   * Endpoint: GET /api/patients/pharmacies/
   * Auth: Patient JWT required
   */
  getPatientPharmacies: async () => {
    return fetchClient('/patients/pharmacies/', { requiresAuth: true });
  },
};
