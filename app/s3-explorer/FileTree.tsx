import React, { useState } from "react";
import { 
  Folder, File, ChevronDown, ChevronRight, 
  MoreHorizontal, Download, ExternalLink, 
  AlertCircle, Clock
} from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Badge } from "@/components/ui/badge";

export type S3File = {
  key: string;
  size: number;
  lastModified: string;
};

export type S3Node = {
  name: string;
  path: string;
  type: "folder" | "file";
  children?: S3Node[];
  size?: number;
  lastModified?: string;
};

// Convert flat S3 key list to nested tree
export function buildTree(files: S3File[]): S3Node {
  const root: S3Node = { name: "root", path: "", type: "folder", children: [] };
  for (const file of files) {
    const parts = file.key.split("/");
    let current = root;
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const isFile = i === parts.length - 1;
      let node = current.children!.find((n) => n.name === part);
      if (!node) {
        node = {
          name: part,
          path: current.path ? `${current.path}/${part}` : part,
          type: isFile ? "file" : "folder",
        };
        if (!isFile) node.children = [];
        if (isFile) {
          node.size = file.size;
          node.lastModified = file.lastModified;
        }
        current.children!.push(node);
      }
      current = node;
    }
  }
  return root;
}

export type FileTreeProps = {
  tree: S3Node;
  onFileClick: (node: S3Node) => void;
  query?: string;
  activePath?: string | null;
};

export const FileTree: React.FC<FileTreeProps> = ({ tree, onFileClick, query, activePath }) => {
  return (
    <div className="w-full">
      <TreeNode node={tree} onFileClick={onFileClick} level={0} query={query} activePath={activePath} />
    </div>
  );
};

