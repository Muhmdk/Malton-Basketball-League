import { Stack } from 'expo-router';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { StatusBar } from 'expo-status-bar';

/**
 * Root layout - wraps the entire app
 * Sets up React Query provider and navigation structure
 */
export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar style="auto" />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="player/[id]"
          options={{
            presentation: 'modal',
            title: 'Player Profile',
          }}
        />
        <Stack.Screen
          name="game/[id]"
          options={{
            presentation: 'modal',
            title: 'Box Score',
          }}
        />
      </Stack>
    </QueryClientProvider>
  );
}
