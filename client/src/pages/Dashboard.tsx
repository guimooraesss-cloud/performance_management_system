import { useAuth } from "@/_core/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { BarChart3, Users, Award, TrendingUp, CheckCircle2, Clock } from "lucide-react";
import { Link } from "wouter";

export default function Dashboard() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const stats = [
    {
      title: "Avaliações Pendentes",
      value: "12",
      icon: BarChart3,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Colaboradores",
      value: "48",
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Competências",
      value: "24",
      icon: Award,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Taxa de Conclusão",
      value: "75%",
      icon: TrendingUp,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-2">
          Bem-vindo, {user?.name}!
        </h1>
        <p className="text-muted-foreground">
          {isAdmin
            ? "Painel de Administração - Gestão de Desempenho"
            : "Painel de Avaliação - Gestão de Desempenho"}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6">
          <h2 className="text-xl font-bold mb-4">Atividades Recentes</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4 pb-4 border-b border-border">
              <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
              <div>
                <p className="font-medium">Avaliação iniciada</p>
                <p className="text-sm text-muted-foreground">João Silva avaliou Maria Santos</p>
                <p className="text-xs text-muted-foreground mt-1">Há 2 horas</p>
              </div>
            </div>
            <div className="flex items-start gap-4 pb-4 border-b border-border">
              <div className="w-2 h-2 rounded-full bg-success mt-2 flex-shrink-0" />
              <div>
                <p className="font-medium">Avaliação concluída</p>
                <p className="text-sm text-muted-foreground">Carlos Mendes finalizou avaliação</p>
                <p className="text-xs text-muted-foreground mt-1">Há 5 horas</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-2 h-2 rounded-full bg-warning mt-2 flex-shrink-0" />
              <div>
                <p className="font-medium">Nova autorização</p>
                <p className="text-sm text-muted-foreground">RH autorizou nova avaliação</p>
                <p className="text-xs text-muted-foreground mt-1">Há 1 dia</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Ações Rápidas</h2>
          <div className="space-y-3">
            <button className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium">
              Nova Avaliação
            </button>
            {isAdmin && (
              <>
                <button className="w-full px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors font-medium">
                  Gerenciar Cargos
                </button>
                <button className="w-full px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors font-medium">
                  Autorizar Avaliações
                </button>
              </>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

      {/* Timeline do Ciclo */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Timeline do Ciclo Atual</h2>
          <Link href="/cycle-timeline">
            <a className="text-sm text-primary hover:underline font-medium">Ver Completo</a>
          </Link>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-bold">✓</div>
            <div className="flex-1">
              <p className="font-medium">Planejamento</p>
              <p className="text-xs text-muted-foreground">Concluído</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-bold">✓</div>
            <div className="flex-1">
              <p className="font-medium">Autoavaliação</p>
              <p className="text-xs text-muted-foreground">Concluído</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold ring-4 ring-blue-200">3</div>
            <div className="flex-1">
              <p className="font-medium">Avaliação do Líder</p>
              <p className="text-xs text-blue-600 font-medium">Em progresso</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center text-sm font-bold">4</div>
            <div className="flex-1">
              <p className="font-medium">Feedback</p>
              <p className="text-xs text-muted-foreground">Aguardando</p>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Progresso Geral</span>
            <span className="text-sm font-bold">50%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full" style={{ width: "50%" }} />
          </div>
        </div>
      </Card>
