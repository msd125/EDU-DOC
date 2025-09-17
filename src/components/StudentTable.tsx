import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { getContrastColor, getHeaderBg } from '../utils/colorUtils';
import EditColumnModal from './EditColumnModal';
// نستخدم إصدار JSX من DraggableColumns لأن واجهته تتوافق مع خصائصنا الحالية
import DraggableColumnsJsx from './DraggableColumns.jsx';
import '../styles/draggable-columns.css';
import { saveColumnOrder, getColumnOrder, orderColumns } from '../utils/drag-drop/columnUtils.js';
import ColorfulCell from './ColorfulCell';

interface ColumnType {
  id: string | number;
  name: string;
  type?: string;
  options?: string[];
}

interface StudentType {
  id: string | number;
  name: string;
  records?: Record<string, any>;
  serial?: number;
}

interface StudentTableProps {
  columns: ColumnType[];
  students: StudentType[];
  onEditColumn: (id: string | number, updatedData: any) => void;
  onDeleteColumn: (id: string | number, name: string) => void;
  onFillColumn?: (id: string | number, value: any) => void;
  onUpdateStudentData?: (studentId: string | number, colId: string | number, value: any) => void;
  onDeleteStudent?: (studentId: string | number, name: string) => void;
  themeColor?: string;
  nameSortOrder?: 'asc' | 'desc';
  onNameSortChange?: (order: 'asc' | 'desc') => void;
  onColumnOrderChange?: (columns: ColumnType[]) => void;
}

// تمت إزالة دوال محلية غير مستخدمة للحفاظ على نظافة الشيفرة مع إعداد noUnusedLocals

