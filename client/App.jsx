import React, { Suspense, lazy, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ScrollProgress from './components/ScrollProgress';
import Footer from './components/Footer';
import { LanguageProvider } from './context/LanguageContext';
import { SettingsProvider } from './context/SettingsContext';
import { CurrencyProvider } from './context/CurrencyContext';
import ErrorBoundary from './components/ErrorBoundary';
import PrivateRoute from './components/common/PrivateRoute';

// Lazy load heavy components
const About = lazy(() => import('./components/About'));
const Services = lazy(() => import('./components/Services'));
const ClientDashboard = lazy(() => import('./components/ClientDashboard'));
const SkillSection = lazy(() => import('./components/SkillSection'));
const Projects = lazy(() => import('./components/Projects'));
const Testimonials = lazy(() => import('./components/Testimonials'));
const Blog = lazy(() => import('./components/Blog'));
const Certifications = lazy(() => import('./components/Certifications'));
const Contact = lazy(() => import('./components/Contact'));
const Products = lazy(() => import('./components/Products'));
const AdminDashboard = lazy(() => import('./components/AdminDashboard'));
const DynamicPage = lazy(() => import('./components/DynamicPage'));
const Login = lazy(() => import('./components/Login'));
const PaymentSuccess = lazy(() => import('./components/payment/PaymentSuccess'));
const PaymentFail = lazy(() => import('./components/payment/PaymentFail'));

const SectionLoader = () => (
  <div className="py-20 flex justify-center items-center">
    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

// SEO Component Placeholder (Move to separate file if needed)
const SEO = () => null;

const MainLayout = () => (
  <div className="min-h-screen text-slate-800 overflow-x-hidden selection:bg-purple-200 selection:text-purple-900 font-sans">
    <SEO />
    <ScrollProgress />
    <Navbar />
    <main className="relative">
      <Hero />
      <Suspense fallback={<SectionLoader />}>
        <Products />
        <Services />
        <Projects />
        <Contact />
        <About />
        <SkillSection />
        <Testimonials />
        <Blog />
        <Certifications />
      </Suspense>
    </main>
    <Footer />
  </div>
);

function App() {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.maintenance_mode === 'true' || data.maintenance_mode === true) {
          setMaintenanceMode(true);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <SectionLoader />;

  if (maintenanceMode && !window.location.pathname.startsWith('/login')) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white p-4 text-center">
        <h1 className="text-4xl font-bold mb-4">Under Maintenance</h1>
        <p className="text-slate-400">We are currently updating our website. Please check back later.</p>
        <div className="mt-8">
          <a href="/login" className="text-slate-600 hover:text-white text-sm">Are you the admin? Login</a>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <LanguageProvider>
        <SettingsProvider>
          <CurrencyProvider>
            <Router>
              <Routes>
                <Route path="/" element={<MainLayout />} />
                <Route path="/login" element={<Login />} />
                <Route path="/p/:slug" element={<DynamicPage />} />
                <Route path="/payment/success" element={<PaymentSuccess />} />
                <Route path="/payment/fail" element={<PaymentFail />} />

                {/* Protected Admin Routes */}
                <Route element={<PrivateRoute />}>
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/client-portal" element={<ClientDashboard />} />
                </Route>

                {/* Catch-all redirect */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
              <Toaster position="bottom-right" />
            </Router>
          </CurrencyProvider>
        </SettingsProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}

export default App;
