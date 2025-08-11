import { NavLink, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { LogOut, User, Settings } from "lucide-react";

const linkBase = "px-3 py-2 rounded-full text-sm transition-colors";

const navClass = ({ isActive }: { isActive: boolean }) =>
  cn(linkBase, isActive ? "bg-foreground text-background" : "hover:bg-muted");

const UserNav = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  
  const handleSignOut = () => {
    signOut();
    navigate('/signup');
  };

  // Get initials for avatar fallback
  const getInitials = () => {
    if (user?.profile?.fullName) {
      const names = user.profile.fullName.split(' ');
      return names.map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return 'U';
  };

  return (
    <header className="glass-panel safe-top sticky top-0 z-40">
      <div className="mx-auto max-w-4xl px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0">
                <Avatar className="h-8 w-8">
                  {user?.profile?.profilePic && (
                    <AvatarImage src={user.profile.profilePic} alt={user.profile.fullName} />
                  )}
                  <AvatarFallback>{getInitials()}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="start">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user?.profile?.fullName || 'User'}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/profile')}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem disabled>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="text-sm font-medium tracking-tight">
            {user?.profile?.fullName || 'Your Workspace'}
          </div>
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
          <NavLink to="/user-analytics" className={navClass}>
            Analytics
          </NavLink>
        </nav>
      </div>
    </header>
  );
};

export default UserNav;
