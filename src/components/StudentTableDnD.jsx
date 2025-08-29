import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { EditIcon, TrashIcon } from './Icons';
import EditColumnModal from './EditColumnModal';
import '../styles/draggable-columns.css';

// المكون الرئيسي لجدول الطلاب مع وظيفة السحب والإفلات
const StudentTableDnD = ({
  columns = [],
  students = [],
  onEditColumn,
  onDeleteColumn,
  onFillColumn,
  onUpdateStudentData,
  onDeleteStudent,
  onDeleteAllStudents,
  themeColor = '#2E8540',
  nameSortOrder = 'asc',
  onNameSortChange,
  onColumnOrderChange
}) => {
  // حالة لتخزين الأعمدة المرتبة
  const [orderedColumns, setOrderedColumns] = useState([...columns]);
  
  // حالة لعرض مودال تعديل العمود
  const [editingColumn, setEditingColumn] = useState(null);
  
  // تحديث الأعمدة عندما تتغير الأعمدة الأصلية
  useEffect(() => {
    // محاولة استرجاع الترتيب المخزن
    try {
      const savedOrder = localStorage.getItem('student-table-column-order');
      if (savedOrder) {
        const orderIds = JSON.parse(savedOrder);
        const columnMap = new Map(columns.map(col => [col.id, col]));
        
        // إنشاء مصفوفة من الأعمدة المرتبة
        const ordered = [];
        
        // أولاً، إضافة الأعمدة حسب الترتيب المحفوظ
        orderIds.forEach(id => {
          if (columnMap.has(id)) {
            ordered.push(columnMap.get(id));
            columnMap.delete(id);
          }
        });
        
        // ثم إضافة أي أعمدة متبقية
        columnMap.forEach(col => ordered.push(col));
        
        setOrderedColumns(ordered);
      } else {
        setOrderedColumns([...columns]);
      }
    } catch (error) {
      console.error('خطأ في استرجاع ترتيب الأعمدة:', error);
      setOrderedColumns([...columns]);
    }
  }, [columns]);
  
  // معالج انتهاء السحب
  const handleDragEnd = (result) => {
    // إذا لم يتم إسقاط العنصر في منطقة قابلة للإسقاط
    if (!result.destination) return;
    
    // إذا لم يتغير الموضع
    if (result.source.index === result.destination.index) return;
    
    // إعادة ترتيب الأعمدة
    const reordered = [...orderedColumns];
    const [movedItem] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, movedItem);
    
    // تحديث الحالة
    setOrderedColumns(reordered);
    
    // حفظ الترتيب في التخزين المحلي
    try {
      localStorage.setItem('student-table-column-order', JSON.stringify(reordered.map(col => col.id)));
    } catch (error) {
      console.error('خطأ في حفظ ترتيب الأعمدة:', error);
    }
    
    // إشعار المكون الأب بالتغيير
    if (onColumnOrderChange) {
      onColumnOrderChange(reordered);
    }
  };
  
  // فرز الطلاب حسب الاسم
  const sortedStudents = [...students].sort((a, b) => {
    if (nameSortOrder === 'asc') {
      return (a.name || '').localeCompare(b.name || '', 'ar');
    } else {
      return (b.name || '').localeCompare(a.name || '', 'ar');
    }
  });
  
  // دالة لتحديد لون النص بناءً على سطوع الخلفية
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
  
  return (
    <div className="w-full flex flex-col justify-center items-start min-h-[60vh] p-0 m-0" style={{ direction: 'rtl' }}>
      {/* زر إعادة ضبط ترتيب الأعمدة */}
      <div className="w-full flex justify-start mb-2 px-4">
        <button
          className="text-xs bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-md px-2 py-1 transition-colors"
          onClick={() => {
            localStorage.removeItem('student-table-column-order');
            setOrderedColumns([...columns]);
            if (onColumnOrderChange) {
              onColumnOrderChange([...columns]);
            }
          }}
        >
          إعادة ضبط ترتيب الأعمدة
        </button>
      </div>
      
      {/* جدول الطلاب */}
      <div className="w-full bg-white shadow border-2 border-slate-300 overflow-x-auto custom-scroll">
        <table className="min-w-full table-auto" style={{ width: '100%', tableLayout: 'auto', minWidth: 600 }}>
          <DragDropContext onDragEnd={handleDragEnd}>
            <thead
              className="text-[10px] sm:text-xs md:text-sm uppercase sticky top-0 z-30"
              style={{
                backgroundColor: themeColor,
                borderTopLeftRadius: 12,
                borderTopRightRadius: 12,
                fontFamily: 'Noto Sans Arabic, Cairo, sans-serif',
                boxShadow: '0 2px 8px -2px #0002',
                color: getContrastColor(themeColor),
              }}
            >
              <tr>
                {/* عمود الرقم المتسلسل - ثابت */}
                <th
                  className="px-1 sm:px-2 py-2 sticky right-0 min-w-[60px] max-w-[60px] text-center z-30 text-xs font-bold border-r-4 border-slate-300 shadow-lg serial-header"
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
                
                {/* عمود اسم الطالب - ثابت */}
                <th
                  className="px-1 sm:px-2 py-2 sticky right-[60px] min-w-[200px] max-w-[320px] text-center z-30 text-xs font-bold border-r-4 border-slate-300 shadow-lg name-header"
                  style={{
                    fontFamily: 'Noto Sans Arabic, Cairo, sans-serif',
                    boxShadow: '2px 0 8px -2px #0002',
                    color: getContrastColor('#0ea5e9'),
                    background: 'rgba(14,165,233,0.85)',
                    letterSpacing: '1px',
                  }}
                >
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
                <Droppable droppableId="columns" direction="horizontal">
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="flex-1 flex"
                      style={{ display: 'flex' }}
                    >
                      {orderedColumns.map((col, index) => (
                        <Draggable key={col.id} draggableId={String(col.id)} index={index}>
                          {(provided, snapshot) => (
                            <th
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={`px-1 sm:px-2 py-2 min-w-[80px] md:min-w-[120px] max-w-[180px] text-center align-top border-slate-200 border-l last:border-l-0 group relative text-xs font-bold draggable-column ${snapshot.isDragging ? 'dragging' : ''}`}
                              style={{
                                ...provided.draggableProps.style,
                                fontFamily: 'Noto Sans Arabic, Cairo, sans-serif',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                color: getContrastColor(themeColor)
                              }}
                            >
                              <div className="flex flex-col items-center gap-0.5 w-full">
                                <div className="flex items-center justify-center">
                                  <span className="font-semibold text-xs break-words w-full" title={col.name}>
                                    {col.name}
                                  </span>
                                  <div
                                    {...provided.dragHandleProps}
                                    className="column-drag-indicator ml-1"
                                    title="اسحب لتغيير موقع العمود"
                                  >
                                    ⋮
                                  </div>
                                </div>
                                
                                <div className="flex gap-4 justify-center items-center mt-1">
                                  <button
                                    className="inline-flex items-center justify-center ms-1 text-lg opacity-90 transition-all duration-150 p-2 rounded-full icon-hover"
                                    title="تعديل اسم العمود"
                                    onClick={() => setEditingColumn(col)}
                                    style={{ verticalAlign: 'middle', minWidth: 36, minHeight: 36, color: getContrastColor(themeColor), background: 'transparent' }}
                                  >
                                    <EditIcon className="w-6 h-6" />
                                  </button>
                                  <button
                                    className="inline-flex items-center justify-center ms-1 text-lg opacity-90 transition-all duration-150 p-2 rounded-full icon-hover"
                                    title="حذف العمود"
                                    onClick={() => onDeleteColumn(col.id, col.name)}
                                    style={{ verticalAlign: 'middle', minWidth: 36, minHeight: 36, color: getContrastColor(themeColor), background: 'transparent' }}
                                  >
                                    <TrashIcon className="w-6 h-6" />
                                  </button>
                                </div>
                                
                                {/* أدوات إضافية حسب نوع العمود */}
                                {col.type === 'قائمة' || col.type === 'LIST' ? (
                                  <select
                                    className="w-full mt-1 p-1 text-xs text-center rounded bg-white text-slate-700 border border-slate-300 focus:ring-emerald-500 focus:border-emerald-500"
                                    defaultValue=""
                                    onClick={(e) => e.stopPropagation()}
                                    onChange={e => {
                                      const value = e.target.value;
                                      if (value === '__empty__') {
                                        onFillColumn && onFillColumn(col.id, null);
                                      } else {
                                        onFillColumn && onFillColumn(col.id, value);
                                      }
                                    }}
                                  >
                                    <option value="__empty__">-- تعيين الكل --</option>
                                    {(col.options || []).map((opt, i) => (
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
                    </div>
                  )}
                </Droppable>
              </tr>
            </thead>
          </DragDropContext>
          
          {/* جسم الجدول: صفوف الطلاب */}
          <tbody>
            {sortedStudents.map((student, index) => (
              <tr key={student.id} className={`student-row hover:bg-slate-50 transition-colors`}>
                <td className="px-1 sm:px-2 py-2 text-center border-r text-xs text-slate-500">
                  {student.serial || index + 1}
                </td>
                <td className="px-1 sm:px-2 py-2 text-right border-r min-w-[150px]">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold">{student.name}</span>
                    {onDeleteStudent && (
                      <button
                        className="opacity-40 hover:opacity-100 hover:text-red-500 transition-all"
                        title="حذف الطالب"
                        onClick={() => onDeleteStudent(student.id, student.name)}
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
                
                {/* عرض بيانات الطالب لكل عمود */}
                {orderedColumns.map((col) => (
                  <td key={`${student.id}-${col.id}`} className="px-1 sm:px-2 py-2 text-center border-l-0">
                    {/* تنفيذ عرض بيانات الطالب حسب نوع العمود */}
                    {/* يمكن هنا إضافة المزيد من المنطق للتعامل مع أنواع مختلفة من البيانات */}
                    <div className="text-sm">
                      {(student.records && student.records[col.id]) || "-"}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
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
    </div>
  );
};

export default StudentTableDnD;
