import { describe, expect, it } from "vitest";

/**
 * Testes para o sistema de pesos ponderados
 * Valida a distribuição de pesos (0-100) entre competências
 */

interface CompetencyWeight {
  id: number;
  name: string;
  weight: number;
  score: number;
}

// Função para calcular crédito restante
function calculateRemainingCredit(competencies: CompetencyWeight[]): number {
  const totalUsed = competencies.reduce((sum, c) => sum + c.weight, 0);
  return 100 - totalUsed;
}

// Função para calcular nota ponderada
function calculateWeightedScore(score: number, weight: number): number {
  return (score * weight) / 100;
}

// Função para calcular performance score (média ponderada)
function calculatePerformanceScore(competencies: CompetencyWeight[]): number {
  const totalWeight = competencies.reduce((sum, c) => sum + c.weight, 0);
  if (totalWeight === 0) return 0;

  const sum = competencies.reduce((acc, c) => {
    return acc + (c.score * c.weight) / 100;
  }, 0);

  return sum / competencies.length;
}

// Função para validar distribuição de pesos
function validateWeightDistribution(competencies: CompetencyWeight[]): {
  isValid: boolean;
  totalWeight: number;
  errors: string[];
} {
  const errors: string[] = [];
  const totalWeight = competencies.reduce((sum, c) => sum + c.weight, 0);

  competencies.forEach((c) => {
    if (c.weight < 0) {
      errors.push(`Competência ${c.name}: peso não pode ser negativo`);
    }
    if (c.weight > 100) {
      errors.push(`Competência ${c.name}: peso não pode exceder 100`);
    }
  });

  if (totalWeight > 100) {
    errors.push(`Peso total (${totalWeight}) excede 100`);
  }

  return {
    isValid: errors.length === 0,
    totalWeight,
    errors,
  };
}

