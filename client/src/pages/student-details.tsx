import { useRoute, Link, useLocation } from "wouter";
import { useStudent, useDeleteStudent, useRenewStudent } from "@/hooks/use-students";
import { AppLayout } from "@/components/layout";
import { StudentStatusBadge } from "@/components/student-badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  MessageCircle, 
  RefreshCcw,
  User,
  Phone,
  CalendarDays,
  Clock
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function StudentDetails() {
  const [, params] = useRoute("/alunos/:id");
  const id = parseInt(params?.id || "0");
  const [, setLocation] = useLocation();
  
  const { data: student, isLoading } = useStudent(id);
  const deleteMutation = useDeleteStudent();
  const renewMutation = useRenewStudent();

  if (isLoading) {
    return (
      <AppLayout>
        <Skeleton className="w-32 h-10 mb-8 rounded-xl bg-white/5" />
        <div className="bg-card/30 border border-white/5 rounded-3xl p-8 flex flex-col md:flex-row gap-8">
          <Skeleton className="w-48 h-48 rounded-2xl bg-white/5" />
          <div className="flex-1 space-y-4">
            <Skeleton className="w-1/2 h-10 bg-white/5" />
            <Skeleton className="w-1/3 h-6 bg-white/5" />
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!student) {
    return (
      <AppLayout>
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold">Aluno não encontrado</h2>
          <Button asChild className="mt-4" variant="outline">
            <Link href="/alunos">Voltar</Link>
          </Button>
        </div>
      </AppLayout>
    );
  }

  const handleDelete = () => {
    if (confirm(`Tem certeza que deseja remover o aluno ${student.name}?`)) {
      deleteMutation.mutate(id);
    }
  };

  const handleRenew = () => {
    if (confirm("Deseja renovar a mensalidade deste aluno por +30 dias?")) {
      renewMutation.mutate(id);
    }
  };

  const handleWhatsApp = () => {
    const cleanPhone = student.phone.replace(/\D/g, '');
    const message = encodeURIComponent('Olá, sua mensalidade da Academia Plenitude venceu. Por favor procure a recepção para renovar.');
    window.open(`https://wa.me/55${cleanPhone}?text=${message}`, '_blank');
  };

  return (
    <AppLayout>
      <div className="mb-6">
        <Link href="/alunos" className="inline-flex items-center text-muted-foreground hover:text-white transition-colors text-sm font-medium">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar para Lista
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Photo & Actions */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-card/40 border border-white/5 rounded-3xl p-6 flex flex-col items-center text-center">
            {student.photo ? (
              <img 
                src={student.photo} 
                alt={student.name}
                className="w-48 h-48 rounded-2xl object-cover border-4 border-white/5 shadow-2xl mb-6"
              />
            ) : (
              <div className="w-48 h-48 rounded-2xl bg-primary/10 border-4 border-primary/20 flex items-center justify-center shadow-2xl mb-6">
                <User className="w-20 h-20 text-primary/50" />
              </div>
            )}
            
            <StudentStatusBadge dueDate={student.dueDate} />
            
            <h2 className="text-2xl font-display font-bold text-white mt-4 mb-1">{student.name}</h2>
            <p className="text-muted-foreground flex items-center justify-center gap-2">
              <Phone className="w-4 h-4" /> {student.phone}
            </p>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={handleRenew}
              disabled={renewMutation.isPending}
              className="w-full h-12 bg-primary hover:bg-primary/90 text-white rounded-xl shadow-lg shadow-primary/20"
            >
              <RefreshCcw className={`w-5 h-5 mr-2 ${renewMutation.isPending ? 'animate-spin' : ''}`} />
              Renovar Mensalidade
            </Button>
            
            <Button 
              onClick={handleWhatsApp}
              className="w-full h-12 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl shadow-lg shadow-[#25D366]/20"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Enviar WhatsApp
            </Button>
          </div>
        </div>

        {/* Right Column: Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card/40 border border-white/5 rounded-3xl p-8">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-display font-bold text-white">Detalhes da Matrícula</h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild className="rounded-lg bg-transparent border-white/10 hover:bg-white/5 h-9">
                  <Link href={`/alunos/editar/${student.id}`}>
                    <Edit className="w-4 h-4 mr-2" /> Editar
                  </Link>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleDelete}
                  disabled={deleteMutation.isPending}
                  className="rounded-lg bg-transparent border-destructive/20 text-destructive hover:bg-destructive/10 hover:text-destructive h-9"
                >
                  <Trash2 className="w-4 h-4 mr-2" /> Excluir
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-1">
                <div className="flex items-center text-muted-foreground text-sm font-medium mb-1">
                  <CalendarDays className="w-4 h-4 mr-2 text-primary" /> Data de Matrícula
                </div>
                <p className="text-lg text-white font-medium">
                  {format(parseISO(student.enrollmentDate), "dd 'de' MMMM, yyyy", { locale: ptBR })}
                </p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center text-muted-foreground text-sm font-medium mb-1">
                  <Clock className="w-4 h-4 mr-2 text-primary" /> Próximo Vencimento
                </div>
                <p className="text-lg text-white font-medium">
                  {format(parseISO(student.dueDate), "dd 'de' MMMM, yyyy", { locale: ptBR })}
                </p>
              </div>
            </div>
            
            <div className="mt-8 p-4 bg-primary/5 rounded-2xl border border-primary/10">
              <p className="text-sm text-primary/80 flex items-start gap-2">
                <span className="w-5 flex-shrink-0 text-center">💡</span>
                O botão de renovação adiciona automaticamente 30 dias à data de vencimento atual do aluno.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
