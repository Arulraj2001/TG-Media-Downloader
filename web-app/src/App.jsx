import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { AppProvider } from './context/AppContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ActionGateModal from './components/ActionGateModal'

import HomeLandingView from './pages/HomeLandingView'
import DownloaderView from './pages/DownloaderView'
import PricingView from './pages/PricingView'
import UserProfileView from './pages/UserProfileView'
import PublicBlogView from './pages/PublicBlogView'
import ContactUsView from './pages/ContactUsView'
import LegalPolicyView from './pages/LegalPolicyView'
import AboutView from './pages/AboutView'
import AdminPortalView from './pages/AdminPortalView'

export default function App() {
  return (
    <AppProvider>
      <AuthProvider>
        <Router>
          <div className="flex flex-col min-h-screen transition-colors duration-300">
            <Navbar />
            <ActionGateModal />
            
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<HomeLandingView />} />
                <Route path="/downloader" element={<DownloaderView />} />
                <Route path="/pricing" element={<PricingView />} />
                <Route path="/profile" element={<UserProfileView />} />
                <Route path="/blog" element={<PublicBlogView />} />
                <Route path="/contact" element={<ContactUsView />} />
                <Route path="/about" element={<AboutView />} />
                
                {/* AdSense Legal Compliance Pages */}
                <Route path="/privacy" element={<LegalPolicyView type="privacy" />} />
                <Route path="/terms" element={<LegalPolicyView type="terms" />} />
                <Route path="/refund-policy" element={<LegalPolicyView type="refund" />} />
                <Route path="/disclaimer" element={<LegalPolicyView type="disclaimer" />} />

                {/* Protected Admin Portal */}
                <Route path="/admin" element={<AdminPortalView />} />
              </Routes>
            </main>

            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </AppProvider>
  )
}
