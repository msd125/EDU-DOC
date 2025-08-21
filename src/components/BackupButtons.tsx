import React, { useRef } from 'react';
import { DownloadIcon } from './Icons';

interface BackupButtonsProps {
  onExport: () => void;
  onImport: (file: File) => void;
  isLoading?: boolean;
}

const BackupButtons: React.FC<BackupButtonsProps> = ({ onExport, onImport, isLoading }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col gap-2 mt-6">
      <button
        type="button"
        className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-lg transition-colors shadow"
        onClick={onExport}
        disabled={isLoading}
      >
        <DownloadIcon className="w-5 h-5" />
        تصدير نسخة احتياطية
      </button>
      <input
        type="file"
        accept="application/json"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={e => {
          if (e.target.files && e.target.files[0]) {
            onImport(e.target.files[0]);
            e.target.value = '';
          }
        }}
      />
      <button
        type="button"
        className="flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-900 text-white font-bold py-2 px-4 rounded-lg transition-colors shadow"
        onClick={() => fileInputRef.current?.click()}
        disabled={isLoading}
      >
        <DownloadIcon className="w-5 h-5 rotate-180" />
        استيراد نسخة احتياطية
      </button>
    </div>
  );
};

export default BackupButtons;
