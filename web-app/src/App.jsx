import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { AppProvider } from './context/AppContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

import HomeLandingView   from './pages/HomeLandingView'
import DownloaderView    from './pages/DownloaderView'
import DesktopAppView    from './pages/DesktopAppView'
import QueueView         from './pages/QueueView'
import SettingsView      from './pages/SettingsView'
import PublicBlogView    from './pages/PublicBlogView'
import ContactUsView     from './pages/ContactUsView'
import LegalPolicyView   from './pages/LegalPolicyView'
import AboutView         from './pages/AboutView'
import AdminPortalView   from './pages/AdminPortalView'
import LoginView         from './pages/LoginView'
import { DownloadProvider } from './context/DownloadContext'

/**
 * Admin-only route: waits for Supabase session check, then redirects to /login if not admin.
 */
function AdminRoute({ children }) {
  const { isAdmin, adminLoading } = useAuth()
  const location = useLocation()

  if (adminLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0f0f14]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
          <p className="text-slate-400 text-sm font-mono">Verifying admin session...</p>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}

function AppLayout() {
  const location = useLocation()
  const isAdminPage = location.pathname.startsWith('/admin')
  const isLoginPage = location.pathname === '/login'

  return (
    <div className="flex flex-col min-h-screen transition-colors duration-300">
      {!isAdminPage && !isLoginPage && <Navbar />}

      <main className="flex-1">
        <Routes>
          {/* ── Public routes — accessible to everyone ── */}
          <Route path="/"            element={<HomeLandingView />} />
          <Route path="/downloader"  element={<DownloaderView />} />
          <Route path="/desktop-app" element={<DesktopAppView />} />
          <Route path="/queue"       element={<QueueView />} />
          <Route path="/settings"    element={<SettingsView />} />
          <Route path="/blog"        element={<PublicBlogView />} />
          <Route path="/contact"     element={<ContactUsView />} />
          <Route path="/about"       element={<AboutView />} />
          <Route path="/privacy"     element={<LegalPolicyView type="privacy" />} />
          <Route path="/terms"       element={<LegalPolicyView type="terms" />} />
          <Route path="/refund-policy" element={<LegalPolicyView type="refund" />} />
          <Route path="/disclaimer"  element={<LegalPolicyView type="disclaimer" />} />

          {/* ── Admin login ── */}
          <Route path="/login" element={<LoginView />} />

          {/* ── Admin portal — requires admin login ── */}
          <Route path="/admin" element={
            <AdminRoute>
              <AdminPortalView />
            </AdminRoute>
          } />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {!isAdminPage && !isLoginPage && <Footer />}
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <AuthProvider>
        <DownloadProvider>
          <Router>
            <AppLayout />
          </Router>
        </DownloadProvider>
      </AuthProvider>
    </AppProvider>
  )
}
