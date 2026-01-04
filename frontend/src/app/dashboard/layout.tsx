'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { setAuthToken, auth } from '@/lib/api';
import { calculateAge } from '@/lib/utils';
import { ProfileDialog } from '@/components/dashboard/profile-dialog';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    } else {
      setAuthToken(token);
      setIsLoading(false);
    }
  }, [router]);

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const response = await auth.me();
      return response.data;
    },
    enabled: !isLoading,
  });

  const age = calculateAge(user?.birth_date);

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card shadow sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-4 py-2 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <h1 
            className="text-xl sm:text-3xl font-bold tracking-tight text-foreground cursor-pointer"
            onClick={() => router.push('/dashboard')}
          >
            Body Fat Tracker
          </h1>
          
          {user && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted px-4 py-2 rounded-full">
              <span className="font-semibold text-foreground">{user.full_name || 'User'}</span>
              <span className="text-muted-foreground/30">|</span>
              <span>{user.sex === 'M' ? 'Male' : user.sex === 'F' ? 'Female' : user.sex || 'Sex not set'}</span>
              <span className="text-muted-foreground/30">|</span>
              <span>{age !== null ? `${age} years old` : 'Age not set'}</span>
            </div>
          )}

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <ProfileDialog />
            <Button
              variant="ghost"
              onClick={() => {
                localStorage.removeItem('token');
                router.push('/login');
              }}
            >
              Logout
            </Button>
          </div>
        </div>
      </header>
      <main>
        <div className="mx-auto max-w-7xl py-4 sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
}
