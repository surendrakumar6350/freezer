import React from "react";

export type FilePreviewProps = {
  url: string;
  name: string;
  mimeType?: string;
  onClose: () => void;
};

export const FilePreview: React.FC<FilePreviewProps> = ({ url, name, mimeType, onClose }) => {
  // Simple type detection
  const type = mimeType || getTypeFromName(name);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-[#181F2A] rounded-xl shadow-2xl p-6 max-w-2xl w-full relative flex flex-col items-center">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl font-bold"
          onClick={onClose}
          aria-label="Close preview"
        >
          ×
        </button>
        <div className="mb-4 text-lg font-semibold text-white truncate w-full text-center">{name}</div>
        <div className="w-full flex items-center justify-center min-h-[300px]">
          {type.startsWith("image/") ? (
            <img src={url} alt={name} className="max-h-[400px] max-w-full rounded-lg shadow" />
          ) : type.startsWith("video/") ? (
            <video src={url} controls className="max-h-[400px] max-w-full rounded-lg shadow" />
          ) : type === "application/pdf" ? (
            <iframe src={url} className="w-full h-[400px] rounded-lg shadow bg-white" title={name} />
          ) : (
            <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">Download or open file</a>
          )}
        </div>
      </div>
    </div>
  );
};

function getTypeFromName(name: string): string {
  if (name.match(/\.(jpg|jpeg|png|gif|bmp|webp)$/i)) return "image/*";
  if (name.match(/\.(mp4|webm|ogg|mov)$/i)) return "video/*";
  if (name.match(/\.pdf$/i)) return "application/pdf";
  return "";
}
