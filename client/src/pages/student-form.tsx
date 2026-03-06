import { useEffect, useState, useRef } from "react";
import { useRoute, Link, useLocation } from "wouter";
import { useStudent, useCreateStudent, useUpdateStudent } from "@/hooks/use-students";
import { useUpload } from "@/hooks/use-upload";
import { AppLayout } from "@/components/layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, UploadCloud, X, Loader2 } from "lucide-react";
import { format, parseISO } from "date-fns";

export default function StudentForm() {
  const [match, params] = useRoute("/alunos/editar/:id");
  const isEditing = match;
  const id = parseInt(params?.id || "0");
  
  const [, setLocation] = useLocation();
  const { data: student, isLoading: isStudentLoading } = useStudent(id);
  const createMutation = useCreateStudent();
  const updateMutation = useUpdateStudent(id);
  const uploadMutation = useUpload();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    enrollmentDate: format(new Date(), 'yyyy-MM-dd'),
    dueDate: format(new Date(), 'yyyy-MM-dd'),
    photo: "",
  });

  useEffect(() => {
    if (isEditing && student) {
      setFormData({
        name: student.name,
        phone: student.phone,
        enrollmentDate: student.enrollmentDate,
        dueDate: student.dueDate,
        photo: student.photo || "",
      });
    }
  }, [isEditing, student]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const result = await uploadMutation.mutateAsync(file);
      setFormData(prev => ({ ...prev, photo: result.url }));
    } catch (err) {
      console.error("Upload failed", err);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  if (isEditing && isStudentLoading) {
    return <AppLayout><div className="flex py-20 justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div></AppLayout>;
  }

  return (
    <AppLayout>
      <div className="mb-6">
        <Link href={isEditing ? `/alunos/${id}` : "/alunos"} className="inline-flex items-center text-muted-foreground hover:text-white transition-colors text-sm font-medium">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Link>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="mb-8 text-center sm:text-left">
          <h1 className="text-3xl font-display font-bold text-white">
            {isEditing ? "Editar Aluno" : "Novo Aluno"}
          </h1>
          <p className="text-muted-foreground mt-1">
            Preencha os dados abaixo para {isEditing ? "atualizar" : "cadastrar"} o aluno.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-card/40 border border-white/5 rounded-3xl p-8 space-y-6">
          {/* Photo Upload */}
          <div className="flex flex-col items-center justify-center pb-6 border-b border-white/5">
            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              {formData.photo ? (
                <div className="relative">
                  <img src={formData.photo} alt="Preview" className="w-32 h-32 rounded-full object-cover border-4 border-white/10" />
                  <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <UploadCloud className="text-white w-8 h-8" />
                  </div>
                </div>
              ) : (
                <div className="w-32 h-32 rounded-full bg-white/5 border-2 border-dashed border-white/20 flex flex-col items-center justify-center group-hover:bg-white/10 transition-colors">
                  {uploadMutation.isPending ? (
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  ) : (
                    <>
                      <UploadCloud className="text-muted-foreground w-8 h-8 mb-2 group-hover:text-primary transition-colors" />
                      <span className="text-xs text-muted-foreground font-medium">Foto</span>
                    </>
                  )}
                </div>
              )}
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>
            {formData.photo && (
              <button 
                type="button"
                onClick={(e) => { e.stopPropagation(); setFormData(prev => ({ ...prev, photo: "" })); }}
                className="mt-3 text-xs text-destructive hover:text-destructive/80 flex items-center"
              >
                <X className="w-3 h-3 mr-1" /> Remover foto
              </button>
            )}
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-white/80">Nome Completo *</label>
              <Input 
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                required
                className="h-12 bg-white/5 border-white/10 rounded-xl focus:border-primary focus:ring-primary/20"
                placeholder="Ex: João Silva"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-white/80">Telefone / WhatsApp *</label>
              <Input 
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                required
                className="h-12 bg-white/5 border-white/10 rounded-xl focus:border-primary focus:ring-primary/20"
                placeholder="(00) 00000-0000"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80">Data de Matrícula *</label>
              <Input 
                type="date"
                value={formData.enrollmentDate}
                onChange={e => setFormData({ ...formData, enrollmentDate: e.target.value })}
                required
                className="h-12 bg-white/5 border-white/10 rounded-xl focus:border-primary focus:ring-primary/20 [color-scheme:dark]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80">Data de Vencimento *</label>
              <Input 
                type="date"
                value={formData.dueDate}
                onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
                required
                className="h-12 bg-white/5 border-white/10 rounded-xl focus:border-primary focus:ring-primary/20 [color-scheme:dark]"
              />
            </div>
          </div>

          <div className="pt-6 flex justify-end gap-3">
            <Button type="button" variant="ghost" asChild className="rounded-xl h-12 px-6">
              <Link href={isEditing ? `/alunos/${id}` : "/alunos"}>Cancelar</Link>
            </Button>
            <Button 
              type="submit" 
              disabled={isPending || uploadMutation.isPending}
              className="rounded-xl h-12 px-8 bg-primary text-white shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-0.5 transition-all"
            >
              {isPending ? (
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              ) : (
                <Save className="w-5 h-5 mr-2" />
              )}
              {isEditing ? "Salvar Alterações" : "Cadastrar Aluno"}
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
