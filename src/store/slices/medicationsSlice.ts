import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Medication, AddMedicationRequest, UpdateMedicationRequest, MedicationsResponse } from '../../types/medication';
import apiService from '../../services/api';

// Async thunks
export const fetchMedications = createAsyncThunk(
  'medications/fetchMedications',
  async (params: {
    seniorId?: string;
    page?: number;
    limit?: number;
    search?: string;
    sort?: string;
    sortBy?: string;
    isActive?: string;
  }, { rejectWithValue }) => {
    try {
      const response = await apiService.get<MedicationsResponse>('/medications', params);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch medications');
    }
  }
);

export const fetchMedicationById = createAsyncThunk(
  'medications/fetchMedicationById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await apiService.get<{ data: Medication }>(`/medications/${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch medication');
    }
  }
);

export const addMedication = createAsyncThunk(
  'medications/addMedication',
  async (medicationData: AddMedicationRequest, { rejectWithValue }) => {
    try {
      const response = await apiService.post<{ data: Medication }>('/medications', medicationData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add medication');
    }
  }
);

export const updateMedication = createAsyncThunk(
  'medications/updateMedication',
  async ({ id, data }: { id: string; data: UpdateMedicationRequest }, { rejectWithValue }) => {
    try {
      const response = await apiService.put<{ data: Medication }>(`/medications/${id}`, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update medication');
    }
  }
);

export const deleteMedication = createAsyncThunk(
  'medications/deleteMedication',
  async (id: string, { rejectWithValue }) => {
    try {
      await apiService.delete(`/medications/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete medication');
    }
  }
);

export const toggleMedicationStatus = createAsyncThunk(
  'medications/toggleMedicationStatus',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await apiService.patch<{ data: Medication }>(`/medications/${id}/toggle`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to toggle medication status');
    }
  }
);

interface MedicationsState {
  medications: Medication[];
  selectedMedication: Medication | null;
  isLoading: boolean;
  error: string | null;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const initialState: MedicationsState = {
  medications: [],
  selectedMedication: null,
  isLoading: false,
  error: null,
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 0,
};

const medicationsSlice = createSlice({
  name: 'medications',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSelectedMedication: (state, action: PayloadAction<Medication | null>) => {
      state.selectedMedication = action.payload;
    },
    clearSelectedMedication: (state) => {
      state.selectedMedication = null;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setLimit: (state, action: PayloadAction<number>) => {
      state.limit = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch medications
    builder
      .addCase(fetchMedications.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMedications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.medications = action.payload.data;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
        state.totalPages = action.payload.totalPages;
        state.error = null;
      })
      .addCase(fetchMedications.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch medication by ID
    builder
      .addCase(fetchMedicationById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMedicationById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedMedication = action.payload;
        state.error = null;
      })
      .addCase(fetchMedicationById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Add medication
    builder
      .addCase(addMedication.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addMedication.fulfilled, (state, action) => {
        state.isLoading = false;
        state.medications.unshift(action.payload);
        state.total += 1;
        state.error = null;
      })
      .addCase(addMedication.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update medication
    builder
      .addCase(updateMedication.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateMedication.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.medications.findIndex(med => med.id === action.payload.id);
        if (index !== -1) {
          state.medications[index] = action.payload;
        }
        if (state.selectedMedication?.id === action.payload.id) {
          state.selectedMedication = action.payload;
        }
        state.error = null;
      })
      .addCase(updateMedication.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Delete medication
    builder
      .addCase(deleteMedication.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteMedication.fulfilled, (state, action) => {
        state.isLoading = false;
        state.medications = state.medications.filter(med => med.id !== action.payload);
        state.total -= 1;
        if (state.selectedMedication?.id === action.payload) {
          state.selectedMedication = null;
        }
        state.error = null;
      })
      .addCase(deleteMedication.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Toggle medication status
    builder
      .addCase(toggleMedicationStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(toggleMedicationStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.medications.findIndex(med => med.id === action.payload.id);
        if (index !== -1) {
          state.medications[index] = action.payload;
        }
        if (state.selectedMedication?.id === action.payload.id) {
          state.selectedMedication = action.payload;
        }
        state.error = null;
      })
      .addCase(toggleMedicationStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setSelectedMedication, clearSelectedMedication, setPage, setLimit } = medicationsSlice.actions;
export default medicationsSlice.reducer;
