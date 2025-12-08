"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import {
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Package,
  Wrench
} from "lucide-react";
import { sampleProjects, costCategoryData, formatCurrency, formatFullCurrency } from "@/lib/data";
import { cn } from "@/lib/utils";

const chartConfig = {
  amount: {
    label: "金額",
  },
} satisfies ChartConfig;

// 建匠ブランド 原価管理カラーパレット
const KENSHO_COST_COLORS = {
  material: "#B45309",     // 材料費 - アンバー（木材イメージ）
  labor: "#1E3A5F",        // 人件費 - ネイビー（信頼）
  outsource: "#059669",    // 外注費 - エメラルド（成長）
  other: "#7C3AED",        // その他 - パープル（付加価値）
};

const COLORS = [
  KENSHO_COST_COLORS.material,
  KENSHO_COST_COLORS.labor,
  KENSHO_COST_COLORS.outsource,
  KENSHO_COST_COLORS.other
];

export function CostOverview() {
  const totalContract = sampleProjects.reduce((sum, p) => sum + p.contractAmount, 0);
  const totalEstimated = sampleProjects.reduce((sum, p) => sum + p.estimatedCost, 0);
  const totalActual = sampleProjects.reduce((sum, p) => sum + p.actualCost, 0);
  const expectedMargin = totalContract - totalEstimated;

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">総契約額</span>
          </div>
          <div className="text-2xl font-bold">¥{formatCurrency(totalContract)}</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-2">
            <Package className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">予定原価</span>
          </div>
          <div className="text-2xl font-bold">¥{formatCurrency(totalEstimated)}</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-2">
            <Wrench className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">実績原価</span>
          </div>
          <div className="text-2xl font-bold text-blue-600">¥{formatCurrency(totalActual)}</div>
          <div className="text-xs text-muted-foreground mt-1">
            進捗率: {((totalActual / totalEstimated) * 100).toFixed(1)}%
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <span className="text-sm text-muted-foreground">予定粗利</span>
          </div>
          <div className="text-2xl font-bold text-green-600">¥{formatCurrency(expectedMargin)}</div>
          <div className="text-xs text-muted-foreground mt-1">
            粗利率: {((expectedMargin / totalContract) * 100).toFixed(1)}%
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function ProjectCostTable() {
  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>物件別原価・粗利一覧</CardTitle>
        <CardDescription>リアルタイム原価監視（粗利率15%未満は警告）</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>物件名</TableHead>
              <TableHead>種別</TableHead>
              <TableHead className="text-right">契約額</TableHead>
              <TableHead className="text-right">予定原価</TableHead>
              <TableHead className="text-right">実績原価</TableHead>
              <TableHead className="text-right">予定粗利</TableHead>
              <TableHead className="text-right">粗利率</TableHead>
              <TableHead>進捗</TableHead>
              <TableHead>ステータス</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sampleProjects.map((project) => {
              const expectedMargin = project.contractAmount - project.estimatedCost;
              const expectedMarginRate = (expectedMargin / project.contractAmount) * 100;
              const costProgress = project.estimatedCost > 0
                ? (project.actualCost / project.estimatedCost) * 100
                : 0;
              const isWarning = expectedMarginRate < 20;
              const isCritical = expectedMarginRate < 15;

              return (
                <TableRow key={project.id} className={cn(isCritical && "bg-red-50")}>
                  <TableCell className="font-medium">{project.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{project.type}</Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatFullCurrency(project.contractAmount)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatFullCurrency(project.estimatedCost)}
                  </TableCell>
                  <TableCell className="text-right text-blue-600">
                    {formatFullCurrency(project.actualCost)}
                  </TableCell>
                  <TableCell className="text-right text-green-600 font-medium">
                    {formatFullCurrency(expectedMargin)}
                  </TableCell>
                  <TableCell className="text-right">
                    <span className={cn(
                      "font-medium",
                      isCritical && "text-red-600",
                      isWarning && !isCritical && "text-amber-600",
                      !isWarning && "text-green-600"
                    )}>
                      {expectedMarginRate.toFixed(1)}%
                    </span>
                    {isCritical && <AlertTriangle className="h-3 w-3 inline ml-1 text-red-500" />}
                  </TableCell>
                  <TableCell>
                    <div className="w-20">
                      <Progress value={costProgress} className="h-2" />
                      <span className="text-xs text-muted-foreground">{costProgress.toFixed(0)}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={cn(
                      project.status === '進行中' && "bg-blue-100 text-blue-700",
                      project.status === '着工前' && "bg-slate-100 text-slate-700",
                      project.status === '契約済' && "bg-green-100 text-green-700",
                      project.status === '竣工' && "bg-emerald-100 text-emerald-700"
                    )}>
                      {project.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export function CostCategoryChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <span className="w-3 h-3 rounded bg-gradient-to-r from-amber-500 to-amber-700"></span>
          原価構成比
        </CardTitle>
        <CardDescription>カテゴリ別の原価内訳</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <defs>
                {COLORS.map((color, index) => (
                  <linearGradient key={`grad-${index}`} id={`pieGrad-${index}`} x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity={1}/>
                    <stop offset="100%" stopColor={color} stopOpacity={0.7}/>
                  </linearGradient>
                ))}
              </defs>
              <Pie
                data={costCategoryData}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={75}
                paddingAngle={3}
                dataKey="amount"
                stroke="#fff"
                strokeWidth={2}
              >
                {costCategoryData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={`url(#pieGrad-${index})`} />
                ))}
              </Pie>
              <ChartTooltip
                content={<ChartTooltipContent />}
                formatter={(value: number) => formatFullCurrency(value)}
                contentStyle={{
                  backgroundColor: '#FFFBEB',
                  border: '1px solid #D97706',
                  borderRadius: '8px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
        <div className="grid grid-cols-2 gap-2 mt-4">
          {costCategoryData.map((item, index) => (
            <div key={item.category} className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-muted/50 transition-colors">
              <div
                className="w-3 h-3 rounded-sm shadow-sm"
                style={{ backgroundColor: COLORS[index] }}
              />
              <span className="text-xs font-medium">{item.category}</span>
              <span className="text-xs text-muted-foreground ml-auto font-semibold">{item.percentage}%</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function MarginAlerts() {
  const criticalProjects = sampleProjects.filter(p => {
    const margin = (p.contractAmount - p.estimatedCost) / p.contractAmount * 100;
    return margin < 20;
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          <CardTitle className="text-base">粗利アラート</CardTitle>
        </div>
        <CardDescription>粗利率20%未満の案件を監視</CardDescription>
      </CardHeader>
      <CardContent>
        {criticalProjects.length === 0 ? (
          <div className="flex items-center gap-2 text-green-600 py-4">
            <CheckCircle className="h-5 w-5" />
            <span>すべての案件が適正粗利率を維持しています</span>
          </div>
        ) : (
          <div className="space-y-3">
            {criticalProjects.map((project) => {
              const margin = ((project.contractAmount - project.estimatedCost) / project.contractAmount * 100);
              return (
                <div
                  key={project.id}
                  className="p-3 rounded-lg bg-amber-50 border border-amber-200"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm">{project.name}</span>
                    <Badge variant="destructive" className="text-xs">
                      {margin.toFixed(1)}%
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    原価見直しまたは追加工事の検討を推奨
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
