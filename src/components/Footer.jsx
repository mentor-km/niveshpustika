import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart3 } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-400 border-t border-gray-800">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left">
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center justify-center md:justify-start space-x-3">
              <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold font-heading text-white">Nivesh पुस्तिका</span>
            </div>
            <p className="text-gray-400 max-w-md mx-auto md:mx-0">
              The smart trading journal for web and mobile.
            </p>
          </div>
          
          <div className="space-y-4">
             <h3 className="font-semibold text-white tracking-wider uppercase">Company</h3>
             <nav className="flex flex-col items-center md:items-start space-y-2">
                <a href="#faq" className="text-gray-300 hover:text-emerald-400 transition-colors">FAQ</a>
                <a href="/contact" className="text-gray-300 hover:text-emerald-400 transition-colors">Contact</a>
             </nav>
          </div>

          <div className="space-y-4">
             <h3 className="font-semibold text-white tracking-wider uppercase">Legal</h3>
             <nav className="flex flex-col items-center md:items-start space-y-2">
                <a href="/terms" className="text-gray-300 hover:text-emerald-400 transition-colors">Terms of Service</a>
                <a href="/privacy" className="text-gray-300 hover:text-emerald-400 transition-colors">Privacy Policy</a>
             </nav>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500 flex flex-col sm:flex-row justify-between items-center">
          <p>&copy; {new Date().getFullYear()} Nivesh पुस्तिका. All rights reserved.</p>
          <Link to="/admin" className="text-sm hover:text-emerald-400 transition-colors mt-4 sm:mt-0">Admin Login</Link>
        </div>
      </div>
    </footer>
  );
}