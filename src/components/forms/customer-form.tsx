"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Save, User } from "lucide-react";
import { customersStore, type Customer } from "@/lib/store/local-storage";

interface CustomerFormProps {
  customer?: Customer;
  onSave?: (customer: Customer) => void;
  trigger?: React.ReactNode;
}

export function CustomerForm({ customer, onSave, trigger }: CustomerFormProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: customer?.name || '',
    nameKana: customer?.nameKana || '',
    company: customer?.company || '',
    email: customer?.email || '',
    phone: customer?.phone || '',
    postalCode: customer?.postalCode || '',
    address: customer?.address || '',
    status: customer?.status || 'リード',
    source: customer?.source || 'HP問い合わせ',
    totalAmount: customer?.totalAmount || 0,
    lastContact: customer?.lastContact || new Date().toISOString().split('T')[0],
    note: customer?.note || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let savedCustomer: Customer;
    if (customer) {
      savedCustomer = customersStore.update(customer.id, formData)!;
    } else {
      savedCustomer = customersStore.create(formData as Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>);
    }

    onSave?.(savedCustomer);
    setOpen(false);

    if (!customer) {
      setFormData({
        name: '',
        nameKana: '',
        company: '',
        email: '',
        phone: '',
        postalCode: '',
        address: '',
        status: 'リード',
        source: 'HP問い合わせ',
        totalAmount: 0,
        lastContact: new Date().toISOString().split('T')[0],
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
            顧客を追加
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {customer ? '顧客情報を編集' : '新規顧客登録'}
          </DialogTitle>
          <DialogDescription>
            顧客情報を入力してください
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            {/* 顧客名 */}
            <div>
              <Label htmlFor="name">顧客名 *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="例: 山田太郎"
                required
              />
            </div>

            {/* フリガナ */}
            <div>
              <Label htmlFor="nameKana">フリガナ</Label>
              <Input
                id="nameKana"
                value={formData.nameKana}
                onChange={(e) => setFormData({ ...formData, nameKana: e.target.value })}
                placeholder="例: ヤマダタロウ"
              />
            </div>

            {/* 会社名 */}
            <div className="col-span-2">
              <Label htmlFor="company">会社名（法人の場合）</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="例: 株式会社〇〇"
              />
            </div>

            {/* メール */}
            <div>
              <Label htmlFor="email">メールアドレス</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="例: yamada@example.com"
              />
            </div>

            {/* 電話番号 */}
            <div>
              <Label htmlFor="phone">電話番号</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="例: 090-1234-5678"
              />
            </div>

            {/* 郵便番号 */}
            <div>
              <Label htmlFor="postalCode">郵便番号</Label>
              <Input
                id="postalCode"
                value={formData.postalCode}
                onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                placeholder="例: 780-0001"
              />
            </div>

            {/* ステータス */}
            <div>
              <Label htmlFor="status">ステータス</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value as Customer['status'] })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="リード">リード</SelectItem>
                  <SelectItem value="アクティブ">アクティブ</SelectItem>
                  <SelectItem value="契約中">契約中</SelectItem>
                  <SelectItem value="完了">完了</SelectItem>
                  <SelectItem value="休眠">休眠</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 住所 */}
            <div className="col-span-2">
              <Label htmlFor="address">住所</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="例: 高知市〇〇町1-2-3"
              />
            </div>

            {/* 獲得経路 */}
            <div>
              <Label htmlFor="source">獲得経路</Label>
              <Select
                value={formData.source}
                onValueChange={(value) => setFormData({ ...formData, source: value as Customer['source'] })}
              >
                <SelectTrigger>
                  <SelectValue />
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

            {/* 最終連絡日 */}
            <div>
              <Label htmlFor="lastContact">最終連絡日</Label>
              <Input
                id="lastContact"
                type="date"
                value={formData.lastContact}
                onChange={(e) => setFormData({ ...formData, lastContact: e.target.value })}
              />
            </div>

            {/* 累計取引額 */}
            <div className="col-span-2">
              <Label htmlFor="totalAmount">累計取引額 (円)</Label>
              <Input
                id="totalAmount"
                type="number"
                value={formData.totalAmount}
                onChange={(e) => setFormData({ ...formData, totalAmount: Number(e.target.value) })}
                placeholder="0"
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
              {customer ? '更新' : '登録'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
