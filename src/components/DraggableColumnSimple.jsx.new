import React, { useState, useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { getContrastColor } from '../utils/colorUtils';

// دالة للكشف عن الأجهزة المحمولة والآيباد
function isMobileOrTablet() {
  // التحقق مما إذا كنا في بيئة المتصفح
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return false;
  
  // طريقة 1: استخدام واجهة navigator.maxTouchPoints (أكثر موثوقية في المتصفحات الحديثة)
  if (navigator.maxTouchPoints && navigator.maxTouchPoints > 2) return true;
  
  // طريقة 2: استخدام matchMedia للتحقق من الاستعلامات الخاصة بالأجهزة (أكثر دقة للجوال)
  if (window.matchMedia('(pointer: coarse)').matches) return true;
  
  // طريقة 3: استخدام User-Agent (طريقة تقليدية)
  const ua = navigator.userAgent;
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)) return true;
  
  // طريقة 4: التحقق من عرض الشاشة (كإجراء احتياطي)
  return window.innerWidth <= 1024; // الآيباد والأجهزة اللوحية غالباً أقل من هذا العرض
}

// نوع العنصر للسحب والإفلات
const ItemTypes = {
  COLUMN: 'column'
};

// مكون عنوان العمود القابل للسحب
const DraggableHeader = ({ 
  column, 
  index, 
  moveColumn, 
  themeColor, 
  onEditColumn, 
  onDeleteColumn, 
  onFillColumn 
}) => {
  const ref = useRef(null);
  
  // إعداد السحب
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.COLUMN,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  
  // إعداد الإفلات
  const [, drop] = useDrop({
    accept: ItemTypes.COLUMN,
    hover: (item, monitor) => {
      if (!ref.current) {
        return;
      }
      
      const dragIndex = item.index;
      const hoverIndex = index;
      
      // لا تستبدل العناصر بنفسها
      if (dragIndex === hoverIndex) {
        return;
      }
      
      // تحديد منطقة الإفلات
      const hoverRect = ref.current.getBoundingClientRect();
      const hoverMiddleX = (hoverRect.right - hoverRect.left) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientX = clientOffset.x - hoverRect.left;
      
      // تحرك فقط عندما يكون المؤشر عبر نصف العنصر
      // عند السحب لليمين، انتقل فقط عند تجاوز النصف الأيمن
      // عند السحب لليسار، انتقل فقط عند تجاوز النصف الأيسر
      if (dragIndex < hoverIndex && hoverClientX < hoverMiddleX) {
        return;
      }
      if (dragIndex > hoverIndex && hoverClientX > hoverMiddleX) {
        return;
      }
      
      // تنفيذ النقل
      moveColumn(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });
  
  // جمع مراجع السحب والإفلات
  drag(drop(ref));
  
  // تخصيص لون خلفية العنوان
  const headerBgColor = themeColor || '#10b981'; // لون افتراضي إن لم يتم تحديده
  // لون النص (أبيض أو أسود) بناءً على لون الخلفية
  const textColor = getContrastColor(headerBgColor);
  
  return (
    <th 
      ref={ref} 
      style={{ 
        backgroundColor: headerBgColor,
        color: textColor,
        textAlign: 'center',
        padding: '0.5rem',
        position: 'relative',
        cursor: isDragging ? 'grabbing' : 'grab',
        opacity: isDragging ? 0.5 : 1,
        minWidth: '120px',
        maxWidth: '120px'
      }}
    >
      <div className="flex justify-between items-center mb-1">
        <button
          className="text-xs hover:bg-white hover:bg-opacity-20 rounded p-1"
          onClick={() => onEditColumn(column.id)}
          title="تعديل العمود"
          style={{ color: textColor }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
            <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
          </svg>
        </button>
        
        <div className="text-center font-bold text-xs sm:text-sm flex-grow">
          {column.name}
        </div>
        
        <button
          className="text-xs hover:bg-white hover:bg-opacity-20 rounded p-1"
          onClick={() => onDeleteColumn(column.id, column.name)}
          title="حذف العمود"
          style={{ color: textColor }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      
      {/* التعميم حسب نوع العمود */}
      <div className="bg-white rounded py-1 px-0.5 shadow-sm border border-gray-200 text-center">
        {column.type === 'قائمة' || column.type === 'LIST' ? (
          <select
            className="w-full mt-1 p-1 text-xs text-center rounded bg-white text-slate-700 border border-slate-300 focus:ring-emerald-500 focus:border-emerald-500"
            defaultValue=""
            onChange={e => {
              const value = e.target.value;
              if (value === '__empty__') {
                onFillColumn && onFillColumn(column.id, null);
                e.target.selectedIndex = 0;
              } else if (value !== '') {
                onFillColumn && onFillColumn(column.id, value);
                e.target.selectedIndex = 0;
              }
            }}
            style={{ fontSize: 10, minWidth: 0, maxWidth: 120 }}
          >
            <option value="">تعميم لكل العمود...</option>
            <option value="__empty__">بدون قيمة (تفريغ)</option>
            {(column.options || []).map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        ) : column.type === 'مربع اختيار' || column.type === 'CHECKBOX' ? (
          <div className="flex gap-1 mt-1 justify-center items-center">
            <input
              type="checkbox"
              onChange={e => onFillColumn && onFillColumn(column.id, e.target.checked)}
              title="تعميم تفعيل/إلغاء الكل"
              className="w-5 h-5 sm:w-6 sm:h-6 accent-emerald-600"
            />
            <button
              type="button"
              className="text-xs text-slate-400 hover:text-red-500 border px-1 rounded ml-1"
              title="تفريغ الكل"
              onClick={() => onFillColumn && onFillColumn(column.id, null)}
            >تفريغ</button>
          </div>
        ) : (
          <div className="flex items-center gap-1">
            {(column.type === 'تاريخ' || column.type === 'DATE') ? (
              <DateInputWithConfirm 
                column={column}
                onFillColumn={onFillColumn}
              />
            ) : (
              <input
                type={column.type === 'رقم' || column.type === 'NUMBER' ? 'number' : 'text'}
                className="w-full mt-1 p-1 text-xs sm:text-sm text-center rounded bg-white text-slate-700 border border-slate-300 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="تعميم لكل العمود"
                onChange={e => {
                  const target = e.target;
                  let value = target.value;
                  if (column.type === 'رقم' || column.type === 'NUMBER') value = value === '' ? null : parseFloat(value);
                  onFillColumn && onFillColumn(column.id, value);
                }}
                style={{ fontSize: 10, minWidth: 0, maxWidth: 120 }}
              />
            )}
            {(column.type === 'تاريخ' || column.type === 'DATE') && (
              <button
                type="button"
                className="text-xs text-slate-400 hover:text-red-500 border px-1 rounded ml-1"
                title="تفريغ الكل"
                onClick={() => onFillColumn && onFillColumn(column.id, null)}
              >تفريغ</button>
            )}
          </div>
        )}
      </div>
    </th>
  );
};

// مكون خاص بحقل التاريخ مع تأكيد للجوال/الآيباد
const DateInputWithConfirm = ({ column, onFillColumn }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [inputEnabled, setInputEnabled] = useState(false);
  const [value, setValue] = useState('');
  const inputRef = useRef(null);

  // عند الموافقة
  const handleConfirm = () => {
    setShowConfirm(false);
    setInputEnabled(true);
    setTimeout(() => {
      if (inputRef.current) inputRef.current.focus();
    }, 100);
  };

  // عند الإلغاء
  const handleCancel = () => {
    setShowConfirm(false);
    setInputEnabled(false);
  };

  // عند الضغط على الحقل (للجوال/الآيباد)
  const handleTouch = (e) => {
    if (isMobileOrTablet() && !inputEnabled) {
      e.preventDefault();
      setShowConfirm(true);
      return false;
    }
    return true;
  };

  // عند تغيير القيمة
  const handleChange = (e) => {
    const newValue = e.target.value;
    setValue(newValue);
    onFillColumn && onFillColumn(column.id, newValue || null);
  };

  return (
    <>
      <input
        ref={inputRef}
        type="date"
        className="w-full mt-1 p-1 text-xs sm:text-sm text-center rounded bg-white text-slate-700 border border-slate-300 focus:ring-emerald-500 focus:border-emerald-500"
        placeholder="تعميم لكل العمود"
        style={{ fontSize: 10, minWidth: 0, maxWidth: 120 }}
        value={value}
        readOnly={isMobileOrTablet() && !inputEnabled}
        onTouchStart={handleTouch}
        onMouseDown={handleTouch}
        onChange={handleChange}
      />

      {/* رسالة تأكيد للجوال/الآيباد */}
      {showConfirm && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.25)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: 8, padding: 24, minWidth: 220, boxShadow: '0 2px 16px #0002', textAlign: 'center' }}>
            <div style={{ marginBottom: 16, fontWeight: 600 }}>تأكيد تعديل التاريخ</div>
            <div style={{ marginBottom: 20, fontSize: 14 }}>هل تريد تعديل التاريخ لهذا العمود؟</div>
            <button onClick={handleConfirm} style={{ background: '#059669', color: '#fff', border: 'none', borderRadius: 4, padding: '8px 18px', marginRight: 8, fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>نعم</button>
            <button onClick={handleCancel} style={{ background: '#e5e7eb', color: '#222', border: 'none', borderRadius: 4, padding: '8px 18px', fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>إلغاء</button>
          </div>
        </div>
      )}
    </>
  );
};

// وظائف خاصة بـ localStorage
export const saveColumnOrder = (order) => {
  try {
    localStorage.setItem('columnOrder', JSON.stringify(order));
  } catch (error) {
    console.error('Error saving column order to localStorage:', error);
  }
};

export const getOrderedColumns = (columns, savedOrder) => {
  // لو لم يتم حفظ أي ترتيب من قبل، استخدم الأعمدة كما هي
  if (!savedOrder || !savedOrder.length) {
    return [...columns];
  }

  // ترتيب الأعمدة حسب الترتيب المحفوظ
  // الأعمدة الجديدة التي لا توجد في الترتيب المحفوظ ستكون في النهاية
  const orderedColumns = [];
  
  // إضافة الأعمدة بالترتيب المحفوظ
  savedOrder.forEach(id => {
    const column = columns.find(col => col.id === id);
    if (column) {
      orderedColumns.push(column);
    }
  });
  
  // إضافة أي أعمدة جديدة لم تكن في الترتيب المحفوظ
  columns.forEach(column => {
    if (!savedOrder.includes(column.id)) {
      orderedColumns.push(column);
    }
  });
  
  return orderedColumns;
};

// المكون الرئيسي للأعمدة القابلة للسحب
export const DraggableColumns = ({ 
  columns, 
  themeColor, 
  onEditColumn,
  onDeleteColumn,
  onFillColumn,
  onColumnsReorder 
}) => {
  
  // دالة لتحريك العمود من موقع إلى آخر
  const moveColumn = (dragIndex, hoverIndex) => {
    const newColumns = [...columns];
    // حفظ العمود الذي يتم سحبه
    const draggedColumn = newColumns[dragIndex];
    
    // إزالة العمود من الموقع القديم
    newColumns.splice(dragIndex, 1);
    // إضافة العمود في الموقع الجديد
    newColumns.splice(hoverIndex, 0, draggedColumn);
    
    // تحديث الترتيب في المكون الأب
    onColumnsReorder(newColumns);
    
    // حفظ الترتيب الجديد في localStorage
    saveColumnOrder(newColumns.map(col => col.id));
  };
  
  return (
    <>
      {columns.map((column, index) => (
        <DraggableHeader
          key={column.id}
          column={column}
          index={index}
          moveColumn={moveColumn}
          themeColor={themeColor}
          onEditColumn={onEditColumn}
          onDeleteColumn={onDeleteColumn}
          onFillColumn={onFillColumn}
        />
      ))}
    </>
  );
};
