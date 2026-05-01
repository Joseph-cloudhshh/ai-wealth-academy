import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Play, FileText, Image, ExternalLink, ArrowUpRight } from "lucide-react";

const CONTENT_ICONS = {
  Videos: Play,
  PDFs: FileText,
  Images: Image,
  Resources: ExternalLink,
  Links: ExternalLink,
};

export default function CourseCard({ course, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <Link to={`/course/${course.slug}`} className="group block">
        <div className="relative overflow-hidden bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] transition-all duration-500 hover:shadow-[0_0_40px_rgba(255,255,255,0.04)]">
          {/* Thumbnail */}
          <div className="relative aspect-[16/10] overflow-hidden">
            <img
              src={course.thumbnail}
              alt={course.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent" />
            <div className="absolute top-4 right-4 w-8 h-8 bg-black/50 backdrop-blur-sm border border-white/[0.1] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <ArrowUpRight className="w-3.5 h-3.5 text-white/70" />
            </div>
          </div>

          {/* Content */}
          <div className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] font-space tracking-wider uppercase text-white/30">
                {course.lessonsCount} Lessons
              </span>
              <span className="w-1 h-1 rounded-full bg-white/20" />
              <div className="flex items-center gap-1.5">
                {course.contentTypes.map((type) => {
                  const Icon = CONTENT_ICONS[type] || FileText;
                  return (
                    <Icon key={type} className="w-3 h-3 text-white/20" />
                  );
                })}
              </div>
            </div>

            <h3 className="font-sora font-semibold text-base text-white/90 mb-2 group-hover:text-white transition-colors">
              {course.title}
            </h3>
            <p className="font-space text-xs text-white/30 leading-relaxed line-clamp-2 mb-4">
              {course.description}
            </p>

            <div className="flex items-center justify-between">
              <span className="text-[10px] font-space tracking-wider uppercase text-white/20">
                Premium Course
              </span>
              <span className="text-xs font-space text-white/50 group-hover:text-white/70 transition-colors">
                View Course →
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}