import React from 'react';
import { UserPlusIcon, PlusCircleIcon, DownloadIcon, TuneIcon, BookOpenIcon } from './Icons';

interface MainToolbarProps {
  onAddClass: () => void;
  onAddSubject: () => void;
  onAddStudent: () => void;
  onAddColumn: () => void;
  onImportStudents: () => void;
  onExportExcel: () => void;
  onExportPdf: () => void;
  onOpenSettings: () => void;
  onOpenCustomize: () => void;
  classType?: string;
  onAdminExport?: () => void;
}

const MainToolbar: React.FC<MainToolbarProps> = ({
  onAddClass,
  onAddSubject,
  onAddStudent,
  onAddColumn,
  onImportStudents,
  onExportExcel,
  onExportPdf,
  onOpenSettings,
  onOpenCustomize,
  classType,
  onAdminExport
}) => {
  return (
    <nav className="w-full flex flex-wrap gap-2 items-center justify-center bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 py-3 px-2 sticky top-0 z-40 shadow-sm">
  {/* زر إضافة فصل وزر إضافة مادة تم حذفهما بناءً على طلب المستخدم */}
      <button onClick={onOpenCustomize} className="flex items-center gap-1 px-3 py-1.5 rounded bg-emerald-200 text-emerald-700 hover:bg-emerald-300 text-xs font-semibold transition-all">
        <TuneIcon className="w-4 h-4" /> إدارة الصفوف والجداول
      </button>
      <button onClick={onAddStudent} className="flex items-center gap-1 px-3 py-1.5 rounded bg-emerald-500 text-white hover:bg-emerald-600 text-xs font-semibold transition-all">
        <UserPlusIcon className="w-4 h-4" /> {classType === 'إداري' ? 'إضافة اسم' : 'إضافة طالب'}
      </button>
      <button onClick={onImportStudents} className="flex items-center gap-1 px-3 py-1.5 rounded bg-yellow-500 text-white hover:bg-yellow-600 text-xs font-semibold transition-all">
        <UserPlusIcon className="w-4 h-4" /> {classType === 'إداري' ? 'استيراد أسماء' : 'استيراد طلاب'}
      </button>
      {classType !== 'إداري' && (
        <>
          <button onClick={onExportExcel} className="flex items-center gap-1 px-3 py-1.5 rounded bg-green-700 text-white hover:bg-green-800 text-xs font-semibold transition-all">
            <DownloadIcon className="w-4 h-4" /> تصدير Excel
          </button>
          <button onClick={onExportPdf} className="flex items-center gap-1 px-3 py-1.5 rounded bg-red-600 text-white hover:bg-red-700 text-xs font-semibold transition-all">
            <DownloadIcon className="w-4 h-4" /> تصدير PDF
          </button>
        </>
      )}
      {classType === 'إداري' && (
        <button onClick={onAdminExport} className="flex items-center gap-1 px-3 py-1.5 rounded bg-blue-700 text-white hover:bg-blue-800 text-xs font-semibold transition-all">
          <BookOpenIcon className="w-4 h-4" /> الإدارة المدرسية
        </button>
      )}
      <button onClick={onOpenSettings} className="flex items-center gap-1 px-3 py-1.5 rounded bg-slate-200 text-slate-700 hover:bg-slate-300 text-xs font-semibold transition-all">
        <TuneIcon className="w-4 h-4" /> الإعدادات
      </button>
    </nav>
  );
};

export default MainToolbar;
