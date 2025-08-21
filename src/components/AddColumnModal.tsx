import React, { useState } from 'react';
import { ColumnType } from '../types';

interface AddColumnModalProps {
  onClose: () => void;
  onAddColumn: (name: string, type: ColumnType, options?: string[]) => void;
}

const AddColumnModal: React.FC<AddColumnModalProps> = ({ onClose, onAddColumn }) => {
  const [count, setCount] = useState(1);
  const [type, setType] = useState<ColumnType>(ColumnType.NUMBER);
  const [options, setOptions] = useState('');
  const [mainLabel, setMainLabel] = useState('');
  // لم يعد هناك حاجة لقيم منفصلة لكل حقل

  const handleCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = Math.max(1, parseInt(e.target.value) || 1);
    setCount(val);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let finalOptions: string[] | undefined = undefined;
    if (type === ColumnType.LIST && options.trim()) {
      finalOptions = options.split(',').map(opt => opt.trim()).filter(Boolean);
    }
    if (!mainLabel.trim()) return;
    for (let i = 0; i < count; i++) {
      onAddColumn(mainLabel.trim(), type, finalOptions);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 transition-opacity duration-300">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-8 w-full max-w-md m-4">
        <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-100">إضافة عمود جديد</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="mainLabel" className="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">{mainLabel || 'عنوان الحقل الرئيسي'}</label>
              <input
                type="text"
                id="mainLabel"
                value={mainLabel}
                onChange={e => setMainLabel(e.target.value)}
                className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2.5 dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400 dark:text-white"
                required
              />
            </div>
            <div>
              <label htmlFor="columnCount" className="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">عدد الحقول</label>
              <input
                type="number"
                id="columnCount"
                min={1}
                value={count}
                onChange={handleCountChange}
                className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2.5 dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400 dark:text-white"
                required
              />
            </div>
            <div>
              <label htmlFor="columnType" className="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">نوع الحقول</label>
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
            <div className="flex flex-col gap-0 mt-4">
              {Array.from({ length: count }).map((_, i) => (
                <input
                  key={i}
                  type={type === ColumnType.NUMBER ? 'number' : type === ColumnType.DATE ? 'date' : 'text'}
                  className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-none focus:ring-emerald-500 focus:border-emerald-500 w-full p-2.5 dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400 dark:text-white"
                  style={{marginBottom: 0, borderRadius: 0, borderTop: i === 0 ? '' : 'none'}}
                  disabled
                />
              ))}
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
              className="py-2 px-4 text-sm font-medium text-white bg-[#2E8540] rounded-lg hover:bg-[#246b33] focus:ring-4 focus:ring-green-300 dark:focus:ring-green-800 transition-colors"
            >
              إضافة عمود
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddColumnModal;