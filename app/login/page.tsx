"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Header } from "@/components/header";

export default function LoginPage() {
  // theme is handled globally by ThemeToggle and layout init script
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
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
        localStorage.setItem('token', data.token);
        router.push('/');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Network error');
    }
    setLoading(false);
  };

  return (
  <div className="min-h-screen bg-background">
      <Header />
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)]">
        <div className="w-full max-w-md">
          <div className="w-full rounded-2xl border border-border bg-card/80 backdrop-blur shadow-lg p-8 sm:p-10 mt-4">
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold mb-2 tracking-tight">Welcome back</h2>
              <p className="text-muted-foreground text-base">Please sign in to continue</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
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
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                  className="h-11 rounded-xl"
                />
              </div>
              {error && (
                <div className="p-3 rounded-lg border border-destructive/20 bg-destructive/10 text-destructive text-center text-sm font-medium">
                  {error}
                </div>
              )}
              <Button type="submit" size="lg" className="w-full rounded-xl font-semibold" disabled={loading}>
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-primary" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                    Logging in...
                  </span>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
            <div className="mt-8 text-center text-sm text-muted-foreground">
              Don&apos;t have access? <Link href="/" className="text-primary font-medium hover:underline">Go back</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
