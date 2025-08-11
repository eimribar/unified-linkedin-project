import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <header className={cn("glass-panel elevation-2 safe-top sticky top-0 z-40")}
      role="banner"
      aria-label="Primary Navigation">
      <nav className="mx-auto max-w-[1440px] h-14 md:h-16 px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div aria-hidden className="h-6 w-6 rounded-md bg-gradient-brand" />
          <Link to="/" aria-label="LinkedIn Content Engine" className="text-sm font-semibold tracking-tight">
            LinkedIn Content Engine
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-2">
          <Link to="/import" className="px-3 py-2 rounded-full hover:bg-muted text-sm transition-colors">Import</Link>
          <Link to="/strategy" className="px-3 py-2 rounded-full hover:bg-muted text-sm transition-colors">Strategy</Link>
          <Link to="/profile" className="px-3 py-2 rounded-full hover:bg-muted text-sm transition-colors">Profile</Link>
          <Link to="/lake" className="px-3 py-2 rounded-full hover:bg-muted text-sm transition-colors">Content Lake</Link>
          <Link to="/ideas" className="px-3 py-2 rounded-full hover:bg-muted text-sm transition-colors">Content Ideas</Link>
          <Link to="/generate" className="px-3 py-2 rounded-full hover:bg-muted text-sm transition-colors">Content Generation</Link>
          <Link to="/approve" className="px-3 py-2 rounded-full hover:bg-muted text-sm transition-colors">Approvals</Link>
          <Link to="/schedule" className="px-3 py-2 rounded-full hover:bg-muted text-sm transition-colors">Schedule</Link>
          <Link to="/analytics" className="px-3 py-2 rounded-full hover:bg-muted text-sm transition-colors">Analytics</Link>
        </div>

        <div className="flex items-center gap-2">
          
          <button aria-label="Open menu" className="md:hidden h-10 w-10 rounded-full hover:bg-muted grid place-items-center">
            <Menu className="opacity-80" />
          </button>
        </div>
      </nav>
    </header>
  );
};

export default NavBar;
