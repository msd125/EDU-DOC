// ملف يحتوي على معلومات الإصدار
// يُستخدم في جميع أنحاء التطبيق للتحقق من الإصدار الحالي

export const APP_VERSION = '0.1.5';
export const BUILD_DATE = new Date().toISOString().split('T')[0]; // تاريخ البناء
export const BUILD_NUMBER = Date.now(); // رقم البناء الفريد

// إعداد رقم البناء بتنسيق أكثر إنسانية
const buildDate = new Date();
export const HUMAN_BUILD_NUMBER = 
  buildDate.getFullYear().toString().substring(2) + // السنة (آخر رقمين)
  (buildDate.getMonth() + 1).toString().padStart(2, '0') + // الشهر
  buildDate.getDate().toString().padStart(2, '0') + // اليوم
  buildDate.getHours().toString().padStart(2, '0') + // الساعة
  buildDate.getMinutes().toString().padStart(2, '0'); // الدقيقة

// الإصدار الكامل للعرض
export const FULL_VERSION = `${APP_VERSION}-${HUMAN_BUILD_NUMBER}`;
