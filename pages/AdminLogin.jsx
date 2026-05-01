import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Loader2 } from "lucide-react";
import { verifyAdminPin, createAdminSession } from "../lib/auth";

export default function AdminLogin() {
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(false);

    const valid = await verifyAdminPin(pin);
    if (valid) {
      createAdminSession();
      navigate("/admin/dashboard");
    } else {
      setError(true);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center px-6">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.02),transparent_70%)]" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-sm"
      >
        <div className="p-8 rounded-2xl bg-[#0a0a0a] border border-white/[0.06] shadow-[0_0_80px_rgba(255,255,255,0.03)]">
          <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-32 bg-white/[0.02] blur-[60px] rounded-full" />

          <div className="relative">
            <div className="w-14 h-14 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mb-6 mx-auto">
              <Shield className="w-6 h-6 text-white/60" />
            </div>

            <h1 className="font-sora font-bold text-xl text-white/90 text-center mb-2">
              Admin Access
            </h1>
            <p className="font-space text-xs text-white/30 text-center mb-8">
              Enter your secret PIN to continue
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="password"
                value={pin}
                onChange={(e) => { setPin(e.target.value); setError(false); }}
                placeholder="• • • •"
                maxLength={8}
                className="w-full px-4 py-3.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-sm font-space text-white/80 text-center tracking-[0.5em] placeholder:text-white/15 placeholder:tracking-[0.5em] focus:outline-none focus:border-white/[0.15] transition-all"
                autoFocus
              />

              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-red-400/70 text-center font-space"
                >
                  Invalid PIN. Try again.
                </motion.p>
              )}

              <button
                type="submit"
                disabled={!pin.trim() || loading}
                className="w-full py-3.5 bg-white text-black font-space font-semibold text-sm rounded-lg hover:shadow-[0_0_30px_rgba(255,255,255,0.15)] transition-all duration-500 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Enter Dashboard"}
              </button>
            </form>

            <p className="text-[10px] text-white/15 text-center mt-6 font-space">
              Default PIN set via VITE_ADMIN_DEFAULT_PIN
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}