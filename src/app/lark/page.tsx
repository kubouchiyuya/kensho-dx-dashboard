"use client";

import { DashboardLayout } from "@/components/dashboard/sidebar-nav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { MessageSquare, Bell, Database, CheckCircle, Settings } from "lucide-react";

const integrations = [
  { name: 'グループ通知', status: 'connected', enabled: true, description: 'アラートをグループチャットに送信' },
  { name: 'Bitable同期', status: 'connected', enabled: true, description: 'データをBitableに自動同期' },
  { name: '承認ワークフロー', status: 'connected', enabled: true, description: '見積・追加工事の承認フロー' },
  { name: 'カレンダー連携', status: 'connected', enabled: true, description: '工程をカレンダーに反映' },
  { name: 'ドキュメント共有', status: 'connected', enabled: false, description: '図面・資料の自動共有' },
];

const recentMessages = [
  { time: '15:30', type: 'alert', message: '山田邸の確認申請が2日遅延しています' },
  { time: '14:00', type: 'info', message: '鈴木邸の現地調査が完了しました' },
  { time: '10:30', type: 'success', message: '高橋邸の契約書が承認されました' },
  { time: '09:00', type: 'reminder', message: '本日のフォローアップ: 渡辺様' },
];

export default function LarkPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Lark連携</h1>
            <p className="text-muted-foreground">Larkとの連携設定・通知管理</p>
          </div>
          <Badge variant="outline" className="bg-green-50 text-green-700">
            <CheckCircle className="h-3 w-3 mr-1" />
            接続済み
          </Badge>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                <CardTitle>連携機能</CardTitle>
              </div>
              <CardDescription>各機能の有効/無効を切り替え</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {integrations.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between p-3 rounded-lg border"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${item.status === 'connected' ? 'bg-green-500' : 'bg-red-500'}`} />
                    <div>
                      <p className="font-medium text-sm">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                  <Switch checked={item.enabled} />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                <CardTitle>最近の通知</CardTitle>
              </div>
              <CardDescription>Larkに送信された通知履歴</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-lg border-l-4 ${
                    msg.type === 'alert' ? 'border-l-red-500 bg-red-50' :
                    msg.type === 'success' ? 'border-l-green-500 bg-green-50' :
                    msg.type === 'reminder' ? 'border-l-amber-500 bg-amber-50' :
                    'border-l-blue-500 bg-blue-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm">{msg.message}</p>
                    <span className="text-xs text-muted-foreground">{msg.time}</span>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full mt-2">
                すべての履歴を表示
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              <CardTitle>通知テスト</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <Button>テスト通知を送信</Button>
              <Button variant="outline">Bitable同期テスト</Button>
              <Button variant="outline">承認フローテスト</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
