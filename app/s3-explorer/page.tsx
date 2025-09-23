"use client";

import React, { useEffect, useState } from "react";
import { FileTree, buildTree, S3File, S3Node } from "./FileTree";
import { ExternalLink } from "lucide-react";
import { FilePreview } from "./FilePreview";

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

  return (
    <div className="min-h-screen bg-[#0B1222] flex">
      {/* Sidebar */}
      <div className="w-64 bg-[#0F1A2E] border-r border-[#1E2A3E] p-4 flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-lg font-medium text-white">Storage</h1>
          <ExternalLink className="w-4 h-4 text-gray-400" />
        </div>
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-red-400 bg-red-400/10 p-3 rounded-lg text-sm">{error}</div>
        ) : tree ? (
          <div className="overflow-y-auto flex-1 -mx-4 px-4">
            <FileTree tree={tree} onFileClick={handleFileClick} />
          </div>
        ) : null}
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-[#0F1A2E]/50 backdrop-blur-xl rounded-xl p-6 border border-[#1E2A3E]">
            <h2 className="text-xl font-medium text-white mb-4">Welcome to S3 Explorer</h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Browse and manage your S3 bucket contents from this interface. Click on files to preview them here. Folders can be expanded to show their contents.
            </p>
            {downloading && (
              <div className="mt-6 bg-blue-500/10 text-blue-400 px-4 py-3 rounded-lg text-sm flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                Preparing your preview...
              </div>
            )}
          </div>
        </div>
      </div>

      {/* File Preview Modal */}
      {preview && (
        <FilePreview
          url={preview.url}
          name={preview.name}
          onClose={() => setPreview(null)}
        />
      )}
    </div>
  );
}
