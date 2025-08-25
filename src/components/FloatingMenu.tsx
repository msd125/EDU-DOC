import React, { useState } from 'react';
import { UserPlusIcon, PlusCircleIcon, DownloadIcon, TuneIcon, MenuIcon } from './Icons';

interface FloatingMenuProps {
  onAddStudent: () => void;
  onAddColumn: () => void;
  onImportStudents: () => void;
  onExportExcel: () => void;
  onExportPdf: () => void;
  onOpenSettings: () => void;
}

const FloatingMenu: React.FC<FloatingMenuProps> = ({
  onAddStudent,
  onAddColumn,
  onImportStudents,
  onExportExcel,
  onExportPdf,
  onOpenSettings
}) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* الزر العائم */}
      <button
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-emerald-600 text-white shadow-lg flex items-center justify-center text-3xl hover:bg-emerald-700 transition-all"
        onClick={() => setOpen(v => !v)}
        aria-label="عرض الأدوات"
      >
        <MenuIcon className="w-8 h-8" />
      </button>
      {/* قائمة الأدوات */}
      {open && (
  <div className="fixed bottom-24 right-6 z-50 flex flex-col gap-3 bg-white rounded-xl shadow-xl p-4 border border-slate-200 min-w-[180px] animate-fade-in">
          <button onClick={onAddStudent} className="flex items-center gap-2 p-2 rounded hover:bg-emerald-50 dark:hover:bg-slate-700 text-emerald-700 dark:text-emerald-300 font-semibold text-sm transition-all">
            <UserPlusIcon className="w-5 h-5" /> إضافة طالب
          </button>
          <button onClick={onAddColumn} className="flex items-center gap-2 p-2 rounded hover:bg-blue-50 dark:hover:bg-slate-700 text-blue-700 dark:text-blue-300 font-semibold text-sm transition-all">
            <PlusCircleIcon className="w-5 h-5" /> إضافة عمود
          </button>
          <button onClick={onImportStudents} className="flex items-center gap-2 p-2 rounded hover:bg-yellow-50 dark:hover:bg-slate-700 text-yellow-700 dark:text-yellow-300 font-semibold text-sm transition-all">
            <UserPlusIcon className="w-5 h-5" /> استيراد طلاب
          </button>
          <button onClick={onExportExcel} className="flex items-center gap-2 p-2 rounded hover:bg-green-50 dark:hover:bg-slate-700 text-green-700 dark:text-green-300 font-semibold text-sm transition-all">
            <DownloadIcon className="w-5 h-5" /> تصدير Excel
          </button>
          <button onClick={onExportPdf} className="flex items-center gap-2 p-2 rounded hover:bg-red-50 dark:hover:bg-slate-700 text-red-700 dark:text-red-300 font-semibold text-sm transition-all">
            <DownloadIcon className="w-5 h-5" /> تصدير PDF
          </button>
          <button onClick={onOpenSettings} className="flex items-center gap-2 p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-sm transition-all">
            <TuneIcon className="w-5 h-5" /> الإعدادات
          </button>
        </div>
      )}
    </>
  );
};

export default FloatingMenu;
