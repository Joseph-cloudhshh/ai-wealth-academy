import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { COURSES } from "../lib/mockData";
import CourseCard from "./CourseCard";

export default function FeaturedCourses() {
  return (
    <section className="relative py-32 px-6">
      {/* Section glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-16 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-[10px] font-space tracking-[0.3em] uppercase text-white/30 mb-3 block">
              Featured Courses
            </span>
            <h2 className="font-sora font-bold text-3xl sm:text-4xl tracking-tight text-white/90">
              Premium AI Education
            </h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link
              to="/courses"
              className="group flex items-center gap-2 text-sm font-space text-white/40 hover:text-white/70 transition-colors"
            >
              View All Courses
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {COURSES.map((course, i) => (
            <CourseCard key={course.id} course={course} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}