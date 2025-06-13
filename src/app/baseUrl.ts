export const BASE_URL = 'http://localhost:3010/api/v1';
export const AUTH_URL = `${BASE_URL}/auth`;

export interface SignUpRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: 'USER' | 'ADMIN';
}

export interface ApiResponse {
  error: boolean;
  message: string;
  data?: any; // For additional data if needed
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse{
  accessToken:string
  refreshToken:string
}