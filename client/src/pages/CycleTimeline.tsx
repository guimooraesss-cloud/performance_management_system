import { useState, useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, Clock, AlertCircle, ChevronRight } from "lucide-react";

interface CycleStatus {
  id: number;
  cycleId: number;
  employeeId: number;
  currentStatus: "planning" | "self-evaluation" | "leader-evaluation" | "feedback" | "pdi" | "completed";
  selfEvaluationDate?: Date;
  leaderEvaluationDate?: Date;
  feedbackDate?: Date;
  pdiDate?: Date;
  completionDate?: Date;
  isOverdue: boolean;
}

interface PerformanceCycle {
  id: number;
  name: string;
  type: "bimonthly" | "semester";
  startDate: Date;
  endDate: Date;
  status: "planning" | "active" | "completed" | "archived";
}

const statusConfig = {
  planning: {
    label: "Planejamento",
    color: "bg-gray-100",
    textColor: "text-gray-700",
    icon: "📋",
  },
  "self-evaluation": {
    label: "Autoavaliação",
    color: "bg-blue-100",
    textColor: "text-blue-700",
    icon: "👤",
  },
  "leader-evaluation": {
    label: "Avaliação do Líder",
    color: "bg-purple-100",
    textColor: "text-purple-700",
    icon: "👥",
  },
  feedback: {
    label: "Feedback",
    color: "bg-orange-100",
    textColor: "text-orange-700",
    icon: "💬",
  },
  pdi: {
    label: "PDI",
    color: "bg-yellow-100",
    textColor: "text-yellow-700",
    icon: "🎯",
  },
  completed: {
    label: "Concluído",
    color: "bg-green-100",
    textColor: "text-green-700",
    icon: "✅",
  },
};

const statusOrder: Array<CycleStatus["currentStatus"]> = [
  "planning",
  "self-evaluation",
  "leader-evaluation",
  "feedback",
  "pdi",
  "completed",
];

