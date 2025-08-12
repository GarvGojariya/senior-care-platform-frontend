import { useState, useEffect } from 'react';
import { useAppSelector } from '../store/hooks';
import { fcmService } from '../services/fcmService';
import { toast } from 'react-hot-toast';

export const useFCMToken = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Check if FCM is supported
    setIsSupported(fcmService.isFCMSupported() && fcmService.isNotificationSupported());
  }, []);

  const registerFCMToken = async () => {
    if (!isAuthenticated || !user) {
      toast.error('You must be logged in to register FCM token');
      return false;
    }

    if (!isSupported) {
      toast.error('Push notifications are not supported in this browser');
      return false;
    }

    try {
      setIsRegistering(true);

      // Request notification permission
      const permissionGranted = await fcmService.requestNotificationPermission();
      if (!permissionGranted) {
        toast.error('Notification permission denied');
        return false;
      }

      // Get FCM token
      const token = await fcmService.getFCMToken();
      if (!token) {
        toast.error('Failed to get FCM token');
        return false;
      }

      // Register token with backend
      const deviceInfo = {
        token,
        deviceId: `web-${user.id}`,
        deviceType: 'WEB' as const,
        appVersion: '1.0.0',
      };

      const response = await fcmService.registerToken(deviceInfo);
      
      if (response.success) {
        toast.success('Push notifications enabled successfully');
        return true;
      } else {
        toast.error('Failed to register FCM token');
        return false;
      }
    } catch (error) {
      console.error('Error registering FCM token:', error);
      toast.error('Failed to enable push notifications');
      return false;
    } finally {
      setIsRegistering(false);
    }
  };

  const unregisterFCMToken = async (token: string) => {
    try {
      const response = await fcmService.unregisterToken(token);
      
      if (response.success) {
        toast.success('Push notifications disabled successfully');
        return true;
      } else {
        toast.error('Failed to unregister FCM token');
        return false;
      }
    } catch (error) {
      console.error('Error unregistering FCM token:', error);
      toast.error('Failed to disable push notifications');
      return false;
    }
  };

  return {
    registerFCMToken,
    unregisterFCMToken,
    isRegistering,
    isSupported,
  };
};
