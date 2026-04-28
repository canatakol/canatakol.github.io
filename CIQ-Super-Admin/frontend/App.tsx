import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DashboardPage } from "./pages/DashboardPage";
import { TenantsPage } from "./pages/TenantsPage";
import { UsersPage } from "./pages/UsersPage";
import { AnalyticsPage } from "./pages/AnalyticsPage";
import { HealthPage } from "./pages/HealthPage";
import { FeatureFlagsPage } from "./pages/FeatureFlagsPage";
import { IntegrationsPage } from "./pages/IntegrationsPage";
import { SupportPage } from "./pages/SupportPage";
import { AuditPage } from "./pages/AuditPage";
import { Layout } from "./components/Layout";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/tenants" element={<TenantsPage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/health" element={<HealthPage />} />
            <Route path="/feature-flags" element={<FeatureFlagsPage />} />
            <Route path="/integrations" element={<IntegrationsPage />} />
            <Route path="/support" element={<SupportPage />} />
            <Route path="/audit" element={<AuditPage />} />
          </Routes>
        </Layout>
      </Router>
    </QueryClientProvider>
  );
}

export default App;