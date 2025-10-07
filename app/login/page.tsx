"use client";

import React, { useMemo, useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Header } from "@/components/header";
import { Eye, EyeOff, Cloud, User, Lock, Github, Fingerprint, LogIn } from "lucide-react";

export default function LoginPage() {
  // theme is handled globally by ThemeToggle and layout init script
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        try {
          if (rememberMe) localStorage.setItem('token', data.token);
          else sessionStorage.setItem('token', data.token);
        } catch { }
        window.location.href = '/';
      } else {
        setError(data.message || 'Login failed');
      }
    } catch {
      setError('Network error');
    }
    setLoading(false);
  };

  const canSubmit = useMemo(() => username.trim().length > 0 && password.trim().length > 0, [username, password]);

  // Animation state for card fade-in/slide-up
  const [animate, setAnimate] = useState(false);
  useEffect(() => {
    setTimeout(() => setAnimate(true), 100);
  }, []);

  // Social login notice
  const [socialNotice, setSocialNotice] = useState<string | null>(null);
  const handleSocialClick = (provider: string) => {
    setSocialNotice(`${provider} sign-in is coming soon.`);
    const timer = setTimeout(() => setSocialNotice(null), 2500);
    return () => clearTimeout(timer);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="min-h-[calc(100vh-56px)] flex flex-col items-center justify-center py-10">
        {/* Logo and branding */}
        <div className="flex flex-col items-center mb-5 px-4">
          <Cloud className="h-10 w-10 text-primary mb-2" />
          <span className="text-xl font-semibold text-foreground">Freezer</span>
        </div>
        {/* Animated card */}
        <div className={`w-full max-w-sm md:max-w-md mx-auto px-2 sm:px-4 transition-all duration-500 ${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="rounded-2xl border border-border bg-card/90 backdrop-blur shadow-xl p-4 sm:p-5">
            <div className="mb-3 text-center">
              <h2 className="text-lg sm:text-xl font-bold mb-1 tracking-tight">Sign in to Freezer</h2>
              <p className="text-muted-foreground text-xs">Access your S3 files securely</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <User className="h-4 w-4" />
                  </span>
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    placeholder="Enter your username"
                    className="h-10 pl-9 rounded-xl text-sm"
                    autoComplete="username"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <Lock className="h-4 w-4" />
                  </span>
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter your password"
                    className="h-10 pl-9 pr-9 rounded-xl text-sm"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPassword((s) => !s)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-lg border border-destructive/20 bg-destructive/10 text-destructive text-center text-xs font-medium">
                  {error}
                </div>
              )}

              {/* Forgot password and remember me stacked */}
              <div className="flex flex-col gap-1 text-xs">
                <Link href="#" className="text-primary hover:underline text-left">Forgot password?</Link>
                <label className="flex items-center gap-2 select-none">
                  <input
                    type="checkbox"
                    className="size-4 rounded border-muted-foreground/30 bg-transparent"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  Remember me
                </label>
              </div>

              <Button
                type="submit"
                size="sm"
                className="w-full rounded-xl font-semibold text-sm py-2"
                disabled={loading || !canSubmit}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <LogIn className="h-4 w-4" /> Sign In
                  </span>
                )}
              </Button>

              {/* Social login buttons (optional, placeholder) */}
              <div className="mt-3 flex flex-col gap-1">
                <button type="button" onClick={() => handleSocialClick('Google')} className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-card text-foreground font-medium border border-border hover:bg-accent active:scale-[.99] transition">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="h-5 w-5" /> Sign in with Google
                </button>
                <button type="button" onClick={() => handleSocialClick('GitHub')} className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-card text-foreground font-medium border border-border hover:bg-accent active:scale-[.99] transition">
                  <Github className="h-4 w-4" /> Sign in with GitHub
                </button>
                <button type="button" onClick={() => handleSocialClick('AWS')} className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-card text-foreground font-medium border border-border hover:bg-accent active:scale-[.99] transition">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="https://www.svgrepo.com/show/448266/aws.svg" alt="AWS" className="h-5 w-5" /> Sign in with AWS
                </button>
                {socialNotice && (
                  <div className="text-center text-xs text-muted-foreground" aria-live="polite">{socialNotice}</div>
                )}
              </div>

              {/* Biometric login placeholder */}
              <div className="mt-2 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <Fingerprint className="h-4 w-4" /> Biometric login coming soon
              </div>

              <div className="mt-3 text-center text-xs text-muted-foreground">
                Don&apos;t have access? <Link href="/" className="text-primary font-medium hover:underline">Go back</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
