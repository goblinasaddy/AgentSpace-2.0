"use client";

import { useState } from "react";
import { X, Lock, UserCheck, AlertCircle } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (token: string, user: any) => void;
}

export function AuthModal({ isOpen, onClose, onAuthSuccess }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("developer@agentspace.dev");
  const [username, setUsername] = useState("devuser");
  const [password, setPassword] = useState("Password123!");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const endpoint = isLogin ? "/api/v1/auth/login" : "/api/v1/auth/register";
      const body = isLogin
        ? { email, password }
        : { email, username, password, displayName: username };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error?.message || "Authentication failed.");
      }

      onAuthSuccess(data.data.token, data.data.user);
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#121215] border border-[#27272a] rounded-xl shadow-2xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[#27272a] pb-3">
          <h2 className="text-base font-bold text-white font-mono flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#8b5cf6]" />
            <span>{isLogin ? "Authenticate Session" : "Create Developer Account"}</span>
          </h2>
          <button onClick={onClose} className="text-[#71717a] hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="p-3 rounded bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-[11px] font-mono text-[#a1a1aa] uppercase">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full mt-1 p-2.5 rounded bg-[#09090b] border border-[#27272a] text-xs text-white font-mono focus:border-[#8b5cf6] focus:outline-none"
            />
          </div>

          {!isLogin && (
            <div>
              <label className="text-[11px] font-mono text-[#a1a1aa] uppercase">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full mt-1 p-2.5 rounded bg-[#09090b] border border-[#27272a] text-xs text-white font-mono focus:border-[#8b5cf6] focus:outline-none"
              />
            </div>
          )}

          <div>
            <label className="text-[11px] font-mono text-[#a1a1aa] uppercase">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full mt-1 p-2.5 rounded bg-[#09090b] border border-[#27272a] text-xs text-white font-mono focus:border-[#8b5cf6] focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 bg-[#8b5cf6] hover:bg-[#7c3aed] disabled:opacity-50 text-white font-mono text-xs font-bold rounded-lg shadow-lg shadow-[#8b5cf6]/20 transition-all"
          >
            {isLoading ? "Processing..." : isLogin ? "Sign In" : "Register Account"}
          </button>
        </form>

        <div className="pt-3 border-t border-[#27272a] text-center">
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-xs font-mono text-[#a78bfa] hover:underline"
          >
            {isLogin ? "Need an account? Register" : "Already registered? Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
}