const StudentTable: React.FC<StudentTableProps> = (props) => {
  const { 
    columns, 
    students, 
    onEditColumn, 
    onDeleteColumn, 
    onFillColumn, 
    onUpdateStudentData, 
    onDeleteStudent,
    themeColor,
    nameSortOrder = 'asc',
    onNameSortChange,
    onColumnOrderChange
  } = props;
  
  // State for editing column
  const [editingColumn, setEditingColumn] = useState<ColumnType | null>(null);
  
  // Ordered columns state
  const [orderedColumns, setOrderedColumns] = useState<ColumnType[]>(() => {
    const savedOrder = getColumnOrder();
    return orderColumns(columns, savedOrder);
  });

  // Update ordered columns when original columns change
  useEffect(() => {
    const savedOrder = getColumnOrder();
    setOrderedColumns(orderColumns(columns, savedOrder));
  }, [columns]);

  // Handle column order change
  const handleColumnOrderChange = (newColumns: ColumnType[]) => {
    setOrderedColumns(newColumns);
    saveColumnOrder(newColumns.map(col => col.id));
    toast.success('تم حفظ ترتيب الأعمدة');
    setTimeout(() => {
      window.location.reload();
    }, 600);
    if (onColumnOrderChange) {
      onColumnOrderChange(newColumns);
    }
  };

  // Highlighted rows state
  const [highlightedRows, setHighlightedRows] = useState<(string | number)[]>(() => {
    try {
      const saved = localStorage.getItem('highlightedRows');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Save highlighted rows to localStorage
  useEffect(() => {
    localStorage.setItem('highlightedRows', JSON.stringify(highlightedRows));
  }, [highlightedRows]);
  
  // Sort students by name
  const sortedStudents = [...students].sort((a, b) => {
    if (nameSortOrder === 'asc') {
      return (a.name || '').localeCompare(b.name || '', 'ar');
    } else {
      return (b.name || '').localeCompare(a.name || '', 'ar');
    }
  });

  // Handle column delete - استدعاء مباشر لدالة App.tsx (بدون مودال محلي)
  const handleColumnDelete = (id: string | number, name: string) => {
    // استدعاء دالة الحذف مباشرة من App.tsx التي تظهر رسالة تأكيد واحدة فقط
    if (onDeleteColumn) {
      onDeleteColumn(id, name);
    }
  };
  

  // إدارة أداة التخصيص المفتوحة (خانة واحدة فقط)
  const [openCell, setOpenCell] = useState<string | null>(null);

  // Toggle row highlight
  const toggleHighlight = (studentId: string | number) => {
    setHighlightedRows(prev => 
      prev.includes(studentId) 
        ? prev.filter(id => id !== studentId) 
        : [...prev, studentId]
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
  <div className="full-page-table w-full h-full glass rounded-2xl overflow-hidden shadow-2xl border border-white/30 backdrop-blur-xl flex flex-col">
        {/* Modern Header */}
        <div className="flex justify-between items-center p-4 bg-gradient-to-r from-white/90 to-white/70 
                       border-b border-white/20 backdrop-blur-sm flex-shrink-0">
        </div>

        {/* Modern Table Container */}
        <div className="full-page-table-container flex-1 overflow-auto custom-scroll">
          <table className="w-full h-full border-collapse relative min-w-full">
            {/* Enhanced Table Header */}
            <thead className="sticky top-0 z-40"
              style={{
                backgroundColor: themeColor || '#2E8540',
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12,
              fontFamily: "'Almarai','Cairo','Noto Sans Arabic','Amiri',sans-serif",
              boxShadow: '0 2px 8px -2px #0002',
              color: getContrastColor(themeColor || '#2E8540'),
            }}>
            <tr>
              <th className="px-1 sm:px-2 py-2 sticky right-0 min-w-[60px] max-w-[60px] text-center z-30 text-xs font-bold border-r-4 border-slate-300 shadow-lg serial-header"
                  style={{
                    fontFamily: "'Almarai','Cairo','Noto Sans Arabic','Amiri',sans-serif",
                    boxShadow: '2px 0 8px -2px #0002',
                    color: getContrastColor('#22c55e'),
                    background: 'rgba(34,197,94,0.85)', // أخضر مع شفافية أقل
                    letterSpacing: '1px',
                    borderTopRightRadius: 10
                  }}>م</th>
              <th className="px-1 sm:px-2 py-2 sticky right-0 min-w-[200px] max-w-[320px] text-center z-30 text-xs font-bold border-r-4 border-slate-300 shadow-lg name-header"
                  style={{
                    fontFamily: "'Almarai','Cairo','Noto Sans Arabic','Amiri',sans-serif",
                    boxShadow: '2px 0 8px -2px #0002',
                    color: getContrastColor('#0ea5e9'),
                    background: 'rgba(14,165,233,0.85)', // أزرق مع شفافية أقل
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
                
              {/* استخدام مكون السحب والإفلات */}
              {/** نستخدم التفافًا لتجاوز التضارب في تعريفات النوع بين TSX و JSX **/}
              {(() => {
                const DraggableColumnsAny = DraggableColumnsJsx as any;
                return (
                  <DraggableColumnsAny
                columns={orderedColumns as any}
                themeColor={themeColor}
                onEditColumn={(id: any) => {
                  const column = columns.find(c => c.id === id);
                  if (column) setEditingColumn(column);
                }}
                onDeleteColumn={handleColumnDelete}
                onFillColumn={onFillColumn}
                onColumnsReorder={handleColumnOrderChange}
                  />
                );
              })()}
              <th className="px-2 py-2 text-center text-xs" title="إجراءات">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {sortedStudents.length === 0 ? (
              <tr>
                <td colSpan={orderedColumns.length + 3} className="text-center py-6 text-slate-400">لا يوجد طلاب</td>
              </tr>
            ) : (
              sortedStudents.map((student, idx) => {
                const isHighlighted = highlightedRows.includes(student.id);
                return (
                  <tr
                    key={student.id}
                    className={
                      "border-b last:border-b-0 transition-colors " +
                      (isHighlighted ? "bg-yellow-100" : (idx % 2 === 0 ? "bg-gray-50" : "bg-white"))
                    }
                  >
                    {/* عمود التسلسل: كما كان مع ميزة الهايلايت */}
                    <td
                      className="px-1 sm:px-2 py-2 text-center font-semibold text-slate-700 whitespace-nowrap border-b-4 border-slate-300 z-20 cursor-pointer"
                      style={{
                        maxWidth: '60px',
                        minWidth: '60px',
                        boxShadow: '2px 0 8px -2px #0002',
                        backgroundColor: getHeaderBg(themeColor)
                      }}
                      onClick={e => {
                        e.stopPropagation();
                        toggleHighlight(student.id);
                      }}
                    >
                      {student.serial || idx + 1}
                    </td>
                    {/* عمود الاسم: كما كان */}
                    <td
                      className="px-1 sm:px-2 py-2 sticky right-0 text-right font-semibold text-slate-700 whitespace-nowrap border-b-4 border-slate-300 z-20 text-sm md:text-xs"
                      style={{
                        maxWidth: '220px',
                        minWidth: '140px',
                        boxShadow: '2px 0 8px -2px #0002',
                        backgroundColor: getHeaderBg(themeColor)
                      }}
                    >
                      {student.name}
                    </td>
                    {/* بقية الأعمدة: ColorfulCell */}
                    {orderedColumns.map((col) => {
                      const value = student.records?.[col.id];
                      // لا تطبق ColorfulCell على عمود التسلسل أو الاسم
                      if (col.id === 'serial' || col.id === 'name') {
                        return null;
                      }
                      const cellId = `${student.id}-${col.id}`;
                      // Checkbox
                      if (col.type === 'مربع اختيار' || col.type === 'CHECKBOX') {
                        try {
                          // ثلاث حالات: '0' فارغ، '1' صح، '2' خطأ
                          let ch = '0';
                          if (typeof value === 'string' && (value === '1' || value === '2' || value === '0')) {
                            ch = value;
                          } else if (value === true) {
                            ch = '1';
                          } else if (value === false) {
                            ch = '2';
                          } else if (value == null || value === undefined) {
                            ch = '0';
                          } else {
                            console.warn('Unexpected value type for checkbox:', typeof value, value);
                            ch = '0';
                          }
                          
                          const isCheck = ch === '1';
                          const isCross = ch === '2';
                          const baseCls = 'w-6 h-6 rounded border flex items-center justify-center text-[16px] select-none shadow-sm transition-all duration-150 cursor-pointer mx-auto my-auto';
                          const cls = isCheck
                            ? `${baseCls} bg-[rgba(22,163,74,0.13)] border-emerald-600 text-emerald-700`
                            : isCross
                              ? `${baseCls} bg-[rgba(255,26,26,0.18)] border-red-600 text-red-700`
                              : `${baseCls} bg-white border-slate-300 hover:bg-slate-100 text-slate-500`;
                          const symbol = isCheck
                            ? <span style={{fontSize:'16px',fontWeight:'bold',color:'#16a34a',display:'inline-block',lineHeight:'1',verticalAlign:'middle'}}>✔</span>
                            : isCross
                              ? <span style={{fontSize:'16px',fontWeight:'bold',color:'#ff1a1a',display:'inline-block',lineHeight:'1',verticalAlign:'middle'}}>✗</span>
                              : <span style={{fontSize:'16px',fontWeight:'bold',color:'#64748b',display:'inline-block',lineHeight:'1',verticalAlign:'middle'}}>–</span>;
                          const handleToggle = (e: React.MouseEvent) => {
                            try {
                              e.stopPropagation();
                              let next = ch === '0' ? '1' : (ch === '1' ? '2' : '0');
                              onUpdateStudentData && onUpdateStudentData(student.id, col.id, next);
                            } catch (err) {
                              console.error('Error in checkbox toggle:', err);
                            }
                          };
                          return (
                            <ColorfulCell
                              key={col.id}
                              cellId={cellId}
                              openCell={openCell}
                              setOpenCell={setOpenCell}
                            >
                              <div className={cls} onClick={handleToggle} title={isCheck ? 'صح' : isCross ? 'خطأ' : 'فارغ'} style={{display:'flex',alignItems:'center',justifyContent:'center'}}>
                                {symbol}
                              </div>
                            </ColorfulCell>
                          );
                        } catch (err) {
                          console.error('Error rendering checkbox cell:', err, { col, value, student });
                          // في حالة الخطأ، اعرض خلية فارغة آمنة
                          return (
                            <ColorfulCell
                              key={col.id}
                              cellId={cellId}
                              openCell={openCell}
                              setOpenCell={setOpenCell}
                            >
                              <div className="text-red-500 text-xs">خطأ</div>
                            </ColorfulCell>
                          );
                        }
                      }
                      // Multi-Checkbox (مجموعة مربعات) - ثلاث حالات: ✓ (أخضر) → × (أحمر) → فارغ
                      if (col.type === 'مجموعة مربعات' || col.type === 'MULTI_CHECKBOX') {
                        try {
                          const slots = Math.max(1, Number((col as any).multiSlots) || 8);
                          const showCounter = Boolean((col as any).multiShowCounter);
                          const labels: string[] = Array.isArray((col as any).multiLabels) ? (col as any).multiLabels : [];
                          
                          // ترميز الحالات لكل خانة: '0' فارغ، '1' صح (أخضر)، '2' × (أحمر)
                          let raw: string = '';
                          if (typeof value === 'string') {
                            raw = value;
                          } else if (value == null || value === undefined) {
                            raw = ''.padEnd(slots, '0');
                          } else {
                            console.warn('Unexpected value type for multi-checkbox:', typeof value, value);
                            raw = ''.padEnd(slots, '0');
                          }
                          
                          const normalizeChar = (ch: string) => (ch === '1' || ch === '2') ? ch : '0';
                          const normalized = raw
                            .split('')
                            .map(c => normalizeChar(c))
                            .join('');
                          const padded = normalized.padEnd(slots, '0').slice(0, slots);
                          const checkedCount = [...padded].filter(c => c === '1' || c === '2').length; // العداد يحسب الصح والإكس
                          
                          const toggleAt = (i: number) => {
                            try {
                              const arr = padded.split('');
                              const cur = arr[i];
                              // 0 -> 1 (صح)، 1 -> 2 (إكس)، 2 -> 0 (فارغ)
                              arr[i] = cur === '0' ? '1' : (cur === '1' ? '2' : '0');
                              const next = arr.join('');
                              onUpdateStudentData && onUpdateStudentData(student.id, col.id, next);
                            } catch (err) {
                              console.error('Error in toggleAt:', err);
                            }
                          };
                          
                          return (
                            <ColorfulCell
                              key={col.id}
                              cellId={cellId}
                              openCell={openCell}
                              setOpenCell={setOpenCell}
                            >
                              <div className="relative flex flex-wrap gap-[2px] items-center justify-center">
                                {showCounter && (
                                  <span className="absolute -top-4 right-0 text-[10px] text-slate-500">{checkedCount}/{slots}</span>
                                )}
                                {Array.from({ length: slots }).map((_, i) => {
                                  const ch = padded[i] || '0';
                                  const isCheck = ch === '1';
                                  const isCross = ch === '2';
                                  // نمط ألوان مختلف لكل حالة
                                  const baseCls = 'w-6 h-6 rounded border flex items-center justify-center text-[18px] select-none shadow-sm transition-all duration-150';
                                  const cls = isCheck
                                    ? `${baseCls} bg-[rgba(22,163,74,0.13)] border-emerald-600 text-emerald-700`
                                    : isCross
                                      ? `${baseCls} bg-[rgba(255,26,26,0.18)] border-red-600 text-red-700`
                                      : `${baseCls} bg-white border-slate-300 hover:bg-slate-100 text-slate-500`;
                                  const symbol = isCheck
                                    ? <span style={{fontSize:'18px',fontWeight:'bold',color:'#16a34a',display:'inline-block',lineHeight:'1',verticalAlign:'middle'}}>✔</span>
                                    : isCross
                                      ? <span style={{fontSize:'18px',fontWeight:'bold',color:'#ff1a1a',display:'inline-block',lineHeight:'1',verticalAlign:'middle'}}>✗</span>
                                      : <span style={{fontSize:'18px',fontWeight:'bold',color:'#64748b',display:'inline-block',lineHeight:'1',verticalAlign:'middle'}}>–</span>;
                                  const label = labels[i] ? ` - ${labels[i]}` : '';
                                  const aria = `الخانة ${i + 1}${label} ${isCheck ? 'صح' : isCross ? 'إكس' : 'فارغة'}`;
                                  return (
                                    <button
                                      key={i}
                                      type="button"
                                      aria-label={aria}
                                      title={aria}
                                      onClick={e => { e.stopPropagation(); toggleAt(i); }}
                                      className={cls}
                                    >
                                      {symbol}
                                    </button>
                                  );
                                })}
                              </div>
                            </ColorfulCell>
                          );
                        } catch (err) {
                          console.error('Error rendering multi-checkbox cell:', err, { col, value, student });
                          // في حالة الخطأ، اعرض خلية فارغة آمنة
                          return (
                            <ColorfulCell
                              key={col.id}
                              cellId={cellId}
                              openCell={openCell}
                              setOpenCell={setOpenCell}
                            >
                              <div className="text-red-500 text-xs">خطأ</div>
                            </ColorfulCell>
                          );
                        }
                      }
                      // List/Select
                      if (col.type === 'قائمة' || col.type === 'LIST') {
                        return (
                          <ColorfulCell
                            key={col.id}
                            cellId={cellId}
                            openCell={openCell}
                            setOpenCell={setOpenCell}
                          >
                            <select
                              value={value || ''}
                              onClick={e => e.stopPropagation()}
                              onChange={e => onUpdateStudentData && onUpdateStudentData(student.id, col.id, e.target.value)}
                              className="w-full p-1 text-xs rounded border border-slate-300 bg-white text-slate-700"
                            >
                              <option value="">—</option>
                              {(col.options || []).map((opt: string) => (
                                <option key={opt} value={opt}>{opt}</option>
                              ))}
                            </select>
                          </ColorfulCell>
                        );
                      }
                      // Number
                      if (col.type === 'رقم' || col.type === 'NUMBER') {
                        return (
                          <ColorfulCell
                            key={col.id}
                            cellId={cellId}
                            openCell={openCell}
                            setOpenCell={setOpenCell}
                          >
                            <input
                              type="number"
                              value={value !== undefined && value !== null ? value : ''}
                              onClick={e => e.stopPropagation()}
                              onChange={e => onUpdateStudentData && onUpdateStudentData(student.id, col.id, e.target.value === '' ? null : parseFloat(e.target.value))}
                              className="w-full p-1 text-xs rounded border border-slate-300 bg-white text-slate-700 text-center"
                            />
                          </ColorfulCell>
                        );
                      }
                      // Date
                      if (col.type === 'تاريخ' || col.type === 'DATE') {
                        return (
                          <ColorfulCell
                            key={col.id}
                            cellId={cellId}
                            openCell={openCell}
                            setOpenCell={setOpenCell}
                          >
                            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                              <input
                                type="date"
                                value={value || ''}
                                onClick={e => e.stopPropagation()}
                                onChange={e => onUpdateStudentData && onUpdateStudentData(student.id, col.id, e.target.value || null)}
                                onInput={e => {
                                  const target = e.target as HTMLInputElement;
                                  if (target.value === '') {
                                    onUpdateStudentData && onUpdateStudentData(student.id, col.id, null);
                                  }
                                }}
                                className="w-full p-1 text-xs rounded border border-slate-300 bg-white text-slate-700 text-center"
                              />
                              {/* زر مسح يظهر فقط في الجوال/الآيباد */}
                              <button
                                type="button"
                                tabIndex={-1}
                                aria-label="مسح التاريخ"
                                onClick={e => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  onUpdateStudentData && onUpdateStudentData(student.id, col.id, null);
                                }}
                                style={{
                                  position: 'absolute',
                                  right: 2,
                                  top: '50%',
                                  transform: 'translateY(-50%)',
                                  background: 'transparent',
                                  border: 'none',
                                  color: '#888',
                                  fontSize: '1.1em',
                                  cursor: 'pointer',
                                  padding: 0,
                                  display: 'none', // افتراضيًا مخفي
                                }}
                                className="date-clear-btn"
                              >
                                ×
                              </button>
                            </div>
                          </ColorfulCell>
                        );
                      }
                      // Text (افتراضي)
                      return (
                        <ColorfulCell
                          key={col.id}
                          cellId={cellId}
                          openCell={openCell}
                          setOpenCell={setOpenCell}
                        >
                          <input
                            type="text"
                            value={value !== undefined && value !== null ? value : ''}
                            onClick={e => e.stopPropagation()}
                            onChange={e => onUpdateStudentData && onUpdateStudentData(student.id, col.id, e.target.value)}
                            className="w-full p-1 text-xs rounded border border-slate-300 bg-white text-slate-700 text-center"
                          />
                        </ColorfulCell>
                      );
                    })}
                    {/* عمود الإجراءات كما هو */}
                    <td className="px-2 py-3 text-center text-base bg-slate-50 border-b border-slate-200">
                      <button
                        className="text-red-500 hover:underline text-xs"
                        title={`حذف الطالب: ${student.name}`}
                        aria-label={`حذف الطالب: ${student.name}`}
                        onClick={e => {
                          e.stopPropagation();
                          onDeleteStudent && onDeleteStudent(student.id, student.name);
                        }}
                      >
                        حذف
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      
      {/* مودال تعديل العمود */}
      {editingColumn && (
        <EditColumnModal
          column={editingColumn as any}
          onClose={() => setEditingColumn(null)}
          onSave={(updatedData) => {
            onEditColumn(editingColumn!.id, updatedData);
            setEditingColumn(null);
          }}
        />
      )}
      
      <style>{`
        .custom-scroll::-webkit-scrollbar {
          height: 8px;
        }
        .custom-scroll::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }
        .custom-scroll::-webkit-scrollbar-track {
          background: #f1f5f9;
        }
      `}</style>
    </div>
    </DndProvider>
  );
};

export default StudentTable;
