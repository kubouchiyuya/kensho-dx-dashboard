"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ComposedChart, Legend, Area, AreaChart } from "recharts";
import { monthlySalesData, formatCurrency } from "@/lib/data";

// 建匠ブランドカラーパレット
// メイン: 木目調ウォームブラウン / サブ: 信頼のネイビー / アクセント: 自然のグリーン
const KENSHO_COLORS = {
  primary: "#B45309",      // 温かみのあるアンバー（売上）
  secondary: "#1E3A5F",    // 深いネイビー（目標）
  accent: "#059669",       // 自然なエメラルド（粗利）
  warm: "#D97706",         // オレンジブラウン
  earth: "#78716C",        // 落ち着いたストーン
  success: "#10B981",      // 達成のグリーン
  warning: "#F59E0B",      // 注意のアンバー
};

const chartConfig = {
  sales: {
    label: "売上",
    color: KENSHO_COLORS.primary,
  },
  target: {
    label: "目標",
    color: KENSHO_COLORS.secondary,
  },
  grossProfit: {
    label: "粗利",
    color: KENSHO_COLORS.accent,
  },
} satisfies ChartConfig;

export function SalesChart() {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>売上推移</span>
          <span className="text-sm font-normal text-muted-foreground">（過去6ヶ月）</span>
        </CardTitle>
        <CardDescription>
          月間売上と目標の比較、粗利推移
        </CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={monthlySalesData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                {/* 建匠カラー グラデーション */}
                <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={KENSHO_COLORS.primary} stopOpacity={0.9}/>
                  <stop offset="50%" stopColor={KENSHO_COLORS.warm} stopOpacity={0.5}/>
                  <stop offset="95%" stopColor={KENSHO_COLORS.primary} stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={KENSHO_COLORS.accent} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={KENSHO_COLORS.accent} stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.5} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#64748B', fontSize: 12 }}
              />
              <YAxis
                tickFormatter={(value) => formatCurrency(value)}
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#64748B', fontSize: 12 }}
              />
              <ChartTooltip
                content={<ChartTooltipContent />}
                formatter={(value: number) => `¥${formatCurrency(value)}`}
                contentStyle={{
                  backgroundColor: '#FFFBEB',
                  border: '1px solid #D97706',
                  borderRadius: '8px'
                }}
              />
              <Legend
                wrapperStyle={{ paddingTop: '10px' }}
                formatter={(value) => <span style={{ color: '#374151', fontWeight: 500 }}>{value}</span>}
              />
              <Bar
                dataKey="sales"
                name="売上"
                fill="url(#salesGradient)"
                radius={[6, 6, 0, 0]}
                stroke={KENSHO_COLORS.primary}
                strokeWidth={1}
              />
              <Line
                type="monotone"
                dataKey="target"
                name="目標"
                stroke={KENSHO_COLORS.secondary}
                strokeWidth={2.5}
                strokeDasharray="8 4"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="grossProfit"
                name="粗利"
                stroke={KENSHO_COLORS.accent}
                strokeWidth={2.5}
                dot={{ fill: KENSHO_COLORS.accent, r: 5, strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 7, stroke: KENSHO_COLORS.accent, strokeWidth: 2 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export function ProfitTrendChart() {
  const profitData = monthlySalesData.map(d => ({
    month: d.month,
    marginRate: ((d.grossProfit / d.sales) * 100).toFixed(1),
    grossProfit: d.grossProfit
  }));

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500"></span>
          粗利率推移
        </CardTitle>
        <CardDescription>目標：25%以上を維持</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={profitData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="marginGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={KENSHO_COLORS.success} stopOpacity={0.8}/>
                  <stop offset="50%" stopColor={KENSHO_COLORS.accent} stopOpacity={0.4}/>
                  <stop offset="95%" stopColor={KENSHO_COLORS.success} stopOpacity={0.05}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.5} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#64748B', fontSize: 11 }}
              />
              <YAxis
                domain={[15, 30]}
                tickFormatter={(v) => `${v}%`}
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#64748B', fontSize: 11 }}
              />
              <ChartTooltip
                formatter={(value) => `${value}%`}
                contentStyle={{
                  backgroundColor: '#ECFDF5',
                  border: `1px solid ${KENSHO_COLORS.accent}`,
                  borderRadius: '8px'
                }}
              />
              <Area
                type="monotone"
                dataKey="marginRate"
                stroke={KENSHO_COLORS.accent}
                fill="url(#marginGradient)"
                strokeWidth={2.5}
              />
              {/* 目標ライン */}
              <Line
                type="monotone"
                dataKey={() => 25}
                stroke={KENSHO_COLORS.warning}
                strokeDasharray="6 3"
                strokeWidth={2}
                dot={false}
                name="目標"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
