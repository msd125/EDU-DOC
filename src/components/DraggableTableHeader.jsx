import React, { useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { EditIcon, TrashIcon } from './Icons';

// وظائف إدارة ترتيب الأعمدة
const COLUMN_ORDER_KEY = 'edu-doc-column-order';

const saveColumnOrder = (columnIds) => {
  try {
    localStorage.setItem(COLUMN_ORDER_KEY, JSON.stringify(columnIds));
  } catch (error) {
    console.error('خطأ في حفظ ترتيب الأعمدة:', error);
  }
};

const resetColumnOrder = () => {
  try {
    localStorage.removeItem(COLUMN_ORDER_KEY);
  } catch (error) {
    console.error('خطأ في إعادة ضبط ترتيب الأعمدة:', error);
  }
};

/**
 * مكون رؤوس الأعمدة القابلة للسحب والإفلات
 */
const DraggableTableHeader = ({ 
  columns, 
  themeColor, 
  onEditColumn, 
  onDeleteColumn, 
  onFillColumn,
  onColumnOrderChange
}) => {
  // دالة لمعالجة انتهاء السحب والإفلات
  const handleDragEnd = (result) => {
    // إذا تم الإفلات خارج المنطقة المسموحة
    if (!result.destination) {
      return;
    }

    // إذا لم يتغير الموضع
    if (result.destination.index === result.source.index) {
      return;
    }

    // إعادة ترتيب الأعمدة
    const newColumns = [...columns];
    const [movedColumn] = newColumns.splice(result.source.index, 1);
    newColumns.splice(result.destination.index, 0, movedColumn);

    // حفظ الترتيب الجديد
    saveColumnOrder(newColumns.map(col => col.id));

    // إشعار المكون الأب بالتغيير
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

  // دالة لإعادة تعيين ترتيب الأعمدة
  const handleResetOrder = () => {
    resetColumnOrder();
    if (onColumnOrderChange) {
      // إرجاع الأعمدة بترتيبها الأصلي
      onColumnOrderChange([...columns]);
    }
  };

  return (
    <>
      {/* زر إعادة تعيين الترتيب */}
      <div className="w-full flex justify-start mb-2">
        <button 
          className="text-xs bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-md px-2 py-1 transition-colors"
          onClick={handleResetOrder}
        >
          إعادة تعيين ترتيب الأعمدة
        </button>
      </div>
      
      {/* نظام السحب والإفلات */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="columns" direction="horizontal">
          {(provided) => (
            <tr 
              ref={provided.innerRef} 
              {...provided.droppableProps}
              className="draggable-header-row"
            >
              {/* العناصر الثابتة (الترتيب والاسم) */}
              <th className="px-1 sm:px-2 py-2 sticky right-0 min-w-[60px] max-w-[60px] text-center z-30 text-xs font-bold border-r-4 border-slate-300 shadow-lg serial-header"
                style={{
                  fontFamily: 'Noto Sans Arabic, Cairo, sans-serif',
                  boxShadow: '2px 0 8px -2px #0002',
                  color: getContrastColor('#22c55e'),
                  background: 'rgba(34,197,94,0.85)',
                  letterSpacing: '1px',
                  borderTopRightRadius: 10
                }}
              >
                م
              </th>
              <th className="px-1 sm:px-2 py-2 sticky right-0 min-w-[200px] max-w-[320px] text-center z-30 text-xs font-bold border-r-4 border-slate-300 shadow-lg name-header"
                style={{
                  fontFamily: 'Noto Sans Arabic, Cairo, sans-serif',
                  boxShadow: '2px 0 8px -2px #0002',
                  color: getContrastColor('#0ea5e9'),
                  background: 'rgba(14,165,233,0.85)',
                  letterSpacing: '1px',
                }}
              >
                الاسم
              </th>

              {/* الأعمدة القابلة للسحب */}
              {columns.map((column, index) => (
                <Draggable 
                  key={column.id} 
                  draggableId={String(column.id)} 
                  index={index}
                >
                  {(provided, snapshot) => (
                    <th 
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className="px-1 sm:px-2 py-2 min-w-[80px] md:min-w-[120px] max-w-[180px] text-center align-top border-slate-200 border-l last:border-l-0 group relative text-xs font-bold"
                      style={{ 
                        ...provided.draggableProps.style,
                        fontFamily: 'Noto Sans Arabic, Cairo, sans-serif', 
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis', 
                        whiteSpace: 'nowrap', 
                        color: getContrastColor(themeColor),
                        background: snapshot.isDragging ? 'rgba(200,200,200,0.4)' : 'transparent',
                        boxShadow: snapshot.isDragging ? '0 0 10px rgba(0,0,0,0.2)' : 'none',
                        opacity: snapshot.isDragging ? 0.8 : 1
                      }}
                    >
                      <div className="flex flex-col items-center gap-0.5 w-full">
                        <div className="flex items-center justify-center w-full">
                          <span className="font-semibold text-xs break-words w-full" title={column.name} style={{ color: getContrastColor(themeColor) }}>
                            {column.name}
                          </span>
                          <div 
                            {...provided.dragHandleProps} 
                            className="cursor-grab ml-1 opacity-40 hover:opacity-100"
                            title="اسحب لتغيير موقع العمود"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                            </svg>
                          </div>
                        </div>
                        
                        <div className="flex gap-4 justify-center items-center mt-1">
                          <button
                            className="inline-flex items-center justify-center ms-1 text-lg opacity-90 transition-all duration-150 p-2 rounded-full icon-hover"
                            title="تعديل اسم العمود"
                            aria-label="تعديل اسم العمود"
                            onClick={() => onEditColumn && onEditColumn(column)}
                            style={{ verticalAlign: 'middle', minWidth: 36, minHeight: 36, color: getContrastColor(themeColor), background: 'transparent' }}
                          >
                            <EditIcon className="w-6 h-6" />
                          </button>
                          <button
                            className="inline-flex items-center justify-center ms-1 text-lg opacity-90 transition-all duration-150 p-2 rounded-full icon-hover"
                            title="حذف العمود"
                            aria-label="حذف العمود"
                            onClick={() => onDeleteColumn && onDeleteColumn(column.id, column.name)}
                            style={{ verticalAlign: 'middle', minWidth: 36, minHeight: 36, color: getContrastColor(themeColor), background: 'transparent' }}
                          >
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
                    </th>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </tr>
          )}
        </Droppable>
      </DragDropContext>
    </>
  );
};

export default DraggableTableHeader;
