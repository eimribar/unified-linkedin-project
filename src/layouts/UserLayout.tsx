import { ReactNode } from "react";
import SimpleNav from "@/components/layout/SimpleNav";

interface UserLayoutProps {
  children: ReactNode;
}

// Simple layout for the User Portal - no authentication required
const UserLayout = ({ children }: UserLayoutProps) => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SimpleNav />
      {children}
    </div>
  );
};

export default UserLayout;