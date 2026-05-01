import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { fetchCourses } from "../lib/api/courses";
import CourseCard from "../components/CourseCard";

const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "ai-tools", label: "AI Tools" },
  { id: "automation", label: "Automation" },
  { id: "content", label: "Content" },
  { id: "freelancing", label: "Freelancing" },
];

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchCourses().then(setCourses).finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let result = courses;
    if (activeCategory !== "all") {
      result = result.filter((c) => c.category === activeCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.title?.toLowerCase().includes(q) ||
          c.description?.toLowerCase().includes(q)
      );
    }
    return result;
  }, [courses, activeCategory, search]);

  return (
    <div className="min-h-screen bg-[#050505] pt-28 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <span className="text-[10px] font-space tracking-[0.3em] uppercase text-white/30 mb-3 block">
            Course Library
          </span>
          <h1 className="font-sora font-bold text-4xl sm:text-5xl tracking-tight text-white/90">
            All Courses
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10"
        >
          <div className="flex items-center gap-1 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-lg text-xs font-space transition-all duration-300 ${
                  activeCategory === cat.id
                    ? "bg-white/[0.08] text-white border border-white/[0.1]"
                    : "text-white/30 hover:text-white/50 hover:bg-white/[0.03]"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search courses..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-sm font-space text-white/70 placeholder:text-white/20 focus:outline-none focus:border-white/[0.12] transition-all"
            />
          </div>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-32">
            <div className="w-6 h-6 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((course, i) => (
              <CourseCard key={course.id} course={course} index={i} />
            ))}
          </div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-32">
            <p className="font-space text-sm text-white/30">No courses found</p>
            <button
              onClick={() => { setActiveCategory("all"); setSearch(""); }}
              className="mt-4 text-xs font-space text-white/40 hover:text-white/60 transition-colors"
            >
              Clear filters
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}