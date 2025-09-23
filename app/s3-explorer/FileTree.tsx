import React, { useState } from "react";
import { Folder, File, ChevronDown, ChevronRight } from "lucide-react";

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
};

export const FileTree: React.FC<FileTreeProps> = ({ tree, onFileClick }) => {
  return (
    <div className="w-full">
      <TreeNode node={tree} onFileClick={onFileClick} level={0} />
    </div>
  );
};

function TreeNode({ node, onFileClick, level }: { node: S3Node; onFileClick: (node: S3Node) => void; level: number }) {
  const [open, setOpen] = useState(level === 0);
  
  if (node.type === "file") {
    return (
      <div
        className="group flex items-center px-2 py-1.5 cursor-pointer rounded-lg transition-colors hover:bg-white/5 relative"
        onClick={() => onFileClick(node)}
      >
        <File className="w-4 h-4 text-blue-400/80 shrink-0" />
        <span className="ml-2 text-sm text-gray-300 truncate">{node.name}</span>
        
        {/* Info tooltip on hover */}
        <div className="absolute left-full ml-2 hidden group-hover:block bg-[#1E2A3E] text-xs text-gray-300 p-2 rounded-lg shadow-xl border border-[#2A3A52] whitespace-nowrap z-10">
          <div className="mb-1">Size: {formatSize(node.size!)}</div>
          <div>Modified: {formatDate(node.lastModified!)}</div>
        </div>

        {/* Metadata (visible on wider screens) */}
        <div className="hidden md:flex ml-auto pl-4 text-xs text-gray-500 shrink-0">
          {formatSize(node.size!)}
        </div>
      </div>
    );
  }

  return (
    <div>
      {level > 0 && (
        <button
          className="flex items-center w-full px-2 py-1.5 rounded-lg transition-colors hover:bg-white/5 group"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? (
            <ChevronDown className="w-4 h-4 text-gray-500 shrink-0" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-500 shrink-0" />
          )}
          <Folder className="w-4 h-4 text-yellow-400/90 ml-1 shrink-0" />
          <span className="ml-1.5 text-sm text-gray-200 font-medium truncate">{node.name}</span>
          
          {/* Folder info (items count) */}
          <span className="ml-auto text-xs text-gray-500 group-hover:text-gray-400">
            {node.children?.length || 0} items
          </span>
        </button>
      )}
      
      {open && node.children && (
        <div className={`ml-${level > 0 ? '4' : '0'} ${level > 0 ? 'border-l border-[#2A3A52]' : ''}`}>
          {node.children
            .sort((a, b) => {
              // Folders first, then files
              if (a.type === 'folder' && b.type === 'file') return -1;
              if (a.type === 'file' && b.type === 'folder') return 1;
              return a.name.localeCompare(b.name);
            })
            .map((child) => (
              <TreeNode key={child.path} node={child} onFileClick={onFileClick} level={level + 1} />
            ))}
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
