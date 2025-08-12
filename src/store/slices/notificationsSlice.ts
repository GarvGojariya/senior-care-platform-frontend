import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Notification, NotificationSetting, UpdateNotificationSettingsRequest, NotificationsResponse } from '../../types/notification';
import apiService from '../../services/api';

// Async thunks
export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async (params: {
    limit?: number;
    offset?: number;
  }, { rejectWithValue }) => {
    try {
      const response = await apiService.get<NotificationsResponse>('/notifications', params);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch notifications');
    }
  }
);

export const fetchNotificationById = createAsyncThunk(
  'notifications/fetchNotificationById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await apiService.get<{ data: Notification }>(`/notifications/${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch notification');
    }
  }
);

export const fetchNotificationSettings = createAsyncThunk(
  'notifications/fetchNotificationSettings',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.get<{ data: NotificationSetting[] }>('/notifications/settings');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch notification settings');
    }
  }
);

export const updateNotificationSettings = createAsyncThunk(
  'notifications/updateNotificationSettings',
  async (settingsData: UpdateNotificationSettingsRequest, { rejectWithValue }) => {
    try {
      const response = await apiService.put<{ data: NotificationSetting }>('/notifications/settings', settingsData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update notification settings');
    }
  }
);

export const testNotification = createAsyncThunk(
  'notifications/testNotification',
  async (testData: { title: string; message: string; channels: string[] }, { rejectWithValue }) => {
    try {
      const response = await apiService.post<{ data: any }>('/notifications/settings/test', testData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send test notification');
    }
  }
);

export const confirmNotification = createAsyncThunk(
  'notifications/confirmNotification',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await apiService.post<{ data: any }>(`/notifications/${id}/confirm`);
      return { id, ...response.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to confirm notification');
    }
  }
);

export const markNotificationsAsRead = createAsyncThunk(
  'notifications/markNotificationsAsRead',
  async (notificationIds: string[], { rejectWithValue }) => {
    try {
      const response = await apiService.post<{ data: any }>('/notifications/bulk/mark-read', { notificationIds });
      return { notificationIds, ...response.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to mark notifications as read');
    }
  }
);

export const deleteNotifications = createAsyncThunk(
  'notifications/deleteNotifications',
  async (notificationIds: string[], { rejectWithValue }) => {
    try {
      // For bulk delete, we'll send the IDs as query parameters or use a different approach
      await apiService.delete(`/notifications/bulk/delete?ids=${notificationIds.join(',')}`);
      return notificationIds;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete notifications');
    }
  }
);

export const fetchNotificationStats = createAsyncThunk(
  'notifications/fetchNotificationStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.get<{ data: any }>('/notifications/stats');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch notification stats');
    }
  }
);

interface NotificationsState {
  notifications: Notification[];
  selectedNotification: Notification | null;
  settings: NotificationSetting[];
  stats: any;
  isLoading: boolean;
  error: string | null;
  total: number;
  limit: number;
  offset: number;
}

const initialState: NotificationsState = {
  notifications: [],
  selectedNotification: null,
  settings: [],
  stats: null,
  isLoading: false,
  error: null,
  total: 0,
  limit: 50,
  offset: 0,
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSelectedNotification: (state, action: PayloadAction<Notification | null>) => {
      state.selectedNotification = action.payload;
    },
    clearSelectedNotification: (state) => {
      state.selectedNotification = null;
    },
    setLimit: (state, action: PayloadAction<number>) => {
      state.limit = action.payload;
    },
    setOffset: (state, action: PayloadAction<number>) => {
      state.offset = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch notifications
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.notifications = action.payload.notifications;
        state.total = action.payload.total;
        state.limit = action.payload.limit;
        state.offset = action.payload.offset;
        state.error = null;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch notification by ID
    builder
      .addCase(fetchNotificationById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchNotificationById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedNotification = action.payload;
        state.error = null;
      })
      .addCase(fetchNotificationById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch notification settings
    builder
      .addCase(fetchNotificationSettings.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchNotificationSettings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.settings = action.payload;
        state.error = null;
      })
      .addCase(fetchNotificationSettings.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update notification settings
    builder
      .addCase(updateNotificationSettings.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateNotificationSettings.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.settings.findIndex(setting => 
          setting.userId === action.payload.userId && setting.channel === action.payload.channel
        );
        if (index !== -1) {
          state.settings[index] = action.payload;
        } else {
          state.settings.push(action.payload);
        }
        state.error = null;
      })
      .addCase(updateNotificationSettings.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Test notification
    builder
      .addCase(testNotification.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(testNotification.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(testNotification.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Confirm notification
    builder
      .addCase(confirmNotification.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(confirmNotification.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.notifications.findIndex(notif => notif.id === action.payload.id);
        if (index !== -1) {
          state.notifications[index].status = 'READ';
          state.notifications[index].readAt = new Date().toISOString();
        }
        if (state.selectedNotification && state.selectedNotification.id === action.payload.id) {
          state.selectedNotification.status = 'READ';
          state.selectedNotification.readAt = new Date().toISOString();
        }
        state.error = null;
      })
      .addCase(confirmNotification.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Mark notifications as read
    builder
      .addCase(markNotificationsAsRead.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(markNotificationsAsRead.fulfilled, (state, action) => {
        state.isLoading = false;
        state.notifications.forEach(notif => {
          if (action.payload.notificationIds.includes(notif.id)) {
            notif.status = 'READ';
            notif.readAt = new Date().toISOString();
          }
        });
        state.error = null;
      })
      .addCase(markNotificationsAsRead.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Delete notifications
    builder
      .addCase(deleteNotifications.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteNotifications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.notifications = state.notifications.filter(notif => 
          !action.payload.includes(notif.id)
        );
        state.total -= action.payload.length;
        if (state.selectedNotification && action.payload.includes(state.selectedNotification.id)) {
          state.selectedNotification = null;
        }
        state.error = null;
      })
      .addCase(deleteNotifications.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch notification stats
    builder
      .addCase(fetchNotificationStats.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchNotificationStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stats = action.payload;
        state.error = null;
      })
      .addCase(fetchNotificationStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setSelectedNotification, clearSelectedNotification, setLimit, setOffset } = notificationsSlice.actions;
export default notificationsSlice.reducer;
