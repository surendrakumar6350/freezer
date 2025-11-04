"use client";

import React, { useEffect, useState } from "react";

import { buildTree, S3Node } from "./FileTree";
import { FilePreview } from "./FilePreview";
import { Sidebar } from "../../components/s3-explorer/Sidebar";
import { WelcomeCard } from "../../components/s3-explorer/WelcomeCard";
import { Header } from "@/components/header";
import { PanelLeft, X, Database } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function S3ExplorerPage() {
  const [tree, setTree] = useState<S3Node | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState(false);
  const [preview, setPreview] = useState<{ url: string; name: string; mimeType?: string } | null>(null);
  const [selectedPath, setSelectedPath] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/s3")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setTree(buildTree(data.files));
        } else {
          setError(data.message || "Failed to load S3 files");
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Network error");
        setLoading(false);
      });
  }, []);

  const handleFileClick = async (node: S3Node) => {
    setDownloading(true);
    try {
      const res = await fetch(`/api/s3-url?key=${encodeURIComponent(node.path)}`);
      const data = await res.json();
      if (data.success && data.url) {
        setPreview({ url: data.url, name: node.name });
        setSelectedPath(node.path);
      } else {
        alert(data.message || "Failed to get file URL");
      }
    } catch {
      alert("Network error");
    }
    setDownloading(false);
  };

  // Sidebar resizing (desktop)
  const [sidebarWidth, setSidebarWidth] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = Number.parseInt(localStorage.getItem('s3SidebarWidth') || '', 10);
      if (!Number.isNaN(saved)) return saved;
    }
    return 356; // px
  });
  const minSidebarWidth = 56; // collapsed icon rail
  const minMainWidth = 240; // keep some space for preview/content
  const isDragging = React.useRef(false);

  // Persist width
  useEffect(() => {
    try { localStorage.setItem('s3SidebarWidth', String(sidebarWidth)); } catch {}
  }, [sidebarWidth]);

  // Clamp width on viewport resize
  useEffect(() => {
    function onResize() {
      const maxWidth = Math.max(minSidebarWidth, window.innerWidth - minMainWidth);
      setSidebarWidth((w) => Math.min(Math.max(w, minSidebarWidth), maxWidth));
    }
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [minMainWidth]);

  // Start drag handler attaches listeners until mouseup
  const startResize = () => {
    isDragging.current = true;
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const maxWidth = Math.max(minSidebarWidth, window.innerWidth - minMainWidth);
      const next = Math.min(Math.max(e.clientX, minSidebarWidth), maxWidth);
      setSidebarWidth(next);
      document.body.style.cursor = 'col-resize';
    };
    const onMouseUp = () => {
      isDragging.current = false;
      document.body.style.cursor = '';
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  // Mobile sidebar open state
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close on Escape when mobile sidebar is open
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mobileOpen]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <div className="flex flex-row flex-1 min-h-0">
        {/* Desktop Sidebar (md and up) */}
        <div
          className="relative border-r flex-col transition-all duration-300 order-1 bg-[var(--sidebar)] h-[calc(100vh-56px)] max-h-[calc(100vh-56px)] hidden md:flex shadow-sm"
          style={{ width: sidebarWidth }}
        >
          {/* Resizer */}
          <div
            className="absolute right-0 top-0 h-full w-2.5 cursor-col-resize z-10 hover:bg-sidebar-primary/20 active:bg-sidebar-primary/30"
            onMouseDown={startResize}
            onDoubleClick={() => {
              const maxWidth = Math.max(minSidebarWidth, window.innerWidth - minMainWidth);
              setSidebarWidth(maxWidth);
            }}
            style={{ userSelect: 'none' }}
            role="separator"
            aria-orientation="vertical"
            aria-label="Resize sidebar"
          />
          {/* Sidebar Content */}
          <div className="flex flex-col flex-1 min-h-0 p-4">
            <Sidebar 
              tree={tree} 
              loading={loading} 
              error={error} 
              onFileClick={handleFileClick}
              compact={sidebarWidth < 280}
              activePath={selectedPath}
            />
          </div>
        </div>

        {/* Mobile Sidebar (drawer) */}
        {/* Overlay */}
        {mobileOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-30 md:hidden backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
        )}
        {/* Drawer */}
        <div
          className={`fixed z-40 md:hidden left-0 top-[56px] bottom-0 w-[85vw] max-w-xs bg-[var(--sidebar)] border-r shadow-xl transform transition-all duration-300 ease-in-out ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
          role="dialog"
          aria-modal="true"
          aria-label="File browser"
        >
          <div className="flex flex-col h-full p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-base font-semibold flex items-center">
                <Database className="w-4 h-4 text-sidebar-primary mr-2" />
                Storage
              </span>
              <Button variant="ghost" size="icon" onClick={() => setMobileOpen(false)} aria-label="Close files" 
                className="rounded-full hover:bg-sidebar-accent">
                <X className="h-5 w-5" />
              </Button>
            </div>
            <Sidebar 
              tree={tree} 
              loading={loading} 
              error={error} 
              onFileClick={(n) => { setMobileOpen(false); handleFileClick(n); }}
              activePath={selectedPath}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 order-2 min-h-0 h-[calc(100vh-56px)] overflow-auto">
          {/* Mobile open sidebar button */}
          <div className="md:hidden mb-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setMobileOpen(true)} 
              aria-label="Open files"
              className="shadow-sm hover:shadow hover:bg-background/50 transition-all duration-200"
            >
              <PanelLeft className="h-4 w-4 mr-2" />
              <span className="font-medium">Browse Files</span>
            </Button>
          </div>
          {preview ? (
            <FilePreview
              url={preview.url}
              name={preview.name}
              isInline={true}
              onClose={() => setPreview(null)}
            />
          ) : (
            <WelcomeCard downloading={downloading} />
          )}
        </div>
      </div>
    </div>
  );
}
