'use client';

import { useAuthStore } from '@/lib/stores/auth';
import { Header } from './header';
import { BottomTabs } from './bottom-tabs';
import { Sidebar } from './sidebar';
import { FAB } from './fab';

interface MainLayoutProps {
  children: React.ReactNode;
  title: string;
  showDatePicker?: boolean;
  showLaneToggle?: boolean;
  showReplanButton?: boolean;
}

export function MainLayout({ 
  children, 
  title, 
  showDatePicker = false, 
  showLaneToggle = false,
  showReplanButton = false 
}: MainLayoutProps) {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Header 
          title={title}
          showDatePicker={showDatePicker}
          showLaneToggle={showLaneToggle}
          showReplanButton={showReplanButton}
        />
        
        <main className="flex-1 pb-bottom-nav lg:pb-0">
          {children}
        </main>
        
        <BottomTabs />
      </div>
      
      <FAB />
    </div>
  );
}