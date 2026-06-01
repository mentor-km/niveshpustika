import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Award, DollarSign } from 'lucide-react';

export function BenefitsSection() {
  const benefits = [
    {
      icon: <Zap className="w-6 h-6 text-emerald-400" />,
      title: "Better Trading Discipline",
      description: "Maintain consistent trading habits with structured logging"
    },
    {
      icon: <Award className="w-6 h-6 text-emerald-400" />,
      title: "Improved Decision Making",
      description: "Data-driven insights for smarter trading choices"
    },
    {
      icon: <DollarSign className="w-6 h-6 text-emerald-400" />,
      title: "Clear P&L Tracking",
      description: "Crystal clear profit and loss visibility"
    }
  ];

  return (
    <section id="benefits" className="py-20 lg:py-32 bg-gray-950">
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
                Transform Your <span className="gradient-text">Trading Journey</span>
              </h2>
              <p className="text-lg text-gray-400 leading-relaxed">
                Perfect for beginners to intermediate traders who want to build discipline, 
                make better decisions, and achieve consistent profitability.
              </p>
            </div>

            <div className="space-y-6">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="flex items-start space-x-4"
                >
                  <div className="flex-shrink-0 bg-emerald-900/50 p-3 rounded-full">
                    {benefit.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1 font-heading text-gray-100">{benefit.title}</h3>
                    <p className="text-gray-400">{benefit.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="razorpay-embed-btn" data-url="https://pages.razorpay.com/pl_QmstwDXAE3TU2R/view" data-text="Start Trading Smarter - ₹149" data-color="#10B981" data-size="large">
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-w-16 aspect-h-12">
              <img 
                alt="A trader analyzing charts on a modern, clean interface"
                className="w-full h-full object-cover rounded-2xl shadow-2xl shadow-emerald-900/20"
               src="https://images.unsplash.com/photo-1605588722627-818efb8878b9" />
            </div>
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-emerald-500 rounded-full opacity-10 blur-3xl -z-10"></div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-amber-500 rounded-full opacity-10 blur-3xl -z-10"></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}