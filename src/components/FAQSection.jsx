import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

export function FAQSection() {
  const faqs = [
    {
      question: "What happens after my 7-day free trial ends?",
      answer: "After the trial, you can continue to log trades for free. To access the advanced analytics dashboard and export features, you'll need to upgrade to a premium plan."
    },
    {
      question: "Is my trading data secure?",
      answer: "Absolutely. Your data is encrypted and stored securely. We prioritize your privacy and will never share your trading data with third parties."
    },
    {
      question: "Can I export my trade data?",
      answer: "Yes, premium users can export their complete trade history to CSV or PDF formats at any time."
    },
    {
      question: "What if I forget my password?",
      answer: "You can easily reset your password from the login page. Just click 'Forgot Password' and follow the instructions sent to your email."
    },
    {
      question: "Do you have a refund policy?",
      answer: "We offer a 7-day free trial so you can experience the full power of the platform before committing. Once you subscribe, we do not offer refunds, but you can cancel your subscription at any time."
    }
  ];

  const [openFaq, setOpenFaq] = React.useState(0);

  return (
    <section id="faq" className="py-16 lg:py-24 bg-gray-950">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl lg:text-4xl font-bold font-heading mb-4 text-white">
            Frequently Asked <span className="gradient-text">Questions</span>
          </h2>
        </motion.div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-800 rounded-xl shadow-md border border-gray-700 overflow-hidden"
            >
              <button
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                className="w-full p-5 md:p-6 text-left flex items-center justify-between"
              >
                <span className="font-semibold font-heading text-md md:text-lg text-gray-100">{faq.question}</span>
                {openFaq === index ? (
                  <Minus className="w-5 h-5 text-emerald-400 flex-shrink-0 ml-4" />
                ) : (
                  <Plus className="w-5 h-5 text-gray-500 flex-shrink-0 ml-4" />
                )}
              </button>
              <AnimatePresence>
                {openFaq === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 md:px-6 pb-5">
                      <p className="text-gray-400 leading-relaxed">{faq.answer}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}