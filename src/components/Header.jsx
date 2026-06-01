import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, Menu, X, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: 'How it Works', href: '#how-it-works' },
    { name: 'Features', href: '#features' },
    { name: 'Download', href: '#download' },
    { name: 'FAQ', href: '#faq' },
  ];

  const menuVariants = {
    hidden: { x: '100%' },
    visible: { x: 0, transition: { duration: 0.3, ease: 'easeInOut' } },
  };

  return (
    <>
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 w-full bg-gray-900/80 backdrop-blur-md border-b border-gray-700 z-50"
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold font-heading text-white">Nivesh पुस्तिका</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map(link => (
              <a key={link.name} href={link.href} className="text-gray-300 hover:text-emerald-400 transition-colors">{link.name}</a>
            ))}
          </nav>
          <div className="hidden md:flex items-center gap-4">
            <Button asChild variant="ghost" className="text-gray-300 hover:text-emerald-400">
              <Link to="/app">
                <LogIn className="w-4 h-4 mr-2" />
                Login
              </Link>
            </Button>
            <Button asChild className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold">
              <Link to="/app">Get Started</Link>
            </Button>
          </div>
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(true)} className="p-2">
              <Menu className="w-6 h-6 text-gray-300" />
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="fixed inset-0 bg-gray-900 z-50 p-6 flex flex-col md:hidden"
          >
            <div className="flex items-center justify-between mb-12">
              <Link to="/" className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold font-heading text-white">Nivesh पुस्तिका</span>
              </Link>
              <button onClick={() => setIsMenuOpen(false)} className="p-2">
                <X className="w-6 h-6 text-gray-300" />
              </button>
            </div>
            <nav className="flex flex-col items-center space-y-8">
              {navLinks.map(link => (
                <a 
                  key={link.name} 
                  href={link.href} 
                  className="text-2xl font-semibold text-gray-200 hover:text-emerald-400 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </a>
              ))}
            </nav>
            <div className="mt-auto pt-8 flex flex-col gap-4">
                <Button asChild size="lg" variant="outline" className="border-emerald-500 text-emerald-500">
                  <Link to="/app" onClick={() => setIsMenuOpen(false)}>Login</Link>
                </Button>
                <Button asChild size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold">
                  <Link to="/app" onClick={() => setIsMenuOpen(false)}>Get Started — Free Trial</Link>
                </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}