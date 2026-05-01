import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const FAQS = [
  { q: "What is AI Wealth Academy?", a: "AI Wealth Academy is a premium education platform that teaches you how to leverage artificial intelligence tools and strategies to build sustainable digital income streams." },
  { q: "How do I access a course?", a: "Each course requires a unique purchase token. Once you have your token, enter it on the course page to unlock instant access to all premium content." },
  { q: "What's included in each course?", a: "Our courses include video lessons, PDF guides, resource libraries, downloadable templates, and curated external links — all designed to give you actionable strategies." },
  { q: "Are the courses updated?", a: "Yes. AI moves fast, and so do we. All courses are regularly updated with the latest tools, strategies, and real-world case studies." },
  { q: "Can I access courses on mobile?", a: "Absolutely. AI Wealth Academy is fully responsive and optimized for desktop, tablet, and mobile devices." },
  { q: "What if my token doesn't work?", a: "If you're experiencing issues with your purchase token, please reach out via our contact page and we'll resolve it within 24 hours." },
  { q: "Do you offer refunds?", a: "Due to the digital nature of our content, we offer a 7-day satisfaction guarantee. If you're not satisfied, contact us for a full refund." },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="min-h-screen bg-[#050505] pt-28 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <span className="text-[10px] font-space tracking-[0.3em] uppercase text-white/30 mb-3 block">
            Support
          </span>
          <h1 className="font-sora font-bold text-4xl sm:text-5xl tracking-tight text-white/90">
            Frequently Asked
            <br />
            <span className="text-white/50">Questions</span>
          </h1>
        </motion.div>

        <div className="space-y-2">
          {FAQS.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full text-left px-6 py-5 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.1] transition-all duration-300 group"
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="font-sora font-medium text-sm text-white/70 group-hover:text-white/90 transition-colors">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-white/25 shrink-0 transition-transform duration-300 ${
                      openIndex === i ? "rotate-180" : ""
                    }`}
                  />
                </div>
                <AnimatePresence>
                  {openIndex === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <p className="font-space text-xs text-white/35 leading-relaxed mt-4 pt-4 border-t border-white/[0.04]">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}