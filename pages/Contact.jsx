import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Mail, MessageSquare, Loader2, CheckCircle } from "lucide-react";
import { submitContactMessage, fetchContactInfo } from "../lib/api/contacts";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [contactInfo, setContactInfo] = useState(null);

  useEffect(() => {
    fetchContactInfo().then(setContactInfo).catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    await submitContactMessage(form);
    setSent(true);
    setSending(false);
    setForm({ name: "", email: "", message: "" });
    setTimeout(() => setSent(false), 4000);
  };

  const inputClass = "w-full px-4 py-3 rounded-lg bg-white/[0.03] border border-white/[0.06] text-sm font-space text-white/70 placeholder:text-white/15 focus:outline-none focus:border-white/[0.12] transition-all";

  const socials = contactInfo ? [
    contactInfo.email && { label: "Email", value: contactInfo.email, href: `mailto:${contactInfo.email}` },
    contactInfo.whatsapp && { label: "WhatsApp", value: contactInfo.whatsapp, href: contactInfo.whatsapp },
    contactInfo.telegram && { label: "Telegram", value: contactInfo.telegram, href: contactInfo.telegram },
    contactInfo.discord && { label: "Discord", value: contactInfo.discord, href: contactInfo.discord },
    contactInfo.instagram && { label: "Instagram", value: contactInfo.instagram, href: contactInfo.instagram },
    contactInfo.tiktok && { label: "TikTok", value: contactInfo.tiktok, href: contactInfo.tiktok },
  ].filter(Boolean) : [];

  return (
    <div className="min-h-screen bg-[#050505] pt-28 pb-20 px-6">
      <div className="max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-16">
          <span className="text-[10px] font-space tracking-[0.3em] uppercase text-white/30 mb-3 block">Get in Touch</span>
          <h1 className="font-sora font-bold text-4xl sm:text-5xl tracking-tight text-white/90">Contact Us</h1>
        </motion.div>

        {socials.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
            {socials.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.1] hover:bg-white/[0.04] transition-all"
              >
                <h3 className="font-sora font-medium text-xs text-white/60 mb-1">{s.label}</h3>
                <p className="font-space text-xs text-white/30 truncate">{s.value}</p>
              </a>
            ))}
          </div>
        )}

        {socials.length === 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
            <div className="p-6 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <Mail className="w-5 h-5 text-white/40 mb-3" />
              <h3 className="font-sora font-medium text-sm text-white/70 mb-1">Email</h3>
              <p className="font-space text-xs text-white/30">support@aiwealthacademy.com</p>
            </div>
            <div className="p-6 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <MessageSquare className="w-5 h-5 text-white/40 mb-3" />
              <h3 className="font-sora font-medium text-sm text-white/70 mb-1">Response Time</h3>
              <p className="font-space text-xs text-white/30">Within 24 hours</p>
            </div>
          </div>
        )}

        <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
          onSubmit={handleSubmit} className="space-y-4 p-6 sm:p-8 rounded-2xl bg-white/[0.02] border border-white/[0.06]"
        >
          <div>
            <label className="block text-[10px] font-space tracking-wider uppercase text-white/30 mb-2">Name</label>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} placeholder="Your name" required />
          </div>
          <div>
            <label className="block text-[10px] font-space tracking-wider uppercase text-white/30 mb-2">Email</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputClass} placeholder="your@email.com" required />
          </div>
          <div>
            <label className="block text-[10px] font-space tracking-wider uppercase text-white/30 mb-2">Message</label>
            <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={5} className={`${inputClass} resize-none`} placeholder="How can we help?" required />
          </div>

          <button type="submit" disabled={sending || sent}
            className="w-full py-3.5 bg-white text-black font-space font-semibold text-sm rounded-lg hover:shadow-[0_0_30px_rgba(255,255,255,0.15)] transition-all duration-500 flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {sent ? <><CheckCircle className="w-4 h-4" />Message Sent!</> : sending ? <><Loader2 className="w-4 h-4 animate-spin" />Sending...</> : <><Send className="w-4 h-4" />Send Message</>}
          </button>
        </motion.form>
      </div>
    </div>
  );
}