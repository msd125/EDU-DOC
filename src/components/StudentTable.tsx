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
      <div className="w-full flex flex-col justify-center items-start min-h-[60vh] p-0 m-0" style={{ direction: 'rtl', margin: 0, padding: 0, border: 'none' }}>
      <div className="w-full flex justify-end mb-2 px-4">
        <div className="relative" ref={menuRef}>
          <button
            className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 px-3 py-1.5 rounded-md text-xs font-semibold text-white transition-colors"
            onClick={() => setIsActionsMenuOpen(!isActionsMenuOpen)}
          >
            <span>الإجراءات</span>
            <EllipsisIcon className="w-4 h-4" />
          </button>
          
          {isActionsMenuOpen && (
            <div className="absolute left-0 z-50 mt-1 bg-white shadow-lg rounded-md py-1 min-w-[160px] border border-slate-200">
              {onDeleteAllStudents && (
                <button
                  className="w-full text-right px-4 py-2 text-xs text-red-600 hover:bg-slate-100 transition-colors"
                  onClick={() => {
                    setIsActionsMenuOpen(false);
                    onDeleteAllStudents();
                  }}
                >
                  حذف جميع الأسماء
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      
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
