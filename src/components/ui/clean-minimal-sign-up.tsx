"use client" 

import * as React from "react"
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { UserPlus, Lock, Mail, Linkedin, User } from "lucide-react";
import { toast } from "sonner";
import { sampleProfile } from '@/data/sampleProfile';

const SignUp2 = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { signUp, updateProfile } = useAuth();

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSignUp = async () => {
    if (!name || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setError("");
    setIsLoading(true);
    
    // Simulate sign up
    setTimeout(() => {
      signUp(email);
      // Update profile with the name
      updateProfile({ fullName: name });
      toast.success("Welcome! Let's personalize your experience");
      navigate('/welcome');
      setIsLoading(false);
    }, 1000);
  };

  const handleLinkedInSignUp = async () => {
    setIsLoading(true);
    
    // Simulate LinkedIn OAuth
    setTimeout(() => {
      const email = sampleProfile.email || `user@${new Date().getTime()}.com`;
      signUp(email, "https://linkedin.com/in/amnoncohen");
      updateProfile(sampleProfile);
      toast.success("LinkedIn profile imported successfully!");
      navigate('/welcome');
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-transparent rounded-xl z-1">
      <div className="w-full max-w-sm bg-gradient-to-b from-emerald-50/50 to-white dark:from-zinc-900/50 dark:to-zinc-900 rounded-3xl shadow-xl shadow-opacity-10 p-8 flex flex-col items-center border border-emerald-100 dark:border-zinc-800 text-black dark:text-white">
        <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-white dark:bg-zinc-800 mb-6 shadow-lg shadow-opacity-5">
          <UserPlus className="w-7 h-7 text-black dark:text-white" />
        </div>
        <h2 className="text-2xl font-semibold mb-2 text-center">
          Create your account
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 text-center">
          Start building your LinkedIn content strategy in minutes
        </p>
        <div className="w-full flex flex-col gap-3 mb-2">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <User className="w-4 h-4" />
            </span>
            <input
              placeholder="Full Name"
              type="text"
              value={name}
              className="w-full pl-10 pr-3 py-2 rounded-xl border border-gray-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:focus:ring-emerald-900 bg-gray-50 dark:bg-zinc-800 text-black dark:text-white text-sm"
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSignUp()}
              disabled={isLoading}
            />
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Mail className="w-4 h-4" />
            </span>
            <input
              placeholder="Email"
              type="email"
              value={email}
              className="w-full pl-10 pr-3 py-2 rounded-xl border border-gray-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:focus:ring-emerald-900 bg-gray-50 dark:bg-zinc-800 text-black dark:text-white text-sm"
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSignUp()}
              disabled={isLoading}
            />
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Lock className="w-4 h-4" />
            </span>
            <input
              placeholder="Password (min 6 characters)"
              type="password"
              value={password}
              className="w-full pl-10 pr-10 py-2 rounded-xl border border-gray-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:focus:ring-emerald-900 bg-gray-50 dark:bg-zinc-800 text-black dark:text-white text-sm"
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSignUp()}
              disabled={isLoading}
            />
          </div>
          {error && (
            <div className="text-sm text-red-500 text-left">{error}</div>
          )}
        </div>
        <button
          onClick={handleSignUp}
          disabled={isLoading}
          className="w-full bg-gradient-to-b from-gray-700 to-gray-900 dark:from-gray-600 dark:to-gray-800 text-white font-medium py-2 rounded-xl shadow hover:brightness-105 cursor-pointer transition mb-4 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Creating account...' : 'Get Started'}
        </button>
        <div className="flex items-center w-full my-2">
          <div className="flex-grow border-t border-dashed border-gray-200 dark:border-zinc-700"></div>
          <span className="mx-2 text-xs text-gray-400">Or continue with</span>
          <div className="flex-grow border-t border-dashed border-gray-200 dark:border-zinc-700"></div>
        </div>
        
        {/* LinkedIn import option */}
        <button 
          onClick={handleLinkedInSignUp}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-3 py-2 rounded-xl border border-[#0077B5] bg-[#0077B5]/5 hover:bg-[#0077B5]/10 transition mb-3 disabled:opacity-50"
        >
          <Linkedin className="w-5 h-5 text-[#0077B5]" />
          <span className="text-sm font-medium">Import LinkedIn Profile</span>
        </button>
        
        <div className="flex gap-3 w-full justify-center">
          <button 
            disabled={isLoading}
            className="flex items-center justify-center w-12 h-12 rounded-xl border bg-white dark:bg-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-700 transition grow disabled:opacity-50"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-6 h-6"
            />
          </button>
          <button 
            disabled={isLoading}
            className="flex items-center justify-center w-12 h-12 rounded-xl border bg-white dark:bg-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-700 transition grow disabled:opacity-50"
          >
            <img
              src="https://www.svgrepo.com/show/511330/apple-173.svg"
              alt="Apple"
              className="w-6 h-6"
            />
          </button>
        </div>
        
        {/* Sign in link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Already have an account?{' '}
            <button 
              onClick={() => navigate('/signin')}
              className="font-medium text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export { SignUp2 };