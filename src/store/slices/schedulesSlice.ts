import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Schedule, CreateScheduleRequest, UpdateScheduleRequest, SchedulesResponse } from '../../types/schedule';
import apiService from '../../services/api';

// Async thunks
export const fetchSchedules = createAsyncThunk(
  'schedules/fetchSchedules',
  async (params: {
    medicationId?: string;
    page?: number;
    limit?: number;
    search?: string;
    sort?: string;
    sortBy?: string;
    isActive?: string;
  }, { rejectWithValue }) => {
    try {
      const response = await apiService.get<SchedulesResponse>('/schedules', params);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch schedules');
    }
  }
);

export const fetchScheduleById = createAsyncThunk(
  'schedules/fetchScheduleById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await apiService.get<{ data: Schedule }>(`/schedules/${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch schedule');
    }
  }
);

export const createSchedule = createAsyncThunk(
  'schedules/createSchedule',
  async (scheduleData: CreateScheduleRequest, { rejectWithValue }) => {
    try {
      const response = await apiService.post<{ data: Schedule }>('/schedules', scheduleData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create schedule');
    }
  }
);

export const updateSchedule = createAsyncThunk(
  'schedules/updateSchedule',
  async ({ id, data }: { id: string; data: UpdateScheduleRequest }, { rejectWithValue }) => {
    try {
      const response = await apiService.put<{ data: Schedule }>(`/schedules/${id}`, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update schedule');
    }
  }
);

export const deleteSchedule = createAsyncThunk(
  'schedules/deleteSchedule',
  async (id: string, { rejectWithValue }) => {
    try {
      await apiService.delete(`/schedules/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete schedule');
    }
  }
);

export const toggleScheduleStatus = createAsyncThunk(
  'schedules/toggleScheduleStatus',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await apiService.put<{ data: Schedule }>(`/schedules/${id}/toggle`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to toggle schedule status');
    }
  }
);

export const fetchScheduleTemplates = createAsyncThunk(
  'schedules/fetchScheduleTemplates',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.get<{ data: any[] }>('/schedules/templates');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch schedule templates');
    }
  }
);

export const fetchNextReminders = createAsyncThunk(
  'schedules/fetchNextReminders',
  async ({ userId, days }: { userId: string; days?: number }, { rejectWithValue }) => {
    try {
      const response = await apiService.get<{ data: any[] }>(`/schedules/reminders/${userId}`, { days });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch next reminders');
    }
  }
);

interface SchedulesState {
  schedules: Schedule[];
  selectedSchedule: Schedule | null;
  templates: any[];
  nextReminders: any[];
  isLoading: boolean;
  error: string | null;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const initialState: SchedulesState = {
  schedules: [],
  selectedSchedule: null,
  templates: [],
  nextReminders: [],
  isLoading: false,
  error: null,
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 0,
};

const schedulesSlice = createSlice({
  name: 'schedules',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSelectedSchedule: (state, action: PayloadAction<Schedule | null>) => {
      state.selectedSchedule = action.payload;
    },
    clearSelectedSchedule: (state) => {
      state.selectedSchedule = null;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setLimit: (state, action: PayloadAction<number>) => {
      state.limit = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch schedules
    builder
      .addCase(fetchSchedules.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSchedules.fulfilled, (state, action) => {
        state.isLoading = false;
        state.schedules = action.payload.schedules;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
        state.totalPages = action.payload.totalPages;
        state.error = null;
      })
      .addCase(fetchSchedules.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch schedule by ID
    builder
      .addCase(fetchScheduleById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchScheduleById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedSchedule = action.payload;
        state.error = null;
      })
      .addCase(fetchScheduleById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Create schedule
    builder
      .addCase(createSchedule.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createSchedule.fulfilled, (state, action) => {
        state.isLoading = false;
        state.schedules.unshift(action.payload);
        state.total += 1;
        state.error = null;
      })
      .addCase(createSchedule.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update schedule
    builder
      .addCase(updateSchedule.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateSchedule.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.schedules.findIndex(schedule => schedule.id === action.payload.id);
        if (index !== -1) {
          state.schedules[index] = action.payload;
        }
        if (state.selectedSchedule?.id === action.payload.id) {
          state.selectedSchedule = action.payload;
        }
        state.error = null;
      })
      .addCase(updateSchedule.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Delete schedule
    builder
      .addCase(deleteSchedule.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteSchedule.fulfilled, (state, action) => {
        state.isLoading = false;
        state.schedules = state.schedules.filter(schedule => schedule.id !== action.payload);
        state.total -= 1;
        if (state.selectedSchedule?.id === action.payload) {
          state.selectedSchedule = null;
        }
        state.error = null;
      })
      .addCase(deleteSchedule.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Toggle schedule status
    builder
      .addCase(toggleScheduleStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(toggleScheduleStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.schedules.findIndex(schedule => schedule.id === action.payload.id);
        if (index !== -1) {
          state.schedules[index] = action.payload;
        }
        if (state.selectedSchedule?.id === action.payload.id) {
          state.selectedSchedule = action.payload;
        }
        state.error = null;
      })
      .addCase(toggleScheduleStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch schedule templates
    builder
      .addCase(fetchScheduleTemplates.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchScheduleTemplates.fulfilled, (state, action) => {
        state.isLoading = false;
        state.templates = action.payload;
        state.error = null;
      })
      .addCase(fetchScheduleTemplates.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch next reminders
    builder
      .addCase(fetchNextReminders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchNextReminders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.nextReminders = action.payload;
        state.error = null;
      })
      .addCase(fetchNextReminders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setSelectedSchedule, clearSelectedSchedule, setPage, setLimit } = schedulesSlice.actions;
export default schedulesSlice.reducer;
