import { useEffect } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, BookOpen, FileText, Key, Settings, LogOut, Sparkles, Star, MessageSquare } from "lucide-react";
import { getAdminSession, destroyAdminSession } from "../lib/auth";

const SIDEBAR_LINKS = [
  { label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Courses", path: "/admin/courses", icon: BookOpen },
  { label: "Content", path: "/admin/content", icon: FileText },
  { label: "Tokens", path: "/admin/tokens", icon: Key },
  { label: "Reviews", path: "/admin/reviews", icon: Star },
  { label: "Messages", path: "/admin/messages", icon: MessageSquare },
  { label: "Settings", path: "/admin/settings", icon: Settings },
];

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!getAdminSession()) {
      navigate("/admin");
    }
  }, [location.pathname]);

  const handleLogout = () => {
    destroyAdminSession();
    navigate("/admin");
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r border-white/[0.06] bg-[#0a0a0a]/50">
        <div className="p-6">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-white/[0.06] border border-white/[0.08] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white/70" />
            </div>
            <div>
              <span className="font-sora font-bold text-sm text-white/80">AI Wealth</span>
              <p className="text-[10px] text-white/30 font-space tracking-wider uppercase">Admin Panel</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {SIDEBAR_LINKS.map((link) => {
            const isActive = location.pathname === link.path;
            const Icon = link.icon;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-space transition-all duration-300 ${
                  isActive
                    ? "bg-white/[0.06] text-white border border-white/[0.08]"
                    : "text-white/35 hover:text-white/60 hover:bg-white/[0.03]"
                }`}
              >
                <Icon className="w-4 h-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-space text-white/25 hover:text-white/50 hover:bg-white/[0.03] transition-all w-full"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 h-16 bg-[#050505]/90 backdrop-blur-xl border-b border-white/[0.06] flex items-center px-4 gap-3">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-white/[0.06] border border-white/[0.08] flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-white/70" />
          </div>
          <span className="font-sora font-bold text-sm text-white/80">Admin</span>
        </Link>
        <div className="flex-1" />
        <div className="flex gap-1 overflow-x-auto">
          {SIDEBAR_LINKS.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`p-2 rounded-lg transition-colors ${
                  isActive ? "bg-white/[0.08] text-white" : "text-white/30"
                }`}
              >
                <Icon className="w-4 h-4" />
              </Link>
            );
          })}
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 md:overflow-y-auto">
        <div className="md:p-8 p-4 pt-20 md:pt-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}