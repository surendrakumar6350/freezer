"use client";

import {
  Search,
  ExternalLink,
  Database,
  Settings,
  Upload,
  Clock,
  RefreshCw
} from "lucide-react";
import { FileTree, S3Node } from "../../app/s3-explorer/FileTree";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

export type SidebarProps = {
  tree: S3Node | null;
  loading: boolean;
  error: string;
  onFileClick: (node: S3Node) => void;
  compact?: boolean; // when true, render icon-only, space-saving UI
};

export function Sidebar({ tree, loading, error, onFileClick, compact = false }: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab] = useState<'files' | 'recent' | 'uploads'>('files');

  return (
    <aside className="h-full flex flex-col w-full bg-[var(--sidebar)] text-[var(--sidebar-foreground)]">
      {/* Sticky Header: title + actions + search + tabs */}
      <div className="sticky top-0 z-10 bg-[var(--sidebar)]/90 backdrop-blur supports-[backdrop-filter]:bg-[var(--sidebar)]/80 border-b border-sidebar-border">
        <div className="flex items-center justify-between px-2 pr-4 py-2">
          <div className="flex items-center min-w-0">
            <Database className={cn("text-sidebar-primary", compact ? "w-4 h-4" : "w-5 h-5 mr-2")} />
            {!compact && <span className="text-lg font-semibold truncate">Storage</span>}
          </div>
          <div className="flex gap-1 items-center">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-sidebar-foreground">
                    <Settings className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">Settings</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-sidebar-foreground">
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">Open in new tab</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* Search */}
        {!compact && (
          <div className="relative px-2 pb-2">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search files..."
              className="pl-9 bg-sidebar-accent border-sidebar-border focus-visible:ring-sidebar-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0 overflow-y-auto sidebar-scrollbar-hide pr-2">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-32 gap-3">
            <RefreshCw className="w-6 h-6 text-sidebar-primary animate-spin" />
            <span className="text-sm text-muted-foreground">Loading files...</span>
          </div>
        ) : error ? (
          <div className="text-destructive bg-destructive/10 p-4 rounded-lg text-sm mb-2 space-y-2">
            <p className="font-medium">Error loading files</p>
            <p className="text-xs opacity-80">{error}</p>
            <Button size="sm" variant="outline" className="w-full mt-2">
              <RefreshCw className="w-3.5 h-3.5 mr-2" />
              Try Again
            </Button>
          </div>
        ) : tree ? (
          <div>
            {activeTab === 'files' && (
              <FileTree tree={tree} onFileClick={onFileClick} query={searchQuery} />
            )}
            {activeTab === 'recent' && (
              <div className="px-2 py-4 text-center text-sm text-muted-foreground">
                <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>Recent files will appear here</p>
              </div>
            )}
            {activeTab === 'uploads' && (
              <div className="px-2 py-4 text-center text-sm text-muted-foreground">
                <Upload className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>Uploaded files will appear here</p>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </aside>
  );
}
