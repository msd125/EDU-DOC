import React, { useState } from 'react';

interface AddStudentModalProps {
  onClose: () => void;
  onAddStudent: (name: string) => void;
}

const AddStudentModal: React.FC<AddStudentModalProps> = ({ onClose, onAddStudent }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onAddStudent(name.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 transition-opacity duration-300">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-8 w-full max-w-md m-4">
        <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-100">إضافة طالب جديد</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="studentName" className="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">اسم الطالب</label>
              <input
                type="text"
                id="studentName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2.5 dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400 dark:text-white"
                required
                autoFocus
              />
            </div>
          </div>
          <div className="flex justify-end gap-4 mt-8 pt-4 border-t border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-4 text-sm font-medium text-slate-700 bg-white rounded-lg border border-slate-300 hover:bg-slate-100 focus:z-10 focus:ring-4 focus:ring-slate-200 dark:focus:ring-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600 dark:hover:text-white dark:hover:bg-slate-700 transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="py-2 px-4 text-sm font-medium text-white bg-[#2E8540] rounded-lg hover:bg-[#246b33] focus:ring-4 focus:ring-green-300 dark:focus:ring-green-800 disabled:bg-slate-400 dark:disabled:bg-slate-600 transition-colors"
            >
              إضافة طالب
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStudentModal;