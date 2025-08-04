import { useEffect } from 'react';
import { useMenteeStore } from '@/store/menteeStore';
import { useAuthStore } from '@/store/authStore';

export function useAppInitialization() {
  const fetchMentees = useMenteeStore((state) => state.fetchMentees);
  const menteeLoading = useMenteeStore((state) => state.loading);
  const menteeError = useMenteeStore((state) => state.error);
  
  const checkAuthStatus = useAuthStore((state) => state.checkAuthStatus);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const authLoading = useAuthStore((state) => state.loading);
  const authError = useAuthStore((state) => state.error);

  useEffect(() => {
    // First check authentication status
    checkAuthStatus();
  }, [checkAuthStatus]);

  useEffect(() => {
    // Fetch mentees only if authenticated and not loading
    if (isAuthenticated && !authLoading) {
      fetchMentees();
    }
  }, [isAuthenticated, authLoading, fetchMentees]);

  return { 
    loading: authLoading || menteeLoading,
    error: authError || menteeError,
    isAuthenticated,
  };
}
