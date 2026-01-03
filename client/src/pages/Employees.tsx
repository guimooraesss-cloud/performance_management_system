import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Edit2, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function Employees() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    userId: "",
    positionId: "",
    department: "",
    managerId: "",
  });

  const { data: positions } = trpc.positions.list.useQuery();
  const { data: employees, isLoading, refetch } = trpc.employees.getByManager.useQuery(
    { managerId: 0 }, // Placeholder - in real app, would use actual manager ID
    { enabled: false }
  );

  const createMutation = trpc.employees.create.useMutation();
  const updateMutation = trpc.employees.update.useMutation();

  const handleOpenDialog = (employee?: any) => {
    if (employee) {
      setEditingId(employee.id);
      setFormData({
        userId: employee.userId,
        positionId: employee.positionId,
        department: employee.department || "",
        managerId: employee.managerId || "",
      });
    } else {
      setEditingId(null);
      setFormData({
        userId: "",
        positionId: "",
        department: "",
        managerId: "",
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
          positionId: parseInt(formData.positionId),
          department: formData.department,
          managerId: formData.managerId ? parseInt(formData.managerId) : undefined,
        });
        toast.success("Colaborador atualizado com sucesso!");
      } else {
        await createMutation.mutateAsync({
          userId: parseInt(formData.userId),
          positionId: parseInt(formData.positionId),
          department: formData.department,
          managerId: formData.managerId ? parseInt(formData.managerId) : undefined,
        });
        toast.success("Colaborador criado com sucesso!");
      }
      setIsDialogOpen(false);
      refetch();
    } catch (error: any) {
      toast.error(error.message || "Erro ao salvar colaborador");
    }
  };

  const departments = ["Tecnologia", "Vendas", "Marketing", "RH", "Financeiro", "Operações"];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">Gestão de Colaboradores</h1>
          <p className="text-muted-foreground">
            Cadastre e gerencie os colaboradores da organização
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="gap-2">
          <Plus className="w-4 h-4" />
          Novo Colaborador
        </Button>
      </div>

      {/* Info Card */}
      <Card className="p-6 bg-primary/5 border-primary/20">
        <p className="text-sm text-foreground">
          <strong>Nota:</strong> Para criar um novo colaborador, primeiro crie um usuário no sistema de autenticação.
          Em seguida, atribua um cargo e departamento.
        </p>
      </Card>

      {/* Employees Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted border-b border-border">
                <th className="px-6 py-3 text-left text-sm font-semibold">Usuário ID</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Cargo</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Departamento</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Líder ID</th>
                <th className="px-6 py-3 text-right text-sm font-semibold">Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border hover:bg-muted/50 transition-colors">
                <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                  ) : (
                    "Nenhum colaborador cadastrado"
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      {/* Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Editar Colaborador" : "Novo Colaborador"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-sm font-semibold mb-2 block">ID do Usuário</label>
              <Input
                type="number"
                placeholder="Ex: 1"
                value={formData.userId}
                onChange={(e) =>
                  setFormData({ ...formData, userId: e.target.value })
                }
                disabled={!!editingId}
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                ID do usuário no sistema (não pode ser alterado após criação)
              </p>
            </div>

            <div>
              <label className="text-sm font-semibold mb-2 block">Cargo</label>
              <select
                value={formData.positionId}
                onChange={(e) =>
                  setFormData({ ...formData, positionId: e.target.value })
                }
                className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              >
                <option value="">Selecione um cargo</option>
                {positions?.map((pos) => (
                  <option key={pos.id} value={pos.id}>
                    {pos.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-semibold mb-2 block">Departamento</label>
              <select
                value={formData.department}
                onChange={(e) =>
                  setFormData({ ...formData, department: e.target.value })
                }
                className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Selecione um departamento</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-semibold mb-2 block">Líder Direto (ID do Usuário)</label>
              <Input
                type="number"
                placeholder="Ex: 2"
                value={formData.managerId}
                onChange={(e) =>
                  setFormData({ ...formData, managerId: e.target.value })
                }
              />
              <p className="text-xs text-muted-foreground mt-1">
                Deixe em branco se não tiver líder direto
              </p>
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
