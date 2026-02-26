import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function Layout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/assessment', label: 'Assessment' },
    { to: '/dashboard', label: 'Dashboard' },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <img
                src="/think-big-logo.jpg"
                alt="Think Big"
                className="h-9 w-9 rounded-lg object-cover"
              />
              <span className="text-xl font-bold text-dark tracking-tight">Think Big</span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-6">
              {navLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`text-sm font-medium transition-colors ${
                    location.pathname === link.to
                      ? 'text-primary'
                      : 'text-gray-600 hover:text-dark'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/assessment"
                className="bg-primary text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
              >
                Start Free →
              </Link>
            </nav>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 text-gray-600"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-3 space-y-1">
              {navLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  className={`block px-3 py-2 rounded-lg text-sm font-medium ${
                    location.pathname === link.to
                      ? 'bg-blue-50 text-primary'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/assessment"
                onClick={() => setMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-semibold bg-primary text-white text-center mt-2"
              >
                Start Free Assessment →
              </Link>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">{children}</main>

      <footer className="bg-dark text-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <img src="/think-big-logo.jpg" alt="Think Big" className="h-8 w-8 rounded-md object-cover" />
              <div>
                <p className="font-bold text-white">Think Big</p>
                <p className="text-gray-400 text-xs">Life Evaluation Assessment</p>
              </div>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <Link to="/assessment" className="hover:text-white transition-colors">Take Assessment</Link>
              <Link to="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
            </div>
            <p className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} Think Big. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
