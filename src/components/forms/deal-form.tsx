"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Plus, Save, Briefcase } from "lucide-react";
import { dealsStore, type Deal } from "@/lib/store/local-storage";

interface DealFormProps {
  deal?: Deal;
  onSave?: (deal: Deal) => void;
  trigger?: React.ReactNode;
}

export function DealForm({ deal, onSave, trigger }: DealFormProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: deal?.name || '',
    customer: deal?.customer || '',
    amount: deal?.amount || 0,
    probability: deal?.probability || 50,
    status: deal?.status || 'リード',
    salesRep: deal?.salesRep || '',
    nextAction: deal?.nextAction || '',
    nextDate: deal?.nextDate || '',
    source: deal?.source || '',
    note: deal?.note || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let savedDeal: Deal;
    if (deal) {
      savedDeal = dealsStore.update(deal.id, formData)!;
    } else {
      savedDeal = dealsStore.create(formData as Omit<Deal, 'id' | 'createdAt' | 'updatedAt'>);
    }

    onSave?.(savedDeal);
    setOpen(false);

    if (!deal) {
      setFormData({
        name: '',
        customer: '',
        amount: 0,
        probability: 50,
        status: 'リード',
        salesRep: '',
        nextAction: '',
        nextDate: '',
        source: '',
        note: '',
      });
    }
  };

  const statusColors: Record<string, string> = {
    'リード': 'bg-slate-500',
    '初回面談': 'bg-blue-500',
    '商談中': 'bg-cyan-500',
    '見積提出': 'bg-amber-500',
    '契約準備': 'bg-orange-500',
    '成約': 'bg-green-500',
    '失注': 'bg-red-500',
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            商談を追加
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            {deal ? '商談を編集' : '新規商談登録'}
          </DialogTitle>
          <DialogDescription>
            商談情報を入力してください
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            {/* 案件名 */}
            <div className="col-span-2">
              <Label htmlFor="name">案件名 *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="例: 渡辺邸新築相談"
                required
              />
            </div>

            {/* 顧客名 */}
            <div>
              <Label htmlFor="customer">顧客名 *</Label>
              <Input
                id="customer"
                value={formData.customer}
                onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
                placeholder="例: 渡辺健二"
                required
              />
            </div>

            {/* 担当者 */}
            <div>
              <Label htmlFor="salesRep">担当者</Label>
              <Input
                id="salesRep"
                value={formData.salesRep}
                onChange={(e) => setFormData({ ...formData, salesRep: e.target.value })}
                placeholder="例: 佐藤一郎"
              />
            </div>

            {/* 金額 */}
            <div>
              <Label htmlFor="amount">金額 (円)</Label>
              <Input
                id="amount"
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                placeholder="40000000"
              />
            </div>

            {/* 獲得経路 */}
            <div>
              <Label htmlFor="source">獲得経路</Label>
              <Select
                value={formData.source}
                onValueChange={(value) => setFormData({ ...formData, source: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="選択..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="HP問い合わせ">HP問い合わせ</SelectItem>
                  <SelectItem value="紹介">紹介</SelectItem>
                  <SelectItem value="チラシ">チラシ</SelectItem>
                  <SelectItem value="展示場">展示場</SelectItem>
                  <SelectItem value="SNS">SNS</SelectItem>
                  <SelectItem value="その他">その他</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* ステータス */}
            <div className="col-span-2">
              <Label>ステータス</Label>
              <div className="grid grid-cols-7 gap-2 mt-2">
                {['リード', '初回面談', '商談中', '見積提出', '契約準備', '成約', '失注'].map((status) => (
                  <Button
                    key={status}
                    type="button"
                    variant={formData.status === status ? "default" : "outline"}
                    size="sm"
                    className={formData.status === status ? statusColors[status] : ''}
                    onClick={() => setFormData({ ...formData, status: status as Deal['status'] })}
                  >
                    {status}
                  </Button>
                ))}
              </div>
            </div>

            {/* 確度 */}
            <div className="col-span-2">
              <Label>確度: {formData.probability}%</Label>
              <div className="flex items-center gap-4 mt-2">
                <Slider
                  value={[formData.probability]}
                  onValueChange={(value) => setFormData({ ...formData, probability: value[0] })}
                  max={100}
                  step={5}
                  className="flex-1"
                />
                <span className="text-2xl font-bold w-16 text-right">{formData.probability}%</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                見込み額: ¥{((formData.amount * formData.probability) / 100).toLocaleString()}
              </p>
            </div>

            {/* 次回アクション */}
            <div>
              <Label htmlFor="nextAction">次回アクション</Label>
              <Input
                id="nextAction"
                value={formData.nextAction}
                onChange={(e) => setFormData({ ...formData, nextAction: e.target.value })}
                placeholder="例: モデルハウス案内"
              />
            </div>

            {/* 次回予定日 */}
            <div>
              <Label htmlFor="nextDate">次回予定日</Label>
              <Input
                id="nextDate"
                type="date"
                value={formData.nextDate}
                onChange={(e) => setFormData({ ...formData, nextDate: e.target.value })}
              />
            </div>

            {/* 備考 */}
            <div className="col-span-2">
              <Label htmlFor="note">備考</Label>
              <Textarea
                id="note"
                value={formData.note}
                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                placeholder="メモ・注意事項など"
                rows={3}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              キャンセル
            </Button>
            <Button type="submit" className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
              <Save className="h-4 w-4 mr-2" />
              {deal ? '更新' : '登録'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
