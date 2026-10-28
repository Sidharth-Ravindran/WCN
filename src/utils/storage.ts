import { LabExperiment, LabFile } from '../types/lab';

const STORAGE_KEY = 'netlab_user_experiments_v1';

export const loadStoredExperiments = (): LabExperiment[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load experiments from localStorage', err);
    return [];
  }
};

export const saveStoredExperiments = (experiments: LabExperiment[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(experiments));
  } catch (err) {
    console.error('Failed to save experiments to localStorage', err);
  }
};

export const detectFileType = (filename: string): { type: LabFile['type']; isText: boolean } => {
  const ext = filename.split('.').pop()?.toLowerCase() || '';

  if (ext === 'py') {
    return { type: 'python', isText: true };
  }
  if (['pkt', 'pka', 'pkz'].includes(ext)) {
    return { type: 'cisco-pkt', isText: false };
  }
  if (['txt', 'c', 'cpp', 'h', 'java', 'sh', 'json', 'md', 'xml', 'yaml', 'yml'].includes(ext)) {
    return { type: 'text', isText: true };
  }
  if (ext === 'pdf') {
    return { type: 'pdf', isText: false };
  }
  if (['doc', 'docx'].includes(ext)) {
    return { type: 'document', isText: false };
  }
  return { type: 'other', isText: false };
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const downloadLabFile = (file: LabFile): void => {
  let blob: Blob;
  if (file.isText) {
    blob = new Blob([file.content], { type: 'text/plain;charset=utf-8' });
  } else {
    // Check if it's a data URL
    if (file.content.startsWith('data:')) {
      const parts = file.content.split(',');
      const mime = parts[0].match(/:(.*?);/)?.[1] || 'application/octet-stream';
      const bstr = atob(parts[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      blob = new Blob([u8arr], { type: mime });
    } else {
      blob = new Blob([file.content], { type: 'application/octet-stream' });
    }
  }

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = file.name;
  link.click();
  URL.revokeObjectURL(url);
};
