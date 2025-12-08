"use client";

import { DashboardLayout } from "@/components/dashboard/sidebar-nav";
import { CostOverview, ProjectCostTable, CostCategoryChart, MarginAlerts } from "@/components/dashboard/cost-management";

export default function CostsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">原価管理</h1>
          <p className="text-muted-foreground">リアルタイム原価監視・粗利管理</p>
        </div>
        <CostOverview />
        <ProjectCostTable />
        <div className="grid gap-6 lg:grid-cols-2">
          <CostCategoryChart />
          <MarginAlerts />
        </div>
      </div>
    </DashboardLayout>
  );
}
