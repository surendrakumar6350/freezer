"use client";

import Link from "next/link";
import { Cloud } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export function Header() {
  return (
    <header className="w-full border-b border-border bg-card/80 backdrop-blur sticky top-0 z-30">
      <div className="flex items-center justify-between py-3 px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold text-lg text-primary">
          <Cloud className="h-6 w-6" />
          Freezer
        </Link>
        <ThemeToggle variant="outline" />
      </div>
    </header>
  );
}