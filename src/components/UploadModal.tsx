import React, { useState, useRef } from 'react';
import { X, Upload, FileCode, Trash2, Plus, AlertCircle, Eye, Network } from 'lucide-react';
import { LabExperiment, LabFile, CATEGORIES, LabCategory } from '../types/lab';
import { detectFileType, formatFileSize } from '../utils/storage';

interface UploadModalProps {
  onClose: () => void;
  onSave: (experiment: LabExperiment) => void;
  initialCategory?: LabCategory;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  onClose,
  onSave,
  initialCategory = 'Cisco Packet Tracer'
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<LabCategory>(initialCategory);
  const [aim, setAim] = useState('');
  const [notes, setNotes] = useState('');
  const [files, setFiles] = useState<LabFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFileList = async (fileList: FileList) => {
    setErrorMessage('');
    const newFiles: LabFile[] = [];

    for (let i = 0; i < fileList.length; i++) {
      const f = fileList[i];
      const { type, isText } = detectFileType(f.name);

      // Auto-suggest category if not modified
      if (files.length === 0 && newFiles.length === 0) {
        if (type === 'cisco-pkt') setCategory('Cisco Packet Tracer');
        else if (type === 'python') setCategory('Python Programs');
      }

      try {
        const content = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          if (isText) {
            reader.readAsText(f);
          } else {
            reader.readAsDataURL(f);
          }
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = (e) => reject(e);
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
        console.error('Failed to read file:', f.name, err);
      }
    }

    setFiles((prev) => [...prev, ...newFiles]);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFileList(e.target.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFileList(e.dataTransfer.files);
    }
  };

  const handleRemoveFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMessage('Please provide an experiment title.');
      return;
    }

    const newExperiment: LabExperiment = {
      id: `exp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      title: title.trim(),
      category,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      aim: aim.trim(),
      notes: notes.trim(),
      files
    };

    onSave(newExperiment);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div 
        className="relative flex flex-col w-full max-w-2xl rounded-xl border border-[#e4ded5] bg-[#faf8f5] text-[#1c1917] shadow-xl overflow-hidden my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#e8e4dc] px-6 py-4 bg-[#f4f0e8]">
          <div>
            <h3 className="font-serif text-xl font-semibold text-[#1c1917]">
              Add Lab Experiment &amp; Upload Files
            </h3>
            <p className="text-xs text-[#78716c] mt-0.5">
              Attach your Cisco Packet Tracer (.pkt) or Python (.py) files.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-[#78716c] hover:bg-[#e8e3d8] hover:text-[#1c1917] transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto max-h-[75vh]">
          {errorMessage && (
            <div className="flex items-center gap-2 rounded-lg bg-rose-50 border border-rose-200 px-3.5 py-2 text-xs text-rose-800">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Title & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#44403c]">
                Experiment Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. VLAN Trunking or Socket Client-Server"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-lg border border-[#d6cfc4] bg-white px-3.5 py-2 text-xs text-[#1c1917] placeholder-[#a8a29e] focus:border-[#1e3a5f] focus:outline-none focus:ring-1 focus:ring-[#1e3a5f]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#44403c]">
                Lab Discipline
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as LabCategory)}
                className="w-full rounded-lg border border-[#d6cfc4] bg-white px-3 py-2 text-xs text-[#1c1917] focus:border-[#1e3a5f] focus:outline-none focus:ring-1 focus:ring-[#1e3a5f] cursor-pointer"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Aim / Objective */}
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#44403c]">
              Aim / Objective
            </label>
            <input
              type="text"
              placeholder="e.g. To configure inter-VLAN routing and analyze frame tags."
              value={aim}
              onChange={(e) => setAim(e.target.value)}
              className="w-full rounded-lg border border-[#d6cfc4] bg-white px-3.5 py-2 text-xs text-[#1c1917] placeholder-[#a8a29e] focus:border-[#1e3a5f] focus:outline-none focus:ring-1 focus:ring-[#1e3a5f]"
            />
          </div>

          {/* Drag & Drop File Upload Area */}
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#44403c]">
              Attach Files (Cisco .pkt, Python .py, Text, PDF)
            </label>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center cursor-pointer transition-colors ${
                isDragging
                  ? 'border-[#1e3a5f] bg-[#eef3f8]'
                  : 'border-[#d6cfc4] bg-white hover:border-[#a8a29e] hover:bg-[#fbfaf8]'
              }`}
            >
              <Upload className="h-7 w-7 text-[#78716c] mb-2" />
              <p className="text-xs font-medium text-[#1c1917]">
                Click to browse or drop your files here
              </p>
              <p className="text-[11px] text-[#78716c] mt-1 font-mono">
                Supports: .pkt, .py, .txt, .pdf, .docx, .json
              </p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileInputChange}
                className="hidden"
              />
            </div>
          </div>

          {/* List of Attached Files */}
          {files.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-semibold text-[#44403c]">
                Attached Files ({files.length}):
              </span>
              <div className="divide-y divide-[#e8e4dc] rounded-lg border border-[#e8e4dc] bg-white overflow-hidden">
                {files.map((file) => (
                  <div key={file.id} className="flex items-center justify-between p-2.5 text-xs">
                    <div className="flex items-center gap-2">
                      {file.type === 'cisco-pkt' ? (
                        <Network className="h-4 w-4 text-[#1e3a5f]" />
                      ) : (
                        <FileCode className="h-4 w-4 text-[#1e3a5f]" />
                      )}
                      <span className="font-mono font-medium text-[#1c1917]">{file.name}</span>
                      <span className="text-[11px] text-[#78716c] font-mono">({formatFileSize(file.size)})</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(file.id)}
                      className="p-1 text-[#a8a29e] hover:text-rose-600 transition-colors cursor-pointer"
                      title="Remove file"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Lab Notes / Output Observations */}
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#44403c]">
              Lab Notes / Procedure (Optional)
            </label>
            <textarea
              rows={3}
              placeholder="Paste terminal outputs, verification results, or step-by-step procedures..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-lg border border-[#d6cfc4] bg-white px-3.5 py-2 text-xs text-[#1c1917] placeholder-[#a8a29e] focus:border-[#1e3a5f] focus:outline-none focus:ring-1 focus:ring-[#1e3a5f] font-mono"
            />
          </div>

          {/* Action Footer */}
          <div className="pt-4 border-t border-[#e8e4dc] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-[#57534e] hover:text-[#1c1917] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded-lg bg-[#1e3a5f] px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#152a45] transition-colors cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Save Experiment</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
