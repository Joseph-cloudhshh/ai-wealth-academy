import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, GripVertical, Play, FileText, Image, ExternalLink, X, Loader2 } from "lucide-react";
import { fetchAllCoursesAdmin } from "../../lib/api/courses";
import { fetchContentByCourse, createContent, deleteContent } from "../../lib/api/content";

const TYPE_OPTIONS = [
  { value: "video", label: "Video", icon: Play },
  { value: "pdf", label: "PDF", icon: FileText },
  { value: "image", label: "Image", icon: Image },
  { value: "link", label: "Link", icon: ExternalLink },
];

export default function AdminContent() {
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [content, setContent] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingContent, setLoadingContent] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newContent, setNewContent] = useState({ title: "", content_type: "video", content_url: "" });

  useEffect(() => {
    fetchAllCoursesAdmin().then((data) => {
      setCourses(data);
      if (data.length > 0) setSelectedCourseId(data[0].id);
      setLoadingCourses(false);
    });
  }, []);

  useEffect(() => {
    if (!selectedCourseId) return;
    setLoadingContent(true);
    fetchContentByCourse(selectedCourseId).then(setContent).finally(() => setLoadingContent(false));
  }, [selectedCourseId]);

  const handleAdd = async () => {
    if (!newContent.title || !selectedCourseId) return;
    setSaving(true);
    const created = await createContent({
      title: newContent.title,
      content_type: newContent.content_type,
      content_url: newContent.content_url,
      course_id: selectedCourseId,
      sort_order: content.length,
    });
    setContent([...content, created]);
    setSaving(false);
    setModalOpen(false);
    setNewContent({ title: "", content_type: "video", content_url: "" });
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this content?")) return;
    await deleteContent(id);
    setContent(content.filter((c) => c.id !== id));
  };

  const selectedCourse = courses.find((c) => c.id === selectedCourseId);

  return (
    <div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8">
        <h1 className="font-sora font-bold text-2xl text-white/90 mb-1">Content Manager</h1>
        <p className="font-space text-sm text-white/30">Manage content per course</p>
      </motion.div>

      {loadingCourses ? (
        <div className="flex justify-center py-10"><Loader2 className="w-5 h-5 animate-spin text-white/30" /></div>
      ) : (
        <>
          <div className="flex items-center gap-3 mb-8 flex-wrap">
            {courses.map((c) => (
              <button key={c.id} onClick={() => setSelectedCourseId(c.id)}
                className={`px-4 py-2 rounded-lg text-xs font-space transition-all ${selectedCourseId === c.id ? "bg-white/[0.08] text-white border border-white/[0.1]" : "text-white/30 hover:text-white/50 bg-white/[0.02] border border-white/[0.04]"}`}
              >
                {c.title}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between mb-6">
            <h2 className="font-sora font-medium text-sm text-white/60">{selectedCourse?.title} — Content</h2>
            <button onClick={() => setModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-white/[0.06] border border-white/[0.08] text-xs font-space text-white/60 rounded-lg hover:bg-white/[0.1] transition-all">
              <Plus className="w-3.5 h-3.5" />
              Add Content
            </button>
          </div>

          {loadingContent ? (
            <div className="flex justify-center py-10"><Loader2 className="w-5 h-5 animate-spin text-white/30" /></div>
          ) : (
            <div className="rounded-xl bg-white/[0.02] border border-white/[0.06] overflow-hidden">
              <div className="divide-y divide-white/[0.03]">
                {content.map((item) => {
                  const typeOpt = TYPE_OPTIONS.find((t) => t.value === item.content_type);
                  const Icon = typeOpt?.icon || FileText;
                  return (
                    <div key={item.id} className="flex items-center gap-3 px-5 py-3 group">
                      <GripVertical className="w-3.5 h-3.5 text-white/10 cursor-grab" />
                      <div className="w-7 h-7 rounded bg-white/[0.04] flex items-center justify-center shrink-0">
                        <Icon className="w-3.5 h-3.5 text-white/30" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-space text-white/50 block truncate">{item.title}</span>
                        {item.content_url && <span className="text-[10px] font-space text-white/15 block truncate">{item.content_url}</span>}
                      </div>
                      <span className="text-[10px] font-space text-white/20 uppercase">{item.content_type}</span>
                      <button onClick={() => handleDelete(item.id)} className="w-7 h-7 rounded bg-white/[0.03] flex items-center justify-center text-white/15 hover:text-red-400/60 opacity-0 group-hover:opacity-100 transition-all">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })}
                {content.length === 0 && <p className="text-center text-white/15 font-space text-xs py-10">No content yet</p>}
              </div>
            </div>
          )}
        </>
      )}

      <AnimatePresence>
        {modalOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setModalOpen(false)} className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="w-full max-w-md p-6 rounded-2xl bg-[#0a0a0a] border border-white/[0.08]">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-sora font-semibold text-white/80">Add Content</h3>
                  <button onClick={() => setModalOpen(false)} className="text-white/30 hover:text-white/60"><X className="w-4 h-4" /></button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-space tracking-wider uppercase text-white/30 mb-1.5">Title</label>
                    <input value={newContent.title} onChange={(e) => setNewContent({ ...newContent, title: e.target.value })} placeholder="Content title"
                      className="w-full px-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-sm font-space text-white/70 placeholder:text-white/15 focus:outline-none focus:border-white/[0.12] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-space tracking-wider uppercase text-white/30 mb-1.5">Type</label>
                    <div className="flex gap-2">
                      {TYPE_OPTIONS.map((opt) => {
                        const Icon = opt.icon;
                        return (
                          <button key={opt.value} onClick={() => setNewContent({ ...newContent, content_type: opt.value })}
                            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-space transition-all ${newContent.content_type === opt.value ? "bg-white/[0.08] text-white border border-white/[0.1]" : "text-white/30 bg-white/[0.02] border border-white/[0.04]"}`}
                          >
                            <Icon className="w-3 h-3" />{opt.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-space tracking-wider uppercase text-white/30 mb-1.5">URL</label>
                    <input value={newContent.content_url} onChange={(e) => setNewContent({ ...newContent, content_url: e.target.value })} placeholder="https://..."
                      className="w-full px-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-sm font-space text-white/70 placeholder:text-white/15 focus:outline-none focus:border-white/[0.12] transition-all"
                    />
                  </div>
                </div>
                <button onClick={handleAdd} disabled={saving || !newContent.title}
                  className="w-full mt-5 py-3 bg-white text-black font-space font-semibold text-sm rounded-lg hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all disabled:opacity-40 flex items-center justify-center gap-2"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Add Content"}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}