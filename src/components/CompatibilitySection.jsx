import React from 'react';
import { motion } from 'framer-motion';
import { Monitor, Smartphone } from 'lucide-react';

export function CompatibilitySection() {
  return (
    <section className="py-20 lg:py-32 bg-gray-900">
      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="text-3xl lg:text-4xl font-bold font-heading mb-4 text-white">
            <span className="gradient-text">Platform</span> Compatibility
          </h2>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto">
            Designed for the best experience on desktop. Mobile viewing is supported via the Excel app.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-700"
          >
            <div className="bg-emerald-900/50 text-emerald-400 rounded-full p-3 inline-block mb-4">
              <Monitor className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold mb-2 font-heading text-gray-100">Desktop & Laptop (Recommended)</h3>
            <p className="text-gray-400">Full functionality and best experience on Windows and Mac.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-700"
          >
            <div className="bg-emerald-900/50 text-emerald-400 rounded-full p-3 inline-block mb-4">
              <Smartphone className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold mb-2 font-heading text-gray-100">Mobile & Tablet</h3>
            <p className="text-gray-400">Use the official Microsoft Excel app to view your journal on the go.</p>
          </motion.div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8 text-gray-500">
          <span className="text-md font-semibold text-gray-400">Trusted by traders using:</span>
          <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2">
            <span className="font-medium text-gray-300">Zerodha</span>
            <span className="font-medium text-gray-300">Upstox</span>
            <span className="font-medium text-gray-300">Angel One</span>
            <span className="font-medium text-gray-300">ICICI Direct</span>
          </div>
        </div>
      </div>
    </section>
  );
}