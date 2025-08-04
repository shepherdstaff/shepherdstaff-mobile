import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'jwt_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}

export interface LoginCredentials {
  userName: string;
  pass: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken?: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

class AuthService {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  async initialize(): Promise<void> {
    try {
      this.accessToken = await SecureStore.getItemAsync(TOKEN_KEY);
      this.refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error('Failed to initialize auth tokens:', error);
    }
  }

  async storeTokens(tokens: AuthTokens): Promise<void> {
    try {
      this.accessToken = tokens.accessToken;
      await SecureStore.setItemAsync(TOKEN_KEY, tokens.accessToken);
      
      if (tokens.refreshToken) {
        this.refreshToken = tokens.refreshToken;
        await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, tokens.refreshToken);
      }
    } catch (error) {
      console.error('Failed to store tokens:', error);
      throw error;
    }
  }

  async getAccessToken(): Promise<string | null> {
    if (this.accessToken) {
      return this.accessToken;
    }
    
    try {
      this.accessToken = await SecureStore.getItemAsync(TOKEN_KEY);
      return this.accessToken;
    } catch (error) {
      console.error('Failed to get access token:', error);
      return null;
    }
  }

  async getRefreshToken(): Promise<string | null> {
    if (this.refreshToken) {
      return this.refreshToken;
    }
    
    try {
      this.refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
      return this.refreshToken;
    } catch (error) {
      console.error('Failed to get refresh token:', error);
      return null;
    }
  }

  async clearTokens(): Promise<void> {
    try {
      this.accessToken = null;
      this.refreshToken = null;
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error('Failed to clear tokens:', error);
    }
  }

  isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch (error) {
      console.error('Failed to decode token:', error);
      return true;
    }
  }

  async isAuthenticated(): Promise<boolean> {
    const token = await this.getAccessToken();
    return token !== null && !this.isTokenExpired(token);
  }
}

export const authService = new AuthService();
