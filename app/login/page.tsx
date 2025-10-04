"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Header } from "@/components/header";
import Image from "next/image";
import { Eye, EyeOff, ShieldCheck, Sparkles, Cloud } from "lucide-react";

export default function LoginPage() {
  // theme is handled globally by ThemeToggle and layout init script
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const router = useRouter();

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
        } catch {}
        router.push('/');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch {
      setError('Network error');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="relative min-h-[calc(100vh-56px)]">
        {/* Decorative gradient blobs */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-16 -left-16 size-72 rounded-full blur-3xl opacity-20 bg-primary/40" />
          <div className="absolute -bottom-24 -right-16 size-80 rounded-full blur-3xl opacity-20 bg-purple-500/40 dark:bg-purple-400/30" />
        </div>

        <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14 md:py-16">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Left brand/hero panel (hidden on small for compactness) */}
            <div className="hidden md:block">
              <div className="rounded-2xl border bg-card/70 backdrop-blur-md p-8 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <Cloud className="h-6 w-6 text-primary" />
                  <span className="text-xl font-semibold">Freezer</span>
                </div>
                <h1 className="text-3xl font-bold leading-tight mb-3">Secure, elegant S3 explorer</h1>
                <p className="text-muted-foreground mb-6">
                  Browse and preview your S3 files with a beautiful interface, rich previews, and secure access.
                </p>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-green-500" /> JWT-protected APIs</li>
                  <li className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-yellow-500" /> Rich previews for many file types</li>
                  <li className="flex items-center gap-2"><Cloud className="h-4 w-4 text-sky-500" /> Fast S3 browsing</li>
                </ul>
                <div className="mt-8 relative aspect-[16/10] w-full overflow-hidden rounded-xl border">
                  <Image src="/window.svg" alt="App preview" fill priority className="object-contain p-4" />
                </div>
              </div>
            </div>

            {/* Right login card */}
            <div className="w-full">
              <div className="w-full rounded-2xl border border-border bg-card/80 backdrop-blur shadow-lg p-6 sm:p-8">
                <div className="mb-6 text-center">
                  <h2 className="text-2xl sm:text-3xl font-bold mb-2 tracking-tight">Welcome back</h2>
                  <p className="text-muted-foreground text-sm sm:text-base">Sign in to continue</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid gap-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      placeholder="Enter your username"
                      className="h-11 rounded-xl"
                      autoComplete="username"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="Enter your password"
                        className="h-11 rounded-xl pr-10"
                        autoComplete="current-password"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-2 flex items-center text-muted-foreground hover:text-foreground"
                        onClick={() => setShowPassword((s) => !s)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {error && (
                    <div className="p-3 rounded-lg border border-destructive/20 bg-destructive/10 text-destructive text-center text-sm font-medium">
                      {error}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center gap-2 select-none">
                      <input
                        type="checkbox"
                        className="size-4 rounded border-muted-foreground/30 bg-transparent"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                      />
                      Remember me
                    </label>
                    <Link href="#" className="text-primary hover:underline">Forgot password?</Link>
                  </div>

                  <Button type="submit" size="lg" className="w-full rounded-xl font-semibold" disabled={loading}>
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5 text-primary" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                        </svg>
                        Signing in...
                      </span>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </form>

                <div className="mt-6 text-center text-sm text-muted-foreground">
                  Don&apos;t have access? <Link href="/" className="text-primary font-medium hover:underline">Go back</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
