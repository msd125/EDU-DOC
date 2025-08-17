import React, { useState, useEffect, useRef } from 'react';
// ...existing code...

import { Student, Subject, Column, ColumnType } from '../types';
// ...existing code...
import EditColumnModal from './EditColumnModal';
import { EditIcon, TrashIcon } from './Icons';

interface StudentTableProps {
  students: Student[];
  activeSubject: Subject;
  onUpdateStudentData: (studentId: string, columnId: string, value: any) => void;
  onDeleteStudent: (studentId: string, studentName: string) => void;
  onDeleteColumn: (columnId: string, columnName: string) => void;
  onEditColumn: (columnId: string, updatedData: Partial<Column>) => void;
  onFillColumn: (columnId: string, value: any) => void;
  startIndex: number;
  apiKey: string | null;
  onRequestApiKey: () => void;
}

const StudentTable: React.FC<StudentTableProps> = ({ students, activeSubject, onUpdateStudentData, onDeleteStudent, onDeleteColumn, onEditColumn, onFillColumn, startIndex }) => {
  const [editingCell, setEditingCell] = useState<{ studentId: string, columnId: string } | null>(null);
  const [editingColumn, setEditingColumn] = useState<Column | null>(null);
  const [editValue, setEditValue] = useState<any>('');
  // ...existing code...
  // ...existing code...
  const inputRef = useRef<HTMLInputElement>(null);
  const selectRef = useRef<HTMLSelectElement>(null);

  const { columns } = activeSubject;
  const themeColor = activeSubject.themeColor || '#2E8540';

  useEffect(() => {
    if (editingCell) {
        if (inputRef.current) inputRef.current.focus();
        if (selectRef.current) selectRef.current.focus();
    }
  }, [editingCell]);
  
  const handleUpdate = () => {
    if (!editingCell) return;
    
    let finalValue = editValue;
    const column = columns.find(c => c.id === editingCell.columnId);
    if(column?.type === ColumnType.NUMBER) {
        finalValue = parseFloat(editValue);
        if(isNaN(finalValue)) finalValue = null; // Store as null if invalid number
    }
    
    onUpdateStudentData(editingCell.studentId, editingCell.columnId, finalValue);
  };

  const handleCellClick = (student: Student, column: Column) => {
    if (editingCell && (editingCell.studentId !== student.id || editingCell.columnId !== column.id)) {
        handleUpdate();
    }

    setEditingCell({ studentId: student.id, columnId: column.id });
    const currentValue = student.records[column.id];

    if(column.type === ColumnType.CHECKBOX) {
        onUpdateStudentData(student.id, column.id, !currentValue);
        setEditingCell(null);
    } else {
        setEditValue(currentValue ?? '');
    }
  };
  
  const handleSelectUpdate = (studentId: string, columnId: string, value: any) => {
      onUpdateStudentData(studentId, columnId, value);
      setEditingCell(null);
  }

  const handleKeyDown = (e: React.KeyboardEvent, student: Student, column: Column) => {
    if (e.key === 'Escape') {
      setEditingCell(null);
    } else if (e.key === 'Enter') {
      handleUpdate();
      setEditingCell(null);
    } else if (e.key === 'Tab') {
      e.preventDefault();
      handleUpdate(); // Save current cell first

      const studentIndex = students.findIndex(s => s.id === student.id);
      const columnIndex = columns.findIndex(c => c.id === column.id);

      if (studentIndex === -1 || columnIndex === -1) {
        setEditingCell(null);
        return;
      }

      let nextStudentIndex = studentIndex;
      let nextColumnIndex = columnIndex;

      if (e.shiftKey) { // Move backwards
        nextColumnIndex--;
        if (nextColumnIndex < 0) {
          nextStudentIndex--;
          nextColumnIndex = columns.length - 1;
        }
      } else { // Move forwards
        nextColumnIndex++;
        if (nextColumnIndex >= columns.length) {
          nextStudentIndex++;
          nextColumnIndex = 0;
        }
      }

      if (students[nextStudentIndex] && columns[nextColumnIndex]) {
        const nextStudent = students[nextStudentIndex];
        const nextColumn = columns[nextColumnIndex];
        handleCellClick(nextStudent, nextColumn);
      } else {
        // We're at the end or beginning of the table
        setEditingCell(null);
      }
    }
  };
  
  // ...existing code...


  const renderCellContent = (student: Student, column: Column) => {
    const isEditing = editingCell?.studentId === student.id && editingCell?.columnId === column.id;
    const value = student.records[column.id];

    if (isEditing) {
      if (column.type === ColumnType.LIST && column.options) {
        return (
          <select
            ref={selectRef}
            value={value ?? ''}
            onChange={(e) => handleSelectUpdate(student.id, column.id, e.target.value)}
            onBlur={() => setEditingCell(null)}
            onKeyDown={(e) => handleKeyDown(e, student, column)}
            className="w-full h-full p-2 bg-white dark:bg-slate-700 border-2 rounded-md outline-none"
            style={{ borderColor: themeColor }}
          >
            <option value="">اختر...</option>
            {column.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        );
      }
      return (
        <input
          ref={inputRef}
          type={column.type === ColumnType.NUMBER ? 'number' : column.type === ColumnType.DATE ? 'date' : 'text'}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={() => { handleUpdate(); setEditingCell(null); }}
          onKeyDown={(e) => handleKeyDown(e, student, column)}
          className="w-full h-full p-2 bg-white dark:bg-slate-700 border-2 rounded-md outline-none text-center"
          style={{ borderColor: themeColor }}
        />
      );
    }

    if (column.type === ColumnType.CHECKBOX) {
      return <input type="checkbox" checked={!!value} readOnly className="w-5 h-5 mx-auto block cursor-pointer"/>;
    }
    
    return <span className="p-2 block w-full h-full">{value ?? ''}</span>;
  };

  if (students.length === 0 && startIndex === 0) { // Only show if it's the first page and no students
    return <div className="text-center p-8 bg-white dark:bg-slate-800/50 rounded-lg shadow">لا يوجد طلاب في هذا الفصل. قم بإضافة طالب أو استيراد الطلاب للبدء.</div>;
  }

  return (
    <React.Fragment>
      <div className="overflow-x-auto bg-white dark:bg-slate-800 shadow-xl rounded-lg">
  <table className="w-full text-xs text-right text-slate-500 dark:text-slate-400">
          <thead className="text-[10px] text-white uppercase" style={{ backgroundColor: themeColor }}>
            <tr>
              <th scope="col" className="px-4 py-2 sticky start-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm min-w-[120px] text-right z-20 text-slate-800 dark:text-slate-100 text-xs" style={{ backgroundColor: '' }}>
                اسم الطالب
              </th>
              {columns.map((col) => {
                const checkedCount = col.type === ColumnType.CHECKBOX ? students.filter(s => !!s.records[col.id]).length : 0;
                const allChecked = col.type === ColumnType.CHECKBOX && students.length > 0 ? checkedCount === students.length : false;
                const isIndeterminate = col.type === ColumnType.CHECKBOX ? checkedCount > 0 && checkedCount < students.length : false;

                return (
                  <th key={col.id} scope="col" className="px-4 py-3 min-w-[150px] group align-top">
                    <div className="flex items-center justify-between mb-2 h-5">
                      <span className="font-semibold text-[10px]">{col.name}</span>
                      <div className="flex items-center gap-1">
                          <button onClick={() => setEditingColumn(col)} className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-200 hover:text-white" data-tooltip="تعديل العمود">
                              <EditIcon className="w-4 h-4" />
                          </button>
                          <button onClick={() => onDeleteColumn(col.id, col.name)} className="opacity-0 group-hover:opacity-100 transition-opacity text-red-200 hover:text-white" data-tooltip="حذف العمود">
                              <TrashIcon className="w-4 h-4" />
                          </button>
                      </div>
                    </div>
                    {/* Fill input area */}
                    <div className="h-8">
                       {col.type === ColumnType.CHECKBOX ? (
                        <div className="flex justify-center items-center h-full">
                          <input
                            type="checkbox"
                            title="تحديد/إلغاء تحديد الكل"
                            className="w-4 h-4 text-emerald-400 bg-slate-100 border-slate-300 rounded focus:ring-offset-slate-700 focus:ring-1 focus:ring-emerald-400"
                            checked={allChecked}
                            ref={el => { if (el) el.indeterminate = isIndeterminate; }}
                            onChange={() => onFillColumn(col.id, !allChecked)}
                          />
                        </div>
                      ) : col.type === ColumnType.LIST && col.options ? (
                        <select
                          className="w-full p-1 text-[10px] bg-black/20 border border-white/20 rounded text-white"
                          value="" // Controlled component to allow reset
                          onChange={(e) => {
                            if (e.target.value) {
                              onFillColumn(col.id, e.target.value);
                            }
                          }}
                        >
                          <option value="" disabled>تعبئة للكل...</option>
                          {col.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                      ) : (
                        <input
                          type={col.type === ColumnType.NUMBER ? 'number' : col.type === ColumnType.DATE ? 'date' : 'text'}
                          className="w-full p-1 text-[10px] text-center bg-black/20 border border-white/20 rounded text-white placeholder-slate-300"
                          placeholder="تعبئة للكل..."
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && e.currentTarget.value) {
                              onFillColumn(col.id, e.currentTarget.value);
                              e.currentTarget.value = '';
                            }
                          }}
                        />
                      )}
                    </div>
                  </th>
                )})}
               <th scope="col" className="px-6 py-3 text-center">
                  إجراءات
               </th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <tr key={student.id} className="bg-white border-b dark:bg-slate-800 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/40 group">
                <th scope="row" className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap dark:text-white sticky start-0 bg-white dark:bg-slate-800 group-hover:bg-slate-50 dark:group-hover:bg-slate-700/40 z-10">
                  <div className="flex items-center">
                      <span className="inline-block w-6 text-center text-xs text-slate-500 dark:text-slate-400 me-2">{startIndex + index + 1}</span>
                      <span>{student.name}</span>
                  </div>
                </th>
                {columns.map((col) => (
                  <td key={col.id} onClick={() => handleCellClick(student, col)} className="px-0 py-0 cursor-pointer h-14 hover:bg-green-50/50 dark:hover:bg-green-900/10 text-center">
                    {renderCellContent(student, col)}
                  </td>
                ))}
                <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-3">
                        {/* زر الذكاء الاصطناعي تم حذفه */}
                        <button onClick={() => onDeleteStudent(student.id, student.name)} className="text-red-500 hover:text-red-700" data-tooltip="حذف الطالب">
                            <TrashIcon className="w-5 h-5" />
                        </button>
                    </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
  {/* FeedbackModal تم حذفه */}
      {editingColumn && (
          <EditColumnModal
            column={editingColumn}
            onClose={() => setEditingColumn(null)}
            onSave={(updatedData) => {
                onEditColumn(editingColumn.id, updatedData);
                setEditingColumn(null);
            }}
          />
      )}
    </React.Fragment>
  );
};

export default StudentTable;