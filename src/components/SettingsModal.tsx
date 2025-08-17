import React, { useState } from 'react';
import { Settings } from '../types';
import { KeyIcon } from './Icons';

interface SettingsModalProps {
  settings: Settings;
  onSave: (settings: Settings, apiKey: string) => void;
  onClose: () => void;
  apiKey: string | null;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ settings, onSave, onClose, apiKey }) => {
  const [currentSettings, setCurrentSettings] = useState(settings);
  const [currentApiKey, setCurrentApiKey] = useState(apiKey || '');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCurrentSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(currentSettings, currentApiKey);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 transition-opacity duration-300">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-8 w-full max-w-md m-4">
        <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-100">الإعدادات</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            <div>
              <label htmlFor="schoolName" className="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">اسم المدرسة</label>
              <input
                type="text"
                id="schoolName"
                name="schoolName"
                value={currentSettings.schoolName}
                onChange={handleChange}
                className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2.5 dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400 dark:text-white"
              />
            </div>
            <div>
              <label htmlFor="teacherName" className="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">اسم المعلم</label>
              <input
                type="text"
                id="teacherName"
                name="teacherName"
                value={currentSettings.teacherName}
                onChange={handleChange}
                className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2.5 dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400 dark:text-white"
              />
            </div>
            <div>
              <label htmlFor="principalName" className="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">اسم مدير المدرسة</label>
              <input
                type="text"
                id="principalName"
                name="principalName"
                value={currentSettings.principalName}
                onChange={handleChange}
                className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2.5 dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400 dark:text-white"
              />
            </div>
            <div>
              <label htmlFor="educationDirectorate" className="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">الإدارة التعليمية</label>
              <input
                type="text"
                id="educationDirectorate"
                name="educationDirectorate"
                value={currentSettings.educationDirectorate}
                onChange={handleChange}
                className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2.5 dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400 dark:text-white"
              />
            </div>
             <div>
              <label htmlFor="semester" className="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">الفصل الدراسي</label>
              <select
                id="semester"
                name="semester"
                value={currentSettings.semester}
                onChange={handleChange}
                className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2.5 dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400 dark:text-white"
              >
                <option value="الفصل الدراسي الأول">الفصل الدراسي الأول</option>
                <option value="الفصل الدراسي الثاني">الفصل الدراسي الثاني</option>
              </select>
            </div>
            <div>
              <label htmlFor="academicYear" className="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">العام الدراسي</label>
              <input
                type="text"
                id="academicYear"
                name="academicYear"
                value={currentSettings.academicYear}
                onChange={handleChange}
                className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2.5 dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400 dark:text-white"
              />
            </div>
            <div>
              <label htmlFor="apiKey" className="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">مفتاح Gemini API</label>
              <div className="relative">
                  <span className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                      <KeyIcon className="w-5 h-5 text-slate-400" />
                  </span>
                  <input
                    type="password"
                    id="apiKey"
                    name="apiKey"
                    placeholder="أدخل مفتاح API الخاص بك هنا"
                    value={currentApiKey}
                    onChange={(e) => setCurrentApiKey(e.target.value)}
                    className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full ps-10 p-2.5 dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400 dark:text-white"
                  />
              </div>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">مطلوب لميزات الذكاء الاصطناعي. يتم حفظه في جلسة المتصفح فقط.</p>
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
              حفظ التغييرات
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SettingsModal;