"use client";

import { DashboardLayout } from "@/components/dashboard/sidebar-nav";
import { KPICards } from "@/components/dashboard/kpi-cards";
import { SalesChart, ProfitTrendChart } from "@/components/dashboard/sales-chart";
import { PipelineBoard, PipelineSummary } from "@/components/dashboard/pipeline-board";
import { AIAutomationPanel, AIRecommendations, KnowledgeBase, WorkflowAutomation, SpecializedAgentsPanel, MindBoosterPanel } from "@/components/dashboard/ai-automation";
import { CostOverview, ProjectCostTable, CostCategoryChart, MarginAlerts } from "@/components/dashboard/cost-management";
import { ScheduleManagement, ScheduleAlerts, TodaysTasks } from "@/components/dashboard/schedule-gantt";
import { AlertsPanel, LarkIntegrationStatus, QuickActions } from "@/components/dashboard/alerts-panel";
import { sampleKPIs } from "@/lib/data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LayoutDashboard,
  Briefcase,
  Calculator,
  Calendar,
  Brain,
  Bell
} from "lucide-react";

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* ヘッダー - 建匠ブランドスタイル */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-amber-700 to-amber-900 bg-clip-text text-transparent">
              経営ダッシュボード
            </h1>
            <p className="text-muted-foreground flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-amber-500"></span>
              "家族の笑顔を生み出す" 2030年100億円ビジョン
            </p>
          </div>
          <div className="text-right bg-gradient-to-br from-slate-50 to-amber-50 rounded-lg p-3 border border-amber-100">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">最終更新</p>
            <p className="text-lg font-semibold text-slate-700">
              {new Date().toLocaleString('ja-JP', {
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        </div>

        {/* KPIカード */}
        <KPICards kpis={sampleKPIs} />

        {/* タブナビゲーション */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-6 lg:w-auto lg:inline-grid">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <LayoutDashboard className="h-4 w-4" />
              <span className="hidden sm:inline">概要</span>
            </TabsTrigger>
            <TabsTrigger value="sales" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              <span className="hidden sm:inline">営業</span>
            </TabsTrigger>
            <TabsTrigger value="costs" className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              <span className="hidden sm:inline">原価</span>
            </TabsTrigger>
            <TabsTrigger value="schedule" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">工程</span>
            </TabsTrigger>
            <TabsTrigger value="automation" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              <span className="hidden sm:inline">AI自動化</span>
            </TabsTrigger>
            <TabsTrigger value="alerts" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">アラート</span>
            </TabsTrigger>
          </TabsList>

          {/* 概要タブ */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-6">
              <SalesChart />
              <ProfitTrendChart />
            </div>
            <div className="grid gap-6 lg:grid-cols-4">
              <div className="lg:col-span-2">
                <AIRecommendations />
              </div>
              <TodaysTasks />
              <AlertsPanel />
            </div>
          </TabsContent>

          {/* 営業タブ */}
          <TabsContent value="sales" className="space-y-6">
            <PipelineBoard />
            <div className="grid gap-6 lg:grid-cols-3">
              <PipelineSummary />
              <QuickActions />
            </div>
          </TabsContent>

          {/* 原価タブ */}
          <TabsContent value="costs" className="space-y-6">
            <CostOverview />
            <ProjectCostTable />
            <div className="grid gap-6 lg:grid-cols-2">
              <CostCategoryChart />
              <MarginAlerts />
            </div>
          </TabsContent>

          {/* 工程タブ */}
          <TabsContent value="schedule" className="space-y-6">
            <ScheduleManagement />
            <div className="grid gap-6 lg:grid-cols-2">
              <ScheduleAlerts />
              <TodaysTasks />
            </div>
          </TabsContent>

          {/* AI自動化タブ */}
          <TabsContent value="automation" className="space-y-6">
            <SpecializedAgentsPanel />
            <AIAutomationPanel />
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <AIRecommendations />
              </div>
              <WorkflowAutomation />
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
              <KnowledgeBase />
              <LarkIntegrationStatus />
            </div>
          </TabsContent>

          {/* アラートタブ */}
          <TabsContent value="alerts" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <AlertsPanel />
              </div>
              <div className="space-y-6">
                <LarkIntegrationStatus />
                <QuickActions />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* フッター - 建匠ブランド */}
        <div className="border-t border-amber-100 pt-6 text-center">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-50 to-slate-50 px-6 py-3 rounded-full">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center">
              <span className="text-white text-xs font-bold">建</span>
            </div>
            <span className="font-semibold text-slate-700">建匠DX</span>
            <span className="text-muted-foreground">- AI×DXで売上と利益を同時に最大化</span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Powered by <span className="font-medium text-slate-600">Miyabi</span> |
            属人化排除 | 業務自動化率 <span className="text-emerald-600 font-semibold">80%</span>
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
