import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Template } from '../types';

interface ExportTemplateModalProps {
  onClose: () => void;
  template: Template;
}

const ExportTemplateModal: React.FC<ExportTemplateModalProps> = ({ onClose, template }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleFileExport = () => {
    setIsProcessing(true);
    
    try {
      // إنشاء بيانات التصدير
      const templateForExport = {
        ...template,
        exportDate: new Date().toISOString()
      };
      
      // تحويل البيانات إلى JSON منسق
      const jsonStr = JSON.stringify(templateForExport, null, 2);
      
      // إنشاء كائن Blob
      const blob = new Blob([jsonStr], { 
        type: 'application/json;charset=utf-8' 
      });
      
      // تحضير اسم الملف المقترح مع معالجة الأحرف الخاصة
      const sanitizedName = template.name
        .replace(/[\\/:*?"<>|]/g, '_') // استبدال الأحرف غير المسموح بها
        .replace(/\s+/g, '_'); // استبدال المسافات بالشرطات السفلية
      
      const fileName = `${sanitizedName}_قالب.json`;
      
      // إنشاء عنصر <a> مؤقت للتنزيل
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = fileName;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      
      // تنظيف بعد الانتهاء
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(a.href);
        setIsProcessing(false);
      }, 100);
      
      toast.success('تم تصدير القالب بنجاح');
    } catch (error) {
      console.error('خطأ في تصدير القالب:', error);
      toast.error('حدث خطأ أثناء تصدير القالب');
      setIsProcessing(false);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[9999]" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-4 w-full max-w-xs m-2" 
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: '90vw', maxHeight: '85vh', overflow: 'auto', width: '320px' }}
      >
        <h2 className="text-lg font-bold mb-3 text-center text-slate-800 dark:text-slate-100">تصدير قالب</h2>
        
        <div className="mb-3">
          <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
            سيتم تصدير القالب "{template.name}" كملف JSON يمكن استيراده لاحقًا.
          </p>
          
          <div className="flex justify-center mt-4 mb-3">
            <svg className="w-12 h-12 text-blue-500 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
          
          <div>
            <p className="text-xs text-slate-600 dark:text-slate-400 text-center">
              اضغط على زر التصدير أدناه لحفظ القالب كملف JSON
            </p>
          </div>
        </div>
        
        <div className="flex justify-between mt-3 border-t border-slate-200 dark:border-slate-700 pt-3">
          <button
            type="button"
            onClick={onClose}
            className="py-1.5 px-3 text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            إلغاء
          </button>
          <button
            type="button"
            onClick={handleFileExport}
            disabled={isProcessing}
            className="py-1.5 px-3 text-xs font-medium text-white bg-blue-500 rounded hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <span className="flex items-center gap-1">
                <svg className="animate-spin h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                جاري التصدير...
              </span>
            ) : (
              "تصدير القالب"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportTemplateModal;
