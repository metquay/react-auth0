import { Auth0DecodedHash, WebAuth } from 'auth0-js';

export interface Auth0Config {
  domain: string;
  clientID: string;
  redirectUri: string;
  audience: string;
  scope: string;
  responseType: string;
}

export interface Auth0ClientValue {
  auth0Client: WebAuth;
  isInitialized: boolean;
  config: Auth0Config;
}

export interface Auth0User {
  email?: string;
  email_verified?: boolean;
  name?: string;
  nickname?: string;
  picture?: string;
  sub?: string;
  updated_at?: string;
  [key: string]: any;
}
  
export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: Auth0User | null;
  error: Error | null;
}
  
export interface AuthResult {
  accessToken: string;
  idToken: string;
  expiresIn: number;
  tokenType: string;
  scope?: string;
}
  
export interface LoginCredentials {
  email: string;
  password: string;
}
  
export interface SignupCredentials extends LoginCredentials {
  name?: string;
}
  
export interface AuthContextValue extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (credentials: SignupCredentials) => Promise<void>;
  logout: () => Promise<void>;
  checkSession: () => Promise<any>;
  getAccessToken: () => string | null;
}

  export type {Auth0DecodedHash}