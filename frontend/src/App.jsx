import { Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { useAuth } from './context/AuthContext';
import AppShell from './components/layout/AppShell';
import { SkeletonCard } from './components/ui/Skeleton';

// Public page
const LandingPage = lazy(() => import('./pages/LandingPage'));

// Auth page
const Login = lazy(() => import('./pages/Login'));

// Dashboard pages (protected)
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Quotation = lazy(() => import('./pages/Quotation'));
const Leads = lazy(() => import('./pages/Leads'));
const Customers = lazy(() => import('./pages/Customers'));
const Invoices = lazy(() => import('./pages/Invoices'));
const Installations = lazy(() => import('./pages/Installations'));
const SolarCalculator = lazy(() => import('./pages/SolarCalculator'));
const PanelComparison = lazy(() => import('./pages/PanelComparison'));
const Settings = lazy(() => import('./pages/Settings'));
const WeatherSolar = lazy(() => import('./pages/WeatherSolar'));
const Maintenance = lazy(() => import('./pages/Maintenance'));

function PageLoader() {
  return (
    <div className="space-y-4 p-6">
      <SkeletonCard />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </div>
  );
}

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <PageLoader />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <AppShell>{children}</AppShell>;
}

export default function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public landing page — visitors see this first */}
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LandingPage />} />

        {/* Auth */}
        <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} />

        {/* Protected dashboard pages */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/quotation" element={<ProtectedRoute><Quotation /></ProtectedRoute>} />
        <Route path="/leads" element={<ProtectedRoute><Leads /></ProtectedRoute>} />
        <Route path="/customers" element={<ProtectedRoute><Customers /></ProtectedRoute>} />
        <Route path="/invoices" element={<ProtectedRoute><Invoices /></ProtectedRoute>} />
        <Route path="/installations" element={<ProtectedRoute><Installations /></ProtectedRoute>} />
        <Route path="/solar-calculator" element={<ProtectedRoute><SolarCalculator /></ProtectedRoute>} />
        <Route path="/panel-comparison" element={<ProtectedRoute><PanelComparison /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="/weather" element={<ProtectedRoute><WeatherSolar /></ProtectedRoute>} />
        <Route path="/maintenance" element={<ProtectedRoute><Maintenance /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
