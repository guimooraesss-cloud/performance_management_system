import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Edit2, Send, Loader2, Star } from "lucide-react";
import { toast } from "sonner";

interface EvaluationForm {
  id: number;
  employeeId: number;
  evaluationPeriod: string;
  status: "draft" | "submitted" | "completed";
  comments: string;
  scores: Record<number, number>;
}

export default function Evaluations() {
  const { user } = useAuth();
  const [evaluations, setEvaluations] = useState<EvaluationForm[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    employeeId: "",
    evaluationPeriod: "",
    comments: "",
  });

  const { data: competencies } = trpc.competencies.list.useQuery();
  const createMutation = trpc.evaluations.create.useMutation();
  const updateMutation = trpc.evaluations.update.useMutation();
  const submitMutation = trpc.evaluations.submit.useMutation();
  const scoresMutation = trpc.evaluationScores.create.useMutation();

  const handleOpenDialog = (evaluation?: EvaluationForm) => {
    if (evaluation) {
      setEditingId(evaluation.id);
      setFormData({
        employeeId: evaluation.employeeId.toString(),
        evaluationPeriod: evaluation.evaluationPeriod,
        comments: evaluation.comments,
      });
    } else {
      setEditingId(null);
      setFormData({
        employeeId: "",
        evaluationPeriod: "",
        comments: "",
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingId) {
        await updateMutation.mutateAsync({
          id: editingId,
          comments: formData.comments,
        });
        toast.success("Avaliação atualizada!");
      } else {
        const result = await createMutation.mutateAsync({
          employeeId: parseInt(formData.employeeId),
          evaluationPeriod: formData.evaluationPeriod,
        });

        setEvaluations([
          ...evaluations,
          {
            id: result.id,
            employeeId: parseInt(formData.employeeId),
            evaluationPeriod: formData.evaluationPeriod,
            status: "draft",
            comments: "",
            scores: {},
          },
        ]);

        toast.success("Avaliação criada! Agora adicione as notas das competências.");
      }
      setIsDialogOpen(false);
    } catch (error: any) {
      toast.error(error.message || "Erro ao salvar avaliação");
    }
  };

  const handleScoreChange = (evaluationId: number, competencyId: number, score: number) => {
    setEvaluations(
      evaluations.map((evaluation) =>
        evaluation.id === evaluationId
          ? {
              ...evaluation,
              scores: {
                ...evaluation.scores,
                [competencyId]: score,
              },
            }
          : evaluation
      )
    );
  };

  const handleSubmitEvaluation = async (evaluationId: number) => {
    try {
      await submitMutation.mutateAsync({ id: evaluationId });
      
      setEvaluations(
        evaluations.map((evaluation) =>
          evaluation.id === evaluationId
            ? { ...evaluation, status: "submitted" }
            : evaluation
        )
      );

      toast.success("Avaliação submetida com sucesso!");
    } catch (error: any) {
      toast.error(error.message || "Erro ao submeter avaliação");
    }
  };

  const periods = ["2024-Q1", "2024-Q2", "2024-Q3", "2024-Q4"];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">Avaliações de Desempenho</h1>
          <p className="text-muted-foreground">
            Crie e gerencie avaliações de seus colaboradores
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="gap-2">
          <Plus className="w-4 h-4" />
          Nova Avaliação
        </Button>
      </div>

      {/* Evaluations List */}
      <div className="space-y-6">
        {evaluations.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground mb-4">Nenhuma avaliação criada</p>
            <Button onClick={() => handleOpenDialog()}>Criar Primeira Avaliação</Button>
          </Card>
        ) : (
          evaluations.map((evaluation) => (
            <Card key={evaluation.id} className="p-6">
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold">
                      Avaliação - Colaborador #{evaluation.employeeId}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Período: {evaluation.evaluationPeriod} | Status:{" "}
                      <span className={`font-semibold ${
                        evaluation.status === "draft"
                          ? "text-warning"
                          : "text-success"
                      }`}>
                        {evaluation.status === "draft" ? "Rascunho" : "Submetida"}
                      </span>
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleOpenDialog(evaluation)}
                    className="gap-2"
                  >
                    <Edit2 className="w-4 h-4" />
                    Editar
                  </Button>
                </div>

                {/* Competencies Scores */}
                <div className="space-y-4">
                  <p className="font-semibold">Notas das Competências (1-5):</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {competencies?.map((comp) => (
                      <div key={comp.id} className="space-y-2">
                        <label className="text-sm font-medium">{comp.name}</label>
                        <div className="flex items-center gap-3">
                          <input
                            type="range"
                            min="1"
                            max="5"
                            step="0.5"
                            value={evaluation.scores[comp.id] || 3}
                            onChange={(e) =>
                              handleScoreChange(
                                evaluation.id,
                                comp.id,
                                parseFloat(e.target.value)
                              )
                            }
                            disabled={evaluation.status !== "draft"}
                            className="flex-1"
                          />
                          <div className="flex items-center gap-1 min-w-fit">
                            <span className="font-bold text-primary">
                              {evaluation.scores[comp.id] || 3}
                            </span>
                            <Star className="w-4 h-4 fill-primary text-primary" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Comments */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Comentários Gerais</label>
                  <Textarea
                    placeholder="Adicione comentários sobre o desempenho do colaborador..."
                    value={evaluation.comments}
                    onChange={(e) =>
                      setEvaluations(
                        evaluations.map((evalItem) =>
                          evalItem.id === evaluation.id
                            ? { ...evalItem, comments: e.target.value }
                            : evalItem
                        )
                      )
                    }
                    disabled={evaluation.status !== "draft"}
                    rows={3}
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t border-border">
                  {evaluation.status === "draft" && (
                    <Button
                      onClick={() => handleSubmitEvaluation(evaluation.id)}
                      disabled={submitMutation.isPending}
                      className="gap-2 flex-1"
                    >
                      {submitMutation.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Submetendo...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Submeter Avaliação
                        </>
                      )}
                    </Button>
                  )}
                  {evaluation.status === "submitted" && (
                    <div className="flex-1 flex items-center justify-center text-success font-semibold">
                      ✓ Avaliação Submetida
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Editar Avaliação" : "Nova Avaliação"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmitForm} className="space-y-6">
            <div>
              <label className="text-sm font-semibold mb-2 block">ID do Colaborador</label>
              <Input
                type="number"
                placeholder="Ex: 1"
                value={formData.employeeId}
                onChange={(e) =>
                  setFormData({ ...formData, employeeId: e.target.value })
                }
                disabled={!!editingId}
                required
              />
            </div>

            <div>
              <label className="text-sm font-semibold mb-2 block">Período de Avaliação</label>
              <select
                value={formData.evaluationPeriod}
                onChange={(e) =>
                  setFormData({ ...formData, evaluationPeriod: e.target.value })
                }
                className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={!!editingId}
                required
              >
                <option value="">Selecione um período</option>
                {periods.map((period) => (
                  <option key={period} value={period}>
                    {period}
                  </option>
                ))}
              </select>
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
