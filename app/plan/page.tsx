'use client';

import { MainLayout } from '@/components/layout/main-layout';

export default function PlanPage() {
  return (
    <MainLayout title="Plan" showLaneToggle={true} showReplanButton={true}>
      <div className="container mx-auto px-4 py-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-4">Plan View</h2>
          <p className="text-muted-foreground">
            Week and Month planning views coming soon
          </p>
        </div>
      </div>
    </MainLayout>
  );
}