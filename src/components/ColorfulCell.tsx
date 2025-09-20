import React, { useState, useRef, ReactNode, cloneElement, isValidElement } from 'react';
import { createPortal } from 'react-dom';

interface ColorfulCellProps {
  children: ReactNode;
  cellId?: string;
  openCell?: string | null;
  setOpenCell?: (id: string | null) => void;
}

// ألوان أساسية فقط (أحمر، أصفر، أخضر، أزرق، أسود، أبيض)
const PALETTE = [
  '#ffffff', // أبيض
  '#000000', // أسود
  '#f87171', // أحمر
  '#fbbf24', // أصفر
  '#4ade80', // أخضر
  '#60a5fa', // أزرق
];
const TEXT_COLORS = ['#222222', '#000000', '#ffffff', '#f87171', '#60a5fa'];
const FONT_SIZES = ['12px', '14px', '16px', '18px', '20px'];
const TEXT_ALIGNS = ['right', 'center', 'left'];


// cellId يجب أن يكون فريدًا لكل خلية (مثلاً: studentId-colId)
const getCellKey = (cellId?: string) => cellId ? `colorfulcell-${cellId}` : '';

const ColorfulCell: React.FC<ColorfulCellProps> = ({ children, cellId, openCell, setOpenCell }) => {
  const showPicker = openCell === cellId;
  // استرجاع القيم من localStorage إذا وجدت
  // cellId يجب أن يكون بالشكل studentId-colId ليكون فريدًا لكل خلية
  const initial = () => {
    if (!cellId) return null;
    try {
      const saved = localStorage.getItem(getCellKey(cellId));
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  };
  const [bgColor, setBgColor] = useState<string>(initial()?.bgColor || '#ffffff');
  const [textColor, setTextColor] = useState<string>(initial()?.textColor || '#222222');
  const [fontSize, setFontSize] = useState<string>(initial()?.fontSize || '14px');
  const [textAlign, setTextAlign] = useState<'right' | 'center' | 'left'>(initial()?.textAlign || 'center');
  const timerRef = useRef<any>(null);
  const touchStartRef = useRef<{x: number; y: number} | null>(null);
  const movedRef = useRef<boolean>(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);

  // Ensure portal is mounted only on client
  React.useEffect(() => { setIsClient(true); }, []);

  // Close picker with Escape key when open
  React.useEffect(() => {
    if (!showPicker) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && setOpenCell) setOpenCell(null);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [showPicker, setOpenCell]);

  // حفظ التخصيصات عند أي تغيير
  React.useEffect(() => {
    if (!cellId) return;
    const data = { bgColor, textColor, fontSize, textAlign };
    localStorage.setItem(getCellKey(cellId), JSON.stringify(data));
  }, [bgColor, textColor, fontSize, textAlign, cellId]);

  const handleTouchStart = (e: React.TouchEvent) => {
    // لا تفتح الأداة إذا كان اللمس على عنصر إدخال/قائمة/زر لمنع الارتباك
    const target = e.target as HTMLElement;
    const tag = target?.tagName;
    if (tag && (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA' || tag === 'BUTTON')) return;
    if (!setOpenCell || !cellId) return;
    const t = e.touches && e.touches[0];
    if (t) {
      touchStartRef.current = { x: t.clientX, y: t.clientY };
      movedRef.current = false;
    }
    // زيادة زمن الضغط المطوّل لتقليل الفتح العرضي
    timerRef.current = setTimeout(() => {
      if (!movedRef.current) setOpenCell(cellId);
    }, 800);
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const t = e.touches && e.touches[0];
    if (!t) return;
    const dx = Math.abs(t.clientX - touchStartRef.current.x);
    const dy = Math.abs(t.clientY - touchStartRef.current.y);
    // إذا تحرّك الإصبع مسافة كافية نُلغي الضغط المطوّل (يساعد أثناء السحب/التمرير)
    const THRESHOLD = 10; // بكسل
    if (dx > THRESHOLD || dy > THRESHOLD) {
      movedRef.current = true;
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    }
  };
  const handleTouchEnd = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    touchStartRef.current = null;
    movedRef.current = false;
  };
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    if (setOpenCell && cellId) setOpenCell(cellId);
  };

  // إضافة خصائص النص والخلفية لعناصر الإدخال
  const styledChild = isValidElement(children) && (children.type === 'input' || children.type === 'select' || children.type === 'textarea')
    ? cloneElement(children, {
        style: {
          ...(children.props.style || {}),
          background: bgColor,
          color: textColor,
          fontSize,
          textAlign
        }
      })
    : children;

  const resetAll = () => {
    setBgColor('#ffffff');
    setTextColor('#222222');
    setFontSize('14px');
    setTextAlign('center');
    if (cellId) localStorage.removeItem(getCellKey(cellId));
    if (setOpenCell) setOpenCell(null);
  };

  // تم إزالة منطق تعديل موقع البوب أوفر تلقائياً ليظهر دائماً في وسط الشاشة فقط
  const pickerPortal = (showPicker && isClient) ? createPortal(
    (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          background: 'rgba(0,0,0,0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onClick={() => setOpenCell && setOpenCell(null)}
      >
        <div
          ref={popoverRef}
          onClick={e => e.stopPropagation()}
          style={{
            background: '#fff',
            color: '#222',
            boxShadow: '0 2px 16px #0003',
            borderRadius: 10,
            padding: 12,
            width: 'min(360px, 96vw)',
            minWidth: 200,
            minHeight: 120,
            maxHeight: '90vh',
            overflowY: 'auto',
            border: '1px solid #e5e7eb',
            fontFamily: 'inherit',
            fontSize: '14px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* شريط أدوات النص */}
          <div
            style={{
              display: 'flex',
              gap: 6,
              marginBottom: 10,
              alignItems: 'center',
              justifyContent: 'center',
              background: '#f3f4f6',
              borderRadius: 6,
              padding: 4,
              color: '#222',
            }}
          >
            {/* محاذاة */}
            {TEXT_ALIGNS.map(align => (
              <button
                key={align}
                onClick={() => setTextAlign(align as any)}
                style={{
                  fontWeight: textAlign === align ? 'bold' : 'normal',
                  border: textAlign === align ? '2px solid #60a5fa' : '1px solid #ddd',
                  borderRadius: 4,
                  padding: '2px 6px',
                  background: '#fff',
                  cursor: 'pointer',
                  color: '#222',
                }}
              >
                {align === 'right' ? 'يمين' : align === 'center' ? 'وسط' : 'يسار'}
              </button>
            ))}
            {/* لون النص */}
            <select
              value={textColor}
              onChange={e => setTextColor(e.target.value)}
              style={{
                borderRadius: 4,
                border: '1px solid #ddd',
                padding: '2px 4px',
                background: '#fff',
                color: '#222',
                fontWeight: 'bold',
              }}
            >
              {TEXT_COLORS.map(c => (
                <option key={c} value={c} style={{ background: c, color: c === '#fff' ? '#222' : '#fff' }}>{c}</option>
              ))}
            </select>
            {/* حجم النص */}
            <select
              value={fontSize}
              onChange={e => setFontSize(e.target.value)}
              style={{ borderRadius: 4, border: '1px solid #ddd', padding: '2px 4px', background: '#fff', color: '#222' }}
            >
              {FONT_SIZES.map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>
          {/* لوحة ألوان الخلفية */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12, justifyContent: 'center', background: '#fff' }}>
            {PALETTE.map(color => (
              <button
                key={color}
                onClick={() => setBgColor(color)}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: color,
                  border: bgColor === color ? '2px solid #222' : '1px solid #ccc',
                  cursor: 'pointer',
                  outline: 'none',
                }}
              />
            ))}
          </div>
          {/* أزرار أسفل الأداة */}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 10, background: '#fff' }}>
            <button
              onClick={() => setOpenCell && setOpenCell(null)}
              style={{ padding: '6px 18px', borderRadius: 5, background: '#eee', border: 'none', cursor: 'pointer', fontWeight: 500, color: '#222' }}
            >
              إغلاق
            </button>
            <button
              onClick={resetAll}
              style={{ padding: '6px 18px', borderRadius: 5, background: '#f87171', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 500 }}
            >
              إعادة الافتراضي
            </button>
          </div>
        </div>
      </div>
    ),
    document.body
  ) : null;

  return (
    <td
      style={{ background: bgColor, color: textColor, cursor: 'pointer', minWidth: 120, position: 'relative', fontSize, textAlign }}
      onContextMenu={handleContextMenu}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      className="text-center px-2 py-2 border"
    >
      {styledChild}
      {pickerPortal}
    </td>
  );
};

export default ColorfulCell;
