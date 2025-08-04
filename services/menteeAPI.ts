import { Mentee, Meeting, PrayerRequest } from '@/types/mentee';
import { authService, AuthResponse, LoginCredentials, UserResponse } from './authService';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

class MenteeAPI {
  private async getAuthHeaders(): Promise<Record<string, string>> {
    const token = await authService.getAccessToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  }

  private async refreshTokenIfNeeded(): Promise<void> {
    const accessToken = await authService.getAccessToken();
    const refreshToken = await authService.getRefreshToken();
    
    if (accessToken && authService.isTokenExpired(accessToken) && refreshToken) {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${refreshToken}`,
          },
        });
        
        if (response.ok) {
          const { accessToken: newAccessToken, refreshToken: newRefreshToken } = await response.json();
          await authService.storeTokens({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken || refreshToken,
          });
        } else {
          // Refresh failed, clear tokens and redirect to login
          await authService.clearTokens();
          throw new Error('Session expired. Please log in again.');
        }
      } catch (error) {
        await authService.clearTokens();
        throw new Error('Session expired. Please log in again.');
      }
    }
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    // Try to refresh token if needed before making the request
    await this.refreshTokenIfNeeded();
    
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = await this.getAuthHeaders();
    
    const config: RequestInit = {
      headers,
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (response.status === 401) {
        // Token might be invalid, try to refresh and retry once
        await this.refreshTokenIfNeeded();
        const newHeaders = await this.getAuthHeaders();
        
        const retryResponse = await fetch(url, {
          ...config,
          headers: newHeaders,
        });
        
        if (!retryResponse.ok) {
          throw new Error(`API Error: ${retryResponse.status} - ${retryResponse.statusText}`);
        }
        
        return await retryResponse.json();
      }
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} - ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // Authentication methods
  async login(credentials: LoginCredentials): Promise<AuthResponse> {    
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Login failed: ${response.status} - ${response.statusText} - ${errorText}`);
      }

      const authResponse: AuthResponse = await response.json();
      
      // Store tokens securely
      await authService.storeTokens({
        accessToken: authResponse.access_token,
        refreshToken: authResponse.refresh_token,
      });

      return authResponse;
    } catch (error) {
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      // Call logout endpoint to invalidate tokens on server
      await this.request('/auth/logout', {
        method: 'POST',
      });
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      // Always clear local tokens
      await authService.clearTokens();
    }
  }

  async register(userData: {
    name: string;
    email: string;
    birthdate: string;
    phoneNumber?: string;
    username: string;
    password: string;
  }): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/mentor`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: userData.name,
        email: userData.email,
        birthdate: userData.birthdate,
        phoneNumber: userData.phoneNumber,
        userName: userData.username,
        pass: userData.password,
      }),
    });

    if (!response.ok) {
      throw new Error(`Registration failed: ${response.status} - ${response.statusText}`);
    }

    const authResponse: AuthResponse = await response.json();
    console.log("🚀 ~ MenteeAPI ~ register ~ authResponse:", authResponse)

    return authResponse;
  }

  // Mentee operations
  async getMentees(): Promise<Mentee[]> {
    return this.request<Mentee[]>('/mentees/list/94f98a87-4859-4bc0-a809-b4c41b2638d7');
  }

  async getMenteeById(id: string): Promise<Mentee> {
    return this.request<Mentee>(`/mentees/${id}`);
  }

  async createMentee(mentee: Omit<Mentee, 'id'>): Promise<Mentee> {
    return this.request<Mentee>('/mentees', {
      method: 'POST',
      body: JSON.stringify(mentee),
    });
  }

  async updateMentee(id: string, mentee: Partial<Mentee>): Promise<Mentee> {
    return this.request<Mentee>(`/mentees/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(mentee),
    });
  }

  async deleteMentee(id: string): Promise<void> {
    return this.request<void>(`/mentees/${id}`, {
      method: 'DELETE',
    });
  }

  // Meeting operations
  async createMeeting(meeting: Omit<Meeting, 'id'>): Promise<Meeting> {
    return this.request<Meeting>('/meetings', {
      method: 'POST',
      body: JSON.stringify(meeting),
    });
  }

  async updateMeeting(id: string, meeting: Partial<Meeting>): Promise<Meeting> {
    return this.request<Meeting>(`/meetings/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(meeting),
    });
  }

  // Prayer request operations
  async createPrayerRequest(request: Omit<PrayerRequest, 'id'>): Promise<PrayerRequest> {
    return this.request<PrayerRequest>('/prayer-requests', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async updatePrayerRequest(id: string, request: Partial<PrayerRequest>): Promise<PrayerRequest> {
    return this.request<PrayerRequest>(`/prayer-requests/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(request),
    });
  }
}

export const menteeAPI = new MenteeAPI();
