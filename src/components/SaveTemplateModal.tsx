import React, { useState } from 'react';
import { Column } from '../types';

interface SaveTemplateModalProps {
  onClose: () => void;
  onSave: (templateName: string, description: string, isPublic: boolean) => void;
  columns: Column[];
}

const SaveTemplateModal: React.FC<SaveTemplateModalProps> = ({ onClose, onSave, columns }) => {
  const [templateName, setTemplateName] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic] = useState(false); // أصبح دائمًا خاصًا (false) وليس عامًا
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!templateName.trim()) {
      setError('يرجى إدخال اسم للقالب');
      return;
    }
    
    onSave(templateName, description, isPublic);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[9999]" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-6 w-full max-w-md m-4" onClick={e => e.stopPropagation()}>
        <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-slate-100">حفظ التصميم كقالب</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="templateName" className="block mb-1 text-sm font-medium text-slate-700 dark:text-slate-300">اسم القالب*</label>
            <input
              id="templateName"
              type="text"
              className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100"
              value={templateName}
              onChange={e => setTemplateName(e.target.value)}
              placeholder="مثال: قالب كشف الحضور"
            />
            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
          </div>
          
          <div>
            <label htmlFor="description" className="block mb-1 text-sm font-medium text-slate-700 dark:text-slate-300">وصف القالب</label>
            <textarea
              id="description"
              className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100"
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
              placeholder="وصف مختصر لمحتوى ووظيفة هذا القالب..."
            ></textarea>
          </div>
          
          {/* تم إزالة خيار مشاركة القالب مع المعلمين الآخرين */}

          <div className="flex justify-between border-t border-slate-200 dark:border-slate-700 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-4 text-sm font-medium text-slate-700 bg-white rounded-lg border border-slate-300 hover:bg-slate-100 transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="py-2 px-4 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors"
            >
              حفظ القالب
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SaveTemplateModal;
