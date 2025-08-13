import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email && name && password) {
      await signUp(email);
      navigate("/welcome");
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
          <h1 className="text-3xl font-bold text-zinc-900">Create your account</h1>
          <p className="text-zinc-600 mt-2">Get started with your content journey</p>
        </div>

        <div className="bg-white rounded-xl border border-zinc-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
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
                required
              />
            </div>

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
              <p className="text-xs text-zinc-500 mt-1">At least 6 characters</p>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-zinc-900 text-white font-medium rounded-lg hover:bg-zinc-800 transition-colors"
            >
              Create Account
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-zinc-600">
              Already have an account?{" "}
              <Link to="/signin" className="font-medium text-zinc-900 hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        <p className="text-xs text-zinc-500 text-center mt-6">
          By signing up, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default SignUp;