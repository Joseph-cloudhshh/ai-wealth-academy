import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Shield, CheckCircle, Loader2, Link } from "lucide-react";
import { changeAdminPin } from "../../lib/auth";
import { supabase } from "../../lib/supabase";

const CONTACT_FIELDS = [
  { key: "email", label: "Email", placeholder: "support@example.com" },
  { key: "whatsapp", label: "WhatsApp Link", placeholder: "https://wa.me/..." },
  { key: "telegram", label: "Telegram Link", placeholder: "https://t.me/..." },
  { key: "discord", label: "Discord Link", placeholder: "https://discord.gg/..." },
  { key: "instagram", label: "Instagram Link", placeholder: "https://instagram.com/..." },
  { key: "tiktok", label: "TikTok Link", placeholder: "https://tiktok.com/@..." },
];

export default function AdminSettings() {
  const [currentPin, setCurrentPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [savingPin, setSavingPin] = useState(false);
  const [savedPin, setSavedPin] = useState(false);
  const [pinError, setPinError] = useState("");

  const [contactForm, setContactForm] = useState({ email: "", whatsapp: "", telegram: "", discord: "", instagram: "", tiktok: "" });
  const [savingContact, setSavingContact] = useState(false);
  const [savedContact, setSavedContact] = useState(false);
  const [settingsId, setSettingsId] = useState(null);

  useEffect(() => {
    supabase.from('admin_settings').select('*').limit(1).single().then(({ data }) => {
      if (data) {
        setSettingsId(data.id);
        setContactForm({
          email: data.email || "",
          whatsapp: data.whatsapp || "",
          telegram: data.telegram || "",
          discord: data.discord || "",
          instagram: data.instagram || "",
          tiktok: data.tiktok || "",
        });
      }
    });
  }, []);

  const handlePinSave = async (e) => {
    e.preventDefault();
    setPinError("");
    if (newPin.length < 4) { setPinError("New PIN must be at least 4 characters"); return; }
    if (newPin !== confirmPin) { setPinError("PINs do not match"); return; }
    setSavingPin(true);
    try {
      await changeAdminPin(currentPin, newPin);
      setSavedPin(true);
      setCurrentPin(""); setNewPin(""); setConfirmPin("");
      setTimeout(() => setSavedPin(false), 2000);
    } catch (err) {
      setPinError(err.message || "Failed to update PIN");
    } finally {
      setSavingPin(false);
    }
  };

  const handleContactSave = async (e) => {
    e.preventDefault();
    setSavingContact(true);
    if (settingsId) {
      await supabase.from('admin_settings').update({ ...contactForm, updated_at: new Date().toISOString() }).eq('id', settingsId);
    } else {
      const { data } = await supabase.from('admin_settings').insert({ ...contactForm, admin_pin_hash: '' }).select().single();
      if (data) setSettingsId(data.id);
    }
    setSavedContact(true);
    setSavingContact(false);
    setTimeout(() => setSavedContact(false), 2000);
  };

  const inputClass = "w-full px-4 py-3 rounded-lg bg-white/[0.03] border border-white/[0.06] text-sm font-space text-white/70 placeholder:text-white/15 focus:outline-none focus:border-white/[0.12] transition-all";

  return (
    <div className="max-w-lg space-y-8">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-2">
        <h1 className="font-sora font-bold text-2xl text-white/90 mb-1">Settings</h1>
        <p className="font-space text-sm text-white/30">Manage credentials and contact info</p>
      </motion.div>

      {/* Contact Info */}
      <motion.form initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleContactSave}
        className="p-6 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-4"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
            <Link className="w-4 h-4 text-white/40" />
          </div>
          <h2 className="font-sora font-medium text-sm text-white/70">Contact Info</h2>
        </div>

        {CONTACT_FIELDS.map((f) => (
          <div key={f.key}>
            <label className="block text-[10px] font-space tracking-wider uppercase text-white/30 mb-1.5">{f.label}</label>
            <input type="text" value={contactForm[f.key]} onChange={(e) => setContactForm({ ...contactForm, [f.key]: e.target.value })} placeholder={f.placeholder} className={inputClass} />
          </div>
        ))}

        <button type="submit" disabled={savingContact}
          className="w-full py-3 bg-white text-black font-space font-semibold text-sm rounded-lg hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all flex items-center justify-center gap-2 disabled:opacity-40"
        >
          {savingContact ? <Loader2 className="w-4 h-4 animate-spin" /> : savedContact ? <><CheckCircle className="w-4 h-4" />Saved</> : "Save Contact Info"}
        </button>
      </motion.form>

      {/* Change PIN */}
      <motion.form initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} onSubmit={handlePinSave}
        className="p-6 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-4"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
            <Shield className="w-4 h-4 text-white/40" />
          </div>
          <h2 className="font-sora font-medium text-sm text-white/70">Change Admin PIN</h2>
        </div>

        <div>
          <label className="block text-[10px] font-space tracking-wider uppercase text-white/30 mb-1.5">Current PIN</label>
          <input type="password" value={currentPin} onChange={(e) => setCurrentPin(e.target.value)} placeholder="••••" className={inputClass} />
        </div>
        <div>
          <label className="block text-[10px] font-space tracking-wider uppercase text-white/30 mb-1.5">New PIN</label>
          <input type="password" value={newPin} onChange={(e) => setNewPin(e.target.value)} placeholder="••••" className={inputClass} />
        </div>
        <div>
          <label className="block text-[10px] font-space tracking-wider uppercase text-white/30 mb-1.5">Confirm New PIN</label>
          <input type="password" value={confirmPin} onChange={(e) => setConfirmPin(e.target.value)} placeholder="••••" className={inputClass} />
        </div>

        {pinError && <p className="text-xs text-red-400/70 font-space">{pinError}</p>}

        <button type="submit" disabled={savingPin || !currentPin || !newPin || !confirmPin}
          className="w-full py-3 bg-white text-black font-space font-semibold text-sm rounded-lg hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all flex items-center justify-center gap-2 disabled:opacity-40"
        >
          {savingPin ? <Loader2 className="w-4 h-4 animate-spin" /> : savedPin ? <><CheckCircle className="w-4 h-4" />Saved</> : "Update PIN"}
        </button>
      </motion.form>
    </div>
  );
}