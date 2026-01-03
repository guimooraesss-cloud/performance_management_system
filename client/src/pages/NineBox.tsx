import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Filter } from "lucide-react";
import { toast } from "sonner";

interface Employee {
  id: number;
  name: string;
  position: string;
  performance: number; // 1-5
  potential: number; // 1-5
  category: string;
}

// Mock data - em produção, viria do banco de dados
const mockEmployees: Employee[] = [
  { id: 1, name: "Ana Silva", position: "Gerente", performance: 4.5, potential: 4.8, category: "Estrela" },
  { id: 2, name: "Carlos Santos", position: "Analista", performance: 3.8, potential: 4.2, category: "Alto Potencial" },
  { id: 3, name: "Maria Costa", position: "Especialista", performance: 4.2, potential: 3.5, category: "Sólido" },
  { id: 4, name: "João Oliveira", position: "Coordenador", performance: 2.8, potential: 2.5, category: "Desenvolvimento" },
  { id: 5, name: "Patricia Lima", position: "Líder", performance: 4.8, potential: 4.5, category: "Estrela" },
];

function categorizeEmployee(performance: number, potential: number): string {
  if (performance >= 4 && potential >= 4) return "Estrela";
  if (performance >= 4 && potential < 4) return "Sólido";
  if (performance < 4 && potential >= 4) return "Alto Potencial";
  if (performance >= 3 && potential >= 3) return "Promissor";
  return "Desenvolvimento";
}

function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    Estrela: "bg-yellow-100 border-yellow-300 text-yellow-900",
    "Alto Potencial": "bg-blue-100 border-blue-300 text-blue-900",
    Sólido: "bg-green-100 border-green-300 text-green-900",
    Promissor: "bg-purple-100 border-purple-300 text-purple-900",
    Desenvolvimento: "bg-orange-100 border-orange-300 text-orange-900",
  };
  return colors[category] || "bg-gray-100 border-gray-300 text-gray-900";
}

function getCategoryBgColor(category: string): string {
  const colors: Record<string, string> = {
    Estrela: "bg-yellow-50",
    "Alto Potencial": "bg-blue-50",
    Sólido: "bg-green-50",
    Promissor: "bg-purple-50",
    Desenvolvimento: "bg-orange-50",
  };
  return colors[category] || "bg-gray-50";
}

