import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export function DownloadAppSection() {
  return (
    <section id="download" className="py-16 lg:py-24 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative flex justify-center"
          >
            <img
              alt="A smartphone displaying the Nivesh Pustika mobile app interface for logging trades."
              className="max-h-[500px]"
             src="https://images.unsplash.com/photo-1695736749216-26b31c705006" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center lg:text-left"
          >
            <h2 className="text-3xl lg:text-4xl font-bold font-heading mb-4 text-white">
              Trade on the Go with our <span className="gradient-text">Android App</span>
            </h2>
            <p className="text-lg text-gray-400 leading-relaxed mb-8">
              Never miss a trade. Log your entries and exits, check your performance, and stay on top of your game, right from your pocket.
            </p>
            <div className="flex justify-center lg:justify-start">
              <a href="#" onClick={(e) => { e.preventDefault(); alert("🚧 Google Play Store link not available yet!"); }} className="inline-block">
                <img
                  alt="Get it on Google Play"
                  className="h-16"
                 src="https://images.unsplash.com/photo-1697865706223-bda7538d2556" />
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}