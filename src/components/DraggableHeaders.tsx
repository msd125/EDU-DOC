import React from 'react';
import DateHeaderInput from './DateHeaderInput';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { getContrastColor } from './StudentTable';

interface ColumnType {
  id: string | number;
  name: string;
  type?: string;
  options?: string[];
}

interface DraggableHeadersProps {
  columns: ColumnType[];
  themeColor?: string;
  onEditColumn: (col: ColumnType) => void;
  onDeleteColumn: (id: string | number, name: string) => void;
  onDragEnd: (result: any) => void;
}

const DraggableHeaders: React.FC<DraggableHeadersProps> = ({ 
  columns, 
  themeColor, 
  onEditColumn, 
  onDeleteColumn, 
  onDragEnd 
}) => {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="columns" direction="horizontal">
        {(provided) => (
          <tr 
            ref={provided.innerRef} 
            {...provided.droppableProps}
            className="drag-headers-row"
          >
            {columns.map((col, index) => (
              <Draggable key={String(col.id)} draggableId={String(col.id)} index={index}>
                {(provided, snapshot) => (
                  <th 
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`px-1 sm:px-2 py-2 min-w-[80px] md:min-w-[120px] max-w-[180px] text-center align-top border-slate-200 border-l last:border-l-0 group relative text-xs font-bold ${snapshot.isDragging ? 'opacity-75 shadow-lg z-50 !bg-emerald-100' : ''}`}
                    style={{ 
                      ...provided.draggableProps.style,
                      fontFamily: 'Noto Sans Arabic, sans-serif', 
                      overflow: 'hidden', 
                      textOverflow: 'ellipsis', 
                      whiteSpace: 'nowrap', 
                      color: getContrastColor(themeColor),
                      cursor: 'grab'
                    }}
                  >
                    <div className="flex flex-col items-center gap-0.5 w-full">
                      <span className="font-semibold text-xs break-words w-full" title={col.name} style={{ color: getContrastColor(themeColor) }}>{col.name}</span>
                      
                      {/* قائمة أزرار التحكم في العمود */}
                      <div className="flex gap-4 justify-center items-center mt-1">
                        <button
                          className="inline-flex items-center justify-center ms-1 text-lg opacity-90 transition-all duration-150 p-2 rounded-full icon-hover"
                          title="تعديل اسم العمود"
                          aria-label="تعديل اسم العمود"
                          onClick={() => onEditColumn(col)}
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
                          onClick={() => onDeleteColumn(col.id, col.name)}
                          style={{ verticalAlign: 'middle', minWidth: 36, minHeight: 36, color: getContrastColor(themeColor), background: 'transparent' }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                          </svg>
                        </button>
                      </div>
                      
                      {/* تعميم القيم حسب نوع العمود */}
                      {col.type === 'قائمة' || col.type === 'LIST' ? (
                        <select
                          className="w-full mt-1 p-1 text-xs text-center rounded bg-white text-slate-700 border border-slate-300 focus:ring-emerald-500 focus:border-emerald-500"
                          defaultValue=""
                          style={{ fontSize: 10, minWidth: 0, maxWidth: 120 }}
                        >
                          <option value="">تعميم لكل العمود...</option>
                          <option value="__empty__">بدون قيمة (تفريغ)</option>
                          {(col.options || []).map((opt: string) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      ) : col.type === 'مربع اختيار' || col.type === 'CHECKBOX' ? (
                        <div className="flex gap-1 mt-1 justify-center items-center">
                          <input
                            type="checkbox"
                            title="تعميم تفعيل/إلغاء الكل"
                            className="w-5 h-5 sm:w-6 sm:h-6 accent-emerald-600"
                          />
                          <button
                            type="button"
                            className="text-xs text-slate-400 hover:text-red-500 border px-1 rounded ml-1"
                            title="تفريغ الكل"
                          >تفريغ</button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1">
                          <DateHeaderInput col={col} />
                        </div>
                      )}
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
  );
};

export default DraggableHeaders;
