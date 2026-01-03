import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { ChevronRight, ChevronLeft, CheckCircle2, AlertCircle } from "lucide-react";

interface CompetencyData {
  id: number;
  name: string;
  weight: number;
  score: number;
  weightedScore: number;
  comments: string;
}

interface EvaluationWizardData {
  // Etapa 1
  employeeName: string;
  employeeCode: string;
  employeePosition: string;
  employeeDepartment: string;

  // Etapa 2-3
  competencies: CompetencyData[];

  // Etapa 4
  pdiDevelopmentArea: string;
  pdiActions: string;
  pdiTimeline: string;
  pdiResponsible: string;

  // Etapa 5
  feedbackStrengths: string;
  feedbackImprovements: string;
  feedbackDevelopmentAreas: string;
  feedbackGeneral: string;

  // Etapa 6
  performanceScore: number;
  nineBoxPosition: string;
}

const mockCompetencies = [
  { id: 1, name: "Liderança" },
  { id: 2, name: "Comunicação" },
  { id: 3, name: "Resolução de Problemas" },
  { id: 4, name: "Trabalho em Equipe" },
  { id: 5, name: "Inovação" },
  { id: 6, name: "Gestão de Tempo" },
];

const nineBoxPositions = [
  "Estrela",
  "Alto Potencial",
  "Sólido",
  "Desenvolvimento",
  "Transição",
  "Crítico",
];

