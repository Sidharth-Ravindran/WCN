import React from 'react';
import { Plus } from 'lucide-react';

interface NavbarProps {
  onSelectCategory: (cat: string) => void;
  onOpenUpload: () => void;
  selectedCategory: string;
  totalExperiments: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onSelectCategory,
  onOpenUpload,
  selectedCategory,
  totalExperiments
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#e8e4dc] bg-[#faf8f5]/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Single text element wordmark */}
        <a 
          href="#top" 
          className="font-serif text-xl font-bold tracking-tight text-[#1c1917] whitespace-nowrap shrink-0 hover:text-[#1e3a5f] transition-colors"
        >
          Lab Archive
        </a>

        {/* Zone 2: Navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-[#57534e]">
          <button 
            onClick={() => onSelectCategory('all')} 
            className={`transition-colors whitespace-nowrap shrink-0 text-left cursor-pointer ${
              selectedCategory === 'all' ? 'text-[#1e3a5f] font-bold' : 'hover:text-[#1c1917]'
            }`}
          >
            All Experiments ({totalExperiments})
          </button>
          <button 
            onClick={() => onSelectCategory('Cisco Packet Tracer')} 
            className={`transition-colors whitespace-nowrap shrink-0 text-left cursor-pointer ${
              selectedCategory === 'Cisco Packet Tracer' ? 'text-[#1e3a5f] font-bold' : 'hover:text-[#1c1917]'
            }`}
          >
            Cisco Packet Tracer
          </button>
          <button 
            onClick={() => onSelectCategory('Python Programs')} 
            className={`transition-colors whitespace-nowrap shrink-0 text-left cursor-pointer ${
              selectedCategory === 'Python Programs' ? 'text-[#1e3a5f] font-bold' : 'hover:text-[#1c1917]'
            }`}
          >
            Python Programs
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenUpload}
            className="flex items-center gap-1.5 rounded-lg bg-[#1e3a5f] px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-[#152a45] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Upload File</span>
          </button>
        </div>
      </div>
    </header>
  );
};
