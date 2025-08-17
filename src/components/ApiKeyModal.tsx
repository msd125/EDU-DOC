import React, { useState } from 'react';

interface ApiKeyModalProps {
  onSave: (apiKey: string) => void;
  onClose: () => void;
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ onSave, onClose }) => {
  const [key, setKey] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (key.trim()) {
      onSave(key.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 transition-opacity duration-300">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-8 w-full max-w-md m-4">
        <h2 className="text-2xl font-bold mb-4 text-slate-800 dark:text-slate-100">مطلوب مفتاح Gemini API</h2>
        <p className="mb-6 text-slate-600 dark:text-slate-400">
          لتمكين ميزة الذكاء الاصطناعي، يرجى إدخال مفتاح Google Gemini API الخاص بك. سيتم حفظ المفتاح في جلسة المتصفح الحالية فقط.
        </p>
        <form onSubmit={handleSubmit}>
          <label htmlFor="apiKey" className="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">مفتاح API</label>
          <input
            type="password"
            id="apiKey"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2.5 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
            required
            autoFocus
          />
          <div className="flex justify-end gap-4 mt-8 pt-4 border-t border-slate-200 dark:border-slate-700">
            <button type="button" onClick={onClose} className="py-2 px-4 text-sm font-medium text-slate-700 bg-white rounded-lg border border-slate-300 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600 dark:hover:bg-slate-700">
              إلغاء
            </button>
            <button type="submit" disabled={!key.trim()} className="py-2 px-4 text-sm font-medium text-white bg-[#2E8540] rounded-lg hover:bg-[#246b33] focus:ring-green-300 disabled:bg-slate-400">
              حفظ واستمرار
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApiKeyModal;