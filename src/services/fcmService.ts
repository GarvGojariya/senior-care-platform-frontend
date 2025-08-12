import apiService from './api';
import type { RegisterFCMTokenRequest, FCMToken } from '../types/notification';

class FCMService {
  async registerToken(tokenData: RegisterFCMTokenRequest): Promise<{ message: string; success: boolean }> {
    return apiService.post('/notifications/register-fcm-token', tokenData);
  }

  async unregisterToken(token: string): Promise<{ message: string; success: boolean }> {
    return apiService.post('/notifications/unregister-fcm-token', { token });
  }

  async getUserTokens(): Promise<{ data: FCMToken[] }> {
    return apiService.get('/notifications/fcm-tokens');
  }

  // Get FCM token from browser
  async getFCMToken(): Promise<string | null> {
    try {
      // Check if Firebase is available
      if (typeof window !== 'undefined' && 'firebase' in window) {
        const messaging = (window as any).firebase.messaging();
        const token = await messaging.getToken({
          vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY,
        });
        return token;
      }
      return null;
    } catch (error) {
      console.error('Error getting FCM token:', error);
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
  isFCMSupported(): boolean {
    return typeof window !== 'undefined' && 'firebase' in window;
  }
}

export const fcmService = new FCMService();
export default fcmService;
