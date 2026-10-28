export interface LabFile {
  id: string;
  name: string;
  size: number;
  type: 'python' | 'cisco-pkt' | 'text' | 'pdf' | 'document' | 'other';
  content: string; // Text content for code/configs, or base64 data-URL for binaries
  isText: boolean;
  uploadedAt: string;
}

export interface LabExperiment {
  id: string;
  title: string;
  category: 'Cisco Packet Tracer' | 'Python Programs';
  date: string;
  aim: string;
  notes?: string;
  files: LabFile[];
}

export const CATEGORIES = [
  'Cisco Packet Tracer',
  'Python Programs'
] as const;

export type LabCategory = typeof CATEGORIES[number];
