import React from 'react';

interface ConfirmModalProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string; // نص زر التأكيد
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ message, onConfirm, onCancel, confirmLabel }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[9999] transition-opacity duration-300" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-8 w-full max-w-md m-4">
        <h2 id="confirm-title" className="text-xl font-bold mb-4 text-slate-800 dark:text-slate-100">تأكيد الإجراء</h2>
        <p className="my-6 text-slate-700 dark:text-slate-300">{message}</p>
        <div className="flex justify-end gap-4 mt-8 pt-4 border-t border-slate-200 dark:border-slate-700">
          <button
            type="button"
            onClick={onCancel}
            className="py-2 px-4 text-sm font-medium text-slate-700 bg-white rounded-lg border border-slate-300 hover:bg-slate-100 focus:z-10 focus:ring-4 focus:ring-slate-200 dark:focus:ring-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600 dark:hover:text-white dark:hover:bg-slate-700 transition-colors"
          >
            إلغاء
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="py-2 px-4 text-sm font-medium text-white rounded-lg transition-colors bg-red-600 hover:bg-red-700 focus:ring-4 focus:ring-red-300"
          >
            {confirmLabel || 'تأكيد الحذف'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
