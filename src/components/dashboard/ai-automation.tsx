"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Brain,
  Sparkles,
  Bot,
  Zap,
  Target,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowRight,
  Lightbulb,
  RefreshCw,
  Send,
  FileText,
  Calculator,
  Calendar,
  Users,
  MessageSquare
} from "lucide-react";
import { cn } from "@/lib/utils";

// AI自動化タスク定義
interface AutomationTask {
  id: string;
  name: string;
  description: string;
  category: 'sales' | 'cost' | 'schedule' | 'report' | 'communication';
  frequency: 'realtime' | 'hourly' | 'daily' | 'weekly';
  status: 'active' | 'pending' | 'disabled';
  lastRun?: string;
  nextRun?: string;
  savings: string; // 削減時間/コスト
}

const automationTasks: AutomationTask[] = [
  {
    id: 'auto-1',
    name: '商談フォローアップ自動リマインド',
    description: '次回アクション日の前日にLark通知を自動送信',
    category: 'sales',
    frequency: 'daily',
    status: 'active',
    lastRun: '2024-12-08 09:00',
    nextRun: '2024-12-09 09:00',
    savings: '週2時間削減'
  },
  {
    id: 'auto-2',
    name: '原価超過アラート',
    description: '予定原価の90%到達時に自動警告',
    category: 'cost',
    frequency: 'realtime',
    status: 'active',
    lastRun: '2024-12-08 14:30',
    savings: '粗利改善3%'
  },
  {
    id: 'auto-3',
    name: '工程遅延予測',
    description: 'AI分析により3日前に遅延リスクを予測',
    category: 'schedule',
    frequency: 'daily',
    status: 'active',
    lastRun: '2024-12-08 06:00',
    nextRun: '2024-12-09 06:00',
    savings: '遅延50%削減'
  },
  {
    id: 'auto-4',
    name: '日次経営レポート自動生成',
    description: 'KPI・売上・粗利をまとめて毎日18時に送信',
    category: 'report',
    frequency: 'daily',
    status: 'active',
    lastRun: '2024-12-07 18:00',
    nextRun: '2024-12-08 18:00',
    savings: '週3時間削減'
  },
  {
    id: 'auto-5',
    name: '見積書AI自動作成',
    description: '過去データを学習し見積書ドラフトを自動生成',
    category: 'sales',
    frequency: 'realtime',
    status: 'active',
    savings: '見積作成80%短縮'
  },
  {
    id: 'auto-6',
    name: '協力会社自動マッチング',
    description: '工事内容・日程から最適な協力会社を推薦',
    category: 'schedule',
    frequency: 'realtime',
    status: 'active',
    savings: '調整時間70%削減'
  },
  {
    id: 'auto-7',
    name: '材料発注タイミング最適化',
    description: '工程と在庫から最適な発注時期をAI予測',
    category: 'cost',
    frequency: 'daily',
    status: 'active',
    savings: '在庫コスト15%削減'
  },
  {
    id: 'auto-8',
    name: '顧客満足度予測',
    description: 'コミュニケーション頻度からクレームリスクを予測',
    category: 'communication',
    frequency: 'weekly',
    status: 'active',
    savings: 'クレーム40%削減'
  }
];

// AI分析レコメンデーション
interface AIRecommendation {
  id: string;
  type: 'opportunity' | 'risk' | 'efficiency';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  action: string;
  impact: string;
}

const aiRecommendations: AIRecommendation[] = [
  {
    id: 'rec-1',
    type: 'opportunity',
    priority: 'high',
    title: '渡辺様への提案タイミング',
    description: 'AI分析: 今週中のモデルハウス案内で成約率が32%向上します',
    action: 'モデルハウス案内を予約',
    impact: '+¥5,000万の受注可能性'
  },
  {
    id: 'rec-2',
    type: 'risk',
    priority: 'high',
    title: '山田邸の工程遅延リスク',
    description: '確認申請の遅延が基礎工事に影響する可能性を検出',
    action: '設計部に優先対応を依頼',
    impact: '2週間の遅延回避'
  },
  {
    id: 'rec-3',
    type: 'efficiency',
    priority: 'medium',
    title: '外注費最適化提案',
    description: 'A社の代わりにB社を使用することで15%コスト削減可能',
    action: 'B社に見積依頼',
    impact: '¥45万のコスト削減'
  },
  {
    id: 'rec-4',
    type: 'opportunity',
    priority: 'medium',
    title: '鈴木様へのアップセル機会',
    description: 'リフォーム検討中の鈴木様に外構工事の提案が有効',
    action: '外構プランを提示',
    impact: '+¥150万の追加受注'
  }
];

const categoryIcons: Record<string, React.ElementType> = {
  sales: Target,
  cost: Calculator,
  schedule: Calendar,
  report: FileText,
  communication: MessageSquare
};

const categoryColors: Record<string, string> = {
  sales: 'bg-blue-100 text-blue-700',
  cost: 'bg-green-100 text-green-700',
  schedule: 'bg-purple-100 text-purple-700',
  report: 'bg-orange-100 text-orange-700',
  communication: 'bg-pink-100 text-pink-700'
};

