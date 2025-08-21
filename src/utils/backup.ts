// utils/backup.ts
// دوال التصدير والاستيراد الاحتياطي الشامل

export function exportFullBackup(keys: string[]): string {
  const backup: Record<string, any> = {};
  // تصدير كل بيانات localStorage
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key) continue;
    try {
      const value = localStorage.getItem(key);
      if (value !== null) backup[key] = JSON.parse(value);
    } catch (e) {
      // تخطي أي خطأ في القراءة
    }
  }
  // تصدير كل بيانات sessionStorage
  backup.__session = {};
  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i);
    if (!key) continue;
    backup.__session[key] = sessionStorage.getItem(key);
  }
  return JSON.stringify(backup, null, 2);
}

export function importFullBackup(json: string, confirmReplace: boolean = true): string | null {
  try {
    const backup = JSON.parse(json);
    // تأكيد الاستبدال الكامل
    if (confirmReplace) {
      localStorage.clear();
      sessionStorage.clear();
    }
    // استعادة كل بيانات localStorage
    Object.keys(backup).forEach(key => {
      if (key === '__session') return;
      localStorage.setItem(key, JSON.stringify(backup[key]));
    });
    // استعادة كل بيانات sessionStorage
    if (backup.__session) {
      Object.keys(backup.__session).forEach(key => {
        if (backup.__session[key] !== null) sessionStorage.setItem(key, backup.__session[key]);
      });
    }
    return null;
  } catch (e) {
    return 'فشل الاستيراد: الملف غير صالح أو تالف.';
  }
}
