"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Bell,
  AlertTriangle,
  Info,
  AlertCircle,
  CheckCircle,
  X,
  Clock,
  ExternalLink,
  MessageSquare
} from "lucide-react";
import { sampleAlerts, getSeverityColor } from "@/lib/data";
import { cn } from "@/lib/utils";

export function AlertsPanel() {
  const unreadCount = sampleAlerts.filter(a => !a.isRead).length;

  const severityIcons = {
    info: Info,
    warning: AlertTriangle,
    critical: AlertCircle
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            <CardTitle className="text-base">アラート</CardTitle>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {unreadCount}
              </Badge>
            )}
          </div>
          <Button variant="ghost" size="sm" className="text-xs">
            すべて既読
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px]">
          <div className="space-y-3">
            {sampleAlerts.map((alert) => {
              const Icon = severityIcons[alert.severity];
              return (
                <div
                  key={alert.id}
                  className={cn(
                    "p-3 rounded-lg border transition-all",
                    getSeverityColor(alert.severity),
                    !alert.isRead && "ring-1 ring-offset-1",
                    alert.severity === 'critical' && "ring-red-300",
                    alert.severity === 'warning' && "ring-amber-300",
                    alert.severity === 'info' && "ring-blue-300"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <Icon className={cn(
                      "h-5 w-5 mt-0.5 flex-shrink-0",
                      alert.severity === 'critical' && "text-red-500",
                      alert.severity === 'warning' && "text-amber-500",
                      alert.severity === 'info' && "text-blue-500"
                    )} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h4 className="font-medium text-sm">{alert.title}</h4>
                        {!alert.isRead && (
                          <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">
                        {alert.message}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(alert.createdAt).toLocaleTimeString('ja-JP', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" className="h-6 text-xs">
                            詳細
                            <ExternalLink className="h-3 w-3 ml-1" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-6 px-2">
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

// Lark連携ステータス
export function LarkIntegrationStatus() {
  const integrations = [
    { name: 'グループ通知', status: 'connected', lastSync: '1分前' },
    { name: 'Bitable同期', status: 'connected', lastSync: '5分前' },
    { name: '承認ワークフロー', status: 'connected', lastSync: 'リアルタイム' },
    { name: 'カレンダー連携', status: 'connected', lastSync: '15分前' },
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-blue-500" />
          <CardTitle className="text-base">Lark連携</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {integrations.map((item) => (
            <div
              key={item.name}
              className="flex items-center justify-between p-2 rounded bg-muted/50"
            >
              <div className="flex items-center gap-2">
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  item.status === 'connected' ? "bg-green-500" : "bg-red-500"
                )} />
                <span className="text-sm">{item.name}</span>
              </div>
              <span className="text-xs text-muted-foreground">
                {item.lastSync}
              </span>
            </div>
          ))}
        </div>
        <Button variant="outline" className="w-full mt-3" size="sm">
          テスト通知を送信
        </Button>
      </CardContent>
    </Card>
  );
}

// クイックアクション
export function QuickActions() {
  const actions = [
    { icon: '📝', label: '見積作成', color: 'bg-blue-100' },
    { icon: '📞', label: '顧客連絡', color: 'bg-green-100' },
    { icon: '📊', label: 'レポート', color: 'bg-purple-100' },
    { icon: '⚙️', label: '設定', color: 'bg-slate-100' },
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">クイックアクション</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          {actions.map((action) => (
            <Button
              key={action.label}
              variant="outline"
              className={cn("h-16 flex flex-col gap-1", action.color)}
            >
              <span className="text-xl">{action.icon}</span>
              <span className="text-xs">{action.label}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
