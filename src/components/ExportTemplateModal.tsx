import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Template } from '../types';

interface ExportTemplateModalProps {
  onClose: () => void;
  template: Template;
}

const ExportTemplateModal: React.FC<ExportTemplateModalProps> = ({ onClose, template }) => {
  const [exportMethod, setExportMethod] = useState<'file' | 'code'>('code');
  const [exportCode, setExportCode] = useState<string>('');
  const [copySuccess, setCopySuccess] = useState<boolean>(false);
  
  useEffect(() => {
    // إعداد رمز التصدير - فقط للطريقة 'code'
    try {
      const templateForExport = {
        ...template,
        exportDate: new Date().toISOString()
      };
      
      // تحويل البيانات إلى JSON ثم إلى Base64
      const jsonStr = JSON.stringify(templateForExport);
      const base64Code = btoa(jsonStr);
      setExportCode(base64Code);
    } catch (error) {
      console.error('خطأ في إنشاء رمز التصدير:', error);
    }
  }, [template]);
  
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(exportCode);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('فشل نسخ الرمز:', err);
    }
  };
  
  const handleFileExport = () => {
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
      }, 100);
      
      toast.success('تم تصدير القالب بنجاح');
    } catch (error) {
      console.error('خطأ في تصدير القالب:', error);
      toast.error('حدث خطأ أثناء تصدير القالب');
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[9999]" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-6 w-full max-w-lg m-4" onClick={e => e.stopPropagation()}>
        <h2 className="text-xl font-bold mb-4 text-center text-slate-800 dark:text-slate-100">تصدير القالب</h2>
        
        <div className="mb-4">
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
            يمكنك تصدير القالب "{template.name}" بإحدى الطريقتين:
          </p>
          
          <div className="flex mb-4 gap-4">
            <div 
              className={`flex-1 p-3 rounded-lg border-2 cursor-pointer transition-all flex items-center justify-center gap-3 ${
                exportMethod === 'code' 
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-slate-200 dark:border-slate-700'
              }`}
              onClick={() => setExportMethod('code')}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              <span>نسخ الرمز</span>
            </div>
            <div 
              className={`flex-1 p-3 rounded-lg border-2 cursor-pointer transition-all flex items-center justify-center gap-3 ${
                exportMethod === 'file' 
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-slate-200 dark:border-slate-700'
              }`}
              onClick={() => setExportMethod('file')}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 8.586V16a1 1 0 11-2 0V8.586l-1.293 1.293a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              <span>تصدير كملف</span>
            </div>
          </div>
          
          {exportMethod === 'code' && (
            <div className="mt-4">
              <label className="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                رمز القالب (انسخه لمشاركته مع الآخرين)
              </label>
              <div className="relative">
                <textarea
                  rows={3}
                  readOnly
                  value={exportCode}
                  className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 pr-10"
                ></textarea>
                <button 
                  onClick={copyToClipboard}
                  className="absolute top-2 right-2 p-1 rounded-md text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-600"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                    <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                  </svg>
                </button>
                {copySuccess && (
                  <div className="absolute -top-10 right-0 bg-green-500 text-white text-xs px-2 py-1 rounded">
                    تم النسخ!
                  </div>
                )}
              </div>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                انسخ هذا الرمز وشاركه مع معلم آخر ليتمكن من استيراد القالب.
              </p>
            </div>
          )}
          
          {exportMethod === 'file' && (
            <div className="mt-4">
              <label className="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                تصدير القالب كملف
              </label>
              <div className="flex justify-center">
                <button 
                  onClick={handleFileExport}
                  className="flex items-center justify-center gap-2 py-3 px-6 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  تصدير القالب
                </button>
              </div>
              <p className="mt-3 text-xs text-slate-500 dark:text-slate-400 text-center">
                سيتم حفظ القالب كملف JSON يمكن استيراده لاحقًا.
              </p>
            </div>
          )}
        </div>
        
        <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2 px-4 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 rounded-lg border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportTemplateModal;
