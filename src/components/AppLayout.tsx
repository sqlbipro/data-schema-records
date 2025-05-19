import React from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { useIsMobile } from '@/hooks/use-mobile';
import TestDataGenerator from './TestDataGenerator';

const AppLayout: React.FC = () => {
  const { sidebarOpen, toggleSidebar } = useAppContext();
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <main className="flex-1 py-8 md:py-12">
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                Test Data Generator
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Generate realistic test data from your database schema with customizable constraints and relationships.
              </p>
            </div>
            <TestDataGenerator />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
