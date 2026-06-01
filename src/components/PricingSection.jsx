import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

export function PricingSection() {
  return (
    <section id="pricing" className="py-20 lg:py-32 bg-gray-950">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl lg:text-4xl font-bold font-heading mb-4 text-white">
            One Price, <span className="gradient-text">Lifetime Value</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto">
            Just a single, one-time payment. You get lifetime access with all future updates, no subscriptions or hidden fees. Ever.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, type: 'spring' }}
          className="max-w-md mx-auto"
        >
          <div className="bg-gray-800 rounded-3xl shadow-2xl shadow-emerald-900/20 border-2 border-emerald-500 overflow-hidden relative">
            <div className="bg-emerald-500 text-white text-center py-3">
              <span className="text-md font-semibold tracking-wider">MOST POPULAR</span>
            </div>
            
            <div className="p-8 text-center">
              <h3 className="text-2xl font-bold font-heading mb-2 text-white">Nivesh पुस्तिका</h3>
              <div className="mb-6">
                <span className="text-5xl font-bold text-white">₹149</span>
                <span className="text-gray-400 ml-2">one-time</span>
              </div>
              
              <ul className="space-y-4 mb-8 text-left">
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  <span className="text-gray-300">Complete Trading Journal</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  <span className="text-gray-300">Auto KPI Dashboard</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  <span className="text-gray-300">Performance Analytics</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  <span className="text-gray-300">Risk Management Tools</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  <span className="text-gray-300">Lifetime Free Updates</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  <span className="text-gray-300">Email Support</span>
                </li>
              </ul>
              
              <div className="razorpay-embed-btn" data-url="https://pages.razorpay.com/pl_QmstwDXAE3TU2R/view" data-text="Claim Your Lifetime Access - ₹149" data-color="#10B981" data-size="large">
              </div>
              
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}