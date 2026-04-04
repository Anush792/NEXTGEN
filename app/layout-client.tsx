'use client';

import { ThemeProvider } from '@/lib/ThemeProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import FloatingThemeToggle from '@/components/FloatingThemeToggle';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        {children}
        <FloatingWhatsApp />
        <FloatingThemeToggle />
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
