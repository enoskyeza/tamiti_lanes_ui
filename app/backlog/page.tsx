'use client';

import { MainLayout } from '@/components/layout/main-layout';

export default function BacklogPage() {
  return (
    <MainLayout title="Backlog" showLaneToggle={true}>
      <div className="container mx-auto px-4 py-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-4">Task Backlog</h2>
          <p className="text-muted-foreground">
            Task management and filtering interface coming soon
          </p>
        </div>
      </div>
    </MainLayout>
  );
}