export default function EvaluationWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<EvaluationWizardData>({
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
    pdiDevelopmentArea: "",
    pdiActions: "",
    pdiTimeline: "",
    pdiResponsible: "",
    feedbackStrengths: "",
    feedbackImprovements: "",
    feedbackDevelopmentAreas: "",
    feedbackGeneral: "",
    performanceScore: 0,
    nineBoxPosition: "",
  });

  const totalSteps = 6;
  const progress = (currentStep / totalSteps) * 100;

  // Calcular crédito restante
  const totalWeightUsed = useMemo(() => {
    return data.competencies.reduce((sum, c) => sum + c.weight, 0);
  }, [data.competencies]);

  const remainingCredit = 100 - totalWeightUsed;

  // Calcular performance score
  const performanceScore = useMemo(() => {
    if (totalWeightUsed === 0) return 0;
    const sum = data.competencies.reduce((acc, c) => {
      return acc + (c.score * c.weight) / 100;
    }, 0);
    return parseFloat((sum / 6).toFixed(1));
  }, [data.competencies, totalWeightUsed]);

  // Validações por etapa
  const isStep1Valid = (): boolean => !!(data.employeeName && data.employeeCode);
  const isStep2Valid = (): boolean => totalWeightUsed === 100;
  const isStep3Valid = (): boolean => data.competencies.every((c) => c.weight > 0 ? c.score > 0 : true);
  const isStep4Valid = (): boolean => !!(data.pdiDevelopmentArea && data.pdiActions);
  const isStep5Valid = (): boolean => !!(data.feedbackStrengths && data.feedbackImprovements);

  const handleNextStep = () => {
    let isValid = false;
    switch (currentStep) {
      case 1:
        isValid = isStep1Valid();
        break;
      case 2:
        isValid = isStep2Valid();
        break;
      case 3:
        isValid = isStep3Valid();
        break;
      case 4:
        isValid = isStep4Valid();
        break;
      case 5:
        isValid = isStep5Valid();
        break;
      default:
        isValid = true;
    }

    if (!isValid) {
      toast.error("Preencha todos os campos obrigatórios desta etapa");
      return;
    }

    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleEmployeeFieldChange = (field: string, value: string) => {
    setData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleWeightChange = (competencyId: number, newWeight: number) => {
    const currentWeight = data.competencies.find((c) => c.id === competencyId)?.weight || 0;
    const availableCredit = remainingCredit + currentWeight;

    if (newWeight > availableCredit) {
      toast.error(`Peso máximo disponível: ${availableCredit}`);
      return;
    }

    if (newWeight < 0) {
      toast.error("Peso não pode ser negativo");
      return;
    }

    setData((prev) => ({
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

    setData((prev) => ({
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

  const handleSubmit = async () => {
    try {
      // Aqui você faria a chamada tRPC para salvar
      toast.success("Avaliação submetida com sucesso!");
      console.log("Dados finais:", { ...data, performanceScore });
    } catch (error) {
      toast.error("Erro ao submeter avaliação");
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-2">Avaliação de Desempenho - Assistente</h1>
        <p className="text-muted-foreground">
          Preencha as informações em {totalSteps} etapas simples
        </p>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-semibold">
            Etapa {currentStep} de {totalSteps}
          </span>
          <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Step Indicators */}
      <div className="flex justify-between gap-2">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i + 1}
            className={`flex-1 h-2 rounded-full transition-colors ${
              i + 1 <= currentStep ? "bg-primary" : "bg-muted"
            }`}
          />
        ))}
      </div>

      {/* Step Content */}
      <Card className="p-8">
        {/* Etapa 1: Identificação */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-6">1. Identificação do Colaborador</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-semibold mb-2 block">Nome (Buscar Colaborador) *</Label>
                  <Input
                    placeholder="Digite o nome ou código do colaborador"
                    value={data.employeeName}
                    onChange={(e) => handleEmployeeFieldChange("employeeName", e.target.value)}
                    autoComplete="off"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Digite para buscar entre os colaboradores cadastrados</p>
                </div>
                <div>
                  <Label className="text-sm font-semibold mb-2 block">Código *</Label>
                  <Input
                    placeholder="Ex: EMP-001"
                    value={data.employeeCode}
                    onChange={(e) => handleEmployeeFieldChange("employeeCode", e.target.value)}
                  />
                </div>
                <div>
                  <Label className="text-sm font-semibold mb-2 block">Cargo</Label>
                  <Input
                    placeholder="Ex: Gerente de Projetos"
                    value={data.employeePosition}
                    onChange={(e) => handleEmployeeFieldChange("employeePosition", e.target.value)}
                  />
                </div>
                <div>
                  <Label className="text-sm font-semibold mb-2 block">Setor</Label>
                  <Input
                    placeholder="Ex: TI"
                    value={data.employeeDepartment}
                    onChange={(e) => handleEmployeeFieldChange("employeeDepartment", e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Etapa 2: Distribuição de Pesos */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">2. Distribuição de Pesos</h2>
            <p className="text-sm text-muted-foreground">
              Distribua 100 pontos entre as competências. O crédito restante será atualizado automaticamente.
            </p>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-muted-foreground">Total Distribuído</p>
                <p className="text-3xl font-bold text-blue-600">{totalWeightUsed}</p>
              </div>
              <div className={`rounded-lg p-4 border ${remainingCredit === 0 ? "bg-green-50 border-green-200" : remainingCredit < 0 ? "bg-red-50 border-red-200" : "bg-yellow-50 border-yellow-200"}`}>
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
                <p className="text-3xl font-bold text-purple-600">{performanceScore.toFixed(1)}</p>
              </div>
            </div>

            <div className="space-y-4">
              {data.competencies.map((comp, idx) => (
                <div key={comp.id} className="border rounded-lg p-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label className="text-sm font-semibold mb-2 block">Competência {idx + 1}</Label>
                      <div className="bg-muted px-3 py-2 rounded-md text-sm font-medium">
                        {comp.name}
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-semibold mb-2 block">
                        Peso (0-{remainingCredit + comp.weight})
                      </Label>
                      <Input
                        type="number"
                        min="0"
                        max={remainingCredit + comp.weight}
                        value={comp.weight}
                        onChange={(e) =>
                          handleWeightChange(comp.id, parseInt(e.target.value) || 0)
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Etapa 3: Atribuição de Notas */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">3. Atribuição de Notas</h2>
            <p className="text-sm text-muted-foreground">
              Atribua notas de 0 a 5 para cada competência com peso maior que 0
            </p>

            <div className="space-y-4">
              {data.competencies.map((comp, idx) => (
                comp.weight > 0 && (
                  <div key={comp.id} className="border rounded-lg p-4">
                    <div className="grid grid-cols-4 gap-4 mb-4">
                      <div>
                        <Label className="text-sm font-semibold mb-2 block">{comp.name}</Label>
                        <div className="bg-muted px-3 py-2 rounded-md text-sm">
                          Peso: {comp.weight}
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-semibold mb-2 block">Nota (0-5)</Label>
                        <Input
                          type="number"
                          min="0"
                          max="5"
                          step="0.1"
                          value={comp.score}
                          onChange={(e) =>
                            handleScoreChange(comp.id, parseFloat(e.target.value) || 0)
                          }
                        />
                      </div>
                      <div>
                        <Label className="text-sm font-semibold mb-2 block">Nota Ponderada</Label>
                        <div className="bg-muted px-3 py-2 rounded-md text-sm font-bold text-primary">
                          {comp.weightedScore.toFixed(2)}
                        </div>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-semibold mb-2 block">Comentários</Label>
                      <Textarea
                        placeholder="Descreva o desempenho nesta competência..."
                        value={comp.comments}
                        onChange={(e) =>
                          setData((prev) => ({
                            ...prev,
                            competencies: prev.competencies.map((c) =>
                              c.id === comp.id ? { ...c, comments: e.target.value } : c
                            ),
                          }))
                        }
                        rows={2}
                      />
                    </div>
                  </div>
                )
              ))}
            </div>
          </div>
        )}

        {/* Etapa 4: PDI */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">4. Plano de Desenvolvimento Individual (PDI)</h2>

            <div className="space-y-4">
              <div>
                <Label className="text-sm font-semibold mb-2 block">Área de Desenvolvimento *</Label>
                <Input
                  placeholder="Ex: Liderança estratégica"
                  value={data.pdiDevelopmentArea}
                  onChange={(e) => handleEmployeeFieldChange("pdiDevelopmentArea", e.target.value)}
                />
              </div>
              <div>
                <Label className="text-sm font-semibold mb-2 block">Ações a Realizar *</Label>
                <Textarea
                  placeholder="Descreva as ações específicas..."
                  value={data.pdiActions}
                  onChange={(e) => handleEmployeeFieldChange("pdiActions", e.target.value)}
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-semibold mb-2 block">Prazo</Label>
                  <Input
                    placeholder="Ex: 6 meses"
                    value={data.pdiTimeline}
                    onChange={(e) => handleEmployeeFieldChange("pdiTimeline", e.target.value)}
                  />
                </div>
                <div>
                  <Label className="text-sm font-semibold mb-2 block">Responsável</Label>
                  <Input
                    placeholder="Ex: Gerente de RH"
                    value={data.pdiResponsible}
                    onChange={(e) => handleEmployeeFieldChange("pdiResponsible", e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Etapa 5: Feedback */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">5. Feedback Estruturado</h2>

            <div className="space-y-4">
              <div>
                <Label className="text-sm font-semibold mb-2 block flex items-center gap-2">
                  <span className="text-green-600">✓</span> Pontos Fortes *
                </Label>
                <Textarea
                  placeholder="Descreva os principais pontos fortes..."
                  value={data.feedbackStrengths}
                  onChange={(e) => handleEmployeeFieldChange("feedbackStrengths", e.target.value)}
                  rows={3}
                />
              </div>
              <div>
                <Label className="text-sm font-semibold mb-2 block flex items-center gap-2">
                  <span className="text-blue-600">→</span> Áreas de Melhoria *
                </Label>
                <Textarea
                  placeholder="Identifique áreas onde o colaborador pode melhorar..."
                  value={data.feedbackImprovements}
                  onChange={(e) => handleEmployeeFieldChange("feedbackImprovements", e.target.value)}
                  rows={3}
                />
              </div>
              <div>
                <Label className="text-sm font-semibold mb-2 block flex items-center gap-2">
                  <span className="text-orange-600">▲</span> Áreas de Desenvolvimento Prioritárias
                </Label>
                <Textarea
                  placeholder="Liste as competências que precisam de desenvolvimento prioritário..."
                  value={data.feedbackDevelopmentAreas}
                  onChange={(e) => handleEmployeeFieldChange("feedbackDevelopmentAreas", e.target.value)}
                  rows={3}
                />
              </div>
              <div>
                <Label className="text-sm font-semibold mb-2 block">Comentários Gerais</Label>
                <Textarea
                  placeholder="Adicione comentários gerais..."
                  value={data.feedbackGeneral}
                  onChange={(e) => handleEmployeeFieldChange("feedbackGeneral", e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          </div>
        )}

        {/* Etapa 6: Revisão */}
        {currentStep === 6 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">6. Revisão e Submissão</h2>

            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-green-900">Avaliação Completa</p>
                  <p className="text-sm text-green-800">
                    Todos os campos foram preenchidos corretamente. Clique em "Submeter" para finalizar.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4">
                  <p className="text-sm text-muted-foreground">Colaborador</p>
                  <p className="font-bold">{data.employeeName}</p>
                  <p className="text-sm text-muted-foreground mt-2">{data.employeeCode}</p>
                </Card>
                <Card className="p-4">
                  <p className="text-sm text-muted-foreground">Performance Score</p>
                  <p className="text-3xl font-bold text-primary">{performanceScore.toFixed(1)}</p>
                </Card>
              </div>

              <div>
                <Label className="text-sm font-semibold mb-2 block">Posição na Nine Box</Label>
                <Select value={data.nineBoxPosition} onValueChange={(value) => setData((prev) => ({ ...prev, nineBoxPosition: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a posição" />
                  </SelectTrigger>
                  <SelectContent>
                    {nineBoxPositions.map((pos) => (
                      <SelectItem key={pos} value={pos}>
                        {pos}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between gap-4">
        <Button
          variant="outline"
          onClick={handlePreviousStep}
          disabled={currentStep === 1}
          className="gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Anterior
        </Button>

        <div className="flex gap-2">
          {currentStep < totalSteps ? (
            <Button onClick={handleNextStep} className="gap-2">
              Próximo
              <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} className="gap-2 bg-green-600 hover:bg-green-700">
              <CheckCircle2 className="w-4 h-4" />
              Submeter Avaliação
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
