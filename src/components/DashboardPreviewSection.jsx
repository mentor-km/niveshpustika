import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, BarChartHorizontal, PieChart, FileDown } from 'lucide-react';

export function DashboardPreviewSection() {
  const features = [
    { icon: <BarChartHorizontal className="w-5 h-5 text-emerald-400" />, text: "Detailed Trade Logging" },
    { icon: <PieChart className="w-5 h-5 text-emerald-400" />, text: "Advanced KPI Analytics" },
    { icon: <FileDown className="w-5 h-5 text-emerald-400" />, text: "CSV/PDF Data Exports" },
    { icon: <CheckCircle className="w-5 h-5 text-emerald-400" />, text: "Full Mobile App Access" },
  ];

  return (
    <section id="features" className="py-16 lg:py-24 bg-gray-950">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold font-heading mb-4 text-white">
                Your <span className="gradient-text">Trading Command Center</span>
              </h2>
              <p className="text-lg text-gray-400 leading-relaxed">
                Go beyond simple logging. Nivesh Pustika gives you a data-driven dashboard to analyze your performance, spot patterns, and make smarter decisions.
              </p>
            </div>

            <ul className="space-y-4">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center space-x-3">
                  {feature.icon}
                  <span className="text-lg text-gray-300">{feature.text}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-w-16 aspect-h-10 bg-gray-800 rounded-2xl p-4 border border-gray-700 shadow-2xl shadow-emerald-900/20">
              <img
                alt="A preview of the Nivesh Pustika dashboard showing KPI cards for win rate, profit factor, and total P&L, with an equity curve line chart."
                className="w-full h-full object-cover rounded-lg"
               src="https://images.unsplash.com/photo-1625296276703-3fbc924f07b5" />
            </div>
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-emerald-500 rounded-full opacity-10 blur-3xl -z-10"></div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-amber-500 rounded-full opacity-10 blur-3xl -z-10"></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}