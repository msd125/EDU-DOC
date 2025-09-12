// ملف يحتوي على معلومات الإصدار
// يُستخدم في جميع أنحاء التطبيق للتحقق من الإصدار الحالي

export const APP_VERSION = '2.0.0';
export const BUILD_DATE = '2025-09-12'; // تاريخ البناء
export const BUILD_NUMBER = Date.now(); // رقم البناء الفريد

// إعداد رقم البناء بتنسيق أكثر إنسانية  
const buildDate = new Date('2025-09-12');
export const HUMAN_BUILD_NUMBER = 
  buildDate.getFullYear().toString().substring(2) + // السنة (آخر رقمين)
  (buildDate.getMonth() + 1).toString().padStart(2, '0') + // الشهر
  buildDate.getDate().toString().padStart(2, '0') + // اليوم
  '1200'; // الساعة والدقيقة (12:00)

// الإصدار الكامل للعرض
export const FULL_VERSION = `${APP_VERSION}-${HUMAN_BUILD_NUMBER}`;
