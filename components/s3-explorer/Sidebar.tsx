import { Separator } from "../ui/separator";
import { ExternalLink } from "lucide-react";
import { FileTree, S3Node } from "../../app/s3-explorer/FileTree";
import React from "react";

export type SidebarProps = {
  tree: S3Node | null;
  loading: boolean;
  error: string;
  onFileClick: (node: S3Node) => void;
};

export function Sidebar({ tree, loading, error, onFileClick }: SidebarProps) {
  return (
    <aside className="h-full flex flex-col w-full bg-[var(--sidebar)] text-[var(--sidebar-foreground)]">
      <div className="flex items-center justify-between mb-4">
        <span className="text-lg font-medium">Storage</span>
        <div className="flex gap-2 items-center">
          <ExternalLink className="w-4 h-4 text-muted-foreground" />
        </div>
      </div>
      <Separator className="mb-2" />
      <div className="flex-1 min-h-0 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : error ? (
          <div className="text-destructive bg-destructive/10 p-3 rounded-lg text-sm">{error}</div>
        ) : tree ? (
          <FileTree tree={tree} onFileClick={onFileClick} />
        ) : null}
      </div>
    </aside>
  );
}
