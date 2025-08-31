import React, { useState, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { getContrastColor } from '../utils/colorUtils';

// تعريف أنواع البيانات
interface ColumnType {
  id: string | number;
  name: string;
  type?: string;
  options?: string[];
}

interface TableColumnHeaderProps {
  column: ColumnType;
  index: number;
  themeColor?: string;
  onEditColumn: (id: string | number) => void;
  onDeleteColumn: (id: string | number, name: string) => void;
  onFillColumn?: (id: string | number, value: any) => void;
}

// مكون لعنوان العمود القابل للسحب
const TableColumnHeader: React.FC<TableColumnHeaderProps> = ({
  column,
  index,
  themeColor,
  onEditColumn,
  onDeleteColumn,
  onFillColumn
}) => {
  return (
    <Draggable draggableId={String(column.id)} index={index}>
      {(provided, snapshot) => (
        <th 
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`px-1 sm:px-2 py-2 min-w-[80px] md:min-w-[120px] max-w-[180px] text-center align-top border-slate-200 border-l last:border-l-0 group relative text-xs font-bold ${
            snapshot.isDragging ? 'opacity-80 shadow-xl !bg-green-50' : ''
          }`}
          style={{
            ...provided.draggableProps.style,
            fontFamily: 'Noto Sans Arabic, sans-serif',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            color: getContrastColor(themeColor)
          }}
        >
          <div className="flex flex-col items-center gap-0.5 w-full">
            <div className="flex items-center justify-center mb-1">
              <span className="font-semibold text-xs break-words w-full" title={column.name}>
                {column.name}
              </span>
              {/* أيقونة صغيرة تشير إلى إمكانية السحب */}
              <span className="cursor-grab ml-1 opacity-40 hover:opacity-100" title="اسحب لتغيير موقع العمود">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              </span>
            </div>

            <div className="flex gap-4 justify-center items-center mt-1">
              <button
                className="inline-flex items-center justify-center ms-1 text-lg opacity-90 transition-all duration-150 p-2 rounded-full icon-hover"
                title="تعديل اسم العمود"
                aria-label="تعديل اسم العمود"
                onClick={() => onEditColumn(column.id)}
                style={{ verticalAlign: 'middle', minWidth: 36, minHeight: 36, color: getContrastColor(themeColor), background: 'transparent' }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                </svg>
              </button>
              <button
                className="inline-flex items-center justify-center ms-1 text-lg opacity-90 transition-all duration-150 p-2 rounded-full icon-hover"
                title="حذف العمود"
                aria-label="حذف العمود"
                onClick={() => onDeleteColumn(column.id, column.name)}
                style={{ verticalAlign: 'middle', minWidth: 36, minHeight: 36, color: getContrastColor(themeColor), background: 'transparent' }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
              </button>
            </div>

            {/* تعميم القيم حسب نوع العمود */}
            {column.type === 'قائمة' || column.type === 'LIST' ? (
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
            ) : column.type === 'مربع اختيار' || column.type === 'CHECKBOX' ? (
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
            ) : (
              <div className="flex items-center gap-1">
                <input
                  type={column.type === 'رقم' || column.type === 'NUMBER' ? 'number' : column.type === 'تاريخ' || column.type === 'DATE' ? 'date' : 'text'}
                  className="w-full mt-1 p-1 text-xs sm:text-sm text-center rounded bg-white text-slate-700 border border-slate-300 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="تعميم لكل العمود"
                  onChange={e => {
                    const target = e.target as HTMLInputElement;
                    let value: any = target.value;
                    if (column.type === 'رقم' || column.type === 'NUMBER') value = value === '' ? null : parseFloat(value);
                    if (column.type === 'تاريخ' || column.type === 'DATE') value = value || null;
                    onFillColumn && onFillColumn(column.id, value);
                  }}
                  style={{ fontSize: 10, minWidth: 0, maxWidth: 120 }}
                />
              </div>
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
