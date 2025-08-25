import React, { useState, useRef, useEffect, lazy, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { buildOAuthRedirectUrl } from "@/utils/urlHelpers";
import toast from "react-hot-toast";

// Lazy load the Three.js background component
const DotMatrixBackground = lazy(() => import('./DotMatrixBackground'));

interface SignInPageProps {
  className?: string;
  invitationToken?: string | null;
  clientName?: string | null;
}

const AnimatedNavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
  const defaultTextColor = 'text-gray-600';
  const hoverTextColor = 'text-gray-900';
  const textSizeClass = 'text-sm';

  return (
    <Link to={href} className={`group relative inline-block overflow-hidden h-5 flex items-center ${textSizeClass}`}>
      <div className="flex flex-col transition-transform duration-400 ease-out transform group-hover:-translate-y-1/2">
        <span className={defaultTextColor}>{children}</span>
        <span className={hoverTextColor}>{children}</span>
      </div>
    </Link>
  );
};

function MiniNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [headerShapeClass, setHeaderShapeClass] = useState('rounded-full');
  const shapeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (shapeTimeoutRef.current) {
      clearTimeout(shapeTimeoutRef.current);
    }

    if (isOpen) {
      setHeaderShapeClass('rounded-xl');
    } else {
      shapeTimeoutRef.current = setTimeout(() => {
        setHeaderShapeClass('rounded-full');
      }, 300);
    }

    return () => {
      if (shapeTimeoutRef.current) {
        clearTimeout(shapeTimeoutRef.current);
      }
    };
  }, [isOpen]);

  const logoElement = (
    <div className="relative w-5 h-5 flex items-center justify-center">
      <span className="absolute w-1.5 h-1.5 rounded-full bg-gray-800 top-0 left-1/2 transform -translate-x-1/2 opacity-80"></span>
      <span className="absolute w-1.5 h-1.5 rounded-full bg-gray-800 left-0 top-1/2 transform -translate-y-1/2 opacity-80"></span>
      <span className="absolute w-1.5 h-1.5 rounded-full bg-gray-800 right-0 top-1/2 transform -translate-y-1/2 opacity-80"></span>
      <span className="absolute w-1.5 h-1.5 rounded-full bg-gray-800 bottom-0 left-1/2 transform -translate-x-1/2 opacity-80"></span>
    </div>
  );

  const navLinksData = [
    { label: 'About', href: '#about' },
    { label: 'Features', href: '#features' },
    { label: 'Contact', href: '#contact' },
  ];

  const loginButtonElement = (
    <a href="https://ghostwriter-portal.vercel.app" className="px-4 py-2 sm:px-3 text-xs sm:text-sm border border-gray-300 bg-white/70 text-gray-700 rounded-full hover:border-gray-400 hover:bg-white hover:text-gray-900 transition-colors duration-200 w-full sm:w-auto">
      Admin Portal
    </a>
  );

  const signupButtonElement = (
    <div className="relative group w-full sm:w-auto">
      <div className="absolute inset-0 -m-2 rounded-full
                     hidden sm:block
                     bg-gray-100
                     opacity-40 filter blur-lg pointer-events-none
                     transition-all duration-300 ease-out
                     group-hover:opacity-60 group-hover:blur-xl group-hover:-m-3"></div>
      <button className="relative z-10 px-4 py-2 sm:px-3 text-xs sm:text-sm font-semibold text-white bg-gradient-to-br from-gray-800 to-gray-900 rounded-full hover:from-gray-900 hover:to-black transition-all duration-200 w-full sm:w-auto">
        Get Started
      </button>
    </div>
  );

  return (
    <header className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-20
                       flex flex-col items-center
                       pl-6 pr-6 py-3 backdrop-blur-sm
                       ${headerShapeClass}
                       border border-gray-200 bg-white/80
                       w-[calc(100%-2rem)] sm:w-auto
                       transition-[border-radius] duration-0 ease-in-out shadow-lg`}>

      <div className="flex items-center justify-between w-full gap-x-6 sm:gap-x-8">
        <div className="flex items-center">
          {logoElement}
        </div>

        <nav className="hidden sm:flex items-center space-x-4 sm:space-x-6 text-sm">
          {navLinksData.map((link) => (
            <AnimatedNavLink key={link.href} href={link.href}>
              {link.label}
            </AnimatedNavLink>
          ))}
        </nav>

        <div className="hidden sm:flex items-center gap-2 sm:gap-3">
          {loginButtonElement}
          {signupButtonElement}
        </div>

        <button className="sm:hidden flex items-center justify-center w-8 h-8 text-gray-700 focus:outline-none" onClick={toggleMenu} aria-label={isOpen ? 'Close Menu' : 'Open Menu'}>
          {isOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
          )}
        </button>
      </div>

      <div className={`sm:hidden flex flex-col items-center w-full transition-all ease-in-out duration-300 overflow-hidden
                       ${isOpen ? 'max-h-[1000px] opacity-100 pt-4' : 'max-h-0 opacity-0 pt-0 pointer-events-none'}`}>
        <nav className="flex flex-col items-center space-y-4 text-base w-full">
          {navLinksData.map((link) => (
            <a key={link.href} href={link.href} className="text-gray-600 hover:text-gray-900 transition-colors w-full text-center">
              {link.label}
            </a>
          ))}
        </nav>
        <div className="flex flex-col items-center space-y-4 mt-4 w-full">
          {loginButtonElement}
          {signupButtonElement}
        </div>
      </div>
    </header>
  );
}

export const SignInPage = ({ className, invitationToken, clientName }: SignInPageProps) => {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<"email" | "code" | "success">("email");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const codeInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [initialCanvasVisible, setInitialCanvasVisible] = useState(true);
  const [reverseCanvasVisible, setReverseCanvasVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  // Determine welcome message
  const getWelcomeMessage = () => {
    if (clientName) {
      return `Welcome ${clientName}`;
    }
    return "Welcome";
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      
      // Use helper function to build proper OAuth URL
      const redirectUrl = buildOAuthRedirectUrl(
        '/auth/callback',
        invitationToken ? { invitation: invitationToken } : undefined
      ).trim(); // Extra trim for safety
      
      console.log('🔗 Google OAuth redirect URL:', redirectUrl);
      console.log('🔍 URL length:', redirectUrl.length);
      console.log('🔍 First char code:', redirectUrl.charCodeAt(0)); // Should be 104 for 'h'
      
      // Validate URL doesn't have spaces
      if (redirectUrl !== redirectUrl.trim()) {
        console.error('❌ URL has leading/trailing spaces!');
        throw new Error('Invalid redirect URL format');
      }
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl
        }
      });

      if (error) {
        console.error('❌ OAuth error details:', error);
        console.error('❌ OAuth error message:', error.message);
        throw error;
      }
      
      console.log('✅ OAuth initiated successfully');
    } catch (error: any) {
      console.error('❌ OAuth error:', error);
      toast.error(error.message || 'Failed to sign in with Google. Please try again.');
      setLoading(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      try {
        setLoading(true);
        
        // Use helper function to build proper redirect URL
        const redirectUrl = buildOAuthRedirectUrl(
          '/auth/callback',
          invitationToken ? { invitation: invitationToken } : undefined
        ).trim(); // Extra trim for safety
        
        console.log('📧 Magic link redirect URL:', redirectUrl);
        
        const { error } = await supabase.auth.signInWithOtp({
          email: email.trim(), // Also trim the email
          options: {
            emailRedirectTo: redirectUrl
          }
        });

        if (error) throw error;
        
        // Move to code step
        setStep("code");
        toast.success('Check your email for the magic link!');
      } catch (error: any) {
        console.error('❌ Magic link error:', error);
        toast.error('Failed to send magic link');
      } finally {
        setLoading(false);
      }
    }
  };

  // Focus first input when code screen appears
  useEffect(() => {
    if (step === "code") {
      setTimeout(() => {
        codeInputRefs.current[0]?.focus();
      }, 500);
    }
  }, [step]);

  const handleCodeChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);
      
      // Focus next input if value is entered
      if (value && index < 5) {
        codeInputRefs.current[index + 1]?.focus();
      }
      
      // Check if code is complete
      if (index === 5 && value) {
        const isComplete = newCode.every(digit => digit.length === 1);
        if (isComplete) {
          // Verify OTP code with Supabase
          verifyOTP(newCode.join(''));
        }
      }
    }
  };

  const verifyOTP = async (otpCode: string) => {
    try {
      setLoading(true);
      
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: otpCode,
        type: 'email'
      });

      if (error) throw error;

      // First show the new reverse canvas
      setReverseCanvasVisible(true);
      
      // Then hide the original canvas after a small delay
      setTimeout(() => {
        setInitialCanvasVisible(false);
      }, 50);
      
      // Transition to success screen after animation
      setTimeout(() => {
        setStep("success");
      }, 2000);
    } catch (error: any) {
      console.error('OTP verification error:', error);
      toast.error('Invalid code. Please try again.');
      setCode(["", "", "", "", "", ""]);
      codeInputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      codeInputRefs.current[index - 1]?.focus();
    }
  };

  const handleBackClick = () => {
    setStep("email");
    setCode(["", "", "", "", "", ""]);
    // Reset animations if going back
    setReverseCanvasVisible(false);
    setInitialCanvasVisible(true);
  };

  const handleContinueToDashboard = () => {
    window.location.href = '/client-approve';
  };

  // Fallback gradient for when Three.js is loading
  const fallbackBackground = (
    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50" />
  );

  return (
    <div className={cn("flex w-[100%] flex-col min-h-screen bg-white relative", className)}>
      <div className="absolute inset-0 z-0">
        {/* Use Suspense to lazy load the Three.js background */}
        <Suspense fallback={fallbackBackground}>
          {/* Initial canvas (forward animation) */}
          {initialCanvasVisible && (
            <div className="absolute inset-0">
              <DotMatrixBackground
                animationSpeed={3}
                containerClassName="bg-white"
                colors={[[59, 130, 246], [147, 51, 234]]}
                dotSize={6}
                reverse={false}
              />
            </div>
          )}
          
          {/* Reverse canvas (appears when code is complete) */}
          {reverseCanvasVisible && (
            <div className="absolute inset-0">
              <DotMatrixBackground
                animationSpeed={4}
                containerClassName="bg-white"
                colors={[[59, 130, 246], [147, 51, 234]]}
                dotSize={6}
                reverse={true}
              />
            </div>
          )}
        </Suspense>
        
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.8)_0%,_transparent_100%)]" />
        <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/90 to-transparent" />
      </div>
      
      {/* Content Layer */}
      <div className="relative z-10 flex flex-col flex-1">
        {/* Top navigation */}
        <MiniNavbar />

        {/* Main content container */}
        <div className="flex flex-1 flex-col lg:flex-row">
          {/* Left side (form) */}
          <div className="flex-1 flex flex-col justify-center items-center">
            <div className="w-full mt-[150px] max-w-sm">
              <AnimatePresence mode="wait">
                {step === "email" ? (
                  <motion.div 
                    key="email-step"
                    initial={{ opacity: 0, x: -100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="space-y-6 text-center"
                  >
                    <div className="space-y-1">
                      <h1 className="text-[2.5rem] font-bold leading-[1.1] tracking-tight text-gray-900">{getWelcomeMessage()}</h1>
                      <p className="text-[1.8rem] text-gray-600 font-light">
                        {invitationToken 
                          ? 'Accept your invitation'
                          : 'Access your content portal'
                        }
                      </p>
                    </div>
                    
                    <div className="space-y-4">
                      <button 
                        onClick={handleGoogleSignIn}
                        disabled={loading}
                        className="backdrop-blur-[2px] w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-black text-white border border-gray-900 rounded-full py-3 px-4 transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="text-lg">G</span>
                        <span>{loading ? 'Signing in...' : 'Sign in with Google'}</span>
                      </button>
                      
                      <div className="flex items-center gap-4">
                        <div className="h-px bg-gray-300 flex-1" />
                        <span className="text-gray-400 text-sm">or</span>
                        <div className="h-px bg-gray-300 flex-1" />
                      </div>
                      
                      <form onSubmit={handleEmailSubmit}>
                        <div className="relative">
                          <input 
                            type="email" 
                            placeholder="info@gmail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full backdrop-blur-[1px] bg-gray-50 text-gray-900 border border-gray-300 rounded-full py-3 px-4 focus:outline-none focus:border-gray-500 focus:bg-white text-center placeholder-gray-400"
                            required
                            disabled={loading}
                          />
                          <button 
                            type="submit"
                            disabled={loading || !email}
                            className="absolute right-1.5 top-1.5 text-white w-9 h-9 flex items-center justify-center rounded-full bg-blue-500 hover:bg-blue-600 transition-colors group overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <span className="relative w-full h-full block overflow-hidden">
                              <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 group-hover:translate-x-full">
                                →
                              </span>
                              <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 -translate-x-full group-hover:translate-x-0">
                                →
                              </span>
                            </span>
                          </button>
                        </div>
                      </form>
                    </div>
                    
                    {invitationToken && (
                      <p className="text-sm text-green-600 bg-green-50 border border-green-200 px-4 py-2 rounded-full">
                        ✓ You've been invited! Sign in to accept.
                      </p>
                    )}
                    
                    <p className="text-xs text-gray-500 pt-10">
                      By signing up, you agree to our <Link to="#" className="underline text-gray-500 hover:text-gray-700 transition-colors">Terms of Service</Link> and <Link to="#" className="underline text-gray-500 hover:text-gray-700 transition-colors">Privacy Policy</Link>.
                    </p>
                  </motion.div>
                ) : step === "code" ? (
                  <motion.div 
                    key="code-step"
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 100 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="space-y-6 text-center"
                  >
                    <div className="space-y-1">
                      <h1 className="text-[2.5rem] font-bold leading-[1.1] tracking-tight text-gray-900">We sent you a code</h1>
                      <p className="text-[1.25rem] text-gray-600 font-light">Please enter it below</p>
                    </div>
                    
                    <div className="w-full">
                      <div className="relative rounded-full py-4 px-5 border border-gray-300 bg-white">
                        <div className="flex items-center justify-center">
                          {code.map((digit, i) => (
                            <div key={i} className="flex items-center">
                              <div className="relative">
                                <input
                                  ref={(el) => {
                                    codeInputRefs.current[i] = el;
                                  }}
                                  type="text"
                                  inputMode="numeric"
                                  pattern="[0-9]*"
                                  maxLength={1}
                                  value={digit}
                                  onChange={e => handleCodeChange(i, e.target.value)}
                                  onKeyDown={e => handleKeyDown(i, e)}
                                  className="w-8 text-center text-xl bg-transparent text-gray-900 border-none focus:outline-none focus:ring-0 appearance-none"
                                  style={{ caretColor: 'transparent' }}
                                  disabled={loading}
                                />
                                {!digit && (
                                  <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none">
                                    <span className="text-xl text-gray-300">0</span>
                                  </div>
                                )}
                              </div>
                              {i < 5 && <span className="text-gray-300 text-xl">|</span>}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <motion.p 
                        className="text-gray-500 hover:text-gray-700 transition-colors cursor-pointer text-sm"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                        onClick={() => handleEmailSubmit({ preventDefault: () => {} } as React.FormEvent)}
                      >
                        Resend code
                      </motion.p>
                    </div>
                    
                    <div className="flex w-full gap-3">
                      <motion.button 
                        onClick={handleBackClick}
                        className="rounded-full bg-gray-200 text-gray-900 font-medium px-8 py-3 hover:bg-gray-300 transition-colors w-[30%]"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                        disabled={loading}
                      >
                        Back
                      </motion.button>
                      <motion.button 
                        className={`flex-1 rounded-full font-medium py-3 border transition-all duration-300 ${
                          code.every(d => d !== "") 
                          ? "bg-gray-900 text-white border-gray-900 hover:bg-black cursor-pointer" 
                          : "bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed"
                        }`}
                        disabled={!code.every(d => d !== "") || loading}
                        onClick={() => code.every(d => d !== "") && verifyOTP(code.join(''))}
                      >
                        {loading ? 'Verifying...' : 'Continue'}
                      </motion.button>
                    </div>
                    
                    <div className="pt-16">
                      <p className="text-xs text-gray-500">
                        By signing up, you agree to our <Link to="#" className="underline text-gray-500 hover:text-gray-700 transition-colors">Terms of Service</Link> and <Link to="#" className="underline text-gray-500 hover:text-gray-700 transition-colors">Privacy Policy</Link>.
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="success-step"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut", delay: 0.3 }}
                    className="space-y-6 text-center"
                  >
                    <div className="space-y-1">
                      <h1 className="text-[2.5rem] font-bold leading-[1.1] tracking-tight text-gray-900">You're in!</h1>
                      <p className="text-[1.25rem] text-gray-600 font-light">Welcome to your content portal</p>
                    </div>
                    
                    <motion.div 
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                      className="py-10"
                    >
                      <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </motion.div>
                    
                    <motion.button 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1 }}
                      className="w-full rounded-full bg-gray-900 text-white font-medium py-3 hover:bg-black transition-colors"
                      onClick={handleContinueToDashboard}
                    >
                      Continue to Dashboard
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};