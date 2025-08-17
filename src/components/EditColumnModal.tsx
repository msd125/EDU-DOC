import React, { useState, useEffect } from 'react';
import { Column, ColumnType } from '../types';

interface EditColumnModalProps {
  onClose: () => void;
  onSave: (updatedData: Partial<Column>) => void;
  column: Column;
}

const EditColumnModal: React.FC<EditColumnModalProps> = ({ onClose, onSave, column }) => {
  const [name, setName] = useState(column.name);
  const [type, setType] = useState<ColumnType>(column.type);
  const [options, setOptions] = useState(column.options?.join(', ') || '');

  useEffect(() => {
    setName(column.name);
    setType(column.type);
    setOptions(column.options?.join(', ') || '');
  }, [column]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      let finalOptions: string[] | undefined = undefined;
      if (type === ColumnType.LIST && options.trim()) {
        finalOptions = options.split(',').map(opt => opt.trim()).filter(Boolean);
      }
      onSave({ name: name.trim(), type, options: finalOptions });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 transition-opacity duration-300">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-8 w-full max-w-md m-4">
        <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-100">تعديل العمود</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="columnName" className="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">اسم العمود</label>
              <input
                type="text"
                id="columnName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2.5 dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400 dark:text-white"
                required
              />
            </div>
            <div>
              <label htmlFor="columnType" className="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">نوع العمود</label>
              <select
                id="columnType"
                value={type}
                onChange={(e) => setType(e.target.value as ColumnType)}
                className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2.5 dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400 dark:text-white"
              >
                {Object.values(ColumnType).map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            {type === ColumnType.LIST && (
              <div>
                <label htmlFor="columnOptions" className="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">خيارات القائمة (مفصولة بفاصلة)</label>
                <input
                  type="text"
                  id="columnOptions"
                  value={options}
                  onChange={(e) => setOptions(e.target.value)}
                  placeholder="مثال: ممتاز, جيد جداً, جيد"
                  className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2.5 dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400 dark:text-white"
                />
              </div>
            )}
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
              className="py-2 px-4 text-sm font-medium text-white bg-[#2E8540] rounded-lg hover:bg-[#246b33] focus:ring-4 focus:ring-green-300 dark:focus:ring-green-800 transition-colors"
            >
              حفظ التغييرات
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditColumnModal;