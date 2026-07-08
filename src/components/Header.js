import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaTimes } from 'react-icons/fa';
import Logo from '../assets/images/logo_white.png';
import Button from './ui/Button';
import { ease } from '../utils/motionTokens';

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close on route change.
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Escape closes the mobile menu.
  useEffect(() => {
    if (!isOpen) return undefined;
    const onKey = (e) => e.key === 'Escape' && setIsOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen]);

  const navLinks = [
    { name: 'SYSTEMS', path: '/products' },
    { name: 'CREW', path: '/team' },
    { name: 'MISSION LOG', path: '/news' },
  ];
  const isActive = (path) =>
    path === '/products' ? location.pathname.startsWith('/products') : location.pathname === path;

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: ease.standard }}
        className={`fixed w-full z-50 transition-all duration-300 border-b ${
          scrolled
            ? 'bg-background/85 backdrop-blur-xl py-4 border-white/[0.08]'
            : 'bg-transparent py-6 border-transparent'
        }`}
      >
        <div className="container mx-auto px-6 flex justify-between items-center">
          <Link to="/" className="z-50" aria-label="Orbital Robotics home">
            <img src={Logo} alt="Orbital Robotics" className="h-10 md:h-12" />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center">
            <div className="flex items-center gap-1 border hairline bg-black/40 backdrop-blur-xl p-1">
              {navLinks.map((link) => {
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`relative px-5 py-2 font-mono text-xs uppercase tracking-[0.12em] transition-colors ${
                      active ? 'text-white' : 'text-text-secondary hover:text-white'
                    }`}
                  >
                    {active && (
                      <motion.div
                        layoutId="nav-pill"
                        className="absolute inset-0 bg-white/10 border border-white/10"
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{link.name}</span>
                  </Link>
                );
              })}
              <Link
                to="/contact"
                className="ml-1 px-5 py-2 font-mono text-xs uppercase tracking-[0.12em] bg-primary text-white hover:bg-primary-hover transition-colors"
              >
                First Contact
              </Link>
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-white text-2xl z-50"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
          >
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </motion.header>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-xl z-40 flex flex-col items-center justify-center space-y-8 lg:hidden pt-24 pb-10 overflow-y-auto"
          >
            {navLinks.map((link, index) => (
              <motion.div
                key={link.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05, duration: 0.3 }}
              >
                <Link
                  to={link.path}
                  className={`font-mono text-xl uppercase tracking-[0.14em] hover:text-accent transition-colors ${
                    location.pathname === link.path ? 'text-accent' : 'text-white'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + navLinks.length * 0.05, duration: 0.3 }}
            >
              <Button to="/contact" size="lg" onClick={() => setIsOpen(false)}>
                First Contact
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Header;
