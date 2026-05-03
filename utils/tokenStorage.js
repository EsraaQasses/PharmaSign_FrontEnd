import AsyncStorage from '@react-native-async-storage/async-storage';

const ACCESS_TOKEN_KEY = '@access_token';
const REFRESH_TOKEN_KEY = '@refresh_token';

/**
 * Temporary frontend token persistence using AsyncStorage.
 * In a production app, expo-secure-store would be preferred for JWTs.
 */
export const tokenStorage = {
  saveTokens: async (access, refresh) => {
    try {
      if (access) await AsyncStorage.setItem(ACCESS_TOKEN_KEY, access);
      if (refresh) await AsyncStorage.setItem(REFRESH_TOKEN_KEY, refresh);
    } catch (error) {
      console.error('Error saving tokens:', error);
    }
  },

  getTokens: async () => {
    try {
      const access = await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
      const refresh = await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
      return { access, refresh };
    } catch (error) {
      console.error('Error getting tokens:', error);
      return { access: null, refresh: null };
    }
  },

  clearTokens: async () => {
    try {
      await AsyncStorage.removeItem(ACCESS_TOKEN_KEY);
      await AsyncStorage.removeItem(REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error('Error clearing tokens:', error);
    }
  }
};
