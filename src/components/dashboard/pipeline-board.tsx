"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Deal, sampleDeals, formatCurrency, getStatusColor, pipelineData } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Calendar, User, ArrowRight, Phone, TrendingUp } from "lucide-react";

const stages = ['リード', '初回面談', '商談中', '見積提出', '契約準備', '成約'];

interface DealCardProps {
  deal: Deal;
}

function DealCard({ deal }: DealCardProps) {
  return (
    <Card className="mb-3 cursor-pointer hover:shadow-md transition-shadow border-l-4 border-l-primary/50 hover:border-l-primary">
      <CardContent className="p-3">
        <div className="flex items-start justify-between mb-2">
          <h4 className="font-medium text-sm truncate flex-1">{deal.name}</h4>
          <Badge variant="outline" className="text-xs ml-2">
            {deal.probability}%
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground mb-2">{deal.customer}</p>
        <div className="text-lg font-bold text-primary mb-2">
          ¥{formatCurrency(deal.amount)}
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <User className="h-3 w-3" />
          <span>{deal.salesRep}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
          <Calendar className="h-3 w-3" />
          <span>{deal.nextDate}</span>
        </div>
        <div className="mt-2 pt-2 border-t">
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <ArrowRight className="h-3 w-3" />
            {deal.nextAction}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

interface PipelineColumnProps {
  stage: string;
  deals: Deal[];
  totalAmount: number;
  color: string;
}

function PipelineColumn({ stage, deals, totalAmount, color }: PipelineColumnProps) {
  return (
    <div className="flex-shrink-0 w-[280px]">
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
            <h3 className="font-semibold text-sm">{stage}</h3>
            <Badge variant="secondary" className="text-xs">{deals.length}</Badge>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          合計: ¥{formatCurrency(totalAmount)}
        </p>
      </div>
      <div className="space-y-0">
        {deals.map((deal) => (
          <DealCard key={deal.id} deal={deal} />
        ))}
        {deals.length === 0 && (
          <div className="text-center py-8 text-sm text-muted-foreground border-2 border-dashed rounded-lg">
            案件なし
          </div>
        )}
      </div>
    </div>
  );
}

export function PipelineBoard() {
  return (
    <Card className="col-span-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              営業パイプライン
            </CardTitle>
            <CardDescription>ドラッグ&ドロップで案件ステータスを更新</CardDescription>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">総見込額:</span>
              <span className="font-bold text-lg">
                ¥{formatCurrency(sampleDeals.reduce((sum, d) => sum + d.amount * d.probability / 100, 0))}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="w-full pb-4">
          <div className="flex gap-4">
            {stages.map((stage) => {
              const stageDeals = sampleDeals.filter(d => d.status === stage);
              const stageData = pipelineData.find(p => p.stage === stage);
              return (
                <PipelineColumn
                  key={stage}
                  stage={stage}
                  deals={stageDeals}
                  totalAmount={stageDeals.reduce((sum, d) => sum + d.amount, 0)}
                  color={stageData?.color || '#94a3b8'}
                />
              );
            })}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

// パイプライン集計カード
export function PipelineSummary() {
  const totalAmount = pipelineData.reduce((sum, p) => sum + p.amount, 0);
  const weightedAmount = sampleDeals.reduce((sum, d) => sum + d.amount * d.probability / 100, 0);

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle className="text-base">パイプライン概況</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {pipelineData.map((stage) => (
          <div key={stage.stage} className="flex items-center gap-3">
            <div
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: stage.color }}
            />
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium">{stage.stage}</span>
                <span className="text-sm text-muted-foreground">{stage.count}件</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${(stage.amount / totalAmount) * 100}%`,
                    backgroundColor: stage.color
                  }}
                />
              </div>
            </div>
            <span className="text-sm font-medium w-16 text-right">
              ¥{formatCurrency(stage.amount)}
            </span>
          </div>
        ))}
        <div className="pt-3 border-t">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">加重平均見込額</span>
            <span className="font-bold">¥{formatCurrency(weightedAmount)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