export default function NineBox() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [employees] = useState<Employee[]>(mockEmployees);

  const categorizedEmployees = useMemo(() => {
    return employees.reduce(
      (acc, emp) => {
        const category = categorizeEmployee(emp.performance, emp.potential);
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push({ ...emp, category });
        return acc;
      },
      {} as Record<string, Employee[]>
    );
  }, [employees]);

  const categories = [
    { name: "Estrela", description: "Alto desempenho e alto potencial", icon: "⭐" },
    { name: "Alto Potencial", description: "Baixo desempenho, alto potencial", icon: "🚀" },
    { name: "Sólido", description: "Alto desempenho, baixo potencial", icon: "✓" },
    { name: "Promissor", description: "Desempenho e potencial moderados", icon: "📈" },
    { name: "Desenvolvimento", description: "Necessita desenvolvimento", icon: "🎯" },
  ];

  const handleExport = (format: "pdf" | "excel") => {
    toast.success(`Exportando relatório em ${format.toUpperCase()}...`);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">Matriz Nine Box</h1>
          <p className="text-muted-foreground">
            Visualize o enquadramento dos colaboradores por performance e potencial
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleExport("pdf")} className="gap-2">
            <Download className="w-4 h-4" />
            PDF
          </Button>
          <Button variant="outline" onClick={() => handleExport("excel")} className="gap-2">
            <Download className="w-4 h-4" />
            Excel
          </Button>
        </div>
      </div>

      {/* Nine Box Grid */}
      <Card className="p-8 bg-gradient-to-br from-background to-muted">
        <div className="space-y-4 mb-6">
          <p className="text-sm font-semibold text-muted-foreground">Matriz de Performance vs Potencial</p>
          <div className="grid grid-cols-3 gap-4 h-96 border-2 border-border rounded-lg bg-white p-4">
            {/* Low-Low */}
            <div className="border border-border rounded-lg p-4 bg-orange-50 flex flex-col items-center justify-center text-center">
              <p className="text-xs font-semibold text-muted-foreground mb-2">Baixo Desempenho</p>
              <p className="text-xs font-semibold text-muted-foreground">Baixo Potencial</p>
              <p className="text-2xl mt-2">🎯</p>
            </div>

            {/* Low-Medium */}
            <div className="border border-border rounded-lg p-4 bg-purple-50 flex flex-col items-center justify-center text-center">
              <p className="text-xs font-semibold text-muted-foreground mb-2">Baixo Desempenho</p>
              <p className="text-xs font-semibold text-muted-foreground">Potencial Moderado</p>
              <p className="text-2xl mt-2">📈</p>
            </div>

            {/* Low-High */}
            <div className="border border-border rounded-lg p-4 bg-blue-50 flex flex-col items-center justify-center text-center">
              <p className="text-xs font-semibold text-muted-foreground mb-2">Baixo Desempenho</p>
              <p className="text-xs font-semibold text-muted-foreground">Alto Potencial</p>
              <p className="text-2xl mt-2">🚀</p>
            </div>

            {/* Medium-Low */}
            <div className="border border-border rounded-lg p-4 bg-orange-50 flex flex-col items-center justify-center text-center">
              <p className="text-xs font-semibold text-muted-foreground mb-2">Desempenho Moderado</p>
              <p className="text-xs font-semibold text-muted-foreground">Baixo Potencial</p>
              <p className="text-2xl mt-2">⚠️</p>
            </div>

            {/* Medium-Medium */}
            <div className="border border-border rounded-lg p-4 bg-purple-50 flex flex-col items-center justify-center text-center">
              <p className="text-xs font-semibold text-muted-foreground mb-2">Desempenho Moderado</p>
              <p className="text-xs font-semibold text-muted-foreground">Potencial Moderado</p>
              <p className="text-2xl mt-2">📊</p>
            </div>

            {/* Medium-High */}
            <div className="border border-border rounded-lg p-4 bg-green-50 flex flex-col items-center justify-center text-center">
              <p className="text-xs font-semibold text-muted-foreground mb-2">Desempenho Moderado</p>
              <p className="text-xs font-semibold text-muted-foreground">Alto Potencial</p>
              <p className="text-2xl mt-2">✓</p>
            </div>

            {/* High-Low */}
            <div className="border border-border rounded-lg p-4 bg-green-50 flex flex-col items-center justify-center text-center">
              <p className="text-xs font-semibold text-muted-foreground mb-2">Alto Desempenho</p>
              <p className="text-xs font-semibold text-muted-foreground">Baixo Potencial</p>
              <p className="text-2xl mt-2">✓</p>
            </div>

            {/* High-Medium */}
            <div className="border border-border rounded-lg p-4 bg-green-50 flex flex-col items-center justify-center text-center">
              <p className="text-xs font-semibold text-muted-foreground mb-2">Alto Desempenho</p>
              <p className="text-xs font-semibold text-muted-foreground">Potencial Moderado</p>
              <p className="text-2xl mt-2">✓</p>
            </div>

            {/* High-High */}
            <div className="border border-border rounded-lg p-4 bg-yellow-50 flex flex-col items-center justify-center text-center">
              <p className="text-xs font-semibold text-muted-foreground mb-2">Alto Desempenho</p>
              <p className="text-xs font-semibold text-muted-foreground">Alto Potencial</p>
              <p className="text-2xl mt-2">⭐</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Categories Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {categories.map((category) => {
          const count = categorizedEmployees[category.name]?.length || 0;
          return (
            <Card
              key={category.name}
              className={`p-4 cursor-pointer transition-all hover:shadow-lg ${
                selectedCategory === category.name ? "ring-2 ring-primary" : ""
              } ${getCategoryBgColor(category.name)}`}
              onClick={() =>
                setSelectedCategory(
                  selectedCategory === category.name ? null : category.name
                )
              }
            >
              <div className="text-center space-y-2">
                <p className="text-3xl">{category.icon}</p>
                <p className="font-bold text-sm">{category.name}</p>
                <p className="text-xs text-muted-foreground">{category.description}</p>
                <p className="text-2xl font-bold text-primary mt-2">{count}</p>
                <p className="text-xs text-muted-foreground">colaboradores</p>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Employees List */}
      {selectedCategory && (
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4">
            {selectedCategory} ({categorizedEmployees[selectedCategory]?.length || 0})
          </h2>
          <div className="space-y-3">
            {(categorizedEmployees[selectedCategory] || []).map((emp) => (
              <div
                key={emp.id}
                className={`p-4 rounded-lg border-2 ${getCategoryColor(emp.category)}`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-bold">{emp.name}</p>
                    <p className="text-sm text-muted-foreground">{emp.position}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">
                      <span className="font-semibold">Performance:</span> {emp.performance.toFixed(1)}
                    </p>
                    <p className="text-sm">
                      <span className="font-semibold">Potencial:</span> {emp.potential.toFixed(1)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Insights */}
      <Card className="p-6 bg-primary/5 border-primary/20">
        <h2 className="text-xl font-bold mb-4">Insights Automáticos</h2>
        <div className="space-y-3 text-sm">
          <p>
            <strong>Estrelas ({categorizedEmployees["Estrela"]?.length || 0}):</strong> Colaboradores
            com alto desempenho e alto potencial. Recomenda-se investir em desenvolvimento de
            liderança e retenção.
          </p>
          <p>
            <strong>Alto Potencial ({categorizedEmployees["Alto Potencial"]?.length || 0}):</strong> Colaboradores
            com potencial de crescimento. Necessitam de mentoria e oportunidades de desenvolvimento.
          </p>
          <p>
            <strong>Sólidos ({categorizedEmployees["Sólido"]?.length || 0}):</strong> Colaboradores
            confiáveis com bom desempenho. Ideais para papéis de especialistas e mentores.
          </p>
          <p>
            <strong>Desenvolvimento ({categorizedEmployees["Desenvolvimento"]?.length || 0}):</strong> Colaboradores
            que necessitam de suporte adicional. Recomenda-se plano de desenvolvimento personalizado.
          </p>
        </div>
      </Card>
    </div>
  );
}
