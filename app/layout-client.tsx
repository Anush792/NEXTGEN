'use client';

import { ThemeProvider } from '@/lib/ThemeProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import FloatingThemeToggle from '@/components/FloatingThemeToggle';
import FloatingAIChat from '@/components/FloatingAIChat';
import { AuthProvider } from '@/contexts/AuthContext';
import ButterfliesBackground from '@/components/ButterfliesBackground';

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
      <AuthProvider>
        <ThemeProvider>
          <div className="relative min-h-screen">
            {/* Animated Background - visible on all pages */}
            <ButterfliesBackground />
            
            {/* Main content with smooth transitions */}
            <main className="relative z-10 transition-all duration-500 ease-in-out">
              {children}
            </main>
            
            {/* Floating elements */}
            <FloatingWhatsApp />
            <FloatingThemeToggle />
            <FloatingAIChat />
            <Toaster />
          </div>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
