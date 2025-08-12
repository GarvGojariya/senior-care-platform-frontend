import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
import { store } from "./store";
import { ThemeProvider } from "./components/ThemeProvider";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import MedicationsPage from "./pages/MedicationsPage";
import SchedulesPage from "./pages/SchedulesPage";
import NotificationsPage from "./pages/NotificationsPage";
import UsersPage from "./pages/UsersPage";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleBasedRoute from "./components/RoleBasedRoute";
import type { Role } from "./types/auth";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="system" storageKey="senior-care-theme">
          <Router>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              <Route path="/" element={<Navigate to="/dashboard" replace />} />

              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <DashboardPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/medications"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <MedicationsPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/schedules"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <SchedulesPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/notifications"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <NotificationsPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/users"
                element={
                  <RoleBasedRoute allowedRoles={['ADMIN']}>
                    <Layout>
                      <UsersPage />
                    </Layout>
                  </RoleBasedRoute>
                }
              />
            </Routes>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: "hsl(var(--background))",
                  color: "hsl(var(--foreground))",
                  border: "1px solid hsl(var(--border))",
                },
              }}
            />
          </Router>
        </ThemeProvider>
      </QueryClientProvider>
    </Provider>
  );
}

export default App;
