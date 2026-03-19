import { Badge } from "@/components/ui/badge";
import { differenceInDays, parseISO, startOfDay } from "date-fns";
import { User } from "lucide-react";

// --- PARTE DA FOTO (Círculo Azul) ---
interface StudentBadgeProps {
  photo?: string | null;
  name: string;
}

export function StudentBadge({ photo, name }: StudentBadgeProps) {
  return (
    <div className="relative flex flex-col items-center">
      <div className="w-48 h-48 rounded-2xl bg-secondary/30 flex items-center justify-center overflow-hidden border-2 border-primary/20">
        {photo ? (
          <img 
            src={photo} 
            alt={name} 
            className="w-full h-full object-cover"
            onError={(e) => (e.currentTarget.src = "")} 
          />
        ) : (
          <User className="w-20 h-20 text-primary/40" />
        )}
      </div>
    </div>
  );
}

// --- PARTE DO STATUS (Vencida/Ativa) ---
export function StudentStatusBadge({ dueDate }: { dueDate: string }) {
  const today = startOfDay(new Date());
  const due = startOfDay(parseISO(dueDate));
  const diffDays = differenceInDays(due, today);

  if (diffDays < 0) {
    return (
      <Badge className="bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20 px-3 py-1 font-medium shadow-none">
        <div className="w-2 h-2 rounded-full bg-destructive mr-2" />
        Vencida
      </Badge>
    );
  }

  if (diffDays <= 7) {
    return (
      <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 hover:bg-amber-500/20 px-3 py-1 font-medium shadow-none">
        <div className="w-2 h-2 rounded-full bg-amber-500 mr-2 animate-pulse" />
        Vence em {diffDays} {diffDays === 1 ? 'dia' : 'dias'}
      </Badge>
    );
  }

  return (
    <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20 px-3 py-1 font-medium shadow-none">
      <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2" />
      Ativa
    </Badge>
  );
}