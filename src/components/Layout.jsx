import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function Layout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/assessment', label: 'Assessment' },
    { to: '/dashboard', label: 'Dashboard' },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <header
        className={`sticky top-0 z-50 transition-all duration-300 print:hidden ${
          scrolled
            ? 'bg-white/80 backdrop-blur-xl border-b border-gray-200/60 shadow-sm'
            : 'bg-white border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <img
                src="/think-big-logo.jpg"
                alt="Think Big"
                className="h-9 w-9 rounded-lg object-cover ring-1 ring-gray-100"
              />
              <span className="text-lg font-bold text-[#0A0F1E] tracking-tight">Think Big</span>
            </Link>

            {/* Desktop nav — centred */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map(link => {
                const isActive = location.pathname === link.to
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? 'text-[#00AEEF]'
                        : 'text-gray-500 hover:text-[#0A0F1E] hover:bg-gray-50'
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-[#00AEEF] rounded-full" />
                    )}
                  </Link>
                )
              })}
            </nav>

            {/* CTA right */}
            <div className="hidden md:block">
              <Link
                to="/assessment"
                className="bg-[#00AEEF] text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-[#0097D0] transition-all duration-200 shadow-sm hover:shadow-md"
              >
                Start Free &rarr;
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 text-gray-500 hover:text-[#0A0F1E] rounded-lg hover:bg-gray-50 transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white/95 backdrop-blur-xl animate-fade-in">
            <div className="px-4 py-3 space-y-1">
              {navLinks.map(link => {
                const isActive = location.pathname === link.to
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-[#00AEEF]/5 text-[#00AEEF]'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {link.label}
                    {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#00AEEF]" />}
                  </Link>
                )
              })}
              <div className="pt-2">
                <Link
                  to="/assessment"
                  onClick={() => setMenuOpen(false)}
                  className="block w-full text-center px-4 py-2.5 rounded-xl text-sm font-semibold bg-[#00AEEF] text-white hover:bg-[#0097D0] transition-colors"
                >
                  Start Free Assessment &rarr;
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">{children}</main>

      <footer className="bg-[#0A0F1E] text-white print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            {/* Brand */}
            <div className="flex items-start gap-3">
              <img src="/think-big-logo.jpg" alt="Think Big" className="h-10 w-10 rounded-xl object-cover ring-1 ring-white/10" />
              <div>
                <p className="font-bold text-white text-lg">Think Big</p>
                <p className="text-gray-400 text-sm mt-0.5">Life Evaluation Assessment</p>
              </div>
            </div>

            {/* Links */}
            <div className="flex items-center justify-start md:justify-center gap-8">
              <Link to="/assessment" className="text-sm text-gray-400 hover:text-white transition-colors">
                Take Assessment
              </Link>
              <Link to="/dashboard" className="text-sm text-gray-400 hover:text-white transition-colors">
                Dashboard
              </Link>
              <Link to="/" className="text-sm text-gray-400 hover:text-white transition-colors">
                Home
              </Link>
            </div>

            {/* Tagline + copyright */}
            <div className="md:text-right">
              <p className="text-sm text-gray-400">Discover where you truly stand in life.</p>
              <p className="text-xs text-gray-600 mt-2">
                &copy; {new Date().getFullYear()} Think Big. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
