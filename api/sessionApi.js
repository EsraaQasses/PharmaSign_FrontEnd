import { fetchClient } from './client';

export const sessionApi = {
  /**
   * Generates a temporary session QR token for the patient.
   * POST /api/patients/me/session-qr/
   */
  createSessionQR: async () => {
    return fetchClient('/patients/me/session-qr/', {
      method: 'POST',
      requiresAuth: true
    });
  },

  /**
   * Validates a patient's session QR and starts a medical session.
   * POST /api/pharmacist/sessions/start-by-qr/
   * @param {string} qrToken - The payload scanned from the patient's QR.
   */
  startSessionByQR: async (qrToken) => {
    return fetchClient('/pharmacist/sessions/start-by-qr/', {
      method: 'POST',
      body: JSON.stringify({ qr_token: qrToken }),
      requiresAuth: true
    });
  }
};
