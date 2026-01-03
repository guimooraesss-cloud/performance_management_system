import { Button } from "@/components/ui/button";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { useLocation } from "wouter";
import { BarChart3, Users, Award, TrendingUp, CheckCircle2 } from "lucide-react";
import { useEffect } from "react";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  if (isAuthenticated) {
    return null;
  }

  const features = [
    {
      icon: BarChart3,
      title: "Avaliações Estruturadas",
      description: "Sistema completo de avaliação de desempenho com competências mapeadas",
    },
    {
      icon: Users,
      title: "Gestão de Colaboradores",
      description: "Cadastro e gerenciamento centralizado de todos os colaboradores",
    },
    {
      icon: Award,
      title: "Matriz Nine Box",
      description: "Visualização interativa do enquadramento de performance vs potencial",
    },
    {
      icon: TrendingUp,
      title: "Análises com IA",
      description: "Insights automáticos sobre padrões de desempenho e gaps de competências",
    },
  ];

  const benefits = [
    "Autenticação segura com três níveis de acesso",
    "Liberação de acesso controlada pelo RH",
    "Descrição de cargos com competências mapeadas",
    "Sistema de notas com escala configurável",
    "Cálculo automático de performance e potencial",
    "Exportação de relatórios em PDF e Excel",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-card/80 backdrop-blur-md border-b border-border z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary">PerformanceHub</h1>
          <Button onClick={() => window.location.href = getLoginUrl()}>
            Fazer Login
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              Gestão de Desempenho
              <span className="block text-primary">Elegante e Inteligente</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Plataforma completa para avaliação de competências, mapeamento de performance
              e desenvolvimento de talentos com análises impulsionadas por IA.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button
              size="lg"
              onClick={() => window.location.href = getLoginUrl()}
              className="text-lg px-8 py-6"
            >
              Começar Agora
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6"
            >
              Saiba Mais
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-card/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Funcionalidades Principais</h2>
            <p className="text-lg text-muted-foreground">
              Tudo que você precisa para gerenciar desempenho e desenvolvimento
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="p-6 rounded-xl border border-border bg-background hover:shadow-lg transition-all duration-300"
                >
                  <div className="mb-4 p-3 bg-primary/10 rounded-lg w-fit">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Por Que Escolher PerformanceHub?</h2>
            <p className="text-lg text-muted-foreground">
              Recursos completos para uma gestão de desempenho moderna
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {benefits.map((benefit) => (
              <div key={benefit} className="flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <p className="text-lg">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div>
            <h2 className="text-4xl font-bold mb-4">Pronto para Transformar sua Gestão de Desempenho?</h2>
            <p className="text-lg opacity-90">
              Comece agora e experimente a plataforma mais elegante e inteligente do mercado
            </p>
          </div>
          <Button
            size="lg"
            variant="secondary"
            onClick={() => window.location.href = getLoginUrl()}
            className="text-lg px-8 py-6"
          >
            Fazer Login
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t border-border">
        <div className="max-w-6xl mx-auto text-center text-muted-foreground">
          <p>&copy; 2024 PerformanceHub. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
