import React from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { useIsMobile } from '@/hooks/use-mobile';
import TestDataGenerator from './TestDataGenerator';

const AppLayout: React.FC = () => {
  const { sidebarOpen, toggleSidebar } = useAppContext();
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-background">
      <main className="flex-1 p-4 md:p-8">
        <TestDataGenerator />
      </main>
    </div>
  );
};

export default AppLayout;