function TreeNode({ node, onFileClick, level, query, activePath }: { node: S3Node; onFileClick: (node: S3Node) => void; level: number; query?: string; activePath?: string | null }) {
  const [open, setOpen] = useState(level === 0);
  const q = (query || '').toLowerCase();
  const matches = node.name.toLowerCase().includes(q);
  const childrenMatch = node.children?.some(c => (c.name.toLowerCase().includes(q)) || (c.children && c.children.length));
  const shouldRender = !q || matches || childrenMatch || level === 0;
  if (!shouldRender) return null;
  
  if (node.type === "file") {
    const ext = node.name.includes('.') ? node.name.split('.').pop()!.toLowerCase() : '';
    const getFileIconColor = () => {
      if (ext === 'pdf') return 'text-red-500';
      if (['jpg','jpeg','png','gif','bmp','svg','webp'].includes(ext)) return 'text-sky-400';
      if (['mp4','mov','avi','mkv','webm'].includes(ext)) return 'text-purple-400';
      if (['doc','docx'].includes(ext)) return 'text-blue-600';
      if (['xls','xlsx','csv'].includes(ext)) return 'text-emerald-600';
      if (['ppt','pptx'].includes(ext)) return 'text-orange-500';
      if (['zip','rar','7z','gz'].includes(ext)) return 'text-amber-500';
      return 'text-primary/80';
    };
    const handleRename = () => {
      const next = typeof window !== 'undefined' ? window.prompt('Rename file', node.name) : null;
      if (next && next !== node.name) {
        // Placeholder: hook your rename logic here
        console.log('Rename', node.path, '->', next);
      }
    };
    const handleDelete = () => {
      const ok = typeof window !== 'undefined' ? window.confirm(`Delete ${node.name}?`) : false;
      if (ok) {
        // Placeholder: hook your delete logic here
        console.log('Delete', node.path);
      }
    };
    const isActive = !!activePath && node.path === activePath;

    return (
      <ContextMenu>
        <ContextMenuTrigger>
          <div
            className={cn(
              // subtle zebra rows + hover polish
              "group flex items-center px-2 sm:px-3 py-1.5 cursor-pointer rounded-md transition-all duration-200 odd:bg-sidebar-accent/10 hover:bg-sidebar-accent/50 hover:shadow-sm active:bg-sidebar-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
              isActive && 'bg-sidebar-primary/20 ring-2 ring-sidebar-ring'
            )}
            onClick={() => onFileClick(node)}
            tabIndex={0}
            aria-current={isActive ? 'true' : undefined}
          >
            <div className="flex items-center min-w-0 flex-1">
              <File className={cn('w-4 h-4 shrink-0', getFileIconColor())} />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="ml-2 text-[13px] sm:text-sm text-sidebar-foreground truncate font-medium">
                      {node.name}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs break-words">
                    {node.name}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            {/* right-side badges and affordances */}
            <div className="ml-auto flex items-center gap-2">
              {ext && (
                <Badge variant="secondary" className="hidden sm:inline-flex text-[10px] px-1.5 py-0.5 bg-sidebar-accent/70">
                  {ext.toUpperCase()}
                </Badge>
              )}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <Badge 
                        variant="secondary" 
                        className="text-[10px] px-1.5 py-0.5 hidden sm:flex items-center gap-1 bg-sidebar-accent/70"
                      >
                        {formatSize(node.size!)}
                      </Badge>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="flex flex-col gap-2 p-3">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="text-xs">Size: {formatSize(node.size!)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="text-xs">Modified: {formatDate(node.lastModified!)}</span>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <MoreHorizontal className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-52">
          <ContextMenuItem onClick={() => onFileClick(node)}>
            <ExternalLink className="mr-2 h-4 w-4" />
            <span>Preview</span>
          </ContextMenuItem>
          <ContextMenuItem>
            <Download className="mr-2 h-4 w-4" />
            <span>Download</span>
          </ContextMenuItem>
          <ContextMenuItem onClick={handleRename}>
            <span className="mr-2 h-4 w-4 inline-flex items-center justify-center">✏️</span>
            <span>Rename</span>
          </ContextMenuItem>
          <ContextMenuItem onClick={handleDelete}>
            <span className="mr-2 h-4 w-4 inline-flex items-center justify-center">🗑️</span>
            <span>Delete</span>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    );
  }

  return (
    <div>
      {level > 0 && (
        <button
          className={cn(
            "flex items-center w-full px-2 sm:px-3 py-1.5 rounded-md transition-all duration-200 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
            "hover:bg-sidebar-accent/60",
            open && "bg-sidebar-accent/30"
          )}
          onClick={() => setOpen((o) => !o)}
          tabIndex={0}
        >
          {open ? (
            <ChevronDown className="w-4 h-4 text-sidebar-primary/70 shrink-0" />
          ) : (
            <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
          )}
          <Folder className={cn(
            "w-4 h-4 ml-1 shrink-0",
            open ? "text-sidebar-primary" : "text-amber-500/80" 
          )} />
          <span className={cn(
            "ml-2 text-sm font-medium truncate",
            open ? "text-sidebar-primary" : "text-sidebar-foreground"
          )}>
            {node.name}
          </span>
          
          {/* Folder item count badge */}
          <Badge 
            variant={open ? "info" : "secondary"}
            className={cn(
              "ml-auto text-[9px] h-5 min-w-5 flex items-center justify-center",
              !open && "bg-sidebar-accent/70"
            )}
          >
            {node.children?.length || 0}
          </Badge>
        </button>
      )}
      {open && node.children && (
        <div className={`${level > 0 ? 'ml-3 sm:ml-4 pl-2 border-l border-sidebar-border/40' : ''}`}>
          {(() => {
            const folders = node.children!.filter(c => c.type === 'folder').sort((a,b) => a.name.localeCompare(b.name));
            const files = node.children!.filter(c => c.type === 'file').sort((a,b) => a.name.localeCompare(b.name));
            return (
              <>
                {folders.map((child) => (
                  <TreeNode key={child.path} node={child} onFileClick={onFileClick} level={level + 1} query={query} activePath={activePath} />
                ))}
                {folders.length > 0 && files.length > 0 && (
                  <div className="my-1 h-px bg-sidebar-border/40" />
                )}
                {files.map((child) => (
                  <TreeNode key={child.path} node={child} onFileClick={onFileClick} level={level + 1} query={query} activePath={activePath} />
                ))}
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
}

function formatSize(size: number): string {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  if (size < 1024 * 1024 * 1024) return `${(size / 1024 / 1024).toFixed(1)} MB`;
  return `${(size / 1024 / 1024 / 1024).toFixed(1)} GB`;
}

function formatDate(date: string): string {
  return new Date(date).toLocaleString();
}
