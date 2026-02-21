import React, { Suspense, lazy } from 'react';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ScrollProgress from './components/ScrollProgress';
import Footer from './components/Footer';
import { LanguageProvider } from './context/LanguageContext';
import { SettingsProvider } from './context/SettingsContext';
import { CurrencyProvider } from './context/CurrencyContext';

// Lazy load heavy/below-fold components
const About = lazy(() => import('./components/About'));
const Services = lazy(() => import('./components/Services'));
const SkillSection = lazy(() => import('./components/SkillSection'));
const Projects = lazy(() => import('./components/Projects'));
const Testimonials = lazy(() => import('./components/Testimonials'));
const Blog = lazy(() => import('./components/Blog'));
const Certifications = lazy(() => import('./components/Certifications'));
const Contact = lazy(() => import('./components/Contact'));
const Products = lazy(() => import('./components/Products'));

// Loading Fallback
const SectionLoader = () => (
  <div className="py-20 flex justify-center items-center">
    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

import ErrorBoundary from './components/ErrorBoundary';

import AdminDashboard from './components/AdminDashboard';
import DynamicPage from './components/DynamicPage';
import Login from './components/Login';

import PaymentSuccess from './components/payment/PaymentSuccess';
import PaymentFail from './components/payment/PaymentFail';
import NewsletterPopup from './components/common/NewsletterPopup';
import ChatWidget from './widget/ChatWidget';
import PixelTracker from './components/common/PixelTracker';
import AIAssistant from './components/common/AIAssistant';
import ClientDashboard from './components/ClientDashboard';

function App() {
  console.log("App component rendering");
  const [isAdmin, setIsAdmin] = React.useState(window.location.pathname === '/admin');
  const [isLogin, setIsLogin] = React.useState(window.location.pathname === '/login');
  const [isDynamicPage, setIsDynamicPage] = React.useState(window.location.pathname.startsWith('/p/'));
  const [isPaymentSuccess, setIsPaymentSuccess] = React.useState(window.location.pathname.startsWith('/payment/success'));
  const [isPaymentFail, setIsPaymentFail] = React.useState(window.location.pathname.startsWith('/payment/fail'));
  const [maintenanceMode, setMaintenanceMode] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const path = window.location.pathname;
    if (path === '/admin') setIsAdmin(true);
    else if (path === '/login') setIsLogin(true);
    else if (path.startsWith('/p/')) setIsDynamicPage(true);
    else if (path.startsWith('/payment/success')) setIsPaymentSuccess(true);
    else if (path.startsWith('/payment/fail')) setIsPaymentFail(true);

    // Check Maintenance Mode
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

  if (isAdmin) {
    return (
      <LanguageProvider>
        <SettingsProvider>
          <AdminDashboard />
          <Toaster position="bottom-right" />
        </SettingsProvider>
      </LanguageProvider>
    );
  }

  if (isLogin) {
    return (
      <LanguageProvider>
        <Login />
        <Toaster position="bottom-right" />
      </LanguageProvider>
    );
  }

  // Maintenance Screen
  if (maintenanceMode) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white p-4 text-center">
        <div className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center mb-6 animate-pulse">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
        </div>
        <h1 className="text-4xl font-bold mb-4">Under Maintenance</h1>
        <p className="text-slate-400 max-w-md">We are currently updating our website to give you a better experience. Please check back later.</p>
        <div className="mt-8">
          <a href="/login" className="text-slate-600 hover:text-white text-sm">Are you the admin? Login</a>
        </div>
      </div>
    );
  }

  if (isDynamicPage) {
    return (
      <LanguageProvider>
        <SettingsProvider>
          <DynamicPage />
        </SettingsProvider>
      </LanguageProvider>
    );
  }

  if (isPaymentSuccess) {
    return <PaymentSuccess />;
  }

  if (isPaymentFail) {
    return <PaymentFail />;
  }

  return (
    <ErrorBoundary>
      <LanguageProvider>
        <SettingsProvider>
          <CurrencyProvider>
            <div className="min-h-screen text-slate-800 overflow-x-hidden selection:bg-purple-200 selection:text-purple-900 font-sans">
              <SEO />
              <ScrollProgress />
              <Navbar />
              <NewsletterPopup />
              <AIAssistant />
              <ChatWidget />
              <PixelTracker />

              <main className="relative">
                <Hero />

                <Suspense fallback={<SectionLoader />}>
                  <Products />
                </Suspense>

                <Suspense fallback={<SectionLoader />}>
                  <Services />
                </Suspense>

                <Suspense fallback={<SectionLoader />}>
                  <Projects />
                </Suspense>

                <Suspense fallback={<SectionLoader />}>
                  <Contact />
                </Suspense>

                <Suspense fallback={<SectionLoader />}>
                  <About />
                </Suspense>

                <Suspense fallback={<SectionLoader />}>
                  <SkillSection />
                </Suspense>

                <Suspense fallback={<SectionLoader />}>
                  <Testimonials />
                </Suspense>

                <Suspense fallback={<SectionLoader />}>
                  <Blog />
                </Suspense>

                <Suspense fallback={<SectionLoader />}>
                  <Certifications />
                </Suspense>
              </main>

              <Footer />
            </div>
          </CurrencyProvider>
        </SettingsProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}

export default App;
