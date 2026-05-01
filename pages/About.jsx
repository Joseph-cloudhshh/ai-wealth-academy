import { motion } from "framer-motion";
import { Target, Users, Award, Lightbulb } from "lucide-react";

const VALUES = [
  { icon: Target, title: "Mission-Driven", desc: "Empowering entrepreneurs with cutting-edge AI knowledge to build sustainable digital income." },
  { icon: Users, title: "Community First", desc: "A growing network of forward-thinking creators and builders shaping the future of work." },
  { icon: Award, title: "Premium Quality", desc: "Every course is meticulously crafted with real-world strategies and actionable frameworks." },
  { icon: Lightbulb, title: "Innovation-Led", desc: "Constantly updated content that reflects the latest breakthroughs in artificial intelligence." },
];

export default function About() {
  return (
    <div className="min-h-screen bg-[#050505] pt-28 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <span className="text-[10px] font-space tracking-[0.3em] uppercase text-white/30 mb-3 block">
            About Us
          </span>
          <h1 className="font-sora font-bold text-4xl sm:text-5xl tracking-tight text-white/90 mb-6">
            Building the Future
            <br />
            <span className="text-white/50">of AI Education</span>
          </h1>
          <p className="font-space text-sm text-white/35 leading-relaxed max-w-2xl">
            AI Wealth Academy is a premium education platform designed for ambitious individuals 
            who want to leverage artificial intelligence to create real, sustainable income streams. 
            We believe the future belongs to those who master AI today.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-20">
          {VALUES.map((val, i) => {
            const Icon = val.icon;
            return (
              <motion.div
                key={val.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="p-6 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.1] transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mb-4">
                  <Icon className="w-4 h-4 text-white/50" />
                </div>
                <h3 className="font-sora font-semibold text-sm text-white/70 mb-2">{val.title}</h3>
                <p className="font-space text-xs text-white/30 leading-relaxed">{val.desc}</p>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center p-12 rounded-2xl bg-white/[0.02] border border-white/[0.06]"
        >
          <h2 className="font-sora font-bold text-2xl text-white/80 mb-4">
            Ready to Start?
          </h2>
          <p className="font-space text-sm text-white/30 mb-8 max-w-md mx-auto">
            Join the next generation of AI-powered entrepreneurs.
          </p>
          <a
            href="/courses"
            className="inline-flex px-8 py-4 bg-white text-black font-space font-semibold text-sm rounded-lg hover:shadow-[0_0_40px_rgba(255,255,255,0.2)] transition-all duration-500"
          >
            Explore Courses
          </a>
        </motion.div>
      </div>
    </div>
  );
}