import { SignIn2 } from "@/components/ui/clean-minimal-sign-in";
import SEO from "@/components/seo/SEO";

const SignIn = () => {
  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      <SEO
        title="Sign In – LinkedIn Content Portal"
        description="Sign in to your personalized LinkedIn content management portal"
        canonicalPath="/signin"
      />
      
      {/* Background gradient effects - same as signup page */}
      <div 
        className="absolute pointer-events-none"
        style={{
          width: '981px',
          height: '981px',
          left: '-428px',
          top: '544px',
          background: 'radial-gradient(76.83% 76.83% at 13.45% 100%, rgba(111, 121, 84, 0.4) 0%, rgba(107, 216, 149, 0.4) 49.03%, rgba(240, 203, 140, 0.4) 67.3%, rgba(218, 240, 227, 0.4) 86.81%, rgba(255, 255, 255, 0.4) 100%)',
          filter: 'blur(58px)',
          zIndex: 0
        }}
      />
      {/* Second gradient for depth */}
      <div 
        className="absolute pointer-events-none"
        style={{
          width: '800px',
          height: '800px',
          right: '-300px',
          top: '-200px',
          background: 'radial-gradient(50% 50% at 50% 50%, rgba(107, 216, 149, 0.3) 0%, rgba(240, 203, 140, 0.2) 50%, rgba(255, 255, 255, 0) 100%)',
          filter: 'blur(80px)',
          zIndex: 0
        }}
      />
      {/* Bottom left gradient */}
      <div 
        className="absolute pointer-events-none"
        style={{
          width: '600px',
          height: '600px',
          left: '-300px',
          bottom: '-300px',
          background: 'radial-gradient(70% 70% at 20% 80%, rgba(240, 203, 140, 0.35) 0%, rgba(111, 121, 84, 0.25) 40%, rgba(218, 240, 227, 0.15) 70%, rgba(255, 255, 255, 0) 100%)',
          filter: 'blur(60px)',
          zIndex: 0
        }}
      />
      
      <div className="relative z-10">
        <SignIn2 />
      </div>
    </div>
  );
};

export default SignIn;