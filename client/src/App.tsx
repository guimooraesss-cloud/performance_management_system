import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import Dashboard from "@/pages/Dashboard";
import { useLocation } from "wouter";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { DashboardLayout } from "./components/DashboardLayoutCustom";
import Home from "./pages/Home";
import Positions from "./pages/Positions";
import Competencies from "./pages/Competencies";
import Employees from "./pages/Employees";
import Authorizations from "./pages/Authorizations";
import Evaluations from "./pages/Evaluations";
import EvaluationsAdvanced from "./pages/EvaluationsAdvanced";
import EvaluationWizard from "./pages/EvaluationWizard";
import CycleTimeline from "./pages/CycleTimeline";
import NineBox from "./pages/NineBox";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/dashboard"}>
        {() => (
          <DashboardLayout>
            <Dashboard />
          </DashboardLayout>
        )}
      </Route>
      <Route path={"/positions"}>
        {() => (
          <DashboardLayout>
            <Positions />
          </DashboardLayout>
        )}
      </Route>
      <Route path={"/competencies"}>
        {() => (
          <DashboardLayout>
            <Competencies />
          </DashboardLayout>
        )}
      </Route>
      <Route path={"/employees"}>
        {() => (
          <DashboardLayout>
            <Employees />
          </DashboardLayout>
        )}
      </Route>
      <Route path={"/authorizations"}>
        {() => (
          <DashboardLayout>
            <Authorizations />
          </DashboardLayout>
        )}
      </Route>
      <Route path={"/evaluations"}>
        {() => (
          <DashboardLayout>
            <Evaluations />
          </DashboardLayout>
        )}
      </Route>
      <Route path={"/nine-box"}>
        {() => (
          <DashboardLayout>
            <NineBox />
          </DashboardLayout>
        )}
      </Route>
      <Route path="/evaluations-advanced">
        {() => (
          <DashboardLayout>
            <EvaluationsAdvanced />
          </DashboardLayout>
        )}
      </Route>
      <Route path="/evaluation-wizard">
        {() => (
          <DashboardLayout>
            <EvaluationWizard />
          </DashboardLayout>
        )}
      </Route>
      <Route path="/cycle-timeline">
        {() => (
          <DashboardLayout>
            <CycleTimeline />
          </DashboardLayout>
        )}
      </Route>
      <Route path="/404" component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
