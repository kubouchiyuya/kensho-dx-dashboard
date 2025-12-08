"use client";

import { DashboardLayout } from "@/components/dashboard/sidebar-nav";
import { AIAutomationPanel, AIRecommendations, KnowledgeBase, WorkflowAutomation, SpecializedAgentsPanel } from "@/components/dashboard/ai-automation";
import { LarkIntegrationStatus } from "@/components/dashboard/alerts-panel";

export default function AutomationPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">AI自動化</h1>
          <p className="text-muted-foreground">属人化を排除し、業務を自動化 - 日本最強のAIチームが支援</p>
        </div>
        {/* 専門AIエージェント - 目玉機能として最上部に配置 */}
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
      </div>
    </DashboardLayout>
  );
}
