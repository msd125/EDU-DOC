import React from 'react';
import { UserPlusIcon, DownloadIcon, TuneIcon, BookOpenIcon, SaveIcon, TemplateIcon } from './Icons';

interface MainToolbarProps {
  onAddClass?: () => void;
  onAddSubject?: () => void;
  onAddStudent?: () => void;
  onAddColumn?: () => void;
  onImportStudents?: () => void;
  onExportExcel?: () => void;
  onExportPdf?: () => void;
  onOpenSettings?: () => void;
  onOpenCustomize?: () => void;
  onSaveTemplate?: () => void;
  onUseTemplate?: () => void;
  onDeleteAllStudents?: () => void;
  classType?: string;
  onAdminExport?: () => void;
}

const MainToolbar: React.FC<MainToolbarProps> = ({
  onAddStudent,
  onImportStudents,
  onExportExcel,
  onExportPdf,
  onOpenSettings,
  onOpenCustomize,
  onSaveTemplate,
  onUseTemplate,
  onDeleteAllStudents,
  classType,
  onAdminExport
}) => {
  return (
    <nav className="glass sticky top-0 z-40 backdrop-blur-xl border-b border-white/20 shadow-lg">
      <div className="container mx-auto py-4">
        <div className="flex flex-wrap gap-3 items-center justify-center">
          
          {/* === مجموعة الإدارة === */}
          <button 
            onClick={onOpenCustomize} 
            className="btn-modern btn-primary flex items-center gap-2 px-4 py-2.5 text-sm font-semibold 
                     shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            <TuneIcon className="w-4 h-4" /> 
            إدارة الصفوف والجداول
          </button>
          
          <button 
            onClick={onOpenSettings} 
            className="btn-modern bg-gradient-to-r from-gray-600 to-gray-700 text-white 
                     flex items-center gap-2 px-4 py-2.5 text-sm font-semibold 
                     shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 group"
          >
            <TuneIcon className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" /> 
            الإعدادات
          </button>

          {/* === مجموعة إضافة البيانات === */}
          <button 
            onClick={onAddStudent} 
            className="btn-modern bg-gradient-to-r from-emerald-500 to-emerald-600 text-white 
                     flex items-center gap-2 px-4 py-2.5 text-sm font-semibold shadow-lg 
                     hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            <UserPlusIcon className="w-4 h-4" /> 
            {classType === 'إداري' ? 'إضافة اسم' : 'إضافة طالب'}
          </button>
          
          <button 
            onClick={onImportStudents} 
            className="btn-modern bg-gradient-to-r from-yellow-500 to-yellow-600 text-white 
                     flex items-center gap-2 px-4 py-2.5 text-sm font-semibold shadow-lg 
                     hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            <UserPlusIcon className="w-4 h-4" /> 
            {classType === 'إداري' ? 'استيراد أسماء' : 'استيراد طلاب'}
          </button>

          {/* === مجموعة التصدير (Excel و PDF متجاورين) === */}
          {classType !== 'إداري' && (
            <>
              <button 
                onClick={onExportExcel} 
                className="btn-modern bg-gradient-to-r from-green-600 to-green-700 text-white 
                         flex items-center gap-2 px-4 py-2.5 text-sm font-semibold shadow-lg 
                         hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                <DownloadIcon className="w-4 h-4" /> تصدير Excel
              </button>
              
              <button 
                onClick={onExportPdf} 
                className="btn-modern bg-gradient-to-r from-red-600 to-red-700 text-white 
                         flex items-center gap-2 px-4 py-2.5 text-sm font-semibold shadow-lg 
                         hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                <DownloadIcon className="w-4 h-4" /> تصدير PDF
              </button>
            </>
          )}

          {/* تصدير إداري */}
          {classType === 'إداري' && (
            <button 
              onClick={onAdminExport} 
              className="btn-modern bg-gradient-to-r from-blue-600 to-blue-700 text-white 
                       flex items-center gap-2 px-4 py-2.5 text-sm font-semibold shadow-lg 
                       hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <BookOpenIcon className="w-4 h-4" /> خيارات التصدير
            </button>
          )}

          {/* === مجموعة القوالب (حفظ واستخدام متجاورين) === */}
          {onSaveTemplate && (
            <button 
              onClick={onSaveTemplate} 
              className="btn-modern bg-gradient-to-r from-blue-500 to-blue-600 text-white 
                       flex items-center gap-2 px-4 py-2.5 text-sm font-semibold shadow-lg 
                       hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <SaveIcon className="w-4 h-4" /> حفظ القالب
            </button>
          )}
          
          {onUseTemplate && (
            <button 
              onClick={onUseTemplate} 
              className="btn-modern bg-gradient-to-r from-purple-500 to-purple-600 text-white 
                       flex items-center gap-2 px-4 py-2.5 text-sm font-semibold shadow-lg 
                       hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <TemplateIcon className="w-4 h-4" /> استخدام قالب
            </button>
          )}

          {/* === مجموعة الحذف (في النهاية) === */}
          {onDeleteAllStudents && (
            <button 
              onClick={onDeleteAllStudents} 
              className="btn-modern bg-gradient-to-r from-red-600 to-red-700 text-white 
                       flex items-center gap-2 px-4 py-2.5 text-sm font-semibold shadow-lg 
                       hover:shadow-xl transform hover:scale-105 transition-all duration-200 
                       hover:from-red-700 hover:to-red-800"
            >
              <span className="w-4 h-4 text-sm">🗑️</span> 
              {classType === 'إداري' ? 'حذف كل الأسماء' : 'حذف كل الأسماء'}
            </button>
          )}

        </div>
      </div>
    </nav>
  );
};

export default MainToolbar;
