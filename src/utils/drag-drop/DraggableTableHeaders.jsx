import React, { useState, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { saveColumnOrder, getColumnOrder, orderColumns, resetColumnOrder } from '../columnOrder';

// نوع ثابت للسحب والإفلات
const COLUMN_TYPE = 'TABLE_COLUMN';

/**
 * مكون رأس العمود القابل للسحب
 */
const DraggableColumnHeader = ({ column, index, moveColumn, children, onEditColumn, onDeleteColumn }) => {
  const [{ isDragging }, dragRef] = useDrag({
    type: COLUMN_TYPE,
    item: { id: column.id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, dropRef] = useDrop({
    accept: COLUMN_TYPE,
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveColumn(draggedItem.index, index);
        // تحديث المؤشر المسحوب لضمان انتقالات سلسة
        draggedItem.index = index;
      }
    },
  });

  // دمج المراجع للسحب والإفلات
  const ref = (element) => {
    dragRef(element);
    dropRef(element);
  };

  return (
    <th 
      ref={ref}
      style={{ 
        opacity: isDragging ? 0.5 : 1,
        cursor: 'grab',
        border: isDragging ? '1px dashed #aaa' : '',
        position: 'relative',
      }}
      className="drag-column-header px-1 sm:px-2 py-2 min-w-[80px] md:min-w-[120px] max-w-[180px] text-center align-top border-slate-200 border-l last:border-l-0 group relative text-xs font-bold"
    >
      {children}
    </th>
  );
};

/**
 * مكون للتعامل مع أعمدة الجدول القابلة للسحب
 */
export const DraggableTableHeaders = ({ 
  columns, 
  onColumnOrderChange, 
  onEditColumn, 
  onDeleteColumn,
  renderColumnContent 
}) => {
  // حالة للأعمدة المرتبة
  const [orderedColumns, setOrderedColumns] = useState(() => {
    const savedOrder = getColumnOrder();
    return orderColumns(columns, savedOrder);
  });

  // تحديث عندما تتغير الأعمدة الخارجية
  useEffect(() => {
    const savedOrder = getColumnOrder();
    setOrderedColumns(orderColumns(columns, savedOrder));
  }, [columns]);

  // دالة لتحريك عمود
  const moveColumn = (dragIndex, hoverIndex) => {
    const draggedColumn = orderedColumns[dragIndex];
    const newOrderedColumns = [...orderedColumns];
    
    // إزالة العنصر المسحوب
    newOrderedColumns.splice(dragIndex, 1);
    
    // إدراج العنصر في الموضع الجديد
    newOrderedColumns.splice(hoverIndex, 0, draggedColumn);
    
    // تحديث الحالة
    setOrderedColumns(newOrderedColumns);
    
    // حفظ الترتيب الجديد
    saveColumnOrder(newOrderedColumns.map(col => col.id));
    
    // إشعار المكون الأب
    if (onColumnOrderChange) {
      onColumnOrderChange(newOrderedColumns);
    }
  };

  // دالة لإعادة تعيين الترتيب إلى الوضع الافتراضي
  const handleResetOrder = () => {
    resetColumnOrder();
    setOrderedColumns([...columns]);
    
    if (onColumnOrderChange) {
      onColumnOrderChange([...columns]);
    }
  };

  return (
    <>
      {orderedColumns.map((column, index) => (
        <DraggableColumnHeader 
          key={column.id} 
          column={column} 
          index={index} 
          moveColumn={moveColumn}
          onEditColumn={onEditColumn}
          onDeleteColumn={onDeleteColumn}
        >
          {renderColumnContent ? renderColumnContent(column, index) : column.name}
        </DraggableColumnHeader>
      ))}
    </>
  );
};

/**
 * مكون الواجهة الرئيسي لأعمدة الجدول القابلة للسحب
 */
export const DraggableTableHeadersProvider = (props) => {
  return (
    <DndProvider backend={HTML5Backend}>
      <DraggableTableHeaders {...props} />
    </DndProvider>
  );
};
