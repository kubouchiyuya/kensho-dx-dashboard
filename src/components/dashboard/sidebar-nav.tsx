"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard,
  Briefcase,
  Calculator,
  Calendar,
  FileText,
  Users,
  Settings,
  Bell,
  Brain,
  MessageSquare,
  Building2,
  TrendingUp,
  HelpCircle,
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  {
    group: "経営",
    items: [
      { icon: LayoutDashboard, label: "ダッシュボード", href: "/", badge: null },
      { icon: TrendingUp, label: "売上・KPI", href: "/sales", badge: null },
    ]
  },
  {
    group: "営業",
    items: [
      { icon: Briefcase, label: "商談管理", href: "/deals", badge: "5" },
      { icon: Users, label: "顧客管理", href: "/customers", badge: null },
    ]
  },
  {
    group: "工事",
    items: [
      { icon: Building2, label: "案件一覧", href: "/projects", badge: null },
      { icon: Calculator, label: "原価管理", href: "/costs", badge: "!" },
      { icon: Calendar, label: "工程管理", href: "/schedule", badge: null },
      { icon: FileText, label: "図面・資料", href: "/documents", badge: null },
    ]
  },
  {
    group: "AI・自動化",
    items: [
      { icon: Brain, label: "AI自動化", href: "/automation", badge: "8" },
      { icon: Bell, label: "アラート", href: "/alerts", badge: "3" },
      { icon: MessageSquare, label: "Lark連携", href: "/lark", badge: null },
    ]
  },
  {
    group: "設定",
    items: [
      { icon: Settings, label: "設定", href: "/settings", badge: null },
      { icon: HelpCircle, label: "ヘルプ", href: "/help", badge: null },
    ]
  }
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center shadow-lg">
            <Building2 className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-wide">建匠DX</h1>
            <p className="text-xs text-sidebar-foreground/70">100億円ビジョン 2030</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {menuItems.map((group) => (
          <SidebarGroup key={group.group}>
            <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground">
              {group.group}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.href}
                      className={cn(
                        "w-full justify-start",
                        pathname === item.href && "bg-primary/10 text-primary"
                      )}
                    >
                      <Link href={item.href} className="flex items-center gap-3">
                        <item.icon className="h-4 w-4" />
                        <span className="flex-1">{item.label}</span>
                        {item.badge && (
                          <Badge
                            variant={item.badge === "!" ? "destructive" : "secondary"}
                            className="text-xs h-5 px-1.5"
                          >
                            {item.badge}
                          </Badge>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src="/avatar.png" />
            <AvatarFallback className="bg-primary/10 text-primary">
              管
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">管理者</p>
            <p className="text-xs text-muted-foreground truncate">admin@kensho.co.jp</p>
          </div>
          <button className="p-2 hover:bg-muted rounded-lg transition-colors">
            <LogOut className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1 overflow-auto">
          <div className="flex items-center gap-4 border-b px-4 py-3">
            <SidebarTrigger />
            <div className="flex-1" />
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                AI稼働中
              </Badge>
              <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                Lark接続済
              </Badge>
            </div>
          </div>
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
