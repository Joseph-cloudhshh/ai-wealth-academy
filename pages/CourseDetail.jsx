import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Play, FileText, Image, ExternalLink, Lock, CheckCircle, Clock, ArrowLeft, Loader2 } from "lucide-react";
import { fetchCourseBySlug } from "../lib/api/courses";
import { fetchContentByCourse, contentToModules } from "../lib/api/content";
import UnlockModal from "../components/UnlockModal";

const TYPE_ICONS = { video: Play, pdf: FileText, image: Image, link: ExternalLink };

export default function CourseDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [unlockOpen, setUnlockOpen] = useState(false);
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const c = await fetchCourseBySlug(slug);
      if (!c) { setLoading(false); return; }
      setCourse(c);
      const content = await fetchContentByCourse(c.id);
      setModules(contentToModules(content));
      setLoading(false);
    }
    load();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-white/30" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <p className="text-white/30 font-space">Course not found</p>
      </div>
    );
  }

  const totalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0);

  return (
    <div className="min-h-screen bg-[#050505] pt-28 pb-20 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate("/courses")}
          className="flex items-center gap-2 text-xs font-space text-white/30 hover:text-white/60 mb-10 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Courses
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-20">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="relative rounded-xl overflow-hidden aspect-[16/10] mb-6">
              {course.thumbnail && (
                <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/60 to-transparent" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="flex flex-col justify-center"
          >
            <span className="text-[10px] font-space tracking-[0.3em] uppercase text-white/30 mb-3">
              Premium Course
            </span>
            <h1 className="font-sora font-bold text-3xl sm:text-4xl tracking-tight text-white/90 mb-4">
              {course.title}
            </h1>
            {course.coach_name && (
              <p className="font-space text-xs text-white/25 mb-2">By {course.coach_name}</p>
            )}
            <p className="font-space text-sm text-white/35 leading-relaxed mb-6">
              {course.description}
            </p>

            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center gap-1.5 text-xs text-white/30 font-space">
                <Clock className="w-3.5 h-3.5" />
                {totalLessons} Lessons
              </div>
              {course.price && (
                <span className="px-2 py-1 rounded text-[10px] font-space bg-white/[0.04] border border-white/[0.06] text-white/40">
                  {course.price}
                </span>
              )}
            </div>

            <button
              onClick={() => setUnlockOpen(true)}
              className="w-full sm:w-auto px-8 py-4 bg-white text-black font-space font-semibold text-sm rounded-lg hover:shadow-[0_0_40px_rgba(255,255,255,0.2)] transition-all duration-500 flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              Unlock Course
            </button>
          </motion.div>
        </div>

        {/* Course Content (locked preview) */}
        {modules.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-sora font-semibold text-xl text-white/80 mb-6">Course Content</h2>
            <div className="space-y-3">
              {modules.map((module, mi) => (
                <div key={module.id} className="rounded-xl bg-white/[0.02] border border-white/[0.06] overflow-hidden">
                  <div className="px-5 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-[10px] font-space text-white/40">
                        {mi + 1}
                      </span>
                      <h3 className="font-sora font-medium text-sm text-white/70">{module.title}</h3>
                    </div>
                    <span className="text-[10px] font-space text-white/25">{module.lessons.length} lessons</span>
                  </div>
                  <div className="border-t border-white/[0.04]">
                    {module.lessons.map((lesson) => {
                      const Icon = TYPE_ICONS[lesson.type] || FileText;
                      return (
                        <div key={lesson.id} className="px-5 py-3 flex items-center justify-between border-b border-white/[0.03] last:border-0">
                          <div className="flex items-center gap-3">
                            <Icon className="w-3.5 h-3.5 text-white/20" />
                            <span className="text-xs font-space text-white/40">{lesson.title}</span>
                          </div>
                          <Lock className="w-3 h-3 text-white/15" />
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      <UnlockModal
        isOpen={unlockOpen}
        onClose={() => setUnlockOpen(false)}
        courseSlug={slug}
        onSuccess={() => {
          setUnlockOpen(false);
          navigate(`/course/${slug}/content`);
        }}
      />
    </div>
  );
}