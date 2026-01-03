import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Trash2, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";

interface Authorization {
  id: number;
  leaderId: number;
  employeeId: number;
  status: "active" | "inactive" | "revoked";
  createdAt: Date;
}

export default function Authorizations() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    leaderId: "",
    employeeId: "",
  });

  const [authorizations, setAuthorizations] = useState<Authorization[]>([]);
  const createMutation = trpc.evaluationAuthorizations.create.useMutation();
  const revokeMutation = trpc.evaluationAuthorizations.revoke.useMutation();

  const handleOpenDialog = () => {
    setFormData({
      leaderId: "",
      employeeId: "",
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await createMutation.mutateAsync({
        leaderId: parseInt(formData.leaderId),
        employeeId: parseInt(formData.employeeId),
      });
      
      toast.success("Autorização criada com sucesso!");
      setIsDialogOpen(false);
      
      // Add to local state
      setAuthorizations([
        ...authorizations,
        {
          id: result.id,
          leaderId: parseInt(formData.leaderId),
          employeeId: parseInt(formData.employeeId),
          status: "active",
          createdAt: new Date(),
        },
      ]);
    } catch (error: any) {
      toast.error(error.message || "Erro ao criar autorização");
    }
  };

  const handleRevoke = async (id: number) => {
    if (confirm("Tem certeza que deseja revogar esta autorização?")) {
      try {
        await revokeMutation.mutateAsync({ id });
        toast.success("Autorização revogada com sucesso!");
        
        // Update local state
        setAuthorizations(
          authorizations.map((auth) =>
            auth.id === id ? { ...auth, status: "revoked" } : auth
          )
        );
      } catch (error: any) {
        toast.error(error.message || "Erro ao revogar autorização");
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">Autorização de Avaliações</h1>
          <p className="text-muted-foreground">
            Autorize quais líderes podem avaliar quais colaboradores
          </p>
        </div>
        <Button onClick={handleOpenDialog} className="gap-2">
          <Plus className="w-4 h-4" />
          Nova Autorização
        </Button>
      </div>

      {/* Info Card */}
      <Card className="p-6 bg-primary/5 border-primary/20">
        <p className="text-sm text-foreground">
          <strong>Como funciona:</strong> Quando você autoriza um líder para avaliar um colaborador,
          esse líder poderá criar e submeter avaliações para esse colaborador específico.
        </p>
      </Card>

      {/* Authorizations Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted border-b border-border">
                <th className="px-6 py-3 text-left text-sm font-semibold">Líder ID</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Colaborador ID</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Data de Criação</th>
                <th className="px-6 py-3 text-right text-sm font-semibold">Ações</th>
              </tr>
            </thead>
            <tbody>
              {authorizations.length === 0 ? (
                <tr className="border-b border-border">
                  <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                    Nenhuma autorização criada
                  </td>
                </tr>
              ) : (
                authorizations.map((auth) => (
                  <tr key={auth.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 text-sm">{auth.leaderId}</td>
                    <td className="px-6 py-4 text-sm">{auth.employeeId}</td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center gap-2">
                        {auth.status === "active" ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-success" />
                            <span className="text-success font-medium">Ativa</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-4 h-4 text-destructive" />
                            <span className="text-destructive font-medium capitalize">
                              {auth.status}
                            </span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {new Date(auth.createdAt).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {auth.status === "active" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRevoke(auth.id)}
                          disabled={revokeMutation.isPending}
                          className="text-destructive hover:text-destructive"
                        >
                          {revokeMutation.isPending ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <>
                              <Trash2 className="w-4 h-4 mr-2" />
                              Revogar
                            </>
                          )}
                        </Button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Nova Autorização de Avaliação</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-sm font-semibold mb-2 block">ID do Líder</label>
              <input
                type="number"
                placeholder="Ex: 2"
                value={formData.leaderId}
                onChange={(e) =>
                  setFormData({ ...formData, leaderId: e.target.value })
                }
                className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                ID do usuário que será o avaliador
              </p>
            </div>

            <div>
              <label className="text-sm font-semibold mb-2 block">ID do Colaborador</label>
              <input
                type="number"
                placeholder="Ex: 3"
                value={formData.employeeId}
                onChange={(e) =>
                  setFormData({ ...formData, employeeId: e.target.value })
                }
                className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                ID do colaborador que será avaliado
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
                disabled={createMutation.isPending}
              >
                {createMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Criando...
                  </>
                ) : (
                  "Criar Autorização"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
