'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LoginForm } from '@/components/auth/login-form';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useAuthStore } from '@/lib/stores/auth';

export default function LoginPage() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/today');
    }
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="flex justify-end p-4">
        <ThemeToggle />
      </header>
      
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 mx-auto bg-primary rounded-2xl flex items-center justify-center">
              <div className="w-8 h-8 bg-primary-foreground rounded-lg" />
            </div>
            <h1 className="text-3xl font-bold text-primary">Tamiti Lanes</h1>
            <p className="text-muted-foreground">
              Your smart day planner that keeps work and life in harmony
            </p>
          </div>
          
          <LoginForm />
        </div>
      </div>
    </div>
  );
}