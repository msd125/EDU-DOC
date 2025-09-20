import React, { useState, useEffect } from 'react';
import { Column, ColumnType, MultiCountMode } from '../types';

interface EditColumnModalProps {
  onClose: () => void;
  onSave: (updatedData: Partial<Column>) => void;
  column: Column;
}

const EditColumnModal: React.FC<EditColumnModalProps> = ({ onClose, onSave, column }) => {
  const [name, setName] = useState(column.name);
  const [type, setType] = useState<ColumnType>(column.type);
  const [options, setOptions] = useState(column.options?.join(', ') || '');
  // إعدادات مجموعة المربعات
  const [multiSlots, setMultiSlots] = useState<number>((column as any).multiSlots || 8);
  const [multiShowCounter, setMultiShowCounter] = useState<boolean>(Boolean((column as any).multiShowCounter));
  const [multiCountMode, setMultiCountMode] = useState<MultiCountMode>(((column as any).multiCountMode as MultiCountMode) || 'both');

  // عند تغيير نوع العمود (فعليًا) من/إلى مجموعة مربعات، اضبط القيم الافتراضية فقط عند التحويل
  useEffect(() => {
    if (type === ColumnType.MULTI_CHECKBOX && column.type !== ColumnType.MULTI_CHECKBOX) {
      setMultiSlots(8);
      setMultiShowCounter(false);
      setMultiCountMode('both');
    } else if (type !== ColumnType.MULTI_CHECKBOX && column.type === ColumnType.MULTI_CHECKBOX) {
      setMultiSlots(8);
      setMultiShowCounter(false);
      setMultiCountMode('both');
    }
  }, [type, column.type]);

  useEffect(() => {
    setName(column.name);
    setType(column.type);
    setOptions(column.options?.join(', ') || '');
    // حمّل إعدادات مجموعة المربعات الحالية كما هي
    setMultiSlots((column as any).multiSlots || 8);
    setMultiShowCounter(Boolean((column as any).multiShowCounter));
    setMultiCountMode(((column as any).multiCountMode as MultiCountMode) || 'both');
  }, [column]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      let finalOptions: string[] | undefined = undefined;
      if (type === ColumnType.LIST && options.trim()) {
        finalOptions = options.split(',').map(opt => opt.trim()).filter(Boolean);
      }
      if (type === ColumnType.MULTI_CHECKBOX) {
        onSave({
          name: name.trim(),
          type,
          options: finalOptions,
          multiSlots: Math.max(1, Math.min(64, Number(multiSlots) || 1)),
          multiShowCounter: Boolean(multiShowCounter),
          multiCountMode
        });
      } else {
        onSave({
          name: name.trim(),
          type,
          options: finalOptions
        });
      }
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
            {type === ColumnType.MULTI_CHECKBOX && (
              <div className="space-y-3">
                <div>
                  <label className="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">عدد الخانات</label>
                  <input
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    min={1}
                    max={64}
                    value={multiSlots ?? ''}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, '');
                      setMultiSlots(val ? Math.max(1, Math.min(64, parseInt(val, 10))) : 1);
                    }}
                    className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2.5 dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400 dark:text-white"
                    placeholder="8"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input id="showCounter" type="checkbox" checked={multiShowCounter} onChange={e => setMultiShowCounter(e.target.checked)} />
                  <label htmlFor="showCounter" className="text-sm text-slate-700 dark:text-slate-300">عرض العداد داخل الخلية</label>
                </div>
                {multiShowCounter && (
                  <div>
                    <div className="block mb-1 text-sm font-medium text-slate-700 dark:text-slate-300">طريقة العد داخل الخلية</div>
                    <div className="flex flex-wrap gap-4 text-sm text-slate-700 dark:text-slate-300">
                      <label className="inline-flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="mc-mode-edit" checked={multiCountMode==='check'} onChange={()=>setMultiCountMode('check')} />
                        <span>يحسب الصح فقط (✓)</span>
                      </label>
                      <label className="inline-flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="mc-mode-edit" checked={multiCountMode==='cross'} onChange={()=>setMultiCountMode('cross')} />
                        <span>يحسب الخطأ فقط (✗)</span>
                      </label>
                      <label className="inline-flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="mc-mode-edit" checked={multiCountMode==='both'} onChange={()=>setMultiCountMode('both')} />
                        <span>يحسب كليهما (✓ و ✗)</span>
                      </label>
                    </div>
                  </div>
                )}
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