import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trash2, Mail, MailOpen, Loader2 } from "lucide-react";
import { fetchContactMessages, markMessageRead, deleteMessage } from "../../lib/api/contacts";

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetchContactMessages().then(setMessages).finally(() => setLoading(false));
  }, []);

  const handleSelect = async (msg) => {
    setSelected(msg);
    if (!msg.read) {
      await markMessageRead(msg.id);
      setMessages(messages.map((m) => m.id === msg.id ? { ...m, read: true } : m));
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!confirm("Delete this message?")) return;
    await deleteMessage(id);
    setMessages(messages.filter((m) => m.id !== id));
    if (selected?.id === id) setSelected(null);
  };

  const unread = messages.filter((m) => !m.read).length;

  return (
    <div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8">
        <h1 className="font-sora font-bold text-2xl text-white/90 mb-1">
          Messages {unread > 0 && <span className="text-sm font-space text-white/30 ml-2">({unread} unread)</span>}
        </h1>
        <p className="font-space text-sm text-white/30">Contact form submissions</p>
      </motion.div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-5 h-5 animate-spin text-white/30" /></div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Message list */}
          <div className="space-y-2">
            {messages.length === 0 && <p className="text-white/20 font-space text-sm py-10 text-center">No messages yet</p>}
            {messages.map((msg, i) => (
              <motion.div key={msg.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                onClick={() => handleSelect(msg)}
                className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all group ${selected?.id === msg.id ? "bg-white/[0.06] border-white/[0.12]" : "bg-white/[0.02] border-white/[0.06] hover:border-white/[0.1]"}`}
              >
                <div className="mt-0.5 shrink-0">
                  {msg.read ? <MailOpen className="w-4 h-4 text-white/20" /> : <Mail className="w-4 h-4 text-white/60" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`font-sora font-medium text-sm truncate ${msg.read ? "text-white/50" : "text-white/80"}`}>{msg.name}</span>
                    <span className="text-[10px] font-space text-white/20 shrink-0">
                      {new Date(msg.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-[11px] font-space text-white/30 truncate">{msg.email}</p>
                  <p className="text-xs font-space text-white/25 line-clamp-1 mt-0.5">{msg.message}</p>
                </div>
                <button onClick={(e) => handleDelete(msg.id, e)} className="w-6 h-6 rounded flex items-center justify-center text-white/15 hover:text-red-400/60 opacity-0 group-hover:opacity-100 transition-all shrink-0">
                  <Trash2 className="w-3 h-3" />
                </button>
              </motion.div>
            ))}
          </div>

          {/* Message detail */}
          <div className="rounded-xl bg-white/[0.02] border border-white/[0.06] p-6 min-h-[200px]">
            {selected ? (
              <div>
                <div className="mb-4 pb-4 border-b border-white/[0.06]">
                  <h3 className="font-sora font-semibold text-white/80 mb-1">{selected.name}</h3>
                  <a href={`mailto:${selected.email}`} className="text-xs font-space text-white/40 hover:text-white/60 transition-colors">{selected.email}</a>
                  <p className="text-[10px] font-space text-white/20 mt-1">{new Date(selected.created_at).toLocaleString()}</p>
                </div>
                <p className="font-space text-sm text-white/50 leading-relaxed whitespace-pre-wrap">{selected.message}</p>
                <a href={`mailto:${selected.email}?subject=Re: Your message`}
                  className="inline-flex items-center gap-2 mt-6 px-4 py-2 rounded-lg bg-white/[0.06] border border-white/[0.08] text-xs font-space text-white/60 hover:bg-white/[0.1] transition-all"
                >
                  <Mail className="w-3.5 h-3.5" />
                  Reply via Email
                </a>
              </div>
            ) : (
              <div className="flex items-center justify-center h-40">
                <p className="text-white/15 font-space text-sm">Select a message to read</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}