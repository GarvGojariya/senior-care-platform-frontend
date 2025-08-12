export interface Notification {
  id: string;
  userId: string;
  scheduleId?: string;
  type: 'MEDICATION_REMINDER' | 'SYSTEM_NOTIFICATION' | 'EMERGENCY' | 'SCHEDULE_UPDATE';
  title: string;
  message: string;
  status: 'PENDING' | 'SENT' | 'DELIVERED' | 'READ' | 'FAILED';
  channels: string[];
  scheduledFor: string;
  sentAt?: string;
  deliveredAt?: string;
  readAt?: string;
  createdAt: string;
  updatedAt: string;
  schedule?: {
    id: string;
    medication: {
      name: string;
      dosage: string;
    };
  };
}

export interface NotificationSetting {
  id: string;
  userId: string;
  channel: 'EMAIL' | 'PUSH' | 'SMS';
  isEnabled: boolean;
  preferredTime?: string;
  timezone: string;
  quietHoursStart?: string;
  quietHoursEnd?: string;
  maxNotificationsPerDay: number;
}

export interface UpdateNotificationSettingsRequest {
  channel: 'EMAIL' | 'PUSH' | 'SMS';
  isEnabled: boolean;
  preferredTime?: string;
  timezone?: string;
  quietHoursStart?: string;
  quietHoursEnd?: string;
  maxNotificationsPerDay?: number;
}

export interface TestNotificationRequest {
  title: string;
  message: string;
  channels: string[];
}

export interface NotificationStats {
  total: number;
  sent: number;
  delivered: number;
  read: number;
  failed: number;
  byChannel: Record<string, number>;
  byType: Record<string, number>;
}

export interface FCMToken {
  id: string;
  userId: string;
  token: string;
  deviceId: string;
  deviceType: 'ANDROID' | 'IOS' | 'WEB';
  appVersion: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RegisterFCMTokenRequest {
  token: string;
  deviceId: string;
  deviceType: 'ANDROID' | 'IOS' | 'WEB';
  appVersion: string;
}

export interface NotificationsResponse {
  notifications: Notification[];
  total: number;
  limit: number;
  offset: number;
}
