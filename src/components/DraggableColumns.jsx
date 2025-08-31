import React, { useRef, useCallback } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { getContrastColor } from '../utils/colorUtils';

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
      
      // لا تستبدل العناصر مع نفسها
      if (dragIndex === hoverIndex) {
        return;
      }
      
      // تحديد المكان المستهدف للإفلات
      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleX = (hoverBoundingRect.right - hoverBoundingRect.left) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientX = clientOffset.x - hoverBoundingRect.left;
      
      // التحرك فقط عند تجاوز منتصف العنصر
      if (dragIndex < hoverIndex && hoverClientX < hoverMiddleX) {
        return;
      }
      if (dragIndex > hoverIndex && hoverClientX > hoverMiddleX) {
        return;
      }
      
      // تنفيذ تحريك العمود
      moveColumn(dragIndex, hoverIndex);
      
      // تحديث مؤشر العنصر المسحوب
      item.index = hoverIndex;
    },
  });
  
  // دمج السحب والإفلات مع المرجع
  drag(drop(ref));
  
  return (
    <th 
      ref={ref}
      className={`px-1 sm:px-2 py-2 min-w-[80px] md:min-w-[120px] max-w-[180px] text-center align-top border-slate-200 border-l last:border-l-0 group relative text-xs font-bold ${
        isDragging ? 'opacity-80 shadow-xl !bg-green-50' : ''
      }`}
      style={{
        opacity: isDragging ? 0.5 : 1,
  fontFamily: 'Noto Sans Arabic, Cairo, sans-serif',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        color: getContrastColor(themeColor)
      }}
    >
      <div className="flex flex-col items-center gap-0.5 w-full">
        <div className="flex items-center justify-center mb-1">
          <span className="font-semibold text-xs break-words w-full" title={column.name}>
            {column.name}
          </span>
          {/* أيقونة صغيرة تشير إلى إمكانية السحب */}
          <span className="cursor-grab ml-1 opacity-40 hover:opacity-100" title="اسحب لتغيير موقع العمود">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </span>
        </div>

        <div className="flex gap-4 justify-center items-center mt-1">
          <button
            className="inline-flex items-center justify-center ms-1 text-lg opacity-90 transition-all duration-150 p-2 rounded-full icon-hover"
            title="تعديل اسم العمود"
            aria-label="تعديل اسم العمود"
            onClick={() => onEditColumn(column.id)}
            style={{ verticalAlign: 'middle', minWidth: 36, minHeight: 36, color: getContrastColor(themeColor), background: 'transparent' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
            </svg>
          </button>
          <button
            className="inline-flex items-center justify-center ms-1 text-lg opacity-90 transition-all duration-150 p-2 rounded-full icon-hover"
            title="حذف العمود"
            aria-label="حذف العمود"
            onClick={() => onDeleteColumn(column.id, column.name)}
            style={{ verticalAlign: 'middle', minWidth: 36, minHeight: 36, color: getContrastColor(themeColor), background: 'transparent' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
          </button>
        </div>

        {/* تعميم القيم حسب نوع العمود */}
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
            <input
              type={column.type === 'رقم' || column.type === 'NUMBER' ? 'number' : column.type === 'تاريخ' || column.type === 'DATE' ? 'date' : 'text'}
              className="w-full mt-1 p-1 text-xs sm:text-sm text-center rounded bg-white text-slate-700 border border-slate-300 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="تعميم لكل العمود"
              onChange={e => {
                const target = e.target;
                let value = target.value;
                if (column.type === 'رقم' || column.type === 'NUMBER') value = value === '' ? null : parseFloat(value);
                if (column.type === 'تاريخ' || column.type === 'DATE') value = value || null;
                onFillColumn && onFillColumn(column.id, value);
              }}
              style={{ fontSize: 10, minWidth: 0, maxWidth: 120 }}
            />
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

// وظائف خاصة بـ localStorage
export const saveColumnOrder = (order) => {
  try {
    localStorage.setItem('columnOrder', JSON.stringify(order));
  } catch (error) {
    console.error('Error saving column order to localStorage:', error);
  }
};

export const getColumnOrder = () => {
  try {
    const saved = localStorage.getItem('columnOrder');
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.error('Error reading column order from localStorage:', error);
    return null;
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
  
  // إضافة الأعمدة الجديدة التي لم تكن موجودة في الترتيب المحفوظ
  columns.forEach(column => {
    if (!orderedColumns.includes(column)) {
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

export default DraggableColumns;
