import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

export function TestimonialsSection() {
  const testimonials = [
    {
      name: "Rajesh Kumar",
      role: "Options Trader",
      content: "Nivesh पुस्तिका ने मेरी trading को completely transform कर दिया! अब मैं अपने हर trade को track कर सकता हूं।",
      rating: 5,
      avatar: "RK"
    },
    {
      name: "Priya Sharma",
      role: "Stock Investor",
      content: "Excel-based होने के कारण यह बहुत easy to use है। मेरी win rate 15% बढ़ गई है!",
      rating: 5,
      avatar: "PS"
    },
    {
      name: "Amit Patel",
      role: "Day Trader",
      content: "Best investment मैंने trading के लिए किया है। Risk management अब बहुत better है।",
      rating: 5,
      avatar: "AP"
    }
  ];

  return (
    <section id="testimonials" className="py-20 lg:py-32 bg-gray-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl lg:text-4xl font-bold font-heading mb-4 text-white">
            What Traders <span className="gradient-text">Say</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto">
            Join hundreds of successful traders who have transformed their trading with Nivesh पुस्तिका.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-700 flex flex-col"
            >
              <Quote className="w-8 h-8 text-emerald-600 mb-4" />
              <p className="text-gray-300 mb-6 italic leading-relaxed flex-grow">"{testimonial.content}"</p>
              <div className="flex items-center space-x-4 mt-auto">
                <div className="w-14 h-14 bg-emerald-500 text-white rounded-full flex items-center justify-center text-xl font-bold">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-semibold font-heading text-gray-100">{testimonial.name}</p>
                  <p className="text-gray-500 text-sm">{testimonial.role}</p>
                </div>
              </div>
               <div className="flex items-center mt-4 border-t border-gray-700 pt-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-amber-400 fill-current" />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}