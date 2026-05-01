import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BookOpen, Key, FileText, Loader2 } from "lucide-react";
import { fetchAllCoursesAdmin } from "../../lib/api/courses";
import { fetchAllTokens } from "../../lib/api/tokens";
import { supabase } from "../../lib/supabase";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      const [courses, tokens, contentResult] = await Promise.all([
        fetchAllCoursesAdmin(),
        fetchAllTokens(),
        supabase.from('course_content').select('*', { count: 'exact', head: true }),
      ]);
      setStats({
        totalCourses: courses.length,
        totalTokens: tokens.length,
        activeTokens: tokens.filter((t) => t.active).length,
        activeContent: contentResult.count || 0,
      });
      setLoading(false);
    }
    loadStats();
  }, []);

  const STAT_ITEMS = stats ? [
    { label: "Total Courses", value: stats.totalCourses, icon: BookOpen },
    { label: "Total Tokens", value: stats.totalTokens, icon: Key },
    { label: "Active Tokens", value: stats.activeTokens, icon: Key },
    { label: "Content Items", value: stats.activeContent, icon: FileText },
  ] : [];

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="font-sora font-bold text-2xl text-white/90 mb-2">Dashboard</h1>
        <p className="font-space text-sm text-white/30 mb-8">Overview of your platform</p>
      </motion.div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-5 h-5 animate-spin text-white/30" /></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {STAT_ITEMS.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.08 }}
                className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.1] hover:shadow-[0_0_30px_rgba(255,255,255,0.03)] transition-all duration-300 group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-9 h-9 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center group-hover:bg-white/[0.06] transition-all">
                    <Icon className="w-4 h-4 text-white/40" />
                  </div>
                </div>
                <div className="font-sora font-bold text-3xl text-white/80 mb-1">{stat.value}</div>
                <div className="font-space text-[10px] tracking-wider uppercase text-white/25">{stat.label}</div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}