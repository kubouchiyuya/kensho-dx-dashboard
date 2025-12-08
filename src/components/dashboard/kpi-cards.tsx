"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, Minus, Target, Building2, Briefcase, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { KPI, formatCurrency } from "@/lib/data";
import { cn } from "@/lib/utils";

interface KPICardsProps {
  kpis: KPI[];
}

const iconMap: Record<string, React.ElementType> = {
  '月間受注額': Target,
  '平均粗利率': TrendingUp,
  '進行中案件': Building2,
  '商談中案件': Briefcase,
  '今月完工予定': CheckCircle,
  '遅延案件': AlertTriangle,
};

export function KPICards({ kpis }: KPICardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {kpis.map((kpi) => {
        const Icon = iconMap[kpi.label] || Clock;
        const changePercent = ((kpi.value - kpi.previousValue) / kpi.previousValue * 100).toFixed(1);
        const isPositive = kpi.trend === 'up';
        const isNegative = kpi.trend === 'down';
        const progressValue = kpi.target ? (kpi.value / kpi.target) * 100 : 0;

        // 遅延案件は下がると良い
        const isGoodTrend = kpi.label === '遅延案件' ? isNegative : isPositive;

        return (
          <Card key={kpi.label} className="relative overflow-hidden border-l-4 border-l-amber-500/50 hover:border-l-amber-500 transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {kpi.label}
              </CardTitle>
              <div className={cn(
                "p-1.5 rounded-lg",
                kpi.label === '遅延案件' ? "bg-amber-100" : "bg-slate-100"
              )}>
                <Icon className={cn(
                  "h-4 w-4",
                  kpi.label === '遅延案件' ? "text-amber-600" : "text-slate-600"
                )} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800">
                {kpi.unit === '円' ? `¥${formatCurrency(kpi.value)}` : `${kpi.value}${kpi.unit}`}
              </div>
              <div className="flex items-center gap-1 mt-1">
                {isPositive && <TrendingUp className={cn("h-3 w-3", isGoodTrend ? "text-emerald-500" : "text-rose-500")} />}
                {isNegative && <TrendingDown className={cn("h-3 w-3", isGoodTrend ? "text-emerald-500" : "text-rose-500")} />}
                {kpi.trend === 'flat' && <Minus className="h-3 w-3 text-slate-400" />}
                <span className={cn(
                  "text-xs font-medium",
                  isGoodTrend ? "text-emerald-600" : isNegative || isPositive ? "text-rose-500" : "text-slate-400"
                )}>
                  {isPositive ? '+' : ''}{changePercent}%
                </span>
                <span className="text-xs text-muted-foreground ml-1">前月比</span>
              </div>
              {kpi.target && (
                <div className="mt-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">目標達成率</span>
                    <span className="font-semibold text-amber-700">{progressValue.toFixed(0)}%</span>
                  </div>
                  <Progress value={progressValue} className="h-1.5 bg-amber-100" />
                </div>
              )}
            </CardContent>
            {/* デコレーション - 建匠カラー */}
            <div className={cn(
              "absolute top-0 right-0 w-20 h-20 -mr-6 -mt-6 rounded-full opacity-5",
              isGoodTrend ? "bg-emerald-500" : "bg-amber-600"
            )} />
          </Card>
        );
      })}
    </div>
  );
}
