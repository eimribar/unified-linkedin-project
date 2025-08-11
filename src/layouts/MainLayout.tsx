import { ReactNode } from "react";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="premium-gradient-bg min-h-screen">
      {children}
    </div>
  );
};

export default MainLayout;
