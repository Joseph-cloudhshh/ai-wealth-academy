import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Play, FileText, Image, ExternalLink, ArrowLeft, ChevronRight, Loader2, Lock } from "lucide-react";
import { fetchCourseBySlug } from "../lib/api/courses";
import { fetchContentByCourse, contentToModules } from "../lib/api/content";
import { hasCourseAccess } from "../lib/api/tokens";
import VideoPlayer from "../components/VideoPlayer";
import { PdfViewer, ImageViewer, LinkEmbed } from "../components/ContentViewers";

const TYPE_ICONS = { video: Play, pdf: FileText, image: Image, link: ExternalLink };

export default function CourseContent() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [activeModule, setActiveModule] = useState(0);
  const [activeLesson, setActiveLesson] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    async function load() {
      const access = hasCourseAccess(slug);
      setHasAccess(access);
      if (!access) { setLoading(false); return; }

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

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center gap-4">
        <Lock className="w-8 h-8 text-white/20" />
        <p className="text-white/30 font-space text-sm">Access required. Please unlock this course first.</p>
        <button
          onClick={() => navigate(`/course/${slug}`)}
          className="text-xs font-space text-white/50 hover:text-white/70 underline transition-colors"
        >
          Go to course page
        </button>
      </div>
    );
  }

  const currentModule = modules[activeModule];
  const currentLesson = currentModule?.lessons[activeLesson];

  const renderContent = (lesson) => {
    if (!lesson) return null;
    switch (lesson.type) {
      case "video": return <VideoPlayer url={lesson.url} title={lesson.title} />;
      case "pdf": return <PdfViewer url={lesson.url} title={lesson.title} />;
      case "image": return <ImageViewer url={lesson.url} title={lesson.title} />;
      case "link": return <LinkEmbed url={lesson.url} title={lesson.title} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col md:flex-row pt-0">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? "w-full md:w-80" : "w-0"} shrink-0 border-r border-white/[0.06] bg-[#080808] transition-all duration-300 overflow-hidden md:min-h-screen`}>
        <div className="p-5 border-b border-white/[0.06]">
          <button
            onClick={() => navigate(`/course/${slug}`)}
            className="flex items-center gap-2 text-xs font-space text-white/30 hover:text-white/60 mb-4 transition-colors"
          >
            <ArrowLeft className="w-3 h-3" />
            Back to Course
          </button>
          <h2 className="font-sora font-semibold text-sm text-white/80 line-clamp-1">{course?.title}</h2>
        </div>

        <div className="p-3 space-y-1 max-h-[calc(100vh-120px)] overflow-y-auto">
          {modules.map((module, mi) => (
            <div key={module.id}>
              <button
                onClick={() => { setActiveModule(mi); setActiveLesson(0); }}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-space transition-all ${activeModule === mi ? "bg-white/[0.06] text-white/80" : "text-white/30 hover:text-white/50 hover:bg-white/[0.02]"}`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded bg-white/[0.04] flex items-center justify-center text-[9px] text-white/30 shrink-0">{mi + 1}</span>
                  <span className="line-clamp-1">{module.title}</span>
                </div>
              </button>

              {activeModule === mi && (
                <div className="ml-5 mt-1 space-y-0.5">
                  {module.lessons.map((lesson, li) => {
                    const Icon = TYPE_ICONS[lesson.type] || FileText;
                    return (
                      <button
                        key={lesson.id}
                        onClick={() => setActiveLesson(li)}
                        className={`w-full text-left flex items-center gap-2 px-3 py-2 rounded text-[11px] font-space transition-all ${activeLesson === li ? "text-white bg-white/[0.04]" : "text-white/25 hover:text-white/45"}`}
                      >
                        <Icon className="w-3 h-3 shrink-0" />
                        <span className="line-clamp-1">{lesson.title}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </aside>

      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="md:hidden fixed bottom-4 left-4 z-50 w-10 h-10 rounded-lg bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-white/50"
      >
        <ChevronRight className={`w-4 h-4 transition-transform ${sidebarOpen ? "rotate-180" : ""}`} />
      </button>

      <main className="flex-1 p-6 md:p-10 md:max-h-screen md:overflow-y-auto">
        {currentLesson && (
          <motion.div key={currentLesson.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <h2 className="font-sora font-semibold text-lg text-white/80 mb-6">{currentLesson.title}</h2>
            {renderContent(currentLesson)}
          </motion.div>
        )}
        {!currentLesson && (
          <div className="flex items-center justify-center h-full min-h-[40vh]">
            <p className="text-white/20 font-space text-sm">Select a lesson from the sidebar</p>
          </div>
        )}
      </main>
    </div>
  );
}