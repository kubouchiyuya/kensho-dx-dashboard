"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ComposedChart, Legend, Area, AreaChart } from "recharts";
import { monthlySalesData, formatCurrency } from "@/lib/data";

const chartConfig = {
  sales: {
    label: "売上",
    color: "hsl(var(--chart-1))",
  },
  target: {
    label: "目標",
    color: "hsl(var(--chart-2))",
  },
  grossProfit: {
    label: "粗利",
    color: "hsl(var(--chart-3))",
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
                <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-3))" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="hsl(var(--chart-3))" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                className="text-xs"
              />
              <YAxis
                tickFormatter={(value) => formatCurrency(value)}
                tickLine={false}
                axisLine={false}
                className="text-xs"
              />
              <ChartTooltip
                content={<ChartTooltipContent />}
                formatter={(value: number) => `¥${formatCurrency(value)}`}
              />
              <Legend />
              <Bar
                dataKey="sales"
                name="売上"
                fill="url(#salesGradient)"
                radius={[4, 4, 0, 0]}
              />
              <Line
                type="monotone"
                dataKey="target"
                name="目標"
                stroke="hsl(var(--chart-2))"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="grossProfit"
                name="粗利"
                stroke="hsl(var(--chart-3))"
                strokeWidth={2}
                dot={{ fill: "hsl(var(--chart-3))", r: 4 }}
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
        <CardTitle>粗利率推移</CardTitle>
        <CardDescription>目標：25%以上を維持</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={profitData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="marginGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="month" tickLine={false} axisLine={false} className="text-xs" />
              <YAxis
                domain={[15, 30]}
                tickFormatter={(v) => `${v}%`}
                tickLine={false}
                axisLine={false}
                className="text-xs"
              />
              <ChartTooltip formatter={(value) => `${value}%`} />
              <Area
                type="monotone"
                dataKey="marginRate"
                stroke="#22c55e"
                fill="url(#marginGradient)"
                strokeWidth={2}
              />
              {/* 目標ライン */}
              <Line
                type="monotone"
                dataKey={() => 25}
                stroke="#f59e0b"
                strokeDasharray="5 5"
                strokeWidth={1}
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
