# JWT Authentication Setup Guide

## Overview
Your app now includes complete JWT authentication with secure token storage, automatic refresh, and proper error handling.

## Features Added

### 1. Authentication Service (`/services/authService.ts`)
- Secure token storage using Expo SecureStore
- Token expiration checking
- Automatic token refresh handling
- Session management

### 2. Enhanced API Service (`/services/menteeAPI.ts`)
- JWT token injection in all API calls
- Automatic token refresh on 401 responses
- Login, register, and logout endpoints
- Proper error handling

### 3. Authentication Store (`/store/authStore.ts`)
- Global auth state management
- Login/register/logout actions
- Error handling
- Loading states

### 4. Login Screen (`/app/login.tsx`)
- Clean, user-friendly login/register form
- Input validation
- Error display
- Loading states

### 5. Protected Routes
- Automatic redirection to login if not authenticated
- Session validation on app start

## Setup Instructions

### 1. Environment Configuration
Create a `.env.local` file in your project root:

```env
EXPO_PUBLIC_API_URL=https://your-api-domain.com/api
```

For local development:
```env
EXPO_PUBLIC_API_URL=http://localhost:3000/api
```

### 2. Backend API Endpoints Required

Your backend should implement these endpoints:

#### Authentication Endpoints:
- `POST /auth/login` - User login
- `POST /auth/register` - User registration  
- `POST /auth/refresh-token` - Token refresh

#### Request/Response Examples:

**Login Request:**
```json
{
  "userName": "user@example.com",
  "pass": "password123"
}
```

**Login/Register Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Refresh Token Request:**
```json
Headers: {
  "Authorization": "Bearer <refresh_token>"
}
```

### 3. Token Structure
Your JWT tokens should include these claims:
```json
{
  "sub": "user-id",
  "email": "user@example.com",
  "exp": 1642694400,
  "iat": 1642608000
}
```

## Usage

### Login a User
```typescript
import { useAuthStore } from '@/store/authStore';

const { login, loading, error } = useAuthStore();

try {
  await login({ userName: 'user@example.com', pass: 'password' });
  // User is now logged in
} catch (error) {
  // Handle login error
}
```

### Check Authentication Status
```typescript
import { useAuthStore } from '@/store/authStore';

const { isAuthenticated, user } = useAuthStore();

if (isAuthenticated) {
  console.log('User:', user);
}
```

### Logout
```typescript
import { useAuthStore } from '@/store/authStore';

const { logout } = useAuthStore();

await logout();
// User is logged out and redirected to login
```

### Make Authenticated API Calls
```typescript
import { menteeAPI } from '@/services/menteeAPI';

// All API calls automatically include JWT token
const mentees = await menteeAPI.getMentees();
```

## Security Features

1. **Secure Storage**: Tokens stored in device keychain/keystore
2. **Auto Refresh**: Expired tokens automatically refreshed
3. **Session Validation**: Checks on app start and deep links
4. **Proper Cleanup**: Tokens cleared on logout
5. **Error Handling**: Graceful handling of auth failures

## Testing

1. Start your app: `npm run dev`
2. You'll be redirected to login screen
3. Enter credentials to login
4. Navigate to Settings to see user info and logout

## Troubleshooting

### Common Issues:

1. **"Session expired" errors**: Check your backend token expiration times
2. **401 Unauthorized**: Verify your API endpoint URLs
3. **Network errors**: Ensure your API is running and accessible

### Debug Tips:

- Check console logs for API request details
- Verify environment variables are loaded
- Test API endpoints directly with Postman/curl
- Check token structure in backend logs

Your app now has enterprise-grade authentication! 🔐
