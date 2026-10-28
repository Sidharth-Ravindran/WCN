import React, { useState, useEffect, useMemo } from 'react';
import { Search, Upload, Plus } from 'lucide-react';
import { LabExperiment, LabFile, CATEGORIES, LabCategory } from './types/lab';
import { loadStoredExperiments, saveStoredExperiments } from './utils/storage';
import { Navbar } from './components/Navbar';
import { ExperimentCard } from './components/ExperimentCard';
import { UploadModal } from './components/UploadModal';
import { FileViewerModal } from './components/FileViewerModal';

export default function App() {
  const [experiments, setExperiments] = useState<LabExperiment[]>(() => loadStoredExperiments());
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Modals
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadCategory, setUploadCategory] = useState<LabCategory>('Cisco Packet Tracer');
  const [previewFile, setPreviewFile] = useState<LabFile | null>(null);

  // Sync to storage on change
  useEffect(() => {
    saveStoredExperiments(experiments);
  }, [experiments]);

  // Filtered experiments
  const filteredExperiments = useMemo(() => {
    return experiments.filter((exp) => {
      if (selectedCategory !== 'all' && exp.category !== selectedCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const inTitle = exp.title.toLowerCase().includes(q);
        const inAim = exp.aim.toLowerCase().includes(q);
        const inNotes = exp.notes?.toLowerCase().includes(q);
        const inFileNames = exp.files.some(f => f.name.toLowerCase().includes(q));
        if (!inTitle && !inAim && !inNotes && !inFileNames) return false;
      }
      return true;
    });
  }, [experiments, selectedCategory, searchQuery]);

  const handleAddExperiment = (newExp: LabExperiment) => {
    setExperiments((prev) => [newExp, ...prev]);
    setIsUploadOpen(false);
  };

  const handleDeleteExperiment = (id: string) => {
    setExperiments((prev) => prev.filter((exp) => exp.id !== id));
  };

  const handleAddFilesToExperiment = (expId: string, newFiles: LabFile[]) => {
    setExperiments((prev) =>
      prev.map((exp) => {
        if (exp.id === expId) {
          return {
            ...exp,
            files: [...exp.files, ...newFiles]
          };
        }
        return exp;
      })
    );
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#1c1917] flex flex-col font-sans selection:bg-amber-100 selection:text-amber-900">
      {/* Top Bar Navigation */}
      <Navbar
        onSelectCategory={(cat) => setSelectedCategory(cat)}
        onOpenUpload={() => {
          setUploadCategory('Cisco Packet Tracer');
          setIsUploadOpen(true);
        }}
        selectedCategory={selectedCategory}
        totalExperiments={experiments.length}
      />

      {/* Classic Editorial Header Banner (Sentence removed, duplicate button removed) */}
      <header className="border-b border-[#e8e4dc] bg-[#f4f0e8]/50 py-10 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="text-xs font-mono font-semibold uppercase tracking-wider text-[#78716c]">
            Personal Laboratory Archive
          </div>
          <h1 className="mt-1 font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#1c1917]">
            Lab Experiments &amp; Code Showcase
          </h1>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Filter and Search Bar: Only All, Cisco Packet Tracer, Python Programs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e8e4dc] pb-4">
          {/* Category Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-[#1e3a5f] text-white shadow-sm'
                  : 'text-[#57534e] hover:bg-[#eae5db] hover:text-[#1c1917]'
              }`}
            >
              All ({experiments.length})
            </button>
            {CATEGORIES.map((cat) => {
              const count = experiments.filter(e => e.category === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-[#1e3a5f] text-white shadow-sm'
                      : 'text-[#57534e] hover:bg-[#eae5db] hover:text-[#1c1917]'
                  }`}
                >
                  {cat} ({count})
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative shrink-0">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-[#a8a29e]" />
            <input
              type="text"
              placeholder="Search experiments or files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-64 rounded-lg border border-[#d6cfc4] bg-white pl-8 pr-3 py-1.5 text-xs text-[#1c1917] placeholder-[#a8a29e] focus:border-[#1e3a5f] focus:outline-none focus:ring-1 focus:ring-[#1e3a5f]"
            />
          </div>
        </div>

        {/* Experiments Grid or Clean Empty State */}
        {experiments.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#d6cfc4] bg-white p-12 text-center my-6">
            <div className="rounded-full bg-[#f4f0e8] p-4 text-[#1e3a5f] mb-4">
              <Upload className="h-8 w-8" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#1c1917]">
              No Lab Experiments Added Yet
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-[#78716c] max-w-md leading-relaxed">
              Upload your Cisco Packet Tracer (.pkt) or Python (.py) files to get started.
            </p>

            {/* Single clear upload button */}
            <div className="mt-6 flex items-center justify-center">
              <button
                onClick={() => {
                  setUploadCategory('Cisco Packet Tracer');
                  setIsUploadOpen(true);
                }}
                className="flex items-center gap-2 rounded-lg bg-[#1e3a5f] px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-[#152a45] transition-colors cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>Upload Lab Files</span>
              </button>
            </div>
          </div>
        ) : filteredExperiments.length === 0 ? (
          <div className="rounded-xl border border-[#e8e4dc] bg-white p-8 text-center text-xs text-[#78716c]">
            <p>No experiments match the selected category or search query.</p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="mt-2 font-semibold text-[#1e3a5f] hover:underline cursor-pointer"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredExperiments.map((exp) => (
              <ExperimentCard
                key={exp.id}
                experiment={exp}
                onPreviewFile={(file) => setPreviewFile(file)}
                onDeleteExperiment={handleDeleteExperiment}
                onAddFilesToExperiment={handleAddFilesToExperiment}
              />
            ))}
          </div>
        )}
      </main>

      {/* Classic Editorial Footer (Engineering Showcase removed) */}
      <footer className="border-t border-[#e8e4dc] bg-[#f4f0e8]/50 py-6 text-xs text-[#78716c]">
        <div className="mx-auto flex max-w-5xl flex-col sm:flex-row items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div>
            <span className="font-serif font-bold text-[#1c1917]">Lab Archive</span>
            <span className="mx-2 text-[#d6cfc4]">·</span>
            <span>{experiments.length} {experiments.length === 1 ? 'Experiment' : 'Experiments'}</span>
          </div>

          <div>
            <a href="#top" className="hover:text-[#1c1917] transition-colors">
              Back to Top ↑
            </a>
          </div>
        </div>
      </footer>

      {/* Upload New Experiment Modal */}
      {isUploadOpen && (
        <UploadModal
          onClose={() => setIsUploadOpen(false)}
          onSave={handleAddExperiment}
          initialCategory={uploadCategory}
        />
      )}

      {/* Code & File Preview Modal */}
      {previewFile && (
        <FileViewerModal
          file={previewFile}
          onClose={() => setPreviewFile(null)}
        />
      )}
    </div>
  );
}
