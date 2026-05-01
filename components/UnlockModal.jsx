import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Key, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { verifyToken } from "../lib/api/tokens";

export default function UnlockModal({ isOpen, onClose, courseSlug, onSuccess }) {
  const [token, setToken] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState("Invalid token. Please try again.");

  const handleVerify = async () => {
    if (!token.trim()) return;
    setStatus("loading");

    const result = await verifyToken(courseSlug, token.trim());

    if (result.success) {
      setStatus("success");
      setTimeout(() => {
        onSuccess?.();
        setStatus("idle");
        setToken("");
      }, 1000);
    } else {
      setErrorMsg(result.message || "Invalid token. Please try again.");
      setStatus("error");
      setTimeout(() => setStatus("idle"), 2500);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="relative w-full max-w-md rounded-2xl bg-[#0a0a0a] border border-white/[0.08] shadow-[0_0_60px_rgba(255,255,255,0.05)] overflow-hidden">
              <div className="absolute inset-0 rounded-2xl border border-white/[0.04]" />
              <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-60 h-40 bg-white/[0.03] blur-[80px] rounded-full" />

              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-white/30 hover:text-white/60 transition-colors z-10"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="relative p-8">
                <div className="w-14 h-14 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mb-6">
                  <Key className="w-6 h-6 text-white/60" />
                </div>

                <h3 className="font-sora font-bold text-xl text-white/90 mb-2">
                  Unlock Course
                </h3>
                <p className="font-space text-sm text-white/35 mb-8">
                  Enter your purchase token to access premium content.
                </p>

                <div className="relative mb-4">
                  <input
                    type="text"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="Enter purchase token..."
                    disabled={status === "loading" || status === "success"}
                    onKeyDown={(e) => e.key === "Enter" && handleVerify()}
                    className="w-full px-4 py-3.5 rounded-lg bg-white/[0.03] border border-white/[0.08] text-sm font-space text-white/80 placeholder:text-white/20 focus:outline-none focus:border-white/[0.15] focus:ring-1 focus:ring-white/[0.1] transition-all disabled:opacity-50"
                  />
                </div>

                <AnimatePresence mode="wait">
                  {status === "error" && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="flex items-center gap-2 mb-4 text-red-400/80"
                    >
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-xs font-space">{errorMsg}</span>
                    </motion.div>
                  )}
                  {status === "success" && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="flex items-center gap-2 mb-4 text-green-400/80"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-xs font-space">Token verified! Redirecting...</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  onClick={handleVerify}
                  disabled={!token.trim() || status === "loading" || status === "success"}
                  className="w-full py-3.5 rounded-lg bg-white text-black font-space font-semibold text-sm hover:shadow-[0_0_30px_rgba(255,255,255,0.15)] transition-all duration-500 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {status === "loading" ? (
                    <><Loader2 className="w-4 h-4 animate-spin" />Verifying...</>
                  ) : status === "success" ? (
                    <><CheckCircle className="w-4 h-4" />Verified</>
                  ) : (
                    "Verify Token"
                  )}
                </button>

                <p className="text-center text-[10px] text-white/15 mt-4 font-space">
                  Tokens are case-insensitive and single-use
                </p>
                <div className="text-center mt-3">
                  <a href="/contact" className="text-[11px] font-space text-white/25 hover:text-white/50 transition-colors underline underline-offset-2">
                    Don't have an access code? Contact support
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}