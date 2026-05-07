import { fetchClient } from "./client";

/**
 * API service for prescription-related operations.
 */
export const prescriptionApi = {
  /**
   * Create a new prescription linked to an active patient session.
   * @param {Object} data - Prescription data including session_id, patient_id, and items.
   */
  createPrescription: async (data) => {
    return await fetchClient("/pharmacist/prescriptions/", {
      method: "POST",
      body: JSON.stringify(data),
      requiresAuth: true,
    });
  },

  /**
   * Get a list of prescriptions created by the pharmacist.
   */
  getPrescriptions: async () => {
    return await fetchClient("/pharmacist/prescriptions/", {
      method: "GET",
      requiresAuth: true,
    });
  },

  /**
   * Get full details of a specific prescription.
   * @param {string|number} prescriptionId 
   */
  getPrescriptionDetail: async (prescriptionId) => {
    return await fetchClient(`/pharmacist/prescriptions/${prescriptionId}/`, {
      method: "GET",
      requiresAuth: true,
    });
  },

  /**
   * Add a medication item to an existing prescription.
   * @param {string|number} prescriptionId 
   * @param {Object} itemData - Medication details (name, dosage, etc.)
   */
  addItemToPrescription: async (prescriptionId, itemData) => {
    return await fetchClient(`/pharmacist/prescriptions/${prescriptionId}/items/`, {
      method: "POST",
      body: JSON.stringify(itemData),
      requiresAuth: true,
    });
  },

  /**
   * Update an existing prescription.
   * @param {string|number} prescriptionId 
   * @param {Object} data - Updated prescription data.
   */
  updatePrescription: async (prescriptionId, data) => {
    return await fetchClient(`/pharmacist/prescriptions/${prescriptionId}/`, {
      method: "PATCH",
      body: JSON.stringify(data),
      requiresAuth: true,
    });
  },

  /**
   * Finalize and submit a prescription to the patient.
   * @param {string|number} prescriptionId 
   */
  submitPrescription: async (prescriptionId) => {
    return await fetchClient(`/pharmacist/prescriptions/${prescriptionId}/submit/`, {
      method: "POST",
      requiresAuth: true,
    });
  },

  /**
   * Get a list of prescriptions for the current patient.
   */
  getPatientPrescriptions: async () => {
    return await fetchClient("/patients/me/prescriptions/", {
      method: "GET",
      requiresAuth: true,
    });
  },

  /**
   * Get detail of a specific prescription for the current patient.
   * @param {string|number} prescriptionId
   */
  getPatientPrescriptionDetail: async (prescriptionId) => {
    return await fetchClient(`/patients/me/prescriptions/${prescriptionId}/`, {
      method: "GET",
      requiresAuth: true,
    });
  }
};
