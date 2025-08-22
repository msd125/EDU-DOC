// دالة تلوين خلفية الأعمدة مع شفافية
function getHeaderBg(color?: string) {
  if (!color) return 'rgba(46,133,64,0.08)';
  // تحويل HEX إلى RGBA مع شفافية
  let c = color.replace('#', '');
  if (c.length === 3) c = c.split('').map(x => x + x).join('');
  const num = parseInt(c, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r},${g},${b},0.08)`;
}
export { StudentTable };
import React, { useState, useEffect } from 'react';
import EditColumnModal from './EditColumnModal';
import { EditIcon, TrashIcon } from './Icons';

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
}

const StudentTable: React.FC<StudentTableProps> = (props) => {
  const { columns, students, onEditColumn, onDeleteColumn, onFillColumn, onUpdateStudentData, onDeleteStudent, themeColor } = props;
  const [editingColumn, setEditingColumn] = useState<ColumnType | null>(null);

  // إضافة state للتحكم في حجم النص ولونه وتمييز الصفوف
  // تحكم في الصفوف المظللة
  // حفظ واسترجاع الصفوف المظللة من localStorage
  const [highlightedRows, setHighlightedRows] = useState<(string | number)[]>(() => {
    try {
      const saved = localStorage.getItem('highlightedRows');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('highlightedRows', JSON.stringify(highlightedRows));
  }, [highlightedRows]);

  return (
    <div className="w-full flex flex-col justify-center items-start min-h-[60vh] p-0 m-0" style={{ direction: 'rtl', margin: 0, padding: 0, border: 'none' }}>
  {/* تعليمات تمييز الصفوف حذفت بناءً على طلب المستخدم */}
      <div
        className="w-full bg-white dark:bg-slate-900 shadow border-2 border-slate-300 dark:border-slate-700 overflow-x-auto custom-scroll"
        style={{ direction: 'rtl', minHeight: '60vh', boxSizing: 'border-box', maxWidth: '100vw', margin: 0, padding: 0, border: 'none', borderRadius: 0 }}
      >
        <table
          className="min-w-full table-auto"
          style={{ width: '100%', tableLayout: 'auto', minWidth: 600 }}
        >
          <thead className="text-[10px] sm:text-xs md:text-sm text-white uppercase sticky top-0 z-30"
            style={{
              backgroundColor: themeColor || '#2E8540',
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12,
              fontFamily: 'Noto Sans Arabic, Cairo, sans-serif',
              boxShadow: '0 2px 8px -2px #0002',
              color: '#fff',
            }}>
            <tr>
              <th className="px-1 sm:px-2 py-2 sticky right-0 bg-slate-100 dark:bg-slate-800/90 backdrop-blur-sm min-w-[60px] max-w-[60px] text-center z-30 text-slate-800 dark:text-slate-100 text-xs font-bold border-r-4 border-slate-300 shadow-lg" style={{ fontFamily: 'Noto Sans Arabic, Cairo, sans-serif', boxShadow: '2px 0 8px -2px #0002' }}>م</th>
              <th className="px-1 sm:px-2 py-2 sticky right-0 bg-slate-100 dark:bg-slate-800/90 backdrop-blur-sm min-w-[140px] max-w-[220px] text-right z-30 text-slate-800 dark:text-slate-100 text-xs font-bold border-r-4 border-slate-300 shadow-lg" style={{ fontFamily: 'Noto Sans Arabic, Cairo, sans-serif', boxShadow: '2px 0 8px -2px #0002' }}>اسم الطالب</th>
              {columns.map((col) => (
                <th key={col.id} className="px-1 sm:px-2 py-2 min-w-[80px] md:min-w-[120px] max-w-[180px] text-center align-top border-slate-200 border-l last:border-l-0 group relative text-xs font-bold" style={{ fontFamily: 'Noto Sans Arabic, Cairo, sans-serif', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  <div className="flex flex-col items-center gap-0.5 w-full">
                    <span className="font-semibold text-xs break-words w-full" title={col.name}>{col.name}</span>
                    <div className="flex gap-4 justify-center items-center mt-1">
                      <button
                        className="inline-flex items-center justify-center ms-1 text-lg text-gray-400 hover:text-emerald-600 opacity-90 hover:opacity-100 transition-all duration-150 p-2 rounded-full"
                        title="تعديل اسم العمود"
                        aria-label="تعديل اسم العمود"
                        onClick={() => setEditingColumn(col)}
                        style={{ verticalAlign: 'middle', minWidth: 36, minHeight: 36 }}>
                        <EditIcon className="w-6 h-6" />
                      </button>
                      <button
                        className="inline-flex items-center justify-center ms-1 text-lg text-gray-400 hover:text-red-500 opacity-90 hover:opacity-100 transition-all duration-150 p-2 rounded-full"
                        title="حذف العمود"
                        aria-label="حذف العمود"
                        onClick={() => onDeleteColumn(col.id, col.name)}
                        style={{ verticalAlign: 'middle', minWidth: 36, minHeight: 36 }}>
                        <TrashIcon className="w-6 h-6" />
                      </button>
                    </div>
                    {col.type === 'قائمة' || col.type === 'LIST' ? (
                      <select
                        className="w-full mt-1 p-1 text-xs text-center rounded bg-white text-slate-700 border border-slate-300 focus:ring-emerald-500 focus:border-emerald-500"
                        defaultValue=""
                        onChange={e => {
                          const value = e.target.value;
                          if (value !== '') {
                            onFillColumn && onFillColumn(col.id, value);
                            e.target.selectedIndex = 0;
                          }
                        }}
                        style={{ fontSize: 10, minWidth: 0, maxWidth: 120 }}
                      >
                        <option value="">تعميم لكل الطلاب...</option>
                        {(col.options || []).map((opt: string) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    ) : col.type === 'مربع اختيار' || col.type === 'CHECKBOX' ? (
                      <div className="flex gap-1 mt-1 justify-center items-center">
                        <input
                          type="checkbox"
                          onChange={e => onFillColumn && onFillColumn(col.id, e.target.checked)}
                          title="تعميم تفعيل/إلغاء الكل"
                          className="w-5 h-5 sm:w-6 sm:h-6 accent-emerald-600"
                        />
                      </div>
                    ) : (
                      <input
                        type={col.type === 'رقم' || col.type === 'NUMBER' ? 'number' : col.type === 'تاريخ' || col.type === 'DATE' ? 'date' : 'text'}
                        className="w-full mt-1 p-1 text-xs sm:text-sm text-center rounded bg-white text-slate-700 border border-slate-300 focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="تعميم لكل الطلاب"
                        onChange={e => {
                          const target = e.target as HTMLInputElement;
                          let value: any = target.value;
                          if (col.type === 'رقم' || col.type === 'NUMBER') value = value === '' ? null : parseFloat(value);
                          if (col.type === 'تاريخ' || col.type === 'DATE') value = value || null;
                          onFillColumn && onFillColumn(col.id, value);
                        }}
                        style={{ fontSize: 10, minWidth: 0, maxWidth: 120 }}
                      />
                    )}
                  </div>
                </th>
              ))}
              <th className="px-2 py-2 text-center text-xs" title="إجراءات">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {students.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 3} className="text-center py-6 text-slate-400">لا يوجد طلاب</td>
              </tr>
            ) : (
              students.map((student, idx) => {
                const isHighlighted = highlightedRows.includes(student.id);
                return (
                  <tr
                    key={student.id}
                    className={
                      "border-b last:border-b-0 transition-colors " +
                      (isHighlighted ? "bg-yellow-100" : (idx % 2 === 0 ? "bg-gray-50" : "bg-white"))
                    }
                  >
                    <td
                      className="px-1 sm:px-2 py-2 text-center font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap border-b-4 border-slate-300 z-20 cursor-pointer"
                      style={{
                        maxWidth: '60px',
                        minWidth: '60px',
                        boxShadow: '2px 0 8px -2px #0002',
                        backgroundColor: getHeaderBg(themeColor)
                      }}
                      onClick={e => {
                        e.stopPropagation();
                        setHighlightedRows(rows =>
                          rows.includes(student.id)
                            ? rows.filter(id => id !== student.id)
                            : [...rows, student.id]
                        );
                      }}
                    >
                      {student.serial || idx + 1}
                    </td>
                    <td
                      className="px-1 sm:px-2 py-2 sticky right-0 text-right font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap border-b-4 border-slate-300 z-20 text-sm md:text-xs"
                      style={{
                        maxWidth: '220px',
                        minWidth: '140px',
                        boxShadow: '2px 0 8px -2px #0002',
                        backgroundColor: getHeaderBg(themeColor)
                      }}
                    >
                      {student.name}
                    </td>
                    {columns.map((col) => {
                      const value = student.records?.[col.id];
                      const cellKey = `${student.id}_${col.id}`;
                      // const style = cellStyles[cellKey] || { fontSize: 'text-base', fontColor: '#000000' };
                      // تخصيص الخلية فقط عند النقر عليها
                      // const handleCellClick = (e: React.MouseEvent) => {
                      //   e.stopPropagation();
                      //   setSelectedCell({ studentId: student.id, colId: col.id });
                      // };
                      if (col.type === 'مربع اختيار' || col.type === 'CHECKBOX') {
                        return (
                          <td key={col.id} data-cellid={cellKey} className="text-base px-2 sm:px-4 py-3 text-center bg-white dark:bg-slate-900 border-b border-slate-200 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={!!value}
                              onClick={e => e.stopPropagation()}
                              onChange={e => onUpdateStudentData && onUpdateStudentData(student.id, col.id, e.target.checked)}
                            />
                          </td>
                        );
                      } else if (col.type === 'قائمة' || col.type === 'LIST') {
                        return (
                          <td key={col.id} data-cellid={cellKey} className="text-base px-2 sm:px-4 py-2 text-center cursor-pointer">
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
                          </td>
                        );
                      } else if (col.type === 'رقم' || col.type === 'NUMBER') {
                        return (
                          <td key={col.id} data-cellid={cellKey} className="text-base px-2 sm:px-4 py-2 text-center cursor-pointer">
                            <input
                              type="number"
                              value={value !== undefined && value !== null ? value : ''}
                              onClick={e => e.stopPropagation()}
                              onChange={e => onUpdateStudentData && onUpdateStudentData(student.id, col.id, e.target.value === '' ? null : parseFloat(e.target.value))}
                              className="w-full p-1 text-xs rounded border border-slate-300 bg-white text-slate-700 text-center"
                            />
                          </td>
                        );
                      } else if (col.type === 'تاريخ' || col.type === 'DATE') {
                        return (
                          <td key={col.id} data-cellid={cellKey} className="text-base px-2 sm:px-4 py-2 text-center cursor-pointer">
                            <input
                              type="date"
                              value={value || ''}
                              onClick={e => e.stopPropagation()}
                              onChange={e => onUpdateStudentData && onUpdateStudentData(student.id, col.id, e.target.value || null)}
                              className="w-full p-1 text-xs rounded border border-slate-300 bg-white text-slate-700 text-center"
                            />
                          </td>
                        );
                      } else {
                        return (
                          <td key={col.id} data-cellid={cellKey} className="text-base px-2 sm:px-4 py-2 text-center cursor-pointer">
                            <input
                              type="text"
                              value={value !== undefined && value !== null ? value : ''}
                              onClick={e => e.stopPropagation()}
                              onChange={e => onUpdateStudentData && onUpdateStudentData(student.id, col.id, e.target.value)}
                              className="w-full p-1 text-xs rounded border border-slate-300 bg-white text-slate-700 text-center"
                            />
                          </td>
                        );
                      }
                    })}
                    <td className="px-2 py-3 text-center text-base bg-slate-50 dark:bg-slate-800 border-b border-slate-200">
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
    </div>
  );
}
