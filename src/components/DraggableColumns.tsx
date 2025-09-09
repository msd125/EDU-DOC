import React, { useState, useRef } from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { format } from 'date-fns';
import ConfirmModal from './ConfirmModal';
import { Column, ColumnType } from '../types';

function isMobileOrTablet() {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
}

interface TableColumnHeaderProps {
  column: Column;
  index: number;
  onDateChange: (columnId: string, newDate: string) => void;
  onTitleChange: (columnId: string, newTitle: string) => void;
}

const DateHeaderInputForColumn: React.FC<{
  column: Column;
  onDateChange: (columnId: string, newDate: string) => void;
}> = ({ column, onDateChange }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [showDateInput, setShowDateInput] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDateClick = () => {
    if (isMobileOrTablet()) {
      setShowConfirm(true);
    } else {
      setShowDateInput(true);
      setTimeout(() => {
        inputRef.current?.showPicker?.();
      }, 0);
    }
  };

  const handleConfirm = () => {
    setShowConfirm(false);
    setShowDateInput(true);
    setTimeout(() => {
      inputRef.current?.showPicker?.();
    }, 0);
  };

  const handleCancel = () => {
    setShowConfirm(false);
    setShowDateInput(false);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onDateChange(String(column.id), e.target.value);
    setShowDateInput(false);
  };

  return (
    <>
      <span
        style={{ cursor: 'pointer', color: '#007bff', textDecoration: 'underline' }}
        onClick={handleDateClick}
        tabIndex={0}
        role="button"
        aria-label="Edit date"
      >
        {'date' in column && (column as any).date ? format(new Date((column as any).date), 'yyyy-MM-dd') : 'تاريخ'}
      </span>
      {showDateInput && (
        <input
          ref={inputRef}
          type="date"
          value={'date' in column && (column as any).date ? format(new Date((column as any).date), 'yyyy-MM-dd') : ''}
          onChange={handleDateChange}
          onBlur={() => setShowDateInput(false)}
          style={{ marginLeft: 8 }}
          autoFocus
        />
      )}
      {showConfirm && (
        <ConfirmModal
          message="هل أنت متأكد أنك تريد تعديل التاريخ لهذا العمود؟"
          onConfirm={handleConfirm}
          onCancel={handleCancel}
          confirmLabel="تأكيد التعديل"
        />
      )}
    </>
  );
};

const TableColumnHeader: React.FC<TableColumnHeaderProps> = ({ column, index, onDateChange, onTitleChange }) => {
  return (
    <Draggable draggableId={String(column.id)} index={index}>
      {(provided) => (
        <th
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{
            ...provided.draggableProps.style,
            background: '#f8f9fa',
            padding: '8px',
            minWidth: 120,
            border: '1px solid #dee2e6',
            textAlign: 'center',
          }}
        >
          {column.type === ColumnType.DATE ? (
            <DateHeaderInputForColumn column={column} onDateChange={onDateChange} />
          ) : (
            <input
              type="text"
              value={column.name}
              onChange={(e) => onTitleChange(String(column.id), e.target.value)}
              style={{
                width: '90%',
                border: 'none',
                background: 'transparent',
                textAlign: 'center',
                fontWeight: 'bold',
              }}
              aria-label="Edit column title"
            />
          )}
        </th>
      )}
    </Draggable>
  );
};

interface DraggableColumnsProps {
  columns: Column[];
  onDateChange: (columnId: string, newDate: string) => void;
  onTitleChange: (columnId: string, newTitle: string) => void;
  onDragEnd: (result: any) => void;
}

const DraggableColumns: React.FC<DraggableColumnsProps> = ({ columns, onDateChange, onTitleChange, onDragEnd }) => {
  return (
    <Droppable droppableId="columns" direction="horizontal">
      {(provided) => (
        <tr ref={provided.innerRef} {...provided.droppableProps}>
          {columns.map((column, index) => (
            <TableColumnHeader
              key={column.id}
              column={column}
              index={index}
              onDateChange={onDateChange}
              onTitleChange={onTitleChange}
            />
          ))}
          {provided.placeholder}
        </tr>
      )}
    </Droppable>
  );
};

