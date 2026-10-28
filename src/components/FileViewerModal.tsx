import React, { useState } from 'react';
import { X, Download, Copy, Check, FileCode } from 'lucide-react';
import { LabFile } from '../types/lab';
import { downloadLabFile, formatFileSize } from '../utils/storage';

interface FileViewerModalProps {
  file: LabFile;
  onClose: () => void;
}

export const FileViewerModal: React.FC<FileViewerModalProps> = ({ file, onClose }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(file.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div 
        className="relative flex flex-col w-full max-w-4xl max-h-[88vh] rounded-xl border border-[#e4ded5] bg-[#faf8f5] text-[#1c1917] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-[#e8e4dc] px-6 py-4 bg-[#f4f0e8]">
          <div className="flex items-center gap-3">
            <div className="rounded-md bg-[#1e3a5f] p-1.5 text-white">
              <FileCode className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-mono text-sm font-bold text-[#1c1917]">{file.name}</h3>
              <p className="text-xs text-[#78716c] font-mono">
                {formatFileSize(file.size)} · {file.type.toUpperCase()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {file.isText && (
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 rounded-lg border border-[#d6cfc4] bg-white px-3 py-1.5 text-xs font-medium text-[#44403c] hover:bg-[#fbfaf8] transition-colors cursor-pointer"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            )}

            <button
              onClick={() => downloadLabFile(file)}
              className="flex items-center gap-1.5 rounded-lg bg-[#1e3a5f] px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-[#152a45] transition-colors cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download File</span>
            </button>

            <button
              onClick={onClose}
              className="ml-2 rounded-lg p-1.5 text-[#78716c] hover:bg-[#e8e3d8] hover:text-[#1c1917] transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {file.isText ? (
            <div className="rounded-lg border border-[#e8e4dc] bg-[#1c1b18] text-[#f4f1ea] p-4 font-mono text-xs leading-relaxed overflow-x-auto selection:bg-amber-800">
              <pre>
                <code>{file.content}</code>
              </pre>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-[#d6cfc4] rounded-xl bg-white">
              <FileCode className="h-12 w-12 text-[#1e3a5f] mb-3" />
              <h4 className="font-serif text-lg font-semibold text-[#1c1917] mb-1">
                {file.name}
              </h4>
              <p className="text-xs text-[#78716c] max-w-md mb-5 leading-relaxed font-mono">
                {formatFileSize(file.size)} · {file.type === 'cisco-pkt' ? 'Cisco Packet Tracer Binary File' : 'Binary File'}
              </p>
              <button
                onClick={() => downloadLabFile(file)}
                className="flex items-center gap-2 rounded-lg bg-[#1e3a5f] px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-[#152a45] transition-colors cursor-pointer"
              >
                <Download className="h-4 w-4" />
                <span>Download {file.name}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
