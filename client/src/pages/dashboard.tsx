import { useStats } from "@/hooks/use-dashboard";
import { AppLayout } from "@/components/layout";
import { Card, CardContent } from "@/components/ui/card";
import { Users, CheckCircle2, AlertTriangle, XCircle, TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const { data: stats, isLoading } = useStats();

  return (
    <AppLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-white flex items-center gap-3">
          Visão Geral <TrendingUp className="text-primary w-6 h-6" />
        </h1>
        <p className="text-muted-foreground mt-2">Acompanhe as métricas da sua academia em tempo real.</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-32 rounded-2xl bg-white/5" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total */}
          <Card className="bg-card/50 border-white/5 backdrop-blur-sm shadow-xl rounded-2xl overflow-hidden group hover:border-primary/30 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Total de Alunos</p>
                  <h3 className="text-4xl font-display font-bold text-white">{stats?.total || 0}</h3>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <Users className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Active */}
          <Card className="bg-card/50 border-white/5 backdrop-blur-sm shadow-xl rounded-2xl overflow-hidden group hover:border-emerald-500/30 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Mensalidade Ativa</p>
                  <h3 className="text-4xl font-display font-bold text-white">{stats?.active || 0}</h3>
                </div>
                <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Expiring Soon */}
          <Card className="bg-card/50 border-white/5 backdrop-blur-sm shadow-xl rounded-2xl overflow-hidden group hover:border-amber-500/30 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Vencendo em Breve</p>
                  <h3 className="text-4xl font-display font-bold text-white">{stats?.expiringSoon || 0}</h3>
                </div>
                <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
                  <AlertTriangle className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Overdue */}
          <Card className="bg-card/50 border-white/5 backdrop-blur-sm shadow-xl rounded-2xl overflow-hidden group hover:border-destructive/30 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Mensalidade Vencida</p>
                  <h3 className="text-4xl font-display font-bold text-white">{stats?.overdue || 0}</h3>
                </div>
                <div className="w-12 h-12 bg-destructive/10 rounded-xl flex items-center justify-center text-destructive group-hover:scale-110 transition-transform">
                  <XCircle className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      {/* Decorative gradient orb for dashboard */}
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none -z-10" />
    </AppLayout>
  );
}
