import axios from 'axios';
import type { AxiosInstance, AxiosResponse } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8081/api/v1";

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle token refresh
    this.api.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error) => {
        const originalRequest = error.config;

        // if (error.response?.status === 401 && !originalRequest._retry) {
        //   originalRequest._retry = true;

        //   try {
        //     const refreshToken = localStorage.getItem("refreshToken");
        //     if (refreshToken) {
        //       const response = await this.api.post("/auth/refresh-token", {
        //         refreshToken,
        //       });

        //       const { accessToken } = response.data.data;
        //       localStorage.setItem("accessToken", accessToken);

        //       originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        //       return this.api(originalRequest);
        //     }
        //   } catch (refreshError) {
        //     // Refresh token failed, redirect to login
        //     localStorage.removeItem("accessToken");
        //     localStorage.removeItem("refreshToken");
        //     localStorage.removeItem("user");
        //     window.location.href = "/login";
        //   }
        // }

        return Promise.reject(error);
      }
    );
  }

  // Generic methods
  async get<T>(url: string, params?: any): Promise<T> {
    const response = await this.api.get<T>(url, { params });
    return response.data;
  }

  async post<T>(url: string, data?: any): Promise<T> {
    const response = await this.api.post<T>(url, data);
    return response.data;
  }

  async put<T>(url: string, data?: any): Promise<T> {
    const response = await this.api.put<T>(url, data);
    return response.data;
  }

  async patch<T>(url: string, data?: any): Promise<T> {
    const response = await this.api.patch<T>(url, data);
    return response.data;
  }

  async delete<T>(url: string): Promise<T> {
    const response = await this.api.delete<T>(url);
    return response.data;
  }
}

export const apiService = new ApiService();
export default apiService;