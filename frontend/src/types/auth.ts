export interface AuthUser {
  id: string;
  email: string;
  name: string;
}

export interface AuthResponse {
  access_token: string;
  user: AuthUser;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}
