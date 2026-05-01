import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, X, Loader2 } from "lucide-react";
import { fetchAllCoursesAdmin, createCourse, updateCourse, deleteCourse } from "../../lib/api/courses";

const emptyForm = { title: "", description: "", thumbnail: "", slug: "", coach_name: "", price: "" };

export default function AdminCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    fetchAllCoursesAdmin().then(setCourses).finally(() => setLoading(false));
  }, []);

  const openAdd = () => { setEditingCourse(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (course) => {
    setEditingCourse(course);
    setForm({ title: course.title, description: course.description || "", thumbnail: course.thumbnail || "", slug: course.slug, coach_name: course.coach_name || "", price: course.price || "" });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.slug) return;
    setSaving(true);
    if (editingCourse) {
      const updated = await updateCourse(editingCourse.id, form);
      setCourses(courses.map((c) => c.id === editingCourse.id ? updated : c));
    } else {
      const created = await createCourse(form);
      setCourses([created, ...courses]);
    }
    setSaving(false);
    setModalOpen(false);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this course?")) return;
    await deleteCourse(id);
    setCourses(courses.filter((c) => c.id !== id));
  };

  const FIELDS = [
    { key: "title", label: "Title", placeholder: "Course title" },
    { key: "slug", label: "Slug", placeholder: "course-slug" },
    { key: "coach_name", label: "Coach Name", placeholder: "Coach name" },
    { key: "price", label: "Price", placeholder: "$97" },
    { key: "thumbnail", label: "Thumbnail URL", placeholder: "https://..." },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h1 className="font-sora font-bold text-2xl text-white/90 mb-1">Courses</h1>
          <p className="font-space text-sm text-white/30">Manage your course library</p>
        </motion.div>
        <button onClick={openAdd} className="flex items-center gap-2 px-5 py-2.5 bg-white text-black font-space font-medium text-xs rounded-lg hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all">
          <Plus className="w-3.5 h-3.5" />
          Add Course
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-5 h-5 animate-spin text-white/30" /></div>
      ) : (
        <div className="space-y-3">
          {courses.map((course, i) => (
            <motion.div key={course.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.1] transition-all group"
            >
              <div className="w-16 h-12 rounded-lg overflow-hidden shrink-0 bg-white/[0.04]">
                {course.thumbnail && <img src={course.thumbnail} alt="" className="w-full h-full object-cover" />}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-sora font-medium text-sm text-white/70 truncate">{course.title}</h3>
                <p className="font-space text-[10px] text-white/25 truncate">{course.slug}{course.coach_name ? ` · ${course.coach_name}` : ""}</p>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openEdit(course)} className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-white/30 hover:text-white/60 transition-colors">
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => handleDelete(course.id)} className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-white/30 hover:text-red-400/70 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          ))}
          {courses.length === 0 && <p className="text-center text-white/20 font-space text-sm py-20">No courses yet. Add one!</p>}
        </div>
      )}

      <AnimatePresence>
        {modalOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setModalOpen(false)} className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="w-full max-w-md p-6 rounded-2xl bg-[#0a0a0a] border border-white/[0.08] max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-sora font-semibold text-white/80">{editingCourse ? "Edit Course" : "Add Course"}</h3>
                  <button onClick={() => setModalOpen(false)} className="text-white/30 hover:text-white/60"><X className="w-4 h-4" /></button>
                </div>
                <div className="space-y-3">
                  {FIELDS.map((field) => (
                    <div key={field.key}>
                      <label className="block text-[10px] font-space tracking-wider uppercase text-white/30 mb-1.5">{field.label}</label>
                      <input type="text" value={form[field.key]} onChange={(e) => setForm({ ...form, [field.key]: e.target.value })} placeholder={field.placeholder}
                        className="w-full px-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-sm font-space text-white/70 placeholder:text-white/15 focus:outline-none focus:border-white/[0.12] transition-all"
                      />
                    </div>
                  ))}
                  <div>
                    <label className="block text-[10px] font-space tracking-wider uppercase text-white/30 mb-1.5">Description</label>
                    <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} placeholder="Course description..."
                      className="w-full px-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-sm font-space text-white/70 placeholder:text-white/15 focus:outline-none focus:border-white/[0.12] transition-all resize-none"
                    />
                  </div>
                </div>
                <button onClick={handleSave} disabled={saving || !form.title || !form.slug}
                  className="w-full mt-5 py-3 bg-white text-black font-space font-semibold text-sm rounded-lg hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all disabled:opacity-40 flex items-center justify-center gap-2"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : (editingCourse ? "Save Changes" : "Create Course")}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}