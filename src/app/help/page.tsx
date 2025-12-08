"use client";

import { DashboardLayout } from "@/components/dashboard/sidebar-nav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HelpCircle, Book, MessageSquare, Video, FileText, ExternalLink } from "lucide-react";

const guides = [
  { title: 'はじめに', description: '建匠DXの基本的な使い方', icon: Book },
  { title: '営業管理', description: '商談パイプラインの活用方法', icon: FileText },
  { title: '原価管理', description: '原価入力と粗利監視のガイド', icon: FileText },
  { title: '工程管理', description: 'ガントチャートの操作方法', icon: FileText },
  { title: 'AI自動化', description: '自動化機能の設定と活用', icon: FileText },
  { title: 'Lark連携', description: 'Larkとの連携設定ガイド', icon: MessageSquare },
];

const faqs = [
  { q: '粗利アラートの閾値を変更するには？', a: '設定 > 通知設定から変更できます' },
  { q: 'データをエクスポートするには？', a: '設定 > データ管理からエクスポート可能です' },
  { q: '新しいユーザーを追加するには？', a: '管理者権限で設定 > ユーザー管理から追加できます' },
];

export default function HelpPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">ヘルプ</h1>
          <p className="text-muted-foreground">使い方ガイド・FAQ</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Book className="h-5 w-5" />
                <CardTitle>使い方ガイド</CardTitle>
              </div>
              <CardDescription>各機能の詳しい使い方</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2">
                {guides.map((guide) => (
                  <div
                    key={guide.title}
                    className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:bg-muted/50"
                  >
                    <guide.icon className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="font-medium text-sm">{guide.title}</p>
                      <p className="text-xs text-muted-foreground">{guide.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Video className="h-5 w-5" />
                <CardTitle>動画チュートリアル</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                <Video className="h-12 w-12 text-muted-foreground" />
              </div>
              <Button variant="outline" className="w-full">
                動画を見る
                <ExternalLink className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              <CardTitle>よくある質問</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="p-4 rounded-lg bg-muted/50">
                <p className="font-medium text-sm mb-2">Q: {faq.q}</p>
                <p className="text-sm text-muted-foreground">A: {faq.a}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>サポート</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <Button>
                <MessageSquare className="h-4 w-4 mr-2" />
                Larkでお問い合わせ
              </Button>
              <Button variant="outline">メールでお問い合わせ</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
