"use client";

import { DashboardLayout } from "@/components/dashboard/sidebar-nav";
import { PipelineBoard, PipelineSummary } from "@/components/dashboard/pipeline-board";
import { QuickActions } from "@/components/dashboard/alerts-panel";

export default function DealsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">商談管理</h1>
          <p className="text-muted-foreground">営業パイプラインの一元管理</p>
        </div>
        <PipelineBoard />
        <div className="grid gap-6 lg:grid-cols-3">
          <PipelineSummary />
          <QuickActions />
        </div>
      </div>
    </DashboardLayout>
  );
}
