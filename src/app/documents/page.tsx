"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/sidebar-nav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FileText, Folder, Upload, Download, Eye, X, ChevronRight, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";

const documents = [
  { id: 1, name: '山田邸_設計図面.pdf', type: 'PDF', project: '山田邸新築', size: '15.2MB', updated: '2024-12-07', pages: 24 },
  { id: 2, name: '鈴木邸_見積書.xlsx', type: 'Excel', project: '鈴木邸リフォーム', size: '2.1MB', updated: '2024-12-06', pages: 5 },
  { id: 3, name: '高橋邸_契約書.pdf', type: 'PDF', project: '高橋邸新築', size: '1.8MB', updated: '2024-12-01', pages: 12 },
  { id: 4, name: '伊藤邸_現地写真.zip', type: 'ZIP', project: '伊藤邸外壁塗装', size: '45.6MB', updated: '2024-12-05', pages: 48 },
  { id: 5, name: '標準見積テンプレート.xlsx', type: 'Excel', project: 'テンプレート', size: '0.8MB', updated: '2024-11-15', pages: 3 },
];

const folders = [
  { name: '図面PDF（物件別）', count: 24, icon: '📐' },
  { name: 'CADデータ', count: 18, icon: '🏗️' },
  { name: '見積・契約テンプレート', count: 12, icon: '📋' },
  { name: '現場写真', count: 156, icon: '📸' },
];

export default function DocumentsPage() {
  const [selectedDoc, setSelectedDoc] = useState<typeof documents[0] | null>(null);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredDocs = documents.filter(doc =>
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.project.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">図面・資料</h1>
            <p className="text-muted-foreground">設計図面・契約書類の一元管理</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              フィルター
            </Button>
            <Button className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
              <Upload className="h-4 w-4 mr-2" />
              アップロード
            </Button>
          </div>
        </div>

        {/* 検索バー */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="ファイル名、プロジェクト名で検索..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* フォルダ一覧 */}
        <div className="grid gap-4 md:grid-cols-4">
          {folders.map((folder) => (
            <Card
              key={folder.name}
              className={`cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1 ${
                selectedFolder === folder.name ? 'ring-2 ring-amber-500 bg-amber-50' : ''
              }`}
              onClick={() => setSelectedFolder(selectedFolder === folder.name ? null : folder.name)}
            >
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{folder.icon}</div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{folder.name}</p>
                    <p className="text-xs text-muted-foreground">{folder.count}件</p>
                  </div>
                  <ChevronRight className={`h-4 w-4 text-muted-foreground transition-transform ${
                    selectedFolder === folder.name ? 'rotate-90' : ''
                  }`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 選択フォルダ表示 */}
        {selectedFolder && (
          <div className="p-4 rounded-lg bg-amber-50 border border-amber-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Folder className="h-5 w-5 text-amber-600" />
                <span className="font-medium text-amber-800">{selectedFolder}を表示中</span>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setSelectedFolder(null)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* ファイル一覧 */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                <CardTitle>最近の資料</CardTitle>
              </div>
              <Badge variant="outline">{filteredDocs.length}件</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredDocs.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 hover:border-amber-300 transition-all cursor-pointer"
                  onClick={() => setSelectedDoc(doc)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      doc.type === 'PDF' ? 'bg-red-100' :
                      doc.type === 'Excel' ? 'bg-green-100' : 'bg-blue-100'
                    }`}>
                      <FileText className={`h-6 w-6 ${
                        doc.type === 'PDF' ? 'text-red-600' :
                        doc.type === 'Excel' ? 'text-green-600' : 'text-blue-600'
                      }`} />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{doc.name}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Badge variant="outline" className="text-xs">{doc.type}</Badge>
                        <span>{doc.project}</span>
                        <span>•</span>
                        <span>{doc.size}</span>
                        <span>•</span>
                        <span>{doc.pages}ページ</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{doc.updated}</span>
                    <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); }}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); }}>
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* ファイル詳細ダイアログ */}
        <Dialog open={!!selectedDoc} onOpenChange={(open) => !open && setSelectedDoc(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {selectedDoc?.name}
              </DialogTitle>
              <DialogDescription>ファイルの詳細情報</DialogDescription>
            </DialogHeader>
            {selectedDoc && (
              <div className="space-y-4">
                <div className="aspect-video bg-slate-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <FileText className="h-16 w-16 text-slate-400 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">プレビュー</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg bg-muted">
                    <p className="text-xs text-muted-foreground">ファイルタイプ</p>
                    <p className="font-medium">{selectedDoc.type}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted">
                    <p className="text-xs text-muted-foreground">ファイルサイズ</p>
                    <p className="font-medium">{selectedDoc.size}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted">
                    <p className="text-xs text-muted-foreground">関連プロジェクト</p>
                    <p className="font-medium">{selectedDoc.project}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted">
                    <p className="text-xs text-muted-foreground">最終更新日</p>
                    <p className="font-medium">{selectedDoc.updated}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                    <Eye className="h-4 w-4 mr-2" />
                    開く
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    ダウンロード
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
