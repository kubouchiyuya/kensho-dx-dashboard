"use client";

import { DashboardLayout } from "@/components/dashboard/sidebar-nav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const customers = [
  { id: 'C001', name: '山田太郎', area: '高知市', type: '新築', budget: '3000-4000万', status: '商談中', lastContact: '2024-12-07' },
  { id: 'C002', name: '鈴木花子', area: '南国市', type: 'リフォーム', budget: '1000-1500万', status: '契約済', lastContact: '2024-12-05' },
  { id: 'C003', name: '高橋次郎', area: '香南市', type: '新築', budget: '4000-5000万', status: '契約済', lastContact: '2024-12-01' },
  { id: 'C004', name: '伊藤美咲', area: '土佐市', type: '外装', budget: '500-1000万', status: '見積中', lastContact: '2024-12-06' },
  { id: 'C005', name: '渡辺健一', area: '高知市', type: '新築', budget: '5000万以上', status: '初回面談', lastContact: '2024-12-08' },
];

export default function CustomersPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">顧客管理</h1>
            <p className="text-muted-foreground">顧客情報の一元管理</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            新規顧客
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                <CardTitle>顧客一覧</CardTitle>
              </div>
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input placeholder="検索..." className="w-64" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>顧客名</TableHead>
                  <TableHead>エリア</TableHead>
                  <TableHead>検討内容</TableHead>
                  <TableHead>予算</TableHead>
                  <TableHead>ステータス</TableHead>
                  <TableHead>最終連絡</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium">{customer.name}</TableCell>
                    <TableCell>{customer.area}</TableCell>
                    <TableCell>{customer.type}</TableCell>
                    <TableCell>{customer.budget}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{customer.status}</Badge>
                    </TableCell>
                    <TableCell>{customer.lastContact}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">詳細</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
