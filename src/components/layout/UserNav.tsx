import { NavLink } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const linkBase = "px-3 py-2 rounded-full text-sm transition-colors";

const navClass = ({ isActive }: { isActive: boolean }) =>
  cn(linkBase, isActive ? "bg-foreground text-background" : "hover:bg-muted");

const UserNav = () => {
  return (
    <header className="glass-panel safe-top sticky top-0 z-40">
      <div className="mx-auto max-w-2xl px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div className="text-sm font-medium tracking-tight">Your Workspace</div>
        </div>

        <nav className="flex items-center gap-2" aria-label="User navigation">
          <NavLink to="/profile" className={navClass} end>
            Profile
          </NavLink>
          <NavLink to="/strategy" className={navClass}>
            Strategy
          </NavLink>
          <NavLink to="/approve" className={navClass}>
            Approvals
          </NavLink>
          <NavLink to="/analytics" className={navClass}>
            Analytics
          </NavLink>
        </nav>
      </div>
    </header>
  );
};

export default UserNav;
