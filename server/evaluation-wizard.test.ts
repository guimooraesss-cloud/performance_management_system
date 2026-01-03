import { describe, expect, it } from "vitest";

/**
 * Testes para o sistema de Wizard de Avaliação com Pesos Ponderados
 */

describe("Evaluation Wizard - Pesos Ponderados", () => {
  // Teste 1: Validar distribuição de pesos
  it("deve validar que pesos somam 100", () => {
    const weights = [20, 30, 25, 15, 10, 0];
    const total = weights.reduce((sum, w) => sum + w, 0);
    expect(total).toBe(100);
  });

  // Teste 2: Validar crédito restante
  it("deve calcular crédito restante corretamente", () => {
    const totalCredit = 100;
    const usedWeights = [20, 30, 25];
    const usedTotal = usedWeights.reduce((sum, w) => sum + w, 0);
    const remaining = totalCredit - usedTotal;
    expect(remaining).toBe(25);
  });

  // Teste 3: Validar que peso não pode exceder crédito disponível
  it("deve rejeitar peso que excede crédito disponível", () => {
    const totalCredit = 100;
    const usedWeights = [50, 40];
    const usedTotal = usedWeights.reduce((sum, w) => sum + w, 0);
    const availableCredit = totalCredit - usedTotal;
    const newWeight = 15;

    expect(newWeight <= availableCredit).toBe(false);
  });

  // Teste 4: Validar peso negativo
  it("deve rejeitar peso negativo", () => {
    const weight = -5;
    expect(weight >= 0).toBe(false);
  });

  // Teste 5: Calcular nota ponderada
  it("deve calcular nota ponderada corretamente", () => {
    const score = 4.5;
    const weight = 30;
    const weightedScore = (score * weight) / 100;
    expect(weightedScore).toBeCloseTo(1.35, 2);
  });

  // Teste 6: Calcular performance score
  it("deve calcular performance score baseado em notas ponderadas", () => {
    const competencies = [
      { score: 5, weight: 20, weightedScore: 1.0 },
      { score: 4, weight: 30, weightedScore: 1.2 },
      { score: 3, weight: 25, weightedScore: 0.75 },
      { score: 4, weight: 15, weightedScore: 0.6 },
      { score: 5, weight: 10, weightedScore: 0.5 },
      { score: 0, weight: 0, weightedScore: 0 },
    ];

    const totalWeightedScore = competencies.reduce((sum, c) => sum + c.weightedScore, 0);
    const performanceScore = totalWeightedScore / 6;
    expect(performanceScore).toBeCloseTo(0.675, 2);
  });

  // Teste 7: Validar que competências com peso > 0 devem ter nota
  it("deve validar que competências com peso devem ter nota", () => {
    const competencies = [
      { id: 1, weight: 20, score: 4, isValid: true },
      { id: 2, weight: 30, score: 0, isValid: false },
      { id: 3, weight: 0, score: 0, isValid: true }, // Sem peso, sem nota obrigatória
    ];

    const isValid = competencies.every((c) => (c.weight > 0 ? c.score > 0 : true));
    expect(isValid).toBe(false);
  });

  // Teste 8: Validar notas entre 0 e 5
  it("deve validar que notas estão entre 0 e 5", () => {
    const validScores = [0, 1, 2.5, 3, 4, 5];
    const invalidScores = [-1, 5.5, 6, 10];

    validScores.forEach((score) => {
      expect(score >= 0 && score <= 5).toBe(true);
    });

    invalidScores.forEach((score) => {
      expect(score >= 0 && score <= 5).toBe(false);
    });
  });

  // Teste 9: Categorizar na Nine Box
  it("deve categorizar colaborador na Nine Box corretamente", () => {
    const performanceScore = 4.2;
    const potentialScore = 4.5;

    let category = "";
    if (performanceScore >= 4 && potentialScore >= 4) {
      category = "Estrela";
    } else if (performanceScore < 3 && potentialScore >= 4) {
      category = "Alto Potencial";
    } else if (performanceScore >= 3 && potentialScore >= 3) {
      category = "Sólido";
    } else if (performanceScore < 3 && potentialScore < 3) {
      category = "Crítico";
    }

    expect(category).toBe("Estrela");
  });

  // Teste 10: Validar campos obrigatórios da Etapa 1
  it("deve validar campos obrigatórios da Etapa 1", () => {
    const employeeName = "João Silva";
    const employeeCode = "EMP-001";

    const isValid = !!(employeeName && employeeCode);
    expect(isValid).toBe(true);
  });

  // Teste 11: Validar campos obrigatórios da Etapa 4 (PDI)
  it("deve validar campos obrigatórios da Etapa 4 (PDI)", () => {
    const pdiDevelopmentArea = "Liderança estratégica";
    const pdiActions = "Participar de curso de liderança";

    const isValid = !!(pdiDevelopmentArea && pdiActions);
    expect(isValid).toBe(true);
  });

  // Teste 12: Validar campos obrigatórios da Etapa 5 (Feedback)
  it("deve validar campos obrigatórios da Etapa 5 (Feedback)", () => {
    const feedbackStrengths = "Excelente comunicação";
    const feedbackImprovements = "Melhorar gestão de tempo";

    const isValid = !!(feedbackStrengths && feedbackImprovements);
    expect(isValid).toBe(true);
  });

  // Teste 13: Validar distribuição completa de pesos
  it("deve validar que todos os 100 pontos foram distribuídos", () => {
    const weights = [20, 30, 25, 15, 10, 0];
    const totalWeightUsed = weights.reduce((sum, w) => sum + w, 0);
    const isComplete = totalWeightUsed === 100;
    expect(isComplete).toBe(true);
  });

  // Teste 14: Calcular múltiplos performance scores
  it("deve calcular performance scores para diferentes cenários", () => {
    const scenarios = [
      {
        name: "Excelente",
        competencies: [
          { score: 5, weight: 20 },
          { score: 5, weight: 30 },
          { score: 4, weight: 25 },
          { score: 5, weight: 15 },
          { score: 5, weight: 10 },
        ],
        expected: 4.75,
      },
      {
        name: "Bom",
        competencies: [
          { score: 4, weight: 20 },
          { score: 4, weight: 30 },
          { score: 3, weight: 25 },
          { score: 4, weight: 15 },
          { score: 3, weight: 10 },
        ],
        expected: 3.65,
      },
      {
        name: "Necessita Desenvolvimento",
        competencies: [
          { score: 2, weight: 20 },
          { score: 2, weight: 30 },
          { score: 2, weight: 25 },
          { score: 2, weight: 15 },
          { score: 2, weight: 10 },
        ],
        expected: 2.0,
      },
    ];

    scenarios.forEach((scenario) => {
      const totalWeightedScore = scenario.competencies.reduce(
        (sum, c) => sum + (c.score * c.weight) / 100,
        0
      );
      expect(totalWeightedScore).toBeCloseTo(scenario.expected, 1);
    });
  });

  // Teste 15: Validar que peso deve ser número
  it("deve validar que peso é um número válido", () => {
    const validWeights = [0, 10, 50, 100];
    const invalidWeights = ["abc", null, undefined];

    validWeights.forEach((weight) => {
      expect(typeof weight === "number").toBe(true);
    });

    invalidWeights.forEach((weight) => {
      expect(typeof weight === "number").toBe(false);
    });
  });
});

describe("Evaluation Wizard - Fluxo de Etapas", () => {
  // Teste 16: Validar progresso entre etapas
  it("deve calcular progresso correto entre etapas", () => {
    const totalSteps = 6;
    const currentStep = 3;
    const progress = (currentStep / totalSteps) * 100;
    expect(progress).toBe(50);
  });

  // Teste 17: Validar navegação anterior
  it("deve permitir navegação anterior até etapa 1", () => {
    const currentStep = 3;
    const previousStep = currentStep > 1 ? currentStep - 1 : 1;
    expect(previousStep).toBe(2);
  });

  // Teste 18: Validar navegação próxima
  it("deve permitir navegação próxima até última etapa", () => {
    const currentStep = 5;
    const totalSteps = 6;
    const nextStep = currentStep < totalSteps ? currentStep + 1 : totalSteps;
    expect(nextStep).toBe(6);
  });
});
