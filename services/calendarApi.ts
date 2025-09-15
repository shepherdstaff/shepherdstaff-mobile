import Constants from 'expo-constants';
import * as Linking from 'expo-linking';
import { authService } from './authService';
// Helper to get the redirect URI for Google OAuth
export function getGoogleOAuthRedirectUri() {
  // This will be shepherdstaffmobile://oauthredirect
  return Linking.createURL('oauthredirect');
}

const BACKEND_URL =
  Constants.expoConfig?.extra?.API_URL || process.env.EXPO_PUBLIC_API_URL || '';

export async function startGoogleOAuth(redirectUri: string) {
  try {
    const accessToken = await authService.getAccessToken();
    const url = `${BACKEND_URL}/calendar/start-google-oauth?redirectUri=${encodeURIComponent(
      redirectUri
    )}`;
    const response = await fetch(url, {
      headers: accessToken
        ? { Authorization: `Bearer ${accessToken}` }
        : undefined,
    });
    if (!response.ok) {
      throw new Error('Failed to start Google OAuth');
    }
    const data = await response.json();
    return data.link; // The link the user should visit
  } catch (error) {
    console.error('Error in startGoogleOAuth:', error);
    throw error;
  }
}
