"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Save, Building } from "lucide-react";
import { projectsStore, type Project } from "@/lib/store/local-storage";

interface ProjectFormProps {
  project?: Project;
  onSave?: (project: Project) => void;
  trigger?: React.ReactNode;
}

export function ProjectForm({ project, onSave, trigger }: ProjectFormProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: project?.name || '',
    customer: project?.customer || '',
    type: project?.type || '新築',
    status: project?.status || '見込み',
    contractAmount: project?.contractAmount || 0,
    estimatedCost: project?.estimatedCost || 0,
    actualCost: project?.actualCost || 0,
    startDate: project?.startDate || '',
    endDate: project?.endDate || '',
    progress: project?.progress || 0,
    salesRep: project?.salesRep || '',
    address: project?.address || '',
    note: project?.note || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let savedProject: Project;
    if (project) {
      savedProject = projectsStore.update(project.id, formData)!;
    } else {
      savedProject = projectsStore.create(formData as Omit<Project, 'id' | 'createdAt' | 'updatedAt'>);
    }

    onSave?.(savedProject);
    setOpen(false);

    // フォームリセット
    if (!project) {
      setFormData({
        name: '',
        customer: '',
        type: '新築',
        status: '見込み',
        contractAmount: 0,
        estimatedCost: 0,
        actualCost: 0,
        startDate: '',
        endDate: '',
        progress: 0,
        salesRep: '',
        address: '',
        note: '',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            案件を追加
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            {project ? '案件を編集' : '新規案件登録'}
          </DialogTitle>
          <DialogDescription>
            案件情報を入力してください
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            {/* 物件名 */}
            <div className="col-span-2">
              <Label htmlFor="name">物件名 *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="例: 山田邸新築工事"
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
                placeholder="例: 山田太郎"
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

            {/* 種別 */}
            <div>
              <Label htmlFor="type">種別</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value as Project['type'] })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="新築">新築</SelectItem>
                  <SelectItem value="リフォーム">リフォーム</SelectItem>
                  <SelectItem value="外壁塗装">外壁塗装</SelectItem>
                  <SelectItem value="外構">外構</SelectItem>
                  <SelectItem value="その他">その他</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* ステータス */}
            <div>
              <Label htmlFor="status">ステータス</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value as Project['status'] })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="見込み">見込み</SelectItem>
                  <SelectItem value="契約済">契約済</SelectItem>
                  <SelectItem value="着工前">着工前</SelectItem>
                  <SelectItem value="進行中">進行中</SelectItem>
                  <SelectItem value="竣工">竣工</SelectItem>
                  <SelectItem value="完了">完了</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 契約額 */}
            <div>
              <Label htmlFor="contractAmount">契約額 (円)</Label>
              <Input
                id="contractAmount"
                type="number"
                value={formData.contractAmount}
                onChange={(e) => setFormData({ ...formData, contractAmount: Number(e.target.value) })}
                placeholder="35000000"
              />
            </div>

            {/* 予定原価 */}
            <div>
              <Label htmlFor="estimatedCost">予定原価 (円)</Label>
              <Input
                id="estimatedCost"
                type="number"
                value={formData.estimatedCost}
                onChange={(e) => setFormData({ ...formData, estimatedCost: Number(e.target.value) })}
                placeholder="28000000"
              />
            </div>

            {/* 実績原価 */}
            <div>
              <Label htmlFor="actualCost">実績原価 (円)</Label>
              <Input
                id="actualCost"
                type="number"
                value={formData.actualCost}
                onChange={(e) => setFormData({ ...formData, actualCost: Number(e.target.value) })}
                placeholder="15000000"
              />
            </div>

            {/* 進捗率 */}
            <div>
              <Label htmlFor="progress">進捗率 (%)</Label>
              <Input
                id="progress"
                type="number"
                min="0"
                max="100"
                value={formData.progress}
                onChange={(e) => setFormData({ ...formData, progress: Number(e.target.value) })}
                placeholder="45"
              />
            </div>

            {/* 着工日 */}
            <div>
              <Label htmlFor="startDate">着工日</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              />
            </div>

            {/* 完工予定日 */}
            <div>
              <Label htmlFor="endDate">完工予定日</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              />
            </div>

            {/* 住所 */}
            <div className="col-span-2">
              <Label htmlFor="address">現場住所</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="高知市〇〇町1-2-3"
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

          {/* 粗利プレビュー */}
          {formData.contractAmount > 0 && formData.estimatedCost > 0 && (
            <div className="p-4 rounded-lg bg-muted/50">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-xs text-muted-foreground">予定粗利</p>
                  <p className="text-lg font-bold text-green-600">
                    ¥{(formData.contractAmount - formData.estimatedCost).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">粗利率</p>
                  <p className="text-lg font-bold">
                    {((formData.contractAmount - formData.estimatedCost) / formData.contractAmount * 100).toFixed(1)}%
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">原価消化率</p>
                  <p className="text-lg font-bold text-blue-600">
                    {formData.estimatedCost > 0
                      ? ((formData.actualCost / formData.estimatedCost) * 100).toFixed(1)
                      : 0}%
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              キャンセル
            </Button>
            <Button type="submit" className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
              <Save className="h-4 w-4 mr-2" />
              {project ? '更新' : '登録'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
