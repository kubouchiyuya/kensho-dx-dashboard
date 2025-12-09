"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Plus, Save, Calculator } from "lucide-react";
import { costsStore, projectsStore, type CostRecord } from "@/lib/store/local-storage";

interface CostFormProps {
  cost?: CostRecord;
  projectId?: string;
  onSave?: (cost: CostRecord) => void;
  trigger?: React.ReactNode;
}

export function CostForm({ cost, projectId, onSave, trigger }: CostFormProps) {
  const [open, setOpen] = useState(false);
  const projects = projectsStore.getAll();

  const [formData, setFormData] = useState({
    projectId: cost?.projectId || projectId || '',
    projectName: cost?.projectName || '',
    category: cost?.category || '材料費',
    vendor: cost?.vendor || '',
    description: cost?.description || '',
    estimatedAmount: cost?.estimatedAmount || 0,
    actualAmount: cost?.actualAmount || 0,
    date: cost?.date || new Date().toISOString().split('T')[0],
    isPaid: cost?.isPaid || false,
    note: cost?.note || '',
  });

  // プロジェクト選択時に名前も更新
  const handleProjectChange = (id: string) => {
    const project = projects.find(p => p.id === id);
    setFormData({
      ...formData,
      projectId: id,
      projectName: project?.name || '',
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let savedCost: CostRecord;
    if (cost) {
      savedCost = costsStore.update(cost.id, formData)!;
    } else {
      savedCost = costsStore.create(formData as Omit<CostRecord, 'id' | 'createdAt' | 'updatedAt'>);
    }

    onSave?.(savedCost);
    setOpen(false);

    if (!cost) {
      setFormData({
        projectId: projectId || '',
        projectName: '',
        category: '材料費',
        vendor: '',
        description: '',
        estimatedAmount: 0,
        actualAmount: 0,
        date: new Date().toISOString().split('T')[0],
        isPaid: false,
        note: '',
      });
    }
  };

  const categoryColors: Record<string, string> = {
    '材料費': 'bg-amber-100 text-amber-700',
    '人件費': 'bg-blue-100 text-blue-700',
    '外注費': 'bg-green-100 text-green-700',
    '諸経費': 'bg-purple-100 text-purple-700',
    'その他': 'bg-gray-100 text-gray-700',
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            原価を追加
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            {cost ? '原価を編集' : '新規原価登録'}
          </DialogTitle>
          <DialogDescription>
            原価情報を入力してください
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            {/* 物件選択 */}
            <div className="col-span-2">
              <Label htmlFor="project">物件 *</Label>
              <Select
                value={formData.projectId}
                onValueChange={handleProjectChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="物件を選択..." />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name} ({project.customer})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 費目 */}
            <div>
              <Label>費目</Label>
              <div className="grid grid-cols-5 gap-1 mt-2">
                {['材料費', '人件費', '外注費', '諸経費', 'その他'].map((cat) => (
                  <Button
                    key={cat}
                    type="button"
                    variant="outline"
                    size="sm"
                    className={formData.category === cat ? categoryColors[cat] : ''}
                    onClick={() => setFormData({ ...formData, category: cat as CostRecord['category'] })}
                  >
                    {cat}
                  </Button>
                ))}
              </div>
            </div>

            {/* 計上日 */}
            <div>
              <Label htmlFor="date">計上日</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>

            {/* 業者名 */}
            <div>
              <Label htmlFor="vendor">業者名</Label>
              <Input
                id="vendor"
                value={formData.vendor}
                onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                placeholder="例: 〇〇建材"
              />
            </div>

            {/* 内容 */}
            <div>
              <Label htmlFor="description">内容</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="例: 木材一式"
              />
            </div>

            {/* 予定額 */}
            <div>
              <Label htmlFor="estimatedAmount">予定額 (円)</Label>
              <Input
                id="estimatedAmount"
                type="number"
                value={formData.estimatedAmount}
                onChange={(e) => setFormData({ ...formData, estimatedAmount: Number(e.target.value) })}
                placeholder="5000000"
              />
            </div>

            {/* 実績額 */}
            <div>
              <Label htmlFor="actualAmount">実績額 (円)</Label>
              <Input
                id="actualAmount"
                type="number"
                value={formData.actualAmount}
                onChange={(e) => setFormData({ ...formData, actualAmount: Number(e.target.value) })}
                placeholder="4800000"
              />
            </div>

            {/* 支払済み */}
            <div className="col-span-2">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div>
                  <Label htmlFor="isPaid">支払済み</Label>
                  <p className="text-xs text-muted-foreground">この原価は支払い完了していますか？</p>
                </div>
                <Switch
                  id="isPaid"
                  checked={formData.isPaid}
                  onCheckedChange={(checked) => setFormData({ ...formData, isPaid: checked })}
                />
              </div>
            </div>

            {/* 差額プレビュー */}
            {formData.estimatedAmount > 0 && (
              <div className="col-span-2 p-4 rounded-lg bg-muted/50">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-xs text-muted-foreground">予定額</p>
                    <p className="text-lg font-bold">
                      ¥{formData.estimatedAmount.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">実績額</p>
                    <p className="text-lg font-bold text-blue-600">
                      ¥{formData.actualAmount.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">差額</p>
                    <p className={`text-lg font-bold ${
                      formData.estimatedAmount - formData.actualAmount >= 0
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}>
                      ¥{(formData.estimatedAmount - formData.actualAmount).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            )}

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
              {cost ? '更新' : '登録'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
