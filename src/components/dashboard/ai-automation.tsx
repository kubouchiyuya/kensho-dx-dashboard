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
  MessageSquare,
  Palette,
  Megaphone,
  LineChart,
  Crown,
  Star,
  Rocket,
  Shield,
  Database,
  Code2,
  GitBranch,
  Activity,
  Flame,
  Quote,
  Compass,
  Trophy
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

// 専門AIエージェント群
interface SpecializedAgent {
  id: string;
  name: string;
  title: string;
  description: string;
  specialty: string[];
  status: 'active' | 'standby' | 'working';
  currentTask?: string;
  icon: React.ElementType;
  gradient: string;
  badge: string;
}

const specializedAgents: SpecializedAgent[] = [
  {
    id: 'design-director',
    name: '建匠デザイン統括',
    title: '日本最強UIUX至高のデザイン責任者',
    description: 'ANDPADを超える最高のUI/UXを追求。建匠ブランドの世界観を体現し、顧客体験を最大化',
    specialty: ['UI/UXデザイン', 'ブランディング', 'ユーザビリティ設計', 'デザインシステム'],
    status: 'active',
    currentTask: 'ダッシュボード最適化中',
    icon: Palette,
    gradient: 'from-pink-500 via-rose-500 to-red-500',
    badge: '最高デザイン責任者'
  },
  {
    id: 'advertising-agent',
    name: '建匠広告AI',
    title: '広告最適化エージェント',
    description: 'Google/Meta/LINE広告を自動最適化。ROASを最大化し、見込み客獲得コストを最小化',
    specialty: ['リスティング広告', 'SNS広告', 'リターゲティング', 'クリエイティブ生成'],
    status: 'working',
    currentTask: 'Meta広告クリエイティブ生成中',
    icon: Megaphone,
    gradient: 'from-blue-500 via-cyan-500 to-teal-500',
    badge: '広告ROI +340%'
  },
  {
    id: 'marketing-strategist',
    name: '建匠マーケティング戦略AI',
    title: 'マーケティング専門戦略構築エージェント',
    description: '100億円達成に向けた包括的マーケティング戦略を立案・実行。データドリブンで成果を最大化',
    specialty: ['市場分析', 'ペルソナ設計', 'カスタマージャーニー', 'コンテンツ戦略'],
    status: 'active',
    currentTask: '高知県シェア拡大戦略策定中',
    icon: LineChart,
    gradient: 'from-amber-500 via-orange-500 to-red-500',
    badge: '戦略構築Expert'
  },
  {
    id: 'deploy-master',
    name: '建匠デプロイマスター',
    title: 'CI/CDデプロイ卓越エージェント',
    description: 'Vercel/AWS/GCPへの自動デプロイ。ゼロダウンタイム、ロールバック、A/Bテストを完全自動化',
    specialty: ['CI/CD', 'Vercel', 'AWS', 'Docker', 'ゼロダウンタイム'],
    status: 'active',
    currentTask: '本番環境デプロイ準備中',
    icon: Rocket,
    gradient: 'from-violet-500 via-purple-500 to-fuchsia-500',
    badge: 'デプロイ成功率99.9%'
  },
  {
    id: 'security-guardian',
    name: '建匠セキュリティガーディアン',
    title: 'Macセキュリティ管理エージェント',
    description: 'システム・ネットワーク・データの360度セキュリティ監視。脆弱性検出と自動修復',
    specialty: ['脆弱性スキャン', '権限管理', 'SSL/TLS', 'ファイアウォール'],
    status: 'active',
    currentTask: 'セキュリティ監査実行中',
    icon: Shield,
    gradient: 'from-emerald-500 via-green-500 to-teal-500',
    badge: '脅威検出0件'
  },
  {
    id: 'memory-optimizer',
    name: '建匠メモリオプティマイザー',
    title: 'メモリ・リソース管理エージェント',
    description: 'コンテキスト圧縮、キャッシュ最適化、メモリリーク検出。システムパフォーマンスを最大化',
    specialty: ['メモリ管理', 'キャッシュ戦略', 'パフォーマンス', 'リソース監視'],
    status: 'active',
    currentTask: 'キャッシュ最適化中',
    icon: Database,
    gradient: 'from-cyan-500 via-sky-500 to-blue-500',
    badge: 'メモリ効率+45%'
  },
  {
    id: 'code-architect',
    name: '建匠コードアーキテクト',
    title: 'Amazon式AIコーディングチーム',
    description: '並列タスク実行、コードレビュー、品質保証。高速開発と高精度を両立するAIチーム',
    specialty: ['並列開発', 'コードレビュー', 'テスト自動化', 'リファクタリング'],
    status: 'working',
    currentTask: 'コード品質チェック実行中',
    icon: Code2,
    gradient: 'from-orange-500 via-amber-500 to-yellow-500',
    badge: 'バグ検出率98%'
  },
  {
    id: 'devops-orchestrator',
    name: '建匠DevOpsオーケストレーター',
    title: 'インフラ・運用統合エージェント',
    description: 'GitHub Actions、モニタリング、ログ分析を統合。開発から運用までシームレスに自動化',
    specialty: ['GitHub Actions', 'モニタリング', 'ログ分析', 'アラート'],
    status: 'active',
    currentTask: 'パイプライン最適化中',
    icon: GitBranch,
    gradient: 'from-slate-500 via-gray-500 to-zinc-500',
    badge: 'MTTR 5分'
  },
  {
    id: 'performance-analyst',
    name: '建匠パフォーマンスアナリスト',
    title: 'システム性能分析エージェント',
    description: 'レスポンスタイム、スループット、ボトルネックを常時分析。最高のUXを維持',
    specialty: ['性能分析', 'ボトルネック検出', 'チューニング', 'Lighthouse'],
    status: 'active',
    currentTask: 'Core Web Vitals最適化中',
    icon: Activity,
    gradient: 'from-red-500 via-rose-500 to-pink-500',
    badge: 'Lighthouse 98点'
  }
];

