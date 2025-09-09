import React, { useState, useRef } from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { format } from 'date-fns';
import ConfirmModal from './ConfirmModal';
import { Column, ColumnType } from '../types';

function isMobileOrTablet() {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent;
  // فقط الجوالات والآيباد الحقيقية
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
  const isDateType = column.type === ColumnType.DATE || column.type === 'تاريخ';
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
          {isDateType ? (
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