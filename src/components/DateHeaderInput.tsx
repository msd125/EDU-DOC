import React, { useRef, useState } from 'react';

// دالة محسنة لكشف الجوال/الآيباد
function isMobileDevice() {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return false;
  
  // طريقة 1: استخدام User-Agent (الأكثر موثوقية)
  const ua = navigator.userAgent;
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)) return true;
  
  // طريقة 2: استخدام navigator.maxTouchPoints 
  if (navigator.maxTouchPoints && navigator.maxTouchPoints > 2) return true;
  
  // طريقة 3: استخدام matchMedia للتحقق من الاستعلامات الخاصة بالأجهزة
  if (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) return true;
  
  // طريقة 4: التحقق من عرض الشاشة (كإجراء احتياطي)
  return window.innerWidth <= 1024;
}


interface DateHeaderInputProps {
  col: any;
}

const DateHeaderInput: React.FC<DateHeaderInputProps> = ({ col }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [inputEnabled, setInputEnabled] = useState(false);
  const [value, setValue] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);
  const isMobile = isMobileDevice(); // نحفظ النتيجة للاستخدام المتكرر

  // عند الموافقة على التعديل
  const handleConfirm = () => {
    setShowConfirm(false);
    setInputEnabled(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
    console.log('تم تأكيد تعديل التاريخ');
  };

  // عند إلغاء التعديل
  const handleCancel = () => {
    setShowConfirm(false);
    setInputEnabled(false);
    console.log('تم إلغاء تعديل التاريخ');
  };

  // عند الضغط على الحقل في الجوال/الآيباد
  const handleTouch = (e: React.TouchEvent | React.MouseEvent) => {
    if (isMobile && !inputEnabled) {
      e.preventDefault();
      setShowConfirm(true);
      console.log('تم الضغط على حقل التاريخ - فتح نافذة التأكيد');
      return false;
    }
    console.log('تم الضغط على حقل التاريخ - جهاز عادي أو تم تمكين الإدخال');
    return true;
  };

  // عند تغيير القيمة
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  // علامة للإشارة إلى أن الحقل يتطلب تأكيدًا على الأجهزة المحمولة
  const mobileIndicator = isMobile ? (
    <span style={{ position: 'absolute', top: -2, right: 0, fontSize: 12, color: '#047857' }}>📱</span>
  ) : null;

  return (
    <div style={{ position: 'relative' }}>
      {mobileIndicator}
      <input
        type={col.type === 'رقم' || col.type === 'NUMBER' ? 'number' : col.type === 'تاريخ' || col.type === 'DATE' ? 'date' : 'text'}
        className="w-full mt-1 p-1 text-xs sm:text-sm text-center rounded bg-white text-slate-700 border border-slate-300 focus:ring-emerald-500 focus:border-emerald-500"
        placeholder="تعميم لكل العمود"
        style={{ 
          fontSize: 10, 
          minWidth: 0, 
          maxWidth: 120, 
          backgroundColor: isMobile && !inputEnabled ? '#f8f8f8' : '#fff' // تغيير لون الخلفية للإشارة
        }}
        ref={inputRef}
        readOnly={isMobile && !inputEnabled}
        onTouchStart={handleTouch}
        onMouseDown={handleTouch}
        value={value}
        onChange={handleChange}
      />
      {showConfirm && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: 8, padding: 24, minWidth: 220, boxShadow: '0 2px 16px #0002', textAlign: 'center' }}>
            <div style={{ marginBottom: 16, fontWeight: 600, fontSize: 18 }}>تأكيد تعديل التاريخ</div>
            <div style={{ marginBottom: 20, fontSize: 16 }}>هل تريد تعديل التاريخ لهذا العمود؟</div>
            <button onClick={handleConfirm} style={{ background: '#059669', color: '#fff', border: 'none', borderRadius: 4, padding: '10px 20px', marginRight: 12, fontWeight: 600, fontSize: 16, cursor: 'pointer' }}>نعم</button>
            <button onClick={handleCancel} style={{ background: '#e5e7eb', color: '#222', border: 'none', borderRadius: 4, padding: '10px 20px', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}>إلغاء</button>
          </div>
        </div>
      )}
    </>
  );
};

export default DateHeaderInput;