export function SpecializedAgentsPanel() {
  return (
    <Card className="col-span-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-amber-400 via-yellow-500 to-orange-500 shadow-lg">
              <Crown className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="flex items-center gap-2">
                専門AIエージェント
                <Badge variant="outline" className="bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-700 border-amber-200">
                  <Star className="h-3 w-3 mr-1 fill-amber-500" />
                  Premium
                </Badge>
                <Badge variant="outline" className="bg-gradient-to-r from-violet-50 to-purple-50 text-violet-700 border-violet-200">
                  {specializedAgents.length}体稼働中
                </Badge>
              </CardTitle>
              <CardDescription>日本最高峰のAIスペシャリストチーム - 100億円達成を全方位サポート</CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
          {specializedAgents.map((agent) => (
            <div
              key={agent.id}
              className="relative overflow-hidden rounded-xl border bg-card transition-all hover:shadow-lg hover:-translate-y-1"
            >
              {/* グラデーションヘッダー */}
              <div className={cn("h-2 bg-gradient-to-r", agent.gradient)} />

              <div className="p-5">
                {/* エージェント情報 */}
                <div className="flex items-start gap-4 mb-4">
                  <div className={cn(
                    "p-3 rounded-xl bg-gradient-to-br shadow-lg",
                    agent.gradient
                  )}>
                    <agent.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-sm truncate">{agent.name}</h4>
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        agent.status === 'active' && "bg-green-500 animate-pulse",
                        agent.status === 'working' && "bg-blue-500 animate-pulse",
                        agent.status === 'standby' && "bg-gray-400"
                      )} />
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{agent.title}</p>
                  </div>
                </div>

                {/* バッジ */}
                <Badge
                  variant="outline"
                  className={cn(
                    "mb-3 text-xs",
                    agent.id === 'design-director' && "bg-pink-50 text-pink-700 border-pink-200",
                    agent.id === 'advertising-agent' && "bg-blue-50 text-blue-700 border-blue-200",
                    agent.id === 'marketing-strategist' && "bg-amber-50 text-amber-700 border-amber-200"
                  )}
                >
                  {agent.badge}
                </Badge>

                {/* 説明 */}
                <p className="text-xs text-muted-foreground mb-4 line-clamp-2">
                  {agent.description}
                </p>

                {/* 専門分野 */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {agent.specialty.map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-xs py-0">
                      {skill}
                    </Badge>
                  ))}
                </div>

                {/* 現在のタスク */}
                {agent.currentTask && (
                  <div className="p-2 rounded-lg bg-muted/50 border border-dashed">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                      <span className="text-xs text-muted-foreground">実行中:</span>
                    </div>
                    <p className="text-xs font-medium mt-1">{agent.currentTask}</p>
                  </div>
                )}

                {/* アクションボタン */}
                <div className="flex gap-2 mt-4">
                  <Button size="sm" variant="outline" className="flex-1 text-xs">
                    詳細を見る
                  </Button>
                  <Button size="sm" className={cn(
                    "flex-1 text-xs text-white bg-gradient-to-r",
                    agent.gradient
                  )}>
                    タスクを依頼
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// 100億円マインドブースター - 孫子の兵法・格言・心理的支援
const mindBoostQuotes = [
  {
    quote: "彼を知り己を知れば百戦殆うからず",
    source: "孫子の兵法",
    category: "strategy",
    advice: "競合ANDPADを徹底分析し、建匠の強みを最大化せよ"
  },
  {
    quote: "勝兵は先ず勝ちて而る後に戦いを求め、敗兵は先ず戦いて而る後に勝を求む",
    source: "孫子の兵法",
    category: "preparation",
    advice: "準備が9割。契約前の提案力で勝負は決まっている"
  },
  {
    quote: "善く戦う者は、勝ち易きに勝つ者なり",
    source: "孫子の兵法",
    category: "efficiency",
    advice: "成約しやすい見込み客を優先。効率が100億への近道"
  },
  {
    quote: "始めは処女の如く、終わりは脱兎の如し",
    source: "孫子の兵法",
    category: "execution",
    advice: "慎重な計画、迅速な実行。今月の目標を全力で達成せよ"
  },
  {
    quote: "兵は拙速を聞くも、未だ巧久を睹ざるなり",
    source: "孫子の兵法",
    category: "speed",
    advice: "完璧より速度。70%で動き、走りながら改善せよ"
  },
  {
    quote: "千里の道も一歩から",
    source: "老子",
    category: "persistence",
    advice: "100億円も今日の1件から。一歩一歩を大切に"
  },
  {
    quote: "勝ちに不思議の勝ちあり、負けに不思議の負けなし",
    source: "野村克也",
    category: "analysis",
    advice: "失注案件を必ず分析。そこに100億円へのヒントがある"
  },
  {
    quote: "変化こそ唯一の永遠",
    source: "ヘラクレイトス",
    category: "innovation",
    advice: "市場は変化し続ける。常に進化し続ける建匠であれ"
  }
];

const dailyMilestones = [
  { target: 10, label: "10億円", message: "基盤構築完了！次のステージへ" },
  { target: 20, label: "20億円", message: "地域No.1への足がかり" },
  { target: 30, label: "30億円", message: "高知県トップクラスへ" },
  { target: 50, label: "50億円", message: "四国代表企業へ" },
  { target: 70, label: "70億円", message: "100億円射程圏内！" },
  { target: 100, label: "100億円", message: "ビジョン達成！日本を代表する工務店へ" }
];

export function MindBoosterPanel() {
  // 現在の売上（仮の値、実際はデータから取得）
  const currentRevenue = 28; // 億円
  const targetRevenue = 100;
  const progressPercent = (currentRevenue / targetRevenue) * 100;

  // 今日の日付に基づいてランダムな格言を選択
  const today = new Date();
  const quoteIndex = (today.getDate() + today.getMonth()) % mindBoostQuotes.length;
  const todaysQuote = mindBoostQuotes[quoteIndex];

  // 次のマイルストーン
  const nextMilestone = dailyMilestones.find(m => m.target > currentRevenue) || dailyMilestones[dailyMilestones.length - 1];
  const milestoneProgress = ((currentRevenue / nextMilestone.target) * 100);

  return (
    <Card className="col-span-full overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-orange-500/5 to-red-500/5" />
      <CardHeader className="relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 via-red-500 to-rose-500 shadow-lg animate-pulse">
              <Flame className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="flex items-center gap-2">
                100億円マインドブースター
                <Badge variant="outline" className="bg-gradient-to-r from-orange-50 to-red-50 text-orange-700 border-orange-200">
                  <Trophy className="h-3 w-3 mr-1" />
                  2030年ビジョン
                </Badge>
              </CardTitle>
              <CardDescription>心・技・体 - 経営者マインドを高め、チーム全体を鼓舞</CardDescription>
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              {currentRevenue}億円
            </p>
            <p className="text-xs text-muted-foreground">/ 100億円目標</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="relative space-y-6">
        {/* 進捗バー */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium">100億円への道のり</span>
            <span className="font-bold text-orange-600">{progressPercent.toFixed(1)}%達成</span>
          </div>
          <div className="relative h-4 rounded-full bg-gradient-to-r from-slate-100 to-slate-200 overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 rounded-full transition-all duration-1000"
              style={{ width: `${progressPercent}%` }}
            />
            {dailyMilestones.map((milestone) => (
              <div
                key={milestone.target}
                className="absolute top-0 bottom-0 w-0.5 bg-white/50"
                style={{ left: `${(milestone.target / targetRevenue) * 100}%` }}
              />
            ))}
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            {dailyMilestones.slice(0, 4).map((m) => (
              <span key={m.target} className={currentRevenue >= m.target ? "text-orange-600 font-medium" : ""}>
                {m.label}
              </span>
            ))}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {/* 今日の格言 */}
          <div className="p-5 rounded-xl bg-gradient-to-br from-slate-50 to-amber-50 border border-amber-100">
            <div className="flex items-center gap-2 mb-3">
              <Quote className="h-5 w-5 text-amber-600" />
              <span className="font-semibold text-sm text-amber-800">今日の教え</span>
              <Badge variant="secondary" className="text-xs">{todaysQuote.source}</Badge>
            </div>
            <blockquote className="text-lg font-bold text-slate-800 mb-3 leading-relaxed">
              「{todaysQuote.quote}」
            </blockquote>
            <div className="flex items-start gap-2 p-3 rounded-lg bg-white/80 border border-amber-200">
              <Compass className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-slate-700">
                <span className="font-semibold text-amber-700">建匠への示唆：</span>
                {todaysQuote.advice}
              </p>
            </div>
          </div>

          {/* 次のマイルストーン */}
          <div className="p-5 rounded-xl bg-gradient-to-br from-slate-50 to-orange-50 border border-orange-100">
            <div className="flex items-center gap-2 mb-3">
              <Target className="h-5 w-5 text-orange-600" />
              <span className="font-semibold text-sm text-orange-800">次のマイルストーン</span>
            </div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-3xl font-bold text-orange-600">{nextMilestone.label}</span>
              <span className="text-sm text-muted-foreground">
                あと{nextMilestone.target - currentRevenue}億円
              </span>
            </div>
            <Progress value={milestoneProgress} className="h-3 mb-3" />
            <div className="p-3 rounded-lg bg-white/80 border border-orange-200">
              <p className="text-sm font-medium text-slate-700">
                {nextMilestone.message}
              </p>
            </div>
            <div className="mt-3 flex gap-2">
              <Button size="sm" className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white">
                <Flame className="h-4 w-4 mr-1" />
                今日の目標を確認
              </Button>
            </div>
          </div>
        </div>

        {/* モチベーションメッセージ */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-white/20">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="font-bold">「家族の笑顔を生み出す」建匠の挑戦</p>
                <p className="text-sm opacity-90">高知から日本を代表する工務店へ - 毎日の一歩が歴史を作る</p>
              </div>
            </div>
            <Button variant="secondary" size="sm" className="bg-white/20 hover:bg-white/30 text-white border-0">
              チームに共有
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
