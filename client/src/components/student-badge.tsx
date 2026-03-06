import { Badge } from "@/components/ui/badge";
import { differenceInDays, parseISO, startOfDay } from "date-fns";

export function StudentStatusBadge({ dueDate }: { dueDate: string }) {
  // Ensure we compare start of day to avoid time-of-day offsets
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
