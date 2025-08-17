'use client';

import { MainLayout } from '@/components/layout/main-layout';

export default function MorePage() {
  return (
    <MainLayout title="More">
      <div className="container mx-auto px-4 py-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-4">More Options</h2>
          <p className="text-muted-foreground">
            Settings, analytics, and additional features coming soon
          </p>
        </div>
      </div>
    </MainLayout>
  );
}