import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { User } from '../../types/auth';
import apiService from '../../services/api';

// Async thunks
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (params: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    sort?: string;
    sortBy?: string;
  }, { rejectWithValue }) => {
    try {
      const response = await apiService.get<{ data: User[]; total: number; page: number; limit: number; totalPages: number }>('/user', params);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
    }
  }
);

export const fetchUserById = createAsyncThunk(
  'users/fetchUserById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await apiService.get<{ data: User }>(`/user/${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user');
    }
  }
);

export const createSenior = createAsyncThunk(
  'users/createSenior',
  async (userData: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
    address?: string;
    dateOfBirth?: string;
    emergencyContact?: string;
  }, { rejectWithValue }) => {
    try {
      const response = await apiService.post<{ data: User }>('/user/create-senior', userData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create senior');
    }
  }
);

export const updateUser = createAsyncThunk(
  'users/updateUser',
  async ({ id, data }: { id: string; data: Partial<User> }, { rejectWithValue }) => {
    try {
      const response = await apiService.put<{ data: User }>(`/user/${id}`, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update user');
    }
  }
);

export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (id: string, { rejectWithValue }) => {
    try {
      await apiService.delete(`/user/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete user');
    }
  }
);

export const fetchSeniorsOfCaregiver = createAsyncThunk(
  'users/fetchSeniorsOfCaregiver',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.get<{ data: User[] }>('/user/caregiver/seniors');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch seniors');
    }
  }
);

interface UsersState {
  users: User[];
  selectedUser: User | null;
  seniors: User[];
  isLoading: boolean;
  error: string | null;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const initialState: UsersState = {
  users: [],
  selectedUser: null,
  seniors: [],
  isLoading: false,
  error: null,
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 0,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSelectedUser: (state, action: PayloadAction<User | null>) => {
      state.selectedUser = action.payload;
    },
    clearSelectedUser: (state) => {
      state.selectedUser = null;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setLimit: (state, action: PayloadAction<number>) => {
      state.limit = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch users
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload.data;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
        state.totalPages = action.payload.totalPages;
        state.error = null;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch user by ID
    builder
      .addCase(fetchUserById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedUser = action.payload;
        state.error = null;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Create senior
    builder
      .addCase(createSenior.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createSenior.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users.unshift(action.payload);
        state.seniors.unshift(action.payload);
        state.total += 1;
        state.error = null;
      })
      .addCase(createSenior.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update user
    builder
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.users.findIndex(user => user.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
        if (state.selectedUser?.id === action.payload.id) {
          state.selectedUser = action.payload;
        }
        // Update in seniors array if applicable
        const seniorIndex = state.seniors.findIndex(user => user.id === action.payload.id);
        if (seniorIndex !== -1) {
          state.seniors[seniorIndex] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Delete user
    builder
      .addCase(deleteUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = state.users.filter(user => user.id !== action.payload);
        state.seniors = state.seniors.filter(user => user.id !== action.payload);
        state.total -= 1;
        if (state.selectedUser?.id === action.payload) {
          state.selectedUser = null;
        }
        state.error = null;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch seniors of caregiver
    builder
      .addCase(fetchSeniorsOfCaregiver.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSeniorsOfCaregiver.fulfilled, (state, action) => {
        state.isLoading = false;
        state.seniors = action.payload;
        state.error = null;
      })
      .addCase(fetchSeniorsOfCaregiver.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setSelectedUser, clearSelectedUser, setPage, setLimit } = usersSlice.actions;
export default usersSlice.reducer;
