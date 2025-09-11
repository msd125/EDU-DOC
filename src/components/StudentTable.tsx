import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { getContrastColor, getHeaderBg } from '../utils/colorUtils';
import EditColumnModal from './EditColumnModal';
import { EditIcon, TrashIcon, EllipsisIcon } from './Icons';
import DraggableColumns from './DraggableColumns';
import '../styles/draggable-columns.css';
import { saveColumnOrder, getColumnOrder, orderColumns } from '../utils/drag-drop/columnUtils';
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
  onDeleteAllStudents?: () => void;
  themeColor?: string;
  nameSortOrder?: 'asc' | 'desc';
  onNameSortChange?: (order: 'asc' | 'desc') => void;
  onColumnOrderChange?: (columns: ColumnType[]) => void;
}

// حفظ ترتيب الأعمدة في localStorage
const COLUMN_ORDER_KEY = 'columnOrder';

function saveColumnOrderLocal(order: (string | number)[]) {
  try {
    localStorage.setItem(COLUMN_ORDER_KEY, JSON.stringify(order));
  } catch {}
}

function getColumnOrderLocal(): (string | number)[] | null {
  try {
    const saved = localStorage.getItem(COLUMN_ORDER_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

const StudentTable: React.FC<StudentTableProps> = (props) => {
  const { 
    columns, 
    students, 
    onEditColumn, 
    onDeleteColumn, 
    onFillColumn, 
    onUpdateStudentData, 
    onDeleteStudent,
    onDeleteAllStudents,
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

  // Actions menu state
  const [isActionsMenuOpen, setIsActionsMenuOpen] = useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);
  
  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsActionsMenuOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);
  

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
      <div className="glass rounded-2xl overflow-hidden shadow-2xl border border-white/30 backdrop-blur-xl">
        {/* Modern Actions Header */}
        <div className="flex justify-between items-center p-4 bg-gradient-to-r from-white/90 to-white/70 
                       border-b border-white/20 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full 
                           flex items-center justify-center text-white font-bold text-sm">
              📊
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">جدول الطلاب</h3>
              <p className="text-sm text-gray-600">{students.length} طالب مسجل</p>
            </div>
          </div>
          
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsActionsMenuOpen(!isActionsMenuOpen)}
              className="btn-modern btn-secondary p-3 relative group"
              title="خيارات إضافية"
            >
              <EllipsisIcon className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
              {isActionsMenuOpen && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
              )}
            </button>

            {isActionsMenuOpen && (
              <div className="absolute left-0 top-full mt-2 glass rounded-xl p-2 min-w-[220px] z-50 
                           border border-white/30 shadow-xl animate-scale-in">
                <div className="space-y-1">
                  <button
                    onClick={() => {
                      const hasHighlighted = highlightedRows.length > 0;
                      if (hasHighlighted) {
                        setHighlightedRows([]);
                        toast.success('تم إلغاء تمييز جميع الصفوف');
                      } else {
                        const allIds = students.map(s => s.id);
                        setHighlightedRows(allIds);
                        toast.success('تم تمييز جميع الصفوف');
                      }
                      setIsActionsMenuOpen(false);
                    }}
                    className="w-full text-right p-3 rounded-lg hover:bg-white/50 transition-all 
                             text-sm text-gray-700 flex items-center gap-3 group"
                  >
                    <span className="text-lg group-hover:scale-110 transition-transform">
                      {highlightedRows.length > 0 ? '🔄' : '✨'}
                    </span>
                    <span className="font-medium">
                      {highlightedRows.length > 0 ? 'إلغاء تمييز الكل' : 'تمييز الكل'}
                    </span>
                  </button>
                  
                  {onDeleteAllStudents && (
                    <button
                      onClick={() => {
                        if (window.confirm('⚠️ هل أنت متأكد من حذف جميع الطلاب؟\nسيتم حذف جميع البيانات نهائياً!')) {
                          onDeleteAllStudents();
                          toast.success('تم حذف جميع الطلاب');
                        }
                        setIsActionsMenuOpen(false);
                      }}
                      className="w-full text-right p-3 rounded-lg hover:bg-red-50 transition-all 
                               text-sm text-red-600 flex items-center gap-3 group"
                    >
                      <span className="text-lg group-hover:scale-110 transition-transform">🗑️</span>
                      <span className="font-medium">حذف جميع الطلاب</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modern Table Container */}
        <div className="overflow-x-auto custom-scroll" style={{ maxHeight: '70vh' }}>
          <table className="w-full border-collapse relative">
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
              <DraggableColumns
                columns={orderedColumns}
                themeColor={themeColor}
                onEditColumn={(id) => {
                  const column = columns.find(c => c.id === id);
                  if (column) setEditingColumn(column);
                }}
                onDeleteColumn={onDeleteColumn}
                onFillColumn={onFillColumn}
                onColumnsReorder={handleColumnOrderChange}
              />
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
                        return (
                          <ColorfulCell
                            key={col.id}
                            cellId={cellId}
                            openCell={openCell}
                            setOpenCell={setOpenCell}
                          >
                            <input
                              type="checkbox"
                              checked={!!value}
                              onClick={e => e.stopPropagation()}
                              onChange={e => onUpdateStudentData && onUpdateStudentData(student.id, col.id, e.target.checked)}
                            />
                          </ColorfulCell>
                        );
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
