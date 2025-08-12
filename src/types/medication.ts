export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  instructions: string;
  startDate: string;
  endDate?: string;
  isActive: boolean;
  seniorId: string;
  caregiverId: string;
  createdAt: string;
  updatedAt: string;
  senior?: {
    id: string;
    firstName: string;
    lastName: string;
  };
  caregiver?: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

export interface AddMedicationRequest {
  name: string;
  dosage: string;
  frequency: string;
  instructions: string;
  startDate: string;
  endDate?: string;
  seniorId: string;
}

export interface UpdateMedicationRequest {
  name?: string;
  dosage?: string;
  frequency?: string;
  instructions?: string;
  startDate?: string;
  endDate?: string;
  isActive?: boolean;
}

export interface MedicationSchedule {
  id: string;
  medicationId: string;
  time: string;
  isActive: boolean;
  nextNotificationDue?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MedicationsResponse {
  data: Medication[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
