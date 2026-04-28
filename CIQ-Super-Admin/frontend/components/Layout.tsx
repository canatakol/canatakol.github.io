import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Building2,
  BarChart3,
  Activity,
  Puzzle,
  Flag,
  HeadphonesIcon,
  Shield,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Logo from "../assets/Logo1.png";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Tenants", href: "/tenants", icon: Building2 },
  { name: "Users", href: "/users", icon: Users },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Health", href: "/health", icon: Activity },
  { name: "Integrations", href: "/integrations", icon: Puzzle },
  { name: "Feature Flags", href: "/feature-flags", icon: Flag },
  { name: "Support", href: "/support", icon: HeadphonesIcon },
  { name: "Audit & Security", href: "/audit", icon: Shield },
];

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src={Logo} alt="CTI Tool Super Admin" className="h-6" />
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2.5 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-all active:scale-95"
        >
          {sidebarOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      <div className="lg:flex lg:h-screen">
        {/* Sidebar */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-40 w-72 bg-card border-r border-border/40 backdrop-blur-xl transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-screen lg:block lg:shadow-none shadow-2xl shadow-primary/5",
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex flex-col h-full">
            <div className="p-8 hidden lg:flex items-center gap-3 group">
              <div className="p-2 bg-primary/5 rounded-xl group-hover:bg-primary/10 transition-colors">
                <img src={Logo} alt="CTI Tool Super Admin" className="h-8" />
              </div>
            </div>

            <nav className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto mt-20 lg:mt-0">
              <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] px-3 mb-4 opacity-70">
                Management
              </div>
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={cn(
                      "group relative flex items-center justify-between gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                        : "text-muted-foreground hover:bg-primary/10 hover:text-foreground"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className={cn(
                        "h-5 w-5 transition-transform duration-200 group-hover:scale-110",
                        isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-primary"
                      )} />
                      {item.name}
                    </div>
                    {isActive && <ChevronRight className="h-4 w-4 opacity-50" />}
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 mt-auto">
              <div className="p-4 rounded-2xl bg-primary/[0.03] border border-primary/5">
                <p className="text-xs font-semibold text-primary/70 mb-1 uppercase tracking-wider">System Status</p>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[11px] font-medium text-muted-foreground">All systems operational</span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-0 mt-20 lg:mt-0 lg:h-screen lg:overflow-y-auto bg-background selection:bg-primary/20 relative">
          {/* Subtle background gradient */}
          <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
          <div className="relative p-6 lg:p-12 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-background/40 backdrop-blur-md z-30 lg:hidden transition-all duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

