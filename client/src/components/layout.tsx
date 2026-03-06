import { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { LayoutDashboard, Users, LogOut, Dumbbell } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { SidebarProvider, Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, logout } = useAuth();
  const [location] = useLocation();

  useEffect(() => {
    if (!isLoading && !user && location !== "/login") {
      window.location.href = "/login";
    }
  }, [user, isLoading, location]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Dumbbell className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  const style = {
    "--sidebar-width": "18rem",
  } as React.CSSProperties;

  return (
    <SidebarProvider style={style}>
      <div className="flex h-screen w-full bg-background overflow-hidden">
        <Sidebar className="border-r border-white/5 bg-sidebar-background">
          <SidebarContent>
            <div className="p-6 flex items-center gap-3">
              <div className="bg-primary p-2 rounded-xl text-primary-foreground shadow-lg shadow-primary/20">
                <Dumbbell className="w-6 h-6" />
              </div>
              <h1 className="font-display font-bold text-xl tracking-tight text-white">Plenitude</h1>
            </div>

            <SidebarGroup>
              <SidebarGroupLabel className="text-muted-foreground uppercase text-xs tracking-wider">
                Menu Principal
              </SidebarGroupLabel>
              <SidebarGroupContent className="mt-2">
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={location === "/dashboard" || location === "/"}>
                      <Link href="/dashboard" className="flex items-center gap-3 py-5 px-4 rounded-xl transition-all hover:bg-white/5">
                        <LayoutDashboard className="w-5 h-5" />
                        <span className="font-medium text-sm">Dashboard</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={location.startsWith("/alunos")}>
                      <Link href="/alunos" className="flex items-center gap-3 py-5 px-4 rounded-xl transition-all hover:bg-white/5">
                        <Users className="w-5 h-5" />
                        <span className="font-medium text-sm">Alunos</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <div className="mt-auto p-4">
              <button 
                onClick={() => logout()}
                className="w-full flex items-center gap-3 px-4 py-3 text-muted-foreground hover:text-white hover:bg-white/5 rounded-xl transition-all"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium text-sm">Sair do sistema</span>
              </button>
            </div>
          </SidebarContent>
        </Sidebar>

        <main className="flex-1 overflow-y-auto relative z-0 p-8">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
