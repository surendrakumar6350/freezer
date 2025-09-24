"use client";

import React, { useEffect, useState } from "react";

import { FileTree, buildTree, S3File, S3Node } from "./FileTree";
import { FilePreview } from "./FilePreview";
import { Sidebar } from "../../components/s3-explorer/Sidebar";
import { WelcomeCard } from "../../components/s3-explorer/WelcomeCard";

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

  return (
    <div className="min-h-screen bg-background flex flex-row">
      {/* Sidebar */}
      <div
        className="relative border-r flex flex-col transition-all duration-200 h-screen max-h-screen order-1 bg-background"
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

      {/* Main Content */}
      <div className="flex-1 p-4 sm:p-6 lg:p-8 order-2">
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
  );
}
