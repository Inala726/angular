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

// export interface NewDevice{
//   name:string,
//   protocol:string,
//   status:'offline' | 'online'
// }

// export interface Device {
//   id: string;
//   name: string;
//   protocol: string;
//   status: 'online' | 'offline';
//   ownerId: string;
// }

// export interface DeviceResponse {
//   message: string;
//   data: Device;
// }

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

// src/app/types.ts

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

// the “full” device shape your UI actually cares about:
export interface Device {
  id: string;
  name: string;
  protocol: string;
  status: 'online' | 'offline';
  // extra fields you don’t send to the server:
  location: string;
  model?: string;
  description?: string;
  type?:string
}
