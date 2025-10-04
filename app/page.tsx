"use client";

import Link from "next/link";
import { ArrowRight, FolderTree, ShieldCheck, Cloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/header";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/10 to-transparent" />
        <div className="container mx-auto px-6 pt-20 pb-12">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs text-primary">
              <Cloud className="h-3.5 w-3.5" />
              S3 Explorer
            </span>
            <h1 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl">
              Manage and preview your S3 files with a modern, elegant UI
            </h1>
            <p className="mt-4 text-muted-foreground max-w-2xl">
              Browse buckets, preview images, videos, docs, and code inline, and quickly share links—all in one powerful interface.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/s3-explorer" className="inline-flex items-center gap-2">
                  Open S3 Explorer
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/login">Login</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-6 py-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <FolderTree className="h-5 w-5 text-primary" />
              Fast navigation
            </CardTitle>
            <CardDescription>Tree view with instant previews and keyboard-friendly navigation.</CardDescription>
          </CardHeader>
          <CardContent>
            Browse folders, select files, and view details without page reloads.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-primary" />
              Secure access
            </CardTitle>
            <CardDescription>Signed URLs and protected routes out of the box.</CardDescription>
          </CardHeader>
          <CardContent>
            Your content stays safe with temporary links and server-side guards.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Cloud className="h-5 w-5 text-primary" />
              Rich previews
            </CardTitle>
            <CardDescription>Images, video, audio, PDF, code, markdown, and more.</CardDescription>
          </CardHeader>
          <CardContent>
            Open files inline with a polished, responsive viewing experience.
          </CardContent>
        </Card>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-6 pb-20">
        <div className="rounded-2xl border border-border bg-card/80 backdrop-blur p-8 sm:p-10 text-center">
          <h2 className="text-2xl sm:text-3xl font-semibold">Ready to explore your storage?</h2>
          <p className="mt-2 text-muted-foreground">Jump straight into the explorer or sign in to manage access.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <Link href="/s3-explorer" className="inline-flex items-center gap-2">
                Open S3 Explorer
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/login">Login</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
