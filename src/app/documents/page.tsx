"use client";

import { DashboardLayout } from "@/components/dashboard/sidebar-nav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Folder, Upload, Download, Eye } from "lucide-react";

const documents = [
  { id: 1, name: '山田邸_設計図面.pdf', type: 'PDF', project: '山田邸新築', size: '15.2MB', updated: '2024-12-07' },
  { id: 2, name: '鈴木邸_見積書.xlsx', type: 'Excel', project: '鈴木邸リフォーム', size: '2.1MB', updated: '2024-12-06' },
  { id: 3, name: '高橋邸_契約書.pdf', type: 'PDF', project: '高橋邸新築', size: '1.8MB', updated: '2024-12-01' },
  { id: 4, name: '伊藤邸_現地写真.zip', type: 'ZIP', project: '伊藤邸外壁塗装', size: '45.6MB', updated: '2024-12-05' },
  { id: 5, name: '標準見積テンプレート.xlsx', type: 'Excel', project: 'テンプレート', size: '0.8MB', updated: '2024-11-15' },
];

const folders = [
  { name: '図面PDF（物件別）', count: 24 },
  { name: 'CADデータ', count: 18 },
  { name: '見積・契約テンプレート', count: 12 },
  { name: '現場写真', count: 156 },
];

export default function DocumentsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">図面・資料</h1>
            <p className="text-muted-foreground">設計図面・契約書類の一元管理</p>
          </div>
          <Button>
            <Upload className="h-4 w-4 mr-2" />
            アップロード
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          {folders.map((folder) => (
            <Card key={folder.name} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Folder className="h-10 w-10 text-amber-500" />
                  <div>
                    <p className="font-medium text-sm">{folder.name}</p>
                    <p className="text-xs text-muted-foreground">{folder.count}件</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              <CardTitle>最近の資料</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="h-8 w-8 text-blue-500" />
                    <div>
                      <p className="font-medium text-sm">{doc.name}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Badge variant="outline" className="text-xs">{doc.type}</Badge>
                        <span>{doc.project}</span>
                        <span>{doc.size}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{doc.updated}</span>
                    <Button variant="ghost" size="sm"><Eye className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="sm"><Download className="h-4 w-4" /></Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
