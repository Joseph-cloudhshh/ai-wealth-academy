import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Zap } from "lucide-react";
import { supabase } from "../lib/supabase";

export default function HeroSection() {
  const [stats, setStats] = useState({ courses: "6+", lessons: "200+", tools: "50+" });

  useEffect(() => {
    async function loadStats() {
      const [{ count: courseCount }, { count: contentCount }] = await Promise.all([
        supabase.from('courses').select('*', { count: 'exact', head: true }).eq('archived', false),
        supabase.from('course_content').select('*', { count: 'exact', head: true }),
      ]);
      if (courseCount != null) {
        setStats({
          courses: courseCount > 0 ? `${courseCount}+` : "0",
          lessons: contentCount > 0 ? `${contentCount}+` : "0",
          tools: "50+",
        });
      }
    }
    loadStats().catch(() => {});
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`, backgroundSize: "60px 60px" }}
        />
        <motion.div animate={{ x: [0, 30, 0], y: [0, -20, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-white/[0.02] blur-[120px]"
        />
        <motion.div animate={{ x: [0, -40, 0], y: [0, 30, 0] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-white/[0.015] blur-[100px]"
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.03),transparent_70%)]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center pt-20">
        <motion.div initial={{ opacity: 0, y: 20, filter: "blur(10px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ duration: 0.8, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.04] border border-white/[0.08] mb-8"
        >
          <Zap className="w-3.5 h-3.5 text-white/60" />
          <span className="text-xs font-space tracking-wider text-white/50 uppercase">Premium AI Education</span>
        </motion.div>

        <motion.h1 initial={{ opacity: 0, y: 30, filter: "blur(10px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ duration: 0.8, delay: 0.4 }}
          className="font-sora font-bold text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[0.95] tracking-tighter mb-8"
        >
          <span className="text-white glow-text">Learn How To</span>
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-white/40">Make Money</span>
          <br />
          <span className="text-white/60">With AI</span>
        </motion.h1>

        <motion.p initial={{ opacity: 0, y: 20, filter: "blur(10px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ duration: 0.8, delay: 0.6 }}
          className="font-space text-base sm:text-lg text-white/35 max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          Master AI tools, automation, content systems, and digital income strategies.
          <br className="hidden sm:block" />
          Join the elite who are building wealth with artificial intelligence.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 20, filter: "blur(10px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link to="/courses" className="group px-8 py-4 bg-white text-black font-space font-semibold text-sm hover:shadow-[0_0_40px_rgba(255,255,255,0.2)] transition-all duration-500 flex items-center gap-2">
            Browse Courses
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link to="/courses" className="px-8 py-4 bg-white/[0.04] border border-white/[0.1] text-white/70 font-space font-medium text-sm hover:bg-white/[0.08] hover:border-white/[0.15] transition-all duration-500">
            Unlock Course
          </Link>
        </motion.div>

        {/* Dynamic Stats */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 1.2 }}
          className="mt-24 grid grid-cols-3 gap-8 max-w-lg mx-auto"
        >
          {[
            { value: stats.courses, label: "Premium Courses" },
            { value: stats.lessons, label: "Lessons" },
            { value: stats.tools, label: "AI Tools Covered" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-sora font-bold text-2xl sm:text-3xl text-white/80 mb-1">{stat.value}</div>
              <div className="font-space text-[10px] sm:text-xs text-white/25 tracking-wider uppercase">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#050505] to-transparent" />
    </section>
  );
}