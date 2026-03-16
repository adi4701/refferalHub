import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { PageLoadingSpinner } from './components/ui';
import { ErrorBoundary } from './components/shared/ErrorBoundary';
import { ProtectedRoute } from './components/shared/ProtectedRoute';
import { NotFoundPage } from './pages/NotFoundPage';
import { PageTransition } from './components/layout/PageTransition';
import { useAuthStore } from './store/auth.store';

// Lazy loaded pages
const HomePage = React.lazy(() => import('./pages/home').then(m => ({ default: m.HomePage })));
const LoginPage = React.lazy(() => import('./pages/auth').then(m => ({ default: m.LoginPage })));
const RegisterPage = React.lazy(() => import('./pages/auth').then(m => ({ default: m.RegisterPage })));
const ListingsPage = React.lazy(() => import('./pages/listings').then(m => ({ default: m.ListingsPage })));
const ListingDetailPage = React.lazy(() => import('./pages/listings').then(m => ({ default: m.ListingDetailPage })));
const CreateListingPage = React.lazy(() => import('./pages/listings').then(m => ({ default: m.CreateListingPage })));

// Dashboard pages — inline components until dedicated pages are built
const ReferrerDashboard = React.lazy(() => import('./pages/dashboard/ReferrerDashboard'));
const ApplicantDashboard = React.lazy(() => import('./pages/dashboard/ApplicantDashboard'));
const MyListingsPage = React.lazy(() => import('./pages/dashboard/MyListingsPage'));
const RequestsPage = React.lazy(() => import('./pages/dashboard/RequestsPage'));

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route path="/" element={<PageTransition><HomePage /></PageTransition>} />
        <Route path="/login" element={<PageTransition><LoginPage /></PageTransition>} />
        <Route path="/register" element={<PageTransition><RegisterPage /></PageTransition>} />
        <Route path="/browse" element={<PageTransition><ListingsPage /></PageTransition>} />
        <Route path="/listings" element={<PageTransition><ListingsPage /></PageTransition>} />
        <Route path="/listings/:id" element={<PageTransition><ListingDetailPage /></PageTransition>} />

        {/* Referrer Protected Routes */}
        <Route element={<ProtectedRoute allowedRoles={['referrer']} />}>
          <Route path="/dashboard" element={<PageTransition><ReferrerDashboard /></PageTransition>} />
          <Route path="/dashboard/listings" element={<PageTransition><MyListingsPage /></PageTransition>} />
          <Route path="/dashboard/listings/new" element={<PageTransition><CreateListingPage /></PageTransition>} />
          <Route path="/dashboard/requests" element={<PageTransition><RequestsPage /></PageTransition>} />
        </Route>

        {/* Applicant Protected Routes */}
        <Route element={<ProtectedRoute allowedRoles={['applicant']} />}>
          <Route path="/dashboard/applicant" element={<PageTransition><ApplicantDashboard /></PageTransition>} />
          <Route path="/dashboard/applications" element={<PageTransition><RequestsPage /></PageTransition>} />
        </Route>

        {/* 404 Fallback */}
        <Route path="*" element={<PageTransition><NotFoundPage /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  const getMe = useAuthStore(state => state.getMe);
  const token = useAuthStore(state => state.token);

  React.useEffect(() => {
    if (token) {
      getMe();
    }
  }, [getMe, token]);

  return (
    <Router>
      <ErrorBoundary>
        <Suspense fallback={<PageLoadingSpinner />}>
          <AnimatedRoutes />
        </Suspense>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
