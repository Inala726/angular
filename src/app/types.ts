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

export interface NewDevice{
  name:string,
  protocol:string,
  status:'offline' | 'online'
}

export interface Device {
  id: string;
  name: string;
  protocol: string;
  status: 'online' | 'offline';
  ownerId: string;
}

export interface DeviceResponse {
  message: string;
  data: Device;
}

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}