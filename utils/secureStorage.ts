/**
 * Secure Storage Utility
 * Wraps iOS Keychain / Android Keystore for secure token storage
 * Following enterprise auth guide requirements
 */

import * as SecureStore from 'expo-secure-store';
import * as Device from 'expo-device';
import * as Crypto from 'expo-crypto';

// Storage keys
const KEYS = {
  ACCESS_TOKEN: 'slock_access_token',
  REFRESH_TOKEN: 'slock_refresh_token',
  DEVICE_ID: 'slock_device_id',
  SESSION_DATA: 'slock_session_data',
} as const;

/**
 * Get or create a unique device ID for device binding
 */
export async function getDeviceId(): Promise<string> {
  try {
    // Try to get existing device ID
    let deviceId = await SecureStore.getItemAsync(KEYS.DEVICE_ID);

    if (!deviceId) {
      // Generate new device ID using device info + random UUID
      const deviceInfo = `${Device.modelName}-${Device.osName}-${Device.osVersion}`;
      const randomPart = await Crypto.randomUUID();
      deviceId = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        `${deviceInfo}-${randomPart}`
      );

      // Store for future use
      await SecureStore.setItemAsync(KEYS.DEVICE_ID, deviceId);
    }

    return deviceId;
  } catch (error) {
    console.error('Error getting device ID:', error);
    // Fallback to simple UUID if secure storage fails
    return await Crypto.randomUUID();
  }
}

/**
 * Store access token (short-lived, in memory preferred but Keychain for now)
 */
export async function setAccessToken(token: string): Promise<void> {
  try {
    await SecureStore.setItemAsync(KEYS.ACCESS_TOKEN, token);
  } catch (error) {
    console.error('Error storing access token:', error);
    throw new Error('Failed to store access token securely');
  }
}

/**
 * Get access token
 */
export async function getAccessToken(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(KEYS.ACCESS_TOKEN);
  } catch (error) {
    console.error('Error getting access token:', error);
    return null;
  }
}

/**
 * Store refresh token (long-lived, must be in Keychain/Keystore)
 */
export async function setRefreshToken(token: string): Promise<void> {
  try {
    await SecureStore.setItemAsync(KEYS.REFRESH_TOKEN, token);
  } catch (error) {
    console.error('Error storing refresh token:', error);
    throw new Error('Failed to store refresh token securely');
  }
}

/**
 * Get refresh token
 */
export async function getRefreshToken(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(KEYS.REFRESH_TOKEN);
  } catch (error) {
    console.error('Error getting refresh token:', error);
    return null;
  }
}

/**
 * Store session data (user info, expiry, etc.)
 */
export async function setSessionData(data: any): Promise<void> {
  try {
    await SecureStore.setItemAsync(KEYS.SESSION_DATA, JSON.stringify(data));
  } catch (error) {
    console.error('Error storing session data:', error);
    throw new Error('Failed to store session data');
  }
}

/**
 * Get session data
 */
export async function getSessionData(): Promise<any | null> {
  try {
    const data = await SecureStore.getItemAsync(KEYS.SESSION_DATA);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting session data:', error);
    return null;
  }
}

/**
 * Clear all auth tokens (on logout or security event)
 */
export async function clearAllTokens(): Promise<void> {
  try {
    await Promise.all([
      SecureStore.deleteItemAsync(KEYS.ACCESS_TOKEN),
      SecureStore.deleteItemAsync(KEYS.REFRESH_TOKEN),
      SecureStore.deleteItemAsync(KEYS.SESSION_DATA),
    ]);
  } catch (error) {
    console.error('Error clearing tokens:', error);
    throw new Error('Failed to clear tokens');
  }
}

/**
 * Check if tokens exist
 */
export async function hasValidSession(): Promise<boolean> {
  try {
    const refreshToken = await getRefreshToken();
    return refreshToken !== null;
  } catch (error) {
    return false;
  }
}

/**
 * Detect jailbreak/root (basic check)
 */
export async function detectJailbreak(): Promise<boolean> {
  // This is a basic check - in production, use a dedicated library
  // like react-native-device-info with more comprehensive checks
  try {
    if (Device.isRooted !== undefined) {
      return Device.isRooted;
    }
    return false;
  } catch (error) {
    return false;
  }
}

/**
 * Get device fingerprint for risk signals
 */
export async function getDeviceFingerprint(): Promise<{
  deviceId: string;
  model: string;
  osName: string;
  osVersion: string;
  isRooted: boolean;
}> {
  const deviceId = await getDeviceId();
  const isRooted = await detectJailbreak();

  return {
    deviceId,
    model: Device.modelName || 'unknown',
    osName: Device.osName || 'unknown',
    osVersion: Device.osVersion || 'unknown',
    isRooted,
  };
}

export default {
  getDeviceId,
  setAccessToken,
  getAccessToken,
  setRefreshToken,
  getRefreshToken,
  setSessionData,
  getSessionData,
  clearAllTokens,
  hasValidSession,
  detectJailbreak,
  getDeviceFingerprint,
};
