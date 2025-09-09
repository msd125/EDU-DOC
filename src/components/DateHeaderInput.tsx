import React, { useRef, useState } from 'react';

// دالة بسيطة لكشف الجوال/الآيباد
function isMobileDevice() {
  if (typeof navigator === 'undefined') return false;
  return /android|iphone|ipad|ipod|mobile|touch/i.test(navigator.userAgent);
}

const DateHeaderInput: React.FC<{ col: any }> = ({ col }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [inputEnabled, setInputEnabled] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // عند الموافقة على التعميم
  const handleConfirm = () => {
    setShowConfirm(false);
    setInputEnabled(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  // عند إلغاء التعميم
  const handleCancel = () => {
    setShowConfirm(false);
    setInputEnabled(false);
  };

  // عند الضغط على الحقل في الجوال
  const handleTouch = (e: React.TouchEvent | React.MouseEvent) => {
    if (isMobileDevice() && !inputEnabled) {
      e.preventDefault();
      setShowConfirm(true);
    }
  };

  return (
    <>
      <input
        type={col.type === 'رقم' || col.type === 'NUMBER' ? 'number' : col.type === 'تاريخ' || col.type === 'DATE' ? 'date' : 'text'}
        className="w-full mt-1 p-1 text-xs sm:text-sm text-center rounded bg-white text-slate-700 border border-slate-300 focus:ring-emerald-500 focus:border-emerald-500"
        placeholder="تعميم لكل العمود"
        style={{ fontSize: 10, minWidth: 0, maxWidth: 120 }}
        ref={inputRef}
        readOnly={isMobileDevice() && !inputEnabled}
        onTouchStart={handleTouch}
        onMouseDown={handleTouch}
      />
      {showConfirm && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.25)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: 8, padding: 24, minWidth: 220, boxShadow: '0 2px 16px #0002', textAlign: 'center' }}>
            <div style={{ marginBottom: 16, fontWeight: 600 }}>تأكيد تعميم التاريخ</div>
            <div style={{ marginBottom: 20, fontSize: 14 }}>هل تريد تعديل أو تعميم التاريخ على كل الحقول؟</div>
            <button onClick={handleConfirm} style={{ background: '#059669', color: '#fff', border: 'none', borderRadius: 4, padding: '8px 18px', marginRight: 8, fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>نعم</button>
            <button onClick={handleCancel} style={{ background: '#e5e7eb', color: '#222', border: 'none', borderRadius: 4, padding: '8px 18px', fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>إلغاء</button>
          </div>
        </div>
      )}
    </>
  );
};

export default DateHeaderInput;