export function AIAutomationPanel() {
  const activeCount = automationTasks.filter(t => t.status === 'active').length;

  return (
    <Card className="col-span-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle>AI自動化センター</CardTitle>
              <CardDescription>属人化を排除し、業務を自動化</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-green-50">
              <Zap className="h-3 w-3 mr-1" />
              {activeCount}件 稼働中
            </Badge>
            <Button size="sm" variant="outline">
              <RefreshCw className="h-4 w-4 mr-1" />
              全タスク実行
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {automationTasks.map((task) => {
            const Icon = categoryIcons[task.category];
            return (
              <div
                key={task.id}
                className={cn(
                  "p-4 rounded-lg border transition-all hover:shadow-md",
                  task.status === 'active' ? "bg-card" : "bg-muted/50 opacity-60"
                )}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className={cn("p-1.5 rounded", categoryColors[task.category])}>
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <Badge
                    variant={task.status === 'active' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {task.frequency === 'realtime' ? 'リアルタイム' :
                     task.frequency === 'hourly' ? '毎時' :
                     task.frequency === 'daily' ? '毎日' : '毎週'}
                  </Badge>
                </div>
                <h4 className="font-medium text-sm mb-1">{task.name}</h4>
                <p className="text-xs text-muted-foreground mb-2">{task.description}</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-green-600 font-medium">{task.savings}</span>
                  {task.lastRun && (
                    <span className="text-muted-foreground">
                      最終: {task.lastRun.split(' ')[1]}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

export function AIRecommendations() {
  return (
    <Card className="col-span-full lg:col-span-2">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-amber-500" />
          <CardTitle>AIレコメンデーション</CardTitle>
        </div>
        <CardDescription>データ分析に基づく行動提案</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {aiRecommendations.map((rec) => (
          <div
            key={rec.id}
            className={cn(
              "p-4 rounded-lg border-l-4 transition-all hover:shadow-sm",
              rec.type === 'opportunity' && "border-l-blue-500 bg-blue-50/50",
              rec.type === 'risk' && "border-l-red-500 bg-red-50/50",
              rec.type === 'efficiency' && "border-l-green-500 bg-green-50/50"
            )}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                {rec.type === 'opportunity' && <Lightbulb className="h-4 w-4 text-blue-500" />}
                {rec.type === 'risk' && <AlertTriangle className="h-4 w-4 text-red-500" />}
                {rec.type === 'efficiency' && <TrendingUp className="h-4 w-4 text-green-500" />}
                <span className="font-medium text-sm">{rec.title}</span>
              </div>
              <Badge
                variant="outline"
                className={cn(
                  "text-xs",
                  rec.priority === 'high' && "border-red-300 text-red-700",
                  rec.priority === 'medium' && "border-amber-300 text-amber-700",
                  rec.priority === 'low' && "border-gray-300 text-gray-700"
                )}
              >
                {rec.priority === 'high' ? '要対応' : rec.priority === 'medium' ? '推奨' : '参考'}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mb-2">{rec.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-green-600">{rec.impact}</span>
              <Button size="sm" variant="ghost" className="h-7 text-xs">
                {rec.action}
                <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

// 知識ベース・ナレッジ共有
export function KnowledgeBase() {
  const knowledgeItems = [
    { id: 1, title: '見積作成マニュアル', category: '営業', views: 45, updated: '2024-12-05' },
    { id: 2, title: '確認申請チェックリスト', category: '設計', views: 32, updated: '2024-12-01' },
    { id: 3, title: '現場安全管理規定', category: '工務', views: 28, updated: '2024-11-20' },
    { id: 4, title: 'クレーム対応フロー', category: '全社', views: 67, updated: '2024-12-07' },
    { id: 5, title: '協力会社選定基準', category: '工務', views: 23, updated: '2024-11-15' },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-500" />
          <CardTitle className="text-base">ナレッジベース</CardTitle>
        </div>
        <CardDescription>属人化排除のための共有知識</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {knowledgeItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-2 rounded hover:bg-muted/50 cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">{item.category}</Badge>
                <span className="text-sm">{item.title}</span>
              </div>
              <span className="text-xs text-muted-foreground">{item.views}回閲覧</span>
            </div>
          ))}
        </div>
        <Button variant="outline" className="w-full mt-3" size="sm">
          すべて表示
        </Button>
      </CardContent>
    </Card>
  );
}

// 業務フロー自動化ステータス
export function WorkflowAutomation() {
  const workflows = [
    { name: '受注→着工', automation: 85, manual: 15 },
    { name: '見積作成', automation: 70, manual: 30 },
    { name: '工程管理', automation: 60, manual: 40 },
    { name: '原価管理', automation: 90, manual: 10 },
    { name: '報告業務', automation: 95, manual: 5 },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-purple-500" />
          <CardTitle className="text-base">業務自動化率</CardTitle>
        </div>
        <CardDescription>目標: 全業務の80%自動化</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {workflows.map((wf) => (
          <div key={wf.name}>
            <div className="flex justify-between text-sm mb-1">
              <span>{wf.name}</span>
              <span className="font-medium">{wf.automation}%</span>
            </div>
            <div className="flex h-2 rounded-full overflow-hidden bg-muted">
              <div
                className="bg-gradient-to-r from-purple-500 to-violet-500"
                style={{ width: `${wf.automation}%` }}
              />
            </div>
          </div>
        ))}
        <div className="pt-2 border-t">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">平均自動化率</span>
            <span className="font-bold text-purple-600">
              {Math.round(workflows.reduce((sum, w) => sum + w.automation, 0) / workflows.length)}%
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
