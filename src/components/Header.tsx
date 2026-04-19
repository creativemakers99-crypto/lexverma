import { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, MapPin } from 'lucide-react';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'About Us', path: '/about' },
  { name: 'Practice Areas', path: '/services' },
  { name: 'Our Advocates', path: '/advocates' },
  { name: 'Client Testimonials', path: '/testimonials' },
  { name: 'AI Deep Eval', path: '/ai-evaluation' },
  { name: 'Careers', path: '/career' },
  { name: 'Contact', path: '/contact' },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 flex flex-col transition-all duration-300 border-b-[3px] border-[var(--color-gold)] bg-[var(--color-primary)] text-white ${
          isScrolled ? 'shadow-xl' : ''
        }`}
      >
        {/* Top Utility Bar */}
        <div className="hidden md:flex justify-between items-center px-10 py-2 text-[11px] uppercase tracking-widest border-b border-[var(--color-gold)]/20">
          <span className="flex items-center gap-1.5"><MapPin size={12} /> Indore, Madhya Pradesh</span>
          <div className="flex items-center gap-6">
            <span>Consultation: +91xxxxxxxx02 &nbsp; | &nbsp; info@lexverma.law</span>
            <div className="flex items-center gap-4 border-l border-white/20 pl-6">
              <Link to="/portal" className="text-[var(--color-gold)] hover:text-white transition-colors font-bold flex items-center gap-1">
                Client Portal
              </Link>
              <Link to="/admin" className="text-white/60 hover:text-white transition-colors flex items-center gap-1">
                Admin Panel
              </Link>
            </div>
          </div>
        </div>

        <div className={`w-full px-4 md:px-10 flex justify-between items-center transition-all duration-300 ${isScrolled ? 'py-4' : 'py-5'}`}>
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[var(--color-gold)] flex items-center justify-center font-serif font-bold text-[var(--color-primary)] text-2xl">
              V
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-bold text-[20px] tracking-wide text-white">
                LEXVERMA & ASSOCIATES
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-8">
            {/* Desktop Nav */}
            <nav className="hidden xl:flex items-center gap-6">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className={({ isActive }) =>
                    `text-[13px] font-medium transition-colors duration-300 ${
                      isActive
                        ? 'text-[var(--color-gold)]'
                        : 'text-white/80 hover:text-[var(--color-gold)]'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </nav>

            {/* Mobile Menu Toggle */}
            <button
              className="xl:hidden p-2 text-white/80 hover:text-[var(--color-gold)] transition-colors"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu size={28} />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed inset-0 bg-[var(--color-primary)] z-50 flex flex-col"
            >
              <div className="flex justify-between items-center p-6 border-b border-[var(--color-gold)]/20">
                <span className="font-serif font-bold text-xl text-[var(--color-gold)]">LEXVERMA & ASSOCIATES</span>
                <button
                  className="p-2 text-white hover:text-[var(--color-gold)]"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <X size={28} />
                </button>
              </div>
              <nav className="flex flex-col p-6 gap-6 overflow-y-auto">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.name}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `text-xl font-serif tracking-wide transition-colors ${
                        isActive ? 'text-[var(--color-gold)]' : 'text-white hover:text-[var(--color-gold)]'
                      }`
                    }
                  >
                    {link.name}
                  </NavLink>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
