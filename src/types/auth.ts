export type Role = 'ADMIN' | 'CAREGIVER' | 'SENIOR';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  phoneNumber?: string;
  dateOfBirth?: string;
  address?: string;
  emergencyContact?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface RegisterCaregiverRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  address?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
