import React from 'react';
import { motion } from 'framer-motion';

export function CTASection() {
  return (
    <section className="py-20 lg:py-32 bg-emerald-600">
      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto text-white"
        >
          <h2 className="text-3xl lg:text-4xl font-bold font-heading mb-6">
            Ready to Transform Your Trading?
          </h2>
          <p className="text-lg lg:text-xl mb-8 opacity-90">
            Join thousands of successful traders who have improved their discipline and profitability with Nivesh पुस्तिका.
          </p>
          <p className="text-sm mt-6 opacity-80">
            Instant download • Lifetime updates
          </p>
        </motion.div>
      </div>
    </section>
  );
}