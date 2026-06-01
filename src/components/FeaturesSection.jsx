import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, BarChart3, Target, Shield, PieChart, Calendar } from 'lucide-react';

export function FeaturesSection() {
  const features = [
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Trade Logging",
      description: "Complete trade entry and exit tracking with timestamps"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Auto KPI Dashboard",
      description: "Real-time performance metrics and analytics"
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Win Rate Tracker",
      description: "Track your success rate across different strategies"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Risk-Reward Analysis",
      description: "Comprehensive R:R ratio calculations and insights"
    },
    {
      icon: <PieChart className="w-8 h-8" />,
      title: "Monthly Performance",
      description: "Visual representation of your trading journey"
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "Indian Market Focus",
      description: "Optimized for NSE, BSE, MCX and currency markets"
    }
  ];

  return (
    <section id="features" className="py-20 lg:py-32 bg-gray-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl lg:text-4xl font-bold font-heading mb-4 text-white">
            Powerful <span className="gradient-text">Features</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto">
            Everything you need to become a disciplined and profitable trader, all in one comprehensive Excel workbook.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl hover:shadow-emerald-900/20 transition-all duration-300 border border-gray-700 group hover:-translate-y-2"
            >
              <div className="text-emerald-400 bg-emerald-900/50 rounded-full p-3 mb-5 inline-block group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2 font-heading text-gray-100">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}