export default DraggableColumns;
export default DraggableColumns;
import React, { useState, useRef } from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { format } from 'date-fns';
import ConfirmModal from './ConfirmModal';
import { Column, ColumnType } from '../types';

function isMobileOrTablet() {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
}

interface TableColumnHeaderProps {
  column: Column;
  index: number;
  onDateChange: (columnId: string, newDate: string) => void;
  onTitleChange: (columnId: string, newTitle: string) => void;
}

const DateHeaderInputForColumn: React.FC<{
  column: Column;
  onDateChange: (columnId: string, newDate: string) => void;
}> = ({ column, onDateChange }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [showDateInput, setShowDateInput] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDateClick = () => {
    if (isMobileOrTablet()) {
      setShowConfirm(true);
    } else {
      setShowDateInput(true);
      setTimeout(() => {
        inputRef.current?.showPicker?.();
      }, 0);
    }
  };

  const handleConfirm = () => {
    setShowConfirm(false);
    setShowDateInput(true);
    setTimeout(() => {
      inputRef.current?.showPicker?.();
    }, 0);
  };

  const handleCancel = () => {
    setShowConfirm(false);
    setShowDateInput(false);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onDateChange(String(column.id), e.target.value);
    setShowDateInput(false);
  };

  return (
    <>
      <span
        style={{ cursor: 'pointer', color: '#007bff', textDecoration: 'underline' }}
        onClick={handleDateClick}
        tabIndex={0}
        role="button"
        aria-label="Edit date"
      >
        {'date' in column && (column as any).date ? format(new Date((column as any).date), 'yyyy-MM-dd') : 'تاريخ'}
      </span>
      {showDateInput && (
        <input
          ref={inputRef}
          type="date"
          value={'date' in column && (column as any).date ? format(new Date((column as any).date), 'yyyy-MM-dd') : ''}
          onChange={handleDateChange}
          onBlur={() => setShowDateInput(false)}
          style={{ marginLeft: 8 }}
          autoFocus
        />
      )}
      {showConfirm && (
        <ConfirmModal
          message="هل أنت متأكد أنك تريد تعديل التاريخ لهذا العمود؟"
          onConfirm={handleConfirm}
          onCancel={handleCancel}
          confirmLabel="تأكيد التعديل"
        />
      )}
    </>
  );
};

const TableColumnHeader: React.FC<TableColumnHeaderProps> = ({ column, index, onDateChange, onTitleChange }) => {
  return (
    <Draggable draggableId={String(column.id)} index={index}>
      {(provided) => (
        <th
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{
            ...provided.draggableProps.style,
            background: '#f8f9fa',
            padding: '8px',
            minWidth: 120,
            border: '1px solid #dee2e6',
            textAlign: 'center',
          }}
        >
          {column.type === ColumnType.DATE ? (
            <DateHeaderInputForColumn column={column} onDateChange={onDateChange} />
          ) : (
            <input
              type="text"
              value={column.name}
              onChange={(e) => onTitleChange(String(column.id), e.target.value)}
              style={{
                width: '90%',
                border: 'none',
                background: 'transparent',
                textAlign: 'center',
                fontWeight: 'bold',
              }}
              aria-label="Edit column title"
            />
          )}
        </th>
      )}
    </Draggable>
  );
};

interface DraggableColumnsProps {
  columns: Column[];
  onDateChange: (columnId: string, newDate: string) => void;
  onTitleChange: (columnId: string, newTitle: string) => void;
  onDragEnd: (result: any) => void;
}

