import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const SignUp = () => {
  const [isSignUp, setIsSignUp] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const { signUp, signIn } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSignUp) {
      if (email && name && password) {
        signUp(email);
        navigate("/welcome");
      }
    } else {
      if (email && password) {
        signIn(email);
        navigate("/profile");
      }
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-lg bg-zinc-900" />
            <span className="text-xl font-semibold">LinkedIn Content Engine</span>
          </div>
          <h1 className="text-3xl font-bold text-zinc-900">
            {isSignUp ? "Create your account" : "Welcome back"}
          </h1>
          <p className="text-zinc-600 mt-2">
            {isSignUp ? "Get started with your content journey" : "Sign in to continue"}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex mb-6 bg-zinc-100 rounded-lg p-1">
          <button
            type="button"
            onClick={() => setIsSignUp(true)}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
              isSignUp 
                ? "bg-white text-zinc-900 shadow-sm" 
                : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            Sign Up
          </button>
          <button
            type="button"
            onClick={() => setIsSignUp(false)}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
              !isSignUp 
                ? "bg-white text-zinc-900 shadow-sm" 
                : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            Sign In
          </button>
        </div>

        <div className="bg-white rounded-xl border border-zinc-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {isSignUp && (
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                  placeholder="John Doe"
                  required={isSignUp}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                placeholder="john@company.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                placeholder="••••••••"
                required
                minLength={6}
              />
              {isSignUp && (
                <p className="text-xs text-zinc-500 mt-1">At least 6 characters</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-zinc-900 text-white font-medium rounded-lg hover:bg-zinc-800 transition-colors"
            >
              {isSignUp ? "Create Account" : "Sign In"}
            </button>
          </form>
        </div>

        {isSignUp && (
          <p className="text-xs text-zinc-500 text-center mt-6">
            By signing up, you agree to our Terms of Service and Privacy Policy
          </p>
        )}
      </div>
    </div>
  );
};

export default SignUp;