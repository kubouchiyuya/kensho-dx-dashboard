"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/sidebar-nav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Settings,
  Brain,
  Shield,
  Users,
  Bell,
  Share2,
  Printer,
  Link,
  Eye,
  EyeOff,
  Check,
  X,
  Plus,
  Save,
  RefreshCw,
  Sparkles,
  Zap,
  MessageSquare,
  Globe,
  Mail,
  Calendar,
  FileText,
  Cloud,
  Crown,
  Smartphone,
  DollarSign,
  Clock
} from "lucide-react";

// AI プロバイダー設定
interface AIProvider {
  id: string;
  name: string;
  icon: string;
  enabled: boolean;
  apiKey: string;
  model: string;
  endpoint?: string;
  description: string;
}

// ユーザー権限設定
interface UserRole {
  id: string;
  name: string;
  role: 'admin' | 'manager' | 'staff' | 'viewer';
  permissions: string[];
  avatar: string;
}

// 外部連携設定
interface Integration {
  id: string;
  name: string;
  type: string;
  enabled: boolean;
  connected: boolean;
  icon: React.ElementType;
}

const defaultAIProviders: AIProvider[] = [
  {
    id: 'openai',
    name: 'OpenAI (ChatGPT)',
    icon: '🤖',
    enabled: true,
    apiKey: '••••••••••••••••',
    model: 'gpt-4o',
    description: 'GPT-4o, GPT-4 Turbo対応。高度な会話・分析に最適'
  },
  {
    id: 'anthropic',
    name: 'Anthropic (Claude)',
    icon: '🧠',
    enabled: true,
    apiKey: '••••••••••••••••',
    model: 'claude-3-5-sonnet',
    description: 'Claude 3.5 Sonnet/Opus対応。長文処理・コード生成に強み'
  },
  {
    id: 'gemini',
    name: 'Google Gemini',
    icon: '💎',
    enabled: false,
    apiKey: '',
    model: 'gemini-pro',
    description: 'Gemini Pro/Ultra対応。マルチモーダル処理可能'
  },
  {
    id: 'azure',
    name: 'Azure OpenAI',
    icon: '☁️',
    enabled: false,
    apiKey: '',
    model: 'gpt-4',
    endpoint: 'https://your-resource.openai.azure.com/',
    description: 'エンタープライズ向け。セキュリティ・コンプライアンス対応'
  },
  {
    id: 'mcp',
    name: 'MCP Server',
    icon: '🔌',
    enabled: true,
    apiKey: '',
    model: 'custom',
    endpoint: 'http://localhost:3100',
    description: 'Model Context Protocol。ローカルAI・カスタムモデル対応'
  }
];

const defaultUsers: UserRole[] = [
  { id: '1', name: '窪内悠也', role: 'admin', permissions: ['all'], avatar: '👤' },
  { id: '2', name: '山田太郎', role: 'manager', permissions: ['view', 'edit', 'share'], avatar: '👨' },
  { id: '3', name: '佐藤花子', role: 'staff', permissions: ['view', 'edit'], avatar: '👩' },
  { id: '4', name: '鈴木一郎', role: 'viewer', permissions: ['view'], avatar: '🧑' }
];

const defaultIntegrations: Integration[] = [
  { id: 'google', name: 'Google Workspace', type: 'productivity', enabled: true, connected: true, icon: Globe },
  { id: 'lark', name: 'Lark', type: 'communication', enabled: true, connected: true, icon: MessageSquare },
  { id: 'slack', name: 'Slack', type: 'communication', enabled: false, connected: false, icon: MessageSquare },
  { id: 'teams', name: 'Microsoft Teams', type: 'communication', enabled: false, connected: false, icon: Users },
  { id: 'line', name: 'LINE WORKS', type: 'communication', enabled: false, connected: false, icon: Smartphone },
  { id: 'gmail', name: 'Gmail', type: 'email', enabled: true, connected: true, icon: Mail },
  { id: 'gcal', name: 'Google Calendar', type: 'calendar', enabled: true, connected: true, icon: Calendar },
  { id: 'gdrive', name: 'Google Drive', type: 'storage', enabled: true, connected: true, icon: Cloud }
];

