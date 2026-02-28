import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router";
import {
  LayoutDashboard,
  FolderOpen,
  PenLine,
  Settings,
  PanelLeft,
  Factory,
} from "lucide-react";
import { Toaster } from "sonner";
import logoImg from "../../assets/4fc0ccae98252aec5e5f6491937e7cf9fe9a267c.png";

const navItems = [
  { path: "/projects/new", icon: PenLine, label: "New project" },
  { path: "/", icon: LayoutDashboard, label: "Dashboard" },
  { path: "/projects", icon: FolderOpen, label: "Projects" },
  { path: "/sourcing", icon: Factory, label: "Sourcing" },
];

export function AppShell() {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    if (path === "/projects") return location.pathname === "/projects";
    if (path === "/projects/new") return location.pathname === "/projects/new";
    return location.pathname.startsWith(path);
  };

  return (
    <div className="h-screen flex bg-background">
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#2A0B11",
            color: "#FDFAF7",
            border: "none",
            borderRadius: "10px",
            fontSize: "0.8125rem",
          },
        }}
      />

      {/* Sidebar */}
      <aside
        className={`hidden md:flex flex-col flex-shrink-0 border-r border-burgundy-950/[0.05] bg-white overflow-hidden transition-[width] duration-200 ease-in-out ${collapsed ? "w-[60px]" : "w-[228px]"
          }`}
      >
        {/* Logo row */}
        <div className="flex items-center h-[56px] px-[17px] flex-shrink-0">
          <button
            onClick={() => collapsed && setCollapsed(false)}
            className={`w-[26px] h-[26px] rounded-[8px] flex items-center justify-center flex-shrink-0 overflow-hidden transition-colors ${collapsed ? "cursor-pointer" : "cursor-default"
              }`}
            title={collapsed ? "Expand sidebar" : undefined}
          >
            <img src={logoImg} alt="SeamAI" className="w-full h-full object-cover" />
          </button>
          <span
            className={`text-foreground tracking-tight whitespace-nowrap ml-2.5 transition-opacity duration-200 ${collapsed ? "opacity-0" : "opacity-100"
              }`}
            style={{ fontSize: "0.9375rem", fontWeight: 600 }}
          >
            SeamAI
          </span>
          <div className="flex-1" />
          <button
            onClick={() => setCollapsed(true)}
            className={`p-1 rounded-[6px] text-muted-foreground/50 hover:text-muted-foreground hover:bg-burgundy-950/[0.03] transition-all duration-200 cursor-pointer flex-shrink-0 ${collapsed ? "opacity-0 pointer-events-none w-0 p-0" : "opacity-100"
              }`}
            title="Collapse sidebar"
          >
            <PanelLeft className="w-[15px] h-[15px]" />
          </button>
        </div>

        {/* Nav */}
        <nav className={`flex-1 pt-2 pb-4 transition-[padding] duration-200 ease-in-out ${collapsed ? "px-1.5" : "px-3"}`}>
          {/* Primary CTA */}
          <button
            onClick={() => navigate("/projects/new")}
            className={`
              w-full flex items-center rounded-[10px] mb-3 transition-colors cursor-pointer overflow-hidden flex-shrink-0
              ${collapsed ? "justify-center p-2.5" : "gap-2.5 px-3 py-2.5"}
              ${isActive("/projects/new")
                ? "bg-burgundy-950 text-cream"
                : "bg-burgundy-950/[0.04] text-foreground hover:bg-burgundy-950/[0.08]"
              }
            `}
            title={collapsed ? "New project" : undefined}
            style={{ fontSize: "0.8125rem" }}
          >
            <PenLine className="w-4 h-4 flex-shrink-0" />
            <span
              className={`text-left whitespace-nowrap transition-opacity duration-200 ${collapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100 flex-1"
                }`}
            >
              New project
            </span>
          </button>

          <div className={`h-px bg-burgundy-950/[0.04] mb-3 transition-[margin] duration-200 ${collapsed ? "mx-1" : ""}`} />

          {/* Secondary nav */}
          <div className="space-y-0.5">
            {navItems.slice(1).map((item) => {
              const active = isActive(item.path);
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`
                    w-full flex items-center rounded-[8px] transition-colors cursor-pointer overflow-hidden flex-shrink-0
                    ${collapsed ? "justify-center p-2" : "gap-2.5 px-3 py-[7px]"}
                    ${active
                      ? "bg-burgundy-950/[0.05] text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-burgundy-950/[0.02]"
                    }
                  `}
                  title={collapsed ? item.label : undefined}
                  style={{ fontSize: "0.8125rem" }}
                >
                  <item.icon className="w-[15px] h-[15px] flex-shrink-0" />
                  <span
                    className={`text-left whitespace-nowrap transition-opacity duration-200 ${collapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100 flex-1"
                      }`}
                  >
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Bottom */}
        <div className={`pb-4 transition-[padding] duration-200 ease-in-out ${collapsed ? "px-1.5" : "px-3"}`}>
          <div className={`h-px bg-burgundy-950/[0.04] mb-3 transition-[margin] duration-200 ${collapsed ? "mx-1" : ""}`} />
          <button
            className={`
              w-full flex items-center rounded-[8px] transition-colors cursor-pointer overflow-hidden
              ${collapsed ? "justify-center p-2" : "gap-2.5 px-3 py-[7px]"}
              text-muted-foreground/60 hover:text-muted-foreground hover:bg-burgundy-950/[0.02]
            `}
            title={collapsed ? "Settings" : undefined}
            style={{ fontSize: "0.8125rem" }}
          >
            <Settings className="w-[15px] h-[15px] flex-shrink-0" />
            <span
              className={`whitespace-nowrap transition-opacity duration-200 ${collapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
                }`}
            >
              Settings
            </span>
          </button>

          <div className={`border-t border-burgundy-950/[0.04] mt-3 pt-3 transition-[padding] duration-200 ${collapsed ? "flex justify-center" : "flex items-center gap-2.5 px-3 pt-4"}`}>
            <div className="w-[30px] h-[30px] rounded-full bg-burgundy/8 flex items-center justify-center flex-shrink-0" title="Elena Vasquez">
              <span className="text-burgundy" style={{ fontSize: "0.6875rem", fontWeight: 600 }}>EV</span>
            </div>
            <div
              className={`min-w-0 whitespace-nowrap transition-opacity duration-200 ${collapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
                }`}
            >
              <p className="text-foreground truncate" style={{ fontSize: "0.75rem", fontWeight: 500 }}>Elena Vasquez</p>
              <p className="text-muted-foreground truncate" style={{ fontSize: "0.625rem" }}>Product Lead</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between h-[52px] px-4 border-b border-burgundy-950/[0.05] bg-white">
        <div className="flex items-center gap-2">
          <div className="w-[22px] h-[22px] rounded-[6px] overflow-hidden flex items-center justify-center">
            <img src={logoImg} alt="SeamAI" className="w-full h-full object-cover" />
          </div>
          <span className="text-foreground" style={{ fontSize: "0.875rem", fontWeight: 600 }}>SeamAI</span>
        </div>
        <div className="flex items-center gap-0.5">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`p-2 rounded-[8px] transition-colors cursor-pointer ${isActive(item.path) ? "bg-burgundy-950/[0.06] text-foreground" : "text-muted-foreground"
                }`}
            >
              <item.icon className="w-[18px] h-[18px]" />
            </button>
          ))}
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-hidden md:pt-0 pt-[52px]">
        <Outlet />
      </main>
    </div>
  );
}