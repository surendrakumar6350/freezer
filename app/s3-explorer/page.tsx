"use client";

import React, { useEffect, useState } from "react";

import { buildTree, S3File, S3Node } from "./FileTree";
import { FilePreview } from "./FilePreview";
import { Sidebar } from "../../components/s3-explorer/Sidebar";
import { WelcomeCard } from "../../components/s3-explorer/WelcomeCard";
import { Header } from "@/components/header";
import { PanelLeft, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function S3ExplorerPage() {
  const [files, setFiles] = useState<S3File[]>([]);
  const [tree, setTree] = useState<S3Node | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState(false);
  const [preview, setPreview] = useState<{ url: string; name: string; mimeType?: string } | null>(null);

  useEffect(() => {
    fetch("/api/s3")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setFiles(data.files);
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
      } else {
        alert(data.message || "Failed to get file URL");
      }
    } catch {
      alert("Network error");
    }
    setDownloading(false);
  };

  // Sidebar resizing only
  const [sidebarWidth, setSidebarWidth] = useState(256); // px
  const minSidebarWidth = 56;
  const maxSidebarWidth = 400;
  const isDragging = React.useRef(false);

  // Mouse events for resizing
  React.useEffect(() => {
    function onMouseMove(e: MouseEvent) {
      if (!isDragging.current) return;
      let newWidth = e.clientX;
      if (newWidth < minSidebarWidth) newWidth = minSidebarWidth;
      if (newWidth > maxSidebarWidth) newWidth = maxSidebarWidth;
      setSidebarWidth(newWidth);
    }
    function onMouseUp() {
      isDragging.current = false;
      document.body.style.cursor = '';
    }
    if (isDragging.current) {
      document.body.style.cursor = 'col-resize';
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      document.body.style.cursor = '';
    };
  }, []);

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
          className="relative border-r flex-col transition-all duration-200 order-1 bg-[var(--sidebar)] h-[calc(100vh-56px)] max-h-[calc(100vh-56px)] hidden md:flex"
          style={{ width: sidebarWidth }}
        >
          {/* Resizer */}
          <div
            className="absolute right-0 top-0 h-full w-1.5 cursor-col-resize z-10"
            onMouseDown={() => (isDragging.current = true)}
            style={{ userSelect: 'none' }}
          />
          {/* Sidebar Content */}
          <div className="flex flex-col flex-1 min-h-0 p-4 pt-10">
            <Sidebar tree={tree} loading={loading} error={error} onFileClick={handleFileClick} />
          </div>
        </div>

        {/* Mobile Sidebar (drawer) */}
        {/* Overlay */}
        {mobileOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-30 md:hidden"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
        )}
        {/* Drawer */}
        <div
          className={`fixed z-40 md:hidden left-0 top-[56px] bottom-0 w-[85vw] max-w-xs bg-[var(--sidebar)] border-r transform transition-transform duration-200 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
          role="dialog"
          aria-modal="true"
          aria-label="File browser"
        >
          <div className="flex flex-col h-full p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-base font-medium">Storage</span>
              <Button variant="ghost" size="icon" onClick={() => setMobileOpen(false)} aria-label="Close files">
                <X className="h-5 w-5" />
              </Button>
            </div>
            <Sidebar tree={tree} loading={loading} error={error} onFileClick={(n) => { setMobileOpen(false); handleFileClick(n); }} />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 order-2 min-h-0 h-[calc(100vh-56px)] overflow-auto">
          {/* Mobile open sidebar button */}
          <div className="md:hidden mb-3">
            <Button variant="outline" size="sm" onClick={() => setMobileOpen(true)} aria-label="Open files">
              <PanelLeft className="h-4 w-4 mr-2" />
              Files
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
