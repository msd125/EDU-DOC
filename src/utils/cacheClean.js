// هذا الملف يساعد في تنظيف التخزين المؤقت للمتصفح والتحقق من الإصدارات
import { FULL_VERSION, BUILD_NUMBER } from './version';

// إعداد معرف الإصدار في localStorage
function setupVersionCheck() {
  const storedVersionId = localStorage.getItem('edu-doc-version-id');
  const currentVersionId = BUILD_NUMBER.toString();
  
  // إذا اختلف الإصدار، قم بتنظيف التخزين المؤقت
  if (storedVersionId !== currentVersionId) {
    console.log(`تم اكتشاف إصدار جديد: ${FULL_VERSION}`);
    
    // تنظيف التخزين المؤقت للتطبيق
    if ('caches' in window) {
      caches.keys().then(function(cacheNames) {
        return Promise.all(
          cacheNames.filter(function(cacheName) {
            // تنظيف جميع الكاش المرتبط بالتطبيق
            return cacheName.startsWith('edu-doc');
          }).map(function(cacheName) {
            console.log(`تنظيف التخزين المؤقت: ${cacheName}`);
            return caches.delete(cacheName);
          })
        );
      });
    }
    
    // تخزين معرف الإصدار الجديد
    localStorage.setItem('edu-doc-version-id', currentVersionId);
  }
}

window.addEventListener('load', function() {
  // تنظيف التخزين المؤقت والتحقق من الإصدار
  setupVersionCheck();
  
  // طباعة رسالة في وحدة التحكم للتأكد من تحميل الملف الجديد
  console.log(`تم تحميل التطبيق - ${FULL_VERSION}`);
  
  // إضافة إشعار للمستخدم عن تحديث الإصدار إذا لزم الأمر
  const lastSeenVersion = sessionStorage.getItem('edu-doc-seen-version');
  if (lastSeenVersion && lastSeenVersion !== FULL_VERSION) {
    // يمكن إضافة إشعار هنا عن التحديث الجديد
    console.log('تم تثبيت إصدار جديد من التطبيق');
  }
  sessionStorage.setItem('edu-doc-seen-version', FULL_VERSION);
});
