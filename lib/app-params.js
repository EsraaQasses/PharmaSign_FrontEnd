import AsyncStorage from "@react-native-async-storage/async-storage";

const toSnakeCase = (str) => {
  return str.replace(/([A-Z])/g, "_$1").toLowerCase();
};

/**
 * App configuration parameters.
 * In web, these came from URL params and localStorage.
 * In React Native, we use AsyncStorage and hardcoded defaults.
 *
 * TODO: Replace defaults with actual values when connecting to backend.
 */
const APP_DEFAULTS = {
  appId: "pharmasign-mobile",
  token: null,
  fromUrl: null,
  functionsVersion: null,
  appBaseUrl: null,
};

/**
 * Get a stored param value from AsyncStorage.
 * This is async unlike the web version.
 */
const getStoredParam = async (paramName) => {
  try {
    const storageKey = `base44_${toSnakeCase(paramName)}`;
    const value = await AsyncStorage.getItem(storageKey);
    return value;
  } catch {
    return null;
  }
};

/**
 * Store a param value in AsyncStorage.
 */
const setStoredParam = async (paramName, value) => {
  try {
    const storageKey = `base44_${toSnakeCase(paramName)}`;
    await AsyncStorage.setItem(storageKey, value);
  } catch (error) {
    console.warn("Failed to store param:", error);
  }
};

/**
 * Remove a param from AsyncStorage.
 */
const removeStoredParam = async (paramName) => {
  try {
    const storageKey = `base44_${toSnakeCase(paramName)}`;
    await AsyncStorage.removeItem(storageKey);
  } catch (error) {
    console.warn("Failed to remove param:", error);
  }
};

/**
 * Synchronous app params object.
 * Uses defaults for now. Will be hydrated from AsyncStorage on app start.
 */
export const appParams = {
  ...APP_DEFAULTS,
};

/**
 * Async function to hydrate appParams from AsyncStorage.
 * Call this during app initialization.
 */
export const hydrateAppParams = async () => {
  const token = await getStoredParam("access_token");
  if (token) {
    appParams.token = token;
  }

  const appId = await getStoredParam("app_id");
  if (appId) {
    appParams.appId = appId;
  }
};

/**
 * Save token to storage and update appParams.
 */
export const saveToken = async (token) => {
  appParams.token = token;
  await setStoredParam("access_token", token);
};

/**
 * Clear token from storage and appParams.
 */
export const clearToken = async () => {
  appParams.token = null;
  await removeStoredParam("access_token");
};
