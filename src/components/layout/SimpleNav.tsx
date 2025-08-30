import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

const linkBase = "px-3 py-2 rounded-full text-sm transition-colors";

const navClass = ({ isActive }: { isActive: boolean }) =>
  cn(linkBase, isActive ? "bg-foreground text-background" : "hover:bg-muted");

const SimpleNav = () => {
  return (
    <header className="glass-panel safe-top sticky top-0 z-40">
      <div className="mx-auto max-w-4xl px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-sm font-medium tracking-tight">
            User Portal
          </div>
        </div>

        <nav className="flex items-center gap-2" aria-label="User navigation">
          <NavLink to="/approve" className={navClass}>
            Approvals
          </NavLink>
          <NavLink to="/content-generation" className={navClass}>
            Generate
          </NavLink>
          <NavLink to="/ideas" className={navClass}>
            Ideas
          </NavLink>
          <NavLink to="/import" className={navClass}>
            Import
          </NavLink>
          <NavLink to="/user-analytics" className={navClass}>
            Analytics
          </NavLink>
        </nav>
      </div>
    </header>
  );
};

export default SimpleNav;