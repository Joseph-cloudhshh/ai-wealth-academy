import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

const FOOTER_SECTIONS = [
  {
    title: "Company",
    links: [
      { label: "About", path: "/about" },
      { label: "Contact", path: "/contact" },
      { label: "Careers", path: "#" },
    ],
  },
  {
    title: "Courses",
    links: [
      { label: "All Courses", path: "/courses" },
      { label: "Automation", path: "/courses" },
      { label: "AI Tools", path: "/courses" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "FAQ", path: "/faq" },
      { label: "Community", path: "#" },
      { label: "Blog", path: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", path: "#" },
      { label: "Terms of Service", path: "#" },
      { label: "Refund Policy", path: "#" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-white/[0.06] bg-[#050505]">
      {/* Glow line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 pt-16 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-16">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-white/[0.06] border border-white/[0.08] flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-white/70" />
              </div>
              <span className="font-sora font-bold text-sm text-white/80">AI Wealth</span>
            </div>
            <p className="text-xs text-white/30 leading-relaxed max-w-[200px]">
              Premium AI education for the next generation of digital entrepreneurs.
            </p>
          </div>

          {/* Sections */}
          {FOOTER_SECTIONS.map((section) => (
            <div key={section.title}>
              <h4 className="font-space text-xs font-semibold tracking-widest uppercase text-white/50 mb-4">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.path}
                      className="text-sm text-white/25 hover:text-white/60 transition-colors duration-300 font-space"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="border-t border-white/[0.04] pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/20 font-space">
            © 2024 AI Wealth Academy. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-xs text-white/15 font-space">Built for the future</span>
          </div>
        </div>
      </div>
    </footer>
  );
}