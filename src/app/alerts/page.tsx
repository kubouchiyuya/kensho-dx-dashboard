"use client";

import { DashboardLayout } from "@/components/dashboard/sidebar-nav";
import { AlertsPanel, LarkIntegrationStatus, QuickActions } from "@/components/dashboard/alerts-panel";

export default function AlertsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">アラート</h1>
          <p className="text-muted-foreground">重要な通知を一元管理</p>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <AlertsPanel />
          </div>
          <div className="space-y-6">
            <LarkIntegrationStatus />
            <QuickActions />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