const roleLabels: Record<string, { label: string; color: string }> = {
  admin: { label: '管理者', color: 'bg-red-100 text-red-700' },
  manager: { label: 'マネージャー', color: 'bg-blue-100 text-blue-700' },
  staff: { label: 'スタッフ', color: 'bg-green-100 text-green-700' },
  viewer: { label: '閲覧者', color: 'bg-gray-100 text-gray-700' }
};

export default function SettingsPage() {
  const [aiProviders, setAIProviders] = useState(defaultAIProviders);
  const [users] = useState(defaultUsers);
  const [integrations, setIntegrations] = useState(defaultIntegrations);
  const [showApiKey, setShowApiKey] = useState<string | null>(null);
  const [notifications, setNotifications] = useState({
    dailyReport: true,
    weeklyDigest: true,
    alertsRealtime: true,
    aiRecommendations: true,
    scheduleReminders: true,
    costAlerts: true
  });

  const toggleProvider = (id: string) => {
    setAIProviders(prev => prev.map(p =>
      p.id === id ? { ...p, enabled: !p.enabled } : p
    ));
  };

  const toggleIntegration = (id: string) => {
    setIntegrations(prev => prev.map(i =>
      i.id === id ? { ...i, enabled: !i.enabled } : i
    ));
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">設定</h1>
            <p className="text-muted-foreground">AIコネクター・連携・権限管理</p>
          </div>
          <Button className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
            <Save className="h-4 w-4 mr-2" />
            設定を保存
          </Button>
        </div>

        <Tabs defaultValue="ai" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
            <TabsTrigger value="ai" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              <span className="hidden sm:inline">AIコネクター</span>
            </TabsTrigger>
            <TabsTrigger value="integrations" className="flex items-center gap-2">
              <Link className="h-4 w-4" />
              <span className="hidden sm:inline">外部連携</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">ユーザー管理</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">通知設定</span>
            </TabsTrigger>
            <TabsTrigger value="sharing" className="flex items-center gap-2">
              <Share2 className="h-4 w-4" />
              <span className="hidden sm:inline">共有・印刷</span>
            </TabsTrigger>
          </TabsList>

          {/* AIコネクタータブ */}
          <TabsContent value="ai" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600">
                      <Brain className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle>AI プロバイダー設定</CardTitle>
                      <CardDescription>ChatGPT, Gemini, Claude, MCP等のAPI設定</CardDescription>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    {aiProviders.filter(p => p.enabled).length}件有効
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {aiProviders.map((provider) => (
                  <div
                    key={provider.id}
                    className={`p-4 rounded-lg border transition-all ${
                      provider.enabled ? 'bg-card border-green-200' : 'bg-muted/50 border-dashed'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="text-3xl">{provider.icon}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold">{provider.name}</h4>
                            {provider.enabled && (
                              <Badge className="bg-green-100 text-green-700 text-xs">接続中</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{provider.description}</p>

                          {provider.enabled && (
                            <div className="grid grid-cols-2 gap-4 mt-3">
                              <div>
                                <Label className="text-xs text-muted-foreground">APIキー</Label>
                                <div className="flex items-center gap-2 mt-1">
                                  <Input
                                    type={showApiKey === provider.id ? "text" : "password"}
                                    value={provider.apiKey}
                                    className="font-mono text-sm h-8"
                                    readOnly
                                  />
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setShowApiKey(showApiKey === provider.id ? null : provider.id)}
                                  >
                                    {showApiKey === provider.id ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                  </Button>
                                </div>
                              </div>
                              <div>
                                <Label className="text-xs text-muted-foreground">モデル</Label>
                                <Select defaultValue={provider.model}>
                                  <SelectTrigger className="h-8 mt-1">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {provider.id === 'openai' && (
                                      <>
                                        <SelectItem value="gpt-4o">GPT-4o (推奨)</SelectItem>
                                        <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                                        <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                                      </>
                                    )}
                                    {provider.id === 'anthropic' && (
                                      <>
                                        <SelectItem value="claude-3-5-sonnet">Claude 3.5 Sonnet (推奨)</SelectItem>
                                        <SelectItem value="claude-3-opus">Claude 3 Opus</SelectItem>
                                        <SelectItem value="claude-3-haiku">Claude 3 Haiku</SelectItem>
                                      </>
                                    )}
                                    {provider.id === 'gemini' && (
                                      <>
                                        <SelectItem value="gemini-pro">Gemini Pro</SelectItem>
                                        <SelectItem value="gemini-ultra">Gemini Ultra</SelectItem>
                                      </>
                                    )}
                                    {(provider.id === 'azure' || provider.id === 'mcp') && (
                                      <SelectItem value="custom">カスタム</SelectItem>
                                    )}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={provider.enabled}
                          onCheckedChange={() => toggleProvider(provider.id)}
                        />
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Settings className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>{provider.name} 詳細設定</DialogTitle>
                              <DialogDescription>APIキーやエンドポイントを設定します</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 mt-4">
                              <div>
                                <Label>APIキー</Label>
                                <Input placeholder="sk-..." className="mt-1 font-mono" />
                              </div>
                              {provider.endpoint !== undefined && (
                                <div>
                                  <Label>エンドポイント</Label>
                                  <Input placeholder="https://..." className="mt-1" />
                                </div>
                              )}
                              <div>
                                <Label>リクエスト上限 (1日)</Label>
                                <Input type="number" placeholder="1000" className="mt-1" />
                              </div>
                              <Button className="w-full">
                                <Check className="h-4 w-4 mr-2" />
                                設定を保存
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </div>
                ))}

                <Button variant="outline" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  カスタムAIプロバイダーを追加
                </Button>
              </CardContent>
            </Card>

            {/* MCP サーバー管理 */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600">
                    <Zap className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle>MCP サーバー管理</CardTitle>
                    <CardDescription>Model Context Protocol サーバー設定</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: 'miyabi-orchestrator', status: 'running', port: 3100 },
                    { name: 'miyabi-memory', status: 'running', port: 3101 },
                    { name: 'miyabi-scheduler', status: 'running', port: 3102 },
                    { name: 'lark-official', status: 'running', port: 3103 }
                  ].map((server) => (
                    <div key={server.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${server.status === 'running' ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
                        <span className="font-mono text-sm">{server.name}</span>
                        <Badge variant="outline" className="text-xs">:{server.port}</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={server.status === 'running' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
                          {server.status === 'running' ? '稼働中' : '停止'}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 外部連携タブ */}
          <TabsContent value="integrations" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              {integrations.map((integration) => (
                <Card key={integration.id} className={integration.connected ? '' : 'opacity-60'}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-lg bg-muted">
                          <integration.icon className="h-6 w-6" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{integration.name}</h4>
                          <p className="text-sm text-muted-foreground capitalize">{integration.type}</p>
                          {integration.connected && (
                            <Badge className="mt-2 bg-green-100 text-green-700">
                              <Check className="h-3 w-3 mr-1" />
                              接続済み
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Switch
                          checked={integration.enabled}
                          onCheckedChange={() => toggleIntegration(integration.id)}
                        />
                        {!integration.connected && (
                          <Button size="sm" variant="outline">
                            接続
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* ユーザー管理タブ */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600">
                      <Shield className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle>ユーザー・権限管理</CardTitle>
                      <CardDescription>閲覧・編集権限の設定</CardDescription>
                    </div>
                  </div>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    ユーザー追加
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {users.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 rounded-lg border">
                      <div className="flex items-center gap-4">
                        <div className="text-2xl">{user.avatar}</div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{user.name}</h4>
                            {user.role === 'admin' && <Crown className="h-4 w-4 text-amber-500" />}
                          </div>
                          <Badge className={roleLabels[user.role].color}>
                            {roleLabels[user.role].label}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Select defaultValue={user.role}>
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">管理者</SelectItem>
                            <SelectItem value="manager">マネージャー</SelectItem>
                            <SelectItem value="staff">スタッフ</SelectItem>
                            <SelectItem value="viewer">閲覧者</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button variant="ghost" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 権限マトリクス */}
                <div className="mt-6 p-4 rounded-lg bg-muted/50">
                  <h4 className="font-semibold mb-3">権限マトリクス</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2">機能</th>
                          <th className="text-center py-2">管理者</th>
                          <th className="text-center py-2">マネージャー</th>
                          <th className="text-center py-2">スタッフ</th>
                          <th className="text-center py-2">閲覧者</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { feature: 'ダッシュボード閲覧', admin: true, manager: true, staff: true, viewer: true },
                          { feature: '案件データ編集', admin: true, manager: true, staff: true, viewer: false },
                          { feature: '原価情報閲覧', admin: true, manager: true, staff: false, viewer: false },
                          { feature: 'レポート出力', admin: true, manager: true, staff: true, viewer: false },
                          { feature: 'AI設定変更', admin: true, manager: false, staff: false, viewer: false },
                          { feature: 'ユーザー管理', admin: true, manager: false, staff: false, viewer: false }
                        ].map((row) => (
                          <tr key={row.feature} className="border-b">
                            <td className="py-2">{row.feature}</td>
                            <td className="text-center py-2">
                              {row.admin ? <Check className="h-4 w-4 text-green-500 mx-auto" /> : <X className="h-4 w-4 text-gray-300 mx-auto" />}
                            </td>
                            <td className="text-center py-2">
                              {row.manager ? <Check className="h-4 w-4 text-green-500 mx-auto" /> : <X className="h-4 w-4 text-gray-300 mx-auto" />}
                            </td>
                            <td className="text-center py-2">
                              {row.staff ? <Check className="h-4 w-4 text-green-500 mx-auto" /> : <X className="h-4 w-4 text-gray-300 mx-auto" />}
                            </td>
                            <td className="text-center py-2">
                              {row.viewer ? <Check className="h-4 w-4 text-green-500 mx-auto" /> : <X className="h-4 w-4 text-gray-300 mx-auto" />}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 通知設定タブ */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-red-500">
                    <Bell className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle>日報・ニュース通知設定</CardTitle>
                    <CardDescription>自動レポートと通知のタイミングを設定</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="p-4 rounded-lg border">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-blue-500" />
                        <span className="font-medium">日次経営レポート</span>
                      </div>
                      <Switch
                        checked={notifications.dailyReport}
                        onCheckedChange={(v) => setNotifications(prev => ({ ...prev, dailyReport: v }))}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">毎日18:00にKPI・売上・粗利サマリーを送信</p>
                    <Select defaultValue="18:00">
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="09:00">09:00</SelectItem>
                        <SelectItem value="12:00">12:00</SelectItem>
                        <SelectItem value="18:00">18:00</SelectItem>
                        <SelectItem value="21:00">21:00</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="p-4 rounded-lg border">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-purple-500" />
                        <span className="font-medium">週次ダイジェスト</span>
                      </div>
                      <Switch
                        checked={notifications.weeklyDigest}
                        onCheckedChange={(v) => setNotifications(prev => ({ ...prev, weeklyDigest: v }))}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">毎週月曜に先週の実績と今週の予定を送信</p>
                  </div>

                  <div className="p-4 rounded-lg border">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Zap className="h-5 w-5 text-amber-500" />
                        <span className="font-medium">リアルタイムアラート</span>
                      </div>
                      <Switch
                        checked={notifications.alertsRealtime}
                        onCheckedChange={(v) => setNotifications(prev => ({ ...prev, alertsRealtime: v }))}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">重要な変化（粗利低下、遅延等）を即時通知</p>
                  </div>

                  <div className="p-4 rounded-lg border">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-violet-500" />
                        <span className="font-medium">AIレコメンド通知</span>
                      </div>
                      <Switch
                        checked={notifications.aiRecommendations}
                        onCheckedChange={(v) => setNotifications(prev => ({ ...prev, aiRecommendations: v }))}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">AIが検出した機会・リスクを通知</p>
                  </div>

                  <div className="p-4 rounded-lg border">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-green-500" />
                        <span className="font-medium">スケジュールリマインド</span>
                      </div>
                      <Switch
                        checked={notifications.scheduleReminders}
                        onCheckedChange={(v) => setNotifications(prev => ({ ...prev, scheduleReminders: v }))}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">商談・工程の期日前にリマインド</p>
                  </div>

                  <div className="p-4 rounded-lg border">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-red-500" />
                        <span className="font-medium">原価超過アラート</span>
                      </div>
                      <Switch
                        checked={notifications.costAlerts}
                        onCheckedChange={(v) => setNotifications(prev => ({ ...prev, costAlerts: v }))}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">予定原価の90%到達時に警告</p>
                  </div>
                </div>

                {/* 通知先設定 */}
                <div className="p-4 rounded-lg bg-muted/50">
                  <h4 className="font-semibold mb-3">通知先</h4>
                  <div className="space-y-2">
                    {[
                      { label: 'Lark', icon: MessageSquare, enabled: true },
                      { label: 'メール', icon: Mail, enabled: true },
                      { label: 'LINE', icon: Smartphone, enabled: false },
                      { label: 'Slack', icon: MessageSquare, enabled: false }
                    ].map((channel) => (
                      <div key={channel.label} className="flex items-center justify-between p-2 rounded bg-background">
                        <div className="flex items-center gap-2">
                          <channel.icon className="h-4 w-4" />
                          <span className="text-sm">{channel.label}</span>
                        </div>
                        <Switch defaultChecked={channel.enabled} />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 共有・印刷タブ */}
          <TabsContent value="sharing" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600">
                      <Share2 className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle>共有設定</CardTitle>
                      <CardDescription>外部共有リンクの生成</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 rounded-lg border">
                    <h4 className="font-medium mb-2">クイック共有</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" size="sm">
                        <Globe className="h-4 w-4 mr-2" />
                        Google Drive
                      </Button>
                      <Button variant="outline" size="sm">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Lark
                      </Button>
                      <Button variant="outline" size="sm">
                        <Mail className="h-4 w-4 mr-2" />
                        メール
                      </Button>
                      <Button variant="outline" size="sm">
                        <Link className="h-4 w-4 mr-2" />
                        リンクコピー
                      </Button>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg border">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">共有リンク設定</h4>
                      <Badge variant="outline">有効期限: 7日</Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Switch defaultChecked />
                        <span className="text-sm">パスワード保護</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch defaultChecked />
                        <span className="text-sm">ダウンロード許可</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch />
                        <span className="text-sm">編集許可</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-slate-500 to-gray-600">
                      <Printer className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle>印刷・エクスポート</CardTitle>
                      <CardDescription>PDF/Excel形式で出力</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" className="h-20 flex-col">
                      <FileText className="h-6 w-6 mb-2" />
                      <span>PDF出力</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex-col">
                      <svg className="h-6 w-6 mb-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                        <polyline points="14 2 14 8 20 8"/>
                        <path d="M8 13h2"/>
                        <path d="M8 17h2"/>
                        <path d="M14 13h2"/>
                        <path d="M14 17h2"/>
                      </svg>
                      <span>Excel出力</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex-col">
                      <Printer className="h-6 w-6 mb-2" />
                      <span>印刷</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex-col">
                      <svg className="h-6 w-6 mb-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
                        <circle cx="9" cy="9" r="2"/>
                        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                      </svg>
                      <span>画像保存</span>
                    </Button>
                  </div>

                  <div className="p-4 rounded-lg bg-muted/50">
                    <h4 className="font-medium mb-2">エクスポート設定</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Switch defaultChecked />
                        <span className="text-sm">ヘッダー・フッター含む</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch defaultChecked />
                        <span className="text-sm">グラフを含む</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch />
                        <span className="text-sm">非公開データを除外</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
