import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, X, Copy, CheckCircle, Loader2 } from "lucide-react";
import { fetchAllTokens, createToken, updateToken, deleteToken } from "../../lib/api/tokens";
import { fetchAllCoursesAdmin } from "../../lib/api/courses";

export default function AdminTokens() {
  const [tokens, setTokens] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingToken, setEditingToken] = useState(null);
  const [form, setForm] = useState({ token: "", course_id: "", active: true, usage_limit: 1 });
  const [copied, setCopied] = useState(null);

  useEffect(() => {
    Promise.all([fetchAllTokens(), fetchAllCoursesAdmin()]).then(([t, c]) => {
      setTokens(t);
      setCourses(c);
      setLoading(false);
    });
  }, []);

  const openAdd = () => {
    setEditingToken(null);
    setForm({ token: "", course_id: courses[0]?.id || "", active: true, usage_limit: 1 });
    setModalOpen(true);
  };

  const openEdit = (token) => {
    setEditingToken(token);
    setForm({ token: token.token, course_id: token.course_id, active: token.active, usage_limit: token.usage_limit });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.token || !form.course_id) return;
    setSaving(true);
    if (editingToken) {
      const updated = await updateToken(editingToken.id, form);
      setTokens(tokens.map((t) => t.id === editingToken.id ? { ...t, ...updated } : t));
    } else {
      const created = await createToken(form);
      // Re-fetch to get course join
      const all = await fetchAllTokens();
      setTokens(all);
    }
    setSaving(false);
    setModalOpen(false);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this token?")) return;
    await deleteToken(id);
    setTokens(tokens.filter((t) => t.id !== id));
  };

  const handleToggle = async (token) => {
    const updated = await updateToken(token.id, { active: !token.active });
    setTokens(tokens.map((t) => t.id === token.id ? { ...t, active: updated.active } : t));
  };

  const copyToken = (val) => {
    navigator.clipboard.writeText(val);
    setCopied(val);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h1 className="font-sora font-bold text-2xl text-white/90 mb-1">Tokens</h1>
          <p className="font-space text-sm text-white/30">Manage purchase tokens</p>
        </motion.div>
        <button onClick={openAdd} className="flex items-center gap-2 px-5 py-2.5 bg-white text-black font-space font-medium text-xs rounded-lg hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all">
          <Plus className="w-3.5 h-3.5" />
          Create Token
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-5 h-5 animate-spin text-white/30" /></div>
      ) : (
        <div className="rounded-xl bg-white/[0.02] border border-white/[0.06] overflow-hidden">
          <div className="hidden md:grid grid-cols-5 gap-4 px-5 py-3 border-b border-white/[0.06] text-[10px] font-space tracking-wider uppercase text-white/25">
            <span>Token</span><span>Course</span><span>Status</span><span>Uses</span><span className="text-right">Actions</span>
          </div>
          <div className="divide-y divide-white/[0.04]">
            {tokens.map((token, i) => (
              <motion.div key={token.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                className="grid grid-cols-1 md:grid-cols-5 gap-2 md:gap-4 px-5 py-4 items-center group"
              >
                <div className="flex items-center gap-2">
                  <code className="text-xs font-space text-white/60 bg-white/[0.03] px-2 py-1 rounded">{token.token}</code>
                  <button onClick={() => copyToken(token.token)} className="w-6 h-6 rounded flex items-center justify-center text-white/20 hover:text-white/50 transition-colors">
                    {copied === token.token ? <CheckCircle className="w-3 h-3 text-green-400/70" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
                <span className="text-xs font-space text-white/40">{token.courses?.title || "—"}</span>
                <div>
                  <button onClick={() => handleToggle(token)}
                    className={`px-2.5 py-1 rounded text-[10px] font-space transition-colors ${token.active ? "bg-green-500/10 text-green-400/60 border border-green-500/20" : "bg-white/[0.03] text-white/25 border border-white/[0.06]"}`}
                  >
                    {token.active ? "active" : "disabled"}
                  </button>
                </div>
                <span className="text-xs font-space text-white/30">{token.usage_count}/{token.usage_limit}</span>
                <div className="flex items-center gap-1 md:justify-end">
                  <button onClick={() => openEdit(token)} className="w-7 h-7 rounded-lg bg-white/[0.03] flex items-center justify-center text-white/25 hover:text-white/60 transition-colors">
                    <Pencil className="w-3 h-3" />
                  </button>
                  <button onClick={() => handleDelete(token.id)} className="w-7 h-7 rounded-lg bg-white/[0.03] flex items-center justify-center text-white/25 hover:text-red-400/60 transition-colors">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </motion.div>
            ))}
            {tokens.length === 0 && <p className="text-center text-white/15 font-space text-xs py-10">No tokens yet</p>}
          </div>
        </div>
      )}

      <AnimatePresence>
        {modalOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setModalOpen(false)} className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="w-full max-w-md p-6 rounded-2xl bg-[#0a0a0a] border border-white/[0.08]">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-sora font-semibold text-white/80">{editingToken ? "Edit Token" : "Create Token"}</h3>
                  <button onClick={() => setModalOpen(false)} className="text-white/30 hover:text-white/60"><X className="w-4 h-4" /></button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-space tracking-wider uppercase text-white/30 mb-1.5">Token</label>
                    <input value={form.token} onChange={(e) => setForm({ ...form, token: e.target.value.toUpperCase() })} placeholder="UNIQUE-TOKEN-CODE"
                      className="w-full px-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-sm font-space text-white/70 placeholder:text-white/15 focus:outline-none focus:border-white/[0.12] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-space tracking-wider uppercase text-white/30 mb-1.5">Course</label>
                    <select value={form.course_id} onChange={(e) => setForm({ ...form, course_id: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-lg bg-[#0a0a0a] border border-white/[0.06] text-sm font-space text-white/70 focus:outline-none focus:border-white/[0.12] transition-all"
                    >
                      {courses.map((c) => <option key={c.id} value={c.id} className="bg-[#0a0a0a]">{c.title}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-space tracking-wider uppercase text-white/30 mb-1.5">Usage Limit</label>
                    <input type="number" min={1} value={form.usage_limit} onChange={(e) => setForm({ ...form, usage_limit: parseInt(e.target.value) || 1 })}
                      className="w-full px-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-sm font-space text-white/70 focus:outline-none focus:border-white/[0.12] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-space tracking-wider uppercase text-white/30 mb-1.5">Status</label>
                    <div className="flex gap-2">
                      {[{ label: "Active", val: true }, { label: "Disabled", val: false }].map((s) => (
                        <button key={String(s.val)} onClick={() => setForm({ ...form, active: s.val })}
                          className={`px-4 py-2 rounded-lg text-xs font-space transition-all ${form.active === s.val ? "bg-white/[0.08] text-white border border-white/[0.1]" : "text-white/30 bg-white/[0.02] border border-white/[0.04]"}`}
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <button onClick={handleSave} disabled={saving || !form.token || !form.course_id}
                  className="w-full mt-5 py-3 bg-white text-black font-space font-semibold text-sm rounded-lg hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all disabled:opacity-40 flex items-center justify-center gap-2"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : (editingToken ? "Save Changes" : "Create Token")}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}