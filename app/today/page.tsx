'use client';

import { MainLayout } from '@/components/layout/main-layout';
import { TodayTimeline } from '@/components/today/today-timeline';

export default function TodayPage() {
  return (
    <MainLayout 
      title="Today" 
      showDatePicker={true}
      showLaneToggle={true}
      showReplanButton={true}
    >
      <TodayTimeline />
    </MainLayout>
  );
}