export default function CycleTimeline() {
  const { user } = useAuth();
  const [cycles, setCycles] = useState<PerformanceCycle[]>([]);
  const [selectedCycle, setSelectedCycle] = useState<PerformanceCycle | null>(null);
  const [cycleStatus, setCycleStatus] = useState<CycleStatus | null>(null);
  const [allStatuses, setAllStatuses] = useState<CycleStatus[]>([]);
  const [loading, setLoading] = useState(false);

  const isAdmin = user?.role === "admin";

  useEffect(() => {
    // Mock data - será substituído por chamadas tRPC reais
    const mockCycles: PerformanceCycle[] = [
      {
        id: 1,
        name: "Ciclo 1/2024",
        type: "semester",
        startDate: new Date("2024-01-01"),
        endDate: new Date("2024-06-30"),
        status: "active",
      },
      {
        id: 2,
        name: "Ciclo 2/2024",
        type: "semester",
        startDate: new Date("2024-07-01"),
        endDate: new Date("2024-12-31"),
        status: "planning",
      },
    ];

    const mockStatus: CycleStatus = {
      id: 1,
      cycleId: 1,
      employeeId: user?.id || 1,
      currentStatus: "leader-evaluation",
      selfEvaluationDate: new Date("2024-01-15"),
      leaderEvaluationDate: new Date("2024-02-01"),
      isOverdue: false,
    };

    const mockAllStatuses: CycleStatus[] = [
      { ...mockStatus, id: 1, employeeId: 1, currentStatus: "completed" },
      { ...mockStatus, id: 2, employeeId: 2, currentStatus: "feedback" },
      { ...mockStatus, id: 3, employeeId: 3, currentStatus: "leader-evaluation" },
      { ...mockStatus, id: 4, employeeId: 4, currentStatus: "self-evaluation" },
      { ...mockStatus, id: 5, employeeId: 5, currentStatus: "planning" },
    ];

    setCycles(mockCycles);
    setSelectedCycle(mockCycles[0]);
    setCycleStatus(mockStatus);
    setAllStatuses(mockAllStatuses);
  }, [user?.id]);

  const getProgressPercentage = (status: CycleStatus["currentStatus"]) => {
    const currentIndex = statusOrder.indexOf(status);
    return ((currentIndex + 1) / statusOrder.length) * 100;
  };

  const getStatusBadgeVariant = (status: CycleStatus["currentStatus"]) => {
    if (status === "completed") return "default";
    if (status === "planning") return "secondary";
    return "outline";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Timeline do Ciclo de Gestão</h1>
        <p className="text-muted-foreground mt-2">
          {isAdmin ? "Visualize o progresso de todos os colaboradores" : "Acompanhe seu ciclo de avaliação"}
        </p>
      </div>

      {/* Seletor de Ciclo */}
      <Card className="p-6">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium">Selecione o ciclo:</label>
          <Select value={selectedCycle?.id.toString()} onValueChange={(value) => {
            const cycle = cycles.find((c) => c.id === parseInt(value));
            setSelectedCycle(cycle || null);
          }}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Selecione um ciclo" />
            </SelectTrigger>
            <SelectContent>
              {cycles.map((cycle) => (
                <SelectItem key={cycle.id} value={cycle.id.toString()}>
                  {cycle.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Timeline do Colaborador (Não-Admin) */}
      {!isAdmin && cycleStatus && (
        <Card className="p-8">
          <h2 className="text-2xl font-bold mb-8">Seu Progresso no Ciclo</h2>

          {/* Barra de Progresso */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Progresso Geral</span>
              <span className="text-sm font-bold">{Math.round(getProgressPercentage(cycleStatus.currentStatus))}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${getProgressPercentage(cycleStatus.currentStatus)}%` }}
              />
            </div>
          </div>

          {/* Timeline Visual */}
          <div className="space-y-4">
            {statusOrder.map((status, index) => {
              const isCompleted = statusOrder.indexOf(cycleStatus.currentStatus) >= index;
              const isCurrent = cycleStatus.currentStatus === status;

              return (
                <div key={status} className="flex items-start gap-4">
                  {/* Indicador */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                        isCompleted
                          ? "bg-green-500 text-white"
                          : isCurrent
                            ? "bg-blue-500 text-white ring-4 ring-blue-200"
                            : "bg-gray-300 text-gray-600"
                      }`}
                    >
                      {isCompleted ? "✓" : index + 1}
                    </div>
                    {index < statusOrder.length - 1 && (
                      <div
                        className={`w-1 h-12 mt-2 ${isCompleted ? "bg-green-500" : "bg-gray-300"}`}
                      />
                    )}
                  </div>

                  {/* Conteúdo */}
                  <div className="flex-1 pt-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{statusConfig[status].label}</h3>
                      {isCurrent && (
                        <Badge className="bg-blue-500">Atual</Badge>
                      )}
                      {isCompleted && !isCurrent && (
                        <Badge className="bg-green-500">Concluído</Badge>
                      )}
                      {cycleStatus.isOverdue && isCurrent && (
                        <Badge className="bg-red-500 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          Atrasado
                        </Badge>
                      )}
                    </div>

                    {/* Data */}
                    {status === "self-evaluation" && cycleStatus.selfEvaluationDate && (
                      <p className="text-sm text-muted-foreground">
                        Concluído em {new Date(cycleStatus.selfEvaluationDate).toLocaleDateString("pt-BR")}
                      </p>
                    )}
                    {status === "leader-evaluation" && cycleStatus.leaderEvaluationDate && (
                      <p className="text-sm text-muted-foreground">
                        Concluído em {new Date(cycleStatus.leaderEvaluationDate).toLocaleDateString("pt-BR")}
                      </p>
                    )}
                    {status === "feedback" && cycleStatus.feedbackDate && (
                      <p className="text-sm text-muted-foreground">
                        Concluído em {new Date(cycleStatus.feedbackDate).toLocaleDateString("pt-BR")}
                      </p>
                    )}
                    {status === "pdi" && cycleStatus.pdiDate && (
                      <p className="text-sm text-muted-foreground">
                        Concluído em {new Date(cycleStatus.pdiDate).toLocaleDateString("pt-BR")}
                      </p>
                    )}
                    {status === "completed" && cycleStatus.completionDate && (
                      <p className="text-sm text-muted-foreground">
                        Concluído em {new Date(cycleStatus.completionDate).toLocaleDateString("pt-BR")}
                      </p>
                    )}
                    {isCurrent && !isCompleted && (
                      <p className="text-sm text-blue-600 font-medium">Aguardando ação...</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Visualização de Todos os Colaboradores (Admin) */}
      {isAdmin && (
        <Card className="p-8">
          <h2 className="text-2xl font-bold mb-6">Status de Todos os Colaboradores</h2>

          <div className="space-y-3">
            {allStatuses.map((status) => (
              <div key={status.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex-1">
                  <p className="font-medium">Colaborador #{status.employeeId}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-muted-foreground">Status:</span>
                    <Badge variant={getStatusBadgeVariant(status.currentStatus)}>
                      {statusConfig[status.currentStatus].label}
                    </Badge>
                    {status.isOverdue && (
                      <Badge className="bg-red-100 text-red-700">Atrasado</Badge>
                    )}
                  </div>
                </div>

                {/* Barra de Progresso Mini */}
                <div className="flex-1 mx-6">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${getProgressPercentage(status.currentStatus)}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 text-right">
                    {Math.round(getProgressPercentage(status.currentStatus))}%
                  </p>
                </div>

                <Button variant="ghost" size="sm">
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Estatísticas do Ciclo (Admin) */}
      {isAdmin && selectedCycle && (
        <Card className="p-6">
          <h3 className="text-lg font-bold mb-4">Estatísticas do Ciclo</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{allStatuses.length}</p>
              <p className="text-sm text-muted-foreground">Total</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{allStatuses.filter((s) => s.currentStatus === "completed").length}</p>
              <p className="text-sm text-muted-foreground">Concluídos</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">{allStatuses.filter((s) => ["self-evaluation", "leader-evaluation", "feedback", "pdi"].includes(s.currentStatus)).length}</p>
              <p className="text-sm text-muted-foreground">Em Progresso</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-600">{allStatuses.filter((s) => s.currentStatus === "planning").length}</p>
              <p className="text-sm text-muted-foreground">Pendentes</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">{allStatuses.filter((s) => s.isOverdue).length}</p>
              <p className="text-sm text-muted-foreground">Atrasados</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
