import apiService from './api';
import type { RegisterFCMTokenRequest, FCMToken } from '../types/notification';
import { initializeMessaging } from '../lib/firebase';
import { getToken } from 'firebase/messaging';

class FCMService {
  async registerToken(tokenData: RegisterFCMTokenRequest): Promise<{ message: string; success: boolean }> {
    return apiService.post("/notifications/push/register-token", tokenData);
  }

  async unregisterToken(token: string): Promise<{ message: string; success: boolean }> {
    return apiService.post("/notifications/push/unregister-token", { token });
  }

  async getUserTokens(): Promise<{ data: FCMToken[] }> {
    return apiService.get("/notifications/push/tokens");
  }

  // Get FCM token from browser
  async getFCMToken(): Promise<string | null> {
    try {
      const messaging = await initializeMessaging();
      if (!messaging) {
        console.warn('Firebase messaging is not supported');
        return null;
      }

      const token = await getToken(messaging, {
        vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
      });
      return token;
    } catch (error) {
      console.log('Error getting FCM token:', error);
      return null;
    }
  }

  // Request notification permission
  async requestNotificationPermission(): Promise<boolean> {
    try {
      if ('Notification' in window) {
        const permission = await Notification.requestPermission();
        return permission === 'granted';
      }
      return false;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }

  // Check if notifications are supported
  isNotificationSupported(): boolean {
    return 'Notification' in window && 'serviceWorker' in navigator;
  }

  // Check if FCM is supported
  async isFCMSupported(): Promise<boolean> {
    try {
      const messaging = await initializeMessaging();
      return messaging !== null;
    } catch (error) {
      return false;
    }
  }

  // Check if a token is already registered for the current user
  async isTokenRegistered(token: string): Promise<boolean> {
    try {
      const response = await this.getUserTokens();
      return response.data.some((tokenData) => tokenData.token === token);
    } catch (error) {
      console.error('Error checking if token is registered:', error);
      return false;
    }
  }
}

export const fcmService = new FCMService();
export default fcmService;
