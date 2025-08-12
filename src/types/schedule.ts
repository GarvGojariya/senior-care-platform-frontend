export interface Schedule {
  id: string;
  medicationId: string;
  time: string;
  daysOfWeek: string[];
  isActive: boolean;
  nextNotificationDue?: string;
  createdAt: string;
  updatedAt: string;
  medication?: {
    id: string;
    name: string;
    dosage: string;
    seniorId: string;
  };
}

export interface CreateScheduleRequest {
  medicationId: string;
  time: string;
  daysOfWeek: string[];
  isActive?: boolean;
}

export interface CreateBulkScheduleRequest {
  medicationId: string;
  schedules: Array<{
    time: string;
    daysOfWeek: string[];
  }>;
}

export interface UpdateScheduleRequest {
  time?: string;
  daysOfWeek?: string[];
  isActive?: boolean;
}

export interface ScheduleTemplate {
  id: string;
  name: string;
  description: string;
  timeSlots: string[];
  daysOfWeek: string[];
  isActive: boolean;
}

export interface ScheduleReminder {
  id: string;
  scheduleId: string;
  scheduledFor: string;
  status: 'PENDING' | 'SENT' | 'CONFIRMED' | 'MISSED';
  medicationName: string;
  time: string;
}

export interface SchedulesResponse {
  schedules: Schedule[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
