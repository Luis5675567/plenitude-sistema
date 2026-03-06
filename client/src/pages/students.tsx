import { useState } from "react";
import { Link } from "wouter";
import { useStudents } from "@/hooks/use-students";
import { AppLayout } from "@/components/layout";
import { StudentStatusBadge } from "@/components/student-badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, User, Phone, Calendar as CalendarIcon, ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function StudentsList() {
  const { data: students, isLoading } = useStudents();
  const [search, setSearch] = useState("");

  const filteredStudents = students?.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.phone.includes(search)
  ) || [];

  return (
    <AppLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Alunos</h1>
          <p className="text-muted-foreground mt-1">Gerencie todos os alunos da academia.</p>
        </div>
        
        <div className="flex w-full md:w-auto items-center gap-4">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Buscar por nome ou celular..." 
              className="pl-10 bg-card/50 border-white/10 rounded-xl h-11 focus:ring-primary/20"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <Button asChild className="h-11 px-6 rounded-xl shadow-lg shadow-primary/20 hover:-translate-y-0.5 transition-transform bg-primary text-white">
            <Link href="/alunos/novo">
              <Plus className="w-5 h-5 mr-2" />
              Novo Aluno
            </Link>
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Skeleton key={i} className="h-32 rounded-2xl bg-white/5" />
          ))}
        </div>
      ) : filteredStudents.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-card/30 rounded-3xl border border-white/5 border-dashed text-center">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
            <User className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-display font-semibold text-white mb-2">Nenhum aluno encontrado</h3>
          <p className="text-muted-foreground max-w-md">
            {search ? "Tente buscar com outro termo." : "Você ainda não tem alunos cadastrados no sistema."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredStudents.map(student => (
            <Link key={student.id} href={`/alunos/${student.id}`}>
              <div className="bg-card/40 border border-white/5 rounded-2xl p-5 hover:bg-card/60 hover:border-primary/30 transition-all duration-300 group cursor-pointer h-full flex flex-col">
                <div className="flex items-start gap-4 mb-4">
                  {student.photo ? (
                    <img 
                      src={student.photo} 
                      alt={student.name} 
                      className="w-16 h-16 rounded-xl object-cover border border-white/10 shadow-sm"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                      <User className="w-8 h-8 text-primary/60" />
                    </div>
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display font-bold text-lg text-white truncate group-hover:text-primary transition-colors">
                      {student.name}
                    </h3>
                    <div className="flex items-center text-muted-foreground text-sm mt-1">
                      <Phone className="w-3.5 h-3.5 mr-1.5" />
                      {student.phone}
                    </div>
                  </div>
                </div>

                <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-muted-foreground flex items-center">
                      <CalendarIcon className="w-3 h-3 mr-1" />
                      Vencimento: {format(parseISO(student.dueDate), 'dd/MM/yyyy')}
                    </span>
                  </div>
                  <StudentStatusBadge dueDate={student.dueDate} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </AppLayout>
  );
}
