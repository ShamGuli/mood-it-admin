'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box } from '@mui/material';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';
import { Providers } from '../providers';
import { useAuthStore } from '@/store/authStore';
import { createClient } from '@/lib/supabase/client';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, setUser, setLoading } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const supabase = createClient();
        
        // Get current session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          router.push('/login');
          return;
        }

        // Get user profile
        const { data: userData, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (error || !userData || !userData.is_active) {
          await supabase.auth.signOut();
          router.push('/login');
          return;
        }

        setUser(userData);
      } catch (error) {
        console.error('Auth check failed:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router, setUser, setLoading]);

  // Show loading state
  if (!user) {
    return (
      <Providers>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
          }}
        >
          Yüklənir...
        </Box>
      </Providers>
    );
  }

  return (
    <Providers>
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
        
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <TopBar sidebarOpen={sidebarOpen} />
          
          <Box
            component="main"
            sx={{
              flex: 1,
              p: 3,
              mt: 8, // TopBar height
              background: '#2D2C3D',
            }}
          >
            {children}
          </Box>
        </Box>
      </Box>
    </Providers>
  );
}
