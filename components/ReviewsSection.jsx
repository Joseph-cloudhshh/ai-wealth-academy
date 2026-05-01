import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { fetchActiveReviews } from "../lib/api/reviews";

export default function ReviewsSection() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetchActiveReviews().then(setReviews).catch(() => setReviews([]));
  }, []);

  if (reviews.length === 0) return null;

  return (
    <section className="relative py-32 px-6 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-[10px] font-space tracking-[0.3em] uppercase text-white/25 mb-3 block">Student Results</span>
          <h2 className="font-sora font-bold text-3xl sm:text-4xl tracking-tight text-white/90 mb-4">
            Real People. Real Results.
          </h2>
          <p className="font-space text-sm text-white/30 max-w-md mx-auto">
            Thousands of students are already building wealth with AI. Here's what they have to say.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reviews.map((review, i) => (
            <motion.div key={review.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="relative p-6 bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.1] hover:bg-white/[0.03] transition-all duration-300 group"
            >
              <Quote className="absolute top-5 right-5 w-5 h-5 text-white/[0.05]" />
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: review.rating }).map((_, si) => (
                  <Star key={si} className="w-3 h-3 fill-white/40 text-white/40" />
                ))}
              </div>
              <p className="font-space text-sm text-white/50 leading-relaxed mb-6">"{review.text}"</p>
              <div className="flex items-center gap-3 pt-4 border-t border-white/[0.04]">
                {review.avatar ? (
                  <img src={review.avatar} alt={review.name} className="w-9 h-9 object-cover rounded-full grayscale opacity-60 group-hover:opacity-80 transition-opacity" />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-white/[0.06] flex items-center justify-center text-xs font-sora text-white/40">
                    {review.name?.[0]}
                  </div>
                )}
                <div>
                  <p className="font-sora font-semibold text-xs text-white/70">{review.name}</p>
                  <p className="font-space text-[10px] text-white/25">{review.role}</p>
                </div>
                {review.course_name && (
                  <span className="ml-auto text-[9px] font-space text-white/15 uppercase tracking-wider">{review.course_name}</span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}