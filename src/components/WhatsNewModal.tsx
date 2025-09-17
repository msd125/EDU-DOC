import React, { useState, useEffect } from 'react';
import { FULL_VERSION } from '../utils/version';

interface WhatsNewModalProps {
  isOpen: boolean;
  onClose: (dontShowAgain?: boolean) => void;
}

const WhatsNewModal: React.FC<WhatsNewModalProps> = ({ isOpen, onClose }) => {
  const [dontShowAgain, setDontShowAgain] = useState(false);
  
  const handleClose = () => {
    onClose(dontShowAgain);
  };

  // إنشاء قصاصات وورود متطايرة
  useEffect(() => {
    if (!isOpen) return;

    const createFloatingElement = (emoji: string, className: string) => {
      const element = document.createElement('div');
      element.innerHTML = emoji;
      element.className = className;
      element.style.position = 'fixed';
      element.style.pointerEvents = 'none';
      element.style.zIndex = '9999';
      element.style.fontSize = '24px';
      element.style.left = Math.random() * 100 + 'vw';
      element.style.animationDuration = (Math.random() * 3 + 2) + 's';
      element.style.animationDelay = Math.random() * 2 + 's';
      document.body.appendChild(element);

      // إزالة العنصر بعد انتهاء الأنيميشن
      setTimeout(() => {
        if (element.parentNode) {
          element.parentNode.removeChild(element);
        }
      }, 5000);
    };

    // إضافة ستايل CSS للأنيميشن
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fall-and-sway {
        0% {
          transform: translateY(-100vh) rotate(0deg);
          opacity: 1;
        }
        100% {
          transform: translateY(100vh) rotate(360deg);
          opacity: 0;
        }
      }
      
      @keyframes confetti-fall {
        0% {
          transform: translateY(-100vh) rotateZ(0deg);
          opacity: 1;
        }
        100% {
          transform: translateY(100vh) rotateZ(720deg);
          opacity: 0;
        }
      }
      
      @keyframes bubble-float {
        0% {
          transform: translateY(100vh) scale(0);
          opacity: 0.7;
        }
        50% {
          transform: translateY(50vh) scale(1);
          opacity: 1;
        }
        100% {
          transform: translateY(-100vh) scale(0.5);
          opacity: 0;
        }
      }
      
      .floating-flower {
        animation: fall-and-sway linear infinite;
      }
      
      .floating-confetti {
        animation: confetti-fall linear infinite;
      }
      
      .floating-bubble {
        animation: bubble-float linear infinite;
        border-radius: 50%;
        border: 2px solid rgba(255,255,255,0.3);
        backdrop-filter: blur(2px);
      }
      
      .floating-bubble.large {
        width: 30px;
        height: 30px;
      }
      
      .floating-bubble.small {
        width: 15px;
        height: 15px;
      }
    `;
    document.head.appendChild(style);

    // إنشاء عناصر متطايرة - مع تقليل الكمية للأجهزة المحمولة
    const interval = setInterval(() => {
      const flowers = ['🌹', '🌸', '🌺', '🌻', '🌷', '🌼', '💐', '🏵️', '🌿', '🍃'];
      const confetti = ['🎊', '🎉', '✨', '⭐', '🎈', '🎀', '💫', '🌟', '💥', '🔥', '⚡', '💎'];
      const bubbleColors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd'];
      
      // تقليل الكمية على الأجهزة الصغيرة
      const isMobile = window.innerWidth < 640; // sm breakpoint
      const flowerCount = isMobile ? 1 : 3;
      const confettiCount = isMobile ? 2 : 4;
      const bubbleCount = isMobile ? 2 : 5;
      
      // ورود متطايرة
      for (let i = 0; i < flowerCount; i++) {
        if (Math.random() > 0.3) {
          const flower = flowers[Math.floor(Math.random() * flowers.length)];
          createFloatingElement(flower, 'floating-flower');
        }
      }
      
      // قصاصات متطايرة
      for (let i = 0; i < confettiCount; i++) {
        if (Math.random() > 0.2) {
          const confettiPiece = confetti[Math.floor(Math.random() * confetti.length)];
          createFloatingElement(confettiPiece, 'floating-confetti');
        }
      }
      
      // فقاعات ملونة
      for (let i = 0; i < bubbleCount; i++) {
        if (Math.random() > 0.1) {
          const bubble = document.createElement('div');
          const sizes = ['small', '', 'large'];
          const size = sizes[Math.floor(Math.random() * sizes.length)];
          bubble.className = `floating-bubble ${size}`;
          bubble.style.position = 'fixed';
          bubble.style.pointerEvents = 'none';
          bubble.style.zIndex = '9999';
          bubble.style.left = Math.random() * 100 + 'vw';
          bubble.style.backgroundColor = bubbleColors[Math.floor(Math.random() * bubbleColors.length)];
          bubble.style.boxShadow = `0 0 ${Math.random() * 20 + 10}px rgba(255,255,255,0.8), inset 0 0 20px rgba(255,255,255,0.3)`;
          bubble.style.animationDuration = (Math.random() * 4 + 3) + 's';
          bubble.style.animationDelay = Math.random() * 1 + 's';
          bubble.style.width = size === 'large' ? '35px' : size === 'small' ? '12px' : '22px';
          bubble.style.height = bubble.style.width;
          document.body.appendChild(bubble);

          // إزالة الفقاعة بعد انتهاء الأنيميشن
          setTimeout(() => {
            if (bubble.parentNode) {
              bubble.parentNode.removeChild(bubble);
            }
          }, 8000);
        }
      }
    }, 200); // تقليل الفترة لزيادة التكرار

    // تنظيف عند إغلاق المودال
    return () => {
      clearInterval(interval);
      document.head.removeChild(style);
      // إزالة جميع العناصر المتطايرة
      const floatingElements = document.querySelectorAll('.floating-flower, .floating-confetti, .floating-bubble');
      floatingElements.forEach(el => {
        if (el.parentNode) {
          el.parentNode.removeChild(el);
        }
      });
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-2 sm:p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto relative border-2 sm:border-4 border-gradient-to-r border-pink-300">
    {/* خلفية متحركة مع تدرج ألوان (لوحة جديدة مميزة عن السابقة) */}
  <div className="bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-400 text-white p-4 sm:p-6 rounded-t-xl sm:rounded-t-2xl relative overflow-hidden">
          {/* تأثيرات بريق متعددة */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 transform -skew-x-12 animate-ping pointer-events-none"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-yellow-400 via-transparent to-transparent opacity-10 animate-pulse pointer-events-none"></div>
          
          <div className="flex justify-between items-center relative z-10">
            <div>
              <h2 className="text-lg sm:text-2xl font-bold mb-2">
                🎉✨ ما الجديد في الإصدار {FULL_VERSION} ✨🎉
              </h2>
              <p className="opacity-90 text-sm sm:text-lg">تحديثات مهمة لتحسين تجربتك 🚀</p>
            </div>
            <button
              onClick={handleClose}
              className="text-white hover:bg-white hover:bg-opacity-30 rounded-full p-2 transition-all transform hover:scale-110 hover:rotate-90"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-6 relative">
          {/* خلفية احتفالية خفيفة */}
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-50 via-pink-50 to-blue-50 opacity-30 rounded-b-xl sm:rounded-b-2xl pointer-events-none"></div>
          
          <div className="space-y-4 sm:space-y-6 relative z-10">
            {/* ميزة ثورية: مجموعة مربعات (ألوان جديدة تختلف عن السابقة) */}
            <div className="rounded-xl sm:rounded-2xl border-2 border-emerald-300 bg-gradient-to-br from-emerald-50 via-white to-emerald-50 p-4 sm:p-6 shadow-md">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-6">
                <div className="flex-1">
                  <div className="inline-flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold text-white bg-emerald-600 px-2 py-0.5 rounded-full">جديد كليًا</span>
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">ثوري</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-emerald-800 mb-1">مجموعة مربعات (Multi‑Checkbox)</h3>
                  <p className="text-sm sm:text-base text-slate-700 mb-3">
                    صمّم خانة واحدة تحتوي عدة مربعات داخلها، بثلاث حالات (صح ✓ / خطأ ✗ / فارغ –)، وحدد بسهولة عدد الخانات والعناوين، مع عدّاد اختياري.
                  </p>
                  <ul className="text-sm text-slate-700 space-y-1 list-disc ms-4">
                    <li>اختيار عدد الخانات (1 إلى أي عدد يناسبك)</li>
                    <li>عداد تلقائي لعدد الخانات المستخدمة (مثلاً 4/8)</li>
                    <li>تسميات اختيارية لكل خانة (أسبوع 1، أسبوع 2...)</li>
                    <li>عرض رائع في التقارير: رموز كبيرة وواضحة بالألوان</li>
                  </ul>
                </div>
                {/* معاينة مرئية بسيطة */}
                <div className="flex-shrink-0 w-full sm:w-auto">
                  <div className="mx-auto sm:ms-0 w-full max-w-[320px] bg-white/70 border border-emerald-200 rounded-xl p-3 shadow">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-slate-600">عدد الخانات: 8</span>
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">4/8</span>
                    </div>
                    <div className="grid grid-cols-8 gap-1.5">
                      {/* صف معاينة لمربعات بثلاث حالات */}
                      <div className="w-6 h-6 rounded border border-emerald-600 bg-[rgba(22,163,74,0.13)] flex items-center justify-center text-emerald-700 text-sm">✔</div>
                      <div className="w-6 h-6 rounded border border-red-600 bg-[rgba(255,26,26,0.18)] flex items-center justify-center text-red-700 text-sm">✗</div>
                      <div className="w-6 h-6 rounded border border-slate-300 bg-white flex items-center justify-center text-slate-500 text-sm">–</div>
                      <div className="w-6 h-6 rounded border border-emerald-600 bg-[rgba(22,163,74,0.13)] flex items-center justify-center text-emerald-700 text-sm">✔</div>
                      <div className="w-6 h-6 rounded border border-red-600 bg-[rgba(255,26,26,0.18)] flex items-center justify-center text-red-700 text-sm">✗</div>
                      <div className="w-6 h-6 rounded border border-slate-300 bg-white flex items-center justify-center text-slate-500 text-sm">–</div>
                      <div className="w-6 h-6 rounded border border-emerald-600 bg-[rgba(22,163,74,0.13)] flex items-center justify-center text-emerald-700 text-sm">✔</div>
                      <div className="w-6 h-6 rounded border border-slate-300 bg-white flex items-center justify-center text-slate-500 text-sm">–</div>
                    </div>
                    <div className="mt-2 grid grid-cols-4 gap-1 text-[10px] text-slate-500">
                      <span className="truncate">أسبوع 1</span>
                      <span className="truncate">أسبوع 2</span>
                      <span className="truncate">أسبوع 3</span>
                      <span className="truncate">أسبوع 4</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      try {
                        // إغلاق المودال ثم إرسال حدث اختياري يمكن للتطبيق الاستماع له
                        handleClose();
                        setTimeout(() => window.dispatchEvent(new Event('try-multi-checkbox')), 0);
                      } catch {}
                    }}
                    className="mt-3 w-full bg-emerald-600 hover:bg-green-700 text-white text-sm font-bold py-2 px-4 rounded-lg shadow"
                    title="جرّب إضافة عمود مجموعة مربعات الآن"
                  >
                    جرّبها الآن
                  </button>
                </div>
              </div>
            </div>

            {/* ملاحظات هذا الإصدار (لون مختلف عن السابق) */}
            <div className="border-2 border-green-300 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg sm:rounded-xl p-4 sm:p-6 hover:shadow-xl transition-all transform hover:scale-105 hover:border-green-400">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="text-2xl sm:text-4xl animate-pulse">✨</div>
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-bold text-green-800 mb-2 sm:mb-3">تحسينات واجهة وتقارير</h3>
                  <ul className="space-y-1 sm:space-y-2">
                    <li className="flex items-start gap-2 text-gray-600"><span className="text-xs sm:text-sm mt-1">🧭</span><span className="text-xs sm:text-sm">تحسين محاذاة الجدول مع البادنق الأيسر (RTL)</span></li>
                    <li className="flex items-start gap-2 text-gray-600"><span className="text-sm mt-1">🧾</span><span className="text-sm">توسيط كل الحقول في PDF ما عدا الاسم</span></li>
                    <li className="flex items-start gap-2 text-gray-600"><span className="text-sm mt-1">🪲</span><span className="text-sm">إصلاحات تمنع الشاشة البيضاء عند تغيير نوع العمود</span></li>
                    <li className="flex items-start gap-2 text-gray-600"><span className="text-sm mt-1">🧩</span><span className="text-sm">حل مشكلة "Rendered more hooks" في إدارة الأعمدة</span></li>
                    <li className="flex items-start gap-2 text-gray-600"><span className="text-sm mt-1">☑️</span><span className="text-sm">إضافة نوع عمود جديد: مجموعة مربعات (Multi‑Checkbox) مع إمكانية اختيار عدد المربعات والعناوين</span></li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* تحسينات تقنية */}
            <div className="border-2 border-emerald-300 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg sm:rounded-xl p-4 sm:p-6 hover:shadow-xl transition-all transform hover:scale-105 hover:border-emerald-400">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="text-2xl sm:text-4xl animate-pulse">🛠️</div>
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-bold text-emerald-800 mb-2 sm:mb-3 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                    <span>تحسينات تقنية وأداء</span>
                    <span className="text-xs sm:text-sm bg-emerald-200 text-emerald-800 px-2 py-1 rounded-full self-start">محدث!</span>
                  </h3>
                  <ul className="space-y-1 sm:space-y-2">
                    <li className="flex items-start gap-2 text-gray-600">
                      <span className="text-xs sm:text-sm mt-1">⚡</span>
                      <span className="text-xs sm:text-sm">تحسين سرعة التطبيق والاستجابة</span>
                    </li>
                    <li className="flex items-start gap-2 text-gray-600">
                      <span className="text-sm mt-1">🐛</span>
                      <span className="text-sm">إصلاح مشاكل وأخطاء في النظام</span>
                    </li>
                    <li className="flex items-start gap-2 text-gray-600">
                      <span className="text-sm mt-1">🎨</span>
                      <span className="text-sm">تحسين تصميم واجهة استيراد البيانات</span>
                    </li>
                    <li className="flex items-start gap-2 text-gray-600">
                      <span className="text-sm mt-1">🔧</span>
                      <span className="text-sm">تحسين كود التطبيق وتنظيمه</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* نظام الحذف المحسن */}
            <div className="border border-red-200 bg-red-50 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="text-3xl">🗑️</div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">نظام حذف محسن ومهني</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-gray-600">
                      <span className="text-sm mt-1">✅</span>
                      <span className="text-sm">تأكيدات واضحة عند الحذف</span>
                    </li>
                    <li className="flex items-start gap-2 text-gray-600">
                      <span className="text-sm mt-1">🔒</span>
                      <span className="text-sm">منع الحذف العرضي للبيانات المهمة</span>
                    </li>
                    <li className="flex items-start gap-2 text-gray-600">
                      <span className="text-sm mt-1">🎯</span>
                      <span className="text-sm">تحسين الأمان والموثوقية</span>
                    </li>
                    <li className="flex items-start gap-2 text-gray-600">
                      <span className="text-sm mt-1">📋</span>
                      <span className="text-sm">رسائل توضيحية لكل عملية حذف</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* نصيحة للاستخدام */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="text-2xl">💡</div>
                <div>
                  <h4 className="font-semibold text-gray-800">نصيحة للاستخدام</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    جرب الآن ميزة استيراد الطلاب الجديدة! يمكنك نسخ قائمة بأسماء الطلاب من أي مكان ولصقها مباشرة في التطبيق.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Checkbox لعدم إظهار النافذة مرة أخرى */}
          <div className="mt-6 flex items-center justify-center">
            <label className="flex items-center gap-2 text-gray-600 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={dontShowAgain}
                onChange={(e) => setDontShowAgain(e.target.checked)}
                className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
              />
              عدم إظهار هذه الرسالة مرة أخرى
            </label>
          </div>

          <div className="mt-4 sm:mt-6 flex justify-center">
            <button
              onClick={handleClose}
              className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white px-6 sm:px-12 py-3 sm:py-4 rounded-full hover:shadow-2xl transition-all transform hover:scale-110 animate-pulse hover:animate-none relative overflow-hidden group w-full sm:w-auto"
            >
              {/* تأثير بريق متحرك داخل الزر */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 transform -skew-x-12 group-hover:animate-ping"></div>
              
              <span className="relative z-10 text-base sm:text-lg font-bold">
                ابدأ الاستخدام 🚀✨🎉
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatsNewModal;
