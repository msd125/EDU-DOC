import React, { useState, useRef } from 'react';
import { Settings } from '../types';
import BackupButtons from './BackupButtons';
import { exportFullBackup, importFullBackup } from '../utils/backup';


interface SettingsModalProps {
  settings: Settings;
  onSave: (settings: Settings) => void;
  onClose: () => void;
}



const SettingsModal: React.FC<SettingsModalProps> = ({ settings, onSave, onClose }) => {
  const [currentSettings, setCurrentSettings] = useState(settings);
  const [isLoading, setIsLoading] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const importFileRef = useRef<File | null>(null);
  const logoInputRef = useRef<HTMLInputElement | null>(null);
  const defaultLogoUrl = (import.meta.env.BASE_URL || '/') + 'logo.png';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, files } = e.target as any;
    if (type === 'file' && files && files[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setCurrentSettings(prev => ({ ...prev, logoBase64: ev.target?.result as string }));
      };
      reader.readAsDataURL(files[0]);
    } else {
      setCurrentSettings(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(currentSettings);
  };

  // مفاتيح البيانات المهمة للتصدير
  const backupKeys = Object.keys(localStorage).filter(k => k.startsWith('student-gradebook-'));

  // تصدير النسخة الاحتياطية
  const handleExport = () => {
    const json = exportFullBackup(backupKeys);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'EDU-DOC-backup.json';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  };

  // استيراد النسخة الاحتياطية
  const handleImport = (file: File) => {
    setImportError(null);
    importFileRef.current = file;
    setShowConfirm(true);
  };

  // تأكيد الاستيراد
  const confirmImport = async () => {
    setIsLoading(true);
    setShowConfirm(false);
    try {
      const file = importFileRef.current;
      if (!file) return;
      const text = await file.text();
      const err = importFullBackup(text, true);
      if (err) setImportError(err);
      else window.location.reload();
    } catch (e) {
      setImportError('فشل الاستيراد: الملف غير صالح أو تالف.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 transition-opacity duration-300">
  <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-10 w-full max-w-3xl m-2 sm:m-6 border border-slate-200 relative">
    <img
      src={currentSettings.logoBase64 || defaultLogoUrl}
      alt="شعار"
      className="absolute top-3 right-3 h-20 w-auto rounded-md pointer-events-none select-none"
      style={{ objectFit: 'contain' }}
    />
  <h2 className="text-2xl font-bold mb-8 text-slate-800 text-center">الإعدادات</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[65vh] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 pr-1">
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <label htmlFor="logoBase64" className="sm:w-32 text-sm font-medium text-slate-700 whitespace-nowrap">تغيير الشعار</label>
              <input
                ref={logoInputRef}
                type="file"
                id="logoBase64"
                name="logoBase64"
                accept="image/*"
                onChange={handleChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => logoInputRef.current?.click()}
                className="px-2 py-1 text-xs font-semibold rounded bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border border-emerald-200"
              >
                تغيير الشعار
              </button>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <label htmlFor="schoolName" className="sm:w-32 text-sm font-medium text-slate-700 whitespace-nowrap">اسم المدرسة</label>
              <input
                type="text"
                id="schoolName"
                name="schoolName"
                value={currentSettings.schoolName}
                onChange={handleChange}
                className="flex-1 bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 p-2.5 min-w-0"
              />
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <label htmlFor="teacherName" className="sm:w-32 text-sm font-medium text-slate-700 whitespace-nowrap">اسم المعلم</label>
              <input
                type="text"
                id="teacherName"
                name="teacherName"
                value={currentSettings.teacherName}
                onChange={handleChange}
                className="flex-1 bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 p-2.5 min-w-0"
              />
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <label htmlFor="principalName" className="sm:w-32 text-sm font-medium text-slate-700 whitespace-nowrap">اسم مدير المدرسة</label>
              <input
                type="text"
                id="principalName"
                name="principalName"
                value={currentSettings.principalName}
                onChange={handleChange}
                className="flex-1 bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 p-2.5 min-w-0"
              />
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <label htmlFor="educationDirectorate" className="sm:w-32 text-sm font-medium text-slate-700 whitespace-nowrap">الإدارة التعليمية</label>
              <input
                type="text"
                id="educationDirectorate"
                name="educationDirectorate"
                value={currentSettings.educationDirectorate}
                onChange={handleChange}
                className="flex-1 bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 p-2.5 min-w-0"
              />
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <label htmlFor="semester" className="sm:w-32 text-sm font-medium text-slate-700 whitespace-nowrap">الفصل الدراسي</label>
              <select
                id="semester"
                name="semester"
                value={currentSettings.semester}
                onChange={handleChange}
                className="flex-1 bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 p-2.5 min-w-0"
              >
                <option value="الفصل الدراسي الأول">الفصل الدراسي الأول</option>
                <option value="الفصل الدراسي الثاني">الفصل الدراسي الثاني</option>
              </select>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <label htmlFor="academicYear" className="sm:w-32 text-sm font-medium text-slate-700 whitespace-nowrap">العام الدراسي</label>
              <input
                type="text"
                id="academicYear"
                name="academicYear"
                value={currentSettings.academicYear}
                onChange={handleChange}
                className="flex-1 bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 p-2.5 min-w-0"
              />
            </div>
            {/* تم حذف كل ما يتعلق بالذكاء الاصطناعي بناءً على طلب المستخدم */}
          </div>
          <BackupButtons onExport={handleExport} onImport={handleImport} isLoading={isLoading} />
          {importError && <div className="text-red-600 text-sm mt-2">{importError}</div>}
          <div className="flex justify-end gap-4 mt-8 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-4 text-sm font-medium text-slate-700 bg-white rounded-lg border border-slate-300 hover:bg-slate-100 focus:z-10 focus:ring-4 focus:ring-slate-200 transition-colors"
            >
              إغلاق
            </button>
            <button
              type="submit"
              className="py-2 px-4 text-sm font-medium text-white bg-[#2E8540] rounded-lg hover:bg-[#246b33] focus:ring-4 focus:ring-green-300 transition-colors"
              disabled={isLoading}
            >
              حفظ التغييرات
            </button>
          </div>
          {/* نافذة تأكيد الاستيراد */}
          {showConfirm && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-xl p-6 max-w-xs w-full">
                <div className="text-lg font-bold mb-4 text-slate-800">تأكيد الاستيراد</div>
                <div className="mb-4 text-slate-700 text-sm">سيتم حذف جميع البيانات الحالية واستبدالها بالنسخة الاحتياطية. هل أنت متأكد؟</div>
                <div className="flex gap-4 justify-end">
                  <button
                    className="py-2 px-4 text-sm font-medium text-slate-700 bg-white rounded-lg border border-slate-300 hover:bg-slate-100 transition-colors"
                    onClick={() => setShowConfirm(false)}
                  >إغلاق</button>
                  <button
                    className="py-2 px-4 text-sm font-medium text-white bg-[#E74856] rounded-lg hover:bg-[#b91c1c] transition-colors"
                    onClick={confirmImport}
                    disabled={isLoading}
                  >تأكيد الاستيراد</button>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default SettingsModal;