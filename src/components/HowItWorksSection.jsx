import React from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Edit, BarChart2 } from 'lucide-react';

export function HowItWorksSection() {
  const steps = [
    {
      icon: <UserPlus className="w-8 h-8" />,
      title: "1. Sign Up Free",
      description: "Create your account in seconds. No credit card needed to start your 7-day trial."
    },
    {
      icon: <Edit className="w-8 h-8" />,
      title: "2. Log Your Trades",
      description: "Easily enter your trade details on our web or mobile app. It's fast and intuitive."
    },
    {
      icon: <BarChart2 className="w-8 h-8" />,
      title: "3. See Your Insights",
      description: "Instantly see your performance dashboard, track KPIs, and find your edge."
    }
  ];

  return (
    <section id="how-it-works" className="py-16 lg:py-24 bg-gray-900 text-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl lg:text-4xl font-bold font-heading mb-4">
            Get Started in <span className="text-emerald-400">3 Easy Steps</span>
          </h2>
        </motion.div>

        <div className="relative">
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gray-700 -translate-y-1/2 opacity-50"></div>
          <div className="grid md:grid-cols-3 gap-8 relative">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="text-center p-8 bg-gray-800 rounded-2xl shadow-lg border border-gray-700"
              >
                <div className="mb-6 inline-block p-4 bg-emerald-500 text-white rounded-full">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold font-heading mb-3 text-white">{step.title}</h3>
                <p className="text-gray-400">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}