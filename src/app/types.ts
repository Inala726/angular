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
export interface UserProfile {
  data: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    emailVerified: boolean;
  };
}

export interface ListUserResponse{
  data: User[]
}
export interface NewDevicePayload {
  name: string;
  protocol: string;
  status: 'online' | 'offline';
}
export interface DeviceResponse {
  message: string;
  data: {
    id: string;
    name: string;
    protocol: string;
    status: 'online' | 'offline';
    ownerId: string;
  };
}
export interface Device {
  id: string;
  name: string;
  protocol: string;
  status: 'online' | 'offline';
  ownerId: string;
}
export interface ListDevicesResponse {
  data: Device[];
}
export interface Alert {
  id: string;
  type: string;
  message: string;
  timestamp: string;
  deviceId: string;
}
export interface AlertsResponse {
  data: Alert[];
}
export interface User{
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  emailVerified: boolean;
}