const DraggableColumns: React.FC<DraggableColumnsProps> = ({ columns, onDateChange, onTitleChange, onDragEnd }) => {
  return (
    <Droppable droppableId="columns" direction="horizontal">
      {(provided) => (
        <tr ref={provided.innerRef} {...provided.droppableProps}>
          {columns.map((column, index) => (
            <TableColumnHeader
              key={column.id}
              column={column}
              index={index}
              onDateChange={onDateChange}
              onTitleChange={onTitleChange}
            />
          ))}
          {provided.placeholder}
        </tr>
      )}
    </Droppable>
  );
};

export default DraggableColumns;
export default DraggableColumns;
import React, { useState, useRef } from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { format } from 'date-fns';
import ConfirmModal from './ConfirmModal';
import { Column, ColumnType } from '../types';

function isMobileOrTablet() {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
}

interface TableColumnHeaderProps {
  column: Column;
  index: number;
  onDateChange: (columnId: string, newDate: string) => void;
  onTitleChange: (columnId: string, newTitle: string) => void;
}

const DateHeaderInputForColumn: React.FC<{
  column: Column;
  onDateChange: (columnId: string, newDate: string) => void;
}> = ({ column, onDateChange }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [showDateInput, setShowDateInput] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDateClick = () => {
    if (isMobileOrTablet()) {
      setShowConfirm(true);
    } else {
      setShowDateInput(true);
      setTimeout(() => {
        inputRef.current?.showPicker?.();
      }, 0);
    }
  };

  const handleConfirm = () => {
    setShowConfirm(false);
    setShowDateInput(true);
    setTimeout(() => {
      inputRef.current?.showPicker?.();
    }, 0);
  };

  const handleCancel = () => {
    setShowConfirm(false);
    setShowDateInput(false);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onDateChange(String(column.id), e.target.value);
    setShowDateInput(false);
  };

  return (
    <>
      <span
        style={{ cursor: 'pointer', color: '#007bff', textDecoration: 'underline' }}
        onClick={handleDateClick}
        tabIndex={0}
        role="button"
        aria-label="Edit date"
      >
        {'date' in column && (column as any).date ? format(new Date((column as any).date), 'yyyy-MM-dd') : 'تاريخ'}
      </span>
      {showDateInput && (
        <input
          ref={inputRef}
          type="date"
          value={'date' in column && (column as any).date ? format(new Date((column as any).date), 'yyyy-MM-dd') : ''}
          onChange={handleDateChange}
          onBlur={() => setShowDateInput(false)}
          style={{ marginLeft: 8 }}
          autoFocus
        />
      )}
      {showConfirm && (
        <ConfirmModal
          message="هل أنت متأكد أنك تريد تعديل التاريخ لهذا العمود؟"
          onConfirm={handleConfirm}
          onCancel={handleCancel}
          confirmLabel="تأكيد التعديل"
        />
      )}
    </>
  );
};

const TableColumnHeader: React.FC<TableColumnHeaderProps> = ({ column, index, onDateChange, onTitleChange }) => {
  return (
    <Draggable draggableId={String(column.id)} index={index}>
      {(provided) => (
        <th
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{
            ...provided.draggableProps.style,
            background: '#f8f9fa',
            padding: '8px',
            minWidth: 120,
            border: '1px solid #dee2e6',
            textAlign: 'center',
          }}
        >
          {column.type === ColumnType.DATE ? (
            <DateHeaderInputForColumn column={column} onDateChange={onDateChange} />
          ) : (
            <input
              type="text"
              value={column.name}
              onChange={(e) => onTitleChange(String(column.id), e.target.value)}
              style={{
                width: '90%',
                border: 'none',
                background: 'transparent',
                textAlign: 'center',
                fontWeight: 'bold',
              }}
              aria-label="Edit column title"
            />
          )}
        </th>
      )}
    </Draggable>
  );
};

interface DraggableColumnsProps {
  columns: Column[];
  onDateChange: (columnId: string, newDate: string) => void;
  onTitleChange: (columnId: string, newTitle: string) => void;
  onDragEnd: (result: any) => void;
}

