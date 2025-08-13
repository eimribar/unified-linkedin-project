import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const NavBar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { path: "/import", label: "Import" },
    { path: "/profile", label: "Profile" },
    { path: "/ideas", label: "Ideas" },
    { path: "/approve", label: "Approvals" },
    { path: "/user-analytics", label: "Analytics" }
  ];

  return (
    <>
      <header className={cn("glass-panel elevation-2 safe-top sticky top-0 z-40")}
        role="banner"
        aria-label="Primary Navigation">
        <nav className="mx-auto max-w-[1440px] h-14 md:h-16 px-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <div aria-hidden className="h-6 w-6 rounded-md bg-zinc-900" />
              <Link to="/" aria-label="LinkedIn Content Engine" className="text-sm font-semibold tracking-tight">
                LinkedIn Content Engine
              </Link>
            </div>

            <div className="hidden md:flex items-center gap-2">
              {navItems.map((item) => (
                <Link 
                  key={item.path}
                  to={item.path} 
                  className="px-3 py-2 rounded-full hover:bg-muted text-sm transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"} 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden h-10 w-10 rounded-full hover:bg-muted grid place-items-center"
            >
              {mobileMenuOpen ? <X className="opacity-80" /> : <Menu className="opacity-80" />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-14 z-30 bg-white">
          <nav className="p-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 rounded-lg hover:bg-zinc-50 text-zinc-900 font-medium transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  );
};

export default NavBar;
