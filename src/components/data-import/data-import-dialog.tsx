"use client";

import { useState, useCallback } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Upload,
  FileSpreadsheet,
  Database,
  Cloud,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Download,
  FileText,
  Table,
  Settings,
  Link,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

// データインポートの状態
interface ImportState {
  status: 'idle' | 'importing' | 'success' | 'error';
  progress: number;
  message: string;
  recordCount?: number;
}

interface DataImportDialogProps {
  onImportComplete?: (source: string, recordCount: number) => void;
  trigger?: React.ReactNode;
}

export function DataImportDialog({ onImportComplete, trigger }: DataImportDialogProps) {
  const [open, setOpen] = useState(false);
  const [importState, setImportState] = useState<ImportState>({
    status: 'idle',
    progress: 0,
    message: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Excelファイルのドロップハンドラー
  const handleFileDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && (file.name.endsWith('.xlsx') || file.name.endsWith('.xls'))) {
      setSelectedFile(file);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  // Excelインポート実行
  const handleExcelImport = async () => {
    if (!selectedFile) return;

    setImportState({ status: 'importing', progress: 0, message: 'ファイルを読み込み中...' });

    try {
      // 動的インポート（クライアントサイドのみ）
      const { readExcelFile, transformExcelToProject } = await import('@/lib/integrations/excel');

      setImportState({ status: 'importing', progress: 30, message: 'データを解析中...' });

      const { sheets, sheetNames } = await readExcelFile(selectedFile);

      setImportState({ status: 'importing', progress: 60, message: 'データを変換中...' });

      // 最初のシートのデータを変換
      const sheetData = sheets[sheetNames[0]];
      const projects = sheetData.map(row => transformExcelToProject(row));

      setImportState({ status: 'importing', progress: 90, message: 'データを保存中...' });

      // ここで実際にデータストアに保存
      // updateDataStore('projects', projects, 'excel');

      await new Promise(resolve => setTimeout(resolve, 500));

      setImportState({
        status: 'success',
        progress: 100,
        message: 'インポート完了',
        recordCount: projects.length,
      });

      onImportComplete?.('excel', projects.length);
    } catch (error) {
      setImportState({
        status: 'error',
        progress: 0,
        message: `エラー: ${error}`,
      });
    }
  };

  // Lark同期実行
  const handleLarkSync = async () => {
    setImportState({ status: 'importing', progress: 0, message: 'Larkに接続中...' });

    try {
      setImportState({ status: 'importing', progress: 30, message: 'Bitableからデータを取得中...' });
      await new Promise(resolve => setTimeout(resolve, 1000));

      setImportState({ status: 'importing', progress: 60, message: 'データを同期中...' });
      await new Promise(resolve => setTimeout(resolve, 1000));

      setImportState({ status: 'importing', progress: 90, message: '完了処理中...' });
      await new Promise(resolve => setTimeout(resolve, 500));

      // 実際のAPI呼び出し
      // const result = await syncAllData('lark');

      setImportState({
        status: 'success',
        progress: 100,
        message: 'Lark同期完了',
        recordCount: 42, // デモ値
      });

      onImportComplete?.('lark', 42);
    } catch (error) {
      setImportState({
        status: 'error',
        progress: 0,
        message: `エラー: ${error}`,
      });
    }
  };

  // Google Sheets同期実行
  const handleSheetsSync = async () => {
    setImportState({ status: 'importing', progress: 0, message: 'Google Sheetsに接続中...' });

    try {
      setImportState({ status: 'importing', progress: 30, message: 'スプレッドシートからデータを取得中...' });
      await new Promise(resolve => setTimeout(resolve, 1000));

      setImportState({ status: 'importing', progress: 60, message: 'データを同期中...' });
      await new Promise(resolve => setTimeout(resolve, 1000));

      setImportState({ status: 'importing', progress: 90, message: '完了処理中...' });
      await new Promise(resolve => setTimeout(resolve, 500));

      setImportState({
        status: 'success',
        progress: 100,
        message: 'Google Sheets同期完了',
        recordCount: 38, // デモ値
      });

      onImportComplete?.('sheets', 38);
    } catch (error) {
      setImportState({
        status: 'error',
        progress: 0,
        message: `エラー: ${error}`,
      });
    }
  };

  // テンプレートダウンロード
  const handleDownloadTemplate = async (type: string) => {
    try {
      const { generateExcelTemplate } = await import('@/lib/integrations/excel');
      generateExcelTemplate(type as 'projects' | 'deals' | 'customers' | 'costs' | 'sales');
    } catch (error) {
      console.error('Template download error:', error);
    }
  };

  const resetState = () => {
    setImportState({ status: 'idle', progress: 0, message: '' });
    setSelectedFile(null);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) resetState(); }}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline">
            <Database className="h-4 w-4 mr-2" />
            データ連携
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            データ連携・インポート
          </DialogTitle>
          <DialogDescription>
            Lark Bitable、Google Sheets、Excelからデータを取り込み
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="lark" className="mt-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="lark" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              <span className="hidden sm:inline">Lark</span>
            </TabsTrigger>
            <TabsTrigger value="sheets" className="flex items-center gap-2">
              <Table className="h-4 w-4" />
              <span className="hidden sm:inline">Sheets</span>
            </TabsTrigger>
            <TabsTrigger value="excel" className="flex items-center gap-2">
              <FileSpreadsheet className="h-4 w-4" />
              <span className="hidden sm:inline">Excel</span>
            </TabsTrigger>
            <TabsTrigger value="manual" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">手動</span>
            </TabsTrigger>
          </TabsList>

          {/* Lark Bitable */}
          <TabsContent value="lark" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-100">
                    <Database className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Lark Bitable 同期</CardTitle>
                    <CardDescription>Lark BitableのデータをリアルタイムCで同期</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg bg-muted/50">
                    <Label className="text-xs text-muted-foreground">Bitable App Token</Label>
                    <Input placeholder="bascXXXXX..." className="mt-1" />
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <Label className="text-xs text-muted-foreground">Table ID</Label>
                    <Input placeholder="tblXXXXX..." className="mt-1" />
                  </div>
                </div>

                <div className="p-4 rounded-lg border border-dashed">
                  <h4 className="font-medium text-sm mb-2">同期対象テーブル</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {['案件', '商談', '顧客', '原価', '工程'].map((table) => (
                      <Badge key={table} variant="outline" className="justify-center">
                        {table}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={handleLarkSync}
                  disabled={importState.status === 'importing'}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {importState.status === 'importing' ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      同期中...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Lark Bitableと同期
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Google Sheets */}
          <TabsContent value="sheets" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-green-100">
                    <Table className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Google Sheets 同期</CardTitle>
                    <CardDescription>Googleスプレッドシートからデータを取得</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 rounded-lg bg-muted/50">
                  <Label className="text-xs text-muted-foreground">スプレッドシートID</Label>
                  <Input placeholder="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms..." className="mt-1" />
                </div>

                <div className="p-4 rounded-lg border border-dashed">
                  <h4 className="font-medium text-sm mb-2">同期対象シート</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {['売上一覧', 'KPI', '案件一覧', '顧客一覧'].map((sheet) => (
                      <Badge key={sheet} variant="outline" className="justify-center">
                        {sheet}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={handleSheetsSync}
                    disabled={importState.status === 'importing'}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    {importState.status === 'importing' ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        同期中...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Google Sheetsと同期
                      </>
                    )}
                  </Button>
                  <Button variant="outline">
                    <Link className="h-4 w-4 mr-2" />
                    認証
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Excel */}
          <TabsContent value="excel" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-100">
                    <FileSpreadsheet className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Excel インポート</CardTitle>
                    <CardDescription>Excelファイル(.xlsx)をアップロードしてデータを取り込み</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* ドロップエリア */}
                <div
                  className={cn(
                    "p-8 rounded-lg border-2 border-dashed text-center transition-colors",
                    selectedFile ? "border-emerald-500 bg-emerald-50" : "border-muted-foreground/25 hover:border-emerald-500/50"
                  )}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleFileDrop}
                >
                  {selectedFile ? (
                    <div className="flex flex-col items-center gap-2">
                      <CheckCircle className="h-10 w-10 text-emerald-500" />
                      <p className="font-medium">{selectedFile.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(selectedFile.size / 1024).toFixed(1)} KB
                      </p>
                      <Button variant="outline" size="sm" onClick={() => setSelectedFile(null)}>
                        変更
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <Upload className="h-10 w-10 text-muted-foreground" />
                      <p className="font-medium">Excelファイルをドロップ</p>
                      <p className="text-sm text-muted-foreground">または</p>
                      <label>
                        <input
                          type="file"
                          accept=".xlsx,.xls"
                          className="hidden"
                          onChange={handleFileSelect}
                        />
                        <Button variant="outline" size="sm" asChild>
                          <span>ファイルを選択</span>
                        </Button>
                      </label>
                    </div>
                  )}
                </div>

                {/* テンプレートダウンロード */}
                <div className="p-4 rounded-lg bg-muted/50">
                  <h4 className="font-medium text-sm mb-2">テンプレートダウンロード</h4>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { key: 'projects', label: '案件' },
                      { key: 'deals', label: '商談' },
                      { key: 'customers', label: '顧客' },
                      { key: 'costs', label: '原価' },
                      { key: 'sales', label: '売上' },
                    ].map((item) => (
                      <Button
                        key={item.key}
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadTemplate(item.key)}
                      >
                        <Download className="h-3 w-3 mr-1" />
                        {item.label}
                      </Button>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={handleExcelImport}
                  disabled={!selectedFile || importState.status === 'importing'}
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                >
                  {importState.status === 'importing' ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      インポート中...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      インポート実行
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 手動入力 */}
          <TabsContent value="manual" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-100">
                    <FileText className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <CardTitle className="text-base">手動入力</CardTitle>
                    <CardDescription>フォームから直接データを入力</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" className="h-20 flex-col">
                    <FileText className="h-6 w-6 mb-1" />
                    案件を追加
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <FileText className="h-6 w-6 mb-1" />
                    商談を追加
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <FileText className="h-6 w-6 mb-1" />
                    顧客を追加
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <FileText className="h-6 w-6 mb-1" />
                    原価を追加
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* インポート進捗 */}
        {importState.status !== 'idle' && (
          <Card className={cn(
            "mt-4",
            importState.status === 'success' && "border-green-500",
            importState.status === 'error' && "border-red-500"
          )}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-3">
                {importState.status === 'importing' && (
                  <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                )}
                {importState.status === 'success' && (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                )}
                {importState.status === 'error' && (
                  <AlertCircle className="h-5 w-5 text-red-500" />
                )}
                <span className="font-medium">{importState.message}</span>
              </div>
              {importState.status === 'importing' && (
                <Progress value={importState.progress} className="h-2" />
              )}
              {importState.status === 'success' && importState.recordCount && (
                <p className="text-sm text-muted-foreground">
                  {importState.recordCount}件のデータをインポートしました
                </p>
              )}
            </CardContent>
          </Card>
        )}
      </DialogContent>
    </Dialog>
  );
}