const DraggableColumns: React.FC<DraggableColumnsProps> = ({ columns, onDateChange, onTitleChange, onDragEnd }) => {
  return (
    <Droppable droppableId="columns" direction="horizontal">
      {(provided) => (
        <tr ref={provided.innerRef} {...provided.droppableProps}>
          {columns.map((column, index) => (
            <TableColumnHeader
              key={column.id}
              column={column}
              index={index}
              onDateChange={onDateChange}
              onTitleChange={onTitleChange}
            />
          ))}
          {provided.placeholder}
        </tr>
      )}
    </Droppable>
  );
};

export default DraggableColumns;
export default DraggableColumns;
import React, { useState, useRef } from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { format } from 'date-fns';
import ConfirmModal from './ConfirmModal';
import { Column, ColumnType } from '../types';

function isMobileOrTablet() {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
}

interface TableColumnHeaderProps {
  column: Column;
  index: number;
  onDateChange: (columnId: string, newDate: string) => void;
  onTitleChange: (columnId: string, newTitle: string) => void;
}

const DateHeaderInputForColumn: React.FC<{
  column: Column;
  onDateChange: (columnId: string, newDate: string) => void;
}> = ({ column, onDateChange }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [showDateInput, setShowDateInput] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDateClick = () => {
    if (isMobileOrTablet()) {
      setShowConfirm(true);
    } else {
      setShowDateInput(true);
      setTimeout(() => {
        inputRef.current?.showPicker?.();
      }, 0);
    }
  };

  const handleConfirm = () => {
    setShowConfirm(false);
    setShowDateInput(true);
    setTimeout(() => {
      inputRef.current?.showPicker?.();
    }, 0);
  };

  const handleCancel = () => {
    setShowConfirm(false);
    setShowDateInput(false);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onDateChange(String(column.id), e.target.value);
    setShowDateInput(false);
  };

  return (
    <>
      <span
        style={{ cursor: 'pointer', color: '#007bff', textDecoration: 'underline' }}
        onClick={handleDateClick}
        tabIndex={0}
        role="button"
        aria-label="Edit date"
      >
        {'date' in column && (column as any).date ? format(new Date((column as any).date), 'yyyy-MM-dd') : 'تاريخ'}
      </span>
      {showDateInput && (
        <input
          ref={inputRef}
          type="date"
          value={'date' in column && (column as any).date ? format(new Date((column as any).date), 'yyyy-MM-dd') : ''}
          onChange={handleDateChange}
          onBlur={() => setShowDateInput(false)}
          style={{ marginLeft: 8 }}
          autoFocus
        />
      )}
      {showConfirm && (
        <ConfirmModal
          message="هل أنت متأكد أنك تريد تعديل التاريخ لهذا العمود؟"
          onConfirm={handleConfirm}
          onCancel={handleCancel}
          confirmLabel="تأكيد التعديل"
        />
      )}
    </>
  );
};

const TableColumnHeader: React.FC<TableColumnHeaderProps> = ({ column, index, onDateChange, onTitleChange }) => {
  return (
    <Draggable draggableId={String(column.id)} index={index}>
      {(provided) => (
        <th
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{
            ...provided.draggableProps.style,
            background: '#f8f9fa',
            padding: '8px',
            minWidth: 120,
            border: '1px solid #dee2e6',
            textAlign: 'center',
          }}
        >
          {column.type === ColumnType.DATE ? (
            <DateHeaderInputForColumn column={column} onDateChange={onDateChange} />
          ) : (
            <input
              type="text"
              value={column.name}
              onChange={(e) => onTitleChange(String(column.id), e.target.value)}
              style={{
                width: '90%',
                border: 'none',
                background: 'transparent',
                textAlign: 'center',
                fontWeight: 'bold',
              }}
              aria-label="Edit column title"
            />
          )}
        </th>
      )}
    </Draggable>
  );
};

interface DraggableColumnsProps {
  columns: Column[];
  onDateChange: (columnId: string, newDate: string) => void;
  onTitleChange: (columnId: string, newTitle: string) => void;
  onDragEnd: (result: any) => void;
}

