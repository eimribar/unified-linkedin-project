import { ReactNode } from "react";

interface OnboardingLayoutProps {
  children: ReactNode;
}

// Dedicated environment for onboarding: clean, focused, no app chrome
const OnboardingLayout = ({ children }: OnboardingLayoutProps) => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {children}
    </div>
  );
};

export default OnboardingLayout;
