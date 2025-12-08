"use client";

import { DashboardLayout } from "@/components/dashboard/sidebar-nav";
import { ScheduleManagement, ScheduleAlerts, TodaysTasks } from "@/components/dashboard/schedule-gantt";

export default function SchedulePage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">工程管理</h1>
          <p className="text-muted-foreground">ガントチャートで進捗を可視化</p>
        </div>
        <ScheduleManagement />
        <div className="grid gap-6 lg:grid-cols-2">
          <ScheduleAlerts />
          <TodaysTasks />
        </div>
      </div>
    </DashboardLayout>
  );
}
