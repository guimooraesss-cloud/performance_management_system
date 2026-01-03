import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit2, Trash2, Loader2, ChevronDown } from "lucide-react";
import { toast } from "sonner";

const COMPETENCY_CATEGORIES = [
  { value: "core-cultural", label: "Core/cultural" },
  { value: "soft-skill-attitude", label: "Soft Skill (atitude)" },
  { value: "soft-skill-relational", label: "Soft Skill (relacional)" },
  { value: "soft-skill-distinctive", label: "Soft Skill (distintiva)" },
  { value: "hard-skill-technical", label: "Hard Skill (técnica)" },
  { value: "result", label: "Resultado" },
  { value: "leadership", label: "Liderança" },
];

export default function Competencies() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
  });

  const { data: competencies, isLoading, refetch } = trpc.competencies.list.useQuery();
  const { data: behaviors } = trpc.competencies.getBehaviors.useQuery(
    { competencyId: expandedId || 0 },
    { enabled: expandedId !== null }
  );
  const createMutation = trpc.competencies.create.useMutation();
  const updateMutation = trpc.competencies.update.useMutation();
  const deleteMutation = trpc.competencies.delete.useMutation();

  const handleOpenDialog = (competency?: any) => {
    if (competency) {
      setEditingId(competency.id);
      setFormData({
        name: competency.name || "",
        description: competency.description || "",
        category: competency.category || "",
      });
    } else {
      setEditingId(null);
      setFormData({
        name: "",
        description: "",
        category: "",
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingId) {
        await updateMutation.mutateAsync({
          id: editingId,
          ...formData,
        });
        toast.success("Competência atualizada com sucesso!");
      } else {
        await createMutation.mutateAsync(formData);
        toast.success("Competência criada com sucesso!");
      }
      setIsDialogOpen(false);
      refetch();
    } catch (error: any) {
      toast.error(error.message || "Erro ao salvar competência");
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Tem certeza que deseja deletar esta competência?")) {
      try {
        await deleteMutation.mutateAsync({ id });
        toast.success("Competência deletada com sucesso!");
        refetch();
      } catch (error: any) {
        toast.error(error.message || "Erro ao deletar competência");
      }
    }
  };

  const categories = ["Técnica", "Comportamental", "Liderança", "Estratégica"];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">Gestão de Competências</h1>
          <p className="text-muted-foreground">
            Cadastre e mapeie as competências organizacionais
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="gap-2">
          <Plus className="w-4 h-4" />
          Nova Competência
        </Button>
      </div>

      {/* Competencies List */}
      <div className="space-y-4">
        {competencies?.map((competency) => (
          <Card
            key={competency.id}
            className="p-6 hover:shadow-lg transition-shadow"
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold">{competency.name}</h3>
                    {competency.category && (
                      <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                        {competency.category}
                      </span>
                    )}
                  </div>
                  <p className="text-muted-foreground">{competency.description}</p>
                </div>
                <button
                  onClick={() =>
                    setExpandedId(expandedId === competency.id ? null : competency.id)
                  }
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  <ChevronDown
                    className={`w-5 h-5 transition-transform ${
                      expandedId === competency.id ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </div>

              {/* Behaviors */}
              {expandedId === competency.id && behaviors && behaviors.length > 0 && (
                <div className="mt-4 pt-4 border-t border-border space-y-3">
                  <p className="text-sm font-semibold">Descritores de Comportamento:</p>
                  {behaviors.map((behavior) => (
                    <div
                      key={behavior.id}
                      className="ml-4 p-3 bg-muted rounded-lg"
                    >
                      <div className="flex items-start gap-3">
                        <span className="px-2 py-1 bg-primary text-primary-foreground text-xs font-bold rounded">
                          Nível {behavior.level}
                        </span>
                        <p className="text-sm">{behavior.descriptor}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-2 pt-4 border-t border-border">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleOpenDialog(competency)}
                  className="gap-2 flex-1"
                >
                  <Edit2 className="w-4 h-4" />
                  Editar
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDelete(competency.id)}
                  className="gap-2 flex-1 text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                  Deletar
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {!competencies || competencies.length === 0 && (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground mb-4">Nenhuma competência cadastrada</p>
          <Button onClick={() => handleOpenDialog()}>Criar Primeira Competência</Button>
        </Card>
      )}

      {/* Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Editar Competência" : "Nova Competência"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-sm font-semibold mb-2 block">Nome da Competência</label>
              <Input
                placeholder="Ex: Liderança, Comunicação, Análise de Dados"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label className="text-sm font-semibold mb-2 block">Categoria</label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {COMPETENCY_CATEGORIES.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-semibold mb-2 block">Descrição</label>
              <Textarea
                placeholder="Descrição detalhada da competência"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={4}
              />
            </div>

            <div className="flex gap-3 justify-end pt-4 border-t border-border">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {createMutation.isPending || updateMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  "Salvar"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
