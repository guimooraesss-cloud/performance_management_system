import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { BarChart3, Users, Briefcase, Award, Grid3x3, LogOut, Menu, X, Zap, FileText } from "lucide-react";
import { useState } from "react";
import { getLoginUrl } from "@/const";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout, isAuthenticated } = useAuth();
  const [location, navigate] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Sistema de Gestão de Desempenho</h1>
          <p className="text-muted-foreground mb-8">Faça login para continuar</p>
          <Button onClick={() => window.location.href = getLoginUrl()}>
            Fazer Login
          </Button>
        </div>
      </div>
    );
  }

  const isAdmin = user?.role === "admin";
  const isLeader = user?.role === "leader";

  const navigationItems = [
    { label: "Dashboard", path: "/dashboard", icon: BarChart3, show: true },
    { label: "Cargos", path: "/positions", icon: Briefcase, show: isAdmin },
    { label: "Competencias", path: "/competencies", icon: Award, show: isAdmin },
    { label: "Colaboradores", path: "/employees", icon: Users, show: isAdmin },
    { label: "Autorizacoes", path: "/authorizations", icon: Grid3x3, show: isAdmin },
    { label: "Avaliacoes", path: "/evaluations", icon: BarChart3, show: isLeader || isAdmin },
    { label: "Avaliacao Avancada", path: "/evaluations-advanced", icon: FileText, show: isLeader || isAdmin },
    { label: "Avaliacao Wizard", path: "/evaluation-wizard", icon: Zap, show: isLeader || isAdmin },
    { label: "Timeline do Ciclo", path: "/cycle-timeline", icon: BarChart3, show: true },
    { label: "Nine Box", path: "/nine-box", icon: Zap, show: isAdmin },
  ];

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-card border-r border-border transition-all duration-300 flex flex-col shadow-sm`}
      >
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <h1 className="text-xl font-bold text-primary">Gestão de Desempenho</h1>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              {sidebarOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navigationItems.map(
            (item) =>
              item.show && (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    location === item.path
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-muted"
                  }`}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
                </button>
              )
          )}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-border space-y-3">
          {sidebarOpen && (
            <div className="px-2 py-2 bg-muted rounded-lg">
              <p className="text-xs font-semibold text-muted-foreground">Usuário</p>
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            {sidebarOpen && <span className="text-sm font-medium">Sair</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
