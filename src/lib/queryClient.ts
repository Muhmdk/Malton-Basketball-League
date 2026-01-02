import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Data is considered fresh for 5 minutes
      staleTime: 5 * 60 * 1000,
      // Cache data for 10 minutes
      gcTime: 10 * 60 * 1000,
      // Retry failed queries twice
      retry: 2,
      // Don't refetch on window focus (mobile app behavior)
      refetchOnWindowFocus: false,
      // Refetch when network reconnects
      refetchOnReconnect: true,
    },
  },
});
