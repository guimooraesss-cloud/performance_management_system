import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Save, AlertCircle } from "lucide-react";

interface CompetencyWeight {
  id: number;
  name: string;
  weight: number;
  score: number;
  weightedScore: number;
  comments: string;
}

interface EvaluationData {
  employeeName: string;
  employeeCode: string;
  employeePosition: string;
  employeeDepartment: string;
  competencies: CompetencyWeight[];
  pdi: string;
  feedbackStrengths: string;
  feedbackImprovements: string;
  feedbackDevelopmentAreas: string;
  generalComments: string;
}

// Mock competencies
const mockCompetencies = [
  { id: 1, name: "Liderança" },
  { id: 2, name: "Comunicação" },
  { id: 3, name: "Resolução de Problemas" },
  { id: 4, name: "Trabalho em Equipe" },
  { id: 5, name: "Inovação" },
  { id: 6, name: "Gestão de Tempo" },
];

export default function EvaluationsAdvanced() {
  const [evaluationData, setEvaluationData] = useState<EvaluationData>({
    employeeName: "",
    employeeCode: "",
    employeePosition: "",
    employeeDepartment: "",
    competencies: mockCompetencies.map((c) => ({
      id: c.id,
      name: c.name,
      weight: 0,
      score: 0,
      weightedScore: 0,
      comments: "",
    })),
    pdi: "",
    feedbackStrengths: "",
    feedbackImprovements: "",
    feedbackDevelopmentAreas: "",
    generalComments: "",
  });

  // Calcular crédito restante
  const totalWeightUsed = useMemo(() => {
    return evaluationData.competencies.reduce((sum, c) => sum + c.weight, 0);
  }, [evaluationData.competencies]);

  const remainingCredit = 100 - totalWeightUsed;

  // Calcular performance score (média ponderada)
  const performanceScore = useMemo(() => {
    if (totalWeightUsed === 0) return 0;
    const sum = evaluationData.competencies.reduce((acc, c) => {
      return acc + (c.score * c.weight) / 100;
    }, 0);
    return (sum / 6).toFixed(1); // Média das 6 competências
  }, [evaluationData.competencies, totalWeightUsed]);

  const handleEmployeeFieldChange = (field: string, value: string) => {
    setEvaluationData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleWeightChange = (competencyId: number, newWeight: number) => {
    // Validar se o novo peso não excede o crédito disponível
    const currentWeight = evaluationData.competencies.find((c) => c.id === competencyId)?.weight || 0;
    const availableCredit = remainingCredit + currentWeight;

    if (newWeight > availableCredit) {
      toast.error(`Peso máximo disponível: ${availableCredit}`);
      return;
    }

    if (newWeight < 0) {
      toast.error("Peso não pode ser negativo");
      return;
    }

    setEvaluationData((prev) => ({
      ...prev,
      competencies: prev.competencies.map((c) =>
        c.id === competencyId ? { ...c, weight: newWeight } : c
      ),
    }));
  };

  const handleScoreChange = (competencyId: number, score: number) => {
    if (score < 0 || score > 5) {
      toast.error("Nota deve estar entre 0 e 5");
      return;
    }

    setEvaluationData((prev) => ({
      ...prev,
      competencies: prev.competencies.map((c) => {
        if (c.id === competencyId) {
          const weightedScore = (score * c.weight) / 100;
          return { ...c, score, weightedScore };
        }
        return c;
      }),
    }));
  };

  const handleCommentsChange = (competencyId: number, comments: string) => {
    setEvaluationData((prev) => ({
      ...prev,
      competencies: prev.competencies.map((c) =>
        c.id === competencyId ? { ...c, comments } : c
      ),
    }));
  };

  const handleSaveEvaluation = async () => {
    if (!evaluationData.employeeName || !evaluationData.employeeCode) {
      toast.error("Preencha nome e código do colaborador");
      return;
    }

    if (totalWeightUsed === 0) {
      toast.error("Distribua pesos entre as competências");
      return;
    }

    try {
      // Aqui você faria a chamada tRPC para salvar
      toast.success("Avaliação salva com sucesso!");
      console.log("Dados da avaliação:", evaluationData);
    } catch (error) {
      toast.error("Erro ao salvar avaliação");
    }
  };

  const handleSubmitEvaluation = async () => {
    if (totalWeightUsed !== 100) {
      toast.error("Distribua exatamente 100 pontos de peso entre as competências");
      return;
    }

    try {
      // Aqui você faria a chamada tRPC para submeter
      toast.success("Avaliação submetida com sucesso!");
      console.log("Avaliação submetida:", evaluationData);
    } catch (error) {
      toast.error("Erro ao submeter avaliação");
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-2">Avaliação de Desempenho</h1>
        <p className="text-muted-foreground">
          Sistema de avaliação com pesos ponderados, PDI e feedback estruturado
        </p>
      </div>

      {/* Seção 1: Identificação do Colaborador */}
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-6">1. Identificação do Colaborador</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="employeeName" className="text-sm font-semibold mb-2 block">
              Nome do Colaborador *
            </Label>
            <Input
              id="employeeName"
              placeholder="Ex: João Silva"
              value={evaluationData.employeeName}
              onChange={(e) => handleEmployeeFieldChange("employeeName", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="employeeCode" className="text-sm font-semibold mb-2 block">
              Código do Colaborador *
            </Label>
            <Input
              id="employeeCode"
              placeholder="Ex: EMP-001"
              value={evaluationData.employeeCode}
              onChange={(e) => handleEmployeeFieldChange("employeeCode", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="employeePosition" className="text-sm font-semibold mb-2 block">
              Cargo
            </Label>
            <Input
              id="employeePosition"
              placeholder="Ex: Gerente de Projetos"
              value={evaluationData.employeePosition}
              onChange={(e) => handleEmployeeFieldChange("employeePosition", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="employeeDepartment" className="text-sm font-semibold mb-2 block">
              Setor
            </Label>
            <Input
              id="employeeDepartment"
              placeholder="Ex: TI"
              value={evaluationData.employeeDepartment}
              onChange={(e) => handleEmployeeFieldChange("employeeDepartment", e.target.value)}
            />
          </div>
        </div>
      </Card>

      {/* Seção 2: Distribuição de Pesos e Notas */}
      <Card className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">2. Distribuição de Pesos e Notas</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Distribua 100 pontos de peso entre as 6 competências. O crédito restante será atualizado automaticamente.
          </p>

          {/* Credit Display */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-muted-foreground">Total Distribuído</p>
              <p className="text-3xl font-bold text-blue-600">{totalWeightUsed}</p>
            </div>
            <div className={`rounded-lg p-4 border ${
              remainingCredit === 0
                ? "bg-green-50 border-green-200"
                : remainingCredit < 0
                ? "bg-red-50 border-red-200"
                : "bg-yellow-50 border-yellow-200"
            }`}>
              <p className="text-sm text-muted-foreground">Crédito Restante</p>
              <p className={`text-3xl font-bold ${
                remainingCredit === 0
                  ? "text-green-600"
                  : remainingCredit < 0
                  ? "text-red-600"
                  : "text-yellow-600"
              }`}>
                {remainingCredit}
              </p>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <p className="text-sm text-muted-foreground">Performance Score</p>
              <p className="text-3xl font-bold text-purple-600">{performanceScore}</p>
            </div>
          </div>
        </div>

        {/* Competencies Grid */}
        <div className="space-y-6">
          {evaluationData.competencies.map((competency, index) => (
            <div key={competency.id} className="border border-border rounded-lg p-4 bg-background">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                {/* Competency Name */}
                <div>
                  <Label className="text-sm font-semibold mb-2 block">
                    Competência {index + 1}
                  </Label>
                  <div className="bg-muted px-3 py-2 rounded-md text-sm font-medium">
                    {competency.name}
                  </div>
                </div>

                {/* Weight Input */}
                <div>
                  <Label className="text-sm font-semibold mb-2 block">
                    Peso (0-{remainingCredit + competency.weight})
                  </Label>
                  <Input
                    type="number"
                    min="0"
                    max={remainingCredit + competency.weight}
                    value={competency.weight}
                    onChange={(e) =>
                      handleWeightChange(competency.id, parseInt(e.target.value) || 0)
                    }
                    className="font-semibold"
                  />
                </div>

                {/* Score Input */}
                <div>
                  <Label className="text-sm font-semibold mb-2 block">
                    Nota (0-5)
                  </Label>
                  <Input
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    value={competency.score}
                    onChange={(e) =>
                      handleScoreChange(competency.id, parseFloat(e.target.value) || 0)
                    }
                    className="font-semibold"
                  />
                </div>

                {/* Weighted Score */}
                <div>
                  <Label className="text-sm font-semibold mb-2 block">
                    Nota Ponderada
                  </Label>
                  <div className="bg-muted px-3 py-2 rounded-md text-sm font-bold text-primary">
                    {competency.weightedScore.toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Comments */}
              <div>
                <Label className="text-sm font-semibold mb-2 block">
                  Comentários sobre {competency.name}
                </Label>
                <Textarea
                  placeholder="Descreva o desempenho nesta competência..."
                  value={competency.comments}
                  onChange={(e) => handleCommentsChange(competency.id, e.target.value)}
                  rows={2}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Seção 3: PDI e Feedback */}
      <Tabs defaultValue="pdi" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pdi">Plano de Desenvolvimento Individual (PDI)</TabsTrigger>
          <TabsTrigger value="feedback">Feedback Estruturado</TabsTrigger>
        </TabsList>

        {/* PDI Tab */}
        <TabsContent value="pdi">
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Plano de Desenvolvimento Individual</h2>
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-semibold mb-2 block">
                  PDI Estruturado
                </Label>
                <Textarea
                  placeholder="Descreva o plano de desenvolvimento individual do colaborador, incluindo:
- Áreas de desenvolvimento identificadas
- Ações a serem realizadas
- Prazos e responsáveis
- Recursos necessários
- Acompanhamento esperado"
                  value={evaluationData.pdi}
                  onChange={(e) => handleEmployeeFieldChange("pdi", e.target.value)}
                  rows={8}
                />
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Feedback Tab */}
        <TabsContent value="feedback">
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-6">Feedback Estruturado</h2>
            <div className="space-y-6">
              {/* Strengths */}
              <div>
                <Label className="text-sm font-semibold mb-2 block flex items-center gap-2">
                  <span className="text-green-600">✓</span> Pontos Fortes
                </Label>
                <Textarea
                  placeholder="Descreva os principais pontos fortes e competências bem desenvolvidas..."
                  value={evaluationData.feedbackStrengths}
                  onChange={(e) => handleEmployeeFieldChange("feedbackStrengths", e.target.value)}
                  rows={4}
                />
              </div>

              {/* Improvements */}
              <div>
                <Label className="text-sm font-semibold mb-2 block flex items-center gap-2">
                  <span className="text-blue-600">→</span> Áreas de Melhoria
                </Label>
                <Textarea
                  placeholder="Identifique áreas onde o colaborador pode melhorar..."
                  value={evaluationData.feedbackImprovements}
                  onChange={(e) => handleEmployeeFieldChange("feedbackImprovements", e.target.value)}
                  rows={4}
                />
              </div>

              {/* Development Areas */}
              <div>
                <Label className="text-sm font-semibold mb-2 block flex items-center gap-2">
                  <span className="text-orange-600">▲</span> Áreas de Desenvolvimento Prioritárias
                </Label>
                <Textarea
                  placeholder="Liste as competências que precisam de desenvolvimento prioritário..."
                  value={evaluationData.feedbackDevelopmentAreas}
                  onChange={(e) => handleEmployeeFieldChange("feedbackDevelopmentAreas", e.target.value)}
                  rows={4}
                />
              </div>

              {/* General Comments */}
              <div>
                <Label className="text-sm font-semibold mb-2 block">
                  Comentários Gerais
                </Label>
                <Textarea
                  placeholder="Adicione comentários gerais sobre o desempenho e potencial do colaborador..."
                  value={evaluationData.generalComments}
                  onChange={(e) => handleEmployeeFieldChange("generalComments", e.target.value)}
                  rows={4}
                />
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Validation Alert */}
      {totalWeightUsed !== 100 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold text-yellow-900">Atenção</p>
            <p className="text-sm text-yellow-800">
              Você deve distribuir exatamente 100 pontos de peso entre as competências para submeter a avaliação.
              Atualmente: {totalWeightUsed}/100
            </p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4 justify-end">
        <Button variant="outline" onClick={handleSaveEvaluation} className="gap-2">
          <Save className="w-4 h-4" />
          Salvar Rascunho
        </Button>
        <Button
          onClick={handleSubmitEvaluation}
          disabled={totalWeightUsed !== 100}
          className="gap-2"
        >
          <Save className="w-4 h-4" />
          Submeter Avaliação
        </Button>
      </div>
    </div>
  );
}
