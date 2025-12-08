"use client";

import { DashboardLayout } from "@/components/dashboard/sidebar-nav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Building2, Plus } from "lucide-react";
import { sampleProjects, formatFullCurrency } from "@/lib/data";

export default function ProjectsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">案件一覧</h1>
            <p className="text-muted-foreground">進行中の全案件を管理</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            新規案件
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              <CardTitle>案件一覧</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>案件ID</TableHead>
                  <TableHead>物件名</TableHead>
                  <TableHead>種別</TableHead>
                  <TableHead className="text-right">契約額</TableHead>
                  <TableHead>ステータス</TableHead>
                  <TableHead>進捗</TableHead>
                  <TableHead>完工予定</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sampleProjects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell className="font-mono text-sm">{project.id}</TableCell>
                    <TableCell className="font-medium">{project.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{project.type}</Badge>
                    </TableCell>
                    <TableCell className="text-right">{formatFullCurrency(project.contractAmount)}</TableCell>
                    <TableCell>
                      <Badge className={
                        project.status === '進行中' ? 'bg-blue-100 text-blue-700' :
                        project.status === '着工前' ? 'bg-slate-100 text-slate-700' :
                        'bg-green-100 text-green-700'
                      }>
                        {project.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="w-24">
                        <Progress value={project.progress} className="h-2" />
                        <span className="text-xs text-muted-foreground">{project.progress}%</span>
                      </div>
                    </TableCell>
                    <TableCell>{project.endDate}</TableCell>
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
