// مثال لتنفيذ ميزة السحب والإفلات في جدول الطلاب

// 1. استيراد المكتبات والمكونات
import React, { useState, useEffect } from 'react';
import { 
  DraggableTableHeadersProvider,
  saveColumnOrder, 
  getColumnOrder, 
  orderColumns 
} from '../utils/drag-drop';
import '../utils/drag-drop/draggableStyles.css';
import EditColumnModal from './EditColumnModal';
import { EditIcon, TrashIcon } from './Icons';

// 2. هيكل مكون جدول الطلاب الرئيسي
const StudentTableWithDnD = (props) => {
  const { 
    columns, 
    students, 
    onEditColumn, 
    onDeleteColumn,
    onFillColumn,
    onUpdateStudentData,
    onDeleteStudent,
    themeColor,
    nameSortOrder,
    onNameSortChange,
    onColumnOrderChange
  } = props;
  
  const [editingColumn, setEditingColumn] = useState(null);
  const [orderedColumns, setOrderedColumns] = useState(() => {
    const savedOrder = getColumnOrder();
    return orderColumns(columns, savedOrder);
  });
  
  // تحديث الأعمدة المرتبة عندما تتغير الأعمدة الأصلية
  useEffect(() => {
    const savedOrder = getColumnOrder();
    setOrderedColumns(orderColumns(columns, savedOrder));
  }, [columns]);
  
  // معالج تغيير ترتيب الأعمدة
  const handleColumnOrderChange = (newColumns) => {
    setOrderedColumns(newColumns);
    
    if (onColumnOrderChange) {
      onColumnOrderChange(newColumns);
    }
  };
  
  // دالة تحدد لون النص (أسود أو أبيض) حسب سطوع الخلفية
  const getContrastColor = (hex) => {
    if (!hex) return '#fff';
    let c = hex.replace('#', '');
    if (c.length === 3) c = c.split('').map(x => x + x).join('');
    const num = parseInt(c, 16);
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;
    const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
    return luminance > 170 ? '#222' : '#fff';
  };
  
  // دالة لتلوين خلفية العمود مع شفافية
  const getHeaderBg = (color) => {
    if (!color) return 'rgba(46,133,64,0.08)';
    let c = color.replace('#', '');
    if (c.length === 3) c = c.split('').map(x => x + x).join('');
    const num = parseInt(c, 16);
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;
    return `rgba(${r},${g},${b},0.08)`;
  };
  
  // دالة تقوم بتنسيق محتوى العمود
  const renderColumnContent = (column) => {
    return (
      <div className="flex flex-col items-center gap-0.5 w-full">
        <div className="flex items-center justify-center">
          <span className="font-semibold text-xs break-words w-full" title={column.name} style={{ color: getContrastColor(themeColor) }}>
            {column.name}
          </span>
          <span className="column-drag-handle ml-1" title="اسحب لتغيير موقع العمود">
            ⋮
          </span>
        </div>
        
        <div className="flex gap-4 justify-center items-center mt-1">
          <button
            className="inline-flex items-center justify-center ms-1 text-lg opacity-90 transition-all duration-150 p-2 rounded-full icon-hover"
            title="تعديل اسم العمود"
            aria-label="تعديل اسم العمود"
            onClick={() => setEditingColumn(column)}
            style={{ verticalAlign: 'middle', minWidth: 36, minHeight: 36, color: getContrastColor(themeColor), background: 'transparent' }}>
            <EditIcon className="w-6 h-6" />
          </button>
          
          <button
            className="inline-flex items-center justify-center ms-1 text-lg opacity-90 transition-all duration-150 p-2 rounded-full icon-hover"
            title="حذف العمود"
            aria-label="حذف العمود"
            onClick={() => onDeleteColumn(column.id, column.name)}
            style={{ verticalAlign: 'middle', minWidth: 36, minHeight: 36, color: getContrastColor(themeColor), background: 'transparent' }}>
            <TrashIcon className="w-6 h-6" />
          </button>
        </div>
        
        {column.type === 'قائمة' || column.type === 'LIST' ? (
          <select
            className="w-full mt-1 p-1 text-xs text-center rounded bg-white text-slate-700 border border-slate-300 focus:ring-emerald-500 focus:border-emerald-500"
            defaultValue=""
            onChange={e => {
              const value = e.target.value;
              if (value === '__empty__') {
                onFillColumn && onFillColumn(column.id, null);
              } else {
                onFillColumn && onFillColumn(column.id, value);
              }
            }}
          >
            <option value="__empty__">-- تعيين الكل --</option>
            {column.options && column.options.map((opt, i) => (
              <option key={i} value={opt}>{opt}</option>
            ))}
          </select>
        ) : null}
      </div>
    );
  };
  
  return (
    <>
      <div
        className="w-full bg-white shadow border-2 border-slate-300 overflow-x-auto custom-scroll"
        style={{ direction: 'rtl', minHeight: '60vh', boxSizing: 'border-box', maxWidth: '100vw', margin: 0, padding: 0, border: 'none', borderRadius: 0 }}
      >
        <table
          className="min-w-full table-auto"
          style={{ width: '100%', tableLayout: 'auto', minWidth: 600 }}
        >
          <thead className="text-[10px] sm:text-xs md:text-sm uppercase sticky top-0 z-30"
            style={{
              backgroundColor: themeColor || '#2E8540',
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12,
              fontFamily: 'Noto Sans Arabic, Cairo, sans-serif',
              boxShadow: '0 2px 8px -2px #0002',
              color: getContrastColor(themeColor || '#2E8540'),
            }}>
            <tr>
              {/* عمود الرقم المتسلسل */}
              <th className="px-1 sm:px-2 py-2 sticky right-0 min-w-[60px] max-w-[60px] text-center z-30 text-xs font-bold border-r-4 border-slate-300 shadow-lg serial-header"
                style={{
                  fontFamily: 'Noto Sans Arabic, Cairo, sans-serif',
                  boxShadow: '2px 0 8px -2px #0002',
                  color: getContrastColor('#22c55e'),
                  background: 'rgba(34,197,94,0.85)',
                  letterSpacing: '1px',
                  borderTopRightRadius: 10
                }}>
                م
              </th>
              
              {/* عمود الاسم */}
              <th className="px-1 sm:px-2 py-2 sticky right-0 min-w-[200px] max-w-[320px] text-center z-30 text-xs font-bold border-r-4 border-slate-300 shadow-lg name-header"
                style={{
                  fontFamily: 'Noto Sans Arabic, Cairo, sans-serif',
                  boxShadow: '2px 0 8px -2px #0002',
                  color: getContrastColor('#0ea5e9'),
                  background: 'rgba(14,165,233,0.85)',
                  letterSpacing: '1px',
                }}>
                <div className="flex items-center justify-center gap-2">
                  <span>الاسم</span>
                  {onNameSortChange && (
                    <button
                      className="bg-white bg-opacity-25 rounded px-1.5 py-0.5 text-[10px] hover:bg-opacity-40 transition-all"
                      onClick={() => onNameSortChange(nameSortOrder === 'asc' ? 'desc' : 'asc')}
                      title={nameSortOrder === 'asc' ? 'ترتيب تنازلي' : 'ترتيب تصاعدي'}
                    >
                      {nameSortOrder === 'asc' ? 'أ→ي' : 'ي→أ'}
                    </button>
                  )}
                </div>
              </th>
              
              {/* الأعمدة القابلة للسحب */}
              <DraggableTableHeadersProvider
                columns={columns}
                onColumnOrderChange={handleColumnOrderChange}
                renderColumnContent={renderColumnContent}
              />
            </tr>
          </thead>
          
          {/* جسم الجدول - هنا يمكن إضافة المزيد من المنطق لعرض بيانات الطلاب */}
        </table>
      </div>
      
      {/* مودال تعديل العمود */}
      {editingColumn && (
        <EditColumnModal
          column={editingColumn}
          onClose={() => setEditingColumn(null)}
          onSave={(data) => {
            onEditColumn(editingColumn.id, data);
            setEditingColumn(null);
          }}
        />
      )}
    </>
  );
};

export default StudentTableWithDnD;
