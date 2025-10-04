"use client";

import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { FaFilePdf, FaFileImage, FaFileVideo, FaFileAudio, FaFileAlt, FaFileArchive, FaFileWord, FaFileExcel, FaFilePowerpoint, FaFileCode, FaFile } from "react-icons/fa";

export type FilePreviewProps = {
  url: string;
  name: string;
  mimeType?: string;
  content?: string;
  isInline?: boolean;
  onClose?: () => void;
};

export const FilePreview: React.FC<FilePreviewProps> = ({ url, name, mimeType, content, isInline = false, onClose }) => {
  const type = mimeType || getTypeFromName(name);
  const icon = getFileIcon(type);
  const ext = name.split('.').pop()?.toLowerCase() || "";

  if (isInline) {
    return (
      <div className="w-full bg-gradient-to-br from-[#0F1A2E] to-[#181F2A] rounded-xl border border-[#2A3650]/50 overflow-hidden">
        <div className="w-full flex items-center justify-between px-4 sm:px-6 py-4 border-b border-[#2A3650]/50 bg-gradient-to-r from-[#232B3E] to-[#2A3650] backdrop-blur-sm">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="p-2 bg-blue-500/20 rounded-lg backdrop-blur-sm flex-shrink-0">
              <span className="text-xl sm:text-2xl text-blue-400">{icon}</span>
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-sm sm:text-lg font-semibold text-white block truncate">{name}</span>
              <span className="text-xs sm:text-sm text-gray-400 capitalize">{type.split('/')[0] || 'file'}</span>
            </div>
          </div>
          {onClose && (
            <button
              className="text-gray-400 hover:text-white hover:bg-red-500/20 text-xl sm:text-2xl font-bold transition-all duration-200 rounded-lg p-1 sm:p-2 flex-shrink-0 ml-2"
              onClick={onClose}
              aria-label="Close preview"
            >
              ×
            </button>
          )}
        </div>
        <div className="w-full p-4 sm:p-6">
          {type.startsWith("image/") ? (
            <div className="relative group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={url} 
                alt={name} 
                className="max-h-[300px] sm:max-h-[500px] max-w-full mx-auto rounded-lg shadow-2xl border border-[#2A3650] transition-transform group-hover:scale-105" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-lg pointer-events-none" />
            </div>
          ) : type.startsWith("video/") ? (
            <div className="relative w-full bg-gradient-to-br from-[#181F2A] to-[#232B3E] rounded-lg overflow-hidden shadow-lg border border-[#2A3650]">
              <video
                src={url}
                controls
                className="w-full h-[300px] sm:h-[400px] bg-black rounded-lg"
                style={{ objectFit: 'contain' }}
                preload="metadata"
                controlsList="nodownload"
              >
                Your browser does not support the video tag.
              </video>
              <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-black/20 to-transparent pointer-events-none rounded-t-lg" />
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/20 to-transparent pointer-events-none rounded-b-lg" />
            </div>
          ) : type.startsWith("audio/") ? (
            <div className="w-full bg-gradient-to-br from-[#181F2A] to-[#232B3E] rounded-lg p-4 sm:p-6 border border-[#2A3650] shadow-lg">
              <div className="flex items-center gap-3 sm:gap-4 mb-4">
                <FaFileAudio className="text-2xl sm:text-3xl text-blue-400 flex-shrink-0" />
                <div className="min-w-0">
                  <h3 className="text-white font-medium text-sm sm:text-base truncate">{name}</h3>
                  <p className="text-gray-400 text-xs sm:text-sm">Audio File</p>
                </div>
              </div>
              <audio
                src={url}
                controls
                className="w-full bg-[#2A3650] rounded-lg"
                style={{ height: '54px' }}
                preload="metadata"
              >
                Your browser does not support the audio tag.
              </audio>
            </div>
          ) : type === "application/pdf" ? (
            <iframe src={url} className="w-full h-[300px] sm:h-[500px] rounded-lg shadow bg-white" title={name} />
          ) : isTextFile(ext) && content ? (
            <div className="w-full h-[300px] sm:h-[500px] overflow-hidden bg-gradient-to-br from-[#181F2A] to-[#232B3E] rounded-lg shadow-lg border border-[#2A3650]">
              <div className="bg-[#2A3650] px-3 sm:px-4 py-2 border-b border-[#374151] flex items-center gap-2">
                <FaFileCode className="text-blue-400 text-sm sm:text-base" />
                <span className="text-white text-xs sm:text-sm font-medium">{getLanguageFromExt(ext)}</span>
                <div className="flex gap-1 ml-auto">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full"></div>
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full"></div>
                </div>
              </div>
              <div className="h-[calc(100%-40px)] overflow-auto">
                <SyntaxHighlighter 
                  language={getLanguageFromExt(ext)} 
                  style={materialDark} 
                  wrapLongLines
                  customStyle={{
                    margin: 0,
                    padding: '0.75rem',
                    background: 'transparent',
                    fontSize: '12px',
                    lineHeight: '1.4'
                  }}
                >
                  {content}
                </SyntaxHighlighter>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center w-full py-8 sm:py-16 bg-gradient-to-br from-[#181F2A] to-[#232B3E] rounded-lg border border-[#2A3650] shadow-lg">
              <div className="p-3 sm:p-4 bg-gray-700/20 rounded-full mb-3 sm:mb-4">
                <span className="text-2xl sm:text-3xl">{icon}</span>
              </div>
              <h3 className="text-white text-base sm:text-lg font-medium mb-2">Preview not available</h3>
              <p className="text-gray-400 text-xs sm:text-sm mb-4 sm:mb-6 max-w-xs text-center px-4">
                This file type cannot be previewed in the browser. You can download it to view the content.
              </p>
              <a 
                href={url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-colors duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base"
              >
                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download File
              </a>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-[#181F2A]/90 via-[#232B3E]/90 to-[#1A2233]/90 backdrop-blur-md p-4">
      <div className="bg-gradient-to-br from-[#232B3E] to-[#181F2A] rounded-2xl shadow-2xl p-0 max-w-4xl w-full max-h-[90vh] relative flex flex-col items-center border border-[#2A3650]/50 overflow-hidden">
        <div className="w-full flex items-center justify-between px-6 py-4 border-b border-[#2A3650]/50 bg-gradient-to-r from-[#232B3E] to-[#2A3650] backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg backdrop-blur-sm">
              <span className="text-2xl text-blue-400">{icon}</span>
            </div>
            <div>
              <span className="text-lg font-semibold text-white block truncate max-w-[300px]">{name}</span>
              <span className="text-sm text-gray-400 capitalize">{type.split('/')[0] || 'file'}</span>
            </div>
          </div>
          {onClose && (
            <button
              className="text-gray-400 hover:text-white hover:bg-red-500/20 text-2xl font-bold transition-all duration-200 rounded-lg p-2"
              onClick={onClose}
              aria-label="Close preview"
            >
              ×
            </button>
          )}
        </div>
        <div className="w-full flex items-center justify-center min-h-[350px] max-h-[calc(90vh-100px)] overflow-auto px-6 py-8">
          <div className="text-white">Modal version - use isInline=true for inline preview</div>
        </div>
      </div>
    </div>
  );
};

function getTypeFromName(name: string): string {
  if (name.match(/\.(jpg|jpeg|png|gif|bmp|webp|svg)$/i)) return "image/*";
  if (name.match(/\.(mp4|webm|ogg|mov|mkv|avi)$/i)) return "video/*";
  if (name.match(/\.(mp3|wav|flac|aac|m4a)$/i)) return "audio/*";
  if (name.match(/\.pdf$/i)) return "application/pdf";
  if (name.match(/\.(txt|md|csv|json|xml|yaml|yml|log)$/i)) return "text/plain";
  if (name.match(/\.(js|ts|jsx|tsx|py|java|c|cpp|cs|go|rb|php|sh)$/i)) return "text/code";
  if (name.match(/\.(doc|docx)$/i)) return "application/msword";
  if (name.match(/\.(xls|xlsx)$/i)) return "application/vnd.ms-excel";
  if (name.match(/\.(ppt|pptx)$/i)) return "application/vnd.ms-powerpoint";
  if (name.match(/\.(zip|rar|7z|tar|gz)$/i)) return "application/zip";
  return "";
}

function getFileIcon(type: string) {
  if (type.startsWith("image/")) return <FaFileImage />;
  if (type.startsWith("video/")) return <FaFileVideo />;
  if (type.startsWith("audio/")) return <FaFileAudio />;
  if (type === "application/pdf") return <FaFilePdf />;
  if (type === "application/msword") return <FaFileWord />;
  if (type === "application/vnd.ms-excel") return <FaFileExcel />;
  if (type === "application/vnd.ms-powerpoint") return <FaFilePowerpoint />;
  if (type === "application/zip") return <FaFileArchive />;
  if (type === "text/plain") return <FaFileAlt />;
  if (type === "text/code") return <FaFileCode />;
  return <FaFile />;
}

function isTextFile(ext: string) {
  return ["txt", "md", "csv", "json", "xml", "yaml", "yml", "log", "js", "ts", "jsx", "tsx", "py", "java", "c", "cpp", "cs", "go", "rb", "php", "sh"].includes(ext);
}

function getLanguageFromExt(ext: string) {
  const map: Record<string, string> = {
    js: "javascript", ts: "typescript", jsx: "jsx", tsx: "tsx", py: "python", java: "java", c: "c", cpp: "cpp", cs: "csharp", go: "go", rb: "ruby", php: "php", sh: "bash", json: "json", xml: "xml", yaml: "yaml", yml: "yaml", md: "markdown", csv: "csv", log: "text", txt: "text"
  };
  return map[ext] || "text";
}