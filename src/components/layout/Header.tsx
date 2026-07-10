'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NAV_LINKS, CONTACT } from '@/lib/constants';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = NAV_LINKS;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-charcoal/80 backdrop-blur-xl border-b border-glass-border'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a href="/" className="flex items-center gap-3 group">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-gold to-gold-light flex items-center justify-center">
              <span className="text-charcoal font-heading font-bold text-lg">L</span>
            </div>
            <div>
              <span className="font-heading text-xl font-semibold text-cream group-hover:text-gold transition-colors">
                Lumi Design
              </span>
              <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em]">
                Interior • Bespoke
              </p>
            </div>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm text-muted-foreground hover:text-cream transition-colors relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-gold transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
            <a
              href={"tel:" + CONTACT.phoneRaw}
              className="flex items-center gap-2 text-sm text-gold hover:text-gold-light transition-colors"
            >
              <Phone className="h-4 w-4" />
              {CONTACT.phone}
            </a>
            <Button variant="gold" size="sm" asChild>
              <a href="/login">Quản trị</a>
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-cream"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-charcoal/95 backdrop-blur-xl border-t border-glass-border"
          >
            <div className="container mx-auto px-4 py-6 space-y-4">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-lg text-muted-foreground hover:text-cream transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-4 border-t border-glass-border space-y-3">
                <a
                  href={"tel:" + CONTACT.phoneRaw}
                  className="flex items-center gap-2 text-gold"
                >
                  <Phone className="h-4 w-4" />
                  {CONTACT.phone}
                </a>
                <Button variant="gold" className="w-full" asChild>
                  <a href="/login">Quản trị</a>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
