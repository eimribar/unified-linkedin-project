import { ReactNode } from "react";
import UserNav from "@/components/layout/UserNav";

interface UserLayoutProps {
  children: ReactNode;
}

// Dedicated environment for signed-in user flows: clean, focused, same language as onboarding
const UserLayout = ({ children }: UserLayoutProps) => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <UserNav />
      {children}
    </div>
  );
};

export default UserLayout;
