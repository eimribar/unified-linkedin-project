import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import SEO from "@/components/seo/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { Linkedin, Mail, ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { sampleProfile } from '@/data/sampleProfile';

const SignUp = () => {
  const navigate = useNavigate();
  const { signUp, updateProfile } = useAuth();
  const [email, setEmail] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({ title: "Please enter your email address", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      signUp(email);
      toast({ title: "Welcome! Let's set up your profile", description: "Please complete the onboarding questions" });
      navigate('/welcome');
    }, 1000);
  };

  const handleLinkedInSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkedinUrl) {
      toast({ title: "Please enter your LinkedIn URL", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    
    // Simulate LinkedIn data import
    setTimeout(() => {
      // Extract email from sample or generate one
      const email = sampleProfile.email || `user@${new Date().getTime()}.com`;
      signUp(email, linkedinUrl);
      
      // Simulate importing LinkedIn data
      updateProfile(sampleProfile);
      
      toast({ 
        title: "LinkedIn profile imported successfully!", 
        description: "Complete a few questions to personalize your experience" 
      });
      navigate('/welcome');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background gradient effects */}
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
      
      <SEO
        title="Sign Up – LinkedIn Content Portal"
        description="Join your personalized LinkedIn content management portal"
        canonicalPath="/signup"
      />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-brand-soft mb-4">
            <Sparkles className="w-8 h-8 text-foreground" />
          </div>
          <h1 className="text-3xl font-semibold tracking-tight">Welcome to Your Portal</h1>
          <p className="text-muted-foreground mt-2">Sign up to access your personalized LinkedIn content hub</p>
        </div>

        <Card className="border-gradient-brand">
          <CardHeader>
            <CardTitle>Create Your Account</CardTitle>
            <CardDescription>Choose how you'd like to get started</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="linkedin" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="linkedin">
                  <Linkedin className="w-4 h-4 mr-2" />
                  LinkedIn
                </TabsTrigger>
                <TabsTrigger value="email">
                  <Mail className="w-4 h-4 mr-2" />
                  Email
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="linkedin" className="space-y-4">
                <form onSubmit={handleLinkedInSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="linkedin-url">LinkedIn Profile URL</Label>
                    <Input
                      id="linkedin-url"
                      type="url"
                      placeholder="https://linkedin.com/in/yourprofile"
                      value={linkedinUrl}
                      onChange={(e) => setLinkedinUrl(e.target.value)}
                      className="w-full"
                      disabled={isLoading}
                    />
                    <p className="text-xs text-muted-foreground">
                      We'll import your profile data to personalize your experience
                    </p>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>Importing Profile...</>
                    ) : (
                      <>
                        Import & Continue
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="email" className="space-y-4">
                <form onSubmit={handleEmailSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full"
                      disabled={isLoading}
                    />
                    <p className="text-xs text-muted-foreground">
                      You'll set up your profile in the next step
                    </p>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>Creating Account...</>
                    ) : (
                      <>
                        Continue to Setup
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-sm text-center text-muted-foreground">
                Already have an account?{' '}
                <Button
                  variant="link"
                  className="p-0 h-auto font-normal"
                  onClick={() => navigate('/signin')}
                >
                  Sign in here
                </Button>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default SignUp;