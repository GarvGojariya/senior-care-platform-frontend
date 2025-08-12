import apiService from './api';
import type { LoginRequest, LoginResponse, RegisterCaregiverRequest, ChangePasswordRequest } from '../types/auth';

class AuthService {
  async login(credentials: LoginRequest): Promise<{ data: LoginResponse }> {
    return apiService.post('/auth/login', credentials);
  }

  async register(data: RegisterCaregiverRequest): Promise<{ message: string; success: boolean }> {
    return apiService.post('/auth/register-caregiver', data);
  }

  async changePassword(data: ChangePasswordRequest): Promise<{ message: string; success: boolean }> {
    return apiService.post('/auth/change-password', data);
  }

  async refreshToken(refreshToken: string): Promise<{ data: LoginResponse }> {
    return apiService.post('/auth/refresh-token', refreshToken);
  }

  async forgotPassword(email: string): Promise<{ message: string; success: boolean }> {
    return apiService.post('/auth/forgot-password', { email });
  }

  async resetPassword(token: string, newPassword: string): Promise<{ message: string; success: boolean }> {
    return apiService.post('/auth/reset-password', { token, newPassword });
  }
}

export const authService = new AuthService();
export default authService;
