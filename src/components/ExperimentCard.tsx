import React, { useRef, useState } from 'react';
import { FileCode, Download, Eye, Plus, Trash2 } from 'lucide-react';
import { LabExperiment, LabFile } from '../types/lab';
import { downloadLabFile, formatFileSize, detectFileType } from '../utils/storage';

interface ExperimentCardProps {
  experiment: LabExperiment;
  onPreviewFile: (file: LabFile) => void;
  onDeleteExperiment: (id: string) => void;
  onAddFilesToExperiment: (id: string, newFiles: LabFile[]) => void;
}

export const ExperimentCard: React.FC<ExperimentCardProps> = ({
  experiment,
  onPreviewFile,
  onDeleteExperiment,
  onAddFilesToExperiment
}) => {
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddMoreFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const newFiles: LabFile[] = [];

    for (let i = 0; i < e.target.files.length; i++) {
      const f = e.target.files[i];
      const { type, isText } = detectFileType(f.name);

      try {
        const content = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          if (isText) reader.readAsText(f);
          else reader.readAsDataURL(f);
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = (err) => reject(err);
        });

        newFiles.push({
          id: `file_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
          name: f.name,
          size: f.size,
          type,
          content,
          isText,
          uploadedAt: new Date().toISOString()
        });
      } catch (err) {
        console.error('Failed reading file', f.name, err);
      }
    }

    if (newFiles.length > 0) {
      onAddFilesToExperiment(experiment.id, newFiles);
    }
  };

  return (
    <div className="flex flex-col justify-between rounded-xl border border-[#e8e4dc] bg-white p-6 shadow-sm hover:border-[#d6cfc4] transition-all">
      <div>
        {/* Top Unboxed Metadata Line */}
        <div className="flex items-center gap-2 text-xs font-mono text-[#78716c]">
          <span className="font-semibold text-[#1e3a5f]">{experiment.category}</span>
          <span aria-hidden="true" className="text-[#d6cfc4]">·</span>
          <span>{experiment.date}</span>
          <span aria-hidden="true" className="text-[#d6cfc4]">·</span>
          <span>{experiment.files.length} {experiment.files.length === 1 ? 'file' : 'files'}</span>
        </div>

        {/* Experiment Title */}
        <h3 className="font-serif text-xl font-bold tracking-tight text-[#1c1917] mt-2">
          {experiment.title}
        </h3>

        {/* Aim / Objective */}
        {experiment.aim && (
          <p className="mt-2 text-xs text-[#57534e] leading-relaxed">
            <span className="font-semibold text-[#44403c]">Aim:</span> {experiment.aim}
          </p>
        )}

        {/* Notes preview if available */}
        {experiment.notes && (
          <div className="mt-3 rounded-lg border border-[#f0ede6] bg-[#faf8f5] p-3 text-xs text-[#57534e] font-mono leading-relaxed line-clamp-3">
            {experiment.notes}
          </div>
        )}

        {/* Attached Files Section */}
        <div className="mt-4 pt-3 border-t border-[#f4f0e8] space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#78716c]">
            <span>Attached Files ({experiment.files.length})</span>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1 text-[11px] font-semibold text-[#1e3a5f] hover:underline cursor-pointer"
            >
              <Plus className="h-3 w-3" />
              <span>Attach File</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleAddMoreFiles}
              className="hidden"
            />
          </div>

          {experiment.files.length === 0 ? (
            <p className="text-xs text-[#a8a29e] italic py-1">
              No files attached yet. Click "Attach File" to upload your files.
            </p>
          ) : (
            <div className="divide-y divide-[#f4f0e8] rounded-lg border border-[#f0ede6] bg-[#fdfdfc]">
              {experiment.files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-2.5 text-xs hover:bg-[#faf8f5] transition-colors"
                >
                  <div className="flex items-center gap-2 overflow-hidden mr-2">
                    <FileCode className="h-4 w-4 text-[#1e3a5f] shrink-0" />
                    <span className="font-mono font-medium text-[#1c1917] truncate">{file.name}</span>
                    <span className="text-[11px] text-[#78716c] font-mono shrink-0">
                      ({formatFileSize(file.size)})
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {file.isText && (
                      <button
                        onClick={() => onPreviewFile(file)}
                        className="flex items-center gap-1 rounded border border-[#d6cfc4] bg-white px-2 py-1 text-[11px] font-medium text-[#44403c] hover:bg-[#f4f0e8] transition-colors cursor-pointer"
                        title="Preview code"
                      >
                        <Eye className="h-3 w-3" />
                        <span>Preview</span>
                      </button>
                    )}

                    <button
                      onClick={() => downloadLabFile(file)}
                      className="flex items-center gap-1 rounded border border-[#d6cfc4] bg-white px-2 py-1 text-[11px] font-medium text-[#1e3a5f] hover:bg-[#f4f0e8] transition-colors cursor-pointer"
                      title="Download file"
                    >
                      <Download className="h-3 w-3" />
                      <span>Download</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Card Footer Actions with Inline Non-Blocking Delete */}
      <div className="mt-5 pt-3 border-t border-[#f4f0e8] flex items-center justify-between">
        <span className="text-[11px] font-mono text-[#a8a29e]">
          ID: {experiment.id.slice(0, 8)}
        </span>

        {isConfirmingDelete ? (
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-rose-700">Delete this experiment?</span>
            <button
              onClick={() => {
                onDeleteExperiment(experiment.id);
                setIsConfirmingDelete(false);
              }}
              className="rounded bg-rose-600 px-2.5 py-1 text-xs font-bold text-white hover:bg-rose-700 transition-colors cursor-pointer"
            >
              Yes, Delete
            </button>
            <button
              onClick={() => setIsConfirmingDelete(false)}
              className="rounded border border-[#d6cfc4] bg-white px-2 py-1 text-xs text-[#57534e] hover:bg-[#f4f0e8] transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsConfirmingDelete(true)}
            className="flex items-center gap-1 text-xs text-[#a8a29e] hover:text-rose-600 transition-colors cursor-pointer"
            title="Delete experiment"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Delete</span>
          </button>
        )}
      </div>
    </div>
  );
};
