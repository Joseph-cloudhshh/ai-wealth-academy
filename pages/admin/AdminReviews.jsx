import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, X, Loader2, Star } from "lucide-react";
import { fetchAllReviewsAdmin, createReview, updateReview, deleteReview } from "../../lib/api/reviews";

const emptyForm = { name: "", role: "", avatar: "", rating: 5, text: "", course_name: "", active: true };

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    fetchAllReviewsAdmin().then(setReviews).finally(() => setLoading(false));
  }, []);

  const openAdd = () => { setEditing(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (r) => {
    setEditing(r);
    setForm({ name: r.name, role: r.role || "", avatar: r.avatar || "", rating: r.rating, text: r.text, course_name: r.course_name || "", active: r.active });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.text) return;
    setSaving(true);
    if (editing) {
      const updated = await updateReview(editing.id, form);
      setReviews(reviews.map((r) => r.id === editing.id ? updated : r));
    } else {
      const created = await createReview(form);
      setReviews([created, ...reviews]);
    }
    setSaving(false);
    setModalOpen(false);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this review?")) return;
    await deleteReview(id);
    setReviews(reviews.filter((r) => r.id !== id));
  };

  const handleToggle = async (r) => {
    const updated = await updateReview(r.id, { active: !r.active });
    setReviews(reviews.map((x) => x.id === r.id ? { ...x, active: updated.active } : x));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h1 className="font-sora font-bold text-2xl text-white/90 mb-1">Reviews</h1>
          <p className="font-space text-sm text-white/30">Manage student testimonials</p>
        </motion.div>
        <button onClick={openAdd} className="flex items-center gap-2 px-5 py-2.5 bg-white text-black font-space font-medium text-xs rounded-lg hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all">
          <Plus className="w-3.5 h-3.5" />
          Add Review
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-5 h-5 animate-spin text-white/30" /></div>
      ) : (
        <div className="space-y-3">
          {reviews.map((r, i) => (
            <motion.div key={r.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.1] transition-all group"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-sora font-medium text-sm text-white/70">{r.name}</span>
                  {r.role && <span className="text-[10px] font-space text-white/25">· {r.role}</span>}
                  <div className="flex gap-0.5 ml-1">
                    {Array.from({ length: r.rating }).map((_, i) => <Star key={i} className="w-2.5 h-2.5 fill-white/40 text-white/40" />)}
                  </div>
                </div>
                <p className="text-xs font-space text-white/40 line-clamp-2">"{r.text}"</p>
                {r.course_name && <span className="text-[10px] font-space text-white/20 mt-1 block">{r.course_name}</span>}
              </div>
              <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                <button onClick={() => handleToggle(r)}
                  className={`px-2.5 py-1 rounded text-[10px] font-space transition-colors ${r.active ? "bg-green-500/10 text-green-400/60 border border-green-500/20" : "bg-white/[0.03] text-white/25 border border-white/[0.06]"}`}
                >
                  {r.active ? "visible" : "hidden"}
                </button>
                <button onClick={() => openEdit(r)} className="w-7 h-7 rounded-lg bg-white/[0.04] flex items-center justify-center text-white/30 hover:text-white/60 transition-colors">
                  <Pencil className="w-3 h-3" />
                </button>
                <button onClick={() => handleDelete(r.id)} className="w-7 h-7 rounded-lg bg-white/[0.04] flex items-center justify-center text-white/30 hover:text-red-400/70 transition-colors">
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </motion.div>
          ))}
          {reviews.length === 0 && <p className="text-center text-white/20 font-space text-sm py-20">No reviews yet. Add one!</p>}
        </div>
      )}

      <AnimatePresence>
        {modalOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setModalOpen(false)} className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="w-full max-w-md p-6 rounded-2xl bg-[#0a0a0a] border border-white/[0.08] max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-sora font-semibold text-white/80">{editing ? "Edit Review" : "Add Review"}</h3>
                  <button onClick={() => setModalOpen(false)} className="text-white/30 hover:text-white/60"><X className="w-4 h-4" /></button>
                </div>
                <div className="space-y-3">
                  {[
                    { key: "name", label: "Name", placeholder: "John D." },
                    { key: "role", label: "Role", placeholder: "Digital Entrepreneur" },
                    { key: "avatar", label: "Avatar URL", placeholder: "https://..." },
                    { key: "course_name", label: "Course Name", placeholder: "AI Automation Mastery" },
                  ].map((f) => (
                    <div key={f.key}>
                      <label className="block text-[10px] font-space tracking-wider uppercase text-white/30 mb-1.5">{f.label}</label>
                      <input type="text" value={form[f.key]} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} placeholder={f.placeholder}
                        className="w-full px-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-sm font-space text-white/70 placeholder:text-white/15 focus:outline-none focus:border-white/[0.12] transition-all"
                      />
                    </div>
                  ))}
                  <div>
                    <label className="block text-[10px] font-space tracking-wider uppercase text-white/30 mb-1.5">Rating (1-5)</label>
                    <div className="flex gap-2">
                      {[1,2,3,4,5].map((n) => (
                        <button key={n} onClick={() => setForm({ ...form, rating: n })}
                          className={`w-9 h-9 rounded-lg text-xs font-space transition-all border ${form.rating >= n ? "bg-white/[0.08] text-white border-white/[0.1]" : "text-white/30 bg-white/[0.02] border-white/[0.04]"}`}
                        >{n}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-space tracking-wider uppercase text-white/30 mb-1.5">Review Text</label>
                    <textarea value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} rows={4} placeholder="Student review..."
                      className="w-full px-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-sm font-space text-white/70 placeholder:text-white/15 focus:outline-none focus:border-white/[0.12] transition-all resize-none"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <input type="checkbox" id="active-r" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} className="w-4 h-4" />
                    <label htmlFor="active-r" className="text-xs font-space text-white/40">Show on website</label>
                  </div>
                </div>
                <button onClick={handleSave} disabled={saving || !form.name || !form.text}
                  className="w-full mt-5 py-3 bg-white text-black font-space font-semibold text-sm rounded-lg hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all disabled:opacity-40 flex items-center justify-center gap-2"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : (editing ? "Save Changes" : "Add Review")}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}