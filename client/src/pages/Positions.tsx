import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Edit2, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function Positions() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    responsibilities: "",
    requirements: "",
  });

  const { data: positions, isLoading, refetch } = trpc.positions.list.useQuery();
  const createMutation = trpc.positions.create.useMutation();
  const updateMutation = trpc.positions.update.useMutation();
  const deleteMutation = trpc.positions.delete.useMutation();

  const handleOpenDialog = (position?: any) => {
    if (position) {
      setEditingId(position.id);
      setFormData({
        name: position.name || "",
        description: position.description || "",
        responsibilities: position.responsibilities || "",
        requirements: position.requirements || "",
      });
    } else {
      setEditingId(null);
      setFormData({
        name: "",
        description: "",
        responsibilities: "",
        requirements: "",
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
        toast.success("Cargo atualizado com sucesso!");
      } else {
        await createMutation.mutateAsync(formData);
        toast.success("Cargo criado com sucesso!");
      }
      setIsDialogOpen(false);
      refetch();
    } catch (error: any) {
      toast.error(error.message || "Erro ao salvar cargo");
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Tem certeza que deseja deletar este cargo?")) {
      try {
        await deleteMutation.mutateAsync({ id });
        toast.success("Cargo deletado com sucesso!");
        refetch();
      } catch (error: any) {
        toast.error(error.message || "Erro ao deletar cargo");
      }
    }
  };

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
          <h1 className="text-4xl font-bold mb-2">Gestão de Cargos</h1>
          <p className="text-muted-foreground">
            Cadastre e gerencie os cargos da organização
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="gap-2">
          <Plus className="w-4 h-4" />
          Novo Cargo
        </Button>
      </div>

      {/* Positions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {positions?.map((position) => (
          <Card key={position.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold">{position.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {position.description}
                </p>
              </div>

              {position.responsibilities && (
                <div>
                  <p className="text-sm font-semibold mb-2">Responsabilidades:</p>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {position.responsibilities}
                  </p>
                </div>
              )}

              <div className="flex gap-2 pt-4 border-t border-border">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleOpenDialog(position)}
                  className="gap-2 flex-1"
                >
                  <Edit2 className="w-4 h-4" />
                  Editar
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDelete(position.id)}
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

      {!positions || positions.length === 0 && (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground mb-4">Nenhum cargo cadastrado</p>
          <Button onClick={() => handleOpenDialog()}>Criar Primeiro Cargo</Button>
        </Card>
      )}

      {/* Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Editar Cargo" : "Novo Cargo"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-sm font-semibold mb-2 block">Nome do Cargo</label>
              <Input
                placeholder="Ex: Gerente de Projetos"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label className="text-sm font-semibold mb-2 block">Descrição</label>
              <Textarea
                placeholder="Descrição breve do cargo"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
              />
            </div>

            <div>
              <label className="text-sm font-semibold mb-2 block">Responsabilidades</label>
              <Textarea
                placeholder="Liste as principais responsabilidades"
                value={formData.responsibilities}
                onChange={(e) =>
                  setFormData({ ...formData, responsibilities: e.target.value })
                }
                rows={4}
              />
            </div>

            <div>
              <label className="text-sm font-semibold mb-2 block">Requisitos</label>
              <Textarea
                placeholder="Liste os requisitos necessários"
                value={formData.requirements}
                onChange={(e) =>
                  setFormData({ ...formData, requirements: e.target.value })
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
