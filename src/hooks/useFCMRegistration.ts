import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { initializeAuth } from "../store/slices/authSlice";
import { fcmService } from "../services/fcmService";

export const useFCMRegistration = () => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  useEffect(() => {
    const registerFCMToken = async () => {
      console.log("Starting FCM registration process...");
      const isFCMSupported = await fcmService.isFCMSupported();
      if (!isAuthenticated || !user) {
        console.log("User not authenticated or not available, skipping FCM registration");
        return;
      }

      try {
        if (isFCMSupported && fcmService.isNotificationSupported()) {
          if (Notification.permission === "granted") {
            // Get FCM token
            const token = await fcmService.getFCMToken();

            if (token) {
              // Check if token is already registered
              const isAlreadyRegistered = await fcmService.isTokenRegistered(token);
              
              if (!isAlreadyRegistered) {
                // Register token with backend
                const deviceInfo = {
                  token,
                  deviceId: `web-${user.id}`,
                  deviceType: "WEB" as const,
                  appVersion: "1.0.0",
                };

                await fcmService.registerToken(deviceInfo);
                console.log("FCM token registered on app initialization");
              } else {
                console.log("FCM token already registered, skipping registration");
              }
            }
          } else if (Notification.permission === "default") {
            Notification.requestPermission().then((permission) => {
              if (permission === "granted") {
                registerFCMToken();
              }
            });
          }
        }
      } catch (error) {
        console.warn(
          "Failed to register FCM token on app initialization:",
          error
        );
      }
    };

    registerFCMToken();
  }, [isAuthenticated, user]);
};