describe("Sistema de Pesos Ponderados", () => {
  describe("Cálculo de Crédito Restante", () => {
    it("deve calcular crédito restante corretamente", () => {
      const competencies: CompetencyWeight[] = [
        { id: 1, name: "Liderança", weight: 30, score: 4 },
        { id: 2, name: "Comunicação", weight: 20, score: 3.5 },
        { id: 3, name: "Resolução de Problemas", weight: 25, score: 4.5 },
      ];

      const remaining = calculateRemainingCredit(competencies);
      expect(remaining).toBe(25);
    });

    it("deve retornar 0 quando todos os 100 pontos são distribuídos", () => {
      const competencies: CompetencyWeight[] = [
        { id: 1, name: "Liderança", weight: 40, score: 4 },
        { id: 2, name: "Comunicação", weight: 30, score: 3.5 },
        { id: 3, name: "Resolução de Problemas", weight: 30, score: 4.5 },
      ];

      const remaining = calculateRemainingCredit(competencies);
      expect(remaining).toBe(0);
    });

    it("deve retornar 100 quando nenhum peso é distribuído", () => {
      const competencies: CompetencyWeight[] = [
        { id: 1, name: "Liderança", weight: 0, score: 0 },
        { id: 2, name: "Comunicação", weight: 0, score: 0 },
      ];

      const remaining = calculateRemainingCredit(competencies);
      expect(remaining).toBe(100);
    });
  });

  describe("Cálculo de Nota Ponderada", () => {
    it("deve calcular nota ponderada corretamente", () => {
      const score = 4;
      const weight = 30;
      const weighted = calculateWeightedScore(score, weight);

      expect(weighted).toBe(1.2); // 4 * 30 / 100 = 1.2
    });

    it("deve retornar 0 quando peso é 0", () => {
      const score = 5;
      const weight = 0;
      const weighted = calculateWeightedScore(score, weight);

      expect(weighted).toBe(0);
    });

    it("deve retornar a nota completa quando peso é 100", () => {
      const score = 4.5;
      const weight = 100;
      const weighted = calculateWeightedScore(score, weight);

      expect(weighted).toBe(4.5);
    });
  });

  describe("Cálculo de Performance Score", () => {
    it("deve calcular performance score como média ponderada", () => {
      const competencies: CompetencyWeight[] = [
        { id: 1, name: "Liderança", weight: 40, score: 4 },
        { id: 2, name: "Comunicação", weight: 30, score: 3.5 },
        { id: 3, name: "Resolução de Problemas", weight: 30, score: 4.5 },
      ];

      const performance = calculatePerformanceScore(competencies);
      // (4*40 + 3.5*30 + 4.5*30) / 100 / 3 = 1.33
      expect(performance).toBeCloseTo(1.33, 1);
    });

    it("deve retornar 0 quando não há pesos distribuídos", () => {
      const competencies: CompetencyWeight[] = [
        { id: 1, name: "Liderança", weight: 0, score: 4 },
        { id: 2, name: "Comunicação", weight: 0, score: 3.5 },
      ];

      const performance = calculatePerformanceScore(competencies);
      expect(performance).toBe(0);
    });

    it("deve considerar apenas competências com peso", () => {
      const competencies: CompetencyWeight[] = [
        { id: 1, name: "Liderança", weight: 100, score: 5 },
        { id: 2, name: "Comunicação", weight: 0, score: 0 },
      ];

      const performance = calculatePerformanceScore(competencies);
      expect(performance).toBeCloseTo(2.5, 1); // 5 * 100 / 100 / 2 = 2.5
    });
  });

  describe("Validação de Distribuição de Pesos", () => {
    it("deve validar distribuição correta", () => {
      const competencies: CompetencyWeight[] = [
        { id: 1, name: "Liderança", weight: 40, score: 4 },
        { id: 2, name: "Comunicação", weight: 30, score: 3.5 },
        { id: 3, name: "Resolução de Problemas", weight: 30, score: 4.5 },
      ];

      const validation = validateWeightDistribution(competencies);
      expect(validation.isValid).toBe(true);
      expect(validation.totalWeight).toBe(100);
      expect(validation.errors).toHaveLength(0);
    });

    it("deve rejeitar peso negativo", () => {
      const competencies: CompetencyWeight[] = [
        { id: 1, name: "Liderança", weight: -10, score: 4 },
      ];

      const validation = validateWeightDistribution(competencies);
      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain("Competência Liderança: peso não pode ser negativo");
    });

    it("deve rejeitar peso maior que 100", () => {
      const competencies: CompetencyWeight[] = [
        { id: 1, name: "Liderança", weight: 150, score: 4 },
      ];

      const validation = validateWeightDistribution(competencies);
      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain("Competência Liderança: peso não pode exceder 100");
    });

    it("deve rejeitar soma de pesos maior que 100", () => {
      const competencies: CompetencyWeight[] = [
        { id: 1, name: "Liderança", weight: 60, score: 4 },
        { id: 2, name: "Comunicação", weight: 50, score: 3.5 },
      ];

      const validation = validateWeightDistribution(competencies);
      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain("Peso total (110) excede 100");
    });

    it("deve permitir distribuição parcial de pesos", () => {
      const competencies: CompetencyWeight[] = [
        { id: 1, name: "Liderança", weight: 30, score: 4 },
        { id: 2, name: "Comunicação", weight: 20, score: 3.5 },
      ];

      const validation = validateWeightDistribution(competencies);
      expect(validation.isValid).toBe(true);
      expect(validation.totalWeight).toBe(50);
    });
  });

  describe("Cenários Reais de Avaliação", () => {
    it("deve processar avaliação completa com 6 competências", () => {
      const competencies: CompetencyWeight[] = [
        { id: 1, name: "Liderança", weight: 20, score: 4.5 },
        { id: 2, name: "Comunicação", weight: 15, score: 4 },
        { id: 3, name: "Resolução de Problemas", weight: 25, score: 4.8 },
        { id: 4, name: "Trabalho em Equipe", weight: 20, score: 4.2 },
        { id: 5, name: "Inovação", weight: 12, score: 3.8 },
        { id: 6, name: "Gestão de Tempo", weight: 8, score: 4.1 },
      ];

      const validation = validateWeightDistribution(competencies);
      expect(validation.isValid).toBe(true);
      expect(validation.totalWeight).toBe(100);

      const performance = calculatePerformanceScore(competencies);
      expect(performance).toBeGreaterThan(0);
      expect(performance).toBeLessThanOrEqual(5);
    });

    it("deve calcular corretamente com pesos desiguais", () => {
      const competencies: CompetencyWeight[] = [
        { id: 1, name: "Liderança", weight: 50, score: 5 },
        { id: 2, name: "Comunicação", weight: 50, score: 3 },
      ];

      const performance = calculatePerformanceScore(competencies);
      // (5*50 + 3*50) / 100 / 2 = 4 / 2 = 2
      expect(performance).toBe(2);
    });

    it("deve manter precisão com notas decimais", () => {
      const competencies: CompetencyWeight[] = [
        { id: 1, name: "Liderança", weight: 33, score: 4.7 },
        { id: 2, name: "Comunicação", weight: 33, score: 3.2 },
        { id: 3, name: "Resolução de Problemas", weight: 34, score: 4.5 },
      ];

      const weighted1 = calculateWeightedScore(4.7, 33);
      const weighted2 = calculateWeightedScore(3.2, 33);
      const weighted3 = calculateWeightedScore(4.5, 34);

      expect(weighted1).toBeCloseTo(1.551, 2);
      expect(weighted2).toBeCloseTo(1.056, 2);
      expect(weighted3).toBeCloseTo(1.53, 2);
    });
  });
});
