"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  User,
  ChevronRight
} from "lucide-react";
import { sampleTasks, sampleProjects, Task, getStatusColor } from "@/lib/data";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface GanttChartProps {
  projectId: string;
}

export function GanttChart({ projectId }: GanttChartProps) {
  const tasks = sampleTasks.filter(t => t.projectId === projectId);

  // 日付範囲を計算
  const startDates = tasks.map(t => new Date(t.startDate));
  const endDates = tasks.map(t => new Date(t.endDate));
  const minDate = new Date(Math.min(...startDates.map(d => d.getTime())));
  const maxDate = new Date(Math.max(...endDates.map(d => d.getTime())));

  // 月のリストを生成
  const months: { year: number; month: number; days: number }[] = [];
  const current = new Date(minDate);
  current.setDate(1);
  while (current <= maxDate) {
    months.push({
      year: current.getFullYear(),
      month: current.getMonth(),
      days: new Date(current.getFullYear(), current.getMonth() + 1, 0).getDate()
    });
    current.setMonth(current.getMonth() + 1);
  }

  // 日付からX位置を計算
  const getPosition = (date: Date) => {
    const totalDays = Math.ceil((maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24));
    const dayOffset = Math.ceil((date.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24));
    return (dayOffset / totalDays) * 100;
  };

  const getWidth = (start: Date, end: Date) => {
    const totalDays = Math.ceil((maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24));
    const duration = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return (duration / totalDays) * 100;
  };

  const statusColors: Record<string, string> = {
    '未着手': 'bg-slate-300',
    '進行中': 'bg-blue-500',
    '完了': 'bg-green-500',
    '遅延': 'bg-red-500'
  };

  return (
    <div className="space-y-2">
      {/* ヘッダー（月） */}
      <div className="flex border-b pb-2 ml-[200px]">
        {months.map((m, i) => (
          <div
            key={i}
            className="text-xs text-center font-medium text-muted-foreground"
            style={{ width: `${(m.days / 180) * 100}%` }}
          >
            {m.year}年{m.month + 1}月
          </div>
        ))}
      </div>

      {/* タスクバー */}
      {tasks.map((task) => {
        const startDate = new Date(task.startDate);
        const endDate = new Date(task.endDate);
        const left = getPosition(startDate);
        const width = getWidth(startDate, endDate);

        return (
          <div key={task.id} className="flex items-center h-10 group">
            {/* タスク名 */}
            <div className="w-[200px] flex-shrink-0 pr-4">
              <div className="flex items-center gap-2">
                <span className="text-sm truncate">{task.name}</span>
                {task.status === '遅延' && (
                  <AlertTriangle className="h-3 w-3 text-red-500 flex-shrink-0" />
                )}
              </div>
              <span className="text-xs text-muted-foreground">{task.assignee}</span>
            </div>

            {/* ガントバー */}
            <div className="flex-1 relative h-8 bg-muted/30 rounded">
              <div
                className={cn(
                  "absolute h-6 top-1 rounded transition-all",
                  statusColors[task.status],
                  "hover:brightness-110"
                )}
                style={{
                  left: `${left}%`,
                  width: `${Math.max(width, 2)}%`
                }}
              >
                {/* 進捗バー */}
                <div
                  className="h-full bg-black/20 rounded-l"
                  style={{ width: `${task.progress}%` }}
                />
                {/* ラベル */}
                <span className="absolute inset-0 flex items-center justify-center text-xs text-white font-medium">
                  {task.progress}%
                </span>
              </div>

              {/* 今日の線 */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10"
                style={{ left: `${getPosition(new Date())}%` }}
              />
            </div>
          </div>
        );
      })}

      {/* 凡例 */}
      <div className="flex gap-4 mt-4 pt-4 border-t">
        {Object.entries(statusColors).map(([status, color]) => (
          <div key={status} className="flex items-center gap-2">
            <div className={cn("w-3 h-3 rounded", color)} />
            <span className="text-xs">{status}</span>
          </div>
        ))}
        <div className="flex items-center gap-2 ml-auto">
          <div className="w-0.5 h-3 bg-red-500" />
          <span className="text-xs">今日</span>
        </div>
      </div>
    </div>
  );
}

export function ScheduleManagement() {
  const [selectedProject, setSelectedProject] = useState('P2024-001');

  return (
    <Card className="col-span-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              工程管理
            </CardTitle>
            <CardDescription>ガントチャートで進捗を可視化</CardDescription>
          </div>
          <Select value={selectedProject} onValueChange={setSelectedProject}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="物件を選択" />
            </SelectTrigger>
            <SelectContent>
              {sampleProjects.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="w-full">
          <div className="min-w-[800px]">
            <GanttChart projectId={selectedProject} />
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

export function ScheduleAlerts() {
  const delayedTasks = sampleTasks.filter(t => t.status === '遅延');
  const upcomingTasks = sampleTasks.filter(t => {
    const endDate = new Date(t.endDate);
    const today = new Date();
    const daysUntil = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntil <= 7 && daysUntil > 0 && t.status !== '完了';
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-amber-500" />
          <CardTitle className="text-base">工程アラート</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {delayedTasks.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-red-600 mb-2 flex items-center gap-1">
              <AlertTriangle className="h-4 w-4" />
              遅延タスク
            </h4>
            <div className="space-y-2">
              {delayedTasks.map((task) => (
                <div
                  key={task.id}
                  className="p-2 rounded bg-red-50 border border-red-200 text-sm"
                >
                  <div className="font-medium">{task.name}</div>
                  <div className="text-xs text-muted-foreground">
                    担当: {task.assignee} | 期限: {task.endDate}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {upcomingTasks.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-amber-600 mb-2 flex items-center gap-1">
              <Clock className="h-4 w-4" />
              今週期限
            </h4>
            <div className="space-y-2">
              {upcomingTasks.map((task) => (
                <div
                  key={task.id}
                  className="p-2 rounded bg-amber-50 border border-amber-200 text-sm"
                >
                  <div className="font-medium">{task.name}</div>
                  <div className="text-xs text-muted-foreground">
                    担当: {task.assignee} | 期限: {task.endDate}
                  </div>
                  <Progress value={task.progress} className="h-1 mt-1" />
                </div>
              ))}
            </div>
          </div>
        )}

        {delayedTasks.length === 0 && upcomingTasks.length === 0 && (
          <div className="flex items-center gap-2 text-green-600 py-4">
            <CheckCircle className="h-5 w-5" />
            <span>すべて予定通り進行中</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function TodaysTasks() {
  const todayTasks = [
    { id: 1, time: '09:00', task: '山田邸 確認申請書類確認', assignee: '設計部', status: '完了' },
    { id: 2, time: '10:30', task: '鈴木邸 現地調査', assignee: '田中', status: '進行中' },
    { id: 3, time: '14:00', task: '高橋邸 契約書作成', assignee: '佐藤', status: '未着手' },
    { id: 4, time: '15:30', task: '協力会社打ち合わせ', assignee: '工務部', status: '未着手' },
    { id: 5, time: '17:00', task: '週次レポート作成', assignee: 'AI自動', status: '予約済' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          今日のタスク
        </CardTitle>
        <CardDescription>{new Date().toLocaleDateString('ja-JP', { weekday: 'long', month: 'long', day: 'numeric' })}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {todayTasks.map((task) => (
            <div
              key={task.id}
              className={cn(
                "flex items-center gap-3 p-2 rounded",
                task.status === '完了' && "bg-green-50",
                task.status === '進行中' && "bg-blue-50",
                task.status === '予約済' && "bg-purple-50"
              )}
            >
              <span className="text-sm font-mono text-muted-foreground w-12">
                {task.time}
              </span>
              <div className="flex-1">
                <p className="text-sm font-medium">{task.task}</p>
                <p className="text-xs text-muted-foreground">{task.assignee}</p>
              </div>
              <Badge
                variant="outline"
                className={cn(
                  "text-xs",
                  task.status === '完了' && "bg-green-100 text-green-700",
                  task.status === '進行中' && "bg-blue-100 text-blue-700",
                  task.status === '未着手' && "bg-slate-100 text-slate-700",
                  task.status === '予約済' && "bg-purple-100 text-purple-700"
                )}
              >
                {task.status}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