const DraggableColumns: React.FC<DraggableColumnsProps> = ({ columns, onDateChange, onTitleChange, onDragEnd }) => {
  return (
    <Droppable droppableId="columns" direction="horizontal">
      {(provided) => (
        <tr ref={provided.innerRef} {...provided.droppableProps}>
          {columns.map((column, index) => (
            <TableColumnHeader
              key={column.id}
              column={column}
              index={index}
              onDateChange={onDateChange}
              onTitleChange={onTitleChange}
            />
          ))}
          {provided.placeholder}
        </tr>
      )}
    </Droppable>
  );
};

export default DraggableColumns;
        <th>
          {/* تعميم القيم حسب نوع العمود */}
          {(() => {
            if (column.type === 'قائمة' || column.type === 'LIST') {
              return (
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
                  {(column.options || []).map((opt: string) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              );
            }
            if (column.type === 'مربع اختيار' || column.type === 'CHECKBOX') {
              return (
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
              );
            }
            return <DateHeaderInputForColumn column={column} onFillColumn={onFillColumn} />;
          })()}
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
              <DateHeaderInputForColumn column={column} onFillColumn={onFillColumn} />
            )}
          </div>
        </th>
      )}
    </Draggable>
  );
};

// مكون خاص بحقل التاريخ في الهيدر مع حماية للجوال/الآيباد
const DateHeaderInputForColumn: React.FC<{ column: ColumnType, onFillColumn?: (id: string | number, value: any) => void }> = ({ column, onFillColumn }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [inputEnabled, setInputEnabled] = useState(false);
  const [value, setValue] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  // عند الموافقة
  const handleConfirm = () => {
    return (
      <Draggable draggableId={String(column.id)} index={index}>
        {(provided, snapshot) => (
          <th ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
            <React.Fragment>
              {/* تعميم القيم حسب نوع العمود */}
              {(() => {
                if (column.type === 'قائمة' || column.type === 'LIST') {
                  return (
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
                      {(column.options || []).map((opt: string) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  );
                }
                if (column.type === 'مربع اختيار' || column.type === 'CHECKBOX') {
                  return (
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
                  );
                }
                if (column.type === 'تاريخ' || column.type === 'DATE') {
                  return <DateHeaderInputForColumn column={column} onFillColumn={onFillColumn} />;
                }
                // رقم أو نص
                return (
                  <input
                    type={column.type === 'رقم' || column.type === 'NUMBER' ? 'number' : 'text'}
                    className="w-full mt-1 p-1 text-xs sm:text-sm text-center rounded bg-white text-slate-700 border border-slate-300 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="تعميم لكل العمود"
                    onChange={e => {
                      const target = e.target as HTMLInputElement;
                      let value: any = target.value;
                      if (column.type === 'رقم' || column.type === 'NUMBER') value = value === '' ? null : parseFloat(value);
                      onFillColumn && onFillColumn(column.id, value);
                    }}
                    style={{ fontSize: 10, minWidth: 0, maxWidth: 120 }}
                  />
                );
              })()}
            </React.Fragment>
          </th>
        )}
      </Draggable>
    );
  );
};
// مكون خاص بحقل التاريخ في الهيدر مع حماية للجوال/الآيباد
const DateHeaderInputForColumn: React.FC<{ column: ColumnType, onFillColumn?: (id: string | number, value: any) => void }> = ({ column, onFillColumn }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [inputEnabled, setInputEnabled] = useState(false);
  const [value, setValue] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  // عند الموافقة
  const handleConfirm = () => {
    setShowConfirm(false);
    setInputEnabled(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  // عند الإلغاء
  const handleCancel = () => {
    setShowConfirm(false);
    setInputEnabled(false);
  };

  // عند الضغط على الحقل في الجوال/الآيباد
  const handleTouch = (e: React.TouchEvent | React.MouseEvent) => {
    if (isMobileDevice() && !inputEnabled) {
      e.preventDefault();
      setShowConfirm(true);
    }
  };

  // عند تغيير القيمة
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    let v: any = e.target.value;
    if (column.type === 'رقم' || column.type === 'NUMBER') v = v === '' ? null : parseFloat(v);
    if (column.type === 'تاريخ' || column.type === 'DATE') v = v || null;
    onFillColumn && onFillColumn(column.id, v);
  };

  return (
    <>
      <input
        type={column.type === 'رقم' || column.type === 'NUMBER' ? 'number' : column.type === 'تاريخ' || column.type === 'DATE' ? 'date' : 'text'}
        className="w-full mt-1 p-1 text-xs sm:text-sm text-center rounded bg-white text-slate-700 border border-slate-300 focus:ring-emerald-500 focus:border-emerald-500"
        placeholder="تعميم لكل العمود"
        style={{ fontSize: 10, minWidth: 0, maxWidth: 120 }}
        ref={inputRef}
        readOnly={isMobileDevice() && !inputEnabled}
        onTouchStart={handleTouch}
        onMouseDown={handleTouch}
        value={value}
        onChange={handleChange}
      />
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
            )}
          </div>
        </th>
      )}
    </Draggable>
  );
};

