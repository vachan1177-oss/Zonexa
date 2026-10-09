import { useState, useRef, type DragEvent } from 'react';
import { useApp } from '@/context/AppContext';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  status: 'uploading' | 'complete';
  uploadedAt: string;
}

const mockFiles: UploadedFile[] = [
  {
    id: 'f1',
    name: 'customer_database.csv',
    size: 2_450_000,
    type: 'csv',
    status: 'complete',
    uploadedAt: 'Oct 7, 2026',
  },
  {
    id: 'f2',
    name: 'sales_history.xlsx',
    size: 1_820_000,
    type: 'xlsx',
    status: 'complete',
    uploadedAt: 'Oct 5, 2026',
  },
];

function getFileEmoji(type: string) {
  switch (type) {
    case 'csv':
    case 'sql':
      return '🗄️';
    case 'xlsx':
      return '📊';
    case 'json':
      return '📋';
    default:
      return '📄';
  }
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function DataManagement() {
  const { t } = useApp();
  const [files, setFiles] = useState<UploadedFile[]>(mockFiles);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = (fileList: FileList | null) => {
    if (!fileList) return;
    const newFiles: UploadedFile[] = Array.from(fileList).map((f) => ({
      id: `f${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: f.name,
      size: f.size,
      type: f.name.split('.').pop()?.toLowerCase() ?? 'file',
      status: 'uploading',
      uploadedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    }));
    setFiles((prev) => [...newFiles, ...prev]);

    newFiles.forEach((nf) => {
      setTimeout(() => {
        setFiles((prev) =>
          prev.map((f) => (f.id === nf.id ? { ...f, status: 'complete' } : f))
        );
      }, 1500);
    });
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    addFiles(e.dataTransfer.files);
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Drag-and-drop upload zone */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative cursor-pointer rounded-2xl border-2 border-dashed p-10 text-center transition-all
          ${isDragging
            ? 'border-brand-500 bg-brand-50 dark:bg-brand-500/10 scale-[1.01]'
            : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-brand-400 dark:hover:border-brand-500/50 hover:bg-brand-50/30 dark:hover:bg-brand-500/5'
          }
        `}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => addFiles(e.target.files)}
          accept=".csv,.json,.xlsx,.sql"
        />

        <div className={`
          flex items-center justify-center w-16 h-16 rounded-2xl mx-auto mb-4 transition-all text-3xl
          ${isDragging
            ? 'bg-brand-500 scale-110'
            : 'bg-brand-50 dark:bg-brand-500/10'
          }
        `}>
          ☁️
        </div>

        <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1">
          {isDragging ? t('dropHere') : t('fileUpload')}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">{t('fileUploadDesc')}</p>
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-brand-500 to-brand-600 text-white hover:from-brand-600 hover:to-brand-700 shadow-md shadow-brand-500/20 transition-all">
          📂 {t('browse')}
        </span>
        <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-4">{t('supportedFormats')}</p>
      </div>

      {/* Uploaded files list */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-800">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            📁 {t('uploadedFiles')}
          </h3>
          <span className="text-xs text-slate-400 dark:text-slate-500">{files.length} files</span>
        </div>

        {files.length === 0 ? (
          <div className="text-center py-12">
            <span className="text-4xl opacity-30 block mb-3">📄</span>
            <p className="text-sm text-slate-400 dark:text-slate-500">{t('noFiles')}</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {files.map((file) => (
              <div
                key={file.id}
                className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors animate-slide-in-right"
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 text-xl shrink-0">
                  {getFileEmoji(file.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{file.name}</p>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 dark:text-slate-500">
                    <span>{formatSize(file.size)}</span>
                    <span>{file.uploadedAt}</span>
                  </div>
                </div>

                {/* Status */}
                <div className="shrink-0">
                  {file.status === 'uploading' ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-brand-500/30 border-t-brand-500 rounded-full animate-spin" />
                      <span className="text-[11px] font-medium text-brand-500">{t('uploading')}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-sm">✅</span>
                      <span className="text-[11px] font-medium text-success-600 dark:text-success-400 hidden sm:inline">
                        {t('uploadComplete')}
                      </span>
                    </div>
                  )}
                </div>

                {/* Remove */}
                <button
                  onClick={(e) => { e.stopPropagation(); removeFile(file.id); }}
                  className="p-1.5 rounded-lg text-slate-300 hover:text-error-500 hover:bg-error-50 dark:hover:bg-error-500/10 transition-all shrink-0 text-sm"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
