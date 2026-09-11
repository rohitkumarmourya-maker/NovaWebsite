import { useEffect, useRef } from 'react'
import { Routes, Route, useLocation, useNavigationType } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Businesses from './pages/Businesses'
import BusinessDetail from './pages/BusinessDetail'
import Capabilities from './pages/Capabilities'
import Innovation from './pages/Innovation'
import Careers from './pages/Careers'
import Apply from './pages/Apply'
import TermsOfService from './pages/TermsOfService'
import { ToastProvider } from './components/Toast'
import Contact from './pages/Contact'
import News from './pages/News'
import Privacy from './pages/Privacy'
import NotFound from './pages/NotFound'
import { AuthProvider } from './context/AuthContext'
import AdminLogin from './pages/admin/AdminLogin'
import AdminLayout from './pages/admin/AdminLayout'
import AdminOverview from './pages/admin/AdminOverview'
import AdminMessages from './pages/admin/AdminMessages'
import AdminApplications from './pages/admin/AdminApplications'
import AdminProjects from './pages/admin/AdminProjects'

/**
 * Scroll + focus management for client-side navigation:
 *  - new page: scroll to top (or to the #hash target) and move focus to <main>
 *  - back / forward: let the browser restore the previous scroll position
 */
function RouteChange() {
  const { pathname, hash } = useLocation()
  const navType = useNavigationType()
  const first = useRef(true)

  useEffect(() => {
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual'
  }, [])

  useEffect(() => {
    const isFirst = first.current
    first.current = false

    const scrollToHash = () => {
      const id = decodeURIComponent(hash.slice(1))
      const el = id ? document.getElementById(id) : null
      if (el) {
        el.scrollIntoView({ block: 'start', behavior: isFirst ? 'auto' : 'smooth' })
        return true
      }
      return false
    }

    if (hash) {
      // Wait a frame so the new page has rendered.
      requestAnimationFrame(() => {
        if (!scrollToHash()) window.scrollTo({ top: 0 })
      })
      return
    }
    if (navType === 'POP' && !isFirst) return // back/forward: keep position
    if (isFirst) return
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    const main = document.getElementById('main')
    if (main) {
      main.focus({ preventScroll: true })
    }
  }, [pathname, hash, navType])

  return null
}

export default function App() {
  const { pathname } = useLocation()
  const isAdmin = pathname.startsWith('/admin')

  return (
    <AuthProvider>
      <ToastProvider>
        {isAdmin ? (
          <Routes>
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminOverview />} />
              <Route path="messages" element={<AdminMessages />} />
              <Route path="applications" element={<AdminApplications />} />
              <Route path="projects" element={<AdminProjects />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        ) : (
          <div className="flex min-h-screen flex-col">
            <a href="#main" className="skip-link">
              Skip to content
            </a>
            <RouteChange />
            <Header />
            <main id="main" tabIndex={-1} className="flex-1 outline-none">
              <div key={pathname} className="page-enter">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/businesses" element={<Businesses />} />
                  <Route path="/businesses/:id" element={<BusinessDetail />} />
                  <Route path="/capabilities" element={<Capabilities />} />
                  <Route path="/innovation" element={<Innovation />} />
                  <Route path="/careers" element={<Careers />} />
                  <Route path="/careers/apply" element={<Apply />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/news" element={<News />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/terms-of-service" element={<TermsOfService />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
            </main>
            <Footer />
          </div>
        )}
      </ToastProvider>
    </AuthProvider>
  )
}
