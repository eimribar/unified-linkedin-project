import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import SEO from "@/components/seo/SEO";
import SwipeDeck from "@/components/swipe/SwipeDeck";
import { motion } from "framer-motion";

const Approvals = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate('/signup');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <SEO
        title="Content Approvals – LinkedIn Portal"
        description="Review and approve your LinkedIn content with a beautiful, intuitive interface."
        canonicalPath="/approve"
      />
      
      {/* Minimal, elegant header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="pt-8 pb-4 px-4"
      >
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-medium tracking-tight text-foreground/90">
                Content Review
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Swipe to approve or decline
              </p>
            </div>
            <div className="text-sm text-muted-foreground">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main content area - focused on the cards */}
      <main className="px-4 pb-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-5xl mx-auto"
        >
          <SwipeDeck />
        </motion.div>
      </main>
    </div>
  );
};

export default Approvals;