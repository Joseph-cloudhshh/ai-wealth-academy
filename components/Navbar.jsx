import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sparkles } from "lucide-react";

const NAV_LINKS = [
  { label: "Home", path: "/" },
  { label: "Courses", path: "/courses" },
  { label: "About", path: "/about" },
  { label: "FAQ", path: "/faq" },
  { label: "Contact", path: "/contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#050505]/80 backdrop-blur-xl border-b border-white/[0.06]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-white/[0.08] border border-white/[0.1] flex items-center justify-center group-hover:bg-white/[0.12] transition-all duration-300">
            <Sparkles className="w-4 h-4 text-white/80" />
          </div>
          <span className="font-sora font-bold text-lg tracking-tight text-white/90">
            AI Wealth<span className="text-white/50"> Academy</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-4 py-2 text-sm font-space tracking-wide transition-all duration-300 rounded-lg ${
                  isActive
                    ? "text-white"
                    : "text-white/40 hover:text-white/70"
                }`}
              >
                {link.label}
                {isActive && (
                  <motion.div
                    layoutId="nav-active"
                    className="absolute inset-0 bg-white/[0.06] rounded-lg border border-white/[0.08]"
                    style={{ zIndex: -1 }}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/courses"
            className="px-5 py-2.5 text-sm font-space font-medium bg-white text-black hover:bg-white/90 transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,255,255,0.15)]"
          >
            Browse Courses
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden w-10 h-10 flex items-center justify-center text-white/60"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-[#050505]/95 backdrop-blur-xl border-t border-white/[0.06] overflow-hidden"
          >
            <div className="px-6 py-6 space-y-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block px-4 py-3 rounded-lg text-sm font-space transition-colors ${
                    location.pathname === link.path
                      ? "text-white bg-white/[0.06]"
                      : "text-white/40 hover:text-white/70"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 border-t border-white/[0.06]">
                <Link
                  to="/courses"
                  className="block w-full text-center px-5 py-3 text-sm font-space font-medium bg-white text-black"
                >
                  Browse Courses
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}