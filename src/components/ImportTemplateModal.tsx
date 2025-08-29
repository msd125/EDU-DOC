import React, { useState } from 'react';
import { Template } from '../types';

interface ImportTemplateModalProps {
  onClose: () => void;
  onImport: (template: Template) => void;
  currentImportCount: number;
  maxImportCount: number;
}

const ImportTemplateModal: React.FC<ImportTemplateModalProps> = ({ 
  onClose, 
  onImport, 
  currentImportCount, 
  maxImportCount 
}) => {
  const [importMethod, setImportMethod] = useState<'file' | 'code'>('file');
  const [importCode, setImportCode] = useState('');
  const [codeError, setCodeError] = useState('');
  const [fileError, setFileError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleCodeImport = () => {
    if (!importCode.trim()) {
      setCodeError('يرجى إدخال رمز القالب');
      return;
    }
    
    setIsProcessing(true);
    setCodeError('');
    
    try {
      // محاولة فك تشفير رمز القالب من Base64
      const decodedData = atob(importCode.trim());
      const templateData = JSON.parse(decodedData);
      
      // التحقق من أن البيانات تحتوي على العناصر الأساسية
      if (!templateData.id || !templateData.name || !templateData.columns || !Array.isArray(templateData.columns)) {
        setCodeError('رمز القالب غير صالح');
        setIsProcessing(false);
        return;
      }
      
      // إضافة حقول الاستيراد
      const template: Template = {
        ...templateData,
        id: `imported-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        isImported: true,
        importedDate: Date.now(),
        importedFrom: templateData.ownerName || 'غير معروف'
      };
      
      onImport(template);
    } catch (error) {
      setCodeError('رمز القالب غير صالح');
      setIsProcessing(false);
    }
  };
  
  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      setFileError('يرجى اختيار ملف');
      return;
    }
    
    if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
      setFileError('يرجى اختيار ملف بصيغة JSON');
      return;
    }
    
    setIsProcessing(true);
    setFileError('');
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const templateData = JSON.parse(e.target?.result as string);
        
        // التحقق من أن البيانات تحتوي على العناصر الأساسية
        if (!templateData.name || !templateData.columns || !Array.isArray(templateData.columns)) {
          setFileError('ملف القالب غير صالح');
          setIsProcessing(false);
          return;
        }
        
        // إضافة حقول الاستيراد
        const template: Template = {
          ...templateData,
          id: `imported-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
          isImported: true,
          importedDate: Date.now(),
          importedFrom: templateData.ownerName || 'ملف خارجي'
        };
        
        onImport(template);
      } catch (error) {
        setFileError('حدث خطأ أثناء قراءة الملف');
        setIsProcessing(false);
      }
    };
    
    reader.onerror = () => {
      setFileError('حدث خطأ أثناء قراءة الملف');
      setIsProcessing(false);
    };
    
    reader.readAsText(file);
  };
  
  const isImportLimitReached = currentImportCount >= maxImportCount;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[9999]" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-6 w-full max-w-lg m-4" onClick={e => e.stopPropagation()}>
        <h2 className="text-xl font-bold mb-4 text-center text-slate-800 dark:text-slate-100">استيراد قالب</h2>
        
        {isImportLimitReached ? (
          <div className="text-center py-6">
            <div className="text-amber-600 dark:text-amber-400 text-lg mb-2">
              <svg className="w-16 h-16 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              وصلت للحد الأقصى من القوالب المستوردة
            </div>
            <p className="text-slate-600 dark:text-slate-400">
              يمكنك استيراد {maxImportCount} قوالب كحد أقصى. لإضافة قالب جديد، قم بحذف قالب مستورد سابقاً.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-5">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                اختر طريقة استيراد القالب:
              </p>
              
              <div className="flex mb-4 gap-4">
                <div 
                  className={`flex-1 p-3 rounded-lg border-2 cursor-pointer transition-all flex items-center justify-center gap-3 ${
                    importMethod === 'file' 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-slate-200 dark:border-slate-700'
                  }`}
                  onClick={() => setImportMethod('file')}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                  </svg>
                  <span>رفع ملف</span>
                </div>
                <div 
                  className={`flex-1 p-3 rounded-lg border-2 cursor-pointer transition-all flex items-center justify-center gap-3 ${
                    importMethod === 'code' 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-slate-200 dark:border-slate-700'
                  }`}
                  onClick={() => setImportMethod('code')}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  <span>إدخال رمز</span>
                </div>
              </div>
              
              {importMethod === 'file' && (
                <div className="mt-4">
                  <label className="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                    اختر ملف القالب (JSON)
                  </label>
                  <input
                    type="file"
                    accept=".json,application/json"
                    onChange={handleFileImport}
                    className="block w-full text-sm text-slate-700 dark:text-slate-300
                             file:mr-4 file:py-2 file:px-4
                             file:rounded-md file:border-0
                             file:text-sm file:font-medium
                             file:bg-blue-50 file:text-blue-700
                             dark:file:bg-blue-900/20 dark:file:text-blue-300
                             hover:file:bg-blue-100 dark:hover:file:bg-blue-900/30"
                  />
                  {fileError && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400">{fileError}</p>
                  )}
                </div>
              )}
              
              {importMethod === 'code' && (
                <div className="mt-4">
                  <label className="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                    أدخل رمز القالب
                  </label>
                  <textarea
                    rows={3}
                    placeholder="ألصق رمز القالب هنا..."
                    value={importCode}
                    onChange={(e) => setImportCode(e.target.value)}
                    className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-700"
                  ></textarea>
                  {codeError && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400">{codeError}</p>
                  )}
                </div>
              )}
            </div>
            
            <div className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              <div className="flex items-center justify-between">
                <span>الحد الأقصى للقوالب المستوردة:</span>
                <span className="font-bold">{currentImportCount} من {maxImportCount}</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 my-1">
                <div 
                  className="bg-blue-500 h-1.5 rounded-full" 
                  style={{ width: `${(currentImportCount / maxImportCount) * 100}%` }}
                ></div>
              </div>
            </div>
          </>
        )}
        
        <div className="flex justify-between mt-4 border-t border-slate-200 dark:border-slate-700 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="py-2 px-4 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 rounded-lg border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            إلغاء
          </button>
          {!isImportLimitReached && (
            <button
              type="button"
              className="py-2 px-4 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={importMethod === 'code' ? handleCodeImport : undefined}
              disabled={isProcessing || (importMethod === 'code' && !importCode)}
            >
              {isProcessing ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  جاري الاستيراد...
                </span>
              ) : (
                "استيراد القالب"
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImportTemplateModal;
