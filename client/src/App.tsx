import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

// Pages
import Login from "./pages/login";
import Dashboard from "./pages/dashboard";
import StudentsList from "./pages/students";
import StudentDetails from "./pages/student-details";
import StudentForm from "./pages/student-form";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/" component={Dashboard} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/alunos" component={StudentsList} />
      <Route path="/alunos/novo" component={StudentForm} />
      <Route path="/alunos/editar/:id" component={StudentForm} />
      <Route path="/alunos/:id" component={StudentDetails} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
