import React from 'react';
import { Template } from '../types';

interface DeleteTemplateConfirmModalProps {
  template: Template; // القالب المراد حذفه
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteTemplateConfirmModal: React.FC<DeleteTemplateConfirmModalProps> = ({ 
  template, 
  onConfirm, 
  onCancel 
}) => {
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[9999] transition-opacity duration-300" 
      role="dialog" 
      aria-modal="true"
    >
      <div 
        className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-6 w-full max-w-md m-4 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>

          <h2 className="text-xl font-bold mb-2 text-slate-800 dark:text-slate-100">حذف القالب</h2>
          <p className="mb-6 text-slate-600 dark:text-slate-300">
            هل أنت متأكد من حذف قالب <span className="font-bold text-red-600 dark:text-red-400">"{template.name}"</span>؟
            <br />
            <span className="text-sm">لا يمكن التراجع عن هذا الإجراء.</span>
          </p>
        </div>

        <div className="flex justify-between items-center gap-4 mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-2 px-4 text-sm font-medium text-slate-700 bg-white rounded-lg border border-slate-300 hover:bg-slate-100 transition-colors dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600 dark:hover:bg-slate-700"
          >
            إلغاء
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 py-2 px-4 text-sm font-medium text-white rounded-lg transition-colors bg-red-600 hover:bg-red-700"
          >
            حذف
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteTemplateConfirmModal;
