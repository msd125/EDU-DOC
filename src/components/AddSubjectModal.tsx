import React, { useState } from 'react';

interface AddSubjectModalProps {
  onClose: () => void;
  onAddSubject: (name: string) => void;
  className?: string;
}

const AddSubjectModal: React.FC<AddSubjectModalProps> = ({ onClose, onAddSubject, className }) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleAdd = () => {
    if (!name.trim()) {
      setError('يرجى إدخال اسم المادة');
      return;
    }
    onAddSubject(name.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-6 max-w-xs w-full">
        <div className="text-lg font-bold mb-4 text-slate-800 dark:text-slate-100">إضافة مادة جديدة {className && <span className="text-xs text-slate-500">({className})</span>}</div>
        <input
          type="text"
          className="w-full p-2 border rounded mb-2 text-right"
          placeholder="اسم المادة..."
          value={name}
          onChange={e => { setName(e.target.value); setError(''); }}
        />
        {error && <div className="text-red-500 text-xs mb-2">{error}</div>}
        <div className="flex gap-2 justify-end mt-4">
          <button
            className="py-2 px-4 text-sm font-medium text-slate-700 bg-white rounded-lg border border-slate-300 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600 dark:hover:text-white dark:hover:bg-slate-700 transition-colors"
            onClick={onClose}
          >إلغاء</button>
          <button
            className="py-2 px-4 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            onClick={handleAdd}
          >إضافة</button>
        </div>
      </div>
    </div>
  );
};

export default AddSubjectModal;
