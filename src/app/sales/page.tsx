"use client";

import { DashboardLayout } from "@/components/dashboard/sidebar-nav";
import { SalesChart, ProfitTrendChart } from "@/components/dashboard/sales-chart";
import { KPICards } from "@/components/dashboard/kpi-cards";
import { sampleKPIs } from "@/lib/data";

export default function SalesPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">売上・KPI</h1>
          <p className="text-muted-foreground">売上推移と経営指標の詳細分析</p>
        </div>
        <KPICards kpis={sampleKPIs} />
        <div className="grid gap-6 lg:grid-cols-6">
          <SalesChart />
          <ProfitTrendChart />
        </div>
      </div>
    </DashboardLayout>
  );
}