interface DraggableColumnsProps {
  columns: ColumnType[];
  themeColor?: string;
  onEditColumn: (id: string | number) => void;
  onDeleteColumn: (id: string | number, name: string) => void;
  onFillColumn?: (id: string | number, value: any) => void;
  onColumnsReorder: (reorderedColumns: ColumnType[]) => void;
}

// وظائف خاصة بـ localStorage
const saveColumnOrder = (order: (string | number)[]) => {
  try {
    localStorage.setItem('columnOrder', JSON.stringify(order));
  } catch (error) {
    console.error('Error saving column order to localStorage:', error);
  }
};

const getColumnOrder = (): (string | number)[] => {
  try {
    const saved = localStorage.getItem('columnOrder');
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Error loading column order from localStorage:', error);
    return [];
  }
};

// إعادة ترتيب الأعمدة بناءً على الترتيب المحدد
const reorderItems = <T extends any>(list: T[], startIndex: number, endIndex: number): T[] => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

// المكون الرئيسي للأعمدة القابلة للسحب
const DraggableColumns: React.FC<DraggableColumnsProps> = ({
  columns,
  themeColor,
  onEditColumn,
  onDeleteColumn,
  onFillColumn,
  onColumnsReorder
}) => {
  // حالة لتخزين ترتيب الأعمدة الحالي
  const [orderedColumns, setOrderedColumns] = useState<ColumnType[]>(columns);

  // تحديث الحالة عند تغيير الأعمدة من الخارج
  React.useEffect(() => {
    setOrderedColumns(columns);
  }, [columns]);

  // معالجة انتهاء السحب
  const handleDragEnd = useCallback((result: any) => {
    // تجاهل إذا تم الإفلات خارج المنطقة المسموح بها
    if (!result.destination) return;

    // تجاهل إذا لم يتغير الموقع
    if (result.destination.index === result.source.index) return;

    // إعادة ترتيب الأعمدة
    const reordered = reorderItems(
      orderedColumns,
      result.source.index,
      result.destination.index
    );

    // تحديث الحالة المحلية
    setOrderedColumns(reordered);

    // تحديث الحالة في المكون الأب
    onColumnsReorder(reordered);

    // حفظ الترتيب الجديد في localStorage
    saveColumnOrder(reordered.map(col => col.id));
  }, [orderedColumns, onColumnsReorder]);

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="columns" direction="horizontal">
        {(provided) => (
          <tr 
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="columns-header-row"
          >
            {orderedColumns.map((column, index) => (
              <TableColumnHeader
                key={String(column.id)}
                column={column}
                index={index}
                themeColor={themeColor}
                onEditColumn={onEditColumn}
                onDeleteColumn={onDeleteColumn}
                onFillColumn={onFillColumn}
              />
            ))}
            {provided.placeholder}
          </tr>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default DraggableColumns;
