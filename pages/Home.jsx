import { motion } from "framer-motion";
import ReviewsSection from "../components/ReviewsSection";
import HeroSection from "../components/HeroSection";
import FeaturedCourses from "../components/FeaturedCourses";
import { Sparkles, Shield, Zap, BookOpen } from "lucide-react";

const FEATURES = [
  { icon: Sparkles, title: "AI-Powered", desc: "Cutting-edge AI tools and strategies" },
  { icon: Shield, title: "Premium Content", desc: "Exclusive high-quality materials" },
  { icon: Zap, title: "Instant Access", desc: "Unlock and start learning immediately" },
  { icon: BookOpen, title: "Expert-Led", desc: "Created by industry professionals" },
];

export default function Home() {
  return (
    <div className="bg-[#050505]">
      <HeroSection />

      {/* Features strip */}
      <section className="relative py-20 px-6 border-y border-white/[0.04]">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {FEATURES.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center p-6"
              >
                <div className="w-10 h-10 bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-4 h-4 text-white/50" />
                </div>
                <h3 className="font-sora font-semibold text-sm text-white/70 mb-1">{feat.title}</h3>
                <p className="font-space text-xs text-white/25">{feat.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      <FeaturedCourses />

      <ReviewsSection />

      {/* CTA */}
      <section className="relative py-32 px-6">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl mx-auto text-center"
        >
          <h2 className="font-sora font-bold text-3xl sm:text-5xl tracking-tight text-white/90 mb-6">
            Start Your AI Journey
          </h2>
          <p className="font-space text-sm text-white/30 mb-10 max-w-md mx-auto">
            Join thousands of entrepreneurs who are leveraging AI to build wealth and financial freedom.
          </p>
          <a
            href="/courses"
            className="inline-flex px-8 py-4 bg-white text-black font-space font-semibold text-sm hover:shadow-[0_0_40px_rgba(255,255,255,0.2)] transition-all duration-500"
          >
            Explore Courses
          </a>
        </motion.div>
      </section>
    </div